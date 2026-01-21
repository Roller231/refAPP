import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Referral } from '../database/entities/referral.entity';
import {
  Transaction,
  TransactionType,
} from '../database/entities/transaction.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Referral)
    private readonly referralsRepository: Repository<Referral>,
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async findByTelegramId(telegramId: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { telegramId },
    });
  }
  async getAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }
  async setRegion(telegramId: string, region: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { telegramId },
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // 🔒 фиксируем регион только если он ещё не выбран
    if (!user.region) {
      user.region = region;
      return this.usersRepository.save(user);
    }
  
    return user;
  }
  
  async findOrCreateByTelegramId(
    telegramId: string,
    username?: string,
    region?: string,
  ): Promise<User> {
  
    const existing = await this.findByTelegramId(telegramId);
    if (existing) {
      if (username && username.trim() && existing.username !== username) {
        existing.username = username;
        return this.usersRepository.save(existing);
      }
      return existing;
    }

    const resolvedUsername = (username && username.trim()) || `user_${telegramId}`;
    const user = this.usersRepository.create({
      telegramId,
      username: resolvedUsername,
      region: region ?? null,
      referralCode: await this.generateReferralCode(),
    });
    
    return this.usersRepository.save(user);
  }

  async getOrGenerateReferralCode(telegramId: string): Promise<string> {
    const user = await this.findOrCreateByTelegramId(telegramId);
    if (user.referralCode) {
      return user.referralCode;
    }

    user.referralCode = await this.generateReferralCode();
    await this.usersRepository.save(user);
    return user.referralCode;
  }

  async registerByReferralCode(
    telegramId: string,
    referralCode: string,
    username?: string,
  ): Promise<User> {
    const inviter = await this.usersRepository.findOne({
      where: { referralCode },
    });
    if (!inviter) {
      throw new NotFoundException('Referral code not found');
    }

    const invited =
      (await this.findByTelegramId(telegramId)) ??
      (await this.findOrCreateByTelegramId(telegramId, username));

    if (inviter.id === invited.id) {
      throw new BadRequestException('Cannot refer yourself');
    }

    const alreadyReferred = await this.referralsRepository.exists({
      where: { invited: { id: invited.id } },
    });
    if (alreadyReferred) {
      throw new BadRequestException('Referral already linked');
    }

    const referral = this.referralsRepository.create({
      inviter,
      invited,
    });
    await this.referralsRepository.save(referral);

    const level1Bonus = await this.applyReferralBonus(inviter);
    await this.applySecondLevelBonus(inviter, level1Bonus);
        return invited;
  }

  async getBalance(telegramId: string): Promise<string | null> {
    const user = await this.usersRepository.findOne({
      where: { telegramId },
      select: ['id', 'balance', 'telegramId'],
    });

    return user?.balance ?? null;
  }

  async exists(telegramId: string): Promise<boolean> {
    return this.usersRepository.exists({
      where: { telegramId },
    });
  }

  async transferBalance(
    fromTelegramId: string,
    toUsername: string,
    amountRaw: number,
  ): Promise<void> {
    if (!toUsername || !toUsername.trim()) {
      throw new BadRequestException('Recipient username is required');
    }

    const normalizedUsername = toUsername.trim().replace(/^@/, '');
  
    if (!Number.isFinite(amountRaw) || amountRaw <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }
  
    await this.dataSource.transaction(async (manager) => {
      // 1️⃣ Отправитель (по telegramId)
      const fromUser = await manager.findOne(User, {
        where: { telegramId: fromTelegramId },
        lock: { mode: 'pessimistic_write' },
      });
  
      if (!fromUser) {
        throw new NotFoundException('Sender not found');
      }
  
      // 2️⃣ Получатель (по username)
      const toUser = await manager.findOne(User, {
        where: { username: normalizedUsername  },
        lock: { mode: 'pessimistic_write' },
      });
  
      if (!toUser) {
        throw new NotFoundException('Recipient not found');
      }
  
      if (fromUser.id === toUser.id) {
        throw new BadRequestException('Cannot transfer to yourself');
      }
  

  
      // 4️⃣ Проверка баланса
      const fromBalance = Number.parseFloat(fromUser.balance ?? '0');
      if (!Number.isFinite(fromBalance) || fromBalance < amountRaw) {
        throw new BadRequestException('Insufficient balance');
      }
  
      const toBalance = Number.parseFloat(toUser.balance ?? '0');
  
      fromUser.balance = (fromBalance - amountRaw).toFixed(2);
      toUser.balance = (toBalance + amountRaw).toFixed(2);
  
      // 5️⃣ Сохраняем
      await manager.save([fromUser, toUser]);
  
      await manager.save(
        manager.create(Transaction, {
          fromUser,
          toUser,
          amount: amountRaw.toFixed(2),
          type: TransactionType.Transfer,
        }),
      );
    });
  }
  

  private async generateReferralCode(): Promise<string> {
    const length = 8;
    const maxAttempts = 5;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const code = Math.random().toString(36).slice(2, 2 + length).toUpperCase();
      if (code.length < length) {
        continue;
      }

      const exists = await this.usersRepository.exists({
        where: { referralCode: code },
      });
      if (!exists) {
        return code;
      }
    }

    throw new Error('Unable to generate unique referral code');
  }

  private async applySecondLevelBonus(
    directInviter: User,
    level1Bonus: number,
  ): Promise<void> {
    // ищем, кто пригласил directInviter
    const parentReferral = await this.referralsRepository.findOne({
      where: { invited: { id: directInviter.id } },
      relations: ['inviter'],
    });
  
    if (!parentReferral?.inviter) return;
  
    const percentRaw = this.configService.get<string>(
      'REFERRAL_BONUS_LEVEL2_PERCENT',
      '10',
    );
    const percent = Number.parseFloat(percentRaw);
    if (!Number.isFinite(percent) || percent <= 0) return;
  
    const bonus = (level1Bonus * percent) / 100;
  
    const parent = parentReferral.inviter;
    const currentBalance = Number.parseFloat(parent.balance ?? '0');
    parent.balance = (currentBalance + bonus).toFixed(2);
  
    await this.usersRepository.save(parent);
    await this.transactionsRepository.save(
      this.transactionsRepository.create({
        fromUser: null,
        toUser: parent,
        amount: bonus.toFixed(2),
        type: TransactionType.ReferralReward,
      }),
    );
  }
  

  private async applyReferralBonus(inviter: User): Promise<number> {
    const bonusRaw = this.configService.get<string>('REFERRAL_BONUS_LEVEL1', '1');
    const bonus = Number.parseFloat(bonusRaw);
    if (!Number.isFinite(bonus) || bonus <= 0) {
      return 0;
    }
  
    const currentBalance = Number.parseFloat(inviter.balance ?? '0');
    inviter.balance = (currentBalance + bonus).toFixed(2);
  
    await this.usersRepository.save(inviter);
    await this.transactionsRepository.save(
      this.transactionsRepository.create({
        fromUser: null,
        toUser: inviter,
        amount: bonus.toFixed(2),
        type: TransactionType.ReferralReward,
      }),
    );
  
    return bonus;
  }
  
}

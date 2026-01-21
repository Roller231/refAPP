import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral } from '../database/entities/referral.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class ReferralsService {
  constructor(
    @InjectRepository(Referral)
    private readonly referralsRepository: Repository<Referral>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getMyReferrals(telegramId: string): Promise<Referral[]> {
    const inviter = await this.usersRepository.findOne({
      where: { telegramId },
    });
    if (!inviter) {
      throw new NotFoundException('User not found');
    }

    return this.referralsRepository.find({
      where: { inviter: { id: inviter.id } },
      relations: ['invited'],
      order: { createdAt: 'DESC' },
    });
  }
}

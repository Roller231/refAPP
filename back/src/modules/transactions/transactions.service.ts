import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../database/entities/transaction.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getHistory(telegramId: string): Promise<Transaction[]> {
    const user = await this.usersRepository.findOne({
      where: { telegramId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.transactionsRepository.find({
      where: [{ fromUser: { id: user.id } }, { toUser: { id: user.id } }],
      relations: ['fromUser', 'toUser'],
      order: { createdAt: 'DESC' },
    });
  }
}

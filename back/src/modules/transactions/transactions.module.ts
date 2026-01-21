import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../database/entities/transaction.entity';
import { User } from '../database/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User]), UsersModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}

import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { ApiHeader, ApiQuery } from '@nestjs/swagger';
import { Transaction } from '../database/entities/transaction.entity';
import { TelegramIdDto } from '../users/dto/telegram-id.dto';
import { UsersService } from '../users/users.service';
import { TransferDto } from './dto/transfer.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Post('transfer')
  async transfer(
    @Body() body: TransferDto,
  ): Promise<{ ok: true }> {
    await this.usersService.transferBalance(
      body.fromTelegramId,
      body.toUsername, // ✅
      body.amount,
    );
  
    return { ok: true };
  }
  

  @Get('history')
  @ApiQuery({ name: 'telegramId', type: String, required: true, example: '123456789' })
  getHistory(@Query() query: TelegramIdDto): Promise<Transaction[]> {
    return this.transactionsService.getHistory(query.telegramId);
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './modules/database/database.module';
import { LoggerModule } from './modules/logger/logger.module';
import { ReferralsModule } from './modules/referrals/referrals.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UsersModule } from './modules/users/users.module';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { BotModule } from './modules/bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    LoggerModule,
    DatabaseModule,
    UsersModule,
    ReferralsModule,
    TransactionsModule,
    BotModule, // ← ВАЖНО
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: ApiKeyGuard,
  //   },
  // ],
})
export class AppModule {}

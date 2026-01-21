// bot.module.ts
import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from './bot.update';

const BOT_TOKEN = process.env.TG_BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error('TG_BOT_TOKEN is not defined');
}

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: BOT_TOKEN,
    }),
  ],
  providers: [BotUpdate],
})
export class BotModule {}

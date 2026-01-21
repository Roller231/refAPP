import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Referral } from '../database/entities/referral.entity';
import { TelegramIdDto } from '../users/dto/telegram-id.dto';
import { UsersService } from '../users/users.service';
import { ApplyReferralDto } from './dto/apply-referral.dto';
import { ReferralsService } from './referrals.service';

@Controller('referrals')
export class ReferralsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly referralsService: ReferralsService,
  ) {}

  @Post('apply')
  apply(@Body() body: ApplyReferralDto) {
    return this.usersService.registerByReferralCode(
      body.telegramId,
      body.code,
      body.username,
    );
  }

  @Get('my')
  @ApiQuery({ name: 'telegramId', type: String, required: true, example: '123456789' })
  getMy(@Query() query: TelegramIdDto): Promise<Referral[]> {
    return this.referralsService.getMyReferrals(query.telegramId);
  }
}

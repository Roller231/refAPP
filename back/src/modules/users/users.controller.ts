import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';

import { ApiBody, ApiParam } from '@nestjs/swagger';
import { User } from '../database/entities/user.entity';
import { UsersService } from './users.service';

type CreateUserBody = {
  username?: string;
  region?: string;
};


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Get()
  async getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }
  
  @Patch('telegram/:telegramId/region')
async setRegion(
  @Param('telegramId') telegramId: string,
  @Body() body: { region: string },
): Promise<User> {
  return this.usersService.setRegion(telegramId, body.region);
}


  @Post('telegram/:telegramId')
  @ApiParam({ name: 'telegramId', type: String, example: '123456789' })
  @ApiBody({
    required: false,
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'alice' },
      },
    },
  })
  createOrGet(
    @Param('telegramId') telegramId: string,
    @Body() body: CreateUserBody,
  ): Promise<User> {
    return this.usersService.findOrCreateByTelegramId(
      telegramId,
      body?.username,
      body?.region,
    );
      }

  @Get('telegram/:telegramId')
  @ApiParam({ name: 'telegramId', type: String, example: '123456789' })
  getProfile(@Param('telegramId') telegramId: string): Promise<User | null> {
    return this.usersService.findByTelegramId(telegramId);
  }

  @Get('telegram/:telegramId/balance')
  @ApiParam({ name: 'telegramId', type: String, example: '123456789' })
  async getBalance(
    @Param('telegramId') telegramId: string,
  ): Promise<{ balance: string | null }> {
    const balance = await this.usersService.getBalance(telegramId);
    return { balance };
  }

  @Get('telegram/:telegramId/exists')
  @ApiParam({ name: 'telegramId', type: String, example: '123456789' })
  async exists(
    @Param('telegramId') telegramId: string,
  ): Promise<{ exists: boolean }> {
    const exists = await this.usersService.exists(telegramId);
    return { exists };
  }

  @Get('telegram/:telegramId/referral-code')
  @ApiParam({ name: 'telegramId', type: String, example: '123456789' })
  async getReferralCode(
    @Param('telegramId') telegramId: string,
  ): Promise<{ referralCode: string }> {
    const referralCode = await this.usersService.getOrGenerateReferralCode(
      telegramId,
    );
    return { referralCode };
  }
}

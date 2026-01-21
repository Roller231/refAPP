import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Referral } from '../database/entities/referral.entity';
import { User } from '../database/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { ReferralsController } from './referrals.controller';
import { ReferralsService } from './referrals.service';

@Module({
  imports: [TypeOrmModule.forFeature([Referral, User]), UsersModule],
  controllers: [ReferralsController],
  providers: [ReferralsService],
})
export class ReferralsModule {}

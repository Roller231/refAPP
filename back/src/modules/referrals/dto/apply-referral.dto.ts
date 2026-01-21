import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ApplyReferralDto {
  @ApiProperty({ example: '123456789' })
  @IsString()
  @IsNotEmpty()
  telegramId: string;

  @ApiProperty({ example: 'AB12CD34' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  code: string;

  @ApiProperty({ example: 'alice', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  username?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class TransferDto {
  @ApiProperty({ example: '123456789' })
  @IsString()
  @IsNotEmpty()
  fromTelegramId: string;

  @ApiProperty({ example: '@alice' })
  @IsString()
  @IsNotEmpty()
  toUsername: string; // ✅ ВАЖНО

  @ApiProperty({ example: 10.5 })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  amount: number;
}

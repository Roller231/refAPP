import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TelegramIdDto {
  @ApiProperty({ example: '123456789' })
  @IsString()
  @IsNotEmpty()
  telegramId: string;
}

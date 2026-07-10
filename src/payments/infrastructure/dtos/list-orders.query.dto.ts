import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ListOrdersQueryDto {
  @ApiProperty({ example: 'kenji@example.com' })
  @IsEmail()
  email: string;
}

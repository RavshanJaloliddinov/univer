import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'admin@example.com', description: 'Admin email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Ravshan Jaloliddinov', description: 'Admin name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'StrongPass123', description: 'Admin password' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
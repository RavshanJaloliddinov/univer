import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVacancyDto {
  @ApiProperty({ example: 'Backend Developer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'NestJS va PostgreSQL bilan ishlay oladigan dasturchi kerak' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Toshkent, Uzbekistan' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 'uploads/vacancy1.jpg' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: '2 yil tajriba' })
  @IsString()
  @IsOptional()
  experience: string;

  @ApiProperty({ example: 'TypeScript, NestJS, PostgreSQL' })
  @IsString()
  @IsOptional()
  requirement: string;
}
export class UserDto {

  @IsNotEmpty()
  @IsUUID()
  id: string; 

  @IsNotEmpty()
  @IsString()
  role: string; 

  @IsNotEmpty()
  @IsEmail()
  email: string
}
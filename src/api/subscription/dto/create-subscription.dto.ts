import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { Gender } from 'src/entity/subscription.entity';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 'Ali Karimov' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '25', required: false })
  @IsString()
  @IsOptional()
  age?: string;

  @ApiProperty({ example: 'male', enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 'uploads/resume_ali.pdf', required: false })
  @IsOptional()
  @IsString()
  resume_file?: string;

  @ApiProperty({ example: '+998901112233' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'jaloliddinov009@gmail.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Backend yo‘nalishi', required: false })
  @IsString()
  @IsOptional()
  major?: string;

  @ApiProperty({
    example: 'b2a1f39e-6b6f-4f0f-bd2d-8d2d0f87e1e9',
    description: 'Vakansiya ID',
  })
  @IsUUID()
  @IsNotEmpty()
  vacansy_id: string;

  @IsString()
  @IsNotEmpty()
  captcha: string;
}

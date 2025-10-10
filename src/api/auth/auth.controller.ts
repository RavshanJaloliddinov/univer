// src/api/auth/auth.controller.ts
import { Body, Controller, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { CurrentUser } from 'src/common/decorator/current-user';
import { Public } from 'src/common/decorator/public';
import { LoginDto } from './dto/login.dto';
import { Admin } from 'src/entity/admin.entity';

@ApiTags('Auth')
@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register/admin')
  @ApiOperation({ summary: 'Adminni ro‘yxatdan o‘tkazish' })
  @ApiResponse({ status: 201, description: 'Admin muvaffaqiyatli ro‘yxatdan o‘tdi' })
  @ApiResponse({ status: 400, description: 'Bunday email allaqachon mavjud' })
  async register(@Body() dto: CreateAdminDto) {
    return this.authService.register(dto);
  }

  @Post('login/admin')
  @ApiOperation({ summary: 'Admin login qilish' })
  @ApiResponse({ status: 200, description: 'Login muvaffaqiyatli amalga oshirildi (token qaytaradi)' })
  @ApiResponse({ status: 401, description: 'Email yoki parol noto‘g‘ri' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Put('update-password')
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Parolni yangilash' })
  @ApiResponse({ status: 200, description: 'Parol muvaffaqiyatli yangilandi' })
  @ApiResponse({ status: 400, description: 'Eski parol noto‘g‘ri' })
  async updatePassword(
    @Body() body: { oldPass: string; newPass: string },
    @CurrentUser() admin: Admin,
  ) {
    return this.authService.updatePassword(admin.email, body.oldPass, body.newPass);
  }

  @Post('forget-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Parolni tiklash' })
  @ApiResponse({ status: 200, description: 'Parol tiklash jarayoni boshlandi (emailga yuboriladi)' })
  async forgetPassword(
    @CurrentUser() admin: Admin,
  ) {
    return this.authService.forgetPassword(admin.email);
  }
}

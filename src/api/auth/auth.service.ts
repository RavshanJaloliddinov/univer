// src/api/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { createTransport } from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'src/config';
import { AdminService } from '../admin/admin.service';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { UserRoles } from 'src/common/database/Enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) { }
  private otps = new Map<string, { code: string; expiresAt: number }>();

  async register(dto: CreateAdminDto) {
    const existAdmin = await this.adminService.findOne(dto.email);
    if (existAdmin) {
      throw new BadRequestException('Bunday email allaqachon mavjud');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    return this.adminService.create({ ...dto, password: hashed });
  }


  async login(email: string, password: string) {
    const admin = (await this.adminService.findOne(email)).data;
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { id: admin.id, email: admin.email, role: UserRoles.ADMIN };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  async updatePassword(email: string, oldPass: string, newPass: string) {
    const admin = (await this.adminService.findOne(email)).data;
    const isMatch = await bcrypt.compare(oldPass, admin.password);
    if (!isMatch) throw new UnauthorizedException('Old password is incorrect');

    admin.password = await bcrypt.hash(newPass, 10);
    return this.adminService['adminRepo'].save(admin);
  }

  async forgetPassword(email: string) {
    const admin = (await this.adminService.findOne(email)).data;
    if (!admin) throw new NotFoundException('Admin not found');

    // TODO: reset token yoki OTP yuborish (masalan, mail orqali)
    const resetToken = this.jwtService.sign(
      { email: admin.email },
      { secret: config.ACCESS_TOKEN_SECRET_KEY, expiresIn: '15m' },
    );

    return { resetToken };
  }



    
  // ✅ OTP yuborish
  async sendOtp(email: string) {
    if (!email) throw new BadRequestException('Email kiritilishi kerak');

    const otp = randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 daqiqa amal qiladi

    // Xotirada saqlaymiz
    this.otps.set(email, { code: otp, expiresAt });

    // 5 daqiqa o‘tib avtomatik o‘chadi
    setTimeout(() => this.otps.delete(email), 5 * 60 * 1000);

    // 📧 Email yuborish
    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: config.EMAIL,
        pass: config.EMAIL_PASSWORD,
      },
    });
    
    await transporter.sendMail({
      from: `"Support" <${config.EMAIL}>`,
      to: email,
      subject: 'Tasdiqlash kodi (OTP)',
      html: `<h2>Sizning OTP kodingiz: <b>${otp}</b></h2><p>Bu kod 5 daqiqa davomida amal qiladi.</p>`,
    });

    return {
      message: 'OTP yuborildi',
      expiresIn: '5 daqiqa',
    };
  }

  // ✅ OTP tekshirish
  async verifyOtp(email: string, otp: string) {
    const record = this.otps.get(email);
    if (!record) throw new UnauthorizedException('OTP topilmadi yoki muddati tugagan');
    if (record.expiresAt < Date.now()) {
      this.otps.delete(email);
      throw new UnauthorizedException('OTP muddati tugagan');
    }
    if (record.code !== otp) throw new UnauthorizedException('Noto‘g‘ri OTP');

    // 🔐 Token yaratish (admin login’dagi format bilan bir xil)
    const payload = {
      id: uuidv4(), // foydalanuvchi DBda yo‘q, shuning uchun vaqtinchalik UUID
      email,
      role: UserRoles.USER, // yoki alohida UserRoles bo‘lsa, shundan foydalaning
    };

    const token = this.jwtService.sign(payload, {
      secret: config.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: '1d',
    });

    // OTP’ni o‘chiramiz
    this.otps.delete(email);

    return {
      access_token: token,
      message: 'OTP to‘g‘ri, token berildi',
    };
  }
}

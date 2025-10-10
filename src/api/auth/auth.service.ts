// src/api/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminService } from '../admin/admin.service';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { config } from 'src/config';
import { AdminRoles } from 'src/common/database/Enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) { }

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

    const payload = { id: admin.id, email: admin.email, role: AdminRoles.ADMIN };
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
}

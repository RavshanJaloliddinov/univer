// src/api/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { config } from 'src/config';
import { JwtStrategy } from 'src/common/users/AuthStrategy';
import { Admin } from 'src/entity/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    JwtModule.register({
      secret: config.ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: config.ACCESS_TOKEN_EXPIRED_TIME },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AdminService, JwtStrategy],
})
export class AuthModule {}

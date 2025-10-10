import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcrypt';
import { Admin } from 'src/entity/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {}

  async create(dto: CreateAdminDto) {

    const exist = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (exist) {
      throw new BadRequestException('Email already exists');
    }
    const admin = this.adminRepo.create(dto);
    const hashPass = await bcrypt.hash(dto.password, 10);
    const savedAdmin = await this.adminRepo.save({ ...admin, password: hashPass });

    return {
      statusCode: HttpStatus.CREATED,
      data: savedAdmin,
      message: 'Admin created successfully',
    };
  }

  async findAll() {
    const admins = await this.adminRepo.find();
    return {
      statusCode: HttpStatus.OK,
      data: admins,
      message: 'Admins fetched successfully',
    };
  }

  async findOne(email: string) {
    const admin = await this.adminRepo.findOne({ where: { email } });
    if (!admin) throw new NotFoundException('Admin not found');

    return {
      statusCode: HttpStatus.OK,
      data: admin,
      message: 'Admin fetched successfully',
    };
  }

  async update(email: string, dto: UpdateAdminDto) {
    const admin = await this.adminRepo.findOne({ where: { email } });
    if (!admin) throw new NotFoundException('Admin not found');

    Object.assign(admin, dto);
    const savedAdmin = await this.adminRepo.save(admin);

    return {
      statusCode: HttpStatus.OK,
      data: savedAdmin,
      message: 'Admin updated successfully',
    };
  }

  async remove(email: string) {
    const admin = await this.adminRepo.findOne({ where: { email } });
    if (!admin) throw new NotFoundException('Admin not found');

    await this.adminRepo.remove(admin);
    return {
      statusCode: HttpStatus.OK,
      data: null,
      message: 'Admin deleted successfully',
    };
  }
}

import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { RolesDecorator } from 'src/common/roles/RolesDecorator';
import { UserRoles } from 'src/common/database/Enum';
import { RolesGuard } from 'src/common/roles/RoleGuard';

@ApiTags('Admin')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@RolesDecorator(UserRoles.SUPER_ADMIN)
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Create Admin' })
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Admins' })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':email')
  @ApiOperation({ summary: 'Get Admin by Email' })
  findOne(@Param('email') email: string) {
    return this.adminService.findOne(email);
  }

  @Put(':email')
  @ApiOperation({ summary: 'Update Admin by Email' })
  update(@Param('email') email: string, @Body() dto: UpdateAdminDto) {
    return this.adminService.update(email, dto);
  }

  @Delete(':email')
  @ApiOperation({ summary: 'Delete Admin by Email' })
  remove(@Param('email') email: string) {
    return this.adminService.remove(email);
  }
}

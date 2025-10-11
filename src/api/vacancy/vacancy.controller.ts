import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VacancyService } from './vacancy.service';
import { CreateVacancyDto, UserDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { Public } from 'src/common/decorator/public';
import { CurrentUser } from 'src/common/decorator/current-user';

@ApiTags('Vacancies')
@Controller('vacancies')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Yangi vakansiya yaratish' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Vakansiya yaratildi' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(
    @Body() dto: CreateVacancyDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.vacancyService.create(dto, user);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Barcha vakansiyalarni olish' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Vakansiyalar ro‘yxati' })
  findAll() {
    return this.vacancyService.findAll();
  }

  @Get('/deleted')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Barcha o‘chirilgan vakansiyalarni olish" })
  @ApiResponse({ status: HttpStatus.OK, description: "O‘chirilgan vakansiyalar ro‘yxati" })
  findAllDeleted() {
    return this.vacancyService.findAllDeleted();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Bitta vakansiyani olish' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Vakansiya topildi' })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string
  ) {
    return this.vacancyService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Vakansiyani yangilash' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Vakansiya yangilandi' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateVacancyDto,
    @CurrentUser() user: UserDto
  ) {
    return this.vacancyService.update(id, dto, user);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Vakansiyani o‘chirish' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Vakansiya o‘chirildi' })
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: UserDto
  ) {
    return this.vacancyService.remove(id, user);
  }
}

  import {
    Injectable,
    NotFoundException,
    HttpStatus,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { CreateVacancyDto, UserDto } from './dto/create-vacancy.dto';
  import { UpdateVacancyDto } from './dto/update-vacancy.dto';
  import { Vacancy } from 'src/entity/vacancy.entity';

  @Injectable()
  export class VacancyService {
    constructor(
      @InjectRepository(Vacancy)
      private readonly vacancyRepo: Repository<Vacancy>,
    ) {}

    async create(dto: CreateVacancyDto, user: UserDto) {
      console.log(user)
      const vacancy = this.vacancyRepo.create({...dto, created_by: user.id});
      await this.vacancyRepo.save(vacancy);
      return {
        data: vacancy,
        message: 'Vacancy muvaffaqiyatli yaratildi',
        status: HttpStatus.CREATED,
      };
    }

    async findAll() {
      const data = await this.vacancyRepo.find({ where: { is_deleted: false, is_active: true }, order: { created_at: 'DESC' } });
      return {
        data,
        message: 'Barcha vakansiyalar ro‘yxati',
        status: HttpStatus.OK,
      };
    }

    async findAllDeleted() {
      const data = await this.vacancyRepo.find({ where: { is_deleted: true }, order: { created_at: 'DESC' } });
      return {
        data,
        message: 'Barcha vakansiyalar ro‘yxati',
        status: HttpStatus.OK,
      };
    }

    async findOne(id: string) {
      const vacancy = await this.vacancyRepo.findOne({ where: { id, is_deleted: false, is_active: true, subscriptions: { is_deleted: false, is_active: true } }, relations: ['subscriptions']});
      if (!vacancy) throw new NotFoundException('Vakansiya topilmadi');

      return {
        data: vacancy,
        message: 'Vakansiya topildi',
        status: HttpStatus.OK,
      };
    }

    async update(id: string, dto: UpdateVacancyDto, user: UserDto) {
      const vacancy = await this.vacancyRepo.findOne({ where: { id, is_deleted: false, is_active: true } });
      if (!vacancy) throw new NotFoundException('Vakansiya topilmadi');
      vacancy.updated_by = user.id;
      Object.assign(vacancy, dto);
      await this.vacancyRepo.save(vacancy);

      return {
        data: vacancy,
        message: 'Vakansiya muvaffaqiyatli yangilandi',
        status: HttpStatus.OK,
      };
    }

    async remove(id: string, user: UserDto) {
      const vacancy = await this.vacancyRepo.findOne({ where: { id, is_deleted: false, is_active: true } });
      if (!vacancy) throw new NotFoundException('Vakansiya topilmadi');
      vacancy.is_deleted = true;
      vacancy.deleted_by = user.id
      vacancy.deleted_at = new Date()

      await this.vacancyRepo.save(vacancy);
      return {  
        data: null,
        message: 'Vakansiya o‘chirildi',
        status: HttpStatus.OK,
      };
    }
  }

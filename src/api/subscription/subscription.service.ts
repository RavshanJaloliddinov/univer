import {
  Injectable,
  NotFoundException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Vacancy } from 'src/entity/vacancy.entity';
import { Subscription } from 'src/entity/subscription.entity';
import { UserDto } from '../vacancy/dto/create-vacancy.dto';
import { FileService } from 'src/infrastructure/file';
@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,

    @InjectRepository(Vacancy)
    private readonly vacancyRepo: Repository<Vacancy>,

    private readonly fileService: FileService,
  ) {}

  async create(dto: CreateSubscriptionDto, file?: Express.Multer.File) {
    const vacancy = await this.vacancyRepo.findOne({
      where: { id: dto.vacansy_id, is_deleted: false, is_active: true },
    });
    if (!vacancy) throw new NotFoundException('Bunday vakansiya topilmadi');

    if (!file) {
      throw new BadRequestException('Rezyume (PDF) fayl majburiy');
    }

    const fileName = await this.fileService.savePdf(file);
    const fileUrl = this.fileService.getFileUrl(fileName);

    const subscription = this.subscriptionRepo.create({
      ...dto,
      resume_file: fileName,
      vacancy,
    });

    await this.subscriptionRepo.save(subscription);
    return {
      data: subscription,
      message: 'Subscription muvaffaqiyatli yaratildi',
      status: HttpStatus.CREATED,
    };
  }

  async findAll() {
    const data = await this.subscriptionRepo.find({
      where: { is_deleted: false, is_active: true },
      order: { created_at: 'DESC' },
    });
    return {
      data,
      message: 'Barcha subscriptionlar ro‘yxati',
      status: HttpStatus.OK,
    };
  }

  async findAllDeleted() {
    const data = await this.subscriptionRepo.find({
      where: { is_deleted: true },
      order: { created_at: 'DESC' },
    });
    return {
      data,
      message: 'O‘chirilgan subscriptionlar ro‘yxati',
      status: HttpStatus.OK,
    };
  }

  async findOne(id: string) {
    const subscription = await this.subscriptionRepo.findOne({
      where: {
        id,
        is_deleted: false,
        is_active: true,
        vacancy: { is_active: true, is_deleted: false },
      },
      relations: ['vacancy'],
    });
    if (!subscription) throw new NotFoundException('Subscription topilmadi');

    return {
      data: subscription,
      message: 'Subscription topildi',
      status: HttpStatus.OK,
    };
  }

  async update(id: string, dto: UpdateSubscriptionDto) {
    const subscription = await this.subscriptionRepo.findOne({
      where: { id, is_deleted: false, is_active: true },
      relations: ['vacancy'],
    });
    if (!subscription) throw new NotFoundException('Subscription topilmadi');

    if (dto.vacansy_id) {
      const vacancy = await this.vacancyRepo.findOne({
        where: { id: dto.vacansy_id },
      });
      if (!vacancy) throw new NotFoundException('Yangi vakansiya topilmadi');
      subscription.vacancy = vacancy;
    }

    Object.assign(subscription, dto);
    await this.subscriptionRepo.save(subscription);

    return {
      data: subscription,
      message: 'Subscription yangilandi',
      status: HttpStatus.OK,
    };
  }

  async remove(id: string, user: UserDto) {
    const subscription = await this.subscriptionRepo.findOne({ where: { id } });
    if (!subscription) throw new NotFoundException('Subscription topilmadi');

    subscription.is_deleted = true;
    subscription.deleted_at = new Date();
    subscription.deleted_by = user.id;

    await this.subscriptionRepo.save(subscription);

    return {
      data: null,
      message: 'Subscription o‘chirildi',
      status: HttpStatus.OK,
    };
  }
}

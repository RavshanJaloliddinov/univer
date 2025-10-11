import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { Vacancy } from 'src/entity/vacancy.entity';
import { Subscription } from 'src/entity/subscription.entity';
import { FileService } from 'src/infrastructure/file';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Vacancy])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, FileService],
})
export class SubscriptionModule { }
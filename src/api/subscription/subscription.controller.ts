import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Public } from 'src/common/decorator/public';
import { CurrentUser } from 'src/common/decorator/current-user';
import { UserDto } from '../vacancy/dto/create-vacancy.dto';

@ApiTags('Subscriptions')
@Public()
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi subscription yaratish' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Subscription yaratildi' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha subscriptionlarni olish' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Subscriptionlar ro‘yxati' })
  findAll() {
    return this.subscriptionService.findAll();
  }

  @Get('deleted')
  @ApiOperation({ summary: 'O‘chirilgan subscriptionlarni olish' })
  @ApiResponse({ status: HttpStatus.OK, description: 'O‘chirilgan subscriptionlar ro‘yxati' })
  findAllDeleted() {
    return this.subscriptionService.findAllDeleted();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta subscriptionni olish' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Subscription topildi' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.subscriptionService.findOne(id);
  }

  // @Put(':id')
  // @ApiOperation({ summary: 'Subscriptionni yangilash' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Subscription yangilandi' })
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  // update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateSubscriptionDto) {
  //   return this.subscriptionService.update(id, dto);
  // }

  @Delete(':id')
  @ApiOperation({ summary: 'Subscriptionni o‘chirish' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Subscription o‘chirildi' })
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: UserDto
  ) {
    return this.subscriptionService.remove(id, user);
  }
}

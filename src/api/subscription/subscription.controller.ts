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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CurrentUser } from 'src/common/decorator/current-user';
import { UserDto } from '../vacancy/dto/create-vacancy.dto';
import { Public } from 'src/common/decorator/public';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  // @ApiBearerAuth('access-token')
  @Public()
  @ApiOperation({ summary: 'Yangi subscription yaratish (PDF yuklash bilan)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Subscription yaratildi' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string', example: 'Ali Karimov' },
        age: { type: 'string', example: '25' },
        gender: { type: 'string', enum: ['male', 'female'] },
        phone: { type: 'string', example: '+998901112233' },
        email: { type: 'string', example: 'ali@gmail.com' },
        major: { type: 'string', example: 'Backend yo‘nalishi' },
        vacansy_id: { type: 'string', format: 'uuid' },
        file: { type: 'string', format: 'binary' },
        captcha: { type: 'string' },
      },
    },
  })
  create(
    @Body() dto: CreateSubscriptionDto,
    @UploadedFile() file: Express.Multer.File,
    // @CurrentUser() user: UserDto,
  ) {
    return this.subscriptionService.create(dto, file);
  }
  

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Barcha subscriptionlarni olish' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Subscriptionlar ro‘yxati' })
  findAll() {
    return this.subscriptionService.findAll();
  }

  @Get('deleted')
  @ApiBearerAuth('access-token')
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

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Subscriptionni o‘chirish' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Subscription o‘chirildi' })
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: UserDto,
  ) {
    return this.subscriptionService.remove(id, user);
  }
}

import { Module } from '@nestjs/common';
import { VacancyModule } from './vacancy/vacancy.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/config';
import { Subscription } from 'src/entity/subscription.entity';
import { Vacancy } from 'src/entity/vacancy.entity';
import { JwtStrategy } from 'src/common/users/AuthStrategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/common/users/AuthGuard';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { Admin } from 'src/entity/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.DB_URL,
      synchronize: true,
      entities: [Subscription, Vacancy, Admin],
      ssl: {
        rejectUnauthorized: false, 
      },
    }),
    VacancyModule, 
    SubscriptionModule, 
    AuthModule,
    AdminModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

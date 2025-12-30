import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import appConfig from './config/app.config';
import typeormConfig from './config/typeorm.config';
import vnpayConfig from './config/vnpay.config';
import { HouseholdModule } from './household/household.module';
import { PersonModule } from './person/person.module';
import { ContributionModule } from './contribution/contribution.module';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PopulationEventModule } from './population-event/population-event.module';

@Module({
  controllers: [AppController, UsersController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, typeormConfig, vnpayConfig],
    }),

    MulterModule.register({
      dest: './uploads',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions =>
        config.get<TypeOrmModuleOptions>('typeorm')!,
    }),

    HouseholdModule,
    PersonModule,
    ContributionModule,
    UsersModule,
    PopulationEventModule,
    AuthModule,
    RolesModule,
  ],
})
export class AppModule {}

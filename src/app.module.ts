import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import appConfig from './config/app.config';
import typeormConfig from './config/typeorm.config';

import { HouseholdModule } from './household/household.module';
import { PersonModule } from './person/person.module';
import { ContributionModule } from './contribution/contribution.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, typeormConfig],
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
  ],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { Person } from '../person/person.entity'
import { PersonService } from '../person/person.service';
@Module({
  imports: [TypeOrmModule.forFeature([User, Person])],
  providers: [UsersService, PersonService],
  controllers: [UsersController],
  exports: [UsersService, PersonService],
})
export class UsersModule {}

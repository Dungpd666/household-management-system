import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  create(@Body() dto: CreatePersonDto) {
    return this.personService.create(dto);
  }

  @Get()
  findAll() {
    return this.personService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.personService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdatePersonDto) {
    return this.personService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.personService.remove(id);
  }
}

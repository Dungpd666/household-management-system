import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ParseIdPipe } from './pipes/parse-id-pipe';
import { PaginationDto } from './dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadCsvPipe } from './pipes/upload-csv-pipe';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() dto: CreatePersonDto) {
    return this.personService.create(dto);
  }

  @Get()
  findAll(@Query() paginaionDto: PaginationDto) {
    return this.personService.findAll(paginaionDto);
  }

  @Get('search')
  findOneByIdentificationNumber(
    @Query('identificationNumber') identificationNumber: string,
  ) {
    if (identificationNumber) {
      return this.personService.findOneByIdentificationNumber(
        identificationNumber,
      );
    }
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.personService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIdPipe) id: number, @Body() dto: UpdatePersonDto) {
    return this.personService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.personService.remove(id);
  }

  @Post('upload-csv')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile(new UploadCsvPipe()) file: Express.Multer.File) {
    return this.personService.importFromCsv(file.buffer);
  }
}

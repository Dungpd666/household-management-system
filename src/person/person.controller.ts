import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ParseIdPipe } from './pipes/parse-id-pipe';
import { PaginationDto } from './dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadCsvPipe } from './pipes/upload-csv-pipe';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { PassportJwtGuard } from '../auth/guard/passport-jwt.guard';

@UseGuards(PassportJwtGuard, RolesGuard)
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() dto: CreatePersonDto) {
    return this.personService.create(dto);
  }

  @Roles(RoleEnum.admin, RoleEnum.superadmin, RoleEnum.household)
  @Get()
  findAll(@Query() paginaionDto: PaginationDto) {
    return this.personService.findAll(paginaionDto);
  }

  @Roles(RoleEnum.admin, RoleEnum.superadmin, RoleEnum.household)
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

  @Roles(RoleEnum.admin, RoleEnum.superadmin, RoleEnum.household)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.personService.findOne(id);
  }

  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @Put(':id')
  update(@Param('id', ParseIdPipe) id: number, @Body() dto: UpdatePersonDto) {
    return this.personService.update(id, dto);
  }

  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.personService.remove(id);
  }

  @Roles(RoleEnum.admin, RoleEnum.superadmin)
  @Post('upload-csv')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile(new UploadCsvPipe()) file: Express.Multer.File) {
    return this.personService.importFromCsv(file.buffer);
  }
}

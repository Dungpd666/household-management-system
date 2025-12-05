import { Controller, Get, Param, Post, Body, Delete, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { PersonService } from '../person/person.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PassportJwtGuard } from '../auth/guard/passport-jwt.guard'

@UseGuards(PassportJwtGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, 
                private readonly personService : PersonService
    ) {}

    @Get()
    async findAllUsers() {
        return this.usersService.findAllUsers();
    }
    
    @Post()
    async CreateUser(@Body() dto: CreateUserDto){
        return this.usersService.createUser(dto, dto.role);
    }
    
    @Get('population')
    async Statistic(){
        const age = await this.personService.ageGroup();
        const job = await this.personService.jobGroup();
        const gender = await this.personService.jobGroup();
        return {
            "Age": age,
            "Job": job,
            "Gender": gender
        };
    }

    @Get(':id')
    async findUserById(@Param('id') id : number){
        return this.usersService.findUserById(id);
    }

    @Put(':id')
    async UpdateUser(@Body() dto: CreateUserDto, @Param('id') id : number){
        return this.usersService.updateUser(id, dto);
    }
    
    @Delete(':id')
    async RemoveUser(@Param('id') id : number){
        return this.usersService.removeUser(id);
    }
}

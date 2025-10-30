import { Controller, Get, Param, Post, Body, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAllUsers() {
        return this.usersService.findAllUsers();
    }
    
    @Post()
    async CreateUser(@Body() dto: CreateUserDto){
        return this.usersService.createUser(dto, dto.role);
    }

    @Get(":id")
    async findUserById(@Param('id') id : number){
        return this.usersService.findUserById(id);
    }

    @Put(":id")
    async UpdateUser(@Body() dto: CreateUserDto, @Param('id') id : number){
        return this.usersService.updateUser(id, dto);
    }
    
    @Delete(":id")
    async RemoveUser(@Param('id') id : number){
        return this.usersService.removeUser(id);
    }

}

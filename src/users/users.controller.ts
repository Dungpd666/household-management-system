import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAllUsers() {
        return this.usersService.findAllUsers();
    }
    
    @Get("/:id")
    async findUserById(@Param('id') id : number){
        return this.usersService.findUserById(id);
    }
    
    @Post("create")
    async CreateUser(@Body() dto: CreateUserDto){
        return this.usersService.createUser(dto, dto.role);
    }

    @Post("update/:id")
    async UpdateUser(@Body() dto: CreateUserDto, @Param('id') id : number){
        return this.usersService.updateUser(id, dto);
    }
    
    @Get("remove/:id")
    async RemoveUser(@Param('id') id : number){
        return this.usersService.removeUser(id);
    }

}

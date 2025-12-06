import { Get, Controller, HttpCode, Request, HttpStatus, UseGuards, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/auth.guard';
import { PassportLocalGuard } from './guard/passport-local.guard'
import { RoleEnum } from 'src/roles/roles.enum';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
@Controller('auth')
export class AuthController {
    constructor (
        private authService: AuthService,
    ){}
    @HttpCode(HttpStatus.OK)
    @UseGuards(PassportLocalGuard)
    @Post('login')
    async login (@Request() req){
        return this.authService.signIn(req.user);
    }

    @Roles(RoleEnum.superadmin)
    @UseGuards(AuthGuard, RolesGuard)
    @Get('info')
    getuser(@Request() req) {
        return req.user;
    }

}

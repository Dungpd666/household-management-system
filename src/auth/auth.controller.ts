import { Get, Controller, HttpCode, Request, HttpStatus, UseGuards, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/auth.guard';
import { PassportLocalGuard } from './guard/passport-local.guard'
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

    @UseGuards(AuthGuard)
    @Get('info')
    getuser(@Request() req) {
        return req.user;
    }

}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

type AuthInput = { username: string; password: string };
type signInData = { userID: number; userRole: string; userName: string };
type AuthResult = { accessToken: string; userID: number; userRole: string; userName: string }

@Injectable()
export class AuthService {
    constructor (
        private usersService: UsersService,
        private jwtService: JwtService 
    ) {}
    async authentication (input: AuthInput){
        const userData = await this.validateUser(input);
        if(!userData ){
            // Trả về thông báo tiếng Việt rõ ràng khi đăng nhập sai
            throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.'); 
        }
        return this.signIn(userData);
    }

    async validateUser(input: AuthInput): Promise<signInData | null> {
        const user = await this.usersService.findUserByUserName(input.username);
        if (user) {
            const passWordHash = input.password;
            // no encrypted
            if(user.passWordHash === passWordHash ){
                return {
                    userID: user.id,
                    userRole: user.role,
                    userName: user.userName
                }
            }
        }
        return null;
    }

    async signIn(userData: signInData): Promise<AuthResult | null> {
        const tokenPayLoad = {
            role: userData.userRole,
            sub: userData.userID,
            username: userData.userName
        };
        const accessToken = await this.jwtService.signAsync(tokenPayLoad);
        return {
            accessToken: accessToken, 
            userID: userData.userID,
            userRole: userData.userRole,
            userName: userData.userName
        };
    }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor ( private jwtService: JwtService,
                  private configService: ConfigService
    ){};
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const authorization = req.headers.authorization as string | undefined;
        const token = authorization?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payLoad = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.configService.get<string>('JWT_SECRET')
                });
            req.user= {
                userID: payLoad.sub,
                userRole: payLoad.role,
                userName: payLoad.username
            }
            return true;
        }
        catch (error) {
            throw new UnauthorizedException();
        }
    }
} 
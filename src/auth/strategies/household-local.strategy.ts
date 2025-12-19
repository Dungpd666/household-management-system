import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class HouseholdLocalStrategy extends PassportStrategy(
  Strategy,
  'household-local'
) {
  constructor ( private authService: AuthService ){
    super({
      usernameField: 'householdCode',
      passwordField: 'password'
    });
  };

  async validate(householdCode: string, password: string) {
    const household = await this.authService.validateHousehold(
      { householdCode, password }
    );
    if(!household) throw new UnauthorizedException('Invalid credentials');
    return household;
  }
}
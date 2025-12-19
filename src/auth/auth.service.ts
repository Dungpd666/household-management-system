import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RoleEnum } from '../roles/roles.enum';
import { Household } from '../household/household.entity';
import { HouseholdService } from '../household/household.service';

type AuthInput = { username: string; password: string };
type signInData = { userID: number; userRole: string; userName: string };
type AuthResult = {
  accessToken: string;
  userID: number;
  userRole: string;
  userName: string;
};

type HouseholdAuthInput = { householdCode: string; password: string };
type HouseholdAuthResult = {
  accessToken: string;
  householdID: number;
  householdCode: string;
  address: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private householdService: HouseholdService,
    private jwtService: JwtService,
  ) {}

  async authentication(input: AuthInput) {
    const userData = await this.validateUser(input);
    if (!userData) {
      throw new UnauthorizedException();
    }
    return this.signIn(userData);
  }

  async validateUser(input: AuthInput): Promise<signInData | null> {
    const user = await this.usersService.findUserByUserName(input.username);
    if (user) {
      const passWordHash = input.password;
      // no encrypted
      if (user.passWordHash === passWordHash) {
        return {
          userID: user.id,
          userRole: user.role,
          userName: user.userName,
        };
      }
    }
    return null;
  }

  async signIn(userData: signInData): Promise<AuthResult | null> {
    const tokenPayLoad = {
      role: userData.userRole,
      sub: userData.userID,
      username: userData.userName,
    };
    const accessToken = await this.jwtService.signAsync(tokenPayLoad);
    return {
      accessToken: accessToken,
      userID: userData.userID,
      userRole: userData.userRole,
      userName: userData.userName,
    };
  }

  async householdAuthentication(input: HouseholdAuthInput) {
    const householdData = await this.validateHousehold(input);
    if (!householdData) {
      throw new UnauthorizedException();
    }
    return this.signInHousehold(householdData);
  }

  async validateHousehold(input: HouseholdAuthInput): Promise<Household | null> {
    return await this.householdService.validateHouseholdCredentials(
      input.householdCode,
      input.password,
    );
  }

  async signInHousehold(household: Household): Promise<HouseholdAuthResult> {
    const tokenPayLoad = {
      role: RoleEnum.household,
      sub: household.id,
      username: household.householdCode,
      userType: 'household',
      householdCode: household.householdCode,
    };
    const accessToken = await this.jwtService.signAsync(tokenPayLoad);
    return {
      accessToken: accessToken,
      householdID: household.id,
      householdCode: household.householdCode,
      address: household.address,
    };
  }
}

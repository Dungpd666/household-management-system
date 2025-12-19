import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class HouseholdLocalGuard extends AuthGuard('household-local') {}
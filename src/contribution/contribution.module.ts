import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ContributionController } from './contribution.controller';
import { ContributionService } from './contribution.service';
import { Contribution } from './contribution.entity';
import { HouseholdModule } from 'src/household/household.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contribution]),
    HouseholdModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [ContributionController],
  providers: [ContributionService],
  exports: [ContributionService],
})
export class ContributionModule {}

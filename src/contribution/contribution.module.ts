import { Module } from '@nestjs/common';
import { ContributionController } from './contribution.controller';
import { ContributionService } from './contribution.service';

@Module({
  controllers: [ContributionController],
  providers: [ContributionService]
})
export class ContributionModule {}

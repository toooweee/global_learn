import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesRouter } from './companies.router';

@Module({
  providers: [CompaniesService, CompaniesRouter],
})
export class CompaniesModule {}

import { Module } from '@nestjs/common';
import { ClientCompaniesService } from './client-companies.service';
import { DepartmentsModule } from '../departments/departments.module';
import { PositionsModule } from '../positions/positions.module';
import { DepartmentsService } from '../departments/departments.service';
import { PositionsService } from '../positions/positions.service';
import { ClientCompaniesRouter } from './client-companies.router';

@Module({
  imports: [DepartmentsModule, PositionsModule],
  providers: [ClientCompaniesService, ClientCompaniesRouter],
})
export class ClientCompaniesModule {}

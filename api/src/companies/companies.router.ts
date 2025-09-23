import { Router } from 'nestjs-trpc';
import { CompaniesService } from './companies.service';

export class CompaniesRouter {
  constructor(private readonly companiesService: CompaniesService) {}
}

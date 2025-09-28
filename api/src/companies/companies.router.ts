import { Query, Router } from 'nestjs-trpc';
import { CompaniesService } from './companies.service';
import { CompaniesListSchema } from './schema/companies.schema';

@Router()
export class CompaniesRouter {
  constructor(private readonly companiesService: CompaniesService) {}

  @Query({
    output: CompaniesListSchema,
  })
  async findAll() {
    return this.companiesService.findAll();
  }
}

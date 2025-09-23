import * as z from 'zod';

export const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  foundationDate: z.string(),
  status: z.enum(['TRIAL', 'ACTIVE', 'SUSPENDED', 'CANCELLED']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Company = z.infer<typeof CompanySchema>;

export const CompaniesListSchema = z.array(CompanySchema);

export const CreateCompanyDtoSchema = z.object({
  name: z.string(),
  description: z.string(),
  address: z.string(),
  foundationDate: z.string(),
  companyLegalFormId: z.string().uuid(),
});

export const UpdateCompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  foundationDate: z.string().optional(),
  companyLegalFormId: z.string().uuid().optional(),
});

export type UpdateCompanyDto = z.infer<typeof UpdateCompanySchema>;

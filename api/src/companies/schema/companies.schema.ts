import z from 'zod';
import { DirectionsSchema } from '../../directions/schema/directions.schema';
import { LegalFormsSchema } from '../../legal-forms/schema/legal-forms.schema';

export const CompaniesCreateSchemaInput = z.object({
  name: z.string(),
  description: z.string(),
  directions: z.string().array(),
  address: z.string(),
  foundationDate: z.coerce.date(),
  registerRequestId: z.string(),
  companyLegalFormId: z.string(),
});

export type CreateCompanyDto = z.infer<typeof CompaniesCreateSchemaInput>;

export const CompanyLegalFormOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const CompanyOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  foundationDate: z.coerce.date(),
  status: z.enum(['ACTIVE', 'TRIAL']),
  registerRequestId: z.string(),
  companyLegalFormId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  directions: z.array(z.string()),
  companyLegalForm: CompanyLegalFormOutputSchema,
});

export const CompaniesListSchema = z.array(CompanyOutputSchema);

import z from 'zod';

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

export const CompaniesCreateSchemaOutput = z.object({});

export const CompaniesSchema = z.object({});

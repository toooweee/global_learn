import z from 'zod';

export const CompaniesCreateSchemaInput = z.object({
  name: z.string(),
  description: z.string(),
  directions: z.string().array(),
  logo: z.string(),
  address: z.string(),
  foundationDate: z.string(),
  registerRequestId: z.string(),
});

export type CreateCompanyDto = z.infer<typeof CompaniesCreateSchemaInput>;

export const CompaniesCreateSchemaOutput = z.object({});

export const CompaniesSchema = z.object({});

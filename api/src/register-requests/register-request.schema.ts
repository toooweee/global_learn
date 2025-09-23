import z from 'zod';
import { UserInputSchema } from '../users/user.schema';
import { CompaniesCreateSchemaInput } from '../companies/schema/companies.schema';

export const RegisterRequestSchemaInput = z.object({
  email: z.string().email(),
  phone: z.string(),
});

export type CreateRegisterRequestDto = z.infer<typeof RegisterRequestSchemaInput>;

export const RegisterRequestSchemaOutput = z.object({
  id: z.string(),
  email: z.string().email(),
  phone: z.string(),
  status: z.string(),
});

export const RegisterRequestsSchema = z.object({
  id: z.string(),
  email: z.string(),
  phone: z.string(),
  status: z.string(),
  createdAt: z.date(),
});

export const RegisterRequestStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED']);

export enum RegisterRequestStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export const UpdateRegisterRequestStatusDto = z.object({
  id: z.string(),
  status: RegisterRequestStatusSchema,
});

export type UpdateRegisterRequestStatusDto = z.infer<typeof UpdateRegisterRequestStatusDto>;

export const CompleteRegisterSchemaInput = z.object({
  name: z.string(),
  description: z.string(),
  directions: z.string().array(),
  address: z.string(),
  foundationDate: z.coerce.date(),
  companyLegalFormId: z.string(),
});

export const CompleteRegistrationSchemaInput = z.object({
  token: z.string(),
  user: UserInputSchema,
  company: CompleteRegisterSchemaInput,
});

export type CompleteRegistrationDto = z.infer<typeof CompleteRegistrationSchemaInput>;

export const CompleteRegistrationSchemaOutput = z.object({
  token: z.string(),
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  surname: z.string(),
});

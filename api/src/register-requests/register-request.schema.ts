import z from 'zod';
import { CompaniesCreateSchemaInput } from '../companies/companies.schema';
import { UserInputSchema } from '../users/user.schema';

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

export const CompleteRegistrationSchemaInput = z.object({
  token: z.string(),
  user: UserInputSchema,
  company: CompaniesCreateSchemaInput,
});

export type CompleteRegistrationDto = z.infer<typeof CompleteRegistrationSchemaInput>;

export const CompleteRegistrationSchemaOutput = z.object({
  token: z.string(),
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  surname: z.string(),
});

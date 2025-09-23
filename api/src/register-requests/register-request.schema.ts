import z from 'zod';

export const RegisterRequestSchemaInput = z.object({
  email: z.string().email(),
  phone: z.string(),
});

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

export type CreateRegisterRequestDto = z.infer<typeof RegisterRequestSchemaInput>;

export type UpdateRegisterRequestStatusDto = z.infer<typeof UpdateRegisterRequestStatusDto>;

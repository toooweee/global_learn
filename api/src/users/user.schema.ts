import * as z from 'zod';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  CLIENT_ADMIN = 'CLIENT_ADMIN',
}

export const RoleSchema = z.enum(['ADMIN', 'USER', 'CLIENT_ADMIN']);

export const UserInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role: RoleSchema.optional(),
  name: z.string().optional(),
  surname: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof UserInputSchema>;

export const UserOutputSchema = z.object({
  id: z.string().uuid(),
  email: z.string(),
});

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
});

export type CreateUserDto = z.infer<typeof UserInputSchema>;

export const UserOutputSchema = z.object({
  id: z.string().uuid(),
  email: z.string(),
});

export const UserMeSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: RoleSchema.optional(),
  companyId: z.string().optional(),
});

// for companies

export const CreateUserWithProfileDtoSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role: RoleSchema.optional(),
  name: z.string(),
  surname: z.string(),
  bio: z.string().optional(),
  employmentDate: z.coerce.date(),
  positionId: z.string().uuid().optional(),
  avatar: z.string().optional(),
});

export type CreateUserWithProfileDto = z.infer<typeof CreateUserWithProfileDtoSchema>;

export const UserWithProfileOutputSchema = z.object({
  id: z.string().uuid(),
  email: z.string(),
  role: RoleSchema,
  companyId: z.string(),
  profile: z.object({
    id: z.string().uuid(),
    name: z.string(),
    surname: z.string(),
    bio: z.string().optional(),
    employmentDate: z.date(),
  }),
});

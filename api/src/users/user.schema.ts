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

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  surname: z.string(),
  bio: z.string().optional(),
  employmentDate: z.date(),
});

export const CreateUserWithProfileDtoSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role: RoleSchema.optional(),
  name: z.string(),
  surname: z.string(),
  bio: z.string().optional(),
  employmentDate: z.coerce.date(),
  positionId: z.string().uuid().optional(),
});

export type CreateUserWithProfileDto = z.infer<typeof CreateUserWithProfileDtoSchema>;

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  surname: z.string(),
  bio: z.string().optional(),
  employmentDate: z.date(),
  avatar: z
    .object({
      id: z.string().uuid(),
      path: z.string(),
    })
    .optional(),
});

export const UserWithProfileOutputSchema = z.object({
  id: z.string().uuid(),
  email: z.string(),
  role: RoleSchema,
  companyId: z.string().uuid(),
  profile: ProfileSchema,
});

export const UserMeSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: RoleSchema.optional(),
  companyId: z.string().uuid().optional(),
  profile: ProfileSchema.optional(),
});

export const FindCompanyUsersOptions = z.object({
  positionId: z.string().uuid().optional(),
});

export type FindCompanyUsersOptionsDto = z.infer<typeof FindCompanyUsersOptions>;

export const CompanyUserOutputSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: RoleSchema,
  companyId: z.string().uuid().optional(),
  positionId: z.string().uuid().optional(),
  profile: UserProfileSchema.optional(),
});

export const CreateProfileDtoSchema = z.object({
  name: z.string(),
  surname: z.string(),
  bio: z.string().optional(),
  employmentDate: z.coerce.date(),
});

export type CreateProfileDto = z.infer<typeof CreateProfileDtoSchema>;

export const UpdateProfileDtoSchema = z.object({
  name: z.string().optional(),
  surname: z.string().optional(),
  bio: z.string().optional(),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileDtoSchema>;

export const UploadAvatarOutputSchema = z.object({
  id: z.string().uuid(),
  path: z.string(),
  filename: z.string(),
});

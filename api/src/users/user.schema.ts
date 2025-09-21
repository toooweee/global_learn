import * as z from 'zod';

export const UserInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type CreateUserDto = z.infer<typeof UserInputSchema>;

export const UserOutputSchema = z.object({
  id: z.string().uuid(),
  email: z.string(),
});

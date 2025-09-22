import { z } from 'zod';

export const EnvSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;

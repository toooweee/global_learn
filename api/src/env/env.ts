import { z } from 'zod';

export const EnvSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),
  JWT_SECRET: z.string(),
  JWT_AT_EXPIRES: z.string(),
  JWT_RT_EXPIRES: z.string(),
  CLIENT_URL: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;

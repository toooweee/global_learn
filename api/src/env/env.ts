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
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;

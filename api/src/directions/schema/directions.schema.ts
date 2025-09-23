import { z } from 'zod';

export const DirectionsSchemaInput = z.object({
  name: z.string(),
});

export type CreateDirectionDto = z.infer<typeof DirectionsSchemaInput>;

export type UpdateDirectionDto = Partial<CreateDirectionDto>;

export const DirectionsSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

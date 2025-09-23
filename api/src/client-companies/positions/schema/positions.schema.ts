import { z } from 'zod';

export const PositionsSchemaInput = z.object({
  name: z.string().min(1, 'Название позиции обязательно').max(100, 'Название не должно превышать 100 символов'),
  departmentId: z.string().uuid('Недействительный ID департамента'),
});

export const UpdatePositionDto = z.object({
  id: z.string().uuid('Недействительный ID позиции'),
  name: z
    .string()
    .min(1, 'Название позиции обязательно')
    .max(100, 'Название не должно превышать 100 символов')
    .optional(),
  departmentId: z.string().uuid('Недействительный ID департамента').optional(),
});

export const PositionsSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  departmentId: z.string().uuid(),
  department: z.object({ id: z.string().uuid(), name: z.string() }).optional(),
  usersCount: z.number().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const PositionsListSchema = z.array(PositionsSchema);

export type CreatePositionDto = z.infer<typeof PositionsSchemaInput>;
export type UpdatePositionDto = z.infer<typeof UpdatePositionDto>;
export type PositionOutput = z.infer<typeof PositionsSchema>;

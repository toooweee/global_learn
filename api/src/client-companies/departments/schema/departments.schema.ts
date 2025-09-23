import { z } from 'zod';

export const DepartmentsSchemaInput = z.object({
  name: z.string().min(1, 'Название департамента обязательно').max(100, 'Название не должно превышать 100 символов'),
});

export const UpdateDepartmentDto = z.object({
  id: z.string().uuid('Недействительный ID департамента'),
  name: z
    .string()
    .min(1, 'Название департамента обязательно')
    .max(100, 'Название не должно превышать 100 символов')
    .optional(),
});

export const DepartmentsSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  companyId: z.string().uuid(),
  positionsCount: z.number().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const DepartmentsListSchema = z.array(DepartmentsSchema);

export type CreateDepartmentDto = z.infer<typeof DepartmentsSchemaInput>;
export type UpdateDepartmentDto = z.infer<typeof UpdateDepartmentDto>;
export type DepartmentOutput = z.infer<typeof DepartmentsSchema>;

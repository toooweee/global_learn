import { z } from 'zod';

export const LegalFormsSchemaInput = z.object({
  name: z.string(),
});

export const UpdateLegalFormDto = z.object({
  id: z.string(),
  name: z.string().optional(),
});

export const LegalFormsSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const LegalFormsListSchema = z.array(LegalFormsSchema);

export type CreateLegalFormDto = z.infer<typeof LegalFormsSchemaInput>;
export type UpdateLegalFormDto = z.infer<typeof UpdateLegalFormDto>;

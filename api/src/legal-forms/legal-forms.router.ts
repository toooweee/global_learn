import { Injectable } from '@nestjs/common';
import { Router, Query, Mutation, Input } from 'nestjs-trpc';
import { LegalFormsService } from './legal-forms.service';
import {
  LegalFormsSchemaInput,
  UpdateLegalFormDto,
  LegalFormsSchema,
  LegalFormsListSchema,
  CreateLegalFormDto,
} from './schema/legal-forms.schema';
import { z } from 'zod';

@Injectable()
@Router()
export class LegalFormsRouter {
  constructor(private readonly legalFormsService: LegalFormsService) {}

  @Mutation({
    input: LegalFormsSchemaInput,
    output: LegalFormsSchema,
  })
  async create(@Input() dto: CreateLegalFormDto) {
    return this.legalFormsService.create(dto);
  }

  @Query({
    input: z.object({ id: z.string().uuid() }),
    output: LegalFormsSchema,
  })
  async findOne(@Input() input: { id: string }) {
    return this.legalFormsService.findOne(input.id);
  }

  @Query({
    output: LegalFormsListSchema,
  })
  async findAll() {
    return this.legalFormsService.findAll();
  }

  @Mutation({
    input: UpdateLegalFormDto,
    output: LegalFormsSchema,
  })
  async update(@Input() dto: UpdateLegalFormDto) {
    return this.legalFormsService.update(dto);
  }

  @Mutation({
    input: z.object({ id: z.string().uuid() }),
    output: LegalFormsSchema,
  })
  async delete(@Input() input: { id: string }) {
    return this.legalFormsService.delete(input.id);
  }
}

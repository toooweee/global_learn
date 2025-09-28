import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { TRPCError } from '@trpc/server';
import { CreateLegalFormDto, UpdateLegalFormDto } from './schema/legal-forms.schema';

@Injectable()
export class LegalFormsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateLegalFormDto) {
    const { name } = dto;

    const existingForm = await this.prismaService.companyLegalForm.findUnique({
      where: { name },
    });
    if (existingForm) {
      throw new TRPCError({
        message: `Юридическая форма с названием "${name}" уже существует`,
        code: 'CONFLICT',
      });
    }

    const legalForm = await this.prismaService.companyLegalForm.create({
      data: { name },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...legalForm,
      createdAt: legalForm.createdAt.toISOString(),
      updatedAt: legalForm.updatedAt.toISOString(),
    };
  }

  async findOne(id: string) {
    const legalForm = await this.prismaService.companyLegalForm.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!legalForm) {
      throw new TRPCError({
        message: `Юридическая форма с ID "${id}" не найдена`,
        code: 'NOT_FOUND',
      });
    }

    return {
      ...legalForm,
      createdAt: legalForm.createdAt.toISOString(),
      updatedAt: legalForm.updatedAt.toISOString(),
    };
  }

  async findAll() {
    const legalForms = await this.prismaService.companyLegalForm.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return legalForms.map((form) => ({
      ...form,
      createdAt: form.createdAt.toISOString(),
      updatedAt: form.updatedAt.toISOString(),
    }));
  }

  async update(dto: UpdateLegalFormDto) {
    const { id, name } = dto;

    const existingForm = await this.prismaService.companyLegalForm.findUnique({
      where: { id },
    });
    if (!existingForm) {
      throw new TRPCError({
        message: `Юридическая форма с ID "${id}" не найдена`,
        code: 'NOT_FOUND',
      });
    }

    if (name) {
      const nameExists = await this.prismaService.companyLegalForm.findUnique({
        where: { name },
      });
      if (nameExists && nameExists.id !== id) {
        throw new TRPCError({
          message: `Юридическая форма с названием "${name}" уже существует`,
          code: 'CONFLICT',
        });
      }
    }

    const updatedForm = await this.prismaService.companyLegalForm.update({
      where: { id },
      data: { name },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...updatedForm,
      createdAt: updatedForm.createdAt.toISOString(),
      updatedAt: updatedForm.updatedAt.toISOString(),
    };
  }

  async delete(id: string) {
    const existingForm = await this.prismaService.companyLegalForm.findUnique({
      where: { id },
      include: { companies: { select: { id: true } } },
    });
    if (!existingForm) {
      throw new TRPCError({
        message: `Юридическая форма с ID "${id}" не найдена`,
        code: 'NOT_FOUND',
      });
    }

    if (existingForm.companies.length > 0) {
      throw new TRPCError({
        message: `Нельзя удалить юридическую форму, так как она используется в ${existingForm.companies.length} компании(ях)`,
        code: 'BAD_REQUEST',
      });
    }

    await this.prismaService.companyLegalForm.delete({
      where: { id },
    });
  }
}

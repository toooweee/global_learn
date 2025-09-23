import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentOutput } from './schema/departments.schema';
import { TRPCError } from '@trpc/server';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(companyId: string, dto: CreateDepartmentDto): Promise<DepartmentOutput> {
    const { name } = dto;

    const company = await this.prismaService.company.findUnique({ where: { id: companyId } });
    if (!company) {
      throw new TRPCError({
        message: `Компания с ID "${companyId}" не найдена`,
        code: 'NOT_FOUND',
      });
    }

    const existingDepartment = await this.prismaService.department.findFirst({
      where: { name, companyId },
    });
    if (existingDepartment) {
      throw new TRPCError({
        message: `Департамент с названием "${name}" уже существует в этой компании`,
        code: 'CONFLICT',
      });
    }

    const department = await this.prismaService.department.create({
      data: { name, companyId },
      select: {
        id: true,
        name: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { positions: true } },
      },
    });

    return {
      ...department,
      positionsCount: department._count.positions,
      createdAt: department.createdAt.toISOString(),
      updatedAt: department.updatedAt.toISOString(),
    };
  }

  async findOne(companyId: string, id: string): Promise<DepartmentOutput> {
    const department = await this.prismaService.department.findFirst({
      where: { id, companyId },
      select: {
        id: true,
        name: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { positions: true } },
      },
    });

    if (!department) {
      throw new TRPCError({
        message: `Департамент с ID "${id}" не найден в компании "${companyId}"`,
        code: 'NOT_FOUND',
      });
    }

    return {
      ...department,
      positionsCount: department._count.positions,
      createdAt: department.createdAt.toISOString(),
      updatedAt: department.updatedAt.toISOString(),
    };
  }

  async findAll(companyId: string): Promise<DepartmentOutput[]> {
    const departments = await this.prismaService.department.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { positions: true } },
      },
    });

    return departments.map((dept) => ({
      ...dept,
      positionsCount: dept._count.positions,
      createdAt: dept.createdAt.toISOString(),
      updatedAt: dept.updatedAt.toISOString(),
    }));
  }

  async update(companyId: string, dto: UpdateDepartmentDto): Promise<DepartmentOutput> {
    const { id, name } = dto;

    const existingDepartment = await this.prismaService.department.findFirst({
      where: { id, companyId },
    });
    if (!existingDepartment) {
      throw new TRPCError({
        message: `Департамент с ID "${id}" не найден в компании "${companyId}"`,
        code: 'NOT_FOUND',
      });
    }

    if (name) {
      const nameExists = await this.prismaService.department.findFirst({
        where: { name, companyId, id: { not: id } },
      });
      if (nameExists) {
        throw new TRPCError({
          message: `Департамент с названием "${name}" уже существует в этой компании`,
          code: 'CONFLICT',
        });
      }
    }

    const updatedDepartment = await this.prismaService.department.update({
      where: { id },
      data: { name },
      select: {
        id: true,
        name: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { positions: true } },
      },
    });

    return {
      ...updatedDepartment,
      positionsCount: updatedDepartment._count.positions,
      createdAt: updatedDepartment.createdAt.toISOString(),
      updatedAt: updatedDepartment.updatedAt.toISOString(),
    };
  }

  async delete(companyId: string, id: string) {
    const department = await this.prismaService.department.findFirst({
      where: { id, companyId },
      include: { positions: { select: { id: true } } },
    });
    if (!department) {
      throw new TRPCError({
        message: `Департамент с ID "${id}" не найден в компании "${companyId}"`,
        code: 'NOT_FOUND',
      });
    }

    if (department.positions.length > 0) {
      throw new TRPCError({
        message: `Нельзя удалить департамент, так как в нём ${department.positions.length} позиций`,
        code: 'BAD_REQUEST',
      });
    }

    return this.prismaService.department.delete({ where: { id } });
  }
}

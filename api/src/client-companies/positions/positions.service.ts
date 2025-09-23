import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreatePositionDto, UpdatePositionDto, PositionOutput } from './schema/positions.schema';
import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';

@Injectable()
export class PositionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(companyId: string, dto: CreatePositionDto): Promise<PositionOutput> {
    const { name, departmentId } = dto;

    const department = await this.prismaService.department.findFirst({
      where: { id: departmentId, companyId },
    });
    if (!department) {
      throw new TRPCError({
        message: `Департамент с ID "${departmentId}" не найден в компании "${companyId}"`,
        code: 'NOT_FOUND',
      });
    }

    const existingPosition = await this.prismaService.position.findFirst({
      where: { name, departmentId },
    });
    if (existingPosition) {
      throw new TRPCError({
        message: `Позиция с названием "${name}" уже существует в этом департаменте`,
        code: 'CONFLICT',
      });
    }

    const position = await this.prismaService.position.create({
      data: { name, departmentId },
      select: {
        id: true,
        name: true,
        departmentId: true,
        department: {
          select: { id: true, name: true },
        },
        createdAt: true,
        updatedAt: true,
        _count: { select: { users: true } },
      },
    });

    return {
      ...position,
      usersCount: position._count.users,
      createdAt: position.createdAt.toISOString(),
      updatedAt: position.updatedAt.toISOString(),
    };
  }

  async findOne(companyId: string, id: string): Promise<PositionOutput> {
    const position = await this.prismaService.position.findFirst({
      where: {
        id,
        department: { companyId },
      },
      select: {
        id: true,
        name: true,
        departmentId: true,
        department: {
          select: { id: true, name: true },
        },
        createdAt: true,
        updatedAt: true,
        _count: { select: { users: true } },
      },
    });

    if (!position) {
      throw new TRPCError({
        message: `Позиция с ID "${id}" не найдена в компании "${companyId}"`,
        code: 'NOT_FOUND',
      });
    }

    return {
      ...position,
      usersCount: position._count.users,
      createdAt: position.createdAt.toISOString(),
      updatedAt: position.updatedAt.toISOString(),
    };
  }

  async findAll(companyId: string): Promise<PositionOutput[]> {
    const positions = await this.prismaService.position.findMany({
      where: {
        department: { companyId },
      },
      select: {
        id: true,
        name: true,
        departmentId: true,
        department: {
          select: { id: true, name: true },
        },
        createdAt: true,
        updatedAt: true,
        _count: { select: { users: true } },
      },
    });

    return positions.map((pos) => ({
      ...pos,
      usersCount: pos._count.users,
      createdAt: pos.createdAt.toISOString(),
      updatedAt: pos.updatedAt.toISOString(),
    }));
  }

  async update(companyId: string, dto: UpdatePositionDto): Promise<PositionOutput> {
    const { id, name, departmentId } = dto;

    const existingPosition = await this.prismaService.position.findFirst({
      where: { id, department: { companyId } },
    });
    if (!existingPosition) {
      throw new TRPCError({
        message: `Позиция с ID "${id}" не найдена в компании "${companyId}"`,
        code: 'NOT_FOUND',
      });
    }

    if (departmentId) {
      const department = await this.prismaService.department.findFirst({ where: { id: departmentId, companyId } });
      if (!department) {
        throw new TRPCError({
          message: `Департамент с ID "${departmentId}" не найден в компании "${companyId}"`,
          code: 'NOT_FOUND',
        });
      }
    }

    if (name) {
      const nameExists = await this.prismaService.position.findFirst({
        where: { name, departmentId: existingPosition.departmentId, id: { not: id } },
      });
      if (nameExists) {
        throw new TRPCError({
          message: `Позиция с названием "${name}" уже существует в этом департаменте`,
          code: 'CONFLICT',
        });
      }
    }

    const updatedPosition = await this.prismaService.position.update({
      where: { id },
      data: { name, departmentId },
      select: {
        id: true,
        name: true,
        departmentId: true,
        department: {
          select: { id: true, name: true },
        },
        createdAt: true,
        updatedAt: true,
        _count: { select: { users: true } },
      },
    });

    return {
      ...updatedPosition,
      usersCount: updatedPosition._count.users,
      createdAt: updatedPosition.createdAt.toISOString(),
      updatedAt: updatedPosition.updatedAt.toISOString(),
    };
  }

  async delete(companyId: string, id: string) {
    const position = await this.prismaService.position.findFirst({
      where: { id, department: { companyId } },
      include: { users: { select: { id: true } } },
    });
    if (!position) {
      throw new TRPCError({
        message: `Позиция с ID "${id}" не найдена в компании "${companyId}"`,
        code: 'NOT_FOUND',
      });
    }

    if (position.users.length > 0) {
      throw new TRPCError({
        message: `Нельзя удалить позицию, так как на ней ${position.users.length} пользователей`,
        code: 'BAD_REQUEST',
      });
    }

    return this.prismaService.position.delete({ where: { id } });
  }
}

import { Injectable } from '@nestjs/common';
import { Router, Query, Mutation, Input, Ctx } from 'nestjs-trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { PositionsService } from '../positions/positions.service';
import { DepartmentsService } from '../departments/departments.service';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentsListSchema,
  DepartmentsSchemaInput,
  DepartmentsSchema,
} from '../departments/schema/departments.schema';
import { AppContextType } from '../../trpc/app.context.interface';
import {
  CreatePositionDto,
  UpdatePositionDto,
  PositionsListSchema,
  PositionsSchemaInput,
  PositionsSchema,
} from '../positions/schema/positions.schema';

@Router()
export class ClientCompaniesRouter {
  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly positionsService: PositionsService,
  ) {}

  @Mutation({
    input: DepartmentsSchemaInput,
    output: DepartmentsSchema,
  })
  async createDepartment(@Input() dto: CreateDepartmentDto, @Ctx() ctx: AppContextType) {
    if (!ctx.user?.companyId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return this.departmentsService.create(ctx.user.companyId, dto);
  }

  @Query({
    input: z.object({ id: z.string().uuid() }),
    output: DepartmentsSchema,
  })
  async findOneDepartment(@Input() input: { id: string }, @Ctx() ctx: AppContextType) {
    if (!ctx.user?.companyId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return this.departmentsService.findOne(ctx.user.companyId, input.id);
  }

  @Query({
    output: DepartmentsListSchema,
  })
  async findAllDepartments(@Ctx() ctx: AppContextType) {
    if (!ctx.user?.companyId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return this.departmentsService.findAll(ctx.user.companyId);
  }

  @Mutation({
    input: UpdateDepartmentDto,
    output: DepartmentsSchema,
  })
  async updateDepartment(@Input() dto: UpdateDepartmentDto, @Ctx() ctx: AppContextType) {
    if (!ctx.user?.companyId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return this.departmentsService.update(ctx.user.companyId, dto);
  }

  @Mutation({
    input: z.object({ id: z.string().uuid() }),
    output: z.void(),
  })
  async deleteDepartment(@Input() input: { id: string }, @Ctx() ctx: AppContextType) {
    if (!ctx.user?.companyId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return this.departmentsService.delete(ctx.user.companyId, input.id);
  }

  // Позиции

  @Mutation({
    input: PositionsSchemaInput,
    output: PositionsSchema,
  })
  async createPosition(@Input() dto: CreatePositionDto, @Ctx() ctx: AppContextType) {
    if (!ctx.user?.companyId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return this.positionsService.create(ctx.user.companyId, dto);
  }

  @Query({
    input: z.object({ id: z.string().uuid() }),
    output: PositionsSchema,
  })
  async findOnePosition(@Input() input: { id: string }, @Ctx() ctx: AppContextType) {
    if (!ctx.user?.companyId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return this.positionsService.findOne(ctx.user.companyId, input.id);
  }

  @Query({
    output: PositionsListSchema,
  })
  async findAllPositions(@Ctx() ctx: AppContextType) {
    if (!ctx.user?.companyId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return this.positionsService.findAll(ctx.user.companyId);
  }

  @Mutation({
    input: UpdatePositionDto,
    output: PositionsSchema,
  })
  async updatePosition(@Input() dto: UpdatePositionDto, @Ctx() ctx: AppContextType) {
    if (!ctx.user?.companyId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return this.positionsService.update(ctx.user.companyId, dto);
  }

  @Mutation({
    input: z.object({ id: z.string().uuid() }),
    output: z.void(),
  })
  async deletePosition(@Input() input: { id: string }, @Ctx() ctx: AppContextType) {
    if (!ctx.user?.companyId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return this.positionsService.delete(ctx.user.companyId, input.id);
  }
}

import { Router, Query, Mutation, Input, Ctx, UseMiddlewares } from 'nestjs-trpc';
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
import { AccessMiddleware } from '../../auth/middleware';
import { CompanySchema, UpdateCompanyDto, UpdateCompanySchema } from './schema/client-companies.schema';
import { ClientCompaniesService } from './client-companies.service';

@Router()
export class ClientCompaniesRouter {
  constructor(
    private readonly companiesService: ClientCompaniesService,
    private readonly departmentsService: DepartmentsService,
    private readonly positionsService: PositionsService,
  ) {}

  @UseMiddlewares(AccessMiddleware)
  @Query({
    input: z.object({ id: z.string().uuid() }).optional(),
    output: CompanySchema,
  })
  async findOneCompany(@Ctx() ctx: AppContextType, @Input() input?: { id: string }) {
    if (!ctx.user?.companyId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return this.companiesService.findOne(ctx.user.companyId, input?.id);
  }

  @UseMiddlewares(AccessMiddleware)
  @Mutation({
    input: UpdateCompanySchema,
    output: CompanySchema,
  })
  async updateCompany(@Input() dto: UpdateCompanyDto, @Ctx() ctx: AppContextType) {
    if (!ctx.user?.companyId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return this.companiesService.update(ctx.user.companyId, dto);
  }

  @UseMiddlewares(AccessMiddleware)
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

  @UseMiddlewares(AccessMiddleware)
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

  @UseMiddlewares(AccessMiddleware)
  @Query({
    output: DepartmentsListSchema,
  })
  async findAllDepartments(@Ctx() ctx: AppContextType) {
    if (!ctx.user?.companyId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return this.departmentsService.findAll(ctx.user.companyId);
  }

  @UseMiddlewares(AccessMiddleware)
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

  @UseMiddlewares(AccessMiddleware)
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

  @UseMiddlewares(AccessMiddleware)
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

  @UseMiddlewares(AccessMiddleware)
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

  @UseMiddlewares(AccessMiddleware)
  @Query({
    output: PositionsListSchema,
  })
  async findAllPositions(@Ctx() ctx: AppContextType) {
    if (!ctx.user?.companyId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return this.positionsService.findAll(ctx.user.companyId);
  }

  @UseMiddlewares(AccessMiddleware)
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

  @UseMiddlewares(AccessMiddleware)
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

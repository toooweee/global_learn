import { Ctx, Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  CreateUserWithProfileDto,
  CreateUserWithProfileDtoSchema,
  FindCompanyUsersOptions,
  FindCompanyUsersOptionsDto,
  UserInputSchema,
  UserMeSchema,
  UserOutputSchema,
  UserWithProfileOutputSchema,
  CompanyUserOutputSchema,
  UpdateProfileDtoSchema,
  UploadAvatarOutputSchema,
  UserProfileSchema,
  UpdateProfileDto,
  CreateProfileDto,
  CreateProfileDtoSchema,
} from './user.schema';
import { z } from 'zod';
import { AccessMiddleware } from '../auth/middleware';
import { AppContextType } from '../trpc/app.context.interface';
import { TRPCError } from '@trpc/server';

@Router()
export class UsersRouter {
  constructor(private readonly usersService: UsersService) {}

  @Mutation({
    input: UserInputSchema,
    output: UserOutputSchema,
  })
  async createUser(@Input() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseMiddlewares(AccessMiddleware)
  @Query({
    input: z.object({ id: z.string().uuid() }),
    output: UserOutputSchema,
  })
  async findUser(@Input('id') id: string) {
    return this.usersService.findUser({ id });
  }

  @UseMiddlewares(AccessMiddleware)
  @Mutation({
    input: z.object({
      id: z.string().uuid(),
      data: UserInputSchema.partial(),
    }),
    output: UserOutputSchema,
  })
  async updateUser(@Input('id') id: string, @Input('data') updateUserDto: Partial<CreateUserDto>) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseMiddlewares(AccessMiddleware)
  @Mutation({
    input: z.object({ id: z.string().uuid() }),
    output: UserOutputSchema,
  })
  async deleteUser(@Input('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @UseMiddlewares(AccessMiddleware)
  @Query({
    output: UserMeSchema,
  })
  async me(@Ctx() ctx: AppContextType) {
    return this.usersService.me(ctx.user?.sub);
  }

  // for companies

  @UseMiddlewares(AccessMiddleware)
  @Mutation({
    input: CreateUserWithProfileDtoSchema,
    output: UserWithProfileOutputSchema,
  })
  async createUserWithProfile(@Input() dto: CreateUserWithProfileDto, @Ctx() ctx: AppContextType) {
    if (!ctx.user?.companyId) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No company access' });
    }
    return this.usersService.createUserWithProfile(ctx.user.companyId, dto);
  }

  @UseMiddlewares(AccessMiddleware)
  @Query({
    input: FindCompanyUsersOptions,
    output: z.array(CompanyUserOutputSchema),
  })
  async findAllUsers(@Ctx() ctx: AppContextType, @Input() findUsersInput: FindCompanyUsersOptionsDto) {
    return this.usersService.findAllUsers(ctx.user!.companyId!, findUsersInput);
  }

  @UseMiddlewares(AccessMiddleware)
  @Mutation({
    input: CreateProfileDtoSchema,
    output: UserProfileSchema,
  })
  async createProfile(@Input() dto: CreateProfileDto, @Ctx() ctx: AppContextType) {
    return this.usersService.createProfile(ctx.user!.sub, dto);
  }

  @UseMiddlewares(AccessMiddleware)
  @Mutation({
    input: UpdateProfileDtoSchema,
    output: UserProfileSchema,
  })
  async updateProfile(@Input() dto: UpdateProfileDto, @Ctx() ctx: AppContextType) {
    return this.usersService.updateProfile(ctx.user!.sub, dto);
  }
}

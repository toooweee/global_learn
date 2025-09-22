import { Ctx, Input, Mutation, Query, Router } from 'nestjs-trpc';
import { LoginDto, LoginSchema, TokenResponse } from './auth.schema';
import { AuthService } from './auth.service';
import { cookieFactory } from '@common/helpers';
import z from 'zod';
import { AppContextType } from '../trpc/app.context.interface';
import CONSTANTS from '@common/constants';
import { TRPCError } from '@trpc/server';

@Router()
export class AuthRouter {
  constructor(private readonly authService: AuthService) {}

  @Mutation({
    input: LoginSchema,
    output: TokenResponse,
  })
  async login(@Ctx() ctx: AppContextType, @Input() loginDto: LoginDto) {
    const userAgent = ctx.req.headers['user-agent'];

    const tokens = await this.authService.login(loginDto, userAgent || 'unknown');

    const cookies = cookieFactory(ctx.req, ctx.res);

    cookies.set(CONSTANTS.REFRESH_TOKEN, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
    };
  }

  @Query({
    output: TokenResponse,
  })
  async refresh(@Ctx() ctx: AppContextType) {
    const cookies = cookieFactory(ctx.req, ctx.res);

    const refreshToken = cookies.get(CONSTANTS.REFRESH_TOKEN);

    if (!refreshToken) {
      throw new TRPCError({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    const userAgent = ctx.req.headers['user-agent'];

    const tokens = await this.authService.refresh(refreshToken, userAgent || 'unknown');

    cookies.set(CONSTANTS.REFRESH_TOKEN, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
    };
  }

  @Mutation({
    output: z.object({
      success: z.boolean(),
    }),
  })
  async logout(@Ctx() ctx: AppContextType) {
    const cookies = cookieFactory(ctx.req, ctx.res);

    const refreshToken = cookies.get(CONSTANTS.REFRESH_TOKEN);

    if (!refreshToken) {
      throw new TRPCError({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    cookies.remove(CONSTANTS.REFRESH_TOKEN);

    await this.authService.logout(refreshToken);

    return {
      success: true,
    };
  }
}

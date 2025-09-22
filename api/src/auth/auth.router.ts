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
    const tokens = await this.authService.login(loginDto);

    const cookies = cookieFactory(ctx.req, ctx.res);

    cookies.set(CONSTANTS.REFRESH_TOKEN, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  @Query({
    output: TokenResponse,
  })
  async refresh(@Ctx() ctx: AppContextType) {
    console.log(ctx.req.headers);
    const cookies = cookieFactory(ctx.req, ctx.res);

    const refreshToken = cookies.get(CONSTANTS.REFRESH_TOKEN);

    if (!refreshToken) {
      throw new TRPCError({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    const tokens = await this.authService.refresh(refreshToken);

    cookies.set(CONSTANTS.REFRESH_TOKEN, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  @Query()
  async logout() {
    return this.authService.logout();
  }
}

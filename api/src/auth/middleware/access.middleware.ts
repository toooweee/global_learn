import { Injectable } from '@nestjs/common';
import { MiddlewareOptions, MiddlewareResponse, TRPCMiddleware } from 'nestjs-trpc';
import { TRPCError } from '@trpc/server';
import { AppContextType } from '../../trpc/app.context.interface';
import { TokensService } from '../../tokens/tokens.service';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class AccessMiddleware implements TRPCMiddleware {
  constructor(
    private readonly tokensService: TokensService,
    private readonly prismaService: PrismaService,
  ) {}

  async use(opts: MiddlewareOptions<AppContextType>): Promise<MiddlewareResponse> {
    const { ctx, next } = opts;

    const authHeader = ctx.req.headers['authorization'];

    if (!authHeader) {
      throw new TRPCError({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    const accessToken = authHeader.split(' ')[1];

    if (!accessToken) {
      throw new TRPCError({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    const payload = await this.tokensService.validateAccessToken(accessToken);

    if (!payload) {
      throw new TRPCError({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
      select: { companyId: true },
    });

    if (!user) {
      throw new TRPCError({
        message: 'Пользователь не привязан к компании',
        code: 'FORBIDDEN',
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: {
          ...payload,
          companyId: user.companyId || undefined,
        },
      },
    });
  }
}

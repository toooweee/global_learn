import { Injectable } from '@nestjs/common';
import { MiddlewareOptions, MiddlewareResponse, TRPCMiddleware } from 'nestjs-trpc';
import { AppContextType } from '../../trpc/app.context.interface';
import { cookieFactory } from '@common/helpers';

@Injectable()
export class RefreshMiddleware implements TRPCMiddleware {
  async use(opts: MiddlewareOptions<AppContextType>): Promise<MiddlewareResponse> {
    const { ctx, next } = opts;

    const cookies = cookieFactory(ctx.req, ctx.res);

    return next();
  }
}

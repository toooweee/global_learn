import { Injectable } from '@nestjs/common';
import { ContextOptions, TRPCContext } from 'nestjs-trpc';
import { Request, Response } from 'express';
import { AppContextType } from './app.context.interface';

@Injectable()
export class AppContext implements TRPCContext {
  constructor() {}

  create(opts: ContextOptions): AppContextType {
    const req = opts.req as Request & { cookies?: Record<string, string> };
    const res = opts.res as Response;

    return {
      req,
      res,
    };
  }
}

import type { Request, Response } from 'express';
import { JwtVerifyPayload } from '../tokens/types/jwt-payload.interface';

export interface AppContextType extends Record<string, unknown> {
  req: Request & { cookies?: Record<string, string> };
  res: Response;
  user?: JwtVerifyPayload;
}

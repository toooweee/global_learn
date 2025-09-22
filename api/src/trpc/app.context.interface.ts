import type { Request, Response } from 'express';

export interface AppContextType extends Record<string, unknown> {
  req: Request & { cookies?: Record<string, string> };
  res: Response;
}

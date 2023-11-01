import { Request } from 'express';

export function extractJWT(req: Request) {
  return req.cookies?.jwt ?? null;
}

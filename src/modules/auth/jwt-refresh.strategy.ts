import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-jwt';

import { extractJWT } from './utils';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: extractJWT,
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_PUBLIC_KEY,
    });
  }

  async validate(payload: any) {
    return payload;
  }
}

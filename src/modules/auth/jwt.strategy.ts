import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { extractJWT } from './utils/extractJwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: extractJWT,
      ignoreExpiration: false,
      secretOrKey: process.env.PUBLIC_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    this.validateCSRF(req);
    this.validateID(req);
    return payload;
  }

  private validateCSRF(req: Request) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const csrfToken = req.headers?.['x-xsrf-token'];
      if (!csrfToken || Array.isArray(csrfToken)) {
        throw new ForbiddenException(['CSRF error']);
      }

      try {
        return this.jwtService.verify(csrfToken, {
          secret: process.env.XSRF_SECRET,
        });
      } catch (error) {
        throw new ForbiddenException(['CSRF error']);
      }
    }
  }

  private validateID(req: Request) {
    const idToken = req.cookies?.['ID-TOKEN'];
    if (!idToken) {
      throw new ForbiddenException(['Forbidden access!']);
    }

    try {
      return this.jwtService.verify(idToken, {
        secret: process.env.ID_TOKEN_SECRET,
      });
    } catch (error) {
      throw new ForbiddenException(['Forbidden access!']);
    }
  }
}

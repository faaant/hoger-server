import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';

import { AccountsService } from '@modules/accounts/accounts.service';

import { LoginUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private accountsService: AccountsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<boolean> {
    const user = await this.accountsService.getAccountByUsername(username);
    return user && user.password === password;
  }

  async login(user: LoginUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
    ID_TOKEN: string;
  }> {
    if (await this.validateUser(user.username, user.password)) {
      const userInfo = await this.accountsService.getAccountByUsername(
        user.username,
      );

      const payload = {
        username: userInfo.username,
      };

      const idPayload = {
        username: userInfo.username,
        position: userInfo.position,
      };

      return {
        accessToken: this.jwtService.sign(payload, {
          privateKey: process.env.PRIVATE_KEY,
          expiresIn: '600s',
          algorithm: 'RS256',
        }),
        refreshToken: this.jwtService.sign(payload, {
          privateKey: process.env.REFRESH_PRIVATE_KEY,
          expiresIn: '1d',
          algorithm: 'RS256',
        }),
        ID_TOKEN: this.jwtService.sign(idPayload, {
          secret: process.env.ID_TOKEN_SECRET,
          expiresIn: '1d',
        }),
      };
    }
    throw new BadRequestException(['Uncorrect data']);
  }

  async refreshAccessToken(cookies: { jwt?: string }) {
    if (cookies?.jwt) {
      const tokenPayload = this.jwtService.verify(cookies.jwt, {
        publicKey: process.env.REFRESH_PUBLIC_KEY,
      });
      const payload = {
        username: tokenPayload?.username,
      };
      return this.jwtService.sign(payload, {
        privateKey: process.env.PRIVATE_KEY,
        expiresIn: '600s',
        algorithm: 'RS256',
      });
    }
    throw new UnauthorizedException(['Unauthorized']);
  }
}

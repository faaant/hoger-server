import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';

import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginUserDto, @Res() res: Response) {
    return this.authService.login(body).then((tokens) => {
      res.cookie('jwt', tokens.accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
      });
      res.cookie('jwt', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        path: 'api/auth/refresh',
      });
      res.cookie('ID-TOKEN', tokens.ID_TOKEN, {
        sameSite: 'lax',
        secure: true,
        path: '/',
      });
      return res.send();
    });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt=deleted; Max-Age=0; path=/');
    res.clearCookie('ID-TOKEN=deleted; Max-Age=0; path=/');
    res.cookie('jwt', 'deleted', {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: 'api/auth/refresh',
      maxAge: Date.now(),
    });
    return res.send();
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    return this.authService
      .refreshAccessToken(req.cookies)
      .then((accesToken) => {
        res.cookie('jwt', accesToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: true,
        });
        return res.json();
      });
  }
}

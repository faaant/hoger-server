import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { AuthGuard } from '@nestjs/passport';

import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginUserDto, @Res() res: Response) {
    const tokens = await this.authService.login(body);

    return res.json(tokens);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const tokens = await this.authService.refreshAccessToken(req.user);

    return res.json(tokens);
  }
}

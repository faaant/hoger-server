import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AccountsModule } from '@modules/accounts/accounts.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [JwtModule, AccountsModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}

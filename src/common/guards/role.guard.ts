import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Position } from '@common/models/accounts';
import { AccountsService } from '@modules/accounts';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private accountsService: AccountsService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Position[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const userInfo = await this.accountsService.getAccountByUsername(
      user?.username,
    );

    return requiredRoles.some((role) => userInfo.position === role);
  }
}

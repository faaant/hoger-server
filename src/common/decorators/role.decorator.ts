import { SetMetadata } from '@nestjs/common';

import { Position } from '@common/models/accounts';

export const Roles = (...roles: Position[]) => SetMetadata('roles', roles);

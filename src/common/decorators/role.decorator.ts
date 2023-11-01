import { SetMetadata } from '@nestjs/common';

import { Position } from '@common/interfaces/accounts/Position';

export const Roles = (...roles: Position[]) => SetMetadata('roles', roles);

import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AllExceptionsFilter } from './filters/exceptions.filter';
import { RolesGuard } from './guards/role.guard';

@Module({
  imports: [],
  controllers: [],
  providers: [
    RolesGuard,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class CommonModule {}

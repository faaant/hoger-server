import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Accounts } from '@entities/accounts.entity';
import { CleanerTasksModule } from '@modules/cleanerTasks';

import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accounts]),
    forwardRef(() => CleanerTasksModule),
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}

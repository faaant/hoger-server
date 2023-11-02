import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CleanerTasks } from '@entities/cleanerTasks.entity';
import { AccountsModule } from '@modules/accounts/accounts.module';
import { RoomsModule } from '@modules/rooms/rooms.module';

import { CleanerTasksController } from './cleanerTasks.controller';
import { CleanerTasksService } from './cleanerTasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CleanerTasks]),
    forwardRef(() => AccountsModule),
    RoomsModule,
  ],
  controllers: [CleanerTasksController],
  providers: [CleanerTasksService],
  exports: [CleanerTasksService],
})
export class CleanerTasksModule {}

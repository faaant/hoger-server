import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CleanerTasks } from '@entities/cleanerTasks.entity';
import { AccountsModule } from '@modules/accounts/accounts.module';
import { RoomModule } from '@modules/rooms/room.module';

import { CleanerTaskController } from './cleanerTask.controller';
import { CleanerTaskService } from './cleanerTask.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CleanerTasks]),
    AccountsModule,
    RoomModule,
  ],
  controllers: [CleanerTaskController],
  providers: [CleanerTaskService],
  exports: [CleanerTaskService],
})
export class CleanerTaskModule {}

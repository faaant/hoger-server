import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Orders } from '@entities/orders.entity';
import { AccountsModule } from '@modules/accounts/accounts.module';
import { CleanerTasksModule } from '@modules/cleanerTasks';
import { RoomsModule } from '@modules/rooms';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orders]),
    AccountsModule,
    RoomsModule,
    CleanerTasksModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}

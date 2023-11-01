import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Orders } from '@entities/orders.entity';
import { AccountsModule } from '@modules/accounts/accounts.module';
import { CleanerTaskModule } from '@modules/cleanerTasks/cleanerTask.module';
import { RoomModule } from '@modules/rooms/room.module';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orders]),
    AccountsModule,
    RoomModule,
    CleanerTaskModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AccountsModule } from '@modules/accounts/accounts.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CleanerTaskModule } from '@modules/cleanerTasks/cleanerTask.module';
import { OrderModule } from '@modules/orders/order.module';
import { RoomModule } from '@modules/rooms/room.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    RoomModule,
    OrderModule,
    AccountsModule,
    CleanerTaskModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

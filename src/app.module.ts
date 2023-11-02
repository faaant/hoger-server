import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AccountsModule } from '@modules/accounts/accounts.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CleanerTasksModule } from '@modules/cleanerTasks';
import { OrdersModule } from '@modules/orders';
import { RoomsModule } from '@modules/rooms';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AccountsModule,
    CleanerTasksModule,
    RoomsModule,
    OrdersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

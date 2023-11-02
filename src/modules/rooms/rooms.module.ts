import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Rooms } from '@entities/rooms.entity';
import { AccountsModule } from '@modules/accounts/accounts.module';

import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rooms]),
    forwardRef(() => AccountsModule),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}

import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Body, Res } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '@common/decorators/role.decorator';
import { RolesGuard } from 'common/guards/role.guard';
import { Response } from 'express';

import { CreateRoomDto } from './dto';
import { FilterRoomDto } from './dto/filterRoom.dto';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Roles('Admin', 'Receptionist')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getRooms(@Res() res: Response) {
    const data = await this.roomService.getAll();
    return res.json({
      data: this.roomService.convertBoolToString(data),
    });
  }

  @Roles('Admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async createRoom(@Body() body: CreateRoomDto, @Res() res: Response) {
    await this.roomService.createRoom(body);
    return res.json({
      message: ['Successfuly created!'],
    });
  }

  @Roles('Admin', 'Receptionist')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('/filter')
  async filterRooms(@Body() body: FilterRoomDto, @Res() res: Response) {
    const data = await this.roomService.filterRooms(body);
    return res.json({
      data: this.roomService.convertBoolToString(data),
    });
  }

  @Roles('Admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put()
  async updateRoomById(@Body() body: UpdateRoomDto, @Res() res: Response) {
    await this.roomService.updateRoom(body);
    return res.json({
      message: ['Successfuly updated!'],
    });
  }

  @Roles('Admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteRoomById(@Param() params: { id: string }, @Res() res: Response) {
    await this.roomService.deleteRoom(params.id);
    return res.json({
      message: ['Successfuly deleted!'],
    });
  }
}

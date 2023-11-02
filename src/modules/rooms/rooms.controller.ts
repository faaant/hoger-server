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
import { RolesGuard } from '@common/guards/role.guard';
import { Response } from 'express';

import { CreateRoomDto, FilterRoomDto, UpdateRoomDto } from './dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Roles('Admin', 'Receptionist')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getRooms(@Res() res: Response) {
    const data = await this.roomsService.getAll();
    return res.json({
      data: this.roomsService.convertBoolToString(data),
    });
  }

  @Roles('Admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async createRoom(@Body() body: CreateRoomDto, @Res() res: Response) {
    await this.roomsService.createRoom(body);
    return res.json({
      message: ['Successfuly created!'],
    });
  }

  @Roles('Admin', 'Receptionist')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('/filter')
  async filterRooms(@Body() body: FilterRoomDto, @Res() res: Response) {
    const data = await this.roomsService.filterRooms(body);
    return res.json({
      data: this.roomsService.convertBoolToString(data),
    });
  }

  @Roles('Admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put()
  async updateRoomById(@Body() body: UpdateRoomDto, @Res() res: Response) {
    await this.roomsService.updateRoom(body);
    return res.json({
      message: ['Successfuly updated!'],
    });
  }

  @Roles('Admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteRoomById(@Param() params: { id: string }, @Res() res: Response) {
    await this.roomsService.deleteRoom(params.id);
    return res.json({
      message: ['Successfuly deleted!'],
    });
  }
}

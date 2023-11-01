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

import { CreateOrderDto, UpdateOrderDto } from './dto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private ordersService: OrderService) {}

  @Roles('Admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getOrders(@Res() res: Response) {
    return res.json({
      data: await this.ordersService.getAll(),
    });
  }

  @Roles('Admin', 'Receptionist')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async createOrder(@Body() body: CreateOrderDto, @Res() res: Response) {
    await this.ordersService.createOrder(body);
    return res.json({
      message: ['Successfuly created!'],
    });
  }

  @Roles('Admin', 'Receptionist')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put()
  async completeOrder(@Body() body: UpdateOrderDto, @Res() res: Response) {
    await this.ordersService.updateOrder(body);
    return res.json({
      message: ['Successfuly updated!'],
    });
  }

  @Roles('Admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteOrderById(@Param() params: { id: string }, @Res() res: Response) {
    await this.ordersService.deleteOrder(params.id);
    return res.json({
      message: ['Successfuly deleted!'],
    });
  }
}

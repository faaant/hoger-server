import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Orders } from '@entities/orders.entity';
import { CleanerTasksService } from '@modules/cleanerTasks';
import { RoomsService } from '@modules/rooms';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { CreateOrderDto, OrderDto, UpdateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private orderRepository: Repository<OrderDto>,
    private roomsService: RoomsService,
    private cleanerTasksService: CleanerTasksService,
  ) {}

  async getAll(): Promise<OrderDto[]> {
    return this.orderRepository.find();
  }

  async getOrderById(id: string): Promise<OrderDto> {
    return (
      await this.orderRepository.find({
        where: [{ id }],
      })
    )[0];
  }

  async getOrderByRoom(roomId: string): Promise<OrderDto> {
    const orders = await this.orderRepository.find({
      where: [{ roomId, completed: false }],
    });

    if (orders.length > 1) {
      throw new InternalServerErrorException([
        'Two or more uncompleted orders on one room!',
      ]);
    }

    return orders[0];
  }

  async createOrder(order: CreateOrderDto): Promise<OrderDto> {
    const room = await this.roomsService.getRoomById(order.roomId);

    if (!room.free) {
      throw new BadRequestException(['Room is already booked!']);
    }

    const newOrder: Partial<OrderDto> = {
      ...order,
      date: new Date(),
      completed: false,
    };

    await this.roomsService.updateRoom({ id: order.roomId, free: false });
    await this.orderRepository.create(newOrder);
    return this.orderRepository.save(newOrder);
  }

  async updateOrder(orderUPD: UpdateOrderDto): Promise<UpdateResult> {
    let order: OrderDto = await this.getOrderByRoom(orderUPD.roomId);

    if (!order) {
      throw new BadRequestException([
        'Order is already completed, please refresh the page!',
      ]);
    }

    order = {
      ...order,
      completed: true,
      endDate: new Date(),
    };

    await this.roomsService.updateRoom({
      id: order.roomId,
      free: true,
      cleaningState: false,
    });
    await this.cleanerTasksService.createToMostFreeCleaner(order.roomId);

    return this.orderRepository.update(order.id, order);
  }

  async deleteOrder(id: string): Promise<DeleteResult> {
    return this.orderRepository.delete({ id });
  }
}

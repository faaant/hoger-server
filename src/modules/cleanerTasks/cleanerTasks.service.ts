import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CleanerTasks } from '@entities/cleanerTasks.entity';
import { AccountsService } from '@modules/accounts/accounts.service';
import { RoomsService } from '@modules/rooms';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import {
  CleanerTaskDto,
  CompleteCleanerTaskDto,
  CreateCleanerTaskDto,
  UpdateCleanerTaskDto,
} from './dto';

@Injectable()
export class CleanerTasksService {
  constructor(
    @InjectRepository(CleanerTasks)
    private cleanerTaskRepository: Repository<CleanerTaskDto>,
    private accountsService: AccountsService,
    private roomsService: RoomsService,
  ) {}

  async getAll(user?: { username?: string }): Promise<CleanerTaskDto[]> {
    if (user?.username) {
      const accountInfo = await this.accountsService.getAccountByUsername(
        user.username,
      );

      if (accountInfo.position !== 'Admin') {
        return this.cleanerTaskRepository.find({
          select: ['roomId'],
          where: [{ cleanerId: accountInfo.id, completed: false }],
        });
      }
    }

    return this.cleanerTaskRepository.find({
      select: ['id', 'cleanerId', 'roomId'],
      where: [{ completed: false }],
    });
  }

  async getById(id: string): Promise<CleanerTaskDto[]> {
    return this.cleanerTaskRepository.find({
      where: [{ id }],
    });
  }

  async getByRoomId(roomId: string): Promise<CleanerTaskDto> {
    const task = await this.cleanerTaskRepository.findOne({
      where: [{ roomId, completed: false }],
    });

    if (!task) {
      throw new InternalServerErrorException('No one task is found!');
    }

    return task;
  }

  async getByCleanerId(cleanerId: string): Promise<CleanerTaskDto[]> {
    return this.cleanerTaskRepository.find({
      where: [{ cleanerId, completed: false }],
    });
  }

  async create(cleanerTask: CreateCleanerTaskDto): Promise<CleanerTaskDto> {
    const task: Partial<CleanerTaskDto> = {
      ...cleanerTask,
      startDate: new Date(),
      completed: false,
    };
    await this.cleanerTaskRepository.create(task);
    return this.cleanerTaskRepository.save(task);
  }

  async createToMostFreeCleaner(roomId: string): Promise<CleanerTaskDto> {
    const cleanerId = await this.accountsService.getIdOfMostFreeCleaner();
    const task: Partial<CleanerTaskDto> = {
      roomId,
      cleanerId,
      startDate: new Date(),
      completed: false,
    };
    await this.cleanerTaskRepository.create(task);
    return this.cleanerTaskRepository.save(task);
  }

  async complete(
    cleanerTaskUPD: CompleteCleanerTaskDto,
  ): Promise<UpdateResult> {
    let cleanerTask = await this.getByRoomId(cleanerTaskUPD.roomId);
    if (!cleanerTask) {
      throw new BadRequestException(
        'Task is already done, please refresh the page!',
      );
    }

    cleanerTask = {
      ...cleanerTask,
      completed: true,
      endDate: new Date(),
    };
    await this.roomsService.updateRoom({
      id: cleanerTask.roomId,
      cleaningState: true,
    });
    return this.cleanerTaskRepository.update(cleanerTask.id, cleanerTask);
  }

  async update(id: string, data: UpdateCleanerTaskDto): Promise<DeleteResult> {
    return this.cleanerTaskRepository.update(id, data);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.cleanerTaskRepository.delete({ id });
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { CleanerTasks } from '@entities/cleanerTasks.entity';
import { AccountsService } from '@modules/accounts/accounts.service';
import { RoomService } from '@modules/rooms/room.service';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';

import {
  CleanerTaskDto,
  CreateCleanerTaskDto,
  UpdateCleanerTaskDto,
} from './dto';

@Injectable()
export class CleanerTaskService {
  constructor(
    @InjectRepository(CleanerTasks)
    private cleanerTaskRepository: Repository<CleanerTaskDto>,
    @InjectDataSource() private dataSource: DataSource,
    private accountsService: AccountsService,
    private roomService: RoomService,
  ) {}

  async getTasks(user?: { username?: string }): Promise<CleanerTaskDto[]> {
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

  async getCleanerTaskById(_id: string): Promise<CleanerTaskDto> {
    return (
      await this.cleanerTaskRepository.find({
        where: [{ id: _id }],
      })
    )[0];
  }

  async getCleanerTaskByRoomId(_roomId: string): Promise<CleanerTaskDto> {
    const tasks = await this.cleanerTaskRepository.find({
      where: [{ roomId: _roomId, completed: false }],
    });
    if (tasks.length > 1) {
      throw new InternalServerErrorException(['Two or more orders on one ID!']);
    }
    return tasks[0];
  }

  async getCleanerTasksByCleanerId(
    _cleanerId: string,
  ): Promise<CleanerTaskDto[]> {
    return this.cleanerTaskRepository.find({
      where: [{ cleanerId: _cleanerId, completed: false }],
    });
  }

  async createCleanerTask(
    cleanerTask: CreateCleanerTaskDto,
  ): Promise<CleanerTaskDto> {
    const task: Partial<CleanerTaskDto> = {
      ...cleanerTask,
      startDate: new Date(),
      completed: false,
    };
    await this.cleanerTaskRepository.create(task);
    return this.cleanerTaskRepository.save(task);
  }

  async createCleanerTaskToMostFreeCleaner(
    roomId: string,
  ): Promise<CleanerTaskDto> {
    const cleanerId = await this.getIdOfMostFreeCleaner();
    const task: Partial<CleanerTaskDto> = {
      roomId,
      cleanerId,
      startDate: new Date(),
      completed: false,
    };
    await this.cleanerTaskRepository.create(task);
    return this.cleanerTaskRepository.save(task);
  }

  async completeCleanerTaskByUser(
    cleanerTaskUPD: UpdateCleanerTaskDto,
  ): Promise<UpdateResult> {
    let cleanerTask = await this.getCleanerTaskByRoomId(cleanerTaskUPD.roomId);
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
    await this.roomService.updateRoom({
      id: cleanerTask.roomId,
      cleaningState: true,
    });
    return this.cleanerTaskRepository.update(cleanerTask.id, cleanerTask);
  }

  async deleteCleanerTask(id: string): Promise<DeleteResult> {
    return this.cleanerTaskRepository.delete({ id });
  }

  private async getIdOfMostFreeCleaner(): Promise<string> {
    return (
      await this.dataSource.query(`
      SELECT "userId" as "cleanerId" FROM (
        SELECT acc."id" as "userId", COUNT(ct."id") as "numOfTasks"
        FROM (SELECT * FROM account WHERE "position" = 'Cleaner' AND "deleted" = false) as acc
        LEFT JOIN (SELECT * FROM cleaner_task WHERE "completed" = false) as ct  
          ON ct."cleanerId" = acc."id"
        GROUP BY "userId"
        ORDER BY "numOfTasks" ASC
        LIMIT 1
      ) AS a;    
    `)
    )[0].cleanerId;
  }
}

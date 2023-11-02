import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Body, Res } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '@common/decorators/role.decorator';
import { RolesGuard } from '@common/guards/role.guard';
import { Request, Response } from 'express';

import { CleanerTasksService } from './cleanerTasks.service';
import { CompleteCleanerTaskDto, CreateCleanerTaskDto } from './dto';

@Controller('cleaner/tasks')
export class CleanerTasksController {
  constructor(private cleanerTasksService: CleanerTasksService) {}

  @Roles('Admin', 'Cleaner')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getTasks(@Req() req: Request, @Res() res: Response) {
    return res.json({
      data: await this.cleanerTasksService.getAll(req?.user),
    });
  }

  @Roles('Admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async createCleanerTask(
    @Body() body: CreateCleanerTaskDto,
    @Res() res: Response,
  ) {
    await this.cleanerTasksService.create(body);
    return res.json({
      message: ['Successfuly added!'],
    });
  }

  @Roles('Admin', 'Cleaner')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put()
  async completeCleanerTask(
    @Body() body: CompleteCleanerTaskDto,
    @Res() res: Response,
  ) {
    await this.cleanerTasksService.complete(body);
    return res.json({
      message: ['Successfuly updated!'],
    });
  }

  @Roles('Admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteCleanerTaskById(
    @Param() params: { id: string },
    @Res() res: Response,
  ) {
    this.cleanerTasksService.delete(params.id);
    return res.json({
      message: ['Successfuly deleted!'],
    });
  }
}

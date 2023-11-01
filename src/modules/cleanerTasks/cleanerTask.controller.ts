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
import { RolesGuard } from 'common/guards/role.guard';
import { Request, Response } from 'express';

import { CleanerTaskService } from './cleanerTask.service';
import { CreateCleanerTaskDto, UpdateCleanerTaskDto } from './dto';

@Controller('cleaner/tasks')
export class CleanerTaskController {
  constructor(private cleanerTasksService: CleanerTaskService) {}

  @Roles('Admin', 'Cleaner')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getTasks(@Req() req: Request, @Res() res: Response) {
    return res.json({
      data: await this.cleanerTasksService.getTasks(req?.user),
    });
  }

  @Roles('Admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async createCleanerTask(
    @Body() body: CreateCleanerTaskDto,
    @Res() res: Response,
  ) {
    await this.cleanerTasksService.createCleanerTask(body);
    return res.json({
      message: ['Successfuly added!'],
    });
  }

  @Roles('Admin', 'Cleaner')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put()
  async completeCleanerTask(
    @Body() body: UpdateCleanerTaskDto,
    @Res() res: Response,
  ) {
    await this.cleanerTasksService.completeCleanerTaskByUser(body);
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
    this.cleanerTasksService.deleteCleanerTask(params.id);
    return res.json({
      message: ['Successfuly deleted!'],
    });
  }
}

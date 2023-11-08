import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Body, Res } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '@common/decorators/role.decorator';
import { RolesGuard } from '@common/guards/role.guard';
import { Response } from 'express';

import { AccountsService } from './accounts.service';
import { CreateAccountDto, DeleteAccountDto } from './dto';

@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Roles('Admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getAccounts(@Res() res: Response) {
    return res.json({
      data: await this.accountsService.getAll(),
    });
  }

  @Roles('Admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async createAccount(@Body() body: CreateAccountDto, @Res() res: Response) {
    try {
      await this.accountsService.create(body);
    } catch {
      throw new BadRequestException('User with such username already exist');
    }

    return res.json({
      message: ['Successfuly created!'],
    });
  }

  @Roles('Admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete()
  async deleteAccountById(
    @Body() body: DeleteAccountDto,
    @Res() res: Response,
  ) {
    await this.accountsService.deleteAccount(body);
    return res.json({
      message: ['Successfuly deleted!'],
    });
  }
}

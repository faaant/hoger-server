import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Position } from '@common/models/accounts';
import { Accounts } from '@entities/accounts.entity';
import { CleanerTasksService } from '@modules/cleanerTasks';
import { DeleteResult, Repository } from 'typeorm';

import { AccountDto, CreateAccountDto, DeleteAccountDto } from './dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Accounts)
    private accountRepository: Repository<AccountDto>,
    @Inject(forwardRef(() => CleanerTasksService))
    private cleanerTasksService: CleanerTasksService,
  ) {}

  async getAll(): Promise<AccountDto[]> {
    const accounts = await this.accountRepository.find({
      select: ['username', 'name', 'surname', 'position'],
      where: { deleted: false },
    });

    return this.sortByPositionAsc(this.addControls(accounts));
  }

  private addControls(accounts: AccountDto[]): AccountDto[] {
    return accounts.map((account) => {
      const controls: string[] = [];
      if (account.position !== 'Admin') {
        controls.push('Delete');
      }
      return {
        ...account,
        controls,
      };
    });
  }

  private sortByPositionAsc(accounts: AccountDto[]): AccountDto[] {
    return accounts.sort((left, right) => {
      if (left.position > right.position) {
        return 1;
      }

      if (left.position < right.position) {
        return -1;
      }

      return 0;
    });
  }

  async getAccountInfo(user?: {
    username?: string;
  }): Promise<AccountDto | undefined> {
    if (user?.username) {
      return (
        await this.accountRepository.find({
          select: ['username', 'position'],
          where: [{ username: user.username }],
        })
      )[0];
    }
  }

  async getAccountById(id: string): Promise<AccountDto> {
    return (
      await this.accountRepository.find({
        where: [{ id }],
      })
    )[0];
  }

  async getAccountByUsername(username: string): Promise<AccountDto> {
    return (
      await this.accountRepository.find({
        where: [{ username }],
      })
    )[0];
  }

  async getAccountsByPosition(_position: Position): Promise<AccountDto[]> {
    return this.accountRepository.find({
      select: ['id', 'username', 'name', 'surname', 'position', 'password'],
      where: [{ position: _position, deleted: false }],
    });
  }

  async getIdOfMostFreeCleaner(): Promise<string> {
    const cleaners = await this.getAccountsByPosition('Cleaner');

    const freeCleaner = (
      await Promise.all(
        cleaners.map(async (cleaner) => {
          return {
            id: cleaner.id,
            tasksCount: (
              await this.cleanerTasksService.getByCleanerId(cleaner.id)
            ).length,
          };
        }),
      )
    ).reduce((left, right) => {
      if (left.tasksCount < right.tasksCount) {
        return left;
      }

      return right;
    });

    return freeCleaner.id;
  }

  async create(account: CreateAccountDto): Promise<AccountDto> {
    if (account.position === 'Admin') {
      throw new ForbiddenException("Admin can't be created!");
    }
    await this.accountRepository.create({ ...account, deleted: false });
    return this.accountRepository.save({ ...account, deleted: false });
  }

  async deleteAccount(account: DeleteAccountDto): Promise<DeleteResult | any> {
    const accountToDelete = await this.getAccountByUsername(account.username);
    if (accountToDelete.position === 'Cleaner') {
      const activeTasksOfCleaner =
        await this.cleanerTasksService.getByCleanerId(accountToDelete.id);

      const cleaners = await this.getAccountsByPosition('Cleaner');
      if (cleaners.length < 2) {
        throw new InternalServerErrorException([
          'It is not possible to remove the last cleaner until all active tasks are completed!',
        ]);
      }

      let cleanerIndex = -1;
      for (const task of activeTasksOfCleaner) {
        cleanerIndex++;
        if (cleaners[cleanerIndex].id === accountToDelete.id) {
          cleanerIndex++;
        }
        if (!cleaners?.[cleanerIndex]) {
          cleanerIndex = 0;
        }

        await this.cleanerTasksService.update(task.id, {
          cleanerId: cleaners[cleanerIndex].id,
        });
      }
    }

    return this.accountRepository.update(accountToDelete.id, { deleted: true });
  }
}

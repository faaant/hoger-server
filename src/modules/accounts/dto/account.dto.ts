import { CreateAccountDto } from './createAccount.dto';

export class AccountDto extends CreateAccountDto {
  id!: string;

  controls?: string[];
}

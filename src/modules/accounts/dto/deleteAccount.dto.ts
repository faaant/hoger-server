import { IsNotEmpty } from 'class-validator';

export class DeleteAccountDto {
  @IsNotEmpty({
    message: "Username can't be empty!",
  })
  username!: string;
}

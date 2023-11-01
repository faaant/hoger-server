import { Position } from '@common/interfaces/accounts/Position';
import { Allow, IsNotEmpty, Length } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty({
    message: "username can't be empty",
  })
  username!: string;

  @IsNotEmpty({
    message: "name can't be empty",
  })
  name!: string;

  @IsNotEmpty({
    message: "surname can't be empty",
  })
  surname!: string;

  @IsNotEmpty({
    message: "position can't be empty",
  })
  position!: Position;

  @Length(8, 14, {
    message: 'Password length should be in range 8-14',
  })
  password!: string;

  @Allow()
  deleted?: boolean;
}

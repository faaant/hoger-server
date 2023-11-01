import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({
    message: "Username can't be empty",
  })
  username!: string;

  @IsNotEmpty({
    message: "Password can't be empty",
  })
  password!: string;
}

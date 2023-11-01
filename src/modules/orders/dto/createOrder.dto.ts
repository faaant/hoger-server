import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({
    message: "Room id can't be empty",
  })
  roomId!: string;

  @IsNotEmpty({
    message: "Name can't be empty",
  })
  name!: string;

  @IsNotEmpty({
    message: "Surname can't be empty",
  })
  surname!: string;

  @IsNotEmpty({
    message: "Phone date can't be empty",
  })
  @IsPhoneNumber(undefined, {
    message: 'Phone not correct!',
  })
  phone!: string;
}

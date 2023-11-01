import { IsNotEmpty } from 'class-validator';

export class UpdateOrderDto {
  @IsNotEmpty({
    message: "Room id can't be empty",
  })
  roomId!: string;
}

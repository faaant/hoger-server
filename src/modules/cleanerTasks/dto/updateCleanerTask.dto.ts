import { IsNotEmpty } from 'class-validator';

export class UpdateCleanerTaskDto {
  @IsNotEmpty({
    message: "Room id can't be empty",
  })
  roomId!: string;
}

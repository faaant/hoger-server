import { IsNotEmpty } from 'class-validator';

export class CreateCleanerTaskDto {
  @IsNotEmpty({
    message: "Room id can't be empty",
  })
  roomId!: string;

  @IsNotEmpty({
    message: "Cleaner id can't be empty",
  })
  cleanerId!: string;
}

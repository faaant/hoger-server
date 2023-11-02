import { IsNotEmpty } from 'class-validator';

export class CompleteCleanerTaskDto {
  @IsNotEmpty()
  roomId!: string;
}

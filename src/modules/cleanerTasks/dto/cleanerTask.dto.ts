import { CreateCleanerTaskDto } from './createCleanerTask.dto';

export class CleanerTaskDto extends CreateCleanerTaskDto {
  id!: string;

  startDate!: Date;

  endDate?: Date;

  completed!: boolean;
}

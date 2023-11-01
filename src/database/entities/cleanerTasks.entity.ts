import {
  Check,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Accounts } from './accounts.entity';
import { Rooms } from './rooms.entity';

@Entity()
@Check('"endDate">="startDate"')
export class CleanerTasks {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  completed!: boolean;

  @Column()
  roomId!: number;

  @Column()
  cleanerId!: string;

  @Column({ type: 'timestamptz' })
  startDate!: Date;

  @Column({
    nullable: true,
    type: 'timestamptz',
  })
  endDate!: Date;

  @ManyToOne(() => Rooms, (room) => room)
  room!: Rooms;

  @ManyToOne(() => Accounts, (acc) => acc)
  cleaner!: Accounts;
}

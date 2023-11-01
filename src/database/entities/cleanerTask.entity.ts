import {
  Check,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Room } from './room.entity';

@Entity()
@Check('"endDate">="startDate"')
export class CleanerTask {
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

  @ManyToOne(() => Room, (room) => room)
  room!: Room;

  @ManyToOne(() => Account, (acc) => acc)
  cleaner!: Account;
}

import {
  Check,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.entity';

@Entity()
@Check('"endDate">"date"')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  completed!: boolean;

  @Column({ type: 'timestamptz' })
  date!: Date;

  @Column({
    nullable: true,
    type: 'timestamptz',
  })
  endDate!: Date;

  @Column()
  name!: string;

  @Column()
  surname!: string;

  @Column()
  phone!: string;

  @Column()
  roomId!: number;

  @ManyToOne(() => Room, (room) => room)
  room!: Room;
}

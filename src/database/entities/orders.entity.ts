import {
  Check,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Rooms } from './rooms.entity';

@Entity()
@Check('"endDate">"date"')
export class Orders {
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

  @ManyToOne(() => Rooms, (room) => room)
  room!: Rooms;
}

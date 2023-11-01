import { Position } from '@common/interfaces/accounts/Position';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  name!: string;

  @Column()
  surname!: string;

  @Column()
  position!: Position;

  @Column()
  password!: string;

  @Column()
  deleted!: boolean;
}

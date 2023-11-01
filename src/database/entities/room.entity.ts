import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Check('"avNumOfPeople"<6')
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  cleaningState!: boolean;

  @Column()
  connectedRooms!: boolean;

  @Column()
  balcony!: boolean;

  @Column()
  avNumOfPeople!: number;

  @Column()
  free!: boolean;
}

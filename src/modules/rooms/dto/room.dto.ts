import { CreateRoomDto } from './createRoom.dto';

export class RoomDto extends CreateRoomDto {
  id!: string;

  controls?: string[];
}

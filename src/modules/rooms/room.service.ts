import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RoomInfo } from '@common/interfaces/room/RoomInfo.interface';
import { Rooms } from '@entities/rooms.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { CreateRoomDto, RoomDto, UpdateRoomDto } from './dto';
import { FilterRoomDto } from './dto/filterRoom.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Rooms)
    private roomRepository: Repository<RoomDto>,
  ) {}

  async getAll(): Promise<RoomDto[]> {
    const rooms = await this.roomRepository.find();
    return this.sortByIdAsc(this.addControls(rooms));
  }

  private addControls(rooms: RoomDto[]): RoomDto[] {
    return rooms.map((room) => {
      const controls: string[] = [];
      if (room.free && room.cleaningState) {
        controls.push('Book');
      }

      if (!room.free && room.cleaningState) {
        controls.push('Unbook');
      }

      return {
        ...room,
        controls,
      };
    });
  }

  private sortByIdAsc(rooms: RoomDto[]): RoomDto[] {
    return rooms.sort((left, right) => {
      if (+left.id > +right.id) {
        return 1;
      }

      if (+left.id < +right.id) {
        return -1;
      }

      return 0;
    });
  }

  async getRoomById(_id: string): Promise<RoomDto> {
    return (
      await this.roomRepository.find({
        where: [{ id: _id }],
      })
    )[0];
  }

  async updateRoom(room: UpdateRoomDto): Promise<UpdateResult> {
    return this.roomRepository.update(room.id, room);
  }

  async createRoom(room: CreateRoomDto): Promise<RoomDto> {
    await this.roomRepository.create(room);
    return this.roomRepository.save(room);
  }

  async deleteRoom(id: string): Promise<DeleteResult> {
    return this.roomRepository.delete({ id });
  }

  async filterRooms(filters: FilterRoomDto) {
    let rooms = await this.roomRepository.find();
    for (const key in filters) {
      rooms = rooms.filter((room) => {
        const curRoom = room as RoomInfo;
        if (
          filters[key].comparisonNumberSymbol !== 'not selected' &&
          filters[key].comparisonValue
        ) {
          switch (filters[key].comparisonNumberSymbol) {
            case 'equal':
              return filters[key].comparisonValue === curRoom[key];
            case 'greater':
              return filters[key].comparisonValue < curRoom[key];
            case 'lower':
              return filters[key].comparisonValue > curRoom[key];
          }
        }

        if (
          !filters[key].comparisonNumberSymbol &&
          filters[key]?.comparisonValue
        ) {
          return filters[key].comparisonValue === curRoom[key].toString();
        }

        return true;
      });
    }
    return this.sortByIdAsc(this.addControls(rooms));
  }

  convertBoolToString(rooms: RoomDto[]) {
    return rooms.map((room) => ({
      ...room,
      cleaningState: room.cleaningState ? 'clean' : 'dirty',
      connectedRooms: room.connectedRooms ? 'present' : 'absent',
      balcony: room.balcony ? 'present' : 'absent',
      free: room.free ? 'free' : 'booked',
    }));
  }
}

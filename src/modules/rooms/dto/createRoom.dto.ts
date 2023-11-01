import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty({
    message: 'Field cleaning state is empty',
  })
  cleaningState!: boolean;

  @IsNotEmpty({
    message: 'Field connected rooms is empty',
  })
  connectedRooms!: boolean;

  @IsNotEmpty({
    message: 'Field balcony is empty',
  })
  balcony!: boolean;

  @IsNotEmpty({
    message: "Average number of people can't be empty",
  })
  @IsNumber(
    {},
    {
      message: 'Average number of people must be number',
    },
  )
  @Min(1, {
    message: 'Average number of people must be in greater than 1',
  })
  @Max(5, {
    message: 'Average number of people must be in lower than 7',
  })
  avNumOfPeople!: number;

  @IsNotEmpty({
    message: 'Field is room free empty',
  })
  free!: boolean;
}

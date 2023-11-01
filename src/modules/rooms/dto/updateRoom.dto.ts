import { IsNotEmpty, IsNumber, Max, Min, ValidateIf } from 'class-validator';

export class UpdateRoomDto {
  @IsNotEmpty({
    message: "id can't be empty",
  })
  id!: string;

  @ValidateIf((obj) => obj?.cleaningState)
  @IsNotEmpty({
    message: "Cleaning state field can't be empty",
  })
  cleaningState?: boolean;

  @ValidateIf((obj) => obj?.connectedRooms)
  @IsNotEmpty({
    message: "Connected rooms field can't be empty",
  })
  connectedRooms?: boolean;

  @ValidateIf((obj) => obj?.balcony)
  @IsNotEmpty({
    message: "Balcony existence can't be empty",
  })
  balcony?: boolean;

  @ValidateIf((obj) => obj?.avNumOfPeople)
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
  @Max(7, {
    message: 'Average number of people must be in lower than 7',
  })
  avNumOfPeople?: number;

  @ValidateIf((obj) => obj?.free)
  @IsNotEmpty({
    message: "Availability state of romm can't be empty",
  })
  free?: boolean;
}

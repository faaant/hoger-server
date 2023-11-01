export interface FilterRoomDto {
  id: FilterData;
  cleaningState: FilterData;
  connectedRooms: FilterData;
  balcony: FilterData;
  avNumOfPeople: FilterData;
  free: FilterData;
  [key: string]: FilterData;
}

interface FilterData {
  comparisonValue: number | string | boolean;
  comparisonNumberSymbol?: string;
}

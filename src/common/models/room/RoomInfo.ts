export interface RoomInfo {
  id: string;
  cleaningState: boolean;
  connectedRooms: boolean;
  balcony: boolean;
  avNumOfPeople: number;
  free: boolean;
  [key: string]: string | boolean | number;
}

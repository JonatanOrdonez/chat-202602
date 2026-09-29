export interface Room {
  id: string;
  name: string;
}

export interface CreateRoomDTO {
  name: string;
}

export interface Message {
  id: string;
  roomId: string;
  username: string;
  content: string;
  createdAt: Date;
}

export interface CreateMessageDTO {
  roomId: string;
  username: string;
  content: string;
}

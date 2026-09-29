import Boom from '@hapi/boom';
import {
  createMessageRepository,
  createRoomRepository,
  deleteRoomRepository,
  getMessagesByRoomIdRepository,
  getRoomByIdRepository,
  getRoomsRepository,
} from './chat.repository';
import { CreateMessageDTO, CreateRoomDTO, Message, Room } from './chat.types';

export const createRoomService = async (room: CreateRoomDTO): Promise<Room> => {
  return createRoomRepository(room);
};

export const getRoomsService = async (): Promise<Room[]> => {
  return getRoomsRepository();
};

export const getRoomByIdService = async (id: string): Promise<Room> => {
  const room = await getRoomByIdRepository(id);

  if (!room) {
    throw Boom.notFound('Room not found');
  }

  return room;
};

export const deleteRoomService = async (id: string): Promise<void> => {
  const room = await getRoomByIdRepository(id);

  if (!room) {
    throw Boom.notFound('Room not found');
  }

  await deleteRoomRepository(id);
};

export const createMessageService = async (message: CreateMessageDTO): Promise<Message> => {
  const room = await getRoomByIdRepository(message.roomId);

  if (!room) {
    throw Boom.notFound('Room not found');
  }

  return createMessageRepository(message);
};

export const getMessagesByRoomIdService = async (roomId: string): Promise<Message[]> => {
  const room = await getRoomByIdRepository(roomId);

  if (!room) {
    throw Boom.notFound('Room not found');
  }

  return getMessagesByRoomIdRepository(roomId);
};

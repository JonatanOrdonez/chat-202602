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
import { supabase } from '../../config/supabase';

const broadcastToRooms = async (event: string, payload: object) => {
  const channel = supabase.channel('rooms');
  try {
    await channel.httpSend(event, payload);
  } catch (error) {
    console.error(`Failed to broadcast ${event}`, error);
  } finally {
    await supabase.removeChannel(channel);
  }
};

export const createRoomService = async (room: CreateRoomDTO): Promise<Room> => {
  const newRoom = await createRoomRepository(room);
  broadcastToRooms('room-created', newRoom);
  return newRoom;
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
  broadcastToRooms('room-deleted', { id: room.id });
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

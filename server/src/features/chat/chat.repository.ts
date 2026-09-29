import { pool } from '../../db/db';
import { CreateMessageDTO, CreateRoomDTO, Message, Room } from './chat.types';

export const createRoomRepository = async (room: CreateRoomDTO): Promise<Room> => {
  const result = await pool.query<Room>(
    'INSERT INTO public.rooms (name) VALUES ($1) RETURNING id, name',
    [room.name],
  );

  return result.rows[0];
};

export const getRoomsRepository = async (): Promise<Room[]> => {
  const result = await pool.query<Room>('SELECT id, name FROM public.rooms');

  return result.rows;
};

export const getRoomByIdRepository = async (id: string): Promise<Room | undefined> => {
  const result = await pool.query<Room>('SELECT id, name FROM public.rooms WHERE id = $1', [id]);

  return result.rows[0];
};

export const deleteRoomRepository = async (id: string): Promise<void> => {
  await pool.query('DELETE FROM public.rooms WHERE id = $1', [id]);
};

export const createMessageRepository = async (message: CreateMessageDTO): Promise<Message> => {
  const result = await pool.query<Message>(
    `INSERT INTO public.messages (room_id, username, content)
     VALUES ($1, $2, $3)
     RETURNING id, room_id AS "roomId", username, content, created_at AS "createdAt"`,
    [message.roomId, message.username, message.content],
  );

  return result.rows[0];
};

export const getMessagesByRoomIdRepository = async (roomId: string): Promise<Message[]> => {
  const result = await pool.query<Message>(
    `SELECT id, room_id AS "roomId", username, content, created_at AS "createdAt"
     FROM public.messages
     WHERE room_id = $1
     ORDER BY created_at ASC`,
    [roomId],
  );

  return result.rows;
};

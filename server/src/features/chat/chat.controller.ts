import Boom from '@hapi/boom';
import { Request, Response } from 'express';
import {
  createMessageService,
  createRoomService,
  deleteRoomService,
  getMessagesByRoomIdService,
  getRoomByIdService,
  getRoomsService,
} from './chat.service';

export const createRoomController = async (req: Request, res: Response) => {
  if (!req.body.name) {
    throw Boom.badRequest('Name is required');
  }

  const newRoom = await createRoomService({ name: req.body.name });

  res.status(201).json(newRoom);
};

export const getRoomsController = async (req: Request, res: Response) => {
  const rooms = await getRoomsService();
  res.status(200).json(rooms);
};

export const getRoomByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const room = await getRoomByIdService(String(id));
  res.status(200).json(room);
};

export const deleteRoomController = async (req: Request, res: Response) => {
  const id = req.params.id;
  await deleteRoomService(String(id));
  res.status(204).send();
};

export const createMessageController = async (req: Request, res: Response) => {
  const roomId = req.params.roomId;

  if (!req.body.username) {
    throw Boom.badRequest('Username is required');
  }

  if (!req.body.content) {
    throw Boom.badRequest('Content is required');
  }

  const newMessage = await createMessageService({
    roomId: String(roomId),
    username: req.body.username,
    content: req.body.content,
  });

  res.status(201).json(newMessage);
};

export const getMessagesController = async (req: Request, res: Response) => {
  const roomId = req.params.roomId;
  const messages = await getMessagesByRoomIdService(String(roomId));
  res.status(200).json(messages);
};

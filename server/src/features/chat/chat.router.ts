import { Router } from 'express';
import {
  createMessageController,
  createRoomController,
  deleteRoomController,
  getMessagesController,
  getRoomByIdController,
  getRoomsController,
} from './chat.controller';

const router = Router();

router.post('/rooms', createRoomController);
router.get('/rooms', getRoomsController);
router.get('/rooms/:id', getRoomByIdController);
router.delete('/rooms/:id', deleteRoomController);

router.post('/rooms/:roomId/messages', createMessageController);
router.get('/rooms/:roomId/messages', getMessagesController);

export default router;

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Message, Room } from '@/lib/types';

interface RoomContextValue {
  room: Room | null;
  messages: Message[];
  createMessage: (username: string, content: string) => Promise<void>;
  deleteRoom: () => Promise<void>;
}

const RoomContext = createContext<RoomContextValue | null>(null);

export const RoomProvider = ({
  roomId,
  children,
}: {
  roomId: string;
  children: React.ReactNode;
}) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const onInit = () =>
    Promise.all([
      api.get<Room>(`/rooms/${roomId}`),
      api.get<Message[]>(`/rooms/${roomId}/messages`),
    ]);

  useEffect(() => {
    onInit().then(([roomRes, messagesRes]) => {
      setRoom(roomRes.data);
      setMessages(messagesRes.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const createMessage = async (username: string, content: string) => {
    const res = await api.post<Message>(`/rooms/${roomId}/messages`, { username, content });
    setMessages((prev) => [...prev, res.data]);
  };

  const deleteRoom = async () => {
    await api.delete(`/rooms/${roomId}`);
  };

  return (
    <RoomContext.Provider value={{ room, messages, createMessage, deleteRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);

  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }

  return context;
};

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Message, Room } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

 useEffect(() => {
      const roomChannel = supabase
    .channel(`rooms:${roomId}`)
    .on('broadcast', { event: 'room-deleted' }, ({ payload }) => {
      router.push('/');
    })
    .on('broadcast', { event: 'message-created' }, ({ payload }) => {
      setMessages((prev) => prev.find((msg) => msg.id === (payload as Message).id) ? prev : [...prev, payload as Message]);
    })
    .subscribe();


   const onInit = async () => {
     const [roomRes, messagesRes] = await Promise.all([
       api.get<Room>(`/rooms/${roomId}`),
       api.get<Message[]>(`/rooms/${roomId}/messages`),
     ]);
     setRoom(roomRes.data);
     setMessages(messagesRes.data);
   };


   onInit();


   return () => {
     supabase.removeChannel(roomChannel);
   };
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

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Room } from '@/lib/types';

interface RoomsContextValue {
  rooms: Room[];
  createRoom: (name: string) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
}

const RoomsContext = createContext<RoomsContextValue | null>(null);

export const RoomsProvider = ({ children }: { children: React.ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const onInit = async () => {
      const res = await api.get<Room[]>('/rooms');
      setRooms(res.data);
    };

    onInit();
  }, []);

  const createRoom = async (name: string) => {
    const res = await api.post<Room>('/rooms', { name });
    setRooms((prev) => [...prev, res.data]);
  };

  const deleteRoom = async (id: string) => {
    await api.delete(`/rooms/${id}`);
    setRooms((prev) => prev.filter((room) => room.id !== id));
  };

  return (
    <RoomsContext.Provider value={{ rooms, createRoom, deleteRoom }}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => {
  const context = useContext(RoomsContext);

  if (!context) {
    throw new Error('useRooms must be used within a RoomsProvider');
  }

  return context;
};

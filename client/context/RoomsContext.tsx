'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { supabase } from '@/lib/supabase';
import { Room } from '@/lib/types';

interface RoomsContextValue {
  rooms: Room[];
  createRoom: (name: string) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
}

const appendRoom = (rooms: Room[], room: Room) =>
  rooms.some((r) => r.id === room.id) ? rooms : [...rooms, room];

const RoomsContext = createContext<RoomsContextValue | null>(null);

export const RoomsProvider = ({ children }: { children: React.ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const roomsChannel = supabase
      .channel('rooms')
      .on('broadcast', { event: 'room-created' }, ({ payload }) => {
        setRooms((prev) => appendRoom(prev, payload as Room));
      })
      .on('broadcast', { event: 'room-deleted' }, ({ payload }) => {
        setRooms((prev) => prev.filter((room) => room.id !== (payload as { id: string }).id));
      })
      .subscribe();

    const onInit = async () => {
      const res = await api.get<Room[]>('/rooms');
      setRooms((prev) => res.data.reduce(appendRoom, prev));
    };

    onInit();

    return () => {
      supabase.removeChannel(roomsChannel);
    };
  }, []);

  const createRoom = async (name: string) => {
    const res = await api.post<Room>('/rooms', { name });
    setRooms((prev) => appendRoom(prev, res.data));
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

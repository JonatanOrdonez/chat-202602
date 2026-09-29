'use client';

import { useState } from 'react';
import { useRooms } from '@/context/RoomsContext';

export const CreateRoomForm = () => {
  const { createRoom } = useRooms();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createRoom(name.trim());
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="border rounded px-2 py-1"
        placeholder="Room name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" className="border rounded px-2 py-1">
        Create room
      </button>
    </form>
  );
};

'use client';

import { useRooms } from '@/context/RoomsContext';
import { RoomItem } from './RoomItem';

export const RoomsList = () => {
  const { rooms, deleteRoom } = useRooms();

  return (
    <div className="flex flex-col gap-2">
      {rooms.map((room) => (
        <RoomItem
          key={room.id}
          room={room}
          href={`/rooms/${room.id}`}
          onDelete={() => deleteRoom(room.id)}
        />
      ))}
    </div>
  );
};

'use client';

import Link from 'next/link';
import { Room } from '@/lib/types';

interface RoomItemProps {
  room: Room;
  onDelete: () => void;
  href?: string;
}

export const RoomItem = ({ room, onDelete, href }: RoomItemProps) => {
  return (
    <div className="flex items-center justify-between border rounded px-3 py-2">
      {href ? <Link href={href}>{room.name}</Link> : <span>{room.name}</span>}
      <button onClick={onDelete} className="border rounded px-2 py-1">
        Delete
      </button>
    </div>
  );
};

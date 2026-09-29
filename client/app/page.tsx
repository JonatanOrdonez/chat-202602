'use client';

import { RoomsProvider } from '@/context/RoomsContext';
import { CreateRoomForm } from '@/components/CreateRoomForm';
import { RoomsList } from '@/components/RoomsList';
import { useUsername } from '@/context/UserContext';

export default function Home() {
  const {username} = useUsername();
  return (
    <RoomsProvider>
      <main className="flex flex-col gap-4 max-w-md mx-auto py-10 px-4">
        <h1 className="text-xl font-semibold">{username}</h1>
        <h2 className="text-xl font-semibold">Rooms</h2>
        <CreateRoomForm />
        <RoomsList />
      </main>
    </RoomsProvider>
  );
}

'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { RoomProvider, useRoom } from '@/context/RoomContext';
import { RoomItem } from '@/components/RoomItem';
import { MessagesList } from '@/components/MessagesList';
import { CreateMessageForm } from '@/components/CreateMessageForm';

const RoomDetails = () => {
  const { room, deleteRoom } = useRoom();
  const router = useRouter();

  if (!room) {
    return <p>Loading...</p>;
  }

  const handleDelete = async () => {
    await deleteRoom();
    router.push('/');
  };

  return (
    <>
      <RoomItem room={room} onDelete={handleDelete} />
      <MessagesList />
      <CreateMessageForm />
    </>
  );
};

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <RoomProvider roomId={id}>
      <main className="flex flex-col gap-4 max-w-md mx-auto py-10 px-4">
        <RoomDetails />
      </main>
    </RoomProvider>
  );
}

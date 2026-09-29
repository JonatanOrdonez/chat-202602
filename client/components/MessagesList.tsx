'use client';

import { useRoom } from '@/context/RoomContext';

export const MessagesList = () => {
  const { messages } = useRoom();

  return (
    <div className="flex flex-col gap-2">
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.username}: </strong>
          {message.content}
        </div>
      ))}
    </div>
  );
};

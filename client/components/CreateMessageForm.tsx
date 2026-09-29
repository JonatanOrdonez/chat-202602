'use client';

import { useState } from 'react';
import { useRoom } from '@/context/RoomContext';
import { useUsername } from '@/context/UserContext';

export const CreateMessageForm = () => {
  const { createMessage } = useRoom();
  const { username } = useUsername();
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !username) return;
    createMessage(username, content.trim());
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="border rounded px-2 py-1"
        placeholder="Message"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit" className="border rounded px-2 py-1">
        Send
      </button>
    </form>
  );
};

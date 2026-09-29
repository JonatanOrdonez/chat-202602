'use client';

import { useState } from 'react';
import { useUsername } from '@/context/UserContext';

export const UsernameModal = () => {
  const { username, setUsername } = useUsername();
  const [value, setValue] = useState('');

  if (username !== null) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setUsername(value.trim());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded bg-white p-6">
        <label htmlFor="username">Choose a username</label>
        <input
          id="username"
          className="border rounded px-2 py-1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        <button type="submit" className="border rounded px-2 py-1">
          Save
        </button>
      </form>
    </div>
  );
};

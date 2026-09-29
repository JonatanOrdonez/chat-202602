'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'username';
const listeners = new Set<() => void>();

const getSnapshot = () => localStorage.getItem(STORAGE_KEY);
const getServerSnapshot = () => null;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

interface UserContextValue {
  username: string | null;
  setUsername: (value: string) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const username = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setUsername = (value: string) => {
    localStorage.setItem(STORAGE_KEY, value);
    listeners.forEach((listener) => listener());
  };

  return (
    <UserContext.Provider value={{ username, setUsername }}>{children}</UserContext.Provider>
  );
};

export const useUsername = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUsername must be used within a UserProvider');
  }

  return context;
};

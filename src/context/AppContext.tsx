import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AppState, AppScreen, Session, TrainingConfig } from '../types';
import { storageUtils } from '../utils';

interface AppContextType extends AppState {
  setScreen: (screen: AppScreen) => void;
  setConfig: (config: TrainingConfig | null) => void;
  setCurrentSession: (session: Session | null) => void;
  addSession: (session: Session) => void;
  loadSessionsFromStorage: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<AppScreen>('setup');
  const [config, setConfig] = useState<TrainingConfig | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  // Load sessions from storage on mount
  useEffect(() => {
    const savedSessions = storageUtils.loadSessions();
    setSessions(savedSessions);
  }, []);

  const addSession = useCallback((session: Session) => {
    setSessions((prev) => {
      const updated = [...prev, session];
      storageUtils.saveSessions(updated);
      return updated;
    });
  }, []);

  const loadSessionsFromStorage = useCallback(() => {
    const savedSessions = storageUtils.loadSessions();
    setSessions(savedSessions);
  }, []);

  const value: AppContextType = {
    screen,
    setScreen,
    config,
    setConfig,
    currentSession,
    setCurrentSession,
    sessions,
    addSession,
    loadSessionsFromStorage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

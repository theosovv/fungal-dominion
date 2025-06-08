import { GameWebSocket } from '@src/services/websocket';
import { Colony } from '@src/types/colony';
import { MessageType } from '@src/types/message';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface GameContextValue {
  colony: Colony | null;
  sessionId: string | null;
  ws: GameWebSocket | null;
  isConnected: boolean;
}

export interface SessionData {
  session_id: string;
  colony: Colony;
}

const GameContext = createContext<GameContextValue | null>(null);

export function useGame(): GameContextValue | null {
  return useContext(GameContext);
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [colony, setColony] = useState<Colony | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<GameWebSocket | null>(null);

  useEffect(() => {
    const ws = new GameWebSocket('ws://localhost:8080/ws');
    const unsubscribeConnection = ws.onConnectionChange(setIsConnected);

    ws.onMessage(MessageType.SessionCreated, (data: SessionData) => {
      setColony(data.colony);
      setSessionId(data.session_id);
    });

    ws.onMessage(MessageType.ColonyState, (colony: Colony) => {
      setColony(colony);
    });

    ws.connect()
      .then(() => {
        setSocket(ws);
        setIsConnected(true);
      })
      .catch((error) => {
        console.error('Failed to connect:', error);
      });

    return () => {
      unsubscribeConnection();
      ws.disconnect();
    };
  }, []);

  return (
    <GameContext.Provider value={{ colony, sessionId, ws: socket, isConnected }}>
      {children}
    </GameContext.Provider>
  );
}

import React, { useCallback, useEffect, useState } from 'react';
import { GlobalStyle } from './styles';
import { GameCanvas } from './components/GameCanvas';
import { GameWebSocket } from './services/websocket';

export function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [_, setWs] = useState<GameWebSocket | null>(null);

  useEffect(() => {
    const websocket = new GameWebSocket('ws://localhost:8080/ws');

    websocket
      .connect()
      .then(() => {
        setIsConnected(true);
        setWs(websocket);
      })
      .catch((error) => {
        console.error('Failed to connect:', error);
      });

    return () => {
      websocket.disconnect();
    };
  }, []);

  const testConnection = useCallback(async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      console.log('Backend health:', data);
    } catch (error) {
      console.error('Backend connection failed:', error);
    }
  }, []);

  return (
    <>
      <GlobalStyle />
      <header>
        <h1>Fungal Dominion</h1>
        <div>
          Status: {isConnected ? 'Connected' : 'Disconnected'}
          <button onClick={testConnection} style={{ marginLeft: '10px' }}>
            Test Backend
          </button>
        </div>
      </header>
      <main>
        <GameCanvas />
      </main>
    </>
  );
}

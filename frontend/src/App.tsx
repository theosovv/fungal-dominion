import React, { useCallback, useEffect, useState } from 'react';
import { GlobalStyle } from './styles';
import { GameCanvas } from './components/GameCanvas';
import { Colony, GameWebSocket, SessionData } from './services/websocket';
import { GameSettings, gameStorage } from './services/storage';

export function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<GameWebSocket | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [colony, setColony] = useState<Colony | null>(null);
  const [settings, setSettings] = useState<GameSettings>(gameStorage.getSettings());

  useEffect(() => {
    const websocket = new GameWebSocket('ws://localhost:8080/ws');
    const unsubscribeConnection = websocket.onConnectionChange(setIsConnected);

    websocket.onMessage('session_created', (data: SessionData) => {
      console.log('Session created:', data);
      setSessionData(data);
      setColony(data.colony);
    });

    websocket.onMessage('colony_state', (colony: Colony) => {
      console.log('Colony state updated:', colony);
      setColony(colony);
    });

    websocket.onMessage('pong', (data) => {
      console.log('Pong received:', data);
    });

    websocket
      .connect()
      .then(() => {
        setWs(websocket);
        console.log('WebSocket connected successfully');
      })
      .catch((error) => {
        console.error('Failed to connect:', error);
      });

    return () => {
      unsubscribeConnection();
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

  const testPing = useCallback(() => {
    if (ws) {
      ws.ping();
    }
  }, [ws]);

  const updateSettings = useCallback(
    (newSettings: Partial<GameSettings>) => {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      gameStorage.saveSettings(newSettings);
    },
    [settings],
  );

  return (
    <>
      <GlobalStyle />
      <header style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <h1>Fungal Dominion</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</span>
          {sessionData && (
            <span>Session: {sessionData.session_id.substring(0, 8)}...</span>
          )}
          <button onClick={testConnection}>Test Backend</button>
          <button onClick={testPing} disabled={!isConnected}>
            Ping
          </button>
        </div>
      </header>
      <main style={{ flex: 1 }}>
        <GameCanvas
          colony={colony}
          websocket={ws}
          settings={settings}
          onSettingsChange={updateSettings}
        />
      </main>
      {colony && (
        <footer style={{ padding: '10px', borderTop: '1px solid #ccc' }}>
          <div>
            Colony: {colony.name} | Resources:{' '}
            {Object.entries(colony.resources)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')}
          </div>
        </footer>
      )}
    </>
  );
}

import { Directive } from '@src/types/directive';
import { GameMessage, MessageType } from '@src/types/message';

export class GameWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private sessionId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: Map<MessageType, <T>(data: T) => void> = new Map();
  private connectionStateHandlers: Set<(connected: boolean) => void> = new Set();

  constructor(url: string) {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;

          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: GameMessage<Record<string, unknown>> = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        };

        this.ws.onclose = (event) => {
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(message: GameMessage<Record<string, unknown>>) {
    switch (message.type) {
      case MessageType.SessionCreated:
        this.sessionId = message.session_id!;
        this.triggerHandler(MessageType.SessionCreated, message.data);
        break;

      case MessageType.ColonyState:
        this.triggerHandler(MessageType.ColonyState, message.data);
        break;

      case MessageType.Pong:
        this.triggerHandler(MessageType.Pong, message.data);
        break;

      default:
        this.triggerHandler(message.type, message.data);
    }
  }

  private triggerHandler(type: MessageType, data: Record<string, unknown>) {
    const handler = this.messageHandlers.get(type);
    if (handler) {
      handler(data);
    }
  }

  private scheduleReconnect() {
    this.reconnectAttempts++;

    setTimeout(() => {
      this.connect().catch(() => {
        console.error('Reconnect failed');
      });
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  onMessage<T>(type: MessageType, handler: (data: T) => void) {
    this.messageHandlers.set(type, handler as <T>(data: T) => void);
  }

  onConnectionChange(handler: (connected: boolean) => void) {
    this.connectionStateHandlers.add(handler);
    return () => this.connectionStateHandlers.delete(handler);
  }

  sendMessage<T>(type: MessageType, data: T = {} as T) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: GameMessage<T> = {
        type,
        session_id: this.sessionId || undefined,
        data,
        timestamp: new Date().toISOString(),
      };

      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  ping() {
    this.sendMessage(MessageType.Pong);
  }

  getColony() {
    this.sendMessage(MessageType.GetColony);
  }

  sendDirective(directive: Directive) {
    this.sendMessage(MessageType.Directive, directive);
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.sessionId = null;
  }
}

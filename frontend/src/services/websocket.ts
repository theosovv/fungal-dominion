export interface GameMessage {
  type: string;
  session_id?: string;
  data?: any;
  timestamp: string;
}

export interface SessionData {
  session_id: string;
  colony: Colony;
}

export interface Colony {
  id: string;
  owner_id: string;
  name: string;
  width: number;
  height: number;
  cells: Cell[][];
  created_at: string;
  last_update: string;
  tick_count: number;
  resources: Resources;
  active_directives: Directive[];
  auto_save: boolean;
}

export interface Cell {
  type: CellType;
  state: CellState;
  position: Position;
  owner_id: string;
  last_update: string;
}

export interface CellState {
  health: number;
  nutrition: number;
  toxicity: number;
  age: number;
  energy: number;
  growth: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Resources {
  nutritients: number;
  energy: number;
  biomass: number;
  spores: number;
  toxins: number;
  research: number;
}

export interface Directive {
  id: string;
  type: string;
  priority: number;
  parameters: Record<string, unknown>;
  created_at: string;
  expires_at?: string;
  is_active: boolean;
}

export enum CellType {
  Empty = 0,
  Nutrient = 1,
  Spore = 3,
  Mycelium = 4,
  FruitingBody = 5,
  Toxin = 6,
}

export class GameWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private sessionId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: Map<string, (data: unknown) => void> = new Map();
  private connectionStateHandlers: Set<(connected: boolean) => void> = new Set();

  constructor(url: string) {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');

          this.reconnectAttempts = 0;
          this.notifyConnectionState(true);

          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: GameMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected');
          this.notifyConnectionState(false);

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

  private handleMessage(message: GameMessage) {
    console.log('Received message:', message);

    switch (message.type) {
      case 'session_created':
        this.sessionId = message.data.session_id;
        this.triggerHandler('session_created', message.data);
        break;

      case 'colony_state':
        this.triggerHandler('colony_state', message.data);
        break;

      case 'pong':
        this.triggerHandler('pong', message.data);
        break;

      default:
        this.triggerHandler(message.type, message.data);
    }
  }

  private triggerHandler(type: string, data: any) {
    const handler = this.messageHandlers.get(type);
    if (handler) {
      handler(data);
    }
  }

  private scheduleReconnect() {
    this.reconnectAttempts++;
    console.log(
      `Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`,
    );

    setTimeout(() => {
      this.connect().catch(() => {
        console.error('Reconnect failed');
      });
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  private notifyConnectionState(connected: boolean) {
    this.connectionStateHandlers.forEach((handler) => handler(connected));
  }

  onMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler);
  }

  onConnectionChange(handler: (connected: boolean) => void) {
    this.connectionStateHandlers.add(handler);
    return () => this.connectionStateHandlers.delete(handler);
  }

  sendMessage(type: string, data?: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: GameMessage = {
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
    this.sendMessage('ping');
  }

  getColony() {
    this.sendMessage('get_colony');
  }

  sendDirective(directive: any) {
    this.sendMessage('directive', directive);
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

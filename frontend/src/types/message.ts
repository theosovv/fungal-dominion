export enum MessageType {
  SessionCreated = 'session_created',
  Pong = 'pong',
  ColonyState = 'colony_state',
  ColonyUpdated = 'colony_updated',
  GetColony = 'get_colony',
  Directive = 'directive',
}

export interface GameMessage<T> {
  type: MessageType;
  session_id?: string;
  data: T;
  timestamp: string;
}

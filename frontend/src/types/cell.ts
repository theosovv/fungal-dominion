import { Position } from './position';

export enum CellType {
  Empty = 0,
  Nutrient = 1,
  Spore = 2,
  Mycelium = 3,
  FruitingBody = 4,
  Toxin = 5,
}

interface CellState {
  health: number;
  nutrition: number;
  toxicity: number;
  age: number;
  energy: number;
  growth: number;
}

export interface Cell {
  type: CellType;
  state: CellState;
  position: Position;
  owner_id: string;
  last_update: number;
}

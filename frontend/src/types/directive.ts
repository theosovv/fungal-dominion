import { Position } from './position';

export enum DirectiveType {
  CellClick = 'cell_click',
  AddNutrients = 'add_nutrients',
}

export interface Directive {
  type: DirectiveType;
  position: Position;
  timestamp: string;
}

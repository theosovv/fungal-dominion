import { CellType } from './cell';
import { Position } from './position';
import { Resources } from './resources';

export enum DirectiveType {
  DirectiveExpand = 0,
  DirectiveConcentrate = 1,
  DirectiveReproduce = 2,
  DirectiveDefend = 3,
  DirectiveHarvest = 4,
  DirectiveResearch = 5,
  DirectiveMigrate = 6,
  DirectiveSymbiosis = 7,
}

enum TargetType {
  TargetPoint = 0,
  TargetArea = 1,
  TargetCircle = 2,
  TargetPath = 3,
  TargetCellType = 4,
}

interface Area {
  top_left: Position;
  bottom_right: Position;
  radius: number;
}

interface DirectiveTarget {
  type: TargetType;
  position: Position;
  area: Area;
  cell_type: CellType;
}

export interface Directive {
  id: string;
  type: DirectiveType;
  target: DirectiveTarget;
  intensity: number;
  duration: number;
  priority: number;
  cost: Resources;
  upkeep: Resources;
  is_active: boolean;
  started_at: Date;
  completed_at?: Date;
  progress: number;
  efficiency: number;
  conflicts: string[];
}

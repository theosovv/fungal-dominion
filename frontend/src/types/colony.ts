import { Cell } from './cell';
import { Directive } from './directive';
import { Resources } from './resources';

export interface Colony {
  id: string;
  owner_id: string;
  name: string;
  width: number;
  height: number;
  cells: Cell[][];
  created_at: Date;
  last_update: Date;
  tick_count: number;
  resources: Resources;
  active_directives: Directive[];
  auto_save: boolean;
}

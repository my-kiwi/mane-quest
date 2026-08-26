import { NPC } from '../NPC';

export type Level = {
  position: { x: number; y: number };
  backgroundColor: string;
  groundColor: string;
  map: string[];
  npc?: NPC; // Replace 'any' with the actual type of your NPC if available
};

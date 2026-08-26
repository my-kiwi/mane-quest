import { sageNpc } from '../NPC';
import { mapGenerator, Level } from './level-type';

export const level_1: Level[] = [
  {
    map: mapGenerator(8), // Generates a map with 8 ground tiles
  },
  {
    map: mapGenerator(8), // Generates a map with 8 ground tiles
  },
  {
    map: mapGenerator(8), // Generates a map with 8 ground tiles
    npc: sageNpc,
  },
  {
    map: mapGenerator(8), // Generates a map with 8 ground tiles
  },
  {
    map: mapGenerator(8), // Generates a map with 8 ground tiles
  },
].map((level, index) => ({
  ...level,
  position: { x: index, y: 1 },
  backgroundColor: '#87CEEB', // Sky blue
  groundColor: '#228B22', // Forest green
}));

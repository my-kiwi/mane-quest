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
    // TODO add enemy if has visited level 3,1
  },
  {
    map: mapGenerator(8), // Generates a map with 8 ground tiles
  },
  // no lvl here = unicorn dies
  // {
  //   map: mapGenerator(8), // Generates a map with 8 ground tiles
  // },
].map((level, index) => ({
  ...level,
  position: { x: index, y: 1 },
  backgroundColor: '#4B0082', // Indigo - deeper/darker to distinguish from -1,0
  groundColor: '#2F1B4A', // Dark violet ground
}));

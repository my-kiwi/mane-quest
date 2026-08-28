import { sageNpc } from '../NPC';
import { mapGenerator, Level, rowGenerator, TileType } from './level-type';
import { firstEnemy } from '../enemy';
import { getLevel } from './levels';

export const level_1: Level[] = [
  {
    map: mapGenerator(8), // Generates a map with 8 ground tiles
  },
  {
    map: mapGenerator(8), // Generates a map with 8 ground tiles
  },
  {
    visited: false,
    getMap() {
      if (!getLevel?.(3, 1)?.visited) {
        return mapGenerator(8);
      }
      return mapGenerator(8).map((row, index) => {
        const indexToReplace = 9;
        if (index !== indexToReplace) return row;
        return (row.slice(0, indexToReplace) +
          TileType.ENEMY +
          row.slice(indexToReplace + 1)) as string;
      });
    },
    enemy: firstEnemy,
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
  get map() {
    return level.map ?? level.getMap();
  },
  position: { x: index, y: 1 },
  backgroundColor: '#161317', // Indigo - deeper/darker to distinguish from -1,0
  groundColor: '#2F1B4A', // Dark violet ground
}));

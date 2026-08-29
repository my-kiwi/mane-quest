import { sageNpc } from '../NPC';
import { mapGenerator, Level, rowGenerator, TileType } from './level-type';
import { firstEnemy } from '../enemy';
import { getLevel } from './levels';

const GROUND_LVL = 5;

const defaultLvl = mapGenerator(GROUND_LVL).map((row, index) =>
  index === 0 ? rowGenerator(TileType.GROUND) : row
);

export const level_1: Level[] = [
  {
    map: [
      '■        ■■■■■■■■■■■■■■■■■■■■■■■',
      '■                               ',
      '■                               ',
      '■                               ',
      '■                               ',
      '■                               ',
      '■                               ',
      '■────────                       ',
      '■                               ',
      '■                               ',
      '■                               ',
      '■                               ',
      '■                               ',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    ],
  },
  {
    map: defaultLvl,
  },
  {
    visited: false,
    getMap() {
      if (!getLevel?.(3, 1)?.visited) {
        return defaultLvl;
      }
      return defaultLvl
      .map(row => row.slice(0, -1) + TileType.GROUND)
      .map((row, index) => {
        const indexToReplace = 9;
        if (index !== indexToReplace) return row;
        return (row.slice(0, indexToReplace) +
          TileType.ENEMY +
          row.slice(indexToReplace + 1)) as string;
      });
    },
    getMusic() {
      if (getLevel?.(3, 1)?.visited) {
        return 'platforming';
      }
    },
    enemy: firstEnemy,
  },
  {
    map: defaultLvl.map((row) => row.slice(0, -1) + TileType.GROUND),
  },
  // no lvl here = unicorn dies when jumping from 3, 0
  // {
  //   map: mapGenerator(8), // Generates a map with 8 ground tiles
  // },
].map((level, index) => ({
  ...level,
  get map() {
    return level.map ?? level.getMap();
  },
  position: { x: index, y: 1 },
  backgroundColor: '#4B0082', // Indigo - deeper/darker to distinguish from -1,0
  groundColor: '#2F1B4A', // Dark violet ground
  get music() {
    return level.getMusic?.() ?? 'cavern';
  },
}));

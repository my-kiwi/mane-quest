import { canvas } from '../canvas';
import {
  mapGenerator,
  Level,
  NB_OF_TILES_HORIZONTALLY,
  NB_OF_TILES_VERTICALLY,
  rowGenerator,
  TileType,
} from './level-type';
import { firstEnemy } from '../enemy';
import { getLevel } from './levels';
import { floor, max, min } from '../dom-helpers';

const GROUND_LVL = 5;

const defaultLvl = mapGenerator(GROUND_LVL).map((row, index) =>
  index === 0 ? rowGenerator(TileType.GROUND) : row
);

export const level_1: Level[] = [
  {
    map: [
      '■              ■■■■■■■■■■■■■■■■■',
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
      '■    T                          ',
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
      if (firstEnemy?.isDead && firstEnemy.diedAt < Date.now() - 1000) {
        // If the enemy is dead, create a hole in the ground for the unicorn to fall through
        const enemyColumn = floor((firstEnemy.x / canvas.width) * NB_OF_TILES_HORIZONTALLY);
        const holeWidth = 6;
        const holeStart = max(0, enemyColumn - floor(holeWidth / 2));
        const holeEnd = min(NB_OF_TILES_HORIZONTALLY, holeStart + holeWidth);

        return defaultLvl.map((row, index) => {
          if (!row.includes(TileType.GROUND) || index < NB_OF_TILES_VERTICALLY - GROUND_LVL) {
            return row;
          }
          return (
            row.slice(0, holeStart) +
            TileType.EMPTY.repeat(holeEnd - holeStart) +
            row.slice(holeEnd)
          );
        });
      }

      if (!getLevel?.(3, 1)?.visited /** TODO or ennemy is dead */) {
        return defaultLvl;
      }
      return defaultLvl
        .map((row) => row.slice(0, -1) + TileType.GROUND)
        .map((row) => TileType.GROUND + row.slice(1))
        .map((row, index) => {
          const rowIndex = 9;
          const colIndex = 16;
          if (index !== rowIndex) return row;
          return (row.slice(0, colIndex) + TileType.ENEMY + row.slice(colIndex + 1)) as string;
        });
    },
    getMusic() {
      if (getLevel?.(3, 1)?.visited) {
        return 'platforming'; // enemy music
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

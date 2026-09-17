import { canvas } from '../canvas';
import {
  mapGenerator,
  Level,
  NB_OF_TILES_HORIZONTALLY,
  NB_OF_TILES_VERTICALLY,
  rowGenerator,
  TileType,
} from './level-type';

export const level_2: Level[] = [
  {
    map: [
      '■                               ',
      '■                               ',
      '■                               ',
      '■                               ',
      '■                               ',
      '■                               ',
      '■                               ',
      '■.                              ',
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
    map: [
      '                               ■',
      '                               ■',
      '                               ■',
      '                               ■',
      '                               ■',
      '                               ■',
      '                               ■',
      '                               ■',
      '                               ■',
      '                               ■',
      '                               ■',
      '                               ■',
      '                 T             ■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    ],
  },
].map((level, index) => ({
  ...level,
  position: { x: index, y: 2 },
  backgroundColor1: '#B8004B', // Indigo - deeper/darker to distinguish from -1,0
  backgroundColor2: '#4A001E',
  groundColor: '#140008', // Dark violet ground
  music: 'cavern',
}));

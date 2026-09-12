import { canvas } from '../canvas';
import {
  mapGenerator,
  Level,
  NB_OF_TILES_HORIZONTALLY,
  NB_OF_TILES_VERTICALLY,
  rowGenerator,
  TileType,
} from './level-type';

export const level_3: Level[] = [
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
      '■                               ',
      '■                               ',
      '■                               ',
      '■                               ',
      'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
    ],
  },
  {
    map: [
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '    ■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
    ],
  },
].map((level, index) => ({
  ...level,
  position: { x: index, y: 3 },
  backgroundColor: '#bc0303', // Indigo - deeper/darker to distinguish from -1,0
  groundColor: '#440000', // Dark violet ground
  music: 'platforming',
}));

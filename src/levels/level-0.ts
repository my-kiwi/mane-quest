import { firstEnemy } from '../enemy';
import { sageNpc } from '../NPC';
import { Level, mapGenerator, rowGenerator, TileType } from './level-type';

// const GROUND_LVL = 5;

// const defaultLvl = mapGenerator(GROUND_LVL).map((row, index) =>
//   index === 0 ? rowGenerator(TileType.GROUND) : row
// );

// const testMap = defaultLvl
//   .map((row) => row.slice(0, -1) + TileType.GROUND)
//   .map((row) => TileType.GROUND + row.slice(1))
//   .map((row, index) => {
//     const indexToReplace = 9;
//     if (index !== indexToReplace) return row;
//     return (row.slice(0, indexToReplace) +
//       TileType.ENEMY +
//       row.slice(indexToReplace + 1)) as string;
//   });

export const level_0: Level[] = [
  {
    backgroundColor: '#87CEEB', // Sky blue
    groundColor: '#228B22', // Forest green
    map: [
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '        ■■■                     ',
      '        ■■■■■                   ',
      '        ■■■■■■■                 ',
      '        ■■■■■■■■■               ',
      '        ■■■■■■■■■■              ',
      '        ■■■■■■■■■■■■            ',
      '        ■■■■■■■■■■■■■           ',
      '    ────■■■■■■■■■■■■■■■         ',
      '        ■■■■■■■■■■■■■■■■■■      ',
      '        ■■■■■■■■■■■■■■■■■■■■■■■■',
      '        ■■■■■■■■■■■■■■■■■■■■■■■■',
      '        ■■■■■■■■■■■■■■■■■■■■■■■■',
      '        ■■■■■■■■■■■■■■■■■■■■■■■■',
      '────    ■■■■■■■■■■■■■■■■■■■■■■■■',
    ],
  },
  {
    backgroundColor: '#87CEEB', // Sky blue
    groundColor: '#228B22', // Forest green
    map: [
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '               ■■               ',
      '.              ■■               ',
      '.           ■■■■■■■■            ',
      '.       ■■■■■■■■■■■■■■■■        ',
      '.       ■■■■■■■■■■■■■■■■        ',
      '     ■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '     ■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    ],
  },
  {
    backgroundColor: '#87CEEB', // Sky blue
    groundColor: '#228B22', // Forest green
    map: [
      '                S               ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      ' P                              ',
      '■■■■■                           ',
      '■■■■■■■■■■■■                    ',
      '■■■■■■■■■■■■           ■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■   ■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■   ■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    ],
    npc: sageNpc,
    enemy: firstEnemy,
  },
  {
    backgroundColor: '#87CEEB', // Sky blue
    groundColor: '#228B22', // Forest green
    map:  mapGenerator(5),//testMap,
  },
  {
    backgroundColor: '#87CEEB', // Sky blue
    groundColor: '#228B22', // Forest green
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
      '■■■■■■■■■■■■■■■■■■              ',
      '■■■■■■■■■■■■■■■■■■              ',
      '■■■■■■■■■■■■■■■■■■              ',
      '■■■■■■■■■■■■■■■■■■              ',
      '■■■■■■■■■■■■■■■■■■              ',
    ],
  },
].map((level, index) => ({
  ...level,
  position: { x: index, y: 0 },
  music: 'overworld',
}));

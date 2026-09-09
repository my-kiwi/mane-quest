import { firstEnemy, secondEnemy } from '../enemy';
import { TrackName } from '../music';
import { randomNpc, sageNpc } from '../NPC';
import { Level, mapGenerator, NB_OF_TILES_VERTICALLY, rowGenerator, TileType } from './level-type';

const GROUND_LVL = 5;

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
    map: mapGenerator(GROUND_LVL), //testMap,
  },
  {
    backgroundColor: '#87CEEB', // Sky blue
    groundColor: '#228B22', // Forest green
    getMap() {
      return [
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
        '■■■■■■■■■■■■■■■■■■' + (firstEnemy?.isDead ? '──────────────' : '              '),
        '■■■■■■■■■■■■■■■■■■              ',
        '■■■■■■■■■■■■■■■■■■              ',
        '■■■■■■■■■■■■■■■■■■              ',
        '■■■■■■■■■■■■■■■■■■              ',
      ];
    },
  },
  {
    // TODO next level
    backgroundColor: '#c98a04',
    groundColor: '#105c10',
    map: mapGenerator(GROUND_LVL),
  },
  {
    backgroundColor: '#d65906',
    groundColor: '#175c17',
    map: mapGenerator(GROUND_LVL).map((row, index) => {
      const rowIndex = NB_OF_TILES_VERTICALLY - GROUND_LVL - 1;
      const colIndex = 16;
      if (index !== rowIndex) return row;
      return (row.slice(0, colIndex) + TileType.NPC + row.slice(colIndex + 1)) as string;
    }),
    npc: randomNpc,
  },
  {
    backgroundColor: '#d60667',
    groundColor: '#0e390e',
    map: [
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                         E      ',
      '                                ',
      '                                ',
      '               ■■■■■■■■■■■■■■■■■',
      '            ■■■■■■■■■■■■■■■■■■■■',
      '         ■■■■■■■■■■■■■■■■■■■■■■■',
      '      ■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '   ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    ],
    enemy: secondEnemy,
    music: 'platforming' as TrackName,
  },
].map((level, index) => ({
  ...level,
  get map() {
    return level.map ?? level.getMap();
  },
  position: { x: index, y: 0 },
  music: level.music || 'overworld',
}));

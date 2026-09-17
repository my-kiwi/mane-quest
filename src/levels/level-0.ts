import { addFireBallToActionBar } from '../action';
import { firstEnemy, secondEnemy } from '../enemy';
import { TrackName } from '../music';
import { randomNpc, sageNpc, secretNpc, endNpc } from '../NPC';
import { Level, mapGenerator, NB_OF_TILES_VERTICALLY, rowGenerator, TileType } from './level-type';

const GROUND_LVL = 5;

// TODO do not commit
// setTimeout(() => addFireBallToActionBar(), 1000);

export const level_0: Level[] = [
  {
    backgroundColor1: '#39C6F4', // Sky blue
    backgroundColor2: '#0878D1',
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
      '    ────■■■■■■■■■■■■■           ',
      '        ■■■■■■■■■■■■■■■         ',
      '        ■■■■■■■■■■■■■■■■■■      ',
      '        ■■■■■■■■■■■■■■■■■■■■■■■■',
      '        ■■■■■■■■■■■■■■■■■■■■■■■■',
      '        ■■■■■■■■■■■■■■■■■■■■■■■■',
      '────    ■■■■■■■■■■■■■■■■■■■■■■■■',
      '        ■■■■■■■■■■■■■■■■■■■■■■■■',
    ],
  },
  {
    backgroundColor1: '#39C6F4', // Sky blue
    backgroundColor2: '#0878D1',
    groundColor: '#228B22', // Forest green
    map: [
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '.                               ',
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
    backgroundColor1: '#32D7FF', // Sky blue
    backgroundColor2: '#0874D1',
    groundColor: '#228B22', // Forest green
    map: [
      '                   S            ',
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
    backgroundColor1: '#39C6F4', // Sky blue
    backgroundColor2: '#0878D1',
    groundColor: '#228B22', // Forest green
    map: mapGenerator(GROUND_LVL), //testMap,
  },
  {
    backgroundColor1: '#39C6F4', // Sky blue
    backgroundColor2: '#0878D1',
    groundColor: '#228B22', // Forest greens
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
        '■■■■■■■■■■■■■■                  '.replaceAll(' ', firstEnemy?.isDead ? '─' : ' '),
        '■■■■■■■■■■■■■■                  ',
        '■■■■■■■■■■■■■■                  ',
        '■■■■■■■■■■■■■■                  ',
        '■■■■■■■■■■■■■■                  ',
      ];
    },
  },
  {
    // TODO next level
    backgroundColor1: '#FFB000',
    backgroundColor2: '#E43812',
    groundColor: '#105c10',
    map: mapGenerator(GROUND_LVL),
  },
  {
    backgroundColor1: '#FF7518',
    backgroundColor2: '#C91E3A',
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
    /* 7, 0 */
    backgroundColor1: '#FF2B85',
    backgroundColor2: '#8E145F',
    groundColor: '#0e390e',
    getMap() {
      return [
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
        '   ■■■■■■■■■■■■■■■              ',
        '■■■■■■■■■■■■■■■■■               ',
        '■■■■■■■■■■■■■■■■■               ',
        `■■■■■■■■■■■■■■■■■■   P          `,
        '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
        '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      ];
    },
    enemy: secondEnemy,
    npc: secretNpc,
    getMusic() {
      return !secondEnemy.isDead ? 'platforming' : 'overworld';
    },
  },
  {
    /* 8, 0 */
    backgroundColor1: '#F52D91',
    backgroundColor2: '#71186F',
    groundColor: '#0e390e',
    map: [
      '                                ',
      '                                ',
      '                                ',
      '                      ■■■■■■■■■■',
      '                                ',
      '                  ■■            ',
      '                                ',
      '                                ',
      '■■■■■■■■■                       ',
      '■■■■■■■■■■■■■                   ',
      '■■■■■■■■■■■■■■■■                ',
      '■■■■■■■■■■■■■■■■■■              ',
      '        |                       ',
      '        |                       ',
      '        |                       ',
      '        |                       ',
      '────────────────────────────────',
      '                                ',
    ],
  },
  {
    /* 9, 0 */
    backgroundColor1: '#E51B70',
    backgroundColor2: '#52105E',
    groundColor: '#0c2e0c',
    map: [
      '                                ',
      '                                ',
      '                                ',
      '■■■■■■■■■■                      ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '■■■■■■■■■                 ■■■■■■',
      '■■■■■■■■■                 ■■■■■■',
      '■■■■■■■■■                 ■■■■■■',
      '■■■■■■■■■                 ■■■■■■',
      '■■■■■■■■■                       ',
      '                                ',
      '                                ',
      '                                ',
      '                          ■■■■■■',
      '────                      ■■■■■■',
    ],
  },
].map((level, index) => ({
  ...level,
  get map() {
    return level.map ?? level.getMap();
  },
  position: { x: index, y: 0 },
  get music() {
    return level.getMusic?.() || 'overworld';
  },
}));

import { addFireBallToActionBar } from '../action';
import { firstEnemy, secondEnemy } from '../enemy';
import { TrackName } from '../music';
import { randomNpc, sageNpc, secretNpc, endNpc } from '../NPC';
import {
  LEVEL_THEMES,
  Level,
  mapGenerator,
  NB_OF_TILES_VERTICALLY,
  rowGenerator,
  TileType,
} from './level-type';

const GROUND_LVL = 5;
const { meadow, brightMeadow, sunset, ember, rose, magenta, crimson } = LEVEL_THEMES;

// TODO do not commit
// setTimeout(() => addFireBallToActionBar(), 1000);

export const level_0: Level[] = [
  {
    ...meadow,
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
    ...meadow,
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
    ...brightMeadow,
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
    ...meadow,
    map: mapGenerator(GROUND_LVL), //testMap,
  },
  {
    ...meadow,
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
    ...sunset,
    map: mapGenerator(GROUND_LVL),
  },
  {
    ...ember,
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
    ...rose,
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
    ...magenta,
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
    ...crimson,
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

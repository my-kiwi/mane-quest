import { sageNpc } from './NPC';

export const TileType = {
  EMPTY: ' ',
  GROUND: '■',
  PLATFORM: '═',
  SPIKE: '▲',
  COIN: '●',
  ENEMY: 'E',
  EXIT: 'X',
  NPC: 'P',
  START: 'S',
};
const tilesMultiplier = 2;
export const NB_OF_TILES_HORIZONTALLY = 16 * tilesMultiplier;
export const NB_OF_TILES_VERTICALLY = 9 * tilesMultiplier;

export const levels = [
  {
    name: 'Level -1,0',
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
      '.              ■■               ',
      '.           ■■■■■■■■            ',
      '.       ■■■■■■■■■■■■■■■■        ',
      '.   ■■■■■■■■■■■■■■■■■■■■■■■■    ',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    ],
  },
  {
    name: 'Level 0,0',
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
  },
  {
    name: 'Level 1,0',
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
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    ],
  },
  {
    name: 'Level 2,0',
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
];

let currentLevelIndex = 0;
let negativeLevelUnlocked = false;

export type Level = ReturnType<typeof getCurrentLevel>;
export function getCurrentLevel() {
  return levels[currentLevelIndex];
}

export function resetToFirstLevel(): void {
  currentLevelIndex = 0;
}

export function resetToStartLevel(): void {
  const startLevelIndex = levels.findIndex((level) =>
    level.map.some((row) => row.includes(TileType.START))
  );

  currentLevelIndex = startLevelIndex >= 0 ? startLevelIndex : 0;
}

export function unlockNegativeLevel(): void {
  negativeLevelUnlocked = true;
}

export function moveToNextLevel(): boolean {
  if (currentLevelIndex >= levels.length - 1) {
    return false;
  }

  currentLevelIndex += 1;
  return true;
}

export function moveToPreviousLevel(): boolean {
  if (currentLevelIndex <= 0 || (currentLevelIndex === 1 && !negativeLevelUnlocked)) {
    return false;
  }

  currentLevelIndex -= 1;
  return true;
}

levels.forEach((level) => {
  // Ensure the map has the correct number of rows
  level.map.forEach((row, rowIndex) => {
    if (row.length !== NB_OF_TILES_HORIZONTALLY) {
      console.warn(
        `Row ${rowIndex} in level "${level.name}" does only have ${row.length} out of ${NB_OF_TILES_HORIZONTALLY} tiles.`
      );
    }
  });
});

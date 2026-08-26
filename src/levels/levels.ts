import { level_0 } from './level-0';
import { level_1 } from './level-1';
import { Level, TileType, NB_OF_TILES_HORIZONTALLY, NB_OF_TILES_VERTICALLY } from './level-type';

export const levels = [...level_0, ...level_1];

const getStartLevel = (): Level => {
  return levels.find((level) => level.map.some((row) => row.includes(TileType.START))) as Level;
};

let currentLevel: Level = getStartLevel();
let negativeLevelUnlocked = false;

export const getCurrentLevel = (): Level => currentLevel;

export function resetToStartLevel(): void {
  currentLevel = getStartLevel();
}

export function unlockNegativeLevel(): void {
  negativeLevelUnlocked = true;
}

export function moveToNextXLevel(): boolean {
  const currentPos = currentLevel.position;
  const nextLevel = levels.find(
    (level) => level.position.x === currentPos.x + 1 && level.position.y === currentPos.y
  );

  if (!nextLevel) {
    return false;
  }

  currentLevel = nextLevel;
  return true;
}

export function moveToPreviousXLevel(): boolean {
  const currentPos = currentLevel.position;
  const previousLevel = levels.find(
    (level) => level.position.x === currentPos.x - 1 && level.position.y === currentPos.y
  );

  if (!previousLevel || (previousLevel.position.x < 0 && !negativeLevelUnlocked)) {
    return false;
  }

  currentLevel = previousLevel;
  return true;
}

levels.forEach((level) => {
  // Ensure the map has the correct number of rows
  if (level.map.length !== NB_OF_TILES_VERTICALLY) {
    console.warn(
      `Level "${level.position.x},${level.position.y}" does only have ${level.map.length} out of ${NB_OF_TILES_VERTICALLY} tile rows.`
    );
  }
  level.map.forEach((row, rowIndex) => {
    if (row.length !== NB_OF_TILES_HORIZONTALLY) {
      console.warn(
        `Row ${rowIndex} in level "${level.position.x},${level.position.y}" does only have ${row.length} out of ${NB_OF_TILES_HORIZONTALLY} tiles.`
      );
    }
  });
});

import { unicorn } from '../unicorn';
import { level_0 } from './level-0';
import { level_1 } from './level-1';
import { Level, TileType, NB_OF_TILES_HORIZONTALLY, NB_OF_TILES_VERTICALLY } from './level-type';

export const levels = [...level_0, ...level_1];

const getStartLevel = (): Level => {
  return levels.find((level) => level.map.some((row) => row.includes(TileType.START))) as Level;
};

export const getLevel = (x: number, y: number) => {
  return levels.find((level) => level.position.x === x && level.position.y === y);
};

let currentLevel: Level = getStartLevel();
currentLevel.visited = true;

export const getCurrentLevel = (): Level => currentLevel;
export const setCurrentLevel = (level: Level): void => {
  console.log(`entering level ${level.position.x},${level.position.y}`);
  currentLevel = level;
  level.visited = true;
};

export function resetToStartLevel(): void {
  currentLevel = getStartLevel();
}

export function moveToNextXLevel(): boolean {
  const currentPos = currentLevel.position;
  const nextLevel = levels.find(
    (level) => level.position.x === currentPos.x + 1 && level.position.y === currentPos.y
  );

  if (!nextLevel) {
    return false;
  }

  setCurrentLevel(nextLevel);
  return true;
}

export function moveToNextYLevel(): boolean {
  const currentPos = currentLevel.position;
  const nextLevel = levels.find(
    (level) => level.position.x === currentPos.x && level.position.y === currentPos.y + 1
  );

  if (!nextLevel) {
    return false;
  }

  setCurrentLevel(nextLevel);
  return true;
}

export function moveToPreviousXLevel(): boolean {
  const currentPos = currentLevel.position;
  const previousLevel = levels.find(
    (level) => level.position.x === currentPos.x - 1 && level.position.y === currentPos.y
  );

  if (
    !previousLevel ||
    (previousLevel.position.x < getStartLevel().position.x && unicorn.deaths === 0)
  ) {
    return false;
  }

  setCurrentLevel(previousLevel);
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

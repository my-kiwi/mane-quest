import Music from '../music';
import { unicorn } from '../unicorn';
import { level_0 } from './level-0';
import { level_1 } from './level-1';
import {
  Level,
  TileType,
  NB_OF_TILES_HORIZONTALLY,
  NB_OF_TILES_VERTICALLY,
  TileTypeEntry,
} from './level-type';
import { getTileDimensions } from './levelGeometry';

export const levels: Level[] = [...level_0, ...level_1] as const;

const getStartLevel = (): Level => {
  return levels.find((level) => level.map.some((row) => row.includes(TileType.START))) as Level;
};

export const getLevel = (x: number, y: number) => {
  return levels.find((level) => level.position.x === x && level.position.y === y);
};

export const hasVisited = (x: number, y: number) => {
  return getLevel(x, y)?.visited;
};

export const setCurrentLevel = (level: Level): void => {
  console.log(`entering level ${level.position.x},${level.position.y}`);
  level.visited = true;
  initializeEnemyPosition(level);
  Music.play(level.music);
  currentLevel = level;
};

let currentLevel: Level = null as unknown as Level;
setCurrentLevel(getStartLevel()); // use setter to run side effects

initializeEnemyPosition(currentLevel);

export const getCurrentLevel = (): Level => currentLevel;
function initializeEnemyPosition(level: Level): void {
  if (!level.enemy) {
    return;
  }

  const map = level.map;
  const { width: tileWidth, height: tileHeight } = getTileDimensions();

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === TileType.ENEMY) {
        level.enemy.x = col * tileWidth + tileWidth / 2;
        level.enemy.y = row * tileHeight + tileHeight / 2;
        return;
      }
    }
  }
}

export function hasTile(level: Level, tileType: TileTypeEntry) {
  return level.map.join('').includes(tileType);
}

export function resetToStartLevel(): void {
  setCurrentLevel(getStartLevel());
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

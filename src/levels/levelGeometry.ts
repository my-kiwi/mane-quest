import { canvas } from '../canvas';
import { getCurrentLevel } from './levels';
import { TileType, NB_OF_TILES_HORIZONTALLY, NB_OF_TILES_VERTICALLY } from './level-type';

export function getTileDimensions(): { width: number; height: number } {
  return {
    width: canvas.width / NB_OF_TILES_HORIZONTALLY,
    height: canvas.height / NB_OF_TILES_VERTICALLY,
  };
}

export function isSolid(tile: string | undefined): boolean {
  return (
    tile === TileType.GROUND ||
    tile === TileType.PLATFORM ||
    tile === TileType.INVISIBLE_PLATFORM ||
    tile === TileType.WALL
  );
}

export function getTile(row: number, column: number): string {
  const level = getCurrentLevel();
  if (level.removedTiles?.has(`${row},${column}`)) {
    return TileType.EMPTY;
  }

  return level.map[row]?.[column] ?? TileType.EMPTY;
}

export function removeTile(row: number, column: number): void {
  const level = getCurrentLevel();
  const tile = level.map[row]?.[column];

  if (tile === undefined) {
    return;
  }

  level.removedTiles ??= new Set<string>();
  level.removedTiles.add(`${row},${column}`);
}

export function revealTile(row: number, column: number): void {
  const level = getCurrentLevel();
  const currentRow = level.map[row];

  if (currentRow?.[column] !== TileType.INVISIBLE_PLATFORM) {
    return;
  }

  level.map[row] =
    `${currentRow.slice(0, column)}${TileType.PLATFORM}${currentRow.slice(column + 1)}`;
}

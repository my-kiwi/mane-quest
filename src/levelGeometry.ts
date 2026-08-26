import { canvas } from './canvas';
import { getCurrentLevel } from './levels/levels';
import { TileType, NB_OF_TILES_HORIZONTALLY, NB_OF_TILES_VERTICALLY } from './levels/level-type';

export function getTileDimensions(): { width: number; height: number } {
  return {
    width: canvas.width / NB_OF_TILES_HORIZONTALLY,
    height: canvas.height / NB_OF_TILES_VERTICALLY,
  };
}

export function isSolid(tile: string | undefined): boolean {
  return tile === TileType.GROUND || tile === TileType.PLATFORM || tile === TileType.NPC;
}

export function getTile(row: number, column: number): string | undefined {
  return getCurrentLevel().map[row]?.[column];
}

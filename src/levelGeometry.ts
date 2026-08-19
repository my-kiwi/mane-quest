import { canvas } from './canvas';
import { levels, NB_OF_TILES_HORIZONTALLY, NB_OF_TILES_VERTICALLY, TileType } from './levels';

export function getTileDimensions(): { width: number; height: number } {
  return {
    width: canvas.width / NB_OF_TILES_HORIZONTALLY,
    height: canvas.height / NB_OF_TILES_VERTICALLY,
  };
}

export function isSolid(tile: string | undefined): boolean {
  return tile === TileType.GROUND || tile === TileType.PLATFORM;
}

export function getTile(row: number, column: number): string | undefined {
  return levels[0].map[row]?.[column];
}

import { unicorn } from './unicorn';
import { clamp } from './utils';
import { canvas } from './canvas';
import { levels, NB_OF_TILES_HORIZONTALLY, NB_OF_TILES_VERTICALLY, TileType } from './levels';

export function triggerJump(): void {
  if (unicorn.isJumping) {
    return;
  }

  unicorn.isJumping = true;
  unicorn.velocityY = -unicorn.jumpStrength;
  unicorn.rotation = -0.65;
}

export function updatePhysics(): void {
  const tileWidth = canvas.width / NB_OF_TILES_HORIZONTALLY;
  const tileHeight = canvas.height / NB_OF_TILES_VERTICALLY;
  const column = Math.floor(unicorn.x / tileWidth);
  const feetY = unicorn.y + unicorn.height / 2;
  const row = Math.floor(feetY / tileHeight);
  const tileBelow = levels[0].map[row]?.[column];
  const isSupported = tileBelow === TileType.GROUND || tileBelow === TileType.PLATFORM;

  if (!unicorn.isJumping && isSupported) {
    unicorn.y = row * tileHeight - unicorn.height / 2;
    unicorn.velocityY = 0;
    unicorn.rotation = 0;
    return;
  }

  unicorn.velocityY += unicorn.gravity;
  const nextY = unicorn.y + unicorn.velocityY;
  const nextRow = Math.floor((nextY + unicorn.height / 2) / tileHeight);
  const nextTileBelow = levels[0].map[nextRow]?.[column];
  const willLand =
    unicorn.velocityY >= 0 &&
    (nextTileBelow === TileType.GROUND || nextTileBelow === TileType.PLATFORM);

  if (willLand) {
    unicorn.y = nextRow * tileHeight - unicorn.height / 2;
    unicorn.isJumping = false;
    unicorn.velocityY = 0;
    unicorn.rotation = 0;
    return;
  }

  unicorn.y = nextY;
  unicorn.rotation = clamp(unicorn.velocityY * 0.08, -1.5, 1.5);
}

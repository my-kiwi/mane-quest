import { unicorn } from './unicorn';
import { clamp } from './utils';
import { getTile, getTileDimensions, isSolid } from './levelGeometry';

export function triggerJump(): void {
  if (unicorn.isJumping) {
    return;
  }

  unicorn.isJumping = true;
  unicorn.velocityY = -unicorn.jumpStrength;
  unicorn.rotation = -0.65;
}

export function updatePhysics(): void {
  const { width: tileWidth, height: tileHeight } = getTileDimensions();
  const column = Math.floor(unicorn.x / tileWidth);
  const feetY = unicorn.y + unicorn.height / 2;
  const row = Math.floor(feetY / tileHeight);
  const isSupported = isSolid(getTile(row, column));

  if (!unicorn.isJumping && isSupported) {
    unicorn.y = row * tileHeight - unicorn.height / 2;
    unicorn.velocityY = 0;
    unicorn.rotation = 0;
    return;
  }

  unicorn.velocityY += unicorn.gravity;
  const nextY = unicorn.y + unicorn.velocityY;
  const nextRow = Math.floor((nextY + unicorn.height / 2) / tileHeight);
  const willLand = unicorn.velocityY >= 0 && isSolid(getTile(nextRow, column));

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

import { unicorn } from './unicorn';
import { killUnicorn } from './unicorn';
import { clamp } from './utils';
import { canvas } from './canvas';
import { getTile, getTileDimensions, isSolid, revealTile } from './levels/levelGeometry';
import { moveToNextYLevel } from './levels/levels';

export function triggerJump(): void {
  if (unicorn.isJumping && unicorn.remainingAirJumps <= 0) {
    return;
  }

  if (unicorn.isJumping) {
    unicorn.remainingAirJumps -= 1;
  } else {
    unicorn.remainingAirJumps = 1;
  }

  unicorn.isJumping = true;
  unicorn.velocityY = -unicorn.jumpStrength;
  unicorn.rotation = -0.75;
}

export function updatePhysics(frameScale = 1): void {
  if (unicorn.isDead) {
    return;
  }

  const { width: tileWidth, height: tileHeight } = getTileDimensions();
  const column = Math.floor(unicorn.x / tileWidth);
  const feetY = unicorn.y + unicorn.height / 2;
  const row = Math.floor(feetY / tileHeight);
  const supportedTile = getTile(row, column);
  const isSupported = isSolid(supportedTile);

  if (!unicorn.isJumping && isSupported) {
    revealTile(row, column);
    unicorn.y = row * tileHeight - unicorn.height / 2;
    unicorn.remainingAirJumps = 1;
    unicorn.velocityY = 0;
    unicorn.rotation = 0;
    return;
  }

  unicorn.velocityY += unicorn.gravity * frameScale;
  const nextY = unicorn.y + unicorn.velocityY * frameScale;
  const nextRow = Math.floor((nextY + unicorn.height / 2) / tileHeight);
  const landingTile = getTile(nextRow, column);
  const willLand = unicorn.velocityY >= 0 && isSolid(landingTile);

  if (willLand) {
    revealTile(nextRow, column);
    unicorn.y = nextRow * tileHeight - unicorn.height / 2;
    unicorn.isJumping = false;
    unicorn.remainingAirJumps = 1;
    unicorn.velocityY = 0;
    unicorn.rotation = 0;
    return;
  }

  unicorn.y = nextY;
  unicorn.rotation = clamp(unicorn.velocityY * 0.02, -1.5, 1.5);

  if (unicorn.y - unicorn.height / 2 > canvas.height) {
    if (moveToNextYLevel()) {
      unicorn.y = -unicorn.height / 2;
      unicorn.isJumping = true;
      return;
    }

    killUnicorn(performance.now());
  }
}

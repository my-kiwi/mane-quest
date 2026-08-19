import { unicorn } from './unicorn';
import { keys, targetX, setTargetPosition } from './input';
import { canvas } from './canvas';
import { clamp } from './utils';
import { levels, NB_OF_TILES_HORIZONTALLY, NB_OF_TILES_VERTICALLY, TileType } from './levels';

function isSolid(tile: string | undefined): boolean {
  return tile === TileType.GROUND || tile === TileType.PLATFORM;
}

function moveHorizontally(nextX: number): void {
  const tileWidth = canvas.width / NB_OF_TILES_HORIZONTALLY;
  const tileHeight = canvas.height / NB_OF_TILES_VERTICALLY;
  const collisionTolerance = tileHeight * 1e-6;
  const halfWidth = unicorn.width / 2;
  const currentLeft = unicorn.x - halfWidth;
  const currentRight = unicorn.x + halfWidth;
  const top = unicorn.y - unicorn.height / 2;
  const bottom = unicorn.y + unicorn.height / 2;
  const movingRight = nextX > unicorn.x;
  const movingLeft = nextX < unicorn.x;
  const nextLeft = nextX - halfWidth;
  const nextRight = nextX + halfWidth;
  const firstRow = Math.max(0, Math.floor(top / tileHeight));
  const lastRow = Math.min(
    NB_OF_TILES_VERTICALLY - 1,
    Math.floor((bottom - collisionTolerance) / tileHeight)
  );
  const firstColumn = Math.max(0, Math.floor(nextLeft / tileWidth));
  const lastColumn = Math.min(
    NB_OF_TILES_HORIZONTALLY - 1,
    Math.floor((nextRight - collisionTolerance) / tileWidth)
  );

  let resolvedX = nextX;
  for (let row = firstRow; row <= lastRow; row += 1) {
    for (let column = firstColumn; column <= lastColumn; column += 1) {
      if (!isSolid(levels[0].map[row]?.[column])) {
        continue;
      }

      const tileLeft = column * tileWidth;
      const tileRight = tileLeft + tileWidth;
      if (movingRight && currentRight <= tileLeft && nextRight > tileLeft) {
        resolvedX = Math.min(resolvedX, tileLeft - halfWidth);
      } else if (movingLeft && currentLeft >= tileRight && nextLeft < tileRight) {
        resolvedX = Math.max(resolvedX, tileRight + halfWidth);
      }
    }
  }

  unicorn.x = clamp(resolvedX, halfWidth, canvas.width - halfWidth);
}

export function updateMovement(): void {
  // Check if keyboard is being used
  const isKeyboardInput =
    keys['ArrowLeft'] || keys['a'] || keys['A'] || keys['ArrowRight'] || keys['d'] || keys['D'];

  if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
    moveHorizontally(unicorn.x - unicorn.speed);
    unicorn.direction = -1;
  }
  if (keys['ArrowRight'] || keys['d'] || keys['D']) {
    moveHorizontally(unicorn.x + unicorn.speed);
    unicorn.direction = 1;
  }

  if (isKeyboardInput) {
    setTargetPosition(unicorn.x, unicorn.y);
  }

  // Smooth movement towards click target when the keyboard is idle
  if (!isKeyboardInput && !unicorn.isJumping) {
    const dx = targetX - unicorn.x;
    const distance = Math.abs(dx);

    if (distance > 5) {
      const moveSpeed = Math.min(unicorn.speed, distance);
      moveHorizontally(unicorn.x + (dx / distance) * moveSpeed);

      if (dx !== 0) {
        unicorn.direction = dx > 0 ? 1 : -1;
      }
    }
  } else if (!isKeyboardInput) {
    const dx = targetX - unicorn.x;
    const distance = Math.abs(dx);

    if (distance > 5) {
      const moveSpeed = Math.min(unicorn.speed, distance);
      moveHorizontally(unicorn.x + (dx / distance) * moveSpeed);
      unicorn.direction = dx > 0 ? 1 : -1;
    }
  }
}

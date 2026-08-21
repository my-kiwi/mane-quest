import { unicorn } from './unicorn';
import { keys, targetX, setTargetPosition } from './input';
import { canvas } from './canvas';
import { clamp } from './utils';
import {
  getCurrentLevel,
  moveToNextLevel,
  moveToPreviousLevel,
  NB_OF_TILES_HORIZONTALLY,
  NB_OF_TILES_VERTICALLY,
  TileType,
} from './levels';
import { getTileDimensions, isSolid } from './levelGeometry';

const BALANCE_ROTATION = 0.12;
const BALANCE_STEP = 0.35;

function moveHorizontally(nextX: number): void {
  // Collision checks use the current level's tile size so they stay correct
  // when the canvas or level layout is resized.
  const { width: tileWidth, height: tileHeight } = getTileDimensions();
  const collisionTolerance = tileHeight * 1e-6;

  // The unicorn's x/y coordinates are its center. Use its horizontal hitbox
  // and vertical bounds to find the tiles that could block this move.
  const hitboxWidth = unicorn.width / 4;
  const currentLeft = unicorn.x - hitboxWidth;
  const currentRight = unicorn.x + hitboxWidth;
  const top = unicorn.y - unicorn.height / 2;
  const bottom = unicorn.y + unicorn.height / 2;
  const movingRight = nextX > unicorn.x;
  const movingLeft = nextX < unicorn.x;
  const nextLeft = nextX - hitboxWidth;
  const nextRight = nextX + hitboxWidth;
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
  // Only resolve a collision when the unicorn crosses a tile edge during this
  // frame. This prevents a nearby solid tile from pulling it backward.
  for (let row = firstRow; row <= lastRow; row += 1) {
    for (let column = firstColumn; column <= lastColumn; column += 1) {
      const tileType = getCurrentLevel().map[row]?.[column];
      if (!isSolid(tileType)) {
        continue;
      }

      const tileLeft = column * tileWidth;
      const tileRight = tileLeft + tileWidth;
      if (movingRight && currentRight <= tileLeft && nextRight > tileLeft) {
        // The unicorn is moving right and will collide with the left edge of a solid tile.
        resolvedX = Math.min(resolvedX, tileLeft - hitboxWidth);
      } else if (movingLeft && currentLeft >= tileRight && nextLeft < tileRight) {
        // The unicorn is moving left and will collide with the right edge of a solid tile.
        resolvedX = Math.max(resolvedX, tileRight + hitboxWidth);
      }
    }
  }

  // Move to the next map when the unicorn walks through the right edge.
  if (movingRight && resolvedX >= canvas.width - hitboxWidth && moveToNextLevel()) {
    unicorn.x = hitboxWidth;
    setTargetPosition(unicorn.x, unicorn.y);
    return;
  }

  // Move to the previous map when the unicorn walks through the left edge.
  if (movingLeft && resolvedX <= hitboxWidth && moveToPreviousLevel()) {
    unicorn.x = canvas.width - hitboxWidth;
    setTargetPosition(unicorn.x, unicorn.y);
    return;
  }

  // Keep the unicorn inside the visible canvas even when no tile blocks it.
  unicorn.x = clamp(resolvedX, hitboxWidth, canvas.width - hitboxWidth);
}

export function updateMovement(frameScale = 1): void {
  // Keyboard input takes priority over the click-to-move target.
  const isKeyboardInput =
    keys['ArrowLeft'] || keys['a'] || keys['A'] || keys['ArrowRight'] || keys['d'] || keys['D'];

  if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
    moveHorizontally(unicorn.x - unicorn.speed * frameScale);
    unicorn.direction = -1;
  }
  if (keys['ArrowRight'] || keys['d'] || keys['D']) {
    moveHorizontally(unicorn.x + unicorn.speed * frameScale);
    unicorn.direction = 1;
  }

  if (isKeyboardInput) {
    // Stop any previous click-to-move request where the unicorn currently is.
    setTargetPosition(unicorn.x, unicorn.y);
  }

  // When the keyboard is idle, move toward the last clicked position at a
  // capped speed so the unicorn stops exactly on the target.
  if (!isKeyboardInput) {
    const dx = targetX - unicorn.x;
    const distance = Math.abs(dx);

    if (distance > 5) {
      const moveSpeed = Math.min(unicorn.speed * frameScale, distance);
      moveHorizontally(unicorn.x + (dx / distance) * moveSpeed);
      unicorn.direction = dx > 0 ? 1 : -1;
    }
  }

  // Apply a small side-to-side rotation while moving to make the motion feel
  // less rigid. Jumping uses its own animation, so it is excluded here.
  if (!unicorn.isJumping && (isKeyboardInput || Math.abs(targetX - unicorn.x) > 5)) {
    unicorn.balancePhase += BALANCE_STEP * frameScale;
    unicorn.rotation = Math.sin(unicorn.balancePhase) * BALANCE_ROTATION;
  }
}

import { unicorn } from './unicorn';
import { keys, targetX, setTargetPosition } from './input';
import { canvas } from './canvas';
import { clamp } from './utils';
import { getCurrentLevel, moveToNextXLevel, moveToPreviousXLevel } from './levels/levels';
import { NB_OF_TILES_HORIZONTALLY, NB_OF_TILES_VERTICALLY } from './levels/level-type';
import { getTile, getTileDimensions, isSolid } from './levels/levelGeometry';
import { abs, floor, max, min } from './dom-helpers';

const BALANCE_ROTATION = 0.12;
const BALANCE_STEP = 0.35;

function moveHorizontally(nextX: number): boolean {
  // console.log(`moving horizontally to ${nextX}`);
  // Collision checks use the current level's tile size so they stay correct
  // when the canvas or level layout is resized.
  const { width: tileWidth, height: tileHeight } = getTileDimensions();
  const collisionTolerance = tileHeight * 1e-6;

  // The unicorn's x/y coordinates are its center. Use its horizontal hitbox
  // and vertical bounds to find the tiles that could block this move.
  const currentX = unicorn.x;
  const hitboxWidth = unicorn.width / 2;
  const currentLeft = currentX - hitboxWidth;
  const currentRight = currentX + hitboxWidth;
  const top = unicorn.y - unicorn.height / 2;
  const bottom = unicorn.y + unicorn.height / 2;
  const movingRight = nextX > currentX;
  const movingLeft = nextX < currentX;
  const nextLeft = nextX - hitboxWidth;
  const nextRight = nextX + hitboxWidth;
  const firstRow = max(0, floor(top / tileHeight));
  const lastRow = min(
    NB_OF_TILES_VERTICALLY - 1,
    floor((bottom - collisionTolerance) / tileHeight)
  );
  const firstColumn = max(0, floor(nextLeft / tileWidth));
  const lastColumn = min(
    NB_OF_TILES_HORIZONTALLY - 1,
    floor((nextRight - collisionTolerance) / tileWidth)
  );

  let resolvedX = nextX;
  // Only resolve a collision when the unicorn crosses a tile edge during this
  // frame. This prevents a nearby solid tile from pulling it backward.
  for (let row = firstRow; row <= lastRow; row += 1) {
    for (let column = firstColumn; column <= lastColumn; column += 1) {
      const tileType = getTile(row, column);
      if (!isSolid(tileType)) {
        continue;
      }

      const tileLeft = column * tileWidth;
      const tileRight = tileLeft + tileWidth;
      if (movingRight && currentRight <= tileLeft && nextRight > tileLeft) {
        // moving right >>>>>>>>>
        // console.log(`moving right and will collide with tile at ${column},${row}`);
        // The unicorn is moving right and will collide with the left edge of a solid tile.
        resolvedX = min(resolvedX, tileLeft - hitboxWidth);
      } else if (movingLeft && currentLeft >= tileRight && nextLeft < tileRight) {
        // moving left <<<<<<<<
        // console.log(`moving left and will collide with tile at ${column},${row}`);
        // The unicorn is moving left and will collide with the right edge of a solid tile.
        resolvedX = max(resolvedX, tileRight + hitboxWidth);
      }
    }
  }

  // Move to the next map when the unicorn walks through the right edge.
  if (movingRight && resolvedX >= canvas.width - hitboxWidth && moveToNextXLevel()) {
    // If the next level has a solid tile on the right edge, place the unicorn
    // just to the left of it. Otherwise, place it at the right edge of the canvas.
    const hasLeftWall = getCurrentLevel().map.some((row) => isSolid(row[0]));
    unicorn.x = hasLeftWall ? tileWidth + hitboxWidth : hitboxWidth;
    setTargetPosition(unicorn.x, unicorn.y);
    return true;
  }

  // Move to the previous map when the unicorn walks through the left edge.
  if (movingLeft && resolvedX <= hitboxWidth && moveToPreviousXLevel()) {
    const hasRightWall = getCurrentLevel().map.some((row) => isSolid(row.at(-1)));
    unicorn.x = hasRightWall ? canvas.width - tileWidth - hitboxWidth : canvas.width - hitboxWidth;
    setTargetPosition(unicorn.x, unicorn.y);
    return true;
  }

  // Keep the unicorn inside the visible canvas even when no tile blocks it.
  unicorn.x = clamp(resolvedX, hitboxWidth, canvas.width - hitboxWidth);
  return unicorn.x !== currentX;
}

export function updateMovement(frameScale = 1): void {
  if (unicorn.isDead) {
    return;
  }

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
    const distance = abs(dx);

    if (distance > 5) {
      const moveSpeed = min(unicorn.speed * frameScale, distance);
      const moved = moveHorizontally(unicorn.x + (dx / distance) * moveSpeed);
      if (!moved) {
        setTargetPosition(unicorn.x, unicorn.y);
      }
      unicorn.direction = dx > 0 ? 1 : -1;
    }
  }

  // Apply a small side-to-side rotation while moving to make the motion feel
  // less rigid. Jumping uses its own animation, so it is excluded here.
  if (!unicorn.isJumping && (isKeyboardInput || abs(targetX - unicorn.x) > 5)) {
    unicorn.balancePhase += BALANCE_STEP * frameScale;
    unicorn.rotation = Math.sin(unicorn.balancePhase) * BALANCE_ROTATION;
  }
}

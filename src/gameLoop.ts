import { draw } from './drawing';
import { hasTile, resetToStartLevel } from './levels/levels';
import { updateMovement } from './movement';
import { updatePhysics } from './physics';
import { killUnicorn, resetUnicornPosition, unicorn } from './unicorn';
import { DEATH_SCREEN_DURATION, MAX_FRAME_SCALE } from './constants';
import { getCurrentLevel } from './levels/levels';
import { canvas } from './canvas';
import { isFireballTouchingEnemy, isUnicornTouchingEnemy } from './collisions';
import { ENEMY_HIT_STUN_DURATION, updateEnemyMovement } from './enemy';
import { TileType } from './levels/level-type';
import { fireball, updateFireball } from './fireball';
import { getTile, getTileDimensions, removeTile } from './levels/levelGeometry';
import { floor, max, min } from './dom-helpers';

const FRAME_DURATION = 1000 / 60;

export function update(currentTime = Date.now(), frameScale = 1): void {
  if (unicorn.isDead) {
    if (Date.now() - unicorn.diedAt >= DEATH_SCREEN_DURATION) {
      resetToStartLevel();
      resetUnicornPosition();
      return;
    }

    updateEnemyMovement(frameScale, currentTime);
    return;
  }

  // Update physics first (handle jumping and gravity)
  updatePhysics(frameScale);

  updateFireball(frameScale);

  destroyWallWithFireball();

  // Update movement (handle input and target movement)
  updateMovement(frameScale);

  // Update enemy movement
  const level = getCurrentLevel();
  if (level.enemy && hasTile(level, TileType.ENEMY)) {
    updateEnemyMovement(frameScale, currentTime);
    if (
      !level.enemy.isDead &&
      fireball.isActive &&
      isFireballTouchingEnemy({ ...fireball.position, ...fireball }, level.enemy)
    ) {
      fireball.isActive = false;
      level.enemy.hp--;
      if (level.enemy.hp <= 0) {
        level.enemy.isDead = true;
        level.enemy.diedAt = Date.now();
      } else {
        level.enemy.stunnedUntil = currentTime + ENEMY_HIT_STUN_DURATION;
      }
    }
    if (!level.enemy.isDead && isUnicornTouchingEnemy(unicorn, level.enemy)) {
      killUnicorn(currentTime);
    }
  }
}

function destroyWallWithFireball(): void {
  if (!fireball.isActive) {
    return;
  }

  const level = getCurrentLevel();
  const { width: tileWidth, height: tileHeight } = getTileDimensions();
  const left = fireball.position.x - fireball.width / 2;
  const right = fireball.position.x + fireball.width / 2;
  const top = fireball.position.y - fireball.height / 2;
  const bottom = fireball.position.y + fireball.height / 2;
  const firstColumn = max(0, floor(left / tileWidth));
  const lastColumn = min(level.map[0].length - 1, floor(right / tileWidth));
  const firstRow = max(0, floor(top / tileHeight));
  const lastRow = min(level.map.length - 1, floor(bottom / tileHeight));

  for (let row = firstRow; row <= lastRow; row += 1) {
    for (let column = firstColumn; column <= lastColumn; column += 1) {
      if (getTile(row, column) !== TileType.WALL) {
        continue;
      }

      const tileLeft = column * tileWidth;
      const tileRight = tileLeft + tileWidth;
      const tileTop = row * tileHeight;
      const tileBottom = tileTop + tileHeight;
      if (right >= tileLeft && left <= tileRight && bottom >= tileTop && top <= tileBottom) {
        removeTile(row, column);
        fireball.isActive = false;
        return;
      }
    }
  }
}

export function startGameLoop(): void {
  let previousTime: number | undefined;

  function gameLoop(currentTime: number) {
    const frameScale =
      previousTime === undefined
        ? 1
        : min((currentTime - previousTime) / FRAME_DURATION, MAX_FRAME_SCALE);
    previousTime = currentTime;

    update(currentTime, frameScale);
    draw();
    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}

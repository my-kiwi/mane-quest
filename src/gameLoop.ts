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

const FRAME_DURATION = 1000 / 60;

export function update(currentTime = performance.now(), frameScale = 1): void {
  if (unicorn.isDead) {
    if (currentTime - unicorn.diedAt >= DEATH_SCREEN_DURATION) {
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
      level.enemy.hp --;
      fireball.isActive = false;
      if(level.enemy.hp === 0) {
        level.enemy.isDead = true;
        level.enemy.diedAt = currentTime;
      } else {
        level.enemy.stunnedUntil = currentTime + ENEMY_HIT_STUN_DURATION;
      }
    }
    if (!level.enemy.isDead && isUnicornTouchingEnemy(unicorn, level.enemy)) {
      killUnicorn(currentTime);
    }
  }
}

export function startGameLoop(): void {
  let previousTime: number | undefined;

  function gameLoop(currentTime: number) {
    const frameScale =
      previousTime === undefined
        ? 1
        : Math.min((currentTime - previousTime) / FRAME_DURATION, MAX_FRAME_SCALE);
    previousTime = currentTime;

    update(currentTime, frameScale);
    draw();
    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}

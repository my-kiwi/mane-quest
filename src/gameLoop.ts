import { draw } from './drawing';
import { resetToStartLevel } from './levels/levels';
import { updateMovement } from './movement';
import { updatePhysics } from './physics';
import { killUnicorn, resetUnicornPosition, unicorn, updateUnicornBlink } from './unicorn';
import { DEATH_SCREEN_DURATION, MAX_FRAME_SCALE } from './constants';
import { getCurrentLevel } from './levels/levels';
import { canvas } from './canvas';
import { isUnicornTouchingEnemy } from './collisions';
import { updateEnemyMovement } from './enemy';

const FRAME_DURATION = 1000 / 60;

export function update(currentTime = performance.now(), frameScale = 1): void {
  if (unicorn.isDead) {
    if (currentTime - unicorn.diedAt >= DEATH_SCREEN_DURATION) {
      resetToStartLevel();
      resetUnicornPosition();
      return;
    }

    updateEnemyMovement(frameScale);
    return;
  }

  updateUnicornBlink(currentTime);

  // Update physics first (handle jumping and gravity)
  updatePhysics(frameScale);

  // Update movement (handle input and target movement)
  updateMovement(frameScale);

  // Update enemy movement
  const level = getCurrentLevel();
  if (level.enemy) {
    updateEnemyMovement(frameScale);
    if (isUnicornTouchingEnemy(unicorn, level.enemy)) {
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

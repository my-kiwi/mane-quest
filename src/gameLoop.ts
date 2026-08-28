import { draw } from './drawing';
import { resetToStartLevel } from './levels/levels';
import { updateMovement } from './movement';
import { updatePhysics } from './physics';
import { killUnicorn, resetUnicornPosition, unicorn, updateUnicornBlink } from './unicorn';
import { getCurrentLevel } from './levels/levels';
import { canvas } from './canvas';

export function isUnicornTouchingEnemy(
  unicornSprite: { x: number; y: number; width: number; height: number },
  enemySprite: { x: number; y: number; width: number; height: number }
): boolean {
  const unicornLeft = unicornSprite.x - unicornSprite.width / 2;
  const unicornRight = unicornSprite.x + unicornSprite.width / 2;
  const unicornTop = unicornSprite.y - unicornSprite.height / 2;
  const unicornBottom = unicornSprite.y + unicornSprite.height / 2;

  const enemyLeft = enemySprite.x - enemySprite.width / 2;
  const enemyRight = enemySprite.x + enemySprite.width / 2;
  const enemyTop = enemySprite.y - enemySprite.height / 2;
  const enemyBottom = enemySprite.y + enemySprite.height / 2;

  return (
    unicornRight >= enemyLeft &&
    unicornLeft <= enemyRight &&
    unicornBottom >= enemyTop &&
    unicornTop <= enemyBottom
  );
}

const FRAME_DURATION = 1000 / 60;
const MAX_FRAME_SCALE = 3;
const DEATH_SCREEN_DURATION = 3000;

export function update(currentTime = performance.now(), frameScale = 1): void {
  if (unicorn.isDead) {
    if (currentTime - unicorn.diedAt >= DEATH_SCREEN_DURATION) {
      resetToStartLevel();
      resetUnicornPosition();
    }
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
    level.enemy.x += level.enemy.speed * level.enemy.direction * frameScale;
    if (level.enemy.x > canvas.width - 10 || level.enemy.x < 0) {
      level.enemy.direction = -level.enemy.direction;
    }

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

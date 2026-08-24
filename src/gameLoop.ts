import { draw } from './drawing';
import { resetToFirstLevel } from './levels';
import { updateMovement } from './movement';
import { updatePhysics } from './physics';
import { resetUnicornPosition, unicorn, updateUnicornBlink } from './unicorn';

const FRAME_DURATION = 1000 / 60;
const MAX_FRAME_SCALE = 3;
const DEATH_SCREEN_DURATION = 1500;

export function update(currentTime = performance.now(), frameScale = 1): void {
  if (unicorn.isDead) {
    if (currentTime - unicorn.diedAt >= DEATH_SCREEN_DURATION) {
      resetToFirstLevel();
      resetUnicornPosition();
    }
    return;
  }

  updateUnicornBlink(currentTime);

  // Update physics first (handle jumping and gravity)
  updatePhysics(frameScale);

  // Update movement (handle input and target movement)
  updateMovement(frameScale);
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

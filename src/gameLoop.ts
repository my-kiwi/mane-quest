import { draw } from './drawing';
import { updateMovement } from './movement';
import { updatePhysics } from './physics';
import { updateUnicornBlink } from './unicorn';

const FRAME_DURATION = 1000 / 60;
const MAX_FRAME_SCALE = 3;

export function update(currentTime = performance.now(), frameScale = 1): void {
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

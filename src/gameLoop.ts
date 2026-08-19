import { draw } from './drawing';
import { updateMovement } from './movement';
import { updatePhysics } from './physics';

export function update(): void {
  // Update physics first (handle jumping and gravity)
  updatePhysics();

  // Update movement (handle input and target movement)
  updateMovement();
}

export function startGameLoop(): void {
  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

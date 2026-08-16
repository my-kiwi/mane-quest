import { draw } from './drawing';
import { updateMovement } from './movement';
import { updatePhysics } from './physics';
import { getGroundY } from './input';

export function update(): void {
  const minY = getGroundY();

  // Update physics first (handle jumping and gravity)
  updatePhysics(minY);

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

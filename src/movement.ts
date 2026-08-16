import { unicorn } from './unicorn';
import { keys, targetX, targetY, getGroundY } from './input';
import { canvas } from './canvas';
import { clamp } from './utils';

export function updateMovement(): void {
  const minY = getGroundY();

  // Check if keyboard is being used
  const isKeyboardInput =
    keys['ArrowLeft'] || keys['a'] || keys['A'] || keys['ArrowRight'] || keys['d'] || keys['D'];

  if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
    unicorn.x -= unicorn.speed;
    unicorn.direction = -1;
  }
  if (keys['ArrowRight'] || keys['d'] || keys['D']) {
    unicorn.x += unicorn.speed;
    unicorn.direction = 1;
  }

  unicorn.x = clamp(unicorn.x, unicorn.width / 2, canvas.width - unicorn.width / 2);

  if (isKeyboardInput) {
    // Update target when using keyboard
    const dx = targetX - unicorn.x;
    const dy = targetY - minY;

    // Only update targetX and targetY on keyboard input
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      // Keep target at keyboard input position
    }
  }

  // Smooth movement towards click target
  if (!unicorn.isJumping) {
    const dx = targetX - unicorn.x;
    const dy = targetY - unicorn.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
      const moveSpeed = Math.min(unicorn.speed, distance);
      unicorn.x += (dx / distance) * moveSpeed;
      unicorn.y += (dy / distance) * moveSpeed;

      if (dx !== 0) {
        unicorn.direction = dx > 0 ? 1 : -1;
      }
    }
  } else {
    const dx = targetX - unicorn.x;
    const distance = Math.abs(dx);

    if (distance > 5) {
      const moveSpeed = Math.min(unicorn.speed, distance);
      unicorn.x += (dx / distance) * moveSpeed;
      unicorn.direction = dx > 0 ? 1 : -1;
    }
  }
}

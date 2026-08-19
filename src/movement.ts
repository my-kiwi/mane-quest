import { unicorn } from './unicorn';
import { keys, targetX, setTargetPosition } from './input';
import { canvas } from './canvas';
import { clamp } from './utils';

export function updateMovement(): void {
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
    setTargetPosition(unicorn.x, unicorn.y);
  }

  // Smooth movement towards click target when the keyboard is idle
  if (!isKeyboardInput && !unicorn.isJumping) {
    const dx = targetX - unicorn.x;
    const distance = Math.abs(dx);

    if (distance > 5) {
      const moveSpeed = Math.min(unicorn.speed, distance);
      unicorn.x += (dx / distance) * moveSpeed;

      if (dx !== 0) {
        unicorn.direction = dx > 0 ? 1 : -1;
      }
    }
  } else if (!isKeyboardInput) {
    const dx = targetX - unicorn.x;
    const distance = Math.abs(dx);

    if (distance > 5) {
      const moveSpeed = Math.min(unicorn.speed, distance);
      unicorn.x += (dx / distance) * moveSpeed;
      unicorn.direction = dx > 0 ? 1 : -1;
    }
  }
}

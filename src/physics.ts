import { unicorn } from './unicorn';
import { clamp } from './utils';

export function triggerJump(): void {
  if (unicorn.isJumping) {
    return;
  }

  unicorn.isJumping = true;
  unicorn.velocityY = -unicorn.jumpStrength;
  unicorn.rotation = -0.65;
}

export function updatePhysics(minY: number): void {
  if (unicorn.isJumping) {
    unicorn.velocityY += unicorn.gravity;
    unicorn.y += unicorn.velocityY;
    unicorn.rotation = clamp(unicorn.velocityY * 0.08, -1.5, 1.5);

    if (unicorn.y >= minY) {
      unicorn.y = minY;
      unicorn.isJumping = false;
      unicorn.velocityY = 0;
      unicorn.rotation = 0;
    }
  } else {
    unicorn.y = minY;
    unicorn.rotation = 0;
  }
}

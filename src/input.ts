import { canvas } from './canvas';
import { unicorn } from './unicorn';
import { triggerJump } from './physics';
import { clamp } from './utils';
import { SKY_HEIGHT_RATIO } from './constants';

// Input state
export const keys: { [key: string]: boolean } = {};
export let targetX = 0;
export let targetY = 0;

export function setTargetPosition(x: number, y: number): void {
  targetX = x;
  targetY = y;
}

export function getGroundY(): number {
  return canvas.height * SKY_HEIGHT_RATIO - unicorn.height / 3;
}

function handleCanvasInteraction(x: number, y: number): void {
  setTargetPosition(clamp(x, unicorn.width / 2, canvas.width - unicorn.width / 2), getGroundY());

  if (y < unicorn.y - 50) {
    triggerJump();
  }
}

export function initializeInput(): void {
  // Keyboard input
  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    keys[e.key] = true;

    if ((e.key === 'ArrowUp' || key === 'w') && !e.repeat) {
      triggerJump();
    }
  });

  document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });

  // Click to move / jump
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    handleCanvasInteraction(clickX, clickY);
  });

  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = ((touch.clientX - rect.left) / rect.width) * canvas.width;
    const touchY = ((touch.clientY - rect.top) / rect.height) * canvas.height;

    handleCanvasInteraction(touchX, touchY);
  });

  // Initialize target position
  setTargetPosition(unicorn.x, getGroundY());
}

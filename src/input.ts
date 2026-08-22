import { canvas } from './canvas';
import { unicorn } from './unicorn';
import { triggerJump } from './physics';
import { clamp } from './utils';
import { getCurrentLevel, TileType } from './levels';
import { getTileDimensions } from './levelGeometry';
import { interactWithPnj, isPointOnDialogueBubble, isPointOnPnj } from './npcInteraction';

// Input state
export const keys: { [key: string]: boolean } = {};
export let targetX = 0;
export let targetY = 0;

export function setTargetPosition(x: number, y: number): void {
  targetX = x;
  targetY = y;
}

export function getGroundY(): number {
  const groundRow = getCurrentLevel().map.findIndex((row) => row.includes(TileType.GROUND));
  const groundTop =
    (groundRow >= 0 ? groundRow : getCurrentLevel().map.length) * getTileDimensions().height;

  return groundTop - unicorn.height / 2;
}

function handleCanvasInteraction(x: number, y: number): void {
  if ((isPointOnPnj(x, y) || isPointOnDialogueBubble(x, y)) && interactWithPnj()) {
    return;
  }

  setTargetPosition(x, getGroundY());

  if (y < unicorn.y - unicorn.height / 1.5) {
    triggerJump();
  }
}

export function initializeInput(): void {
  // Keyboard input
  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    keys[e.key] = true;

    if (e.key === 'Enter' && !e.repeat) {
      interactWithPnj();
    }

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

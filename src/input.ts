import { canvas } from './canvas';
import { unicorn } from './unicorn';
import { triggerJump } from './physics';
import { clamp } from './utils';
import { getCurrentLevel } from './levels/levels';
import { TileType } from './levels/level-type';
import { getTileDimensions } from './levels/levelGeometry';
import { interactWithNpc, isPointOnDialogueBubble, isPointOnNpc } from './npcInteraction';

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
  if (isPointOnNpc(x, y) && interactWithNpc()) {
    return;
  }

  setTargetPosition(x, getGroundY());

  if (
    y < unicorn.y - unicorn.height / 1.5 || // jump when y above unicorn
    (x >= unicorn.x - unicorn.width / 2 && x <= unicorn.x + unicorn.width / 2) || // or when clicking on x unicorn
    unicorn.isJumping // or if already jumping
  ) {
    triggerJump();
  }
}

export function initializeInput(): void {
  const dialogueBubble = document.getElementById('npc-dialogue');

  // Keyboard input
  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    keys[e.key] = true;

    if (e.key === 'Enter' && !e.repeat) {
      interactWithNpc();
    }

    if ((e.key === 'ArrowUp' || e.code === 'Space' || key === 'w') && !e.repeat) {
      triggerJump();
    }
  });

  document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });

  dialogueBubble?.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    interactWithNpc();
  });

  // click + touch input
  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    handleCanvasInteraction(x, y);
  });

  // Initialize target position
  setTargetPosition(unicorn.x, getGroundY());
}

// Canvas setup and management
import { GAME_HEIGHT, GAME_WIDTH } from './constants';

export let canvas: HTMLCanvasElement;

export function initializeCanvas(): void {
  canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas(): void {
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
}

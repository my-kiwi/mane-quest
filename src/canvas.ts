// Canvas setup and management
import { GAME_HEIGHT, GAME_WIDTH } from './constants';

export const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

export function resizeCanvas(): void {
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
}

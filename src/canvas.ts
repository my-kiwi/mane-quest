// Canvas setup and management
import { GAME_HEIGHT, GAME_WIDTH } from './constants';
import { addEventListener, getElementById } from './dom-helpers';

export const canvas = getElementById('g') as HTMLCanvasElement;

resizeCanvas();
addEventListener('resize', resizeCanvas);

export function resizeCanvas(): void {
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
}

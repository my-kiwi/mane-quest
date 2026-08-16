import { Unicorn } from './types';
import { canvas } from './canvas';

// Unicorn properties and state
export const unicorn: Unicorn = {
  image: new Image(),
  x: 0, // Will be set to center in initialize
  y: 0,
  width: 80,
  height: 80,
  speed: 5,
  direction: -1, // -1 for left, 1 for right
  isJumping: false,
  velocityY: 0,
  jumpStrength: 13,
  gravity: 0.7,
  rotation: 0,
};

export function initializeUnicorn(): void {
  unicorn.image.src = './uni-red.png';
  unicorn.x = canvas.width / 2;
  unicorn.y = 0;
}

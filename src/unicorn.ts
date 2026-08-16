import { Unicorn } from './types';
import { canvas } from './canvas';
import { getMinHeightWidth, getWidth, getHeight } from './utils';

// Unicorn properties and state
export const unicorn: Unicorn = {
  image: new Image(),
  x: 0, // Will be set to center in initialize
  y: 0,
  get width() {
    return getMinHeightWidth() * 0.1; // 10% of the smaller dimension
  },
  get height() {
    return getMinHeightWidth() * 0.1; // 10% of the smaller dimension
  },
  get speed() {
    return getWidth() * 0.005;
  },
  direction: -1, // -1 for left, 1 for right
  isJumping: false,
  velocityY: 0,
  get jumpStrength() {
    return getHeight() * 0.02;
  },
  gravity: 0.7,
  rotation: 0,
};

export function initializeUnicorn(): void {
  unicorn.image.src = './uni-red.png';
  unicorn.x = canvas.width / 2;
  unicorn.y = 0;
}

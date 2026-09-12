import { canvas } from './canvas';
import { max as mathMax, min as mathMin } from './dom-helpers';

// Utility functions
export const clamp = (value: number, min: number, max: number) => mathMin(mathMax(value, min), max);

export const getHeight = () => {
  return canvas.height;
};

export const getWidth = () => {
  return canvas.width;
};

export const getMinHeightWidth = () => {
  return mathMin(getHeight(), getWidth());
};

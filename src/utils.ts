import { canvas } from './canvas';

// Utility functions
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const getHeight = () => {
  return canvas.height;
};

export const getWidth = () => {
  return canvas.width;
};

export const getMinHeightWidth = () => {
  return Math.min(getHeight(), getWidth());
};

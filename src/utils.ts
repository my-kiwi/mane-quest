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

// aliases for improved minification
export const win = window;
export const addEventListener = win.addEventListener.bind(win);
export const removeEventListener = win.removeEventListener.bind(win);

export const doc = document;
export const querySelectorAll = doc.querySelectorAll.bind(doc);
export const querySelector = doc.querySelector.bind(doc);
export const getElementById = doc.getElementById.bind(doc);
export const createElement = doc.createElement.bind(doc);

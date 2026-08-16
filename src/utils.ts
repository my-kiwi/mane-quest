// Utility functions
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const getHeight = () => {
  return window.innerHeight;
};

export const getWidth = () => {
  return window.innerWidth;
};

export const getMinHeightWidth = () => {
  return Math.min(getHeight(), getWidth());
};

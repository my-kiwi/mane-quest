export const encodeSvg = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export const createLinearGradient = (id: string, colors: string[]) => {
  const stops = colors
    .map((color, index) => `<stop offset="${index * 25}%" stop-color="${color}"/>`)
    .join('');

  return `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">${stops}</linearGradient>`;
};

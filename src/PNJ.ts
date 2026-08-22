import { createUnicornSvg, unicorn, UnicornSvgProps } from './unicorn';

export type PNJ = typeof sagePnj;

export const sagePnj = {
  name: 'Sage',
  image: new Image(),
  scale: 1,
  colors: {
    hornColor: '#B68B3C',
    tailColor: '#A7AFB7',
    bodyColor: '#F1E8D8',
    leftFootColor: '#6B4F3A',
    rightFootColor: '#6B4F3A',
    maneColor: '#A7AFB7',
  },
  dialogue: [
    { line: 'Welcome, dear unicorn.' },
    { line: 'I am the wise sage of this land.' },
    { line: '...' },
    { who: unicorn, line: '...' },
    { line: '...' },
    { who: unicorn, line: '...' },
    { line: "Look, I don't actually have any wisdom. I just stand here." },
    { line: 'What do you want, a goodbye kiss?' },
  ],
};
sagePnj.image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  createUnicornSvg(sagePnj.colors)
)}`;

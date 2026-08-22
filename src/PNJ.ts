import { createSvg } from './unicorn';

export type PNJ = typeof sagePnj;

export const sagePnj = {
  name: 'Sage',
  image: new Image(),
  scale: 1,
  dialogue: [
    'Greetings, traveler! I am the Sage of the Forest.',
    'I have been watching over this land for many years.',
    'The path ahead is treacherous, but I believe in your strength.',
    'Remember, wisdom and courage will guide you through the darkest of times.',
    'May the winds of fortune be at your back!',
  ],
};
sagePnj.image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  createSvg({
    hornColor: '#B68B3C',
    tailColor: '#A7AFB7',
    bodyColor: '#F1E8D8',
    leftFootColor: '#6B4F3A',
    rightFootColor: '#6B4F3A',
    maneColor: '#A7AFB7',
  })
)}`;

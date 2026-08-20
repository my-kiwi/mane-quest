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
    return getWidth() * 0.0025;
  },
  direction: -1, // -1 for left, 1 for right
  isJumping: false,
  velocityY: 0,
  get jumpStrength() {
    return getHeight() * 0.015;
  },
  gravity: 0.7,
  rotation: 0,
};

export function initializeUnicorn(): void {
  unicorn.image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(hero)}`;
  unicorn.x = canvas.width / 2;
  unicorn.y = 0;
}

type SvgProps = {
  hornColor?: string;
  tailColor?: string;
  bodyColor?: string;
  leftFootColor?: string;
  rightFootColor?: string;
  eyeExtColor?: string;
  eyeIntColor?: string;
  maneColor?: string;
};

export function createSvg({
  hornColor,
  tailColor,
  bodyColor,
  leftFootColor,
  rightFootColor,
  eyeExtColor,
  eyeIntColor,
  maneColor,
}: SvgProps = {}): string {
  return `
<svg width="800" height="600.0000000000001" xmlns="http://www.w3.org/2000/svg">
 <g>
  <path id="horn" stroke="#000" fill="${hornColor || '#fff'}" d="m610.28598,85.14294l64.57133,-52.5715c0.00011,0.00006 6.85726,-3.42851 8.57154,-1.1428c1.71429,2.28571 -1.71429,6.28572 -1.7144,6.28565c0.00011,0.00006 -48.57133,52.5715 -48.57144,52.57144c0.00011,0.00006 48.57155,140.0001 -22.85704,-5.1428z"  />
  <path id="tail" stroke="#000" fill="${tailColor || '#fff'}" d="m22.77862,350.05392c37.48284,-69.81227 53.82151,-112.63046 86.49886,-129.3854c32.67735,-16.75494 37.48284,-26.06325 84.57666,-8.37747c47.09382,17.68577 -15.37757,17.68577 -15.37757,17.68577c0,0 -23.06636,-8.37747 -35.56064,3.72332c-12.49428,12.10079 -52.86041,91.22136 -59.5881,96.80634c-6.72769,5.58498 -98.03204,89.3597 -60.5492,19.54744z" />
  <path id="body" stroke="#000" fill="${bodyColor || '#FFF'}" d="m205,205.28571c29,-10 59,-16 92,-7c33,9 61,26 93,15c32,-11 192,-120 201,-130c9,-10 17,-24 19,-22c2,2 -1,30 3,30c4,0 22,-1 22,-1c0,0 63,49 63,49c0,0 15,24 9,31c-6,7 -17,17 -34,8c-17,-9 -20,-25 -39,-20c-19,5 -56,59 -74,108c-18,49 -33,67 -41,93c-8,26 -31,138 -32,166c-1,28 -30,19 -30,19c0,0 1,-187 1,-187c0,0 -36,30 -98,10c-62,-20 -79,-32 -79,-32c0,0 -45,53 -50,68c-5,15 8,74 9,100c1,26 -31,43 -30,36c1,-7 -24,-102 -23,-123c1,-21 7,-67 -2,-85c-9,-18 -17,-91 -3,-108c14,-17 -6,-8 23,-18z" />
  <rect id="left_foot" stroke="#000" fill="${leftFootColor || '#fff'}"   height="37" width="34" y="519" x="206" />
  <rect id="right_foot" stroke="#000" fill="${rightFootColor || '#fff'}" height="33" width="35" y="522" x="455" />
  <ellipse class="eye_ext" stroke="#000" fill="${eyeExtColor || '#fff'}" ry="7" rx="7" id="svg_12" cy="121" cx="634" />
  <ellipse class="eye_int" stroke="#fff" fill="${eyeIntColor || '#000'}" ry="4.57143" rx="4.28572" id="svg_14" cy="124.00009" cx="636.28599" />
  <path id="mouth" stroke="#000000" fill="none" d="m680.00028,158.28582c9.71429,10.28572 14.28572,22.85715 14.28561,22.85709" />
  <path id="eyebrow" stroke="#000000" fill="none" d="m630.28598,100.57152c1.71429,1.14286 12.57143,2.85714 16,13.71429"  />
  <path id="mane" stroke="#000" fill="${maneColor || '#fff'}" d="m589.85756,84.42865c1.71429,5.71429 7.42857,62.28573 -5.14286,81.71431c-12.57143,19.42858 -19.42858,-10.85715 -19.42869,-10.85721c0.00011,0.00006 -5.14275,28.00007 -13.14275,32.5715c-8,4.57143 -25.14286,-8.57143 -30.28572,-1.71429c-5.14286,6.85714 -25.71429,33.71429 -28.57144,17.71429c-2.85714,-16 -8.57143,-42.28573 -5.71429,-50.85716c2.85714,-8.57143 100.57145,-74.28573 102.28574,-68.57145z" />
 </g>
</svg>
  `;
}

export const hero = createSvg({
  hornColor: '#FFD700', // Gold
  tailColor: '#FF69B4', // Hot Pink
  bodyColor: '#FFFFFF', // White
  leftFootColor: '#8B4513', // Saddle Brown
  rightFootColor: '#8B4513', // Saddle Brown
  maneColor: '#FF69B4', // Dodger Blue
});

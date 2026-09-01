import { canvas } from './canvas';
import { getCurrentLevel } from './levels/levels';

export type Enemy = typeof firstEnemy;

const ENEMY_SIZE_MULTIPLIER = 2.5;

export function updateEnemyMovement(frameScale: number) {
  const level = getCurrentLevel();
  if (level.enemy) {
    level.enemy.x += level.enemy.speed * level.enemy.direction * frameScale;
    if (level.enemy.x > canvas.width - 10 || level.enemy.x < 0) {
      level.enemy.direction = -level.enemy.direction;
    }
  }
}

export const firstEnemy = {
  hp: 1,
  // svg etc
  image: new Image(),
  x: 0, // will be initialized when level loads
  y: 0, // will be initialized when level loads
  speed: canvas.width * 0.001,
  direction: 1,
  get width() {
    return canvas.width * 0.1 * ENEMY_SIZE_MULTIPLIER;
  },
  get height() {
    return canvas.height * 0.2 * ENEMY_SIZE_MULTIPLIER;
  },
  get yOffset() {
    return -canvas.height * 0.015 * ENEMY_SIZE_MULTIPLIER;
  },
};

const enemySvg = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path d="M50,80 Q70,30 100,50 Q130,20 150,80 Q170,120 140,150 Q100,170 70,140 Q40,120 50,80"
        fill="url(#rainbow)" stroke="black" stroke-width="2" />
  <circle cx="90" cy="60" r="15" fill="white" stroke="black" stroke-width="2" />
  <circle cx="95" cy="65" r="5" fill="black" />
    <circle cx="120" cy="60" r="15" fill="white" stroke="black" stroke-width="2" />
  <circle cx="120" cy="65" r="5" fill="black" />
  <line x1="80" y1="140" x2="70" y2="180" stroke="black" stroke-width="3" />
  <path d="M100,140 Q110,160 120,180" stroke="black" stroke-width="3" fill="none" />
  <line x1="130" y1="140" x2="140" y2="160" stroke="black" stroke-width="3" />
  <circle cx="140" cy="160" r="5" fill="pink" />
  <path d="M70,100 Q90,120 110,100" stroke="black" stroke-width="2" fill="none" />
  <defs>
    <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="red" />
      <stop offset="25%" stop-color="orange" />
      <stop offset="50%" stop-color="yellow" />
      <stop offset="75%" stop-color="green" />
      <stop offset="100%" stop-color="blue" />
    </linearGradient>
  </defs>
</svg>`;

firstEnemy.image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(enemySvg)}`;

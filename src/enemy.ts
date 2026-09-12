import { canvas } from './canvas';
import { getCurrentLevel } from './levels/levels';
import { createLinearGradient, encodeSvg } from './svg-helpers';

export type Enemy = typeof firstEnemy;

const ENEMY_SIZE_MULTIPLIER = 2.5;
export const ENEMY_DEATH_DURATION = 2000;
export const ENEMY_HIT_STUN_DURATION = 2000;

export function updateEnemyMovement(frameScale: number, currentTime = Date.now()) {
  const level = getCurrentLevel();
  if (level.enemy && !level.enemy.isDead && currentTime >= level.enemy.stunnedUntil) {
    level.enemy.x += level.enemy.speed * level.enemy.direction * frameScale;
    if (level.enemy.x > canvas.width - 10 || level.enemy.x < 0) {
      level.enemy.direction = -level.enemy.direction;
    }
  }
}

export const firstEnemy = {
  hp: 1, // TODO more hp?
  isDead: false,
  diedAt: 0,
  stunnedUntil: 0,
  // svg etc
  image: new Image(),
  deadImage: new Image(),
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

const firstEnemyGradient = createLinearGradient('a', ['red', 'orange', '#ff0', 'green', '#00f']);

const enemySvg = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M50 80q20-50 50-30 30-30 50 30 20 40-10 70-40 20-70-10-30-20-20-60" fill="url(#a)" stroke="#000" stroke-width="2"/><circle cx="90" cy="60" r="15" fill="#fff" stroke="#000" stroke-width="2"/><circle cx="95" cy="65" r="5"/><circle cx="120" cy="60" r="15" fill="#fff" stroke="#000" stroke-width="2"/><circle cx="120" cy="65" r="5"/><path d="M70 100q20 20 40 0" stroke="#000" stroke-width="2" fill="none"/>
  <defs>${firstEnemyGradient}</defs></svg>`;

firstEnemy.image.src = encodeSvg(enemySvg);
firstEnemy.deadImage.src = encodeSvg(enemySvg.replace('url(#a)', 'black'));

export const secondEnemy = {
  ...firstEnemy,
  image: new Image(),
  deadImage: new Image(),
  speed: canvas.width * 0.002,
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

const secondEnemySvg = enemySvg
  .replace('url(#a)', 'url(#b)')
  .replace(
    firstEnemyGradient,
    createLinearGradient('b', ['purple', 'blue', '#0ff', 'green', '#ff0'])
  );

secondEnemy.image.src = encodeSvg(secondEnemySvg);
secondEnemy.deadImage.src = encodeSvg(secondEnemySvg.replace('url(#b)', 'black'));

export const thirdEnemy = {
  ...firstEnemy,
  hp: 5, // todo revert
  image: new Image(),
  deadImage: new Image(),
  speed: canvas.width * 0.005,
  get width() {
    return canvas.width * 0.15 * ENEMY_SIZE_MULTIPLIER;
  },
  get height() {
    return canvas.height * 0.3 * ENEMY_SIZE_MULTIPLIER;
  },
  get yOffset() {
    return -canvas.height * 0.015 * ENEMY_SIZE_MULTIPLIER;
  },
};

const thirdEnemySvg = enemySvg
  .replace('url(#a)', 'url(#c)')
  .replace(
    firstEnemyGradient,
    createLinearGradient('c', ['purple', 'black', 'rgb(255, 230, 0)', 'red', 'rgb(105, 3, 3)'])
  );

thirdEnemy.image.src = encodeSvg(thirdEnemySvg);
thirdEnemy.deadImage.src = encodeSvg(thirdEnemySvg.replace('url(#c)', 'black'));

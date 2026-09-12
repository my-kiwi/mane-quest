import { encodeSvg } from './svg-helpers';
import { getTileDimensions } from './levels/levelGeometry';
import { max } from './dom-helpers';

export const fireball = {
  width: getTileDimensions().width * 3,
  height: getTileDimensions().height * 2,
  speed: 5,
  damage: 10,
  image: new Image(),
  position: { x: 0, y: 0 },
  direction: 1,
  isActive: false,
  cooldownUntil: 0,
};

export const FIREBALL_COOLDOWN_MS = 5000;

export function isFireballOnCooldown(currentTime = Date.now()): boolean {
  return currentTime < fireball.cooldownUntil;
}

export function getFireballCooldownRemaining(currentTime = Date.now()): number {
  return max(0, fireball.cooldownUntil - currentTime);
}

export function launchFireball(x: number, y: number, direction: number): boolean {
  if (isFireballOnCooldown()) {
    return false;
  }

  fireball.position.x = x + direction * fireball.width;
  fireball.position.y = y;
  fireball.direction = direction;
  fireball.isActive = true;
  fireball.cooldownUntil = Date.now() + FIREBALL_COOLDOWN_MS;
  return true;
}

export function updateFireball(frameScale: number): void {
  if (!fireball.isActive) {
    return;
  }

  fireball.position.x += fireball.speed * fireball.direction * frameScale;
}

fireball.image.src = encodeSvg(
  '<svg width="680" height="400" xmlns="http://www.w3.org/2000/svg"><path fill="#c0392b" d="M190 210c100 80 170 120 230 100 45-15 70-60 70-100s-25-85-70-100c-60-20-130 20-230 100"/><path fill="#e67e22" d="M240 210c80 60 130 85 175 72 35-12 50-42 50-67 0-30-15-65-50-75-45-15-95 10-175 70"/><path stroke="null" fill="#f1c40f" d="M299 213.36c43.295 29.72 72.16 41.609 98.136 32.693C417.341 238.623 426 225.249 426 213.36c0-17.833-8.66-37.15-28.864-44.58-25.977-8.917-54.84 7.43-98.136 44.58"/></svg>'
);

// Unicorn interface
export interface Unicorn {
  image: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: number; // -1 for left, 1 for right
  isJumping: boolean;
  velocityY: number;
  jumpStrength: number;
  gravity: number;
  rotation: number;
  balancePhase: number;
  isBlinking: boolean;
  blinkEndsAt: number;
  nextBlinkAt: number;
}

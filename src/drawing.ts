import { unicorn } from './unicorn';

// Get canvas and context from the DOM
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Level constants
const SKY_HEIGHT_RATIO = 2 / 3;
const GRASS_HEIGHT_RATIO = 1 / 3;

/**
 * Draw the game level (sky, grass, grass details, and unicorn)
 */
export function draw() {
  const grassY = canvas.height * SKY_HEIGHT_RATIO;

  // Draw sky
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(0, 0, canvas.width, grassY);

  // Draw grass
  ctx.fillStyle = '#228b22';
  ctx.fillRect(0, grassY, canvas.width, canvas.height);

  // Draw grass details
  ctx.fillStyle = '#2ecc71';
  for (let i = 0; i < canvas.width; i += 30) {
    ctx.fillRect(i, grassY + 10, 20, 10);
  }

  // Draw unicorn
  drawUnicorn();
}

/**
 * Draw the unicorn sprite with rotation and direction
 */
function drawUnicorn() {
  if (unicorn.image.complete) {
    ctx.save();
    ctx.translate(unicorn.x, unicorn.y);
    ctx.rotate(unicorn.rotation * (unicorn.direction === 1 ? 1 : -1));
    if (unicorn.direction === 1) {
      ctx.scale(-1, 1);
    }
    ctx.drawImage(
      unicorn.image,
      -unicorn.width / 2,
      -unicorn.height / 2,
      unicorn.width,
      unicorn.height
    );
    ctx.restore();
  }
}

/**
 * Clear the canvas (useful for clean frame rendering)
 */
export function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Get the canvas context for advanced drawing operations
 */
export function getContext() {
  return ctx;
}

/**
 * Get the canvas element
 */
export function getCanvas() {
  return canvas;
}

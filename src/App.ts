import { draw } from './drawing';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Level constants
const SKY_HEIGHT_RATIO = 2 / 3;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// Unicorn properties
export const unicorn = {
  image: new Image(),
  x: canvas.width / 2,
  y: 0,
  width: 80,
  height: 80,
  speed: 5,
  direction: -1, // -1 for left, 1 for right
  isJumping: false,
  velocityY: 0,
  jumpStrength: 13,
  gravity: 0.7,
  rotation: 0,
};

// Load unicorn image
unicorn.image.src = './public/uni-red.png';

// Input handling
const keys: { [key: string]: boolean } = {};
let targetX = unicorn.x;
let targetY = unicorn.y;

const getGroundY = () => canvas.height * SKY_HEIGHT_RATIO - unicorn.height / 3;

export function triggerJump() {
  if (unicorn.isJumping) {
    return;
  }

  unicorn.isJumping = true;
  unicorn.velocityY = -unicorn.jumpStrength;
  unicorn.rotation = -0.65;
}

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  keys[e.key] = true;

  if ((e.key === 'ArrowUp' || key === 'w') && !e.repeat) {
    triggerJump();
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Handle canvas interaction (click and touch)
function handleCanvasInteraction(x: number, y: number) {
  targetX = clamp(x, unicorn.width / 2, canvas.width - unicorn.width / 2);
  targetY = getGroundY();

  if (y < unicorn.y - 50) {
    triggerJump();
  }
}

// Click to move / jump
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  handleCanvasInteraction(clickX, clickY);
});

// Touch support
canvas.addEventListener('touchstart', (e) => {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const touchX = touch.clientX - rect.left;
  const touchY = touch.clientY - rect.top;

  handleCanvasInteraction(touchX, touchY);
});

// Update unicorn position
export function update() {
  const minY = getGroundY();

  // Check if keyboard is being used
  const isKeyboardInput =
    keys['ArrowLeft'] || keys['a'] || keys['A'] || keys['ArrowRight'] || keys['d'] || keys['D'];

  if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
    unicorn.x -= unicorn.speed;
    unicorn.direction = -1;
  }
  if (keys['ArrowRight'] || keys['d'] || keys['D']) {
    unicorn.x += unicorn.speed;
    unicorn.direction = 1;
  }

  unicorn.x = clamp(unicorn.x, unicorn.width / 2, canvas.width - unicorn.width / 2);

  if (unicorn.isJumping) {
    unicorn.velocityY += unicorn.gravity;
    unicorn.y += unicorn.velocityY;
    unicorn.rotation = clamp(unicorn.velocityY * 0.08, -1.5, 1.5);

    if (unicorn.y >= minY) {
      unicorn.y = minY;
      unicorn.isJumping = false;
      unicorn.velocityY = 0;
      unicorn.rotation = 0;
    }
  } else {
    unicorn.y = minY;
    unicorn.rotation = 0;
  }

  if (isKeyboardInput) {
    targetX = unicorn.x;
    targetY = minY;
  }

  // Smooth movement towards click target
  if (!unicorn.isJumping) {
    const dx = targetX - unicorn.x;
    const dy = targetY - unicorn.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
      const moveSpeed = Math.min(unicorn.speed, distance);
      unicorn.x += (dx / distance) * moveSpeed;
      unicorn.y += (dy / distance) * moveSpeed;

      if (dx !== 0) {
        unicorn.direction = dx > 0 ? 1 : -1;
      }
    }
  } else {
    const dx = targetX - unicorn.x;
    const distance = Math.abs(dx);

    if (distance > 5) {
      const moveSpeed = Math.min(unicorn.speed, distance);
      unicorn.x += (dx / distance) * moveSpeed;
      unicorn.direction = dx > 0 ? 1 : -1;
    }
  }
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();


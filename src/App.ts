const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Level constants
const SKY_HEIGHT_RATIO = 2 / 3;
const GRASS_HEIGHT_RATIO = 1 / 3;

// Unicorn properties
const unicorn = {
  image: new Image(),
  x: canvas.width / 2,
  y: 0,
  width: 80,
  height: 80,
  speed: 5,
  direction: -1, // -1 for left, 1 for right
};

// Load unicorn image
unicorn.image.src = './public/uni-red.png';

// Input handling
const keys: { [key: string]: boolean } = {};
let targetX = unicorn.x;
let targetY = unicorn.y;

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Click to move
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;
  const grassY = canvas.height * SKY_HEIGHT_RATIO;

  targetX = Math.max(unicorn.width / 2, Math.min(clickX, canvas.width - unicorn.width / 2));
  targetY = grassY - unicorn.height / 2;
});

// Touch support
canvas.addEventListener('touchstart', (e) => {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const touchX = touch.clientX - rect.left;
  const touchY = touch.clientY - rect.top;
  const grassY = canvas.height * SKY_HEIGHT_RATIO;

  targetX = Math.max(unicorn.width / 2, Math.min(touchX, canvas.width - unicorn.width / 2));
  targetY = grassY - unicorn.height / 2;
});

// Update unicorn position
function update() {
  const grassY = canvas.height * SKY_HEIGHT_RATIO;
  const minY = grassY - unicorn.height / 2;

  // Check if keyboard is being used
  const isKeyboardInput =
    keys['ArrowLeft'] ||
    keys['a'] ||
    keys['A'] ||
    keys['ArrowRight'] ||
    keys['d'] ||
    keys['D'] ||
    keys['ArrowUp'] ||
    keys['w'] ||
    keys['W'] ||
    keys['ArrowDown'] ||
    keys['s'] ||
    keys['S'];

  // Keyboard movement
  if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
    unicorn.x -= unicorn.speed;
    unicorn.direction = -1;
  }
  if (keys['ArrowRight'] || keys['d'] || keys['D']) {
    unicorn.x += unicorn.speed;
    unicorn.direction = 1;
  }
  if (keys['ArrowUp'] || keys['w'] || keys['W']) {
    unicorn.y -= unicorn.speed;
  }
  if (keys['ArrowDown'] || keys['s'] || keys['S']) {
    unicorn.y += unicorn.speed;
  }

  // Keep unicorn in bounds
  unicorn.x = Math.max(unicorn.width / 2, Math.min(unicorn.x, canvas.width - unicorn.width / 2));
  unicorn.y = Math.max(minY, Math.min(unicorn.y, minY));

  // When using keyboard, update target to current position to prevent smooth movement interference
  if (isKeyboardInput) {
    targetX = unicorn.x;
    targetY = unicorn.y;
  }

  // Smooth movement towards click target
  const dx = targetX - unicorn.x;
  const dy = targetY - unicorn.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 5) {
    const moveSpeed = Math.min(unicorn.speed, distance);
    unicorn.x += (dx / distance) * moveSpeed;
    unicorn.y += (dy / distance) * moveSpeed;
    // Update direction based on movement
    if (dx !== 0) {
      unicorn.direction = dx > 0 ? 1 : -1;
    }
  }
}

// Draw the level
function draw() {
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
  if (unicorn.image.complete) {
    ctx.save();
    ctx.translate(unicorn.x, unicorn.y - unicorn.height / 2);
    if (unicorn.direction === 1) {
      ctx.scale(-1, 1);
    }
    ctx.drawImage(
      unicorn.image,
      -unicorn.width / 2,
      0,
      unicorn.width,
      unicorn.height
    );
    ctx.restore();
  }
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

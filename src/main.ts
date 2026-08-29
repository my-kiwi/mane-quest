// Application orchestration
// Initializes all modules and starts the game loop

import { resizeCanvas } from './canvas';
import { initializeUnicorn } from './unicorn';
import { resetToStartLevel } from './levels/levels';
import { initializeInput } from './input';
import { startGameLoop } from './gameLoop';
import Music from './music';

// Initialize all systems
resizeCanvas();
resetToStartLevel();
initializeUnicorn();
initializeInput();

// Start the game loop
startGameLoop();

function startMusic() {
  window.removeEventListener('pointerdown', startMusic);
  window.removeEventListener('keydown', startMusic);
  Music.play('overworld');
}

// start music
window.addEventListener('pointerdown', startMusic);
window.addEventListener('keydown', startMusic);

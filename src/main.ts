// Application orchestration
// Initializes all modules and starts the game loop

import { resizeCanvas } from './canvas';
import { initializeUnicorn } from './unicorn';
import { resetToStartLevel } from './levels/levels';
import { initializeInput } from './input';
import { startGameLoop } from './gameLoop';
import { addEventListener, removeEventListener } from './utils';
import Music from './music';

// Initialize all systems
resizeCanvas();
resetToStartLevel();
initializeUnicorn();
initializeInput();

// Start the game loop
startGameLoop();

function startMusic() {
  removeEventListener('pointerdown', startMusic);
  removeEventListener('keydown', startMusic);
  Music.play('overworld');
}

// start music
addEventListener('pointerdown', startMusic);
addEventListener('keydown', startMusic);

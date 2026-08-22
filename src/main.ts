// Application orchestration
// Initializes all modules and starts the game loop

import { initializeCanvas } from './canvas';
import { initializeUnicorn } from './unicorn';
import { initializeInput } from './input';
import { startGameLoop } from './gameLoop';
import Music from './music';

// Initialize all systems
initializeCanvas();
initializeUnicorn();
initializeInput();

// Start the game loop
startGameLoop();

function startMusic(){
    window.removeEventListener('pointerdown',startMusic);
    Music.play('overworld'); 
}

// start music
window.addEventListener('pointerdown', startMusic);
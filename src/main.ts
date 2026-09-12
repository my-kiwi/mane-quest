// Application orchestration
// Initializes all modules and starts the game loop

import { resizeCanvas } from './canvas';
import { initializeUnicorn } from './unicorn';
import { resetToStartLevel } from './levels/levels';
import { initializeInput } from './input';
import { startGameLoop } from './gameLoop';
import { addEventListener, removeEventListener } from './dom-helpers';
import Music from './music';
import { addShovelToActionBar } from './action';

// setTimeout(() => addShovelToActionBar(), 1000);

const soundToggle = document.querySelector('#sound-toggle') as HTMLButtonElement;
const musicVolume = 0.28;
let soundEnabled = true;
let rememberedTrack = Music.getCurrentTrack() ?? 'overworld';

soundToggle.addEventListener('click', () => {
  soundEnabled = !soundEnabled;

  if (soundEnabled) {
    Music.setVolume(musicVolume);
    Music.play(Music.getCurrentTrack() ?? rememberedTrack);
  } else {
    rememberedTrack = Music.getCurrentTrack() ?? rememberedTrack;
    Music.setVolume(0);
    Music.stop();
  }

  soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
});
soundToggle.textContent = soundEnabled ? '🔊' : '🔇';

if (navigator.maxTouchPoints > 0 || 'ontouchstart' in window) {
  const orientationPrompt = document.createElement('div');
  orientationPrompt.className = 'orientation';
  orientationPrompt.innerHTML = `
    <p class="icon">↻</p>
    <p>Rotate your device</p>
    <p>This is best played in landscape mode.</p>
  `;
  document.body.prepend(orientationPrompt);
}

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

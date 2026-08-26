import { createUnicornSvg, unicorn } from './unicorn';
import { getCurrentLevel, NB_OF_TILES_HORIZONTALLY, TileType, Level } from './levels/levels';
import { getTileDimensions } from './levelGeometry';
import { NPC } from './NPC';
import { getActiveDialogue, getNpcPosition, isNpcInRange } from './npcInteraction';

// Get canvas and context from the DOM
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const getRandomColor = (columnIndex: number, rowIndex: number) => {
  // get color based on column and row index to create a gradient effect
  const red = Math.floor((columnIndex / NB_OF_TILES_HORIZONTALLY) * 255);
  const green = Math.floor((rowIndex / getCurrentLevel().map.length) * 255);
  const blue = Math.floor(
    ((columnIndex + rowIndex) / (NB_OF_TILES_HORIZONTALLY + getCurrentLevel().map.length)) * 255
  );
  return `rgb(${red}, ${green}, ${blue})`;
};

/**
 * Draw the current level and unicorn.
 */
export function draw() {
  const level = getCurrentLevel();
  const { width: tileWidth, height: tileHeight } = getTileDimensions();

  // Draw sky
  ctx.fillStyle = level.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  level.map.forEach((row, rowIndex) => {
    [...row].forEach((tile, columnIndex) => {
      drawTile(tile, columnIndex * tileWidth, rowIndex * tileHeight, tileWidth, tileHeight, level);
    });
  });

  updateNpcInteractionUi();

  // Draw unicorn
  drawUnicorn();

  if (unicorn.isDead) {
    drawDeathMessage();
  }
}

function drawDeathMessage(): void {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.62)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${Math.max(32, canvas.width * 0.1)}px Georgia, serif`;
  ctx.fillStyle = '#b31217';
  ctx.fillText('U DIED', canvas.width / 2, canvas.height / 2);
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
}

function updateNpcInteractionUi(): void {
  const prompt = document.getElementById('npc-prompt');
  const dialogueBubble = document.getElementById('npc-dialogue');
  const dialogueName = document.getElementById('npc-dialogue-name');
  const dialogueLine = document.getElementById('npc-dialogue-line');
  const npcPosition = getNpcPosition();
  if (
    !prompt ||
    !dialogueBubble ||
    !dialogueName ||
    !dialogueLine ||
    !npcPosition ||
    !isNpcInRange()
  ) {
    prompt?.classList.remove('is-visible');
    dialogueBubble?.classList.remove('is-visible');
    return;
  }

  const positionLeft = `${(npcPosition.x / canvas.width) * 100}%`;
  prompt.style.left = positionLeft;
  prompt.style.top = `${((npcPosition.y - unicorn.height * 0.9) / canvas.height) * 100}%`;

  const dialogue = getActiveDialogue();
  if (dialogue) {
    prompt.classList.remove('is-visible');
    dialogueName.textContent = dialogue.name;
    dialogueLine.textContent = dialogue.line;
    dialogueName.style.color = dialogue.color;
    dialogueBubble.classList.add('is-visible');
    return;
  }

  dialogueBubble.classList.remove('is-visible');
  prompt.classList.add('is-visible');
}

function drawTile(
  tile: string,
  x: number,
  y: number,
  width: number,
  height: number,
  level: Level
): void {
  if (tile === TileType.EMPTY) {
    return;
  }

  if (tile === TileType.GROUND) {
    ctx.fillStyle = level.groundColor;
    ctx.fillRect(x, y, width, height);
    return;
  }

  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);

  if (tile === TileType.PLATFORM) {
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(-width / 2, -height * 0.12, width, height * 0.24);
  } else if (tile === TileType.SPIKE) {
    ctx.fillStyle = '#d64545';
    ctx.beginPath();
    ctx.moveTo(-width / 2, height / 2);
    ctx.lineTo(0, -height / 2);
    ctx.lineTo(width / 2, height / 2);
    ctx.closePath();
    ctx.fill();
  } else if (tile === TileType.COIN) {
    ctx.fillStyle = '#f4c542';
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(width, height) * 0.28, 0, Math.PI * 2);
    ctx.fill();
  } else if (tile === TileType.ENEMY) {
    ctx.fillStyle = '#7b3f98';
    ctx.fillRect(-width * 0.3, -height * 0.3, width * 0.6, height * 0.6);
  } else if (tile === TileType.EXIT) {
    ctx.fillStyle = '#f2f2f2';
    ctx.fillRect(-width * 0.3, -height * 0.4, width * 0.6, height * 0.8);
    ctx.fillStyle = '#2f80ed';
    ctx.fillRect(width * 0.05, -height * 0.1, width * 0.12, height * 0.12);
  } else if (tile === TileType.NPC && level.npc) {
    ctx.save();

    ctx.translate(0, height / 2 - unicorn.height / 2);
    drawNPC(level.npc);
    ctx.restore();
  }

  ctx.restore();
}

function drawNPC(npc: NPC): void {
  if (npc.image.complete && npc.image.naturalWidth > 0) {
    ctx.scale(npc.scale, npc.scale);
    ctx.drawImage(
      npc.image,
      -unicorn.width / 2,
      -unicorn.height / 2,
      unicorn.width,
      unicorn.height
    );
  }
}

/**
 * Draw the unicorn sprite with rotation and direction
 */
function drawUnicorn() {
  // TODO extend for re-use with npc and enemies
  if (unicorn.image.complete && unicorn.image.naturalWidth > 0) {
    ctx.save();
    ctx.translate(unicorn.x, unicorn.y);
    ctx.rotate(unicorn.rotation * (unicorn.direction === 1 ? 1 : -1));
    if (unicorn.direction === -1) {
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

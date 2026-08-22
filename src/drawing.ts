import { createUnicornSvg, unicorn } from './unicorn';
import { getCurrentLevel, NB_OF_TILES_HORIZONTALLY, TileType, Level } from './levels';
import { getTileDimensions } from './levelGeometry';
import { PNJ } from './PNJ';
import { getActiveDialogue, getPnjPosition, isPnjInRange } from './npcInteraction';

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

  drawPnjInteraction();

  // Draw unicorn
  drawUnicorn();
}

function drawPnjInteraction(): void {
  if (!isPnjInRange()) {
    return;
  }

  const pnjPosition = getPnjPosition();
  if (!pnjPosition) {
    return;
  }

  const dialogue = getActiveDialogue();
  if (dialogue) {
    drawDialogueBubble(pnjPosition.x, pnjPosition.y, dialogue.pnj.name, dialogue.line);
    return;
  }

  const bounce = Math.sin(performance.now() / 180) * unicorn.height * 0.08;
  ctx.save();
  ctx.font = `bold ${Math.max(16, unicorn.height * 0.42)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#202020';
  ctx.lineWidth = Math.max(2, unicorn.width * 0.025);
  ctx.strokeText('?', pnjPosition.x, pnjPosition.y - unicorn.height * 0.9 + bounce);
  ctx.fillText('?', pnjPosition.x, pnjPosition.y - unicorn.height * 0.9 + bounce);
  ctx.restore();
}

function drawDialogueBubble(x: number, y: number, name: string, line: string): void {
  const bubbleWidth = Math.min(canvas.width - 16, Math.max(180, unicorn.width * 3.2));
  const bubbleHeight = unicorn.height * 1.05;
  const bubbleX = Math.max(8, Math.min(canvas.width - bubbleWidth - 8, x - bubbleWidth / 2));
  const bubbleY = Math.max(8, y - unicorn.height * 2.15);

  ctx.save();
  ctx.fillStyle = '#fffdf5';
  ctx.strokeStyle = '#202020';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#202020';
  ctx.font = `bold ${Math.max(11, unicorn.height * 0.2)}px sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(name, bubbleX + 10, bubbleY + 8);
  ctx.font = `${Math.max(11, unicorn.height * 0.18)}px sans-serif`;
  ctx.fillText(line, bubbleX + 10, bubbleY + bubbleHeight * 0.38, bubbleWidth - 20);
  ctx.restore();
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
  } else if (tile === TileType.PNJ && level.pnj) {
    ctx.save();

    ctx.translate(0, height / 2 - unicorn.height / 2);
    drawPNJ(level.pnj);
    ctx.restore();
  }

  ctx.restore();
}

function drawPNJ(pnj: PNJ): void {
  if (pnj.image.complete && pnj.image.naturalWidth > 0) {
    ctx.scale(pnj.scale, pnj.scale);
    ctx.drawImage(
      pnj.image,
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
  // TODO extend for re-use with pnj and enemies
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

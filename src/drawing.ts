import { createSvg, unicorn } from './unicorn';
import { levels, NB_OF_TILES_HORIZONTALLY, TileType } from './levels';
import { getTileDimensions } from './levelGeometry';

// Get canvas and context from the DOM
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const wiseUnicornImage = new Image();
wiseUnicornImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  createSvg({
    hornColor: '#B68B3C',
    tailColor: '#A7AFB7',
    bodyColor: '#F1E8D8',
    leftFootColor: '#6B4F3A',
    rightFootColor: '#6B4F3A',
    maneColor: '#A7AFB7',
  })
)}`;

const getRandomColor = (columnIndex: number, rowIndex: number) => {
  // get color based on column and row index to create a gradient effect
  const red = Math.floor((columnIndex / NB_OF_TILES_HORIZONTALLY) * 255);
  const green = Math.floor((rowIndex / levels[0].map.length) * 255);
  const blue = Math.floor(
    ((columnIndex + rowIndex) / (NB_OF_TILES_HORIZONTALLY + levels[0].map.length)) * 255
  );
  return `rgb(${red}, ${green}, ${blue})`;
};

/**
 * Draw the current level and unicorn.
 */
export function draw() {
  const level = levels[0];
  const { width: tileWidth, height: tileHeight } = getTileDimensions();

  // Draw sky
  ctx.fillStyle = level.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  level.map.forEach((row, rowIndex) => {
    [...row].forEach((tile, columnIndex) => {
      drawTile(
        tile,
        columnIndex * tileWidth,
        rowIndex * tileHeight,
        tileWidth,
        tileHeight,
        level.groundColor
        //getRandomColor(columnIndex, rowIndex)
      );
    });
  });

  // Draw unicorn
  drawUnicorn();
}

function drawTile(
  tile: string,
  x: number,
  y: number,
  width: number,
  height: number,
  groundColor: string
): void {
  if (tile === TileType.EMPTY) {
    return;
  }

  if (tile === TileType.GROUND) {
    ctx.fillStyle = groundColor;
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
  } else if (tile === TileType.PNJ) {
    ctx.save();

    drawWiseUnicorn();
    ctx.restore();
  }

  ctx.restore();
}

function drawWiseUnicorn(): void {
  if (wiseUnicornImage.complete && wiseUnicornImage.naturalWidth > 0) {
    ctx.translate(0, -unicorn.height / 4);
    ctx.drawImage(
      wiseUnicornImage,
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

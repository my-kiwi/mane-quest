import { unicorn } from './unicorn';
import { getCurrentLevel, hasTile } from './levels/levels';
import { TileType, NB_OF_TILES_HORIZONTALLY } from './levels/level-type';
import type { Level } from './levels/level-type';
import { getTile, getTileDimensions } from './levels/levelGeometry';
import { NPC } from './NPC';
import { ENEMY_DEATH_DURATION, Enemy } from './enemy';
import { isNpcInRange } from './npcInteraction';
import { canvas } from './canvas';
import { fireball } from './fireball';
import { floor } from './dom-helpers';

export const ctx = canvas.getContext('2d')!;
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const getRandomColor = (columnIndex: number, rowIndex: number) => {
  // get color based on column and row index to create a gradient effect
  const red = floor((columnIndex / NB_OF_TILES_HORIZONTALLY) * 255);
  const green = floor((rowIndex / getCurrentLevel().map.length) * 255);
  const blue = floor(
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
    [...row].forEach((_tile, columnIndex) => {
      const tile = getTile(rowIndex, columnIndex);
      drawTile(tile, columnIndex * tileWidth, rowIndex * tileHeight, tileWidth, tileHeight, level);
    });
  });

  // Draw enemies
  drawEnemies();

  drawFireball();

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
  } else if (tile === TileType.ENEMY) {
    // Enemy tile marker - enemy is drawn at its dynamic position in drawEnemies()
  } else if (tile === TileType.NPC && level.npc) {
    ctx.save();

    ctx.translate(0, height / 2 - unicorn.height / 2);
    drawNPC(level.npc);
    ctx.restore();
  } else if (tile === TileType.TOMB) {
    const bottom = height / 2;
    const top = -height * 1.5;

    ctx.beginPath();
    ctx.moveTo(-width / 2, bottom);
    ctx.lineTo(-width / 2, -height / 2);
    ctx.quadraticCurveTo(0, top, width / 2, -height / 2);
    ctx.lineTo(width / 2, bottom);
    ctx.closePath();
    ctx.fillStyle = '#6b7280';
    ctx.fill();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = Math.max(1, width * 0.04);
    ctx.stroke();

    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = Math.max(1, width * 0.06);
    ctx.beginPath();
    ctx.moveTo(0, -height * 0.75);
    ctx.lineTo(0, 0);
    ctx.moveTo(-width * 0.2, -height * 0.5);
    ctx.lineTo(width * 0.2, -height * 0.5);
    ctx.stroke();
  } else if (tile === TileType.LAVA) {
    ctx.fillStyle = '#bc0303';
    ctx.fillRect(-width / 2, -height / 2, width, height);

    const lavaOffset = (performance.now() * 0.01) % width;
    ctx.fillStyle = '#f04a16';
    for (const offset of [lavaOffset, lavaOffset - width]) {
      ctx.save();
      ctx.translate(offset, 0);
      ctx.beginPath();
      ctx.moveTo(-width / 2, -height * 0.18);
      ctx.quadraticCurveTo(-width * 0.25, -height * 0.38, 0, -height * 0.18);
      ctx.quadraticCurveTo(width * 0.25, height * 0.02, width / 2, -height * 0.18);
      ctx.lineTo(width / 2, height / 2);
      ctx.lineTo(-width / 2, height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.strokeStyle = '#ffb21c';
    ctx.lineWidth = Math.max(1, height * 0.08);
    for (const offset of [lavaOffset, lavaOffset - width]) {
      ctx.save();
      ctx.translate(offset, 0);
      ctx.beginPath();
      ctx.moveTo(-width / 2, -height * 0.2);
      ctx.quadraticCurveTo(-width * 0.25, -height * 0.4, 0, -height * 0.2);
      ctx.quadraticCurveTo(width * 0.25, 0, width / 2, -height * 0.2);
      ctx.stroke();
      ctx.restore();
    }
  }

  ctx.restore();
}

function drawEnemies(): void {
  const level = getCurrentLevel();
  if (!level.enemy || !hasTile(level, TileType.ENEMY)) {
    return;
  }

  const enemy = level.enemy;
  if (enemy.isDead && performance.now() - enemy.diedAt >= ENEMY_DEATH_DURATION) {
    return;
  }

  const enemyImage = enemy.isDead ? enemy.deadImage : enemy.image;
  if (!enemyImage.complete || enemyImage.naturalWidth <= 0) {
    return;
  }

  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  if (enemy.direction === -1) {
    ctx.scale(-1, 1);
  }
  ctx.drawImage(
    enemyImage,
    -enemy.width / 2,
    -enemy.height / 2 + enemy.yOffset,
    enemy.width,
    enemy.height
  );
  ctx.restore();
}

function drawFireball(): void {
  if (!fireball.isActive || !fireball.image.complete || fireball.image.naturalWidth <= 0) {
    return;
  }
  ctx.save();
  ctx.translate(fireball.position.x, fireball.position.y);
  if (fireball.direction === -1) {
    ctx.scale(-1, 1);
  }

  ctx.drawImage(
    fireball.image,
    -fireball.width / 2,
    -fireball.height / 2,
    fireball.width,
    fireball.height
  );
  ctx.restore();
}

export function drawNPC(npc: NPC): void {
  if (npc.image.complete && npc.image.naturalWidth > 0) {
    ctx.save();
    if (isNpcInRange()) {
      ctx.shadowColor = 'yellow';
      ctx.shadowBlur = 12;
    }
    ctx.scale(npc.scaleX, npc.scaleY);
    ctx.drawImage(
      npc.image,
      -unicorn.width / 2,
      -unicorn.height / 2,
      unicorn.width,
      unicorn.height
    );
    ctx.restore();
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
    if (unicorn.isDead) {
      ctx.translate(0, unicorn.height / 2);
      ctx.scale(1, 0.2);
    }
    ctx.drawImage(
      unicorn.image,
      -unicorn.width / 2,
      -unicorn.height / 2,
      unicorn.width,
      unicorn.height
    );
    // DEBUG: Draw hitbox for debugging purposes
    // ctx.strokeRect(-unicorn.width / 2, -unicorn.height / 2, unicorn.width, unicorn.height);
    // // draw circle at x, y coordinates for debugging purposes
    // ctx.beginPath();
    // ctx.arc(0, 0, 5, 0, Math.PI * 2);
    // ctx.fillStyle = 'red';
    // ctx.fill();

    ctx.restore();
  }
}

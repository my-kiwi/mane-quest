import { getCurrentLevel, TileType } from './levels';
import { getTileDimensions } from './levelGeometry';
import { unicorn } from './unicorn';
import { PNJ } from './PNJ';

let activeDialogueLine = 0;
let activePnj: PNJ | undefined;

const INTERACTION_RANGE_MULTIPLIER = 1.5;

export function getCurrentPnj(): PNJ | undefined {
  return getCurrentLevel().pnj;
}

export function getPnjPosition(): { x: number; y: number } | undefined {
  const level = getCurrentLevel();
  const { width: tileWidth, height: tileHeight } = getTileDimensions();
  const rowIndex = level.map.findIndex((row) => row.includes(TileType.PNJ));

  if (rowIndex < 0 || !level.pnj) {
    return undefined;
  }

  const columnIndex = level.map[rowIndex].indexOf(TileType.PNJ);
  return {
    x: columnIndex * tileWidth + tileWidth / 2,
    y: rowIndex * tileHeight + tileHeight - unicorn.height / 2,
  };
}

export function isPnjInRange(): boolean {
  const pnjPosition = getPnjPosition();
  return (
    pnjPosition !== undefined &&
    Math.hypot(unicorn.x - pnjPosition.x, unicorn.y - pnjPosition.y) <=
      unicorn.width * INTERACTION_RANGE_MULTIPLIER
  );
}

export function isPointOnPnj(x: number, y: number): boolean {
  const pnjPosition = getPnjPosition();
  if (!pnjPosition) {
    return false;
  }

  return (
    x >= pnjPosition.x - unicorn.width / 2 &&
    x <= pnjPosition.x + unicorn.width / 2 &&
    y >= pnjPosition.y - unicorn.height / 2 &&
    y <= pnjPosition.y + unicorn.height / 2
  );
}

export function isPointOnDialogueBubble(x: number, y: number): boolean {
  const pnjPosition = getPnjPosition();
  if (!pnjPosition || !isPnjInRange()) {
    return false;
  }

  return (
    x >= pnjPosition.x - unicorn.width &&
    x <= pnjPosition.x + unicorn.width &&
    y >= pnjPosition.y - unicorn.height * 1.8 &&
    y <= pnjPosition.y - unicorn.height * 0.65
  );
}

export function interactWithPnj(): boolean {
  if (!isPnjInRange()) {
    return false;
  }

  const pnj = getCurrentPnj();
  if (!pnj) {
    return false;
  }

  if (activePnj !== pnj) {
    activePnj = pnj;
    activeDialogueLine = 0;
  } else if (activeDialogueLine < pnj.dialogue.length - 1) {
    activeDialogueLine += 1;
  } else {
    activePnj = undefined;
  }

  return true;
}

export function getActiveDialogue(): { pnj: PNJ; line: string } | undefined {
  if (!activePnj) {
    return undefined;
  }

  return {
    pnj: activePnj,
    line: activePnj.dialogue[activeDialogueLine],
  };
}

import { getCurrentLevel } from './levels/levels';
import { getTileDimensions } from './levelGeometry';
import { unicorn } from './unicorn';
import { NPC } from './NPC';
import { TileType } from './levels/level-type';

let activeDialogueLine = 0;
let activeNpc: NPC | undefined;

const INTERACTION_RANGE_MULTIPLIER = 1.5;

export function getCurrentNpc(): NPC | undefined {
  return getCurrentLevel().npc;
}

export function getNpcPosition(): { x: number; y: number } | undefined {
  const level = getCurrentLevel();
  const { width: tileWidth, height: tileHeight } = getTileDimensions();
  const rowIndex = level.map.findIndex((row) => row.includes(TileType.NPC));

  if (rowIndex < 0 || !level.npc) {
    return undefined;
  }

  const columnIndex = level.map[rowIndex].indexOf(TileType.NPC);
  return {
    x: columnIndex * tileWidth + tileWidth / 2,
    y: rowIndex * tileHeight + tileHeight - unicorn.height / 2,
  };
}

export function isNpcInRange(): boolean {
  const npcPosition = getNpcPosition();
  const inRange =
    npcPosition !== undefined &&
    Math.hypot(unicorn.x - npcPosition.x, unicorn.y - npcPosition.y) <=
      unicorn.width * INTERACTION_RANGE_MULTIPLIER;

  if (!inRange) {
    activeNpc = undefined;
  }

  return inRange;
}

export function isPointOnNpc(x: number, y: number): boolean {
  const npcPosition = getNpcPosition();
  if (!npcPosition) {
    return false;
  }

  return (
    x >= npcPosition.x - unicorn.width / 2 &&
    x <= npcPosition.x + unicorn.width / 2 &&
    y >= npcPosition.y - unicorn.height / 2 &&
    y <= npcPosition.y + unicorn.height / 2
  );
}

export function isPointOnDialogueBubble(x: number, y: number): boolean {
  const npcPosition = getNpcPosition();
  if (!npcPosition || !isNpcInRange()) {
    return false;
  }

  return (
    x >= npcPosition.x - unicorn.width &&
    x <= npcPosition.x + unicorn.width &&
    y >= npcPosition.y - unicorn.height * 1.8 &&
    y <= npcPosition.y - unicorn.height * 0.65
  );
}

export function interactWithNpc(): boolean {
  if (!isNpcInRange()) {
    return false;
  }

  const npc = getCurrentNpc();
  if (!npc) {
    return false;
  }

  if (activeNpc !== npc) {
    activeNpc = npc;
    activeDialogueLine = 0;
  } else if (activeDialogueLine < npc.dialogue.length - 1) {
    activeDialogueLine += 1;
  } else {
    activeNpc = undefined;
  }

  return true;
}

export function getActiveDialogue() {
  if (!activeNpc) {
    return undefined;
  }
  const { line, ...props } = activeNpc.dialogue[activeDialogueLine];
  const who = props.who ?? activeNpc;

  return { name: who.name, color: who.colors.maneColor, line: line };
}

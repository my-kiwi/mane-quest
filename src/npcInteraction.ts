import { getCurrentLevel } from './levels/levels';
import { getTileDimensions } from './levels/levelGeometry';
import { unicorn } from './unicorn';
import { NPC } from './NPC';
import { TileType } from './levels/level-type';

export type WeaponChoice = {
  name: string;
};

let activeDialogueLine = 0;
let activeNpc: NPC | undefined;
let selectedWeaponIndex = 0;

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
    selectedWeaponIndex = 0;
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

export function getWeaponChoices(): WeaponChoice[] {
  if (!activeNpc) {
    return [];
  }

  const dialogue = activeNpc.dialogue[activeDialogueLine];
  const weapons = (dialogue as { weapons?: string[] } | undefined)?.weapons;

  if (!weapons || weapons.length === 0) {
    return [];
  }

  return weapons.map((name) => ({
    name,
  }));
}

export function getSelectedWeapon(): WeaponChoice | undefined {
  const choices = getWeaponChoices();
  if (choices.length === 0) {
    return undefined;
  }

  if (selectedWeaponIndex < 0 || selectedWeaponIndex >= choices.length) {
    selectedWeaponIndex = 0;
  }

  return choices[selectedWeaponIndex];
}

export function setWeaponSelection(index: number): boolean {
  const choices = getWeaponChoices();
  if (choices.length === 0) {
    return false;
  }

  selectedWeaponIndex = ((index % choices.length) + choices.length) % choices.length;
  const selectedWeapon = getSelectedWeapon();
  if (selectedWeapon) {
    document
      .querySelectorAll('.npc-dialogue-choice')
      .forEach((el) => el.classList.remove('is-selected'));
    document
      .querySelector('.npc-dialogue-choice.' + selectedWeapon.name)
      ?.classList.add('is-selected');
  }
  return true;
}

export function moveWeaponSelection(delta: number): boolean {
  return setWeaponSelection(selectedWeaponIndex + delta);
}

export function confirmCurrentWeaponChoice(): boolean {
  const selectedWeapon = getSelectedWeapon();
  if (!selectedWeapon) {
    return false;
  }

  console.warn('selected ', selectedWeapon.name);
  unicorn.weapon = selectedWeapon.name;
  selectedWeaponIndex = 0;
  return true;
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
    selectedWeaponIndex = 0;
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

  const dialogue = activeNpc.dialogue[activeDialogueLine] as {
    line?: string;
    weapons?: string[];
    who?: { name: string; colors: { maneColor: string } };
  };
  const { line = '', weapons, ...props } = dialogue;
  const who = props.who ?? activeNpc;

  return { name: who.name, color: who.colors.maneColor, line, weapons };
}

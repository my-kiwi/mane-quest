import { getCurrentLevel, hasTile } from './levels/levels';
import { getTileDimensions } from './levels/levelGeometry';
import { unicorn } from './unicorn';
import { NPC } from './NPC';
import { TileType, type Level } from './levels/level-type';

export type WeaponChoice = {
  name: string;
};

const INTERACTION_RANGE_MULTIPLIER = 1.5;

let activeDialogueLine = 0;
let activeNpc: NPC | undefined;
let selectedWeaponIndex = 0;
let previousDialog: ReturnType<typeof getActiveDialogue> | null = null;

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

export function updateNpcInteractionUi(): void {
  const dialogueBubble = document.getElementById('npc-dialogue');
  const dialogueName = document.getElementById('npc-dialogue-name');
  const dialogueLine = document.getElementById('npc-dialogue-line');
  const dialogueChoices = document.getElementById('npc-dialogue-choices');
  if (!dialogueBubble || !dialogueName || !dialogueLine || !dialogueChoices || !isNpcInRange()) {
    dialogueBubble?.classList.remove('is-visible');
    return;
  }

  const dialogue = getActiveDialogue();
  // fixme bug
  // if (dialogue?.line === previousDialog?.line && dialogue?.name === previousDialog?.name) return;
  if (dialogue) {
    console.log('writing dialog', dialogue.line);
    previousDialog = dialogue;
    dialogueName.textContent = dialogue.name;
    dialogueLine.textContent = dialogue.line;
    dialogueName.style.color = dialogue.color;

    dialogueChoices.innerHTML = '';
    const choices = getWeaponChoices();

    if (choices.length > 0) {
      choices.forEach((choice, index) => {
        const option = document.createElement('button');
        option.type = 'button';
        option.className = 'npc-dialogue-choice ' + choice.name;

        const icon = document.createElement('span');
        icon.className = 'npc-dialogue-choice-icon ' + choice.name;

        const label = document.createElement('span');
        label.textContent = choice.name;

        option.append(icon, label);
        option.addEventListener('pointerdown', (event) => {
          event.preventDefault();
          event.stopPropagation();
          setWeaponSelection(index);
          confirmCurrentWeaponChoice();
          interactWithNpc();
        });
        dialogueChoices.append(option);
        option.focus();
      });
      dialogueChoices.classList.add('is-visible');
      dialogueChoices.querySelectorAll('button')[0].classList.add('is-selected'); // default pre-selection
    } else {
      dialogueChoices.classList.remove('is-visible');
    }

    dialogueBubble.classList.add('is-visible');
    return;
  }

  dialogueBubble.classList.remove('is-visible');
  dialogueChoices.classList.remove('is-visible');
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
  activeNpc = undefined;
  return true;
}

export function interactWithNpc(): boolean {
  updateNpcInteractionUi();
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

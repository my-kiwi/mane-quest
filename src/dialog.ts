import { NPC } from './NPC';
import { interactWithNpc } from './npcInteraction';
import { Unicorn } from './unicorn';
import { getElementById } from './dom-helpers';

export const dialogueBubble = getElementById('dialogue-panel')!;
export const dialogueName = getElementById('dialogue-name')!;
export const dialogueLine = getElementById('dialogue-line')!;
export const dialogueChoices = getElementById('dialogue-choices');

dialogueBubble?.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  interactWithNpc();
});

export const showDialog = () => dialogueBubble.classList.add('dialogue-visible');
export const hideDialog = () => dialogueBubble.classList.remove('dialogue-visible');
export const displayLine = (who: Unicorn | NPC, line: string) => {
  console.log('display line');
  dialogueName.textContent = who.name;
  dialogueName.style.color = who.colors.maneColor;
  dialogueLine.textContent = line;
};

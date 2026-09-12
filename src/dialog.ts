import { NPC } from './NPC';
import { interactWithNpc } from './npcInteraction';
import { Unicorn } from './unicorn';
import { getElementById } from './dom-helpers';

export const dialogueBubble = getElementById('npc-chat')!;
export const dialogueName = getElementById('npc-chat-name')!;
export const dialogueLine = getElementById('npc-chat-line')!;
export const dialogueChoices = getElementById('npc-choices');

dialogueBubble?.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  interactWithNpc();
});

export const showDialog = () => dialogueBubble.classList.add('v');
export const hideDialog = () => dialogueBubble?.classList.remove('v');
export const displayLine = (who: Unicorn | NPC, line: string) => {
  dialogueName.textContent = who.name;
  dialogueName.style.color = who.colors.maneColor;
  dialogueLine.textContent = line;
};

import { NPC } from './NPC';
import { interactWithNpc } from './npcInteraction';
import { Unicorn } from './unicorn';

export const dialogueBubble = document.getElementById('npc-dialogue')!;
export const dialogueName = document.getElementById('npc-dialogue-name')!;
export const dialogueLine = document.getElementById('npc-dialogue-line')!;
export const dialogueChoices = document.getElementById('npc-dialogue-choices');

dialogueBubble?.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  interactWithNpc();
});

export const showDialog = () => dialogueBubble.classList.add('is-visible');
export const hideDialog = () => dialogueBubble?.classList.remove('is-visible');
export const displayLine = (who: Unicorn | NPC, line: string) => {
  dialogueName.textContent = who.name;
  dialogueName.style.color = who.colors.maneColor;
  dialogueLine.textContent = line;
};

import { dialogueBubble, dialogueLine, dialogueName, displayLine, showDialog } from './dialog';
import { getCurrentLevel, isInLevel } from './levels/levels';
import { unicorn } from './unicorn';

const actionbar = document.getElementById('action-bar')!;

export const showActionbar = () => {
  actionbar.style.display = 'block';
  const actionButton = document.querySelectorAll('.action')[0];
  actionButton.classList.add(unicorn.weapon!);
  actionButton.addEventListener('pointerdown', triggerWeapon);
};
export function triggerWeapon() {
  showDialog();
  const weapon = unicorn.weapon?.toLowerCase();
  if (isInLevel(2, 1)) {
    // enemy TODO add condition for when its dead
    const otherWeapon = weapon !== 'sword' ? 'sword' : 'bow';
    displayLine(
      unicorn,
      `...how the hell am I supposed to use a ${weapon}? I'm a freaking unicorn! I knew I should have taken the ${otherWeapon}!`
    );
  } else {
    displayLine(unicorn, `Cannot use ${weapon} now, no fiend in sight`);
  }
}

import { dialogueBubble, dialogueLine, dialogueName, displayLine, showDialog } from './dialog';
import { getCurrentLevel, isInLevel } from './levels/levels';
import { unicorn } from './unicorn';
import { getElementById, querySelectorAll } from './dom-helpers';
import { launchFireball } from './fireball';

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
    unicorn.hasFailedToUseWeapon = true;
  } else {
    displayLine(unicorn, `Cannot use ${weapon} now, no fiend in sight`);
  }
}

export const addWeaponToActionBar = () => {
  const actionButton = querySelectorAll('.action.w')[0] as HTMLButtonElement;
  actionButton.style.display = 'inline-block';
  actionButton.classList.add(unicorn.weapon!);
  actionButton.addEventListener('pointerdown', triggerWeapon);
};

export const triggerFireBall = () => {
  // showDialog();
  launchFireball(unicorn.x, unicorn.y, -unicorn.direction);
  // displayLine(unicorn, `I can use the power of fire to destroy my enemies!`);
};

export const addFireBallToActionBar = () => {
  unicorn.hasFireball = true;
  const actionButton = querySelectorAll('.action.f')[0] as HTMLButtonElement;
  actionButton.style.display = 'inline-block';
  actionButton.classList.add('fireball');
  actionButton.addEventListener('pointerdown', triggerFireBall);
};

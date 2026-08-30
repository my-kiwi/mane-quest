import { hasVisited } from './levels/levels';
import { createUnicornSvg, unicorn } from './unicorn';

export type NPC = typeof sageNpc;

export const sageNpc = {
  name: 'Sage',
  image: new Image(),
  scale: 1,
  colors: {
    hornColor: '#B68B3C',
    tailColor: '#A7AFB7',
    bodyColor: '#F1E8D8',
    leftFootColor: '#6B4F3A',
    rightFootColor: '#6B4F3A',
    maneColor: '#A7AFB7',
  },
  get dialogue() {
    if (unicorn.deaths === 0) {
      return [
        { line: 'Welcome, dear unicorn.' },
        { line: 'I am the wise sage of this land.' },
        { line: '...' },
        { who: unicorn, line: '...' },
        { line: '...' },
        { who: unicorn, line: '...' },
        { line: "Look, I don't actually have any wisdom. I just stand here." },
        { line: 'What do you want, a goodbye kiss?' },
      ];
    } else if (!hasVisited(0, 1)) {
      // has died in cliff
      return [
        { line: 'Welcome, dear unicorn.' },
        { line: 'I am the wise sage of this land.' },
        { who: unicorn, line: '...' },
        { line: '...' },
        { who: unicorn, line: '...' },
        { line: 'Wait, you actually did jump off the cliff? Why would you do that for?' },
        { who: unicorn, line: '...' },
        { line: "Oh, you're looking for the exit? " },
        { line: "⬅️ It's that way." },
      ];
    } else if (hasVisited(3, 1)) {
      // TODO and has not tried weapon on ennemy yet
      // has been killed by enemy
      if (!unicorn.weapon) {
        return [
          { line: 'Ah, you have returned once again.' },
          { line: 'This fiend? Yes I can help with that.' },
          { line: 'You see, you need a weapon to get rid of him.' },
          {
            line: `Choose between 3 weapons, but choose wisely because as soon as you have chosen, the other ones will vanish in thin air for some reason.`,
          },
          { line: 'Choose wisely:', weapons: ['Bow', 'Sword', 'Buckler'] },
         // nota bene: cannot add extra dialog lines since unicorn.weapon is truthy (jumps to other if branch)
        ];
      } else {
        return [{ line: `Use your ${unicorn.weapon.toLowerCase()} wisely.` }];
      }
    } else {
      // has killed enemy
      return [{ line: 'todo: implement rest of game :D' }];
    }
  },
};
sageNpc.image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  createUnicornSvg(sageNpc.colors)
)}`;

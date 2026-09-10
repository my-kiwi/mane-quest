import { getCurrentLevel, isInLevel, hasVisited } from './levels/levels';
import { encodeSvg } from './svg-helpers';
import { createUnicornSvg, unicorn } from './unicorn';
import { addFireBallToActionBar, addShovelToActionBar } from './action';
import { firstEnemy } from './enemy';
import { hideDialog } from './dialog';

export type NPC = typeof sageNpc;

export const sageNpc = {
  name: 'Sage',
  image: new Image(),
  scaleX: 1,
  scaleY: 1,
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
      // addWeaponToActionBar();
      // addFireBallToActionBar();
      return [
        { line: 'Welcome!' },
        //{ line: 'Choose wisely:', weapons: ['Bow', 'Sword', 'Buckler'] },
        { line: 'I am the wise sage of this land.' },
        { line: '...' },
        { who: unicorn, line: '...where are we?' },
        { line: '...' },
        { who: unicorn, line: `Actually, I just fell there and...` },
        { line: "Look, I don't actually have any wisdom. I just stand here." },
        { line: 'What do you want, a goodbye kiss?' },
      ];
    }
    if (!hasVisited(0, 1)) {
      // has died in cliff
      return [
        { line: 'Welcome, ' + unicorn.name + '!' },
        { line: 'I am the wise sage of this land.' },
        { who: unicorn, line: '...' },
        { line: '...' },
        { who: unicorn, line: '...' },
        { line: 'Wait, you actually did jump off the cliff? Why would you do that for?' },
        { who: unicorn, line: 'I...' },
        { line: "Oh, you're looking for the exit? " },
        { line: "⬅️ It's that way." },
      ];
    }
    if (hasVisited(3, 1)) {
      // has been killed by enemy
      if (!unicorn.weapon) {
        return [
          { line: 'Ah, you have returned once again.' },
          { line: 'This fiend? Yes I can help with that.' },
          { line: 'See, you need a weapon to get rid of him.' },
          // TODO ask for money=> greed talsiman=>death,
          {
            line: `Choose between 3 weapons, but choose wisely because as soon as you have chosen, the other ones will vanish in thin air for some reason.`,
          },
          { line: 'Choose wisely:', weapons: ['Bow', 'Sword', 'Buckler'] },
          // nota bene: cannot add extra dialog lines since unicorn.weapon is truthy (jumps to other if branch)
        ];
      }
      if (!unicorn.hasFailedToUseWeapon) {
        return [{ line: `Use your ${unicorn.weapon.toLowerCase()} wisely.` }];
      }

      if (!firstEnemy?.isDead) {
        return [
          { line: `You again? What's wrong?` },
          {
            line: `You're not able to use your ${unicorn.weapon?.toLowerCase()}? That's a shame, I can't give you another weapon.`,
          },
          { line: `Well, there is another way but it aint pretty.` },
          { who: unicorn, line: 'OK...' },
          { line: `See, us unicorns have a special ability.` },
          { line: 'We can use the power of fire to destroy our enemies. Are you in?' },
          { who: unicorn, line: '...sure?' },
          {
            get line() {
              // hacky as heck
              addFireBallToActionBar();
              return `Just eat this burrito 🌯 and you'll understand what I mean.`;
            },
          },
        ];
      }
      return [
        {
          line: `You have defeated my nemesis! You have my thanks!`,
        },
        { who: unicorn, line: 'Your...?' },
        { line: 'You can now continue your journey.' },
        { line: `It's that way ➡️` },
        { line: 'What do you want, a goodbye kiss?' },
      ];
    }
    return [
      {
        line: '...bye',
      },
    ];
  },
};
sageNpc.image.src = encodeSvg(createUnicornSvg(sageNpc.colors));

export const randomNpc: NPC = {
  name: 'Some dude',
  image: new Image(),
  scaleX: -1,
  scaleY: 1,
  colors: {
    hornColor: '#df0ec7',
    tailColor: '#147ce3',
    bodyColor: '#F1E8D8',
    leftFootColor: '#6B4F3A',
    rightFootColor: '#6B4F3A',
    maneColor: '#147ce3', // TODO if always same as tailcolor centralize
  },
  get dialogue() {
    return [
      { line: 'Why, hello there!' },
      { line: 'You look lost.' },
      { who: unicorn, line: '...' },
      { who: unicorn, line: `Yeah, and pissed! That "Sage" over there really screwed me over.` },
      { line: `Yeah, he's a bit of a jerk.` },
      { who: unicorn, line: '...' },
      { line: `So anyway, why are you here?` },
      {
        who: unicorn,
        line: `I surely wish I could answer that. All I know is that I fell from the sky and...`,
      },
      { line: `Oh, I see, you're one of "these".` },
      { who: unicorn, line: 'One of "these" what?' },
      { line: `You know, the ones that fall from the sky.` },
      { who: unicorn, line: '...' },
      { line: `Anyway, I don't have much time to chat. I have to go. Byyyyyyye!` },
      {
        who: unicorn,
        get line() {
          getCurrentLevel().npc = undefined; // erases itself from existence
          return `What the deuce?`;
        },
      },
      // { line: 'What do you want, a goodbye kiss?' },
    ];
  },
};
randomNpc.image.src = encodeSvg(createUnicornSvg(randomNpc.colors));

export const secretNpc: NPC = {
  name: 'Xanaxaia',
  image: new Image(),
  scaleX: 1,
  scaleY: 1,
  colors: {
    hornColor: '#d18f16',
    tailColor: '#6e09e2',
    bodyColor: '#2d0241',
    leftFootColor: '#d18f16',
    rightFootColor: '#d18f16',
    maneColor: '#6e09e2', // TODO if always same as tailcolor centralize
  },
  get dialogue() {
    if (unicorn.hasShovel) {
      return [
        { line: `What? You want to eat with that?` },
        { who: unicorn, line: '...' },
        { line: `Don't be silly, I don't have any food.` },
        { line: 'You can dig with it though, and find treasure!' },
        { line: 'Or death. Mostly death.' },
      ];
    }
    return [
      { line: 'You found me!' },
      { line: 'I am Xanaxaia, the secret unicorn!' },
      { who: unicorn, line: '...' },
      { line: 'I am here to give you a special gift.' },
      { who: unicorn, line: '...' },
      { line: 'Here, take this magical shovel!' },
      {
        get line() {
          addShovelToActionBar();
          hideDialog();
          return `You have received the magical shovel!`;
        },
      },
    ];
  },
};
secretNpc.image.src = encodeSvg(createUnicornSvg(secretNpc.colors));

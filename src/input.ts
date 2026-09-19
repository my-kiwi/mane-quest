import { canvas } from './canvas';
import { unicorn } from './unicorn';
import { triggerJump } from './physics';
import { getCurrentLevel } from './levels/levels';
import { TileType } from './levels/level-type';
import { getTileDimensions } from './levels/levelGeometry';
import {
  confirmCurrentWeaponChoice,
  getWeaponChoices,
  interactWithNpc,
  isPointOnNpc,
  moveWeaponSelection,
  updateNpcInteractionUi,
} from './npcInteraction';
import { triggerFireBall, triggerWeapon, triggerShovel } from './action';

// Input state
export const keys: { [key: string]: boolean } = {};
export let gamepadLeft = false;
export let gamepadRight = false;
export let targetX = 0;
export let targetY = 0;

const DOUBLE_TAP_DELAY = 300;
const GAMEPAD_DEADZONE = 0.35;
const GamePadButtons = {
  south: 0, // x
  east: 1, // O
  west: 2, // square
  north: 3, // triangle
  start: 9,
  dpadUp: 12,
  dpadDown: 13,
  dpadLeft: 14,
  dpadRight: 15,
} as const;
let lastPointerDownAt = 0;
let connectedGamepadIndex: number | undefined;
let previousGamepadButtons: boolean[] = [];

function getConnectedGamepad(): Gamepad | undefined {
  const gamepads = navigator.getGamepads();
  if (connectedGamepadIndex !== undefined) {
    const gamepad = gamepads[connectedGamepadIndex];
    if (gamepad) {
      return gamepad;
    }
  }

  const gamepad = Array.from(gamepads).find(Boolean);
  connectedGamepadIndex = gamepad?.index;
  return gamepad ?? undefined;
}

function isGamepadButtonPressed(gamepad: Gamepad, buttonIndex: number): boolean {
  return gamepad.buttons[buttonIndex]?.pressed ?? false;
}

function wasGamepadButtonPressed(gamepad: Gamepad, buttonIndex: number): boolean {
  return previousGamepadButtons[buttonIndex] ?? false;
}

function isNewGamepadPress(gamepad: Gamepad, buttonIndex: number): boolean {
  return isGamepadButtonPressed(gamepad, buttonIndex) && !wasGamepadButtonPressed(gamepad, buttonIndex);
}

function updateGamepadButtons(gamepad: Gamepad): void {
  previousGamepadButtons = gamepad.buttons.map((button) => button.pressed);
}

export function updateGamepadInput(): void {
  const gamepad = getConnectedGamepad();
  if (!gamepad) {
    gamepadLeft = false;
    gamepadRight = false;
    previousGamepadButtons = [];
    return;
  }

  const weaponChoicesOpen = getWeaponChoices().length > 0;
  gamepadLeft = !weaponChoicesOpen &&
    (gamepad.axes[0] < -GAMEPAD_DEADZONE || isGamepadButtonPressed(gamepad, GamePadButtons.dpadLeft));
  gamepadRight = !weaponChoicesOpen &&
    (gamepad.axes[0] > GAMEPAD_DEADZONE || isGamepadButtonPressed(gamepad, GamePadButtons.dpadRight));

  if (weaponChoicesOpen) {
    if (isNewGamepadPress(gamepad, GamePadButtons.dpadUp) || isNewGamepadPress(gamepad, GamePadButtons.dpadLeft)) {
      moveWeaponSelection(-1);
    }
    if (isNewGamepadPress(gamepad, GamePadButtons.dpadDown) || isNewGamepadPress(gamepad, GamePadButtons.dpadRight)) {
      moveWeaponSelection(1);
    }
    if (isNewGamepadPress(gamepad, GamePadButtons.south) || isNewGamepadPress(gamepad, GamePadButtons.start)) {
      confirmCurrentWeaponChoice();
      interactWithNpc();
    }
  } else {
    if (isNewGamepadPress(gamepad, GamePadButtons.south)) {
      triggerJump();
    }
    if (isNewGamepadPress(gamepad, GamePadButtons.start)) {
      updateNpcInteractionUi();
      interactWithNpc();
    }
    if (isNewGamepadPress(gamepad, GamePadButtons.east) && unicorn.hasFireball) {
      triggerFireBall();
    }
    if (isNewGamepadPress(gamepad, GamePadButtons.west) && unicorn.weapon) {
      triggerWeapon();
    }
    if (isNewGamepadPress(gamepad, GamePadButtons.north) && unicorn.hasShovel) {
      triggerShovel();
    }
  }

  updateGamepadButtons(gamepad);
}

export function setTargetPosition(x: number, y: number): void {
  targetX = x;
  targetY = y;
}

export function getGroundY(): number {
  const groundRow = getCurrentLevel().map.findIndex((row) => row.includes(TileType.GROUND));
  const groundTop =
    (groundRow >= 0 ? groundRow : getCurrentLevel().map.length) * getTileDimensions().height;

  return groundTop - unicorn.height / 2;
}

function handleCanvasInteraction(x: number, y: number): boolean {
  updateNpcInteractionUi();
  if (isPointOnNpc(x, y) && interactWithNpc()) {
    return false;
  }

  setTargetPosition(x, getGroundY());

  if (
    y < unicorn.y - unicorn.height / 1.5 || // jump when y above unicorn
    (x >= unicorn.x - unicorn.width / 2 && x <= unicorn.x + unicorn.width / 2) || // or when clicking on x unicorn
    unicorn.isJumping // or if already jumping
  ) {
    triggerJump();
    return true;
  }

  return false;
}

export function initializeInput(): void {
  // Keyboard input
  addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    if (getWeaponChoices().length > 0) {
      if ((e.key === 'ArrowDown' || e.key === 'ArrowRight') && !e.repeat) {
        e.preventDefault();
        moveWeaponSelection(1);
        return;
      }

      if ((e.key === 'ArrowUp' || e.key === 'ArrowLeft') && !e.repeat) {
        e.preventDefault();
        moveWeaponSelection(-1);
        return;
      }

      if (e.key === 'Enter' && !e.repeat) {
        e.preventDefault();
        confirmCurrentWeaponChoice();
        interactWithNpc();
        return;
      }

      return;
    }

    keys[e.key] = true;

    if (e.key === 'Enter' && !e.repeat) {
      updateNpcInteractionUi();
      interactWithNpc();
    }

    if ((e.key === 'ArrowUp' || e.code === 'Space' || key === 'w') && !e.repeat) {
      triggerJump();
    }

    if (e.key === 'u' && unicorn.weapon) {
      triggerWeapon();
    }
    if (e.key === 'f' && unicorn.hasFireball) {
      triggerFireBall();
    }
    if (e.key === 't' && unicorn.hasShovel) {
      triggerShovel();
    }
  });

  addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });

  // click + touch input
  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    const now = Date.now();
    const isDoubleTap = now - lastPointerDownAt <= DOUBLE_TAP_DELAY;
    lastPointerDownAt = isDoubleTap ? 0 : now;

    const jumped = handleCanvasInteraction(x, y);
    if (isDoubleTap && !jumped) {
      triggerJump();
    }
  });

  // Initialize target position
  setTargetPosition(unicorn.x, getGroundY());
}

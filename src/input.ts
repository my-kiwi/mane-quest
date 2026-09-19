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

export const keys: Record<string, boolean> = {};
export let gamepadLeft = false;
export let gamepadRight = false;
export let targetX = 0;
export let targetY = 0;

const DOUBLE_TAP_DELAY = 300;
const GAMEPAD_DEADZONE = 0.35;
const GamePadButtons = {
  south: 0,
  east: 1,
  west: 2,
  north: 3,
  start: 9,
  dpadUp: 12,
  dpadDown: 13,
  dpadLeft: 14,
  dpadRight: 15,
} as const;
type ControllerType = 'playstation' | 'xbox' | 'unknown';

const createControllerButtonSvg = (
  fill: string,
  stroke: string,
  body: string,
  extra?: string
): string => `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <circle cx="16" cy="16" r="15" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
  ${body}
  ${extra ?? ''}
</svg>`;

const BUTTON_ICONS: Record<Exclude<ControllerType, 'unknown'>, string[]> = {
  playstation: [
    createControllerButtonSvg(
      '#1E2025',
      '#3A3F4D',
      '<path d="M10.5 10.5L21.5 21.5M21.5 10.5L10.5 21.5" stroke="#5091F2" stroke-width="3" stroke-linecap="round"/>'
    ),
    createControllerButtonSvg(
      '#1E2025',
      '#3A3F4D',
      '<circle cx="16" cy="16" r="6" stroke="#F25050" stroke-width="3"/>'
    ),
    createControllerButtonSvg(
      '#1E2025',
      '#3A3F4D',
      '<rect x="10.5" y="10.5" width="11" height="11" rx="1.5" stroke="#E262C1" stroke-width="3"/>'
    ),
    createControllerButtonSvg(
      '#1E2025',
      '#3A3F4D',
      '<path d="M16 9.5L22.5 21H9.5L16 9.5Z" stroke="#23D18B" stroke-width="2.8" stroke-linejoin="round"/>'
    ),
  ],
  xbox: [
    createControllerButtonSvg(
      '#107C41',
      '#159851',
      '',
      '<text x="16" y="21.5" fill="#FFFFFF" font-family="sans-serif" font-weight="800" font-size="16" text-anchor="middle">A</text>'
    ),
    createControllerButtonSvg(
      '#E81123',
      '#F13848',
      '',
      '<text x="16" y="21.5" fill="#FFFFFF" font-family="sans-serif" font-weight="800" font-size="16" text-anchor="middle">B</text>'
    ),
    createControllerButtonSvg(
      '#0078D4',
      '#2B93E1',
      '',
      '<text x="16" y="21.5" fill="#FFFFFF" font-family="sans-serif" font-weight="800" font-size="16" text-anchor="middle">X</text>'
    ),
    createControllerButtonSvg(
      '#FFB900',
      '#FFC833',
      '',
      '<text x="16" y="21.5" fill="#111827" font-family="sans-serif" font-weight="800" font-size="16" text-anchor="middle">Y</text>'
    ),
  ],
};

let lastPointerDownAt = 0;
let connectedGamepadIndex: number | undefined;
let previousGamepadButtons: boolean[] = [];
let actionHintsControllerType: ControllerType | 'keyboard' = 'keyboard';

function detectControllerType(gamepad: Gamepad | undefined): ControllerType {
  if (!gamepad?.id) return 'unknown';

  const id = gamepad.id.toLowerCase();
  const isPlaystation =
    id.includes('dualsense') ||
    id.includes('playstation') ||
    (id.includes('054c') && (id.includes('0ce6') || id.includes('0df2')));

  if (isPlaystation) return 'playstation';
  if (id.includes('xbox') || id.includes('xinput') || id.includes('045e')) return 'xbox';

  return 'unknown';
}

window.addEventListener('gamepadconnected', (event) => {
  const type = detectControllerType(event.gamepad);
  console.log(`Detected Controller: ${type} (Raw ID: "${event.gamepad.id}")`);
});

function getControllerButtonIcon(
  controllerType: ControllerType | 'keyboard',
  buttonIndex: number
): string {
  if (controllerType === 'keyboard') return '';

  const icons = controllerType === 'playstation' ? BUTTON_ICONS.playstation : BUTTON_ICONS.xbox;
  return icons[buttonIndex] ?? '';
}

function updateActionHints(controllerType: ControllerType | 'keyboard'): void {
  if (actionHintsControllerType === controllerType) return;

  document.querySelectorAll<HTMLElement>('.a .h').forEach((hint) => {
    if (controllerType === 'keyboard') {
      hint.textContent = hint.dataset.keyboard ?? '';
      return;
    }

    const actionButton = hint.parentElement;
    const buttonIndex = actionButton?.classList.contains('s')
      ? 3
      : actionButton?.classList.contains('f')
        ? 1
        : actionButton?.classList.contains('w')
          ? 2
          : 0;

    hint.innerHTML = getControllerButtonIcon(controllerType, buttonIndex);
  });

  actionHintsControllerType = controllerType;
}

function getConnectedGamepad(): Gamepad | undefined {
  const gamepads = navigator.getGamepads();
  if (connectedGamepadIndex !== undefined) {
    const gamepad = gamepads[connectedGamepadIndex];
    if (gamepad) return gamepad;
  }

  const gamepad = Array.from(gamepads).find(Boolean);
  connectedGamepadIndex = gamepad?.index;
  return gamepad ?? undefined;
}

function isGamepadButtonPressed(gamepad: Gamepad, buttonIndex: number): boolean {
  return gamepad.buttons[buttonIndex]?.pressed ?? false;
}

function wasGamepadButtonPressed(buttonIndex: number): boolean {
  return previousGamepadButtons[buttonIndex] ?? false;
}

function isNewGamepadPress(gamepad: Gamepad, buttonIndex: number): boolean {
  return isGamepadButtonPressed(gamepad, buttonIndex) && !wasGamepadButtonPressed(buttonIndex);
}

function updateGamepadButtons(gamepad: Gamepad): void {
  previousGamepadButtons = gamepad.buttons.map((button) => button.pressed);
}

export function updateGamepadInput(): void {
  const gamepad = getConnectedGamepad();
  const controllerType = gamepad ? detectControllerType(gamepad) : 'keyboard';
  updateActionHints(controllerType);

  if (!gamepad) {
    gamepadLeft = false;
    gamepadRight = false;
    previousGamepadButtons = [];
    return;
  }

  const weaponChoicesOpen = getWeaponChoices().length > 0;
  gamepadLeft =
    !weaponChoicesOpen &&
    (gamepad.axes[0] < -GAMEPAD_DEADZONE ||
      isGamepadButtonPressed(gamepad, GamePadButtons.dpadLeft));
  gamepadRight =
    !weaponChoicesOpen &&
    (gamepad.axes[0] > GAMEPAD_DEADZONE ||
      isGamepadButtonPressed(gamepad, GamePadButtons.dpadRight));

  if (weaponChoicesOpen) {
    const leftWeapon =
      isNewGamepadPress(gamepad, GamePadButtons.dpadUp) ||
      isNewGamepadPress(gamepad, GamePadButtons.dpadLeft);
    const rightWeapon =
      isNewGamepadPress(gamepad, GamePadButtons.dpadDown) ||
      isNewGamepadPress(gamepad, GamePadButtons.dpadRight);

    if (leftWeapon) moveWeaponSelection(-1);
    if (rightWeapon) moveWeaponSelection(1);
    if (
      isNewGamepadPress(gamepad, GamePadButtons.south) ||
      isNewGamepadPress(gamepad, GamePadButtons.start)
    ) {
      confirmCurrentWeaponChoice();
      interactWithNpc();
    }
  } else {
    if (isNewGamepadPress(gamepad, GamePadButtons.south)) {
      updateNpcInteractionUi();
      if (!interactWithNpc()) triggerJump();
    }
    if (isNewGamepadPress(gamepad, GamePadButtons.start)) {
      updateNpcInteractionUi();
      interactWithNpc();
    }
    if (isNewGamepadPress(gamepad, GamePadButtons.east) && unicorn.hasFireball) triggerFireBall();
    if (isNewGamepadPress(gamepad, GamePadButtons.west) && unicorn.weapon) triggerWeapon();
    if (isNewGamepadPress(gamepad, GamePadButtons.north) && unicorn.hasShovel) triggerShovel();
  }

  updateGamepadButtons(gamepad);
}

export function setTargetPosition(x: number, y: number): void {
  targetX = x;
  targetY = y;
}

export function getGroundY(): number {
  const level = getCurrentLevel();
  const groundRow = level.map.findIndex((row) => row.includes(TileType.GROUND));
  const groundTop = (groundRow >= 0 ? groundRow : level.map.length) * getTileDimensions().height;

  return groundTop - unicorn.height / 2;
}

function handleCanvasInteraction(x: number, y: number): boolean {
  updateNpcInteractionUi();
  if (isPointOnNpc(x, y) && interactWithNpc()) return false;

  setTargetPosition(x, getGroundY());

  const clickedOnUnicorn = x >= unicorn.x - unicorn.width / 2 && x <= unicorn.x + unicorn.width / 2;
  if (y < unicorn.y - unicorn.height / 1.5 || clickedOnUnicorn || unicorn.isJumping) {
    triggerJump();
    return true;
  }

  return false;
}

export function initializeInput(): void {
  addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    if (getWeaponChoices().length > 0) {
      const moveSelection = (direction: -1 | 1) => {
        if (!e.repeat) {
          e.preventDefault();
          moveWeaponSelection(direction);
        }
      };

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') return moveSelection(1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') return moveSelection(-1);
      if (e.key === 'Enter' && !e.repeat) {
        e.preventDefault();
        confirmCurrentWeaponChoice();
        interactWithNpc();
      }
      return;
    }

    keys[e.key] = true;

    if (e.key === 'Enter' && !e.repeat) {
      updateNpcInteractionUi();
      interactWithNpc();
    }

    if ((e.key === 'ArrowUp' || e.code === 'Space' || key === 'w') && !e.repeat) triggerJump();
    if (e.key === 'u' && unicorn.weapon) triggerWeapon();
    if (e.key === 'f' && unicorn.hasFireball) triggerFireBall();
    if (e.key === 't' && unicorn.hasShovel) triggerShovel();
  });

  addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });

  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    const now = Date.now();
    const isDoubleTap = now - lastPointerDownAt <= DOUBLE_TAP_DELAY;
    lastPointerDownAt = isDoubleTap ? 0 : now;

    const jumped = handleCanvasInteraction(x, y);
    if (isDoubleTap && !jumped) triggerJump();
  });

  setTargetPosition(unicorn.x, getGroundY());
}

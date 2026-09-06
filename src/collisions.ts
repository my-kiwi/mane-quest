const HITBOX_MULTIPLIER = 0.45;

export function getHitbox(
  sprite: { x: number; y: number; width: number; height: number },
  widthScale: number,
  heightScale: number
): { left: number; right: number; top: number; bottom: number } {
  const halfWidth = sprite.width * widthScale * HITBOX_MULTIPLIER;
  const halfHeight = sprite.height * heightScale * HITBOX_MULTIPLIER;

  return {
    left: sprite.x - halfWidth,
    right: sprite.x + halfWidth,
    top: sprite.y - halfHeight,
    bottom: sprite.y + halfHeight,
  };
}

export function isUnicornTouchingEnemy(
  unicornSprite: { x: number; y: number; width: number; height: number },
  enemySprite: { x: number; y: number; width: number; height: number }
): boolean {
  return areSpritesTouching(unicornSprite, enemySprite, 1, 1, 0.6, 0.8);
}

export function isFireballTouchingEnemy(
  fireballSprite: { x: number; y: number; width: number; height: number },
  enemySprite: { x: number; y: number; width: number; height: number }
): boolean {
  return areSpritesTouching(fireballSprite, enemySprite, 1, 1, 0.6, 0.8);
}

function areSpritesTouching(
  firstSprite: { x: number; y: number; width: number; height: number },
  secondSprite: { x: number; y: number; width: number; height: number },
  firstWidthScale: number,
  firstHeightScale: number,
  secondWidthScale: number,
  secondHeightScale: number
): boolean {
  const firstHitbox = getHitbox(firstSprite, firstWidthScale, firstHeightScale);
  const secondHitbox = getHitbox(secondSprite, secondWidthScale, secondHeightScale);

  return (
    firstHitbox.right >= secondHitbox.left &&
    firstHitbox.left <= secondHitbox.right &&
    firstHitbox.bottom >= secondHitbox.top &&
    firstHitbox.top <= secondHitbox.bottom
  );
}

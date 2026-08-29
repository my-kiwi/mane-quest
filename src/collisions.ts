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
  const unicornHitbox = getHitbox(unicornSprite, 1, 1);
  const enemyHitbox = getHitbox(enemySprite, 0.6, 0.8);

  return (
    unicornHitbox.right >= enemyHitbox.left &&
    unicornHitbox.left <= enemyHitbox.right &&
    unicornHitbox.bottom >= enemyHitbox.top &&
    unicornHitbox.top <= enemyHitbox.bottom
  );
}

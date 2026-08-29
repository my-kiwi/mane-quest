import { describe, expect, it, vi } from 'vitest';
import { isUnicornTouchingEnemy } from '../collisions';
import Music from '../music';
import { getCurrentLevel, levels, setCurrentLevel } from './levels';
import { mapGenerator, NB_OF_TILES_VERTICALLY, NB_OF_TILES_HORIZONTALLY } from './level-type';

describe('levels', () => {
  it('contains at least one level', () => {
    expect(levels).toBeDefined();
    expect(levels.length).toBeGreaterThan(0);
  });
  it('each level should have correct number of rows and columns', () => {
    levels.forEach((level) => {
      expect(
        level.map.length,
        `Level "${level.position.x}, ${level.position.y}" does only have ${level.map.length} out of ${NB_OF_TILES_VERTICALLY} tile rows.`
      ).toBe(NB_OF_TILES_VERTICALLY);
      level.map.forEach((row) => {
        expect(
          row.length,
          `Row ${level.map.indexOf(row)} in level "${level.position.x}, ${level.position.y}" does only have ${row.length} out of ${NB_OF_TILES_HORIZONTALLY} tiles.`
        ).toBe(NB_OF_TILES_HORIZONTALLY);
      });
    });
  });

  it('each level should have a unique position', () => {
    const positions = new Set();
    levels.forEach((level) => {
      const posString = `${level.position.x},${level.position.y}`;
      expect(positions.has(posString), `Duplicate level position found: ${posString}`).toBe(false);
      positions.add(posString);
    });
  });
  it('should generate a map with the correct dimensions and ground height', () => {
    const groundHeight = 7;
    const generatedMap = mapGenerator(groundHeight);

    expect(generatedMap.length).toBe(NB_OF_TILES_VERTICALLY);
    generatedMap.forEach((row) => {
      expect(row.length).toBe(NB_OF_TILES_HORIZONTALLY);
    });
    expect(generatedMap).toEqual([
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    ]);
  });

  it('changes music when the level track changes and avoids restarting the same track', () => {
    const initialLevel = getCurrentLevel();
    const startLevel = levels.find((level) => level.music === 'overworld') ?? initialLevel;
    const nextLevel = levels.find((level) => level.music === 'cavern') ?? startLevel;

    const playSpy = vi.spyOn(Music, 'play');

    setCurrentLevel(startLevel);
    expect(playSpy).toHaveBeenCalledWith('overworld');

    setCurrentLevel(nextLevel);
    expect(playSpy).toHaveBeenCalledWith('cavern');

    playSpy.mockRestore();
  });

  it('should detect when the unicorn touches an enemy', () => {
    expect(
      isUnicornTouchingEnemy(
        { x: 50, y: 50, width: 60, height: 60 },
        { x: 90, y: 50, width: 140, height: 140 }
      )
    ).toBe(true);

    expect(
      isUnicornTouchingEnemy(
        { x: 50, y: 50, width: 60, height: 60 },
        { x: 200, y: 200, width: 40, height: 40 }
      )
    ).toBe(false);
  });

  it('should ignore the enemy decorative edges when calculating the collision box', () => {
    expect(
      isUnicornTouchingEnemy(
        { x: 142, y: 100, width: 30, height: 30 },
        { x: 100, y: 100, width: 80, height: 80 }
      )
    ).toBe(false);
  });
});

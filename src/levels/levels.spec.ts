import { describe, expect, it } from 'vitest';
import { levels } from './levels';
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
});

import { describe, expect, it } from 'vitest';
import { levels, NB_OF_TILES_VERTICALLY, NB_OF_TILES_HORIZONTALLY } from './levels';

describe('levels', () => {
  it('contains at least one level', () => {
    expect(levels).toBeDefined();
    expect(levels.length).toBeGreaterThan(0);
  });
  it('each level should have correct number of rows and columns', () => {
    levels.forEach((level) => {
      expect(
        level.map.length,
        `Level "${level.name}" does only have ${level.map.length} out of ${NB_OF_TILES_VERTICALLY} tile rows.`
      ).toBe(NB_OF_TILES_VERTICALLY);
      level.map.forEach((row) => {
        expect(
          row.length,
          `Row ${level.map.indexOf(row)} in level "${level.name}" does only have ${row.length} out of ${NB_OF_TILES_HORIZONTALLY} tiles.`
        ).toBe(NB_OF_TILES_HORIZONTALLY);
      });
    });
  });
});

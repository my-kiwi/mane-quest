import { NPC } from '../NPC';

export type Level = {
  position: { x: number; y: number };
  backgroundColor: string;
  groundColor: string;
  map: string[];
  npc?: NPC; // Replace 'any' with the actual type of your NPC if available
};

export const TileType = {
  EMPTY: ' ',
  GROUND: '■',
  PLATFORM: '═',
  INVISIBLE_PLATFORM: '─',
  SPIKE: '▲',
  COIN: '●',
  ENEMY: 'E',
  EXIT: 'X',
  NPC: 'P',
  START: 'S',
};
const tilesMultiplier = 2;
export const NB_OF_TILES_HORIZONTALLY = 16 * tilesMultiplier;
export const NB_OF_TILES_VERTICALLY = 9 * tilesMultiplier;

export const rowGenerator = (tileType: string): string => {
  return tileType.repeat(NB_OF_TILES_HORIZONTALLY);
};

export const mapGenerator = (groundHeightTiles: number): string[] => {
  const map: string[] = [];

  for (let y = 0; y < NB_OF_TILES_VERTICALLY; y++) {
    map.push(rowGenerator(y >= NB_OF_TILES_VERTICALLY - groundHeightTiles ? '■' : ' ')); // Add empty rows above the ground
  }

  return map;
};

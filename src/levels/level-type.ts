import { NPC } from '../NPC';
import { Enemy } from '../enemy';
import { TrackName } from '../music';

export type Level = {
  position: { x: number; y: number };
  backgroundColor: string;
  groundColor: string;
  map: string[];
  removedTiles?: Set<string>;
  visited?: boolean;
  npc?: NPC;
  enemy?: Enemy;
  music: TrackName;
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
} as const; // Added "as const" to infer literal string types instead of generic strings

export type TileTypeEntry = (typeof TileType)[keyof typeof TileType];
const tilesMultiplier = 2;
export const NB_OF_TILES_HORIZONTALLY = 16 * tilesMultiplier;
export const NB_OF_TILES_VERTICALLY = 9 * tilesMultiplier;

export const rowGenerator = (tileType: TileTypeEntry): string => {
  return tileType.repeat(NB_OF_TILES_HORIZONTALLY);
};

export const mapGenerator = (groundHeightTiles: number): string[] => {
  const map: string[] = [];

  for (let y = 0; y < NB_OF_TILES_VERTICALLY; y++) {
    map.push(rowGenerator(y >= NB_OF_TILES_VERTICALLY - groundHeightTiles ? '■' : ' ')); // Add empty rows above the ground
  }

  return map;
};

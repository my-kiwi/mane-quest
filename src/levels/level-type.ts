import { NPC } from '../NPC';
import { Enemy } from '../enemy';
import { TrackName } from '../music';

export type LevelTheme = {
  backgroundColor1: string;
  backgroundColor2: string;
  groundColor: string;
};

export type Level = LevelTheme & {
  position: { x: number; y: number };
  map: string[];
  removedTiles?: Set<string>;
  visited?: boolean;
  npc?: NPC;
  enemy?: Enemy;
  music: TrackName;
};

export const LEVEL_THEMES = {
  meadow: {
    backgroundColor1: '#39C6F4',
    backgroundColor2: '#0878D1',
    groundColor: '#228B22',
  },
  brightMeadow: {
    backgroundColor1: '#32D7FF',
    backgroundColor2: '#0874D1',
    groundColor: '#228B22',
  },
  sunset: {
    backgroundColor1: '#FFB000',
    backgroundColor2: '#E43812',
    groundColor: '#105c10',
  },
  ember: {
    backgroundColor1: '#FF7518',
    backgroundColor2: '#C91E3A',
    groundColor: '#175c17',
  },
  rose: {
    backgroundColor1: '#FF2B85',
    backgroundColor2: '#8E145F',
    groundColor: '#0e390e',
  },
  magenta: {
    backgroundColor1: '#F52D91',
    backgroundColor2: '#71186F',
    groundColor: '#0e390e',
  },
  crimson: {
    backgroundColor1: '#E51B70',
    backgroundColor2: '#52105E',
    groundColor: '#0c2e0c',
  },
  indigo: {
    backgroundColor1: '#751BCE',
    backgroundColor2: '#26005C',
    groundColor: '#2F1B4A',
  },
  burgundy: {
    backgroundColor1: '#B8004B',
    backgroundColor2: '#4A001E',
    groundColor: '#140008',
  },
  lava: {
    backgroundColor1: '#FF3030',
    backgroundColor2: '#7A0000',
    groundColor: '#440000',
  },
} as const satisfies Record<string, LevelTheme>;

export const TileType = {
  EMPTY: ' ',
  GROUND: '■',
  PLATFORM: '═',
  INVISIBLE_PLATFORM: '─',
  ENEMY: 'E',
  NPC: 'P',
  START: 'S',
  TOMB: 'T',
  LAVA: 'L',
  WALL: '|',
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

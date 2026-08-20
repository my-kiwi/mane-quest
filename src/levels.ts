export const TileType = {
  EMPTY: ' ',
  GROUND: '■',
  PLATFORM: '═',
  SPIKE: '▲',
  COIN: '●',
  ENEMY: 'E',
  EXIT: 'X',
  PNJ: 'P',
};
const tilesMultiplier = 2;
export const NB_OF_TILES_HORIZONTALLY = 16 * tilesMultiplier;
export const NB_OF_TILES_VERTICALLY = 9 * tilesMultiplier;

export const levels = [
  {
    name: 'Level 0,0',
    backgroundColor: '#87CEEB', // Sky blue
    groundColor: '#228B22', // Forest green
    map: [
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
      '                                ',
      ' P                              ',
      '■■■■■■■■■■■■■■■■■■■■   ■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■   ■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■   ■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
      '■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■',
    ],
  },
];

levels.forEach((level) => {
  // Ensure the map has the correct number of rows
  level.map.forEach((row, rowIndex) => {
    if (row.length !== NB_OF_TILES_HORIZONTALLY) {
      console.warn(
        `Row ${rowIndex} in level "${level.name}" does only have ${row.length} out of ${NB_OF_TILES_HORIZONTALLY} tiles.`
      );
    }
  });
});

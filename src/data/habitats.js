// 1세대 포켓몬 서식지별 ID 목록
export const HABITAT_POKEMON = {
  grassland: [
    1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14, 15,
    16, 17, 18, 19, 20, 21, 22, 43, 44, 45,
    46, 47, 48, 49, 69, 70, 71, 84, 85, 102, 103, 113, 114
  ],
  mountain: [
    23, 24, 27, 28, 29, 30, 31, 32, 33, 34,
    35, 36, 56, 57, 66, 67, 68, 74, 75, 76,
    95, 111, 112, 115, 128, 140, 141
  ],
  forest: [
    25, 26, 37, 38, 39, 40, 50, 51, 52, 53,
    58, 59, 77, 78, 83, 104, 105, 133, 134, 135, 136
  ],
  urban: [
    52, 53, 54, 55, 60, 61, 62, 63, 64, 65,
    79, 80, 81, 82, 88, 89, 92, 93, 94,
    109, 110, 122, 137
  ],
  water_edge: [
    54, 55, 60, 61, 62, 72, 73, 79, 80, 86,
    87, 90, 91, 98, 99, 116, 117, 120, 121
  ],
  sea: [
    72, 73, 86, 87, 90, 91, 116, 117, 118,
    119, 120, 121, 129, 130, 131, 138, 139
  ],
  cave: [
    23, 24, 41, 42, 66, 67, 68, 74, 75, 76,
    95, 147, 148, 149
  ],
};

// 16개 종착지에 서식지 슬롯 배분
// grassland×4, mountain×3, forest×2, urban×2, waters_edge×2, sea×2, cave×1
export const FORK_TREE = [
  // [left, right] 으로 4레벨 이진트리 → 16 leaves
  // 인덱스: 0~15 (왼쪽-우선 순회)
  'grassland',    // 0000
  'grassland',    // 0001
  'mountain',     // 0010
  'forest',       // 0011
  'grassland',    // 0100
  'urban',        // 0101
  'mountain',     // 0110
  'water_edge',   // 0111
  'grassland',    // 1000
  'sea',          // 1001
  'mountain',     // 1010
  'forest',       // 1011
  'urban',        // 1100
  'water_edge',   // 1101
  'sea',          // 1110
  'cave',         // 1111
];

// path 배열 (4개 'left'/'right') → 종착지 인덱스
export function pathToIndex(path) {
  return path.reduce((acc, dir) => acc * 2 + (dir === 'right' ? 1 : 0), 0);
}

// 종착지 인덱스 → 서식지 이름
export function getHabitat(path) {
  return FORK_TREE[pathToIndex(path)];
}

// 서식지에서 랜덤 포켓몬 ID 하나 반환 (이미 잡은 것 제외 시도)
export function pickPokemon(habitat, caught = []) {
  const pool = HABITAT_POKEMON[habitat] ?? HABITAT_POKEMON.grassland;
  const uncaught = pool.filter(id => !caught.includes(id));
  const src = uncaught.length > 0 ? uncaught : pool;
  return src[Math.floor(Math.random() * src.length)];
}

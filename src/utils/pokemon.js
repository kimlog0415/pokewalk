// 포켓몬 이름 반환 — names 객체, 구버전 nameKo, fallback name 순으로 시도
export function getPokemonName(pokemon, lang) {
  return pokemon?.names?.[lang] ?? pokemon?.nameKo ?? pokemon?.name ?? '';
}

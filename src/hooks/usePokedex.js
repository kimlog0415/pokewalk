import { useState } from 'react';

const KEY = 'pokedex';

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY)) ?? [];
    // 구버전 (숫자 배열) 마이그레이션
    if (data.length > 0 && typeof data[0] === 'number') {
      return data.map(id => ({ id, nameKo: `#${id}` }));
    }
    return data;
  } catch {
    return [];
  }
}

export function usePokedex() {
  const [pokedex, setPokedex] = useState(load);

  function catchPokemon({ id, nameKo }) {
    if (pokedex.some(p => p.id === id)) return;
    const next = [...pokedex, { id, nameKo }];
    setPokedex(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  function isDuplicate(id) {
    return pokedex.some(p => p.id === id);
  }

  return { pokedex, catchPokemon, isDuplicate };
}

import { useState } from 'react';

const KEY = 'pokedex';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

export function usePokedex() {
  const [pokedex, setPokedex] = useState(load);

  function catchPokemon(id) {
    if (pokedex.includes(id)) return;
    const next = [...pokedex, id];
    setPokedex(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  function isDuplicate(id) {
    return pokedex.includes(id);
  }

  return { pokedex, catchPokemon, isDuplicate };
}

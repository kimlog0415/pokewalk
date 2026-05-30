import { useState, useEffect } from 'react';

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

  // #id 형태의 임시 이름 → PokeAPI에서 한국어 이름 자동 갱신
  useEffect(() => {
    const needsName = pokedex.filter(p => p.nameKo?.startsWith('#'));
    if (needsName.length === 0) return;

    Promise.all(
      needsName.map(p =>
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${p.id}`)
          .then(r => r.json())
          .then(data => {
            const nameKo =
              data.names.find(n => n.language.name === 'ko')?.name ?? `#${p.id}`;
            return { id: p.id, nameKo };
          })
          .catch(() => ({ id: p.id, nameKo: `#${p.id}` }))
      )
    ).then(refreshed => {
      const map = Object.fromEntries(refreshed.map(r => [r.id, r.nameKo]));
      const next = pokedex.map(p => ({ ...p, nameKo: map[p.id] ?? p.nameKo }));
      setPokedex(next);
      localStorage.setItem(KEY, JSON.stringify(next));
    });
  }, []);

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

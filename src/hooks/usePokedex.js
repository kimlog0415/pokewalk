import { useState, useEffect } from 'react';

const KEY      = 'pokedex';
const SEEN_KEY = 'pokedex_seen';

function loadSeen() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY)) ?? []);
  } catch {
    return new Set();
  }
}

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY)) ?? [];
    if (data.length === 0) return data;
    // 구버전 [number] 마이그레이션
    if (typeof data[0] === 'number') {
      return data.map(id => ({ id, names: { ko: `#${id}`, ja: `#${id}`, en: `#${id}` } }));
    }
    // 중간 버전 { id, nameKo } 마이그레이션
    if ('nameKo' in data[0]) {
      return data.map(p => ({ id: p.id, names: { ko: p.nameKo, ja: `#${p.id}`, en: `#${p.id}` } }));
    }
    return data;
  } catch {
    return [];
  }
}

export function usePokedex() {
  const [pokedex, setPokedex] = useState(load);
  const [seenIds, setSeenIds] = useState(loadSeen);

  // 이름이 '#id' 형태인 항목 → PokeAPI에서 다국어 이름 자동 갱신
  useEffect(() => {
    const needsRefresh = pokedex.filter(
      p => !p.names || Object.values(p.names).some(n => n?.startsWith('#'))
    );
    if (needsRefresh.length === 0) return;

    Promise.all(
      needsRefresh.map(p =>
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${p.id}`)
          .then(r => r.json())
          .then(data => {
            const find = (lang) =>
              data.names.find(n => n.language.name === lang)?.name ?? `#${p.id}`;
            return { id: p.id, names: { ko: find('ko'), ja: find('ja'), en: find('en') } };
          })
          .catch(() => ({ id: p.id, names: p.names }))
      )
    ).then(refreshed => {
      const map = Object.fromEntries(refreshed.map(r => [r.id, r.names]));
      const next = pokedex.map(p => ({ ...p, names: map[p.id] ?? p.names }));
      setPokedex(next);
      localStorage.setItem(KEY, JSON.stringify(next));
    });
  }, []);

  function catchPokemon({ id, names }) {
    if (pokedex.some(p => p.id === id)) return;
    const next = [...pokedex, { id, names }];
    setPokedex(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  function isDuplicate(id) {
    return pokedex.some(p => p.id === id);
  }

  function markSeen(id) {
    if (seenIds.has(id)) return;
    const next = new Set(seenIds);
    next.add(id);
    setSeenIds(next);
    localStorage.setItem(SEEN_KEY, JSON.stringify([...next]));
  }

  function isNew(id) {
    return pokedex.some(p => p.id === id) && !seenIds.has(id);
  }

  return { pokedex, catchPokemon, isDuplicate, markSeen, isNew };
}

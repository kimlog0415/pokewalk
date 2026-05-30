import { useState, useEffect } from 'react';
import { useLang } from '../contexts/LangContext';
import { T } from '../data/translations';
import './HomeScene.css';

const TOTAL = 151;
const SPRITE_SMALL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
const SPRITE_ART   = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

export default function HomeScene({ pokedex, onStart }) {
  const lang = useLang();
  const t = T[lang];
  const [selected, setSelected] = useState(null);
  const count = pokedex.length;

  return (
    <div className="home-scene">
      <div className="home-header">
        <span className="home-title">{t.pokedex}</span>
        <span className="home-count">{count} / {TOTAL}</span>
      </div>

      <div className="pokedex-grid">
        {Array.from({ length: TOTAL }, (_, i) => i + 1).map(id => {
          const entry = pokedex.find(p => p.id === id);
          const caught = !!entry;
          const name = entry?.names?.[lang] ?? entry?.nameKo ?? '';
          return (
            <div
              key={id}
              className={`dex-slot ${caught ? 'caught' : 'empty'}`}
              onClick={() => caught && setSelected(entry)}
            >
              {caught && (
                <>
                  <img src={`${SPRITE_SMALL}${id}.png`} alt={name} draggable={false} />
                  <div className="dex-tooltip">{name}</div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <button className="btn-start" onClick={onStart}>{t.startAdventure}</button>

      {selected && (
        <PokemonCard entry={selected} lang={lang} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function PokemonCard({ entry, lang, onClose }) {
  const [flavor, setFlavor] = useState(null);
  const name = entry?.names?.[lang] ?? entry?.nameKo ?? '';

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${entry.id}`)
      .then(r => r.json())
      .then(data => {
        const langCode = lang === 'ja' ? 'ja' : lang;
        const found = data.flavor_text_entries.find(f => f.language.name === langCode);
        const fallback = data.flavor_text_entries.find(f => f.language.name === 'en');
        const raw = (found || fallback)?.flavor_text ?? '';
        setFlavor(raw.replace(/[\f\n\r]/g, ' ').replace(/\s+/g, ' ').trim());
      })
      .catch(() => setFlavor(''));
  }, [entry.id, lang]);

  return (
    <div className="card-overlay" onClick={onClose}>
      <div className="pokemon-card" onClick={e => e.stopPropagation()}>
        <button className="card-close" onClick={onClose}>✕</button>
        <div className="card-no">No.{String(entry.id).padStart(3, '0')}</div>
        <img className="card-img" src={`${SPRITE_ART}${entry.id}.png`} alt={name} />
        <div className="card-name">{name}</div>
        <p className="card-flavor">{flavor === null ? '...' : flavor}</p>
      </div>
    </div>
  );
}

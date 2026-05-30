import { useState, useEffect } from 'react';
import './HomeScene.css';

const TOTAL = 151;
const SPRITE_SMALL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
const SPRITE_ART   = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

export default function HomeScene({ pokedex, onStart }) {
  const [selected, setSelected] = useState(null);
  const count = pokedex.length;

  return (
    <div className="home-scene">
      <div className="home-header">
        <span className="home-title">도감</span>
        <span className="home-count">{count} / {TOTAL}</span>
      </div>

      <div className="pokedex-grid">
        {Array.from({ length: TOTAL }, (_, i) => i + 1).map(id => {
          const entry = pokedex.find(p => p.id === id);
          const caught = !!entry;
          return (
            <div
              key={id}
              className={`dex-slot ${caught ? 'caught' : 'empty'}`}
              onClick={() => caught && setSelected(entry)}
            >
              {caught && (
                <>
                  <img src={`${SPRITE_SMALL}${id}.png`} alt={entry.nameKo} draggable={false} />
                  <div className="dex-tooltip">{entry.nameKo}</div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <button className="btn-start" onClick={onStart}>탐험 시작</button>

      {selected && (
        <PokemonCard entry={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function PokemonCard({ entry, onClose }) {
  const [flavor, setFlavor] = useState(null);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${entry.id}`)
      .then(r => r.json())
      .then(data => {
        const koEntry = data.flavor_text_entries.find(f => f.language.name === 'ko');
        const enEntry = data.flavor_text_entries.find(f => f.language.name === 'en');
        const raw = (koEntry || enEntry)?.flavor_text ?? '';
        setFlavor(raw.replace(/[\f\n\r]/g, ' ').replace(/\s+/g, ' ').trim());
      })
      .catch(() => setFlavor(''));
  }, [entry.id]);

  return (
    <div className="card-overlay" onClick={onClose}>
      <div className="pokemon-card" onClick={e => e.stopPropagation()}>
        <button className="card-close" onClick={onClose}>✕</button>
        <div className="card-no">No.{String(entry.id).padStart(3, '0')}</div>
        <img
          className="card-img"
          src={`${SPRITE_ART}${entry.id}.png`}
          alt={entry.nameKo}
        />
        <div className="card-name">{entry.nameKo}</div>
        <p className="card-flavor">{flavor === null ? '...' : flavor}</p>
      </div>
    </div>
  );
}

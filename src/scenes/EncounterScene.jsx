import { useEffect, useState } from 'react';
import { pickPokemon } from '../data/habitats';
import './EncounterScene.css';

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

export default function EncounterScene({ habitat, onReady }) {
  const [pokemon, setPokemon] = useState(null);
  const [phase, setPhase] = useState('walk');

  useEffect(() => {
    const id = pickPokemon(habitat);

    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(r => r.json())
      .then(data => {
        setPokemon({
          id: data.id,
          name: data.name,
          sprite: `${SPRITE_BASE}${data.id}.png`,
        });
      })
      .catch(() => {
        setPokemon({ id, name: `#${id}`, sprite: `${SPRITE_BASE}${id}.png` });
      });

    const t = setTimeout(() => setPhase('reveal'), 2000);
    return () => clearTimeout(t);
  }, [habitat]);

  useEffect(() => {
    if (phase === 'reveal' && pokemon) {
      const t = setTimeout(() => onReady(pokemon), 800);
      return () => clearTimeout(t);
    }
  }, [phase, pokemon, onReady]);

  return (
    <div className="encounter-scene">
      <div className={`encounter-bg habitat-${habitat}`} />
      <div className={`char char-walk encounter-char${phase === 'walk' ? ' anim-walk-in' : ''}`} />
      {phase === 'reveal' && pokemon && (
        <div className="encounter-pokemon appear-anim">
          <img src={pokemon.sprite} alt={pokemon.name} width={64} height={64} />
        </div>
      )}
      <div className="encounter-dialog">
        {phase === 'walk'
          ? '풀숲을 헤치며...'
          : `야생 ${pokemon?.name ?? '???'}이(가) 나타났다!`}
      </div>
    </div>
  );
}

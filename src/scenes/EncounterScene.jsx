import { useEffect, useState } from 'react';
import { pickPokemon } from '../data/habitats';
import './EncounterScene.css';

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

const HABITAT_TEXT = {
  grassland:  '풀밭을 헤치며...',
  mountain:   '산길을 오르며...',
  forest:     '숲속을 헤치며...',
  urban:      '도시를 걷다...',
  water_edge: '물가를 걷다...',
  sea:        '파도를 헤치며...',
  cave:       '동굴 속을 걷다...',
};

export default function EncounterScene({ habitat, onReady }) {
  const [pokemon, setPokemon] = useState(null);
  const [phase, setPhase] = useState('walk');

  useEffect(() => {
    const id = pickPokemon(habitat);

    Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(r => r.json()),
    ])
      .then(([pokeData, speciesData]) => {
        const nameKo =
          speciesData.names.find(n => n.language.name === 'ko')?.name ?? pokeData.name;
        setPokemon({
          id: pokeData.id,
          name: nameKo,
          sprite: `${SPRITE_BASE}${pokeData.id}.png`,
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

  const walkText = HABITAT_TEXT[habitat] ?? '풀숲을 헤치며...';

  return (
    <div className="encounter-scene">
      <div className={`encounter-bg habitat-${habitat}`} />
      <div className={`char char-walk encounter-char${phase === 'walk' ? ' anim-walk-in' : ''}`} />
      {phase === 'reveal' && pokemon && (
        <div className="encounter-pokemon appear-anim">
          <img src={pokemon.sprite} alt={pokemon.name} width={96} height={96} />
        </div>
      )}
      <div className="encounter-dialog">
        {phase === 'walk'
          ? walkText
          : `야생 ${pokemon?.name ?? '???'}이(가) 나타났다!`}
      </div>
    </div>
  );
}

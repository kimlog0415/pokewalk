import './HomeScene.css';

const TOTAL = 151;
const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

export default function HomeScene({ pokedex, onStart }) {
  const count = pokedex.length;

  return (
    <div className="home-scene">
      <div className="home-header">
        <span className="home-title">도감</span>
        <span className="home-count">{count} / {TOTAL}</span>
      </div>

      <div className="pokedex-grid">
        {Array.from({ length: TOTAL }, (_, i) => i + 1).map(id => {
          const caught = pokedex.includes(id);
          return (
            <div key={id} className={`dex-slot ${caught ? 'caught' : 'empty'}`}>
              {caught && (
                <img
                  src={`${SPRITE_BASE}${id}.png`}
                  alt={`#${id}`}
                  width={24}
                  height={24}
                />
              )}
            </div>
          );
        })}
      </div>

      <button className="btn-start" onClick={onStart}>탐험 시작</button>
    </div>
  );
}

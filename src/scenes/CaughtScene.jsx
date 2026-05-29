import { useEffect } from 'react';
import './CaughtScene.css';

export default function CaughtScene({ pokemon, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 5000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="caught-scene">
      <div className="caught-flash" />
      {pokemon && (
        <>
          <div className="caught-pokemon sparkle-anim">
            <img src={pokemon.sprite} alt={pokemon.name} width={80} height={80} />
          </div>
          <div className="caught-dialog">
            <p>{pokemon.name} 을(를) 잡았다!</p>
          </div>
        </>
      )}
    </div>
  );
}

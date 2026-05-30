import { useEffect } from 'react';
import './DuplicateScene.css';

export default function DuplicateScene({ pokemon, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 5000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="duplicate-scene">
      <div className="duplicate-bg" />
      <div className="char char-walk-back anim-walk-out duplicate-char" />
      {pokemon && (
        <div className="duplicate-pokemon faded">
          <img src={pokemon.sprite} alt={pokemon.name} width={64} height={64} />
        </div>
      )}
      <div className="duplicate-dialog">이미 있는 포켓몬이야!</div>
    </div>
  );
}

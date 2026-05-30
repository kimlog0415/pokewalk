import { useEffect, useState } from 'react';
import './DuplicateScene.css';

export default function DuplicateScene({ pokemon, onDone }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setGone(true), 3000);
    const t2 = setTimeout(onDone, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className="duplicate-scene">
      <div className="bg-scroll-reverse duplicate-bg" />
      {!gone && <div className="char char-walk-back anim-walk duplicate-char" />}
      {pokemon && (
        <div className="duplicate-pokemon faded">
          <img src={pokemon.sprite} alt={pokemon.name} width={64} height={64} />
        </div>
      )}
      <div className="duplicate-dialog">이미 있는 포켓몬이야!</div>
    </div>
  );
}

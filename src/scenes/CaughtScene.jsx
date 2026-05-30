import { useEffect } from 'react';
import { useLang } from '../contexts/LangContext';
import { T } from '../data/translations';
import { flipStyle } from '../data/faceRight';
import './CaughtScene.css';

export default function CaughtScene({ pokemon, onDone }) {
  const lang = useLang();
  const t = T[lang];
  const name = pokemon?.names?.[lang] ?? pokemon?.name;

  useEffect(() => {
    const timer = setTimeout(onDone, 5000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="caught-scene">
      <div className="caught-flash" />
      {pokemon && (
        <>
          <div className="caught-pokemon sparkle-anim">
            <img src={pokemon.sprite} alt={name} width={100} height={100} style={flipStyle(pokemon.id)} />
          </div>
          <div className="caught-dialog">
            <p>{t.caught(name)}</p>
          </div>
        </>
      )}
    </div>
  );
}

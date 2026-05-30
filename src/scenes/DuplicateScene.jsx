import { useEffect } from 'react';
import { useLang } from '../contexts/LangContext';
import { T } from '../data/translations';
import { flipStyle } from '../data/faceRight';
import './DuplicateScene.css';

export default function DuplicateScene({ pokemon, habitat, onDone }) {
  const lang = useLang();
  const t = T[lang];
  const name = pokemon?.names?.[lang] ?? pokemon?.name;

  useEffect(() => {
    const timer = setTimeout(onDone, 5000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="duplicate-scene">
      <div className={`duplicate-bg habitat-${habitat ?? 'grassland'}`} />
      <div className="char char-walk-back anim-walk-out duplicate-char" />
      {pokemon && (
        <div className="duplicate-pokemon faded">
          <img src={pokemon.sprite} alt={name} className="field-pokemon-img" style={flipStyle(pokemon.id)} />
        </div>
      )}
      <div className="duplicate-dialog">{t.alreadyHave}</div>
    </div>
  );
}

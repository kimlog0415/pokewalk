import { useLang } from '../contexts/LangContext';
import { T } from '../data/translations';
import { flipStyle } from '../data/faceRight';
import { playDuplicate } from '../utils/sfx';
import { getPokemonName } from '../utils/pokemon';
import { useSceneExit } from '../hooks/useSceneExit';
import { DEFAULT_HABITAT } from '../utils/constants';
import './DuplicateScene.css';

export default function DuplicateScene({ pokemon, habitat, onDone }) {
  const lang = useLang();
  const t = T[lang];
  const name = getPokemonName(pokemon, lang);

  useSceneExit(playDuplicate, onDone);

  return (
    <div className="duplicate-scene">
      <div className={`duplicate-bg habitat-${habitat ?? DEFAULT_HABITAT}`} />
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

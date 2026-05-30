import { useLang } from '../contexts/LangContext';
import { T } from '../data/translations';
import './BattleScene.css';

export default function BattleScene({ pokemon, round }) {
  const lang = useLang();
  const t = T[lang];
  const name = pokemon?.names?.[lang] ?? pokemon?.name;

  return (
    <div className="battle-scene">
      <div className="battle-bg" />
      <div className="char char-walk battle-char" />
      {pokemon && (
        <div className="battle-pokemon">
          <img src={pokemon.sprite} alt={name} width={200} height={200} />
          <div className="battle-pokemon-name">{name}</div>
        </div>
      )}
      <div className="battle-dialog">
        {round === 0 ? t.rps : t.retry(round)}
      </div>
    </div>
  );
}

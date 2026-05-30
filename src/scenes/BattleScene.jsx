import { useLang } from "../contexts/LangContext";
import { T } from "../data/translations";
import { flipStyle } from "../data/faceRight";
import "./BattleScene.css";

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
          <img src={pokemon.sprite} alt={name} width={150} height={150} style={flipStyle(pokemon.id)} />
          <div className="battle-pokemon-name">{name}</div>
        </div>
      )}
      <div className="battle-dialog">
        {round === 0 ? t.rps : t.retry(round)}
      </div>
    </div>
  );
}

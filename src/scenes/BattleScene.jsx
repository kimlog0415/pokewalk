import { useLang } from "../contexts/LangContext";
import { T } from "../data/translations";
import { flipStyle } from "../data/faceRight";
import { RPS_EMOJI } from "../utils/rps";
import { getPokemonName } from "../utils/pokemon";
import "./BattleScene.css";

export default function BattleScene({ pokemon, round, reveal }) {
  const lang = useLang();
  const t = T[lang];
  const name = getPokemonName(pokemon, lang);

  const resultText =
    reveal?.result === "win"
      ? t.rpsWin
      : reveal?.result === "lose"
        ? t.rpsLose
        : t.rpsDraw;

  return (
    <div className="battle-scene">
      <div className="battle-bg" />
      <div className="char char-walk battle-char" />
      {pokemon && (
        <div className="battle-pokemon">
          <img
            src={pokemon.sprite}
            alt={name}
            width={150}
            height={150}
            style={flipStyle(pokemon.id)}
          />
          <div className="battle-pokemon-name">{name}</div>
        </div>
      )}

      {reveal && (
        <div className="rps-reveal">
          <div className="rps-side">
            <span className="rps-label">{t.me}</span>
            <span className="rps-hand">{RPS_EMOJI[reveal.player]}</span>
          </div>
          <span className="rps-vs">VS</span>
          <div className="rps-side">
            <span className="rps-label">{t.opponent}</span>
            <span className="rps-hand">{RPS_EMOJI[reveal.cpu]}</span>
          </div>
        </div>
      )}

      <div
        className={`battle-dialog${reveal ? ` result-${reveal.result}` : ""}`}
      >
        {reveal ? resultText : round === 0 ? t.rps : t.retry(round + 1)}
      </div>
    </div>
  );
}

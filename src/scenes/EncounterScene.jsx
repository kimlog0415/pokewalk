import { useEffect, useState } from "react";
import { pickPokemon } from "../data/habitats";
import { useLang } from "../contexts/LangContext";
import { T } from "../data/translations";
import { flipStyle } from "../data/faceRight";
import { playEncounter } from "../utils/sfx";
import { getPokemonName } from "../utils/pokemon";
import { SPRITE_ART, TIMINGS } from "../utils/constants";
import "./EncounterScene.css";

export default function EncounterScene({ habitat, onReady }) {
  const lang = useLang();
  const t = T[lang];
  const [pokemon, setPokemon] = useState(null);
  const [phase, setPhase] = useState("walk");

  useEffect(() => {
    const id = pickPokemon(habitat);

    Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((r) => r.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((r) =>
        r.json(),
      ),
    ])
      .then(([pokeData, speciesData]) => {
        const find = (l) =>
          speciesData.names.find((n) => n.language.name === l)?.name ??
          pokeData.name;
        setPokemon({
          id: pokeData.id,
          names: { ko: find("ko"), ja: find("ja"), en: find("en") },
          sprite: `${SPRITE_ART}${pokeData.id}.png`,
        });
      })
      .catch(() => {
        setPokemon({
          id,
          names: { ko: `#${id}`, ja: `#${id}`, en: `#${id}` },
          sprite: `${SPRITE_ART}${id}.png`,
        });
      });

    const timer = setTimeout(() => setPhase("reveal"), TIMINGS.WALK_IN);
    return () => clearTimeout(timer);
  }, [habitat]);

  useEffect(() => {
    if (phase === "reveal" && pokemon) {
      playEncounter();
      const timer = setTimeout(() => onReady(pokemon), TIMINGS.ENCOUNTER_REVEAL);
      return () => clearTimeout(timer);
    }
  }, [phase, pokemon, onReady]);

  const walkText = t.habitat[habitat] ?? t.exploring;
  const name = getPokemonName(pokemon, lang) || "???";

  return (
    <div className="encounter-scene">
      <div className={`encounter-bg habitat-${habitat}`} />
      <div
        className={`char char-walk encounter-char${phase === "walk" ? " anim-walk-in" : ""}`}
      />
      {phase === "reveal" && pokemon && (
        <div className="encounter-pokemon appear-anim">
          <img
            src={pokemon.sprite}
            alt={name}
            className="field-pokemon-img"
            style={flipStyle(pokemon.id)}
          />
        </div>
      )}
      <div className="encounter-dialog">
        {phase === "walk" ? walkText : t.appeared(name)}
      </div>
    </div>
  );
}

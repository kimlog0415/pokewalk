import { useState, useEffect, useRef } from 'react';
import charFrontUrl from '../assets/sprites/char_front.png';
import { useLang } from '../contexts/LangContext';
import { T } from '../data/translations';
import { flipStyle } from '../data/faceRight';
import './HomeScene.css';

const TOTAL = 151;
const SPRITE_SMALL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
const SPRITE_ART   = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

// bg_home.png (3168×1344), scale = 285/1344 ≈ 0.212
// 원본 좌표 277px → ~59px, 1449px → ~307px (화면 기준)
const LEFT_BOUND  = 59;
const RIGHT_BOUND = 307;
const WALK_SPEED  = 50;  // px/s
const WALK_TICK   = 50;  // ms
const PX_PER_TICK = (WALK_SPEED * WALK_TICK) / 1000; // 2.5px/tick

export default function HomeScene({ pokedex, phase, onQuestion, onDone }) {
  const lang = useLang();
  const t = T[lang];
  const count = pokedex.length;

  const [charX, setCharX]       = useState(LEFT_BOUND);
  const [dirRight, setDirRight] = useState(true);
  const [showPokedex, setShowPokedex] = useState(false);
  const [selected, setSelected] = useState(null);

  const charXRef = useRef(LEFT_BOUND);
  const dirRef   = useRef(true);

  // 걷기 루프: phase가 'walking'일 때만 동작
  useEffect(() => {
    if (phase !== 'walking') return;

    const moveInterval = setInterval(() => {
      const dx = dirRef.current ? PX_PER_TICK : -PX_PER_TICK;
      let newX = charXRef.current + dx;
      if (newX >= RIGHT_BOUND) {
        newX = RIGHT_BOUND;
        dirRef.current = false;
        setDirRight(false);
      } else if (newX <= LEFT_BOUND) {
        newX = LEFT_BOUND;
        dirRef.current = true;
        setDirRight(true);
      }
      charXRef.current = newX;
      setCharX(newX);
    }, WALK_TICK);

    const promptTimer = setTimeout(onQuestion, 5000);

    return () => {
      clearInterval(moveInterval);
      clearTimeout(promptTimer);
    };
  }, [phase, onQuestion]);

  // 퇴장 애니메이션 후 travel로 전환
  useEffect(() => {
    if (phase !== 'exit') return;
    const timer = setTimeout(onDone, 1500);
    return () => clearTimeout(timer);
  }, [phase, onDone]);

  const charClass = (() => {
    if (phase === 'exit')    return 'char char-walk anim-walk anim-walk-out-right home-char';
    if (phase === 'walking') return `char ${dirRight ? 'char-walk' : 'char-walk-back'} anim-walk home-char`;
    return null; // question: <img> 사용
  })();

  return (
    <div className="home-scene">
      <div className="home-bg" />

      {phase === 'question' ? (
        <img
          className="home-char-front"
          src={charFrontUrl}
          alt=""
          style={{ left: charX }}
        />
      ) : (
        <div className={charClass} style={{ left: charX }} />
      )}

      <div className="home-dialog">
        {phase === 'question' ? t.homePrompt : t.exploring}
      </div>

      <button className="home-dex-btn" onClick={() => setShowPokedex(true)}>
        {t.pokedex} {count}/{TOTAL}
      </button>

      {showPokedex && (
        <div className="pokedex-overlay">
          <div className="pokedex-header">
            <span className="home-title">{t.pokedex}</span>
            <span className="home-count">{count} / {TOTAL}</span>
            <button className="card-close" onClick={() => setShowPokedex(false)}>✕</button>
          </div>
          <div className="pokedex-grid">
            {Array.from({ length: TOTAL }, (_, i) => i + 1).map(id => {
              const entry = pokedex.find(p => p.id === id);
              const caught = !!entry;
              const name = entry?.names?.[lang] ?? entry?.nameKo ?? '';
              return (
                <div
                  key={id}
                  className={`dex-slot ${caught ? 'caught' : 'empty'}`}
                  onClick={() => caught && setSelected(entry)}
                >
                  {caught && (
                    <>
                      <img src={`${SPRITE_SMALL}${id}.png`} alt={name} draggable={false} />
                      <div className="dex-tooltip">{name}</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selected && (
        <PokemonCard entry={selected} lang={lang} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function PokemonCard({ entry, lang, onClose }) {
  const [flavor, setFlavor] = useState(null);
  const name = entry?.names?.[lang] ?? entry?.nameKo ?? '';

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${entry.id}`)
      .then(r => r.json())
      .then(data => {
        const langCode = lang === 'ja' ? 'ja' : lang;
        const found    = data.flavor_text_entries.find(f => f.language.name === langCode);
        const fallback = data.flavor_text_entries.find(f => f.language.name === 'en');
        const raw = (found || fallback)?.flavor_text ?? '';
        setFlavor(raw.replace(/[\f\n\r]/g, ' ').replace(/\s+/g, ' ').trim());
      })
      .catch(() => setFlavor(''));
  }, [entry.id, lang]);

  return (
    <div className="card-overlay" onClick={onClose}>
      <div className="pokemon-card" onClick={e => e.stopPropagation()}>
        <button className="card-close" onClick={onClose}>✕</button>
        <div className="card-no">No.{String(entry.id).padStart(3, '0')}</div>
        <img className="card-img" src={`${SPRITE_ART}${entry.id}.png`} alt={name} style={flipStyle(entry.id)} />
        <div className="card-name">{name}</div>
        <p className="card-flavor">{flavor === null ? '...' : flavor}</p>
      </div>
    </div>
  );
}

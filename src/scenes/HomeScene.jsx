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
const WALK_SPEED  = 80; // px/s

export default function HomeScene({ pokedex, phase, onQuestion, onStay, onDone }) {
  const lang = useLang();
  const t = T[lang];
  const count = pokedex.length;

  const [dirRight, setDirRight] = useState(true);
  const [showPokedex, setShowPokedex] = useState(false);
  const [selected, setSelected] = useState(null);

  const charRef   = useRef(null);
  const rafRef    = useRef(null);
  const lastTsRef = useRef(null);
  const charXRef  = useRef(LEFT_BOUND); // float 누산용
  const dirRef    = useRef(true);

  // RAF 기반 걷기 루프 — 도감 열려있으면 타이머/RAF 정지
  useEffect(() => {
    if (phase !== 'walking' || showPokedex) return;
    lastTsRef.current = null;

    const tick = (ts) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(ts - lastTsRef.current, 50); // 탭 숨김 등 big-jump 방지
      lastTsRef.current = ts;

      charXRef.current += (WALK_SPEED * dt / 1000) * (dirRef.current ? 1 : -1);

      if (charXRef.current >= RIGHT_BOUND) {
        charXRef.current = RIGHT_BOUND;
        if (dirRef.current) { dirRef.current = false; setDirRight(false); }
      } else if (charXRef.current <= LEFT_BOUND) {
        charXRef.current = LEFT_BOUND;
        if (!dirRef.current) { dirRef.current = true; setDirRight(true); }
      }

      if (charRef.current) {
        charRef.current.style.left = `${Math.round(charXRef.current)}px`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    const promptTimer = setTimeout(onQuestion, 5000);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(promptTimer);
    };
  }, [phase, onQuestion, showPokedex]); // 도감 열릴 때 타이머 중단, 닫힐 때 재시작

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
          style={{ left: Math.round(charXRef.current) }}
        />
      ) : (
        <div
          ref={charRef}
          className={charClass}
          style={{ left: Math.round(charXRef.current) }}
        />
      )}

      {phase === 'question' && (
        <div className="home-dialog">{t.homePrompt}</div>
      )}

      <button className="home-dex-btn" onClick={() => { if (phase === 'question') onStay(); setShowPokedex(true); }}>
        {t.pokedex} {count}/{TOTAL}
      </button>

      {showPokedex && (
        <div className="pokedex-overlay">
          <div className="pokedex-header">
            <span className="home-title">{t.pokedex}</span>
            <span className="home-count">{count} / {TOTAL}</span>
            <button className="pokedex-close" onClick={() => setShowPokedex(false)}>✕</button>
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

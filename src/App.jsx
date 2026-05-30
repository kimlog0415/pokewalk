import { useState, useCallback, useEffect, useRef } from 'react';
import { usePokedex } from './hooks/usePokedex';
import { useAutoTimer } from './hooks/useAutoTimer';
import { getHabitat } from './data/habitats';
import { LangContext, useLang } from './contexts/LangContext';
import { T } from './data/translations';

import HomeScene from './scenes/HomeScene';
import TravelScene from './scenes/TravelScene';
import ForkScene from './scenes/ForkScene';
import EncounterScene from './scenes/EncounterScene';
import BattleScene from './scenes/BattleScene';
import CaughtScene from './scenes/CaughtScene';
import FleeScene from './scenes/FleeScene';
import DuplicateScene from './scenes/DuplicateScene';

const RPS_KEYS = ['scissors', 'rock', 'paper'];

function rpsResult(player, cpu) {
  if (player === cpu) return 'draw';
  if (
    (player === 'scissors' && cpu === 'paper') ||
    (player === 'rock'    && cpu === 'scissors') ||
    (player === 'paper'   && cpu === 'rock')
  ) return 'win';
  return 'lose';
}

function randomRps() {
  return RPS_KEYS[Math.floor(Math.random() * 3)];
}

const DEV_POKEMON = {
  id: 25,
  names: { ko: '피카츄', ja: 'ピカチュウ', en: 'Pikachu' },
  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
};

const DEV_SCENES = {
  battle:    { scene: 'battle',    currentPokemon: DEV_POKEMON, battleRound: 0 },
  caught:    { scene: 'caught',    currentPokemon: DEV_POKEMON },
  flee:      { scene: 'flee' },
  duplicate: { scene: 'duplicate', currentPokemon: DEV_POKEMON },
  encounter: { scene: 'encounter', currentHabitat: 'grassland' },
  fork:      { scene: 'fork',      path: [] },
  travel:    { scene: 'travel' },
};

function getInitialState() {
  const p = new URLSearchParams(window.location.search).get('scene');
  const base = { path: [], currentHabitat: null, currentPokemon: null, battleRound: 0 };
  return { ...base, ...(DEV_SCENES[p] ?? { scene: 'home' }) };
}

const LANG_PACKS = [
  { id: 'ko', label: '한국어', color: '#b52a2a' },
  { id: 'ja', label: '日本語', color: '#1e56a8' },
  { id: 'en', label: 'English', color: '#a07a00' },
];

export default function App() {
  const [lang, setLang] = useState('ko');
  const [state, setState] = useState(getInitialState);
  const [forkPhase, setForkPhase] = useState('walking');
  const { pokedex, catchPokemon, isDuplicate } = usePokedex();

  const go = useCallback((nextScene, patch = {}) => {
    setState(s => ({ ...s, scene: nextScene, ...patch }));
  }, []);

  function startAdventure() {
    go('travel', { path: [], currentHabitat: null, currentPokemon: null, battleRound: 0 });
  }

  function onTravelDone() {
    setForkPhase('walking');
    go('fork');
  }

  function onForkArrived() {
    setForkPhase('arrived');
  }

  function onForkChoice(dir) {
    const newPath = [...state.path, dir];
    if (newPath.length < 4) {
      setForkPhase('walking');
      setState(s => ({ ...s, path: newPath }));
    } else {
      go('encounter', { path: newPath, currentHabitat: getHabitat(newPath) });
    }
  }

  function onEncounterReady(pokemon) {
    if (isDuplicate(pokemon.id)) {
      go('duplicate', { currentPokemon: pokemon });
    } else {
      go('battle', { currentPokemon: pokemon, battleRound: 0 });
    }
  }

  function onBattleResult(result) {
    if (result === 'win') {
      catchPokemon({ id: state.currentPokemon.id, names: state.currentPokemon.names });
      go('caught');
    } else if (result === 'lose') {
      go('flee');
    } else {
      go('battle', { battleRound: state.battleRound + 1 });
    }
  }

  function goHome() { go('home'); }

  return (
    <LangContext.Provider value={lang}>
      <div className="game-container">
        {/* 언어 게임팩 */}
        <div className="lang-packs">
          {LANG_PACKS.map(lp => (
            <button
              key={lp.id}
              className={`lang-pack${lang === lp.id ? ' active' : ''}`}
              style={{ '--pack-color': lp.color }}
              onClick={() => setLang(lp.id)}
            >
              {lp.label}
            </button>
          ))}
        </div>

        <div className="gameboy">
          <div className="screen-surround">
            <div className="screen-label">PokeWalk</div>
            <div className="screen">
              {state.scene === 'home'      && <HomeScene pokedex={pokedex} onStart={startAdventure} />}
              {state.scene === 'travel'    && <TravelScene onDone={onTravelDone} />}
              {state.scene === 'fork'      && <ForkScene step={state.path.length} phase={forkPhase} onArrived={onForkArrived} />}
              {state.scene === 'encounter' && <EncounterScene habitat={state.currentHabitat} onReady={onEncounterReady} />}
              {state.scene === 'battle'    && <BattleScene pokemon={state.currentPokemon} round={state.battleRound} />}
              {state.scene === 'caught'    && <CaughtScene pokemon={state.currentPokemon} onDone={goHome} />}
              {state.scene === 'flee'      && <FleeScene onDone={goHome} />}
              {state.scene === 'duplicate' && <DuplicateScene pokemon={state.currentPokemon} onDone={goHome} />}
            </div>
          </div>

          <div className="controls">
            <div className="dpad" />
            <div className="choice-buttons">
              {state.scene === 'fork' && forkPhase === 'arrived' && (
                <ForkButtons onChoice={onForkChoice} />
              )}
              {state.scene === 'battle' && (
                <BattleButtons onResult={onBattleResult} round={state.battleRound} />
              )}
            </div>
            <div className="action-buttons">
              <button className="btn-action btn-a">A</button>
              <button className="btn-action btn-b">B</button>
            </div>
          </div>

          <div className="start-select">
            <button className="btn-small">SELECT</button>
            <button className="btn-small">START</button>
          </div>
        </div>
      </div>
    </LangContext.Provider>
  );
}

function ForkButtons({ onChoice }) {
  const t = T[useLang()];
  const [flash, setFlash] = useState(null);
  const pendingRef = useRef(null);

  useEffect(() => () => clearTimeout(pendingRef.current), []);

  const ratio = useAutoTimer(3, () => {
    const dir = Math.random() < 0.5 ? 'left' : 'right';
    setFlash(dir);
    pendingRef.current = setTimeout(() => onChoice(dir), 500);
  });

  return (
    <>
      <button className={`btn-choice${flash === 'left'  ? ' highlighted' : ''}`} onClick={() => onChoice('left')}>{t.here}</button>
      <button className={`btn-choice${flash === 'right' ? ' highlighted' : ''}`} onClick={() => onChoice('right')}>{t.there}</button>
      <div className="timer-bar-wrap">
        <div className="timer-bar" style={{ width: `${ratio * 100}%` }} />
      </div>
    </>
  );
}

function BattleButtons({ onResult, round }) {
  const t = T[useLang()];
  const RPS_LABELS = [t.scissors, t.rock, t.paper];
  const [flash, setFlash] = useState(null);
  const pendingRef = useRef(null);

  useEffect(() => () => clearTimeout(pendingRef.current), []);

  const ratio = useAutoTimer(3, () => {
    const player = randomRps();
    setFlash(player);
    pendingRef.current = setTimeout(() => onResult(rpsResult(player, randomRps())), 500);
  }, true, round);

  function choose(key) { onResult(rpsResult(key, randomRps())); }

  return (
    <>
      {RPS_KEYS.map((key, i) => (
        <button
          key={key}
          className={`btn-choice${flash === key ? ' highlighted' : ''}`}
          onClick={() => choose(key)}
        >
          {RPS_LABELS[i]}
        </button>
      ))}
      <div className="timer-bar-wrap">
        <div className="timer-bar" style={{ width: `${ratio * 100}%` }} />
      </div>
    </>
  );
}

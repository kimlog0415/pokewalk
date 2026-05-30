import { useState, useCallback, useEffect, useRef } from 'react';
import charFrontUrl from './assets/sprites/char_front.png';
import bgGrassland  from './assets/backgrounds/bg_grassland.png';
import bgMountain   from './assets/backgrounds/bg_mountain.png';
import bgForest     from './assets/backgrounds/bg_forest.png';
import bgUrban      from './assets/backgrounds/bg_urban.png';
import bgWaterEdge  from './assets/backgrounds/bg_water_edge.png';
import bgSea        from './assets/backgrounds/bg_sea.png';
import bgCave       from './assets/backgrounds/bg_cave.png';

// 앱 로드 시 서식지 배경 전체 preload (encounter 진입 시 빈 화면 방지)
[bgGrassland, bgMountain, bgForest, bgUrban, bgWaterEdge, bgSea, bgCave].forEach(src => {
  const img = new Image();
  img.src = src;
});
import { usePokedex } from './hooks/usePokedex';
import { useAutoTimer } from './hooks/useAutoTimer';
import { useBgm } from './hooks/useBgm';
import { playClick, playWin, playLose, playBattlePending } from './utils/sfx';
import { RPS_KEYS, rpsResult, randomRps } from './utils/rps';
import { TIMINGS, AUTO_SELECT_SECONDS } from './utils/constants';
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


function getInitialState() {
  return { scene: 'home', path: [], currentHabitat: null, currentPokemon: null, battleRound: 0 };
}

const LANG_PACKS = [
  { id: 'ko', label: '한국어', color: '#b52a2a' },
  { id: 'ja', label: '日本語', color: '#1e56a8' },
  { id: 'en', label: 'English', color: '#a07a00' },
];

export default function App() {
  const [lang, setLang] = useState('ko');
  const [state, setState] = useState(getInitialState);
  const [homePhase, setHomePhase] = useState('walking');
  const [forkPhase, setForkPhase] = useState('walking');
  const [battleReveal, setBattleReveal] = useState(null); // { player, cpu, result }
  const [battlePending, setBattlePending] = useState(false);
  const [fading, setFading] = useState(false);
  const [started, setStarted] = useState(false);
  const [startFading, setStartFading] = useState(false);
  const revealTimerRef = useRef(null);
  const fadingRef = useRef(false);
  const { pokedex, catchPokemon, isDuplicate, markSeen, isNew } = usePokedex();
  useBgm(state.scene);

  const go = useCallback((nextScene, patch = {}) => {
    setState(s => ({ ...s, scene: nextScene, ...patch }));
  }, []);

  // 검은 오버레이 페이드: 페인트 확인 후 250ms 암전 → 씬 변경 → 페이드아웃
  const withFade = useCallback((callback) => {
    if (fadingRef.current) return;
    fadingRef.current = true;
    setFading(true);
    // 더블 RAF: React 렌더 + 브라우저 페인트 완료 후 타이머 시작 (Edge 등 대응)
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setTimeout(() => {
        callback();
        setTimeout(() => {
          fadingRef.current = false;
          setFading(false);
        }, TIMINGS.FADE_HOLD);
      }, TIMINGS.FADE_DURATION);
    }));
  }, []);

  function handleStart() {
    setStartFading(true);
    setTimeout(() => setStarted(true), TIMINGS.START_FADE);
  }

  const onHomeQuestion = useCallback(() => setHomePhase('question'), []);
  const onHomeGoOut    = useCallback(() => setHomePhase('exit'), []);
  const onHomeStay     = useCallback(() => setHomePhase('walking'), []);

  const startAdventure = useCallback(() => {
    withFade(() => go('travel', { path: [], currentHabitat: null, currentPokemon: null, battleRound: 0 }));
  }, [go, withFade]);

  function onTravelDone() {
    withFade(() => { setForkPhase('walking'); go('fork'); });
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
      setForkPhase('walking'); // 버튼 즉시 숨김
      withFade(() => go('encounter', { path: newPath, currentHabitat: getHabitat(newPath) }));
    }
  }

  function onEncounterReady(pokemon) {
    if (isDuplicate(pokemon.id)) {
      go('duplicate', { currentPokemon: pokemon });
    } else {
      go('battle', { currentPokemon: pokemon, battleRound: 0 });
    }
  }

  // 가위바위보: 선택 → 1s pending → reveal → 1.5s 후 씬 전환
  function onBattlePlay(player, cpu) {
    setBattlePending(true);
    playBattlePending();
    revealTimerRef.current = setTimeout(() => {
      const result = rpsResult(player, cpu);
      if (result === 'win') playWin();
      else if (result === 'lose') playLose();
      setBattlePending(false);
      setBattleReveal({ player, cpu, result });
      revealTimerRef.current = setTimeout(() => {
        setBattleReveal(null);
        if (result === 'win') {
          catchPokemon({ id: state.currentPokemon.id, names: state.currentPokemon.names });
          go('caught');
        } else if (result === 'lose') {
          go('flee');
        } else {
          setBattlePending(false);
          go('battle', { battleRound: state.battleRound + 1 });
        }
      }, TIMINGS.BATTLE_REVEAL);
    }, TIMINGS.BATTLE_PENDING);
  }

  useEffect(() => () => clearTimeout(revealTimerRef.current), []);

  function goHome() {
    withFade(() => { setHomePhase('walking'); go('home'); });
  }

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
              onClick={() => { playClick(); setLang(lp.id); }}
            >
              {lp.label}
            </button>
          ))}
        </div>

        <div className="gameboy">
          <div className="screen-surround">
            <div className="screen-label">PokeWalk</div>
            <div className="screen">
              {state.scene === 'home'      && <HomeScene pokedex={pokedex} phase={homePhase} onQuestion={started ? onHomeQuestion : () => {}} onStay={onHomeStay} onDone={startAdventure} markSeen={markSeen} isNew={isNew} />}
              {state.scene === 'travel'    && <TravelScene onDone={onTravelDone} />}
              {state.scene === 'fork'      && <ForkScene step={state.path.length} phase={forkPhase} onArrived={onForkArrived} />}
              {state.scene === 'encounter' && <EncounterScene habitat={state.currentHabitat} onReady={onEncounterReady} />}
              {state.scene === 'battle'    && <BattleScene pokemon={state.currentPokemon} round={state.battleRound} reveal={battleReveal} />}
              {state.scene === 'caught'    && <CaughtScene pokemon={state.currentPokemon} onDone={goHome} />}
              {state.scene === 'flee'      && <FleeScene habitat={state.currentHabitat} onDone={goHome} />}
              {state.scene === 'duplicate' && <DuplicateScene pokemon={state.currentPokemon} habitat={state.currentHabitat} onDone={goHome} />}
              <div className={`screen-fade${fading ? ' active' : ''}`} />
              {!started && (
                <div
                  className={`start-overlay${startFading ? ' fading' : ''}`}
                  onClick={() => { playClick(); handleStart(); }}
                >
                  <div className="start-title">PokeWalk</div>
                  <img className="start-char" src={charFrontUrl} alt="" />
                  <div className="start-prompt">PRESS START</div>
                </div>
              )}
            </div>
          </div>

          <div className="controls">
            <div className="dpad" />
            <div className="choice-buttons">
              {state.scene === 'home' && homePhase === 'question' && (
                <HomeButtons onGoOut={onHomeGoOut} onStay={onHomeStay} />
              )}
              {state.scene === 'fork' && forkPhase === 'arrived' && (
                <ForkButtons onChoice={onForkChoice} />
              )}
              {state.scene === 'battle' && !battleReveal && !battlePending && (
                <BattleButtons onPlay={onBattlePlay} round={state.battleRound} />
              )}
            </div>
            <div className="action-buttons">
              <button className="btn-action btn-a">A</button>
              <button className="btn-action btn-b">B</button>
            </div>
          </div>

          <div className="start-select">
            <button className="btn-small">SELECT</button>
            <button className={`btn-small${!started ? ' btn-small-active' : ''}`} onClick={!started ? () => { playClick(); handleStart(); } : undefined}>START</button>
          </div>
        </div>
      </div>
    </LangContext.Provider>
  );
}

function HomeButtons({ onGoOut, onStay }) {
  const t = T[useLang()];
  const [flash, setFlash] = useState(null);
  const pendingRef = useRef(null);

  useEffect(() => () => clearTimeout(pendingRef.current), []);

  // 초과 시 랜덤 선택
  const ratio = useAutoTimer(AUTO_SELECT_SECONDS, () => {
    const choice = Math.random() < 0.5 ? 'out' : 'stay';
    setFlash(choice);
    pendingRef.current = setTimeout(choice === 'out' ? onGoOut : onStay, TIMINGS.FLASH_DELAY);
  });

  return (
    <>
      <button
        className={`btn-choice${flash === 'out' ? ' highlighted' : ''}`}
        onClick={() => { playClick(); onGoOut(); }}
      >
        {t.goOut}
      </button>
      <button
        className={`btn-choice${flash === 'stay' ? ' highlighted' : ''}`}
        onClick={() => { playClick(); onStay(); }}
      >
        {t.stayHome}
      </button>
      <div className="timer-bar-wrap">
        <div className="timer-bar" style={{ width: `${ratio * 100}%` }} />
      </div>
    </>
  );
}

function ForkButtons({ onChoice }) {
  const t = T[useLang()];
  const [flash, setFlash] = useState(null);
  const pendingRef = useRef(null);

  useEffect(() => () => clearTimeout(pendingRef.current), []);

  const ratio = useAutoTimer(AUTO_SELECT_SECONDS, () => {
    const dir = Math.random() < 0.5 ? 'left' : 'right';
    setFlash(dir);
    pendingRef.current = setTimeout(() => onChoice(dir), TIMINGS.FLASH_DELAY);
  });

  return (
    <>
      <button className={`btn-choice${flash === 'left'  ? ' highlighted' : ''}`} onClick={() => { playClick(); onChoice('left');  }}>{t.here}</button>
      <button className={`btn-choice${flash === 'right' ? ' highlighted' : ''}`} onClick={() => { playClick(); onChoice('right'); }}>{t.there}</button>
      <div className="timer-bar-wrap">
        <div className="timer-bar" style={{ width: `${ratio * 100}%` }} />
      </div>
    </>
  );
}

function BattleButtons({ onPlay, round }) {
  const t = T[useLang()];
  const RPS_LABELS = [t.scissors, t.rock, t.paper];
  const [flash, setFlash] = useState(null);
  const pendingRef = useRef(null);

  useEffect(() => () => clearTimeout(pendingRef.current), []);

  const ratio = useAutoTimer(AUTO_SELECT_SECONDS, () => {
    const player = randomRps();
    setFlash(player);
    pendingRef.current = setTimeout(() => onPlay(player, randomRps()), TIMINGS.FLASH_DELAY);
  }, true, round);

  function choose(key) { playClick(); onPlay(key, randomRps()); }

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

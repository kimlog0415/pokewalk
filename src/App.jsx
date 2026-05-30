import { useState, useCallback, useEffect, useRef } from 'react';
import { usePokedex } from './hooks/usePokedex';
import { useAutoTimer } from './hooks/useAutoTimer';
import { getHabitat } from './data/habitats';

import HomeScene from './scenes/HomeScene';
import TravelScene from './scenes/TravelScene';
import ForkScene from './scenes/ForkScene';
import EncounterScene from './scenes/EncounterScene';
import BattleScene from './scenes/BattleScene';
import CaughtScene from './scenes/CaughtScene';
import FleeScene from './scenes/FleeScene';
import DuplicateScene from './scenes/DuplicateScene';

const RPS_KEYS = ['scissors', 'rock', 'paper'];
const RPS_LABELS = ['가위', '바위', '보'];

function rpsResult(player, cpu) {
  if (player === cpu) return 'draw';
  if (
    (player === 'scissors' && cpu === 'paper') ||
    (player === 'rock' && cpu === 'scissors') ||
    (player === 'paper' && cpu === 'rock')
  ) return 'win';
  return 'lose';
}

function randomRps() {
  return RPS_KEYS[Math.floor(Math.random() * 3)];
}

export default function App() {
  const [state, setState] = useState({
    scene: 'home',
    path: [],
    currentHabitat: null,
    currentPokemon: null,
    battleRound: 0,
  });
  // fork 내부 단계: 'walking' → 2초 → 'arrived' (버튼 활성)
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

  // ForkScene 내부 walking 끝나면 호출
  function onForkArrived() {
    setForkPhase('arrived');
  }

  // 버튼 선택 or 자동 선택
  function onForkChoice(dir) {
    const newPath = [...state.path, dir];
    if (newPath.length < 4) {
      setForkPhase('walking');
      setState(s => ({ ...s, path: newPath }));
    } else {
      const habitat = getHabitat(newPath);
      go('encounter', { path: newPath, currentHabitat: habitat });
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
      catchPokemon({ id: state.currentPokemon.id, nameKo: state.currentPokemon.name });
      go('caught');
    } else if (result === 'lose') {
      go('flee');
    } else {
      go('battle', { battleRound: state.battleRound + 1 });
    }
  }

  function goHome() {
    go('home');
  }

  return (
    <div className="gameboy">
      <div className="screen-surround">
        <div className="screen-label">PokeWalk</div>
        <div className="screen">
          {state.scene === 'home' && (
            <HomeScene pokedex={pokedex} onStart={startAdventure} />
          )}
          {state.scene === 'travel' && (
            <TravelScene onDone={onTravelDone} />
          )}
          {state.scene === 'fork' && (
            <ForkScene
              step={state.path.length}
              phase={forkPhase}
              onArrived={onForkArrived}
            />
          )}
          {state.scene === 'encounter' && (
            <EncounterScene
              habitat={state.currentHabitat}
              onReady={onEncounterReady}
            />
          )}
          {state.scene === 'battle' && (
            <BattleScene
              pokemon={state.currentPokemon}
              round={state.battleRound}
            />
          )}
          {state.scene === 'caught' && (
            <CaughtScene pokemon={state.currentPokemon} onDone={goHome} />
          )}
          {state.scene === 'flee' && (
            <FleeScene onDone={goHome} />
          )}
          {state.scene === 'duplicate' && (
            <DuplicateScene pokemon={state.currentPokemon} onDone={goHome} />
          )}
        </div>
      </div>

      <div className="controls">
        <div className="dpad" />
        <div className="choice-buttons">
          {/* 버튼은 fork arrived 단계에서만 활성화 */}
          {state.scene === 'fork' && forkPhase === 'arrived' && (
            <ForkButtons onChoice={onForkChoice} step={state.path.length} />
          )}
          {state.scene === 'battle' && (
            <BattleButtons onResult={onBattleResult} round={state.battleRound} />
          )}
        </div>
        <div className="action-buttons">
          <button className="btn-action btn-b">B</button>
          <button className="btn-action btn-a">A</button>
        </div>
      </div>

      <div className="start-select">
        <button className="btn-small">SELECT</button>
        <button className="btn-small">START</button>
      </div>
    </div>
  );
}

// ForkButtons: arrived 단계에서만 마운트되므로 타이머 자동 리셋
function ForkButtons({ onChoice }) {
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
      <button
        className={`btn-choice${flash === 'left' ? ' highlighted' : ''}`}
        onClick={() => onChoice('left')}
      >여기로</button>
      <button
        className={`btn-choice${flash === 'right' ? ' highlighted' : ''}`}
        onClick={() => onChoice('right')}
      >저기로</button>
      <div className="timer-bar-wrap">
        <div className="timer-bar" style={{ width: `${ratio * 100}%` }} />
      </div>
    </>
  );
}

function BattleButtons({ onResult, round }) {
  const [flash, setFlash] = useState(null);
  const pendingRef = useRef(null);

  useEffect(() => () => clearTimeout(pendingRef.current), []);

  // round를 resetKey로 전달 → 라운드마다 타이머 재시작
  const ratio = useAutoTimer(3, () => {
    const player = randomRps();
    setFlash(player);
    pendingRef.current = setTimeout(() => onResult(rpsResult(player, randomRps())), 500);
  }, true, round);

  function choose(key) {
    onResult(rpsResult(key, randomRps()));
  }

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

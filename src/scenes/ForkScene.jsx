import { useEffect, useMemo } from 'react';
import { useLang } from '../contexts/LangContext';
import { T } from '../data/translations';
import './ForkScene.css';

export default function ForkScene({ step, phase, onArrived }) {
  const t = T[useLang()];
  // step마다 20~45% 사이 랜덤 도착 X (useMemo → step 바뀔 때만 재계산)
  const endLeft = useMemo(
    () => 20 + Math.floor(Math.random() * 26),
    [step]
  );

  useEffect(() => {
    if (phase !== 'walking') return;
    const timer = setTimeout(onArrived, 2000);
    return () => clearTimeout(timer);
  }, [phase, step]);

  const isWalking = phase === 'walking';

  return (
    <div className="fork-scene">
      <div className={`fork-bg${isWalking ? ' bg-scroll' : ''}`} />
      <div
        className={`char char-walk fork-char${isWalking ? ' anim-walk-in' : ''}`}
        style={{ left: `${endLeft}%` }}
      />
      {!isWalking && (
        <div className="fork-dialog">
          <p>{t.fork}</p>
          <p className="fork-step">{t.forkStep(step + 1)}</p>
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo } from 'react';
import { useLang } from '../contexts/LangContext';
import { T } from '../data/translations';
import './ForkScene.css';

export default function ForkScene({ step, phase, onArrived }) {
  const t = T[useLang()];
  // step마다 배경 시작 위치를 랜덤하게 변경
  // 최대 딜레이 -8s: fork 걷기 2초 안에 루프 점프 없음 (2/10*260 + 8/10*260 = 260)
  const bgDelay = useMemo(
    () => `-${(Math.random() * 8).toFixed(2)}s`,
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
      <div
        className={isWalking ? 'fork-bg-walk bg-scroll' : 'fork-bg-arrived'}
        style={isWalking ? { animationDelay: bgDelay } : undefined}
      />
      <div className={`char char-walk fork-char${isWalking ? ' anim-walk' : ''}`} />
      {!isWalking && (
        <div className="fork-dialog">
          <p>{t.fork}</p>
          <p className="fork-step">{t.forkStep(step + 1)}</p>
        </div>
      )}
    </div>
  );
}

import { useEffect } from 'react';
import './ForkScene.css';

// phase: 'walking' → 2초 → onArrived() → 'arrived'
export default function ForkScene({ step, phase, onArrived }) {
  useEffect(() => {
    if (phase !== 'walking') return;
    const t = setTimeout(onArrived, 2000);
    return () => clearTimeout(t);
  }, [phase, step]);

  const isWalking = phase === 'walking';

  return (
    <div className="fork-scene">
      <div className={`fork-bg${isWalking ? ' bg-scroll' : ''}`} />
      <div className={`char char-walk fork-char${isWalking ? ' anim-walk' : ''}`} />
      {!isWalking && (
        <div className="fork-dialog">
          <p>갈림길이다!</p>
          <p className="fork-step">({step + 1} / 4)</p>
        </div>
      )}
    </div>
  );
}

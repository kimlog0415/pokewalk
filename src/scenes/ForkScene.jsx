import { useEffect, useRef, useMemo, useState } from 'react';
import { useLang } from '../contexts/LangContext';
import { T } from '../data/translations';
import { TIMINGS } from '../utils/constants';
import './ForkScene.css';

// bg-scroll animation-delay 상한 (s) — 2s 걷기 안에 루프 점프 방지
const BG_DELAY_MAX = 8;

export default function ForkScene({ step, phase, onArrived }) {
  const t = T[useLang()];
  const bgDelay = useMemo(() => `-${(Math.random() * BG_DELAY_MAX).toFixed(2)}s`, [step]);

  // fork bg 표시 여부 / 캐릭터 정지 여부 (ForkScene 내부 서브 페이즈)
  const [showFork, setShowFork] = useState(false);
  const [stopped,  setStopped]  = useState(false);

  // onArrived ref: effect deps에서 제외해 함수 교체로 타이머 재시작 방지
  const onArrivedRef = useRef(onArrived);
  useEffect(() => { onArrivedRef.current = onArrived; }, [onArrived]);

  // walking phase: grassland 스크롤 → fork bg 전환
  useEffect(() => {
    if (phase !== 'walking') return;
    setShowFork(false);
    setStopped(false);
    const t = setTimeout(() => setShowFork(true), TIMINGS.WALK_IN);
    return () => clearTimeout(t);
  }, [phase, step]);

  // fork bg 등장 → walk-in → 정지 + 버튼 활성화
  useEffect(() => {
    if (!showFork) return;
    const t = setTimeout(() => {
      setStopped(true);
      onArrivedRef.current();
    }, TIMINGS.WALK_IN);
    return () => clearTimeout(t);
  }, [showFork]);

  return (
    <div className="fork-scene">
      {showFork ? (
        <div className="fork-bg-arrived" />
      ) : (
        <div
          className="fork-bg-walk bg-scroll"
          style={{ animationDelay: bgDelay }}
        />
      )}

      {showFork ? (
        <div className={`char char-walk fork-char${stopped ? '' : ' anim-walk-in'}`} />
      ) : (
        <div className="char char-walk anim-walk fork-char-walk" />
      )}

      {stopped && (
        <div className="fork-dialog">
          <p>{t.fork}</p>
          <p className="fork-step">{t.forkStep(step + 1)}</p>
        </div>
      )}
    </div>
  );
}

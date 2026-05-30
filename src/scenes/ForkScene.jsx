import { useEffect, useRef, useMemo, useState } from 'react';
import { useLang } from '../contexts/LangContext';
import { T } from '../data/translations';
import './ForkScene.css';

export default function ForkScene({ step, phase, onArrived }) {
  const t = T[useLang()];
  const bgDelay = useMemo(() => `-${(Math.random() * 8).toFixed(2)}s`, [step]);

  // fork bg 표시 여부 / 캐릭터 정지 여부 (ForkScene 내부 서브 페이즈)
  const [showFork, setShowFork] = useState(false);
  const [stopped,  setStopped]  = useState(false);

  // onArrived ref: effect deps에서 제외해 함수 교체로 타이머 재시작 방지
  const onArrivedRef = useRef(onArrived);
  useEffect(() => { onArrivedRef.current = onArrived; }, [onArrived]);

  // walking phase: 2s grassland 스크롤 → fork bg 전환
  useEffect(() => {
    if (phase !== 'walking') return;
    setShowFork(false);
    setStopped(false);
    const t = setTimeout(() => setShowFork(true), 2000);
    return () => clearTimeout(t);
  }, [phase, step]);

  // fork bg 등장 → 2s walk-in → 정지 + 버튼 활성화
  useEffect(() => {
    if (!showFork) return;
    const t = setTimeout(() => {
      setStopped(true);
      onArrivedRef.current();
    }, 2000);
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

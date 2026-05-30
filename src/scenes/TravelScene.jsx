import { useEffect, useState } from 'react';
import { useLang } from '../contexts/LangContext';
import { T } from '../data/translations';
import { TIMINGS } from '../utils/constants';
import './TravelScene.css';

// bg-scroll animation-delay 상한 (s) — 3s 걷기 안에 루프 점프 방지
const BG_DELAY_MAX = 7;

export default function TravelScene({ onDone }) {
  const t = T[useLang()];
  // bgScroll 중 랜덤 시점에서 시작 → 배경 위치가 매번 달라짐
  const [bgDelay] = useState(() => `-${(Math.random() * BG_DELAY_MAX).toFixed(2)}s`);

  useEffect(() => {
    const timer = setTimeout(onDone, TIMINGS.TRAVEL);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="travel-scene">
      <div className="bg-scroll travel-bg" style={{ animationDelay: bgDelay }} />
      <div className="char char-walk anim-walk travel-char" />
      <div className="travel-text">{t.exploring}</div>
    </div>
  );
}

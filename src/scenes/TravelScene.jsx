import { useEffect, useState } from 'react';
import { useLang } from '../contexts/LangContext';
import { T } from '../data/translations';
import './TravelScene.css';

export default function TravelScene({ onDone }) {
  const t = T[useLang()];
  // bgScroll 14s 중 랜덤 시점에서 시작 → 배경 위치가 매번 달라짐
  // bgScroll 10s, 0~-260px 범위 내에서 랜덤 시작
  const [bgDelay] = useState(() => `-${(Math.random() * 10).toFixed(2)}s`);

  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
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

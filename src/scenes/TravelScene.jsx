import { useEffect, useState } from 'react';
import { useLang } from '../contexts/LangContext';
import { T } from '../data/translations';
import './TravelScene.css';

// 30~65% 사이 랜덤 도착 X — 마운트마다 1회 생성
function randomEndLeft() {
  return 30 + Math.floor(Math.random() * 36); // 30~65
}

export default function TravelScene({ onDone }) {
  const t = T[useLang()];
  const [endLeft] = useState(randomEndLeft);

  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="travel-scene">
      <div className="bg-scroll travel-bg" />
      <div
        className="char char-walk anim-walk-in-3s travel-char"
        style={{ left: `${endLeft}%` }}
      />
      <div className="travel-text">{t.exploring}</div>
    </div>
  );
}

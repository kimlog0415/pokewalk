import { useEffect } from 'react';
import { useLang } from '../contexts/LangContext';
import { T } from '../data/translations';
import './TravelScene.css';

export default function TravelScene({ onDone }) {
  const t = T[useLang()];

  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="travel-scene">
      <div className="bg-scroll travel-bg" />
      <div className="char char-walk anim-walk travel-char" />
      <div className="travel-text">{t.exploring}</div>
    </div>
  );
}

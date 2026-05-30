import { useEffect, useRef } from 'react';
import { useLang } from '../contexts/LangContext';
import { T } from '../data/translations';
import { playFlee } from '../utils/sfx';
import './FleeScene.css';

export default function FleeScene({ habitat, onDone }) {
  const t = T[useLang()];

  const sfxPlayed = useRef(false);
  useEffect(() => {
    if (sfxPlayed.current) return;
    sfxPlayed.current = true;
    playFlee();
  }, []);

  useEffect(() => {
    const timer = setTimeout(onDone, 5000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="flee-scene">
      <div className={`flee-bg habitat-${habitat ?? 'grassland'}`} />
      <div className="char char-walk-back anim-walk-out flee-char" />
      <div className="flee-dialog">{t.fled}</div>
    </div>
  );
}

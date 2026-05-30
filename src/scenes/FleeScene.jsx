import { useEffect } from 'react';
import { useLang } from '../contexts/LangContext';
import { T } from '../data/translations';
import './FleeScene.css';

export default function FleeScene({ onDone }) {
  const t = T[useLang()];

  useEffect(() => {
    const timer = setTimeout(onDone, 5000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="flee-scene">
      <div className="flee-bg" />
      <div className="char char-walk-back anim-walk-out flee-char" />
      <div className="flee-dialog">{t.fled}</div>
    </div>
  );
}

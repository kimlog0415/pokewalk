import { useEffect } from 'react';
import './TravelScene.css';

export default function TravelScene({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="travel-scene">
      <div className="bg-scroll travel-bg" />
      <div className="char char-walk anim-walk travel-char" />
      <div className="travel-text">탐험 중...</div>
    </div>
  );
}

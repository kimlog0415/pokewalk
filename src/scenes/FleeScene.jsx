import { useEffect } from 'react';
import './FleeScene.css';

export default function FleeScene({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 5000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flee-scene">
      <div className="flee-bg" />
      <div className="char char-walk-back anim-walk-out flee-char" />
      <div className="flee-dialog">도망쳤다...</div>
    </div>
  );
}

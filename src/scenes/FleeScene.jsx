import { useEffect, useState } from 'react';
import './FleeScene.css';

export default function FleeScene({ onDone }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setGone(true), 3000);
    const t2 = setTimeout(onDone, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className="flee-scene">
      <div className="bg-scroll-reverse flee-bg" />
      {!gone && <div className="char char-walk-back anim-walk flee-char" />}
      <div className="flee-dialog">도망쳤다...</div>
    </div>
  );
}

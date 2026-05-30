import { useEffect, useRef, useState } from 'react';

// resetKey: 변경될 때마다 타이머 재시작 (battle round 등에 사용)
export function useAutoTimer(seconds, onExpire, active = true, resetKey = 0) {
  const [remaining, setRemaining] = useState(seconds);
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;

  useEffect(() => {
    if (!active) return;
    setRemaining(seconds);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const left = Math.max(0, seconds - elapsed);
      setRemaining(left);
      if (left <= 0) {
        clearInterval(interval);
        expireRef.current();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [seconds, active, resetKey]);

  return remaining / seconds;
}

import { useEffect, useRef, useState } from 'react';

// seconds: 카운트다운 시간
// onExpire: 시간 초과 시 호출
// active: 타이머 동작 여부
export function useAutoTimer(seconds, onExpire, active = true) {
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
  }, [seconds, active]);

  return remaining / seconds; // 0~1 (progress ratio)
}

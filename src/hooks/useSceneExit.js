import { useEffect, useRef } from 'react';
import { TIMINGS } from '../utils/constants';

// caught/flee/duplicate 씬 공통: SFX 1회 재생 + 타이머 후 onDone 호출
export function useSceneExit(playSfx, onDone) {
  const sfxPlayed = useRef(false);

  useEffect(() => {
    if (sfxPlayed.current) return;
    sfxPlayed.current = true;
    playSfx();
  }, []);

  useEffect(() => {
    const timer = setTimeout(onDone, TIMINGS.SCENE_EXIT);
    return () => clearTimeout(timer);
  }, [onDone]);
}

import { useEffect, useRef } from 'react';
import bgmHome   from '../assets/audio/bgm_home.ogg';
import bgmTravel from '../assets/audio/bgm_travel.ogg';
import bgmBattle from '../assets/audio/bgm_battle.ogg';
import bgmCaught from '../assets/audio/bgm_caught.ogg';

// 모듈 로드 시 Audio 객체 생성 + preload=auto
// → 게임 시작 전에 브라우저가 파일을 미리 다운로드해두므로 딜레이 없음
const TRACKS = Object.fromEntries(
  [['home', bgmHome], ['travel', bgmTravel], ['battle', bgmBattle], ['caught', bgmCaught]]
    .map(([key, src]) => {
      const a = new Audio(src);
      a.loop    = true;
      a.volume  = 0.4;
      a.preload = 'auto';
      return [key, a];
    })
);

const SCENE_BGM = {
  home:      TRACKS.home,
  travel:    TRACKS.travel,
  fork:      TRACKS.travel,
  encounter: TRACKS.battle,
  battle:    TRACKS.battle,
  caught:    TRACKS.caught,
  flee:      TRACKS.battle,
  duplicate: TRACKS.battle,
};

export function useBgm(scene) {
  const currentRef = useRef(null);

  useEffect(() => {
    const next = SCENE_BGM[scene] ?? null;
    if (next === currentRef.current) return; // 같은 트랙 → 계속 재생

    if (currentRef.current) {
      currentRef.current.pause();
      currentRef.current.currentTime = 0;
    }

    currentRef.current = next;
    if (next) {
      next.currentTime = 0;
      next.play().catch(() => {});
    }
  }, [scene]);

  // 첫 click 시 모든 트랙 unlock
  // click은 React onClick(playClick 등) 이후 document까지 버블링되므로
  // sfx가 audio context를 먼저 unlock한 뒤 BGM play가 실행됨
  useEffect(() => {
    const resume = () => {
      Object.values(TRACKS).forEach(audio => {
        audio.play()
          .then(() => { if (audio !== currentRef.current) audio.pause(); })
          .catch(() => {});
      });
    };
    document.addEventListener('click', resume, { once: true });
    return () => document.removeEventListener('click', resume);
  }, []);

  useEffect(() => () => { currentRef.current?.pause(); }, []);
}

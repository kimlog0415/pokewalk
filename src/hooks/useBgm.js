import { useEffect, useRef } from 'react';
import bgmHome   from '../assets/audio/bgm_home.mp3';
import bgmTravel from '../assets/audio/bgm_travel.mp3';
import bgmBattle from '../assets/audio/bgm_battle.mp3';
import bgmCaught from '../assets/audio/bgm_caught.mp3';

const SCENE_BGM = {
  home:      bgmHome,
  travel:    bgmTravel,
  fork:      bgmTravel,
  encounter: bgmBattle,
  battle:    bgmBattle,
  caught:    bgmCaught,
  flee:      bgmBattle,
  duplicate: bgmBattle,
};

export function useBgm(scene) {
  const audioRef = useRef(null);
  const srcRef   = useRef(null);

  // 씬 바뀔 때 BGM 교체 (같은 트랙이면 계속 재생)
  useEffect(() => {
    const src = SCENE_BGM[scene] ?? null;
    if (src === srcRef.current) return;
    srcRef.current = src;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (!src) return;

    const audio = new Audio(src);
    audio.loop   = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    audio.play().catch(() => {}); // autoplay 차단 시 무시
  }, [scene]);

  // 첫 pointerdown 시 재시도 — autoplay 정책으로 묵음 상태인 경우 복구
  useEffect(() => {
    const resume = () => {
      if (audioRef.current?.paused) {
        audioRef.current.play().catch(() => {});
      }
      document.removeEventListener('pointerdown', resume);
    };
    document.addEventListener('pointerdown', resume);
    return () => document.removeEventListener('pointerdown', resume);
  }, []);

  // 언마운트 시 정지
  useEffect(() => () => { audioRef.current?.pause(); }, []);
}

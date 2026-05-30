import sfxClickSrc     from '../assets/audio/sfx_click.ogg';
import sfxEncounterSrc from '../assets/audio/sfx_encounter.ogg';
import sfxWinSrc       from '../assets/audio/sfx_win.ogg';
import sfxLoseSrc      from '../assets/audio/sfx_lose.ogg';
import sfxCatchSrc     from '../assets/audio/sfx_catch.ogg';
import sfxFleeSrc      from '../assets/audio/sfx_flee.ogg';
import sfxDupSrc       from '../assets/audio/sfx_duplicate.ogg';

// 미리 로드 — cloneNode()로 빠른 연속 재생도 대응
const _sounds = Object.fromEntries(
  [
    ['click',     sfxClickSrc],
    ['encounter', sfxEncounterSrc],
    ['win',       sfxWinSrc],
    ['lose',      sfxLoseSrc],
    ['catch',     sfxCatchSrc],
    ['flee',      sfxFleeSrc],
    ['duplicate', sfxDupSrc],
  ].map(([key, src]) => {
    const a = new Audio(src);
    a.preload = 'auto';
    return [key, a];
  })
);

function play(key) {
  _sounds[key].cloneNode().play().catch(() => {});
}

export const playClick     = () => play('click');
export const playEncounter = () => play('encounter');
export const playWin       = () => play('win');
export const playLose      = () => play('lose');
export const playCatch     = () => play('catch');
export const playFlee      = () => play('flee');
export const playDuplicate = () => play('duplicate');

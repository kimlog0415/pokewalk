import sfxClickSrc from '../assets/audio/sfx_click.ogg';

// 미리 로드 — cloneNode()로 빠른 연속 클릭도 각각 재생
const _click = new Audio(sfxClickSrc);
_click.preload = 'auto';

export function playClick() {
  _click.cloneNode().play().catch(() => {});
}

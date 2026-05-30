// 씬 타이밍 (ms)
export const TIMINGS = {
  WALK_IN:          2000,  // 캐릭터 걸어들어오는 애니메이션
  ENCOUNTER_REVEAL: 2000,  // 포켓몬 등장 후 battle/duplicate 전환까지
  TRAVEL:           3000,  // travel 씬 걷기
  SCENE_EXIT:       5000,  // caught/flee/duplicate → home 대기
  BATTLE_PENDING:   1000,  // RPS 선택 후 결과 표시 전 대기
  BATTLE_REVEAL:    1500,  // 결과 카드 표시 시간
  HOME_QUESTION:    5000,  // 홈 씬 "나갈까?" 질문 주기
  HOME_EXIT:        1500,  // 홈 씬 우측 퇴장 → travel
  FADE_DURATION:     250,  // withFade 암전 CSS transition
  FADE_HOLD:         150,  // 씬 교체 후 페이드아웃 전 홀드
  START_FADE:        400,  // press-start 오버레이 페이드아웃
  FLASH_DELAY:       500,  // 자동선택 시 버튼 하이라이트 → 실행 딜레이
};

// 갈림길/가위바위보/홈 자동선택 대기 시간 (초)
export const AUTO_SELECT_SECONDS = 3;

// 서식지 기본값
export const DEFAULT_HABITAT = 'grassland';

// PokeAPI sprite URL
export const SPRITE_SMALL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
export const SPRITE_ART   = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

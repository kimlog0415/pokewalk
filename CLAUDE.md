# 포켓몬 탐험 게임 CLAUDE.md

## 코드 변경 시 자동 커밋 & 푸시 규칙

**파일 생성·수정·삭제가 발생하면 사용자가 별도로 언급하지 않아도 반드시 commit & push할 것.**
단, 아래 필수 체크를 먼저 수행한 후 이상 없을 때만 진행한다.

---

## ⚠️ 커밋 & 푸시 전 필수 체크 (MANDATORY PRE-COMMIT)

**git commit / git push 전에 반드시 아래를 수행할 것:**

각 항목 완료 시 아래 이모지를 텍스트로 출력할 것:

1. **민감 정보 검사**: API 키, 토큰 등이 코드에 하드코딩되어 있지 않은지 확인. 이 앱은 서버가 없는 정적 웹앱이므로 외부 자격증명이 코드에 포함되어서는 안 됨. `.env` 파일이 `.gitignore`에 포함되어 있는지 확인. → 완료 시 🔑 출력
2. **코드 이상 여부**: 이 앱이 사용하는 외부 통신은 PokeAPI(`pokeapi.co`) 단 하나임. 그 외 불필요한 외부 요청, 악성 패턴, 의도치 않은 부작용이 없는지 확인. 개발용 디버그 코드(`console.log` 과다 등)가 배포 빌드에 과도하게 포함되지 않는지 확인. → 완료 시 🔍 출력
3. **패키지 공식 여부**: 새로 추가된 npm 패키지가 공식 패키지인지 확인. `package.json`의 의존성 변경이 있으면 패키지명·버전·출처가 의도한 것과 일치하는지 검토. → 완료 시 📦 출력
4. **CLAUDE.md 업데이트**: 새 씬/컴포넌트/훅/데이터 구조/게임 로직이 추가·변경되었으면 이 파일에 반영. → 완료 시 📝 출력

모든 항목 이상 없으면 ✅ 출력 후 commit & push 진행. 문제 발견 시 🚨 출력 후 중단.

---

## 현재 구현 현황 (2026-05-31 기준)

### 완료된 것

**핵심 구조**
- 8개 scene 상태머신 (`App.jsx`) — home/travel/fork/encounter/battle/caught/flee/duplicate
- 갈림길 4단계 이진트리 → 16종착지 서식지 매핑 (`data/habitats.js`)
- PokeAPI 연동 (포켓몬 정보 + 다국어 이름 + 도감 설명)
- localStorage 도감 (`hooks/usePokedex.js`) — `{ id, names:{ko,ja,en} }` 배열 + `seenIds` Set 저장
- 자동 선택 타이머 (`hooks/useAutoTimer.js`) — resetKey로 라운드마다 재시작

**다국어 (KO/JA/EN)**
- 언어 게임팩 카트리지 UI (상단, 클릭 시 꽂히는 연출)
- `contexts/LangContext.js` + `data/translations.js`
- 폰트: Galmuri11(한) + DotGothic16(일) + Press Start 2P(영) — `index.html` CDN

**씬별 연출**
- 캐릭터 스프라이트 시트 애니메이션 (2048×701, 3프레임, `scenes/sprites.css`)
- 배경 스크롤 (우→좌, 0~-260px 범위, 이미지 끊김 방지)
- travel/fork: 배경 시작 위치 랜덤 (음수 animation-delay, 루프 점프 방지 위해 딜레이 상한 제한)
- encounter: 캐릭터 왼쪽에서 걸어들어옴(anim-walk-in), 배경 고정, 포켓몬 drop-shadow 글로우
- fork: grassland 2s 스크롤 → bg_fork.png + 2s walk-in → 정지 + 갈림길 대화문 (ForkScene 내부 서브페이즈)
- flee/duplicate: 해당 서식지 배경 + 배틀 위치(left:15%)에서 좌측 퇴장 — `scenes/habitats.css` 공유
- duplicate: 중복 포켓몬 흑백 + 서서히 fade-out
- battle: 선택 즉시 버튼 숨김(battlePending 1s) → reveal 카드 (나 vs 상대 손 이모지 + 결과 색상), 비기면 `round+1` 표시
- caught: 반짝임 효과
- 화면 전환: `withFade()` 더블RAF + 250ms 암전 + 150ms hold → 페이드아웃 (Edge/모바일 paint 타이밍 대응)

**home 씬 (bg_home.png)**
- `char_front.png` (단일 프레임) + `char_walk/char_walk_back` 3종 스프라이트
- RAF 기반 80px/s 좌우 이동 (원본 좌표 277~1449, 화면 59~307px), 방향 전환 시만 React 리렌더
- 5초마다 "나갈까? 말까?" 질문 → `homePhase` (App.jsx): `'walking'|'question'|'exit'`
- question 시 정면 정지, HomeButtons 3초 타이머, 초과 시 랜덤 자동선택
- 나갈래 선택 → 우측 퇴장(`anim-walk-out-right`) 1.5s → travel
- 도감 오버레이 열려있으면 question 타이머 중단, 열 때 question 상태면 자동 dismiss
- 도감: 우상단 소형 버튼 → 화면 내 오버레이 (5열 그리드 + 포켓몬 상세 카드 모달)
- 새로 잡은 포켓몬 슬롯에 금색 pulse 테두리 (클릭 시 소멸) — `seenIds` Set을 `localStorage("pokedex_seen")`에 저장
- 도감 헤더: `n / 151 (x%)` 항상 중앙 고정

**Press-Start 오버레이**
- 앱 로드 시 검은 오버레이 표시 (타이틀 + char_front + PRESS START 깜빡임)
- START 버튼(빨간 glow pulse 활성) 또는 오버레이 클릭 → 0.4s 페이드아웃 + BGM 시작
- 오버레이 중 home question 타이머 억제 (`started` 플래그)
- 브라우저 autoplay 정책 대응: 첫 `click` 시 모든 트랙 unlock (iOS/Android 대응, pointerdown은 모바일에서 미인정)

**BGM (`hooks/useBgm.js`)**
- OGG 포맷 (무음 프레임 없어 루프 끊김 없음), 모듈 로드 시 preload=auto
- 씬 매핑: home→bgm_home, travel/fork→bgm_travel, encounter~duplicate→bgm_battle, caught→bgm_caught
- 같은 트랙이면 씬 전환해도 계속 재생 (battleBGM이 encounter부터 flee/duplicate까지 유지)
- 음소거 토글: 스크린 우상단 🔊/🔇 버튼, BGM+SFX 전체 제어, `localStorage("audio_muted")` 저장

**SFX (`utils/sfx.js`)**
- OGG 포맷, 모듈 로드 시 preload=auto, cloneNode()로 연속 재생 대응
- sfx_click: 선택 버튼 전체, 언어팩, 도감 버튼/슬롯/닫기, START 버튼, 오버레이
- sfx_encounter: 포켓몬 등장 시 (reveal phase)
- sfx_win/lose: RPS 결과 확정 즉시
- sfx_battlePending: RPS 선택 직후 (1s 대기 중)
- sfx_catch/flee/duplicate: 해당 씬 마운트 시 1회 (useRef 플래그로 StrictMode 이중 방지)
- `setSfxMuted(bool)` 모듈 전역 플래그로 음소거 (App의 audio_muted 상태와 동기화)

**공유 유틸/상수 (`utils/`, `hooks/`)**
- `utils/constants.js` — `TIMINGS`(씬 타이밍 ms 전체), `AUTO_SELECT_SECONDS`, `DEFAULT_HABITAT`, `SPRITE_SMALL/ART` URL
- `utils/rps.js` — `RPS_KEYS`, `RPS_EMOJI`, `rpsResult()`, `randomRps()`
- `utils/pokemon.js` — `getPokemonName(pokemon, lang)` (names → nameKo → name fallback 통일)
- `hooks/useSceneExit.js` — caught/flee/duplicate 공통 (SFX 1회 + SCENE_EXIT 타이머 → onDone)

**CSS 공유 상수 (`scenes/habitats.css`)**
- `--field-pokemon-size: 112px` / `--field-pokemon-right: 8%` / `--field-pokemon-bottom: 55px`
- encounter/duplicate `.field-pokemon-img` 클래스로 통일 (한 곳만 수정하면 반영)

**스프라이트 방향**
- `data/faceRight.js` — 오른쪽 보는 포켓몬 ID는 scaleX(-1)로 좌우반전
- `tools/face-checker.html` — 방향 수동 태깅 도구 (standalone)

**기타**
- 게임기 프레임 UI, A/B 버튼은 회색(장식용), 실제 조작 버튼 강조
- 서식지 배경 7종 모두 앱 로드 시 `new Image()` preload (App.jsx 모듈 레벨, encounter 첫 진입 시 빈 화면 방지)

### 에셋 현황
- 배경: bg_grassland/mountain/forest/urban/water_edge/sea/cave/fork/home (전부 3168×1344)
- 캐릭터: char_walk, char_walk_back (2048×701, 3프레임), char_front (단일)
- 포켓몬: PokeAPI (small + official-artwork)
- BGM: bgm_home/travel/battle/caught (.ogg)
- SFX: sfx_click/encounter/win/lose/catch/flee/duplicate/battlePending (.ogg)

### 남은 작업 (TODO)
- [ ] **도감 완성도 리워드** — 151마리 완성 시 특별 연출
- [ ] **모바일 반응형 점검** — 480px 이하 레이아웃 실기기 확인

---

## 프로젝트 개요

포켓몬 1세대(151마리) 도감 완성을 목표로 하는 웹 기반 탐험 게임.
플레이어가 갈림길을 선택하며 포켓몬을 만나고 가위바위보로 포획한다.
5초(갈림길/가위바위보는 3초) 동안 입력 없으면 자동 선택되는 방치형 플레이 지원.
포폴용 프로젝트로 GitHub Pages에 배포한다.

---

## 기술 스택

- **프레임워크**: React (Vite)
- **스타일**: CSS (별도 파일)
- **데이터 저장**: localStorage (도감 데이터 영구 보존)
- **API**: PokeAPI (`https://pokeapi.co/api/v2/`)
- **배포**: GitHub Pages (`kimlog0415.github.io`)

---

## 화면 구조 (상태 기반 전환, URL 고정)

```
scene: 'home' | 'travel' | 'fork' | 'encounter' | 'battle' | 'caught' | 'flee' | 'duplicate'
```

### 1. home (홈)

- bg_home.png 배경, 캐릭터가 원본 이미지 277~1449px 구간(화면 59~307px)을 좌우로 왔다갔다
- 5초마다 "나갈까? 말까?" 질문 팝업 (3초 타이머, 초과 시 '있을래' 자동선택)
- "나갈래!" 선택 → 캐릭터 우측 퇴장 1.5s → travel
- 우상단 소형 도감 버튼 → 화면 내 오버레이로 도감 열람

### 2. travel (이동)

- 캐릭터 걷기 애니메이션 (3초)
- 트랜지션 (2초)
- → fork로 자동 전환

### 3. fork (갈림길) × 4단계 반복

- 캐릭터 걸어서 갈림길 도착 (2초)
- "여기로" / "저기로" 선택 (3초, 초과시 자동 선택)
- 4단계 완료 후 → encounter로 전환

### 4. encounter (포켓몬 발견)

- 캐릭터 걸어서 포켓몬 발견 (2초)
- 이미 잡은 포켓몬 → duplicate로 전환
- 새 포켓몬 → battle로 전환

### 5. battle (가위바위보)

- 가위 / 바위 / 보 선택 (3초, 초과시 자동 선택)
- 이김 → caught
- 비김 → battle 반복
- 짐 → flee

### 6. caught (포획 성공)

- 잡은 포켓몬 표시 (3초)
- 트랜지션 (2초)
- → home

### 7. flee (도망)

- 캐릭터 뒤돌아 걷기 (3초)
- 트랜지션 (2초)
- → home

### 8. duplicate (이미 잡은 포켓몬)

- 캐릭터 뒤돌아 걷기 (3초)
- "이미 있는 포켓몬이야" 대사 표시
- 트랜지션 (2초)
- → home

---

## 갈림길 트리 구조

4단계 이진 트리 → 16개 종착지
각 종착지에 서식지 그룹 배치, 해당 그룹에서 랜덤 포켓몬 1마리 등장

### 서식지 슬롯 배분 (합계 16)

| 서식지                   | 1세대 포켓몬 수 | 슬롯 수 |
| ------------------------ | --------------- | ------- |
| grassland                | 35              | 4       |
| mountain + rough-terrain | 26              | 3       |
| forest                   | 21              | 2       |
| urban                    | 22              | 2       |
| waters-edge              | 19              | 2       |
| sea                      | 15              | 2       |
| cave + rare              | 13              | 1       |

### 트리 구조 예시

```
                    [출발]
           ↙                  ↘
        [1단계]              [1단계]
       ↙      ↘            ↙      ↘
    [2단계]  [2단계]    [2단계]  [2단계]
    ↙  ↘    ↙  ↘      ↙  ↘    ↙  ↘
   ...16개 종착지(서식지 슬롯 배치)...
```

선택지 텍스트는 항상 "여기로" / "저기로" 고정 (서식지 힌트 없음)

### 슬롯당 포켓몬 수 (난이도)

| 서식지         | 포켓몬 수 | 슬롯 | 슬롯당 포켓몬 수 |
| -------------- | --------- | ---- | ---------------- |
| sea            | 15        | 2    | 7.5 (제일 쉬움)  |
| grassland      | 35        | 4    | 8.75             |
| mountain+rough | 26        | 3    | 8.6              |
| waters-edge    | 19        | 2    | 9.5              |
| forest         | 21        | 2    | 10.5             |
| urban          | 22        | 2    | 11               |
| cave+rare      | 13        | 1    | 13 (제일 어려움) |

슬롯당 포켓몬 수 = 해당 서식지에서 한 번 탐험으로 특정 포켓몬을 만날 확률의 역수.
max(13) - min(7.5) = 5.5로 난이도 격차를 의도적으로 좁게 설계.

---

## 데이터 구조

### localStorage 키

```js
"pokedex"; // 잡은 포켓몬 id 배열 ex) [1, 4, 25, ...]
```

### 게임 상태 (React state)

```js
{
  scene: 'home',           // 현재 화면
  path: [],                // 갈림길 선택 기록 ex) ['left','right','left','right']
  currentHabitat: null,    // 종착지 서식지
  currentPokemon: null,    // 현재 만난 포켓몬 데이터
  battleRound: 0,          // 가위바위보 라운드 수
}
```

---

## 화면 규격

### 레이아웃

- 게임기 프레임 전체: max-width 480px, 픽셀아트 스타일 CSS/SVG로 구현
- 게임 화면 영역: 380 × 285px (4:3 비율)
- 480px 이하: 반응형 (화면 꽉 차게)
- 게임기 버튼 영역: 실제 클릭 가능 (여기로/저기로, 가위바위보 등)

### 디자인 스타일

- 전체 UI: 픽셀아트 스타일
- 게임기 프레임: 오리지널 레트로 게임기 디자인 (레트로 게임기 형태에서 영감, 직접 디자인)
- 배경색: 웹페이지 배경은 검정 또는 어두운 색

---

## 에셋 규격

### 캐릭터 스프라이트

- 형식: PNG (투명 배경)
- 구성: 스프라이트 시트 (걷는 동작 프레임 가로 나열)
- 스타일: 픽셀아트

### 배경 이미지

- 형식: PNG 또는 JPG
- 구성: 서식지별 개별 파일 (grassland, forest, cave 등)
- 형태: 가로로 긴 이미지 (스크롤 애니메이션용)
- 스타일: 픽셀아트

### 포켓몬 스프라이트

- PokeAPI 제공 이미지 사용 (별도 에셋 불필요)
- URL: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png`

### BGM (배경음악)

- 형식: OGG (루프 끊김 없음)
- 저작권: 포켓몬 원곡 사용 불가, 직접 제작 또는 CC0 라이선스 사용
- 구성:
  - `bgm_home` — 홈 화면
  - `bgm_travel` — 이동/갈림길
  - `bgm_battle` — encounter~battle~flee/duplicate
  - `bgm_caught` — 포획 성공

### SFX (효과음)

- 형식: OGG
- 저작권: 직접 제작 또는 CC0 라이선스 사용
- 구성 (구현 완료):
  - `sfx_click` — 모든 조작 버튼
  - `sfx_encounter` — 포켓몬 등장
  - `sfx_win` / `sfx_lose` — 가위바위보 결과
  - `sfx_catch` — 포획 성공
  - `sfx_flee` — 도망
  - `sfx_duplicate` — 이미 잡은 포켓몬

### FX (시각 효과)

- CSS 애니메이션으로 구현 (별도 에셋 불필요)
- 구성:
  - 씬 전환 페이드 인/아웃 (`withFade`, `.screen-fade` 오버레이)
  - Press-Start 오버레이 (앱 최초 진입 시)
  - 포획 성공 시 반짝임 효과
  - 갈림길/가위바위보 선택 시 버튼 하이라이트

---

## 타이밍 정리

| 구간                             | 시간 |
| -------------------------------- | ---- |
| 캐릭터 걷기 애니메이션           | 3초  |
| 화면 트랜지션                    | 2초  |
| 갈림길 도착 애니메이션           | 2초  |
| 갈림길 선택 대기 (자동 선택)     | 3초  |
| 포켓몬 발견 애니메이션           | 2초  |
| 가위바위보 선택 대기 (자동 선택) | 3초  |
| 포획 성공 표시                   | 3초  |
| 도망/뒤돌아 걷기                 | 3초  |


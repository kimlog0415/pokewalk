# PokeWalk

포켓몬 1세대(151마리) 도감 완성을 목표로 하는 웹 기반 탐험 게임.

🎮 **[Play Here](https://kimlog0415.github.io/pokewalk/)**

---

## 게임 소개

갈림길을 선택하며 다양한 서식지를 탐험하고, 야생 포켓몬을 발견하면 가위바위보로 포획합니다.  
151마리 전부 수집하면 도감 완성!

- 5초 동안 입력이 없으면 자동으로 선택되는 **방치형 플레이** 지원
- **한국어 / 日本語 / English** 3개국어 지원
- 게임보이 감성의 픽셀아트 UI

## 게임 흐름

```
홈 → 이동 → 갈림길 × 4 → 포켓몬 발견 → 가위바위보 → 포획 or 도망
```

| 구간 | 내용 |
|------|------|
| 갈림길 | 4단계 이진 트리 → 16개 서식지 중 하나 도달 |
| 포켓몬 | 서식지별 1세대 포켓몬 랜덤 등장 |
| 가위바위보 | 이기면 포획 / 지면 도망 / 비기면 재도전 |
| 자동 선택 | 3~5초 타임아웃 시 랜덤 자동 선택 |

---

## 기술 스택

| 분류 | 내용 |
|------|------|
| 프레임워크 | React 19 + Vite |
| 스타일 | CSS (컴포넌트별 분리) |
| 데이터 저장 | localStorage |
| 외부 API | [PokeAPI](https://pokeapi.co/) — 포켓몬 정보 · 다국어 이름 · 도감 설명 |
| 배포 | GitHub Pages + GitHub Actions |

---

## 에셋 출처

| 에셋 | 출처 |
|------|------|
| 배경 이미지 | [Google Gemini](https://gemini.google.com/) (AI 생성) |
| 캐릭터 스프라이트 | [Google Gemini](https://gemini.google.com/) (AI 생성) |
| BGM | [Suno](https://suno.com/) (AI 생성) + 루프 포인트 수동 편집 |
| SFX | 출처 미상 |
| 포켓몬 스프라이트 | [PokeAPI Sprites](https://github.com/PokeAPI/sprites) |

> PokeWalk는 팬 제작 비영리 프로젝트입니다.  
> 포켓몬 관련 지식재산권은 ©Nintendo / ©Creatures Inc. / ©GAME FREAK inc.에 있습니다.

---

## 로컬 실행

```bash
npm install
npm run dev
```

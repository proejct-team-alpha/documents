---
name: web-storyboard
description: >
  순수 HTML, CSS, JavaScript만으로 웹 기반 스토리보드 슬라이드를 구현하는 스킬.
  외부 라이브러리 없이 단일 HTML 파일로 완성되는 화면 설계 스토리보드를 만든다.
  사용자가 스토리보드, 화면 설계서, 화면 정의서, UI 스토리보드, 화면 목업 슬라이드,
  웹 스토리보드, 화면 흐름도, 와이어프레임 슬라이드 등을 언급하면 이 스킬을 사용한다.
  프레젠테이션이 아닌 화면 단위 설계 문서가 필요한 맥락에서 트리거된다.
  역할별 화면, API 명세, View Model, 액션 정의 등 개발 스토리보드 관련 요청에도 사용한다.
---

# 바닐라 웹 스토리보드 스킬

순수 HTML, CSS, JavaScript만으로 웹 기반 화면 설계 스토리보드를 구현한다.
단일 `.html` 파일로 완성되며, 외부 의존성이 없다.

## 핵심 원칙

1. **단일 파일**: 모든 HTML, CSS, JS가 하나의 `.html` 파일에 포함
2. **외부 의존성 제로**: 외부 라이브러리 사용 금지 (웹폰트만 허용)
3. **960×540 고정 캔버스**: `transform: scale()`로 뷰포트에 맞춰 자동 스케일링
4. **3행 그리드 구조**: 헤더 배너(44px) + 메타 배지(32px) + 메인 영역(1fr)
5. **좌우 분할 메인**: 좌측 60% 화면 목업 + 우측 40% 상세 패널
6. **역할 기반 색상**: `data-role` CSS 변수로 역할별 색상 자동 전환
7. **다크 테마 기본**: GitHub Dark 스타일 배경

## 프레젠테이션 vs 스토리보드

| 구분 | 프레젠테이션 (web-presentation) | 스토리보드 (이 스킬) |
|------|------|------|
| 목적 | 발표/강의 자료 | 화면 설계 명세서 |
| 슬라이드 구조 | 자유 레이아웃 | 고정 3행 + 좌우 분할 |
| 핵심 콘텐츠 | 텍스트, 코드, 다이어그램 | 화면 목업 + API/VM/권한 명세 |
| 네비게이션 | 순차 이동 | 역할 필터 + 세트 이동 |

사용자가 "프레젠테이션"이나 "발표 자료"를 원하면 `web-presentation` 스킬을 사용한다.
"스토리보드", "화면 설계", "화면 정의"를 원하면 이 스킬을 사용한다.

## 구현 순서

1. 사용자의 프로젝트 정보 파악 (기술 스택, 역할, 화면 목록)
2. `references/architecture.md`를 읽고 전체 CSS/JS 코드 확인
3. 아래 구조에 따라 단일 HTML 파일 작성
4. 목업 영역 콘텐츠 오버플로 검증

## 슬라이드 유형

### 1. 타이틀 슬라이드

```html
<section class="slide title-slide active" data-role="ALL" data-id="00" data-set="intro" id="slide-1">
  <h1>프로젝트명 스토리보드</h1>
  <p class="subtitle">스토리보드 v1.0</p>
  <div style="display:flex;gap:8px;">
    <span class="tag tag-blue">Spring Boot</span>
    <span class="tag tag-green">Thymeleaf SSR</span>
  </div>
  <div class="meta-info"><span>작성일: 2026-03-12</span></div>
</section>
```

### 2. 정보 슬라이드 (역할 정의, 화면 목록, 여정도)

```html
<section class="slide info-slide" data-role="ALL" data-id="01" data-set="intro" id="slide-2">
  <h2>역할 정의</h2>
  <table class="info-table">
    <thead><tr><th>역할명</th><th>Role 상수</th><th>색상</th><th>주요 책임</th></tr></thead>
    <tbody>
      <tr>
        <td><span class="role-dot" style="background:#3FB950;"></span>사용자</td>
        <td><code>ROLE_USER</code></td>
        <td style="color:#3FB950;">#3FB950</td>
        <td>TODO CRUD</td>
      </tr>
    </tbody>
  </table>
</section>
```

### 3. 스토리보드 슬라이드 (핵심 — 3행 구조)

```html
<section class="slide sb-slide"
         data-role="ROLE_USER"
         data-id="01"
         data-set="order"
         id="slide-3">

  <!-- 1행: 헤더 배너 -->
  <header class="slide-header">
    <span class="header-title">프로젝트명 | ROLE_USER</span>
    <span class="header-screen-id">화면 01</span>
  </header>

  <!-- 2행: 메타 배지 -->
  <div class="slide-badges">
    <span class="badge badge-method">
      <span class="method-label method-get">GET</span> /user/order/list
    </span>
    <span class="badge badge-template">user/order-list.html</span>
    <span class="badge badge-access">🔐 ROLE_USER</span>
  </div>

  <!-- 3행: 메인 (좌우 분할) -->
  <div class="slide-main">
    <div class="slide-mockup"><!-- 좌측: 화면 목업 --></div>
    <aside class="slide-panel"><!-- 우측: 4섹션 아코디언 --></aside>
  </div>
</section>
```

| 속성 | 용도 |
|------|------|
| `data-role` | 역할 색상 + 필터링 기준 (ROLE_USER, ROLE_ADMIN 등) |
| `data-id` | 화면 ID (01, 01-D, 01-F 등) |
| `data-set` | 화면 세트 그룹 (order, user-mgmt 등) — Tab 키 세트 이동 기준 |

## CSS 아키텍처

### 디자인 토큰

```css
:root {
  --color-bg: #0d1117;
  --color-surface: #161b22;
  --color-border: #21262d;
  --color-border-light: #30363d;
  --color-text: #c9d1d9;
  --color-text-dim: #8b949e;
  --color-text-bright: #f0f6fc;
  --color-link: #58a6ff;
  --font-sans: 'Noto Sans KR', sans-serif;
  --font-mono: 'Fira Code', 'Consolas', monospace;
  --slide-width: 960px;
  --slide-height: 540px;
  --role-color: #64748b;
  --role-bg: #1e293b;
  --role-text: #f1f5f9;
}
```

### 역할별 색상 — `data-role` CSS 변수

```css
[data-role="ROLE_ADMIN"]   { --role-color: #3B82F6; --role-bg: #0c2d6b; --role-text: #bfdbfe; }
[data-role="ROLE_USER"]    { --role-color: #3FB950; --role-bg: #0d2818; --role-text: #a7f3d0; }
[data-role="ROLE_MANAGER"] { --role-color: #F59E0B; --role-bg: #451a03; --role-text: #fde68a; }
[data-role="ROLE_DOCTOR"]  { --role-color: #8B5CF6; --role-bg: #2e1065; --role-text: #ddd6fe; }
```

프로젝트 역할에 맞춰 색상을 추가/변경한다. `data-role` 속성 하나로 헤더, 배지, 패널 색상이 자동 전환된다.

### 레이아웃 핵심

- **뷰포트 컨테이너**: `.presentation` — `100vw × 100vh`, `display: grid`, `place-items: center`
- **슬라이드 캔버스**: `.slides` — `960×540px`, `display: grid`, `transform: scale()`
- **슬라이드 스택**: `.slide` — `grid-area: 1/1`로 겹침, `.active`에만 `opacity: 1`
- **3행 구조**: `grid-template-rows: 44px 32px 1fr` (헤더/배지/메인)
- **좌우 분할**: `grid-template-columns: 3fr 2fr` (60% 목업 / 40% 패널)

## 좌측: 화면 목업 컴포넌트

목업 영역에서 와이어프레임 UI를 표현하는 `.mock-*` 접두사 컴포넌트를 사용한다.
실제 UI가 아닌 축소된 목업이므로 8-10px 폰트를 사용한다.

### 브라우저 프레임

```html
<div class="mock-browser">
  <div class="mock-browser-bar">
    <div class="mock-browser-dots"><span></span><span></span><span></span></div>
    <div class="mock-browser-url">/user/order/list</div>
  </div>
  <div class="mock-browser-body"><!-- 목업 내용 --></div>
</div>
```

### 목업 UI 컴포넌트 목록

| 클래스 | 용도 |
|--------|------|
| `.mock-navbar` | 네비게이션 바 (brand + links) |
| `.mock-table` | 데이터 테이블 (th/td 축소) |
| `.mock-pagination` | 페이지네이션 (`.active` 강조) |
| `.mock-form-group` + `.mock-form-label` + `.mock-form-input` | 폼 필드 |
| `.mock-form-select` | 셀렉트 박스 |
| `.mock-form-textarea` | 텍스트 영역 |
| `.mock-btn` | 버튼 기본, `.mock-btn-primary` / `.mock-btn-outline` / `.mock-btn-danger` |
| `.mock-card` | 카드 (`.mock-card-title` + `.mock-card-text`) |
| `.mock-search-bar` | 검색 바 (input + button) |
| `.mock-status` | 상태 배지 (`.mock-status-todo` / `.mock-status-doing` / `.mock-status-done`) |
| `.mock-annotation` | 클릭 포인트 번호 뱃지 (①②③) — 액션 테이블과 연결 |
| `.mock-mobile-frame` | 모바일 디바이스 프레임 |

### HTTP Method 배지 색상 (Swagger UI 기준)

```css
.method-get    { color: #61affe; }  /* 파란색 */
.method-post   { color: #49cc90; }  /* 초록색 */
.method-put    { color: #fca130; }  /* 주황색 */
.method-delete { color: #f93e3e; }  /* 빨간색 */
.method-patch  { color: #50e3c2; }  /* 청록색 */
```

## 우측: 상세 패널 (4섹션 아코디언)

`<details name="panel">` Exclusive Accordion으로 구현한다.
`name` 속성이 같으면 하나만 열리고 나머지는 자동으로 닫힌다.

```html
<aside class="slide-panel">
  <details class="panel-section" name="panel" open>
    <summary class="panel-section-header">🎯 액션 정의</summary>
    <div class="panel-section-body"><!-- 액션 테이블 --></div>
  </details>
  <details class="panel-section" name="panel">
    <summary class="panel-section-header">🚨 오류 처리</summary>
    <div class="panel-section-body"><!-- 오류 테이블 --></div>
  </details>
  <details class="panel-section" name="panel">
    <summary class="panel-section-header">📦 View Model</summary>
    <div class="panel-section-body"><!-- VM 트리 --></div>
  </details>
  <details class="panel-section" name="panel">
    <summary class="panel-section-header">🔐 유효성 / 권한</summary>
    <div class="panel-section-body"><!-- 유효성 테이블 + 권한 --></div>
  </details>
</aside>
```

주의: 슬라이드마다 `name` 값을 고유하게 설정해야 다른 슬라이드의 아코디언과 간섭하지 않는다.
예: `name="panel-s3"`, `name="panel-s4"` 등.

### 4섹션 콘텐츠 패턴

**액션 정의 테이블**: `<table class="action-table">` — 액션명 / API (method-badge + code) / 결과
**오류 처리 테이블**: `<table class="error-table">` — HTTP 상태코드 (status-badge) / 상황 / 처리
**View Model 트리**: `<ul class="vm-tree">` — `.vm-node` + `.vm-key` + `.vm-type`, 중첩 ul로 객체 표현
**유효성 테이블**: `<table class="valid-table">` — 필드 / 규칙 (rule-tag) / 오류 메시지
**권한 행**: `<div class="perm-row">` + `<span class="perm-badge">` — 인증/인가 요구사항

## JavaScript 엔진

IIFE 패턴으로 구현하는 필수 기능 10가지:

1. **뷰포트 스케일링** — `fitSlides()`: 960×540 캔버스를 뷰포트에 맞춰 `--slide-scale` 조정
2. **역할 필터링** — `applyRoleFilter(role)`: `data-role` 기반 슬라이드 필터
3. **슬라이드 전환** — `showSlide(index)`: 애니메이션 잠금 + 전환
4. **키보드 네비게이션** — `←→` 이동, `Tab` 세트 이동, `T` 목차, `F` 풀스크린, `?` 도움말
5. **세트 이동** — `nextSet()`/`prevSet()`: `data-set` 기반 화면 그룹 점프
6. **TOC 사이드바** — `toggleTOC()`: `translateX(-100%)` 슬라이드 애니메이션
7. **URL Hash 동기화** — `#role=ROLE_USER&slide=01` 형식
8. **프로그레스 바** — 하단 그라데이션 바 + 슬라이드 카운터
9. **터치/스와이프** — Pointer Events로 좌우 스와이프 감지 (threshold 50px)
10. **역할 필터 바** — 상단 우측 버튼으로 역할 전환

### 입력 잠금 패턴

```javascript
let isAnimating = false;
function showSlide(index) {
  if (isAnimating) return;
  isAnimating = true;
  // ... 전환 로직 ...
  slide.addEventListener('transitionend', handler, { once: true });
  setTimeout(() => { isAnimating = false; }, 600);
}
```

## UI 오버레이

```html
<!-- 역할 필터 바 -->
<div class="role-filter">
  <button class="role-filter-btn active" data-filter="ALL">전체</button>
  <button class="role-filter-btn" data-filter="ROLE_USER">USER</button>
  <button class="role-filter-btn" data-filter="ROLE_ADMIN">ADMIN</button>
</div>

<!-- 프로그레스 바 -->
<div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
<div class="slide-counter"><span id="counterCurrent">1</span> / <span id="counterTotal">N</span></div>

<!-- TOC 사이드바 -->
<div class="toc-overlay" id="toc-overlay"></div>
<nav class="toc-sidebar" id="toc-sidebar">
  <div class="toc-title">목차</div>
  <ul id="toc-list"></ul>
</nav>

<!-- 도움말 -->
<div class="help-overlay" id="helpOverlay">...</div>
```

## 화면 ID 명명 규칙

| 패턴 | 의미 | 예시 |
|------|------|------|
| `NN` | 목록(List) 화면 | `01`, `02` |
| `NN-D` | 상세(Detail) 화면 | `01-D` |
| `NN-F` | 등록/수정(Form) 화면 | `01-F` |
| `NN-E` | 오류/예외 화면 | `01-E` |

같은 `data-set`으로 묶어 Tab 키로 List→Detail→Form 순서로 이동할 수 있게 한다.

## 콘텐츠 제약

목업 영역의 실제 높이는 약 **464px** (540 - 44 - 32)이다.

| 제약 | 권장 |
|------|------|
| 테이블 행 수 | 3~5행 (8px 폰트 기준) |
| 폼 필드 수 | 5~6개 이내 |
| 네비바 메뉴 | 3~4개 |
| 패널 섹션 내 테이블 | 5행 이내 |
| VM 트리 깊이 | 2단계 이내 |

내용이 많으면 슬라이드를 분할한다 (예: 01-1, 01-2).

## 키보드 단축키

| 키 | 기능 |
|----|------|
| `←` `→` `Space` `PageUp/Down` | 이전/다음 슬라이드 |
| `Home` / `End` | 처음/끝 슬라이드 |
| `Tab` / `Shift+Tab` | 다음/이전 화면 세트 |
| `T` | 목차 사이드바 토글 |
| `F` | 풀스크린 토글 |
| `?` | 도움말 표시 |
| `Escape` | 풀스크린/목차 닫기 |

## 체크리스트

- [ ] 단일 HTML 파일로 완성
- [ ] 외부 라이브러리 미사용 (웹폰트만 허용)
- [ ] CSS 변수로 디자인 토큰 관리
- [ ] `grid-area: 1/1` 슬라이드 스택
- [ ] `transform: scale()` 뷰포트 스케일링
- [ ] 3행 그리드: `44px 32px 1fr`
- [ ] 좌우 분할: `3fr 2fr`
- [ ] `data-role` 역할별 CSS 변수 색상
- [ ] `<details name>` Exclusive Accordion
- [ ] 4섹션 패널: 액션/오류/VM/유효성
- [ ] `.mock-*` 컴포넌트로 목업 구현
- [ ] 역할 필터 바 + URL hash 동기화
- [ ] 세트 이동 (`data-set` + Tab)
- [ ] TOC 사이드바 (`T` 키)
- [ ] 입력 잠금 (isAnimating + setTimeout)
- [ ] 목업 영역 콘텐츠 오버플로 없음
- [ ] `counterTotal` 값이 실제 슬라이드 수와 일치
- [ ] 각 슬라이드의 `name` 속성이 고유 (아코디언 간섭 방지)

## 상세 구현 참조

`references/architecture.md`에 전체 CSS 코드, 전체 JS 엔진 코드, 목업 컴포넌트 상세, 고급 패턴이 수록되어 있다.

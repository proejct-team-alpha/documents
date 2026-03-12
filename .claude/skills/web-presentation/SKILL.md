---
name: web-presentation
description: >
  순수 HTML, CSS, JavaScript만으로 웹 기반 슬라이드 프레젠테이션을 구현하는 스킬.
  외부 라이브러리 없이 단일 HTML 파일로 완성되는 프레젠테이션을 만든다.
  사용자가 프레젠테이션, 슬라이드, 발표 자료, PPT 대체, 웹 슬라이드, HTML 슬라이드,
  강의 자료, 세미나 발표, 학습 자료 프레젠테이션 등을 언급하면 이 스킬을 사용한다.
  reveal.js 같은 외부 라이브러리 대신 바닐라로 직접 구현하고 싶다는 맥락에서도 트리거된다.
---

# 바닐라 웹 프레젠테이션 스킬

순수 HTML, CSS, JavaScript만으로 웹 기반 슬라이드 프레젠테이션을 구현한다.
단일 `.html` 파일로 완성되며, 외부 의존성이 없다.

## 핵심 원칙

1. **단일 파일**: 모든 HTML, CSS, JS가 하나의 `.html` 파일에 포함
2. **외부 의존성 제로**: reveal.js, impress.js 등 외부 라이브러리 사용 금지 (웹폰트만 허용)
3. **960×540 고정 캔버스**: `transform: scale()`로 뷰포트에 맞춰 자동 스케일링
4. **자동 순차 등장**: 방향키는 페이지 단위 이동, Fragment는 슬라이드 진입 시 자동 등장
5. **다크 테마 기본**: 어두운 배경에 밝은 텍스트, 프레젠테이션에 최적화된 가독성

## 구현 순서

1. 사용자의 프레젠테이션 주제와 슬라이드 구성을 파악
2. `references/architecture.md`를 읽고 상세 구현 패턴 확인
3. 아래 구조 템플릿에 따라 단일 HTML 파일 작성
4. 콘텐츠 오버플로 검증 (슬라이드당 콘텐츠 영역 약 460px)

## HTML 구조

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>프레젠테이션 제목</title>
  <style>/* CSS 전체 */</style>
</head>
<body>
  <main class="presentation">
    <div class="slides">
      <section class="slide title-slide active" id="slide-1">
        <div class="slide-content">...</div>
      </section>
      <section class="slide" id="slide-2">
        <div class="slide-content">...</div>
      </section>
      <!-- 추가 슬라이드 -->
    </div>
  </main>

  <!-- UI 오버레이 -->
  <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
  <div class="slide-counter"><span id="counterCurrent">1</span> / <span id="counterTotal">N</span></div>

  <!-- 도움말 오버레이 -->
  <div class="help-overlay" id="helpOverlay">...</div>

  <script>/* JS 엔진 전체 */</script>
</body>
</html>
```

## CSS 아키텍처

### 디자인 토큰 (CSS 변수)

```css
:root {
  --color-bg: #0f0f23;
  --color-surface: #1a1a2e;
  --color-primary: #4fc3f7;
  --color-secondary: #e040fb;
  --color-accent: #ffd740;
  --color-text: #e0e0e0;
  --color-text-dim: #888;
  --color-success: #66bb6a;
  --color-danger: #ef5350;
  --font-sans: 'Noto Sans KR', sans-serif;
  --font-mono: 'Fira Code', 'Consolas', monospace;
  --slide-width: 960px;
  --slide-height: 540px;
}
```

색상 팔레트는 주제에 맞게 조정할 수 있지만, 다크 배경 + 고대비 텍스트 원칙은 유지한다.

### 레이아웃 핵심

- **뷰포트 컨테이너**: `.presentation` — `100vw × 100vh`, `display: grid`, `place-items: center`
- **슬라이드 캔버스**: `.slides` — `960×540px`, `display: grid`, `transform: scale(var(--slide-scale))`
- **슬라이드 스택**: `.slide` — `grid-area: 1/1`로 모든 슬라이드가 같은 셀에 겹침
- **활성 슬라이드**: `.slide.active` — `opacity: 1`, `visibility: visible`, `z-index: 1`

`grid-area: 1/1` 패턴으로 `position: absolute` 없이 자연스러운 슬라이드 스택을 구현한다.

## 슬라이드 유형

### 타이틀 슬라이드

```html
<section class="slide title-slide active" id="slide-1">
  <div class="slide-content">
    <h1>프레젠테이션 제목</h1>
    <p class="subtitle fragment" data-step="1">부제목</p>
    <p class="fragment" data-step="2">
      <span class="tag tag-blue">태그1</span>
      <span class="tag tag-purple">태그2</span>
    </p>
  </div>
</section>
```

- `background: linear-gradient(135deg, ...)` 그라데이션 배경
- h1에 `background-clip: text` 그라데이션 텍스트 효과

### 섹션 구분 슬라이드

```html
<section class="slide section-slide" id="slide-N">
  <div class="slide-content" style="text-align: center;">
    <h2>섹션 제목</h2>
  </div>
</section>
```

### 콘텐츠 슬라이드

일반 콘텐츠, 코드 블록, 테이블, 다이어그램 등을 포함하는 기본 슬라이드.

## 콘텐츠 컴포넌트

### Fragment (자동 순차 등장)

```html
<li class="fragment" data-step="1">첫 번째 항목</li>
<li class="fragment" data-step="2">두 번째 항목</li>
```

- `data-step` 값이 같은 요소는 동시에 등장
- 슬라이드 진입 시 `(step - 1) * 0.2초` 딜레이로 자동 순차 등장
- 방향키는 Fragment 개별 진행이 아닌 **페이지 단위 이동**

### 코드 블록

```html
<div class="code-block">
<pre><span class="keyword">const</span> <span class="attr">x</span> = <span class="number">42</span>;</pre>
</div>
```

구문 강조 클래스: `.comment`, `.keyword`, `.string`, `.func`, `.type`, `.number`, `.attr`

### 2단 레이아웃

```html
<div class="two-columns">
  <div class="column">왼쪽 내용</div>
  <div class="column">오른쪽 내용</div>
</div>
```

### 다이어그램 (플로우)

```html
<div class="diagram">
  <div class="diagram-box"><h4>A</h4><p>설명</p></div>
  <span class="diagram-arrow">→</span>
  <div class="diagram-box highlight"><h4>B</h4><p>강조</p></div>
</div>
```

### 콜아웃

```html
<div class="callout">기본 정보</div>
<div class="callout warning">주의사항</div>
<div class="callout danger">위험/금지 사항</div>
```

### 비교 카드

```html
<div class="compare-grid">
  <div class="compare-card good"><h4>좋은 예</h4><p>설명</p></div>
  <div class="compare-card bad"><h4>나쁜 예</h4><p>설명</p></div>
</div>
```

### 태그

```html
<span class="tag tag-blue">파란색</span>
<span class="tag tag-purple">보라색</span>
<span class="tag tag-yellow">노란색</span>
<span class="tag tag-green">초록색</span>
<span class="tag tag-red">빨간색</span>
```

### 테이블

표준 `<table>` 사용. 헤더는 `--color-primary` 배경, 행 구분은 얇은 border.

## JavaScript 엔진

필수 기능 8가지를 IIFE 패턴으로 구현한다:

1. **뷰포트 스케일링** — `fitSlides()`: 960×540 캔버스를 뷰포트에 맞춰 `--slide-scale` 조정
2. **Fragment 자동 등장** — `autoRevealFragments(slide)`: `data-step` 기반 `transition-delay` 설정 후 `.visible` 추가
3. **Fragment 리셋** — `resetFragments(slide)`: 슬라이드 이탈 시 `.visible` 제거
4. **슬라이드 전환** — `showSlide(index)`: 애니메이션 잠금, 이전 슬라이드 리셋, 새 슬라이드 활성화
5. **키보드 네비게이션** — `←→`, `Home/End`, `F`(풀스크린), `?`(도움말), `Space`, `PageUp/Down`
6. **터치/스와이프** — Pointer Events로 좌우 스와이프 감지 (threshold 50px)
7. **URL Hash 동기화** — `#slide-N` 형식, `replaceState`로 히스토리 오염 방지
8. **프로그레스 바** — 하단 그라데이션 바 + 슬라이드 카운터

### 입력 잠금 패턴

```javascript
let isAnimating = false;

function showSlide(index) {
  if (isAnimating) return;
  isAnimating = true;
  // ... 전환 로직 ...
  // transitionend + setTimeout 이중 해제
  slide.addEventListener('transitionend', handler, { once: true });
  setTimeout(() => { isAnimating = false; }, 600);
}
```

`transitionend`가 간혹 미발생하므로 `setTimeout` 안전장치를 반드시 포함한다.

## 콘텐츠 오버플로 방지

슬라이드 패딩(상하 40px)을 제외한 실제 콘텐츠 영역은 약 **460px**이다.

| 제약 | 권장 |
|------|------|
| 코드 블록 | 15줄 이내 |
| 리스트 항목 | 6~8개 이내 |
| 테이블 + 코드 공존 | 슬라이드 분할 고려 |

내용이 많으면 슬라이드를 나누거나 `two-columns`로 수직 공간을 절약한다.

## 체크리스트

- [ ] 단일 HTML 파일로 완성
- [ ] 외부 라이브러리 미사용 (웹폰트만 허용)
- [ ] CSS 변수로 디자인 토큰 관리
- [ ] `grid-area: 1/1` 슬라이드 스택
- [ ] `transform: scale()` 뷰포트 스케일링
- [ ] Fragment 자동 순차 등장 (`data-step` + `transition-delay`)
- [ ] 방향키 = 페이지 단위 이동 (Fragment 개별 진행 아님)
- [ ] 키보드, 터치, URL hash 네비게이션
- [ ] 프로그레스 바 + 슬라이드 카운터
- [ ] 도움말 오버레이 (`?` 키)
- [ ] 풀스크린 지원 (`F` 키)
- [ ] 입력 잠금 (isAnimating + setTimeout 안전장치)
- [ ] 콘텐츠 오버플로 없음
- [ ] `counterTotal` 값이 실제 슬라이드 수와 일치

## 상세 구현 참조

`references/architecture.md`에 CSS 전체 코드, JS 엔진 전체 코드, 고급 패턴(발표자 뷰, 코드 라인 하이라이트 등)이 수록되어 있다. 복잡한 프레젠테이션을 구현할 때 참고한다.

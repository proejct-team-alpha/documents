# 웹 프레젠테이션 상세 구현 참조

SKILL.md의 요약을 보완하는 전체 CSS/JS 코드와 고급 패턴을 담고 있다.

## 목차

1. [전체 CSS 코드](#1-전체-css-코드)
2. [전체 JS 엔진 코드](#2-전체-js-엔진-코드)
3. [도움말 오버레이 HTML](#3-도움말-오버레이-html)
4. [고급 패턴](#4-고급-패턴)

---

## 1. 전체 CSS 코드

```css
/* ─── 리셋 ─── */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

/* ─── 웹폰트 ─── */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=Fira+Code:wght@400;500&display=swap');

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

html, body {
  width: 100%; height: 100%;
  overflow: hidden;
  background: var(--color-bg);
  font-family: var(--font-sans);
  color: var(--color-text);
}

/* ═══ 슬라이드 레이아웃 ═══ */

.presentation {
  width: 100vw; height: 100vh;
  display: grid; place-items: center;
  overflow: hidden;
}

.slides {
  width: var(--slide-width); height: var(--slide-height);
  position: relative; display: grid;
  transform: scale(var(--slide-scale, 1));
  transform-origin: center center;
}

.slide {
  grid-area: 1 / 1;
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 40px 56px;
  opacity: 0; visibility: hidden;
  transition: opacity 0.5s ease, transform 0.5s ease, visibility 0.5s;
  background: var(--color-surface);
  border-radius: 8px; overflow: hidden;
  transform: scale(0.95);
}

.slide.active {
  opacity: 1; visibility: visible;
  z-index: 1; transform: scale(1);
}

.slide-content { width: 100%; max-height: 100%; }

/* ═══ 타이포그래피 ═══ */

.slide h1 { font-size: 42px; font-weight: 900; color: #fff; margin-bottom: 12px; line-height: 1.3; }
.slide h2 { font-size: 30px; font-weight: 700; color: var(--color-primary); margin-bottom: 18px; line-height: 1.3; }
.slide h3 { font-size: 20px; font-weight: 500; color: var(--color-accent); margin-bottom: 12px; }
.slide p  { font-size: 18px; line-height: 1.6; color: var(--color-text); margin-bottom: 10px; }
.slide .subtitle { font-size: 22px; color: var(--color-text-dim); font-weight: 300; }

.slide ul, .slide ol { font-size: 18px; line-height: 1.7; padding-left: 24px; margin-bottom: 10px; }
.slide li { margin-bottom: 4px; }

.slide strong { color: var(--color-primary); }
.slide em { color: var(--color-accent); font-style: normal; }

/* ─── 태그 ─── */
.tag { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 13px; font-weight: 500; margin: 2px 4px; }
.tag-blue   { background: rgba(79,195,247,0.2); color: var(--color-primary); }
.tag-purple { background: rgba(224,64,251,0.2); color: var(--color-secondary); }
.tag-yellow { background: rgba(255,215,64,0.2); color: var(--color-accent); }
.tag-green  { background: rgba(102,187,106,0.2); color: var(--color-success); }
.tag-red    { background: rgba(239,83,80,0.2); color: var(--color-danger); }

/* ─── 타이틀 슬라이드 ─── */
.slide.title-slide {
  text-align: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}
.slide.title-slide h1 {
  font-size: 48px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.slide.title-slide .subtitle { font-size: 24px; margin-top: 8px; }

/* ─── 섹션 슬라이드 ─── */
.slide.section-slide {
  text-align: center;
  background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%);
}
.slide.section-slide h2 { font-size: 36px; color: #fff; }

/* ═══ 테이블 ═══ */

.slide table { width: 100%; border-collapse: collapse; font-size: 15px; margin: 10px 0; }
.slide th { background: rgba(79,195,247,0.15); color: var(--color-primary); padding: 8px 12px; text-align: left; font-weight: 500; border-bottom: 2px solid rgba(79,195,247,0.3); }
.slide td { padding: 6px 12px; border-bottom: 1px solid rgba(255,255,255,0.08); }

/* ═══ 코드 블록 ═══ */

.code-block { background: #0d1117; border-radius: 8px; padding: 14px 18px; margin: 10px 0; overflow-x: auto; border: 1px solid rgba(255,255,255,0.08); }
.code-block pre { margin: 0; font-family: var(--font-mono); font-size: 14px; line-height: 1.55; color: #d4d4d4; }
.code-block .comment { color: #6a9955; }
.code-block .keyword { color: #c586c0; }
.code-block .string  { color: #ce9178; }
.code-block .func    { color: #dcdcaa; }
.code-block .type    { color: #4ec9b0; }
.code-block .number  { color: #b5cea8; }
.code-block .attr    { color: #9cdcfe; }

.slide code:not(pre code) { font-family: var(--font-mono); font-size: 0.85em; background: rgba(79,195,247,0.12); color: var(--color-primary); padding: 2px 8px; border-radius: 4px; }

/* ═══ 다이어그램 / 시각 요소 ═══ */

.diagram { display: flex; align-items: center; justify-content: center; gap: 16px; margin: 16px 0; flex-wrap: wrap; }
.diagram-box { background: rgba(79,195,247,0.08); border: 2px solid rgba(79,195,247,0.3); border-radius: 12px; padding: 12px 20px; text-align: center; min-width: 120px; transition: all 0.3s ease; }
.diagram-box.highlight { border-color: var(--color-primary); background: rgba(79,195,247,0.15); box-shadow: 0 0 20px rgba(79,195,247,0.2); }
.diagram-box h4 { font-size: 15px; color: var(--color-primary); margin-bottom: 4px; }
.diagram-box p  { font-size: 13px; color: var(--color-text-dim); margin: 0; }
.diagram-arrow { font-size: 22px; color: var(--color-text-dim); }

.two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: start; }

.callout { background: rgba(79,195,247,0.08); border-left: 4px solid var(--color-primary); padding: 12px 18px; border-radius: 0 8px 8px 0; margin: 10px 0; font-size: 16px; }
.callout.warning { border-left-color: var(--color-accent); background: rgba(255,215,64,0.08); }
.callout.danger  { border-left-color: var(--color-danger); background: rgba(239,83,80,0.08); }

.compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 12px 0; }
.compare-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; }
.compare-card h4 { font-size: 16px; margin-bottom: 8px; }
.compare-card.good { border-color: rgba(102,187,106,0.4); }
.compare-card.good h4 { color: var(--color-success); }
.compare-card.bad  { border-color: rgba(239,83,80,0.4); }
.compare-card.bad h4  { color: var(--color-danger); }

/* ═══ 프래그먼트 ═══ */

.fragment {
  opacity: 0; transform: translateY(16px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  transition-delay: var(--step-delay, 0s);
}
.fragment.visible { opacity: 1; transform: translateY(0); }

/* ═══ UI 오버레이 ═══ */

.progress-bar { position: fixed; bottom: 0; left: 0; width: 100%; height: 4px; background: rgba(255,255,255,0.1); z-index: 100; }
.progress-fill { height: 100%; width: 0%; background: linear-gradient(90deg, var(--color-primary), var(--color-secondary)); transition: width 0.3s ease-out; }
.slide-counter { position: fixed; bottom: 14px; right: 24px; font-size: 14px; font-family: var(--font-mono); color: rgba(255,255,255,0.4); z-index: 100; user-select: none; }

.help-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 200; display: none; place-items: center; }
.help-overlay.show { display: grid; }
.help-content { background: var(--color-surface); border-radius: 16px; padding: 32px 40px; max-width: 460px; width: 90%; }
.help-content h3 { color: var(--color-primary); font-size: 22px; margin-bottom: 16px; }
.help-content table { width: 100%; font-size: 15px; }
.help-content td { padding: 5px 0; border: none; }
.help-content kbd { display: inline-block; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; padding: 2px 8px; font-family: var(--font-mono); font-size: 13px; min-width: 28px; text-align: center; }

.hide-cursor { cursor: none; }
```

---

## 2. 전체 JS 엔진 코드

```javascript
(function () {
  'use strict';

  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let currentSlide = 0;
  let isAnimating = false;

  const progressFill = document.getElementById('progressFill');
  const counterCurrent = document.getElementById('counterCurrent');
  const counterTotal = document.getElementById('counterTotal');
  const helpOverlay = document.getElementById('helpOverlay');

  counterTotal.textContent = totalSlides;

  const STEP_DELAY = 0.2; // 자동 등장 딜레이 (초)

  // ═══ 1. 뷰포트 스케일링 ═══

  function fitSlides() {
    const container = document.querySelector('.presentation');
    const slidesEl = document.querySelector('.slides');
    const W = 960, H = 540, MARGIN = 0.04;

    const aw = container.clientWidth  * (1 - MARGIN * 2);
    const ah = container.clientHeight * (1 - MARGIN * 2);
    const scale = Math.min(aw / W, ah / H);

    slidesEl.style.setProperty('--slide-scale', scale);
  }

  window.addEventListener('resize', fitSlides);
  fitSlides();

  // ═══ 2. 프래그먼트 — 자동 순차 등장 ═══

  function autoRevealFragments(slide) {
    const fragments = slide.querySelectorAll('.fragment');
    fragments.forEach(f => {
      const step = parseInt(f.dataset.step) || 1;
      f.style.setProperty('--step-delay', (step - 1) * STEP_DELAY + 's');
      f.classList.add('visible');
    });
  }

  function resetFragments(slide) {
    const fragments = slide.querySelectorAll('.fragment');
    fragments.forEach(f => {
      f.style.setProperty('--step-delay', '0s');
      f.classList.remove('visible');
    });
  }

  // 초기 상태: 첫 슬라이드만 자동 등장
  slides.forEach((slide, i) => {
    if (i === 0) autoRevealFragments(slide);
    else resetFragments(slide);
  });

  // ═══ 3. 슬라이드 전환 ═══

  function showSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    if (isAnimating) return;

    isAnimating = true;

    resetFragments(slides[currentSlide]);
    slides[currentSlide].classList.remove('active');

    currentSlide = index;
    slides[currentSlide].classList.add('active');

    setTimeout(() => {
      autoRevealFragments(slides[currentSlide]);
    }, 150);

    history.replaceState(null, '', '#slide-' + (currentSlide + 1));
    updateProgress();

    slides[currentSlide].addEventListener('transitionend', function handler(e) {
      if (e.propertyName === 'opacity') {
        isAnimating = false;
        slides[currentSlide].removeEventListener('transitionend', handler);
      }
    });
    setTimeout(() => { isAnimating = false; }, 600);
  }

  // ═══ 4. 키보드 네비게이션 ═══

  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea, select') || e.target.isContentEditable) return;
    if (e.repeat) return;

    if (helpOverlay.classList.contains('show')) {
      if (e.key === 'Escape' || e.key === '?') {
        helpOverlay.classList.remove('show');
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': case ' ': case 'PageDown':
        e.preventDefault(); showSlide(currentSlide + 1); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp':
        e.preventDefault(); showSlide(currentSlide - 1); break;
      case 'Home':
        e.preventDefault(); showSlide(0); break;
      case 'End':
        e.preventDefault(); showSlide(totalSlides - 1); break;
      case 'f': case 'F':
        e.preventDefault(); toggleFullscreen(); break;
      case '?':
        e.preventDefault(); helpOverlay.classList.toggle('show'); break;
      case 'Escape':
        if (document.fullscreenElement) document.exitFullscreen(); break;
    }
  });

  // ═══ 5. 터치 / 스와이프 ═══

  let pointerStartX = 0, pointerStartY = 0;
  const SWIPE_THRESHOLD = 50, SWIPE_RESTRAINT = 100;

  document.addEventListener('pointerdown', (e) => {
    pointerStartX = e.clientX;
    pointerStartY = e.clientY;
  });

  document.addEventListener('pointerup', (e) => {
    const diffX = e.clientX - pointerStartX;
    const diffY = e.clientY - pointerStartY;
    if (Math.abs(diffX) > SWIPE_THRESHOLD && Math.abs(diffY) < SWIPE_RESTRAINT) {
      diffX < 0 ? showSlide(currentSlide + 1) : showSlide(currentSlide - 1);
    }
  });

  // ═══ 6. URL Hash 복원 ═══

  function restoreFromHash() {
    const match = location.hash.match(/^#slide-(\d+)$/);
    if (match) {
      const index = parseInt(match[1]) - 1;
      if (index >= 0 && index < totalSlides) showSlide(index);
    }
  }

  window.addEventListener('hashchange', restoreFromHash);
  restoreFromHash();

  // ═══ 7. 프로그레스 바 ═══

  function updateProgress() {
    const pct = totalSlides > 1 ? (currentSlide / (totalSlides - 1)) * 100 : 100;
    progressFill.style.width = pct + '%';
    counterCurrent.textContent = currentSlide + 1;
  }
  updateProgress();

  // ═══ 8. 풀스크린 ═══

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }

  let cursorTimer = null;
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      cursorTimer = setTimeout(() => document.body.classList.add('hide-cursor'), 2000);
    } else {
      clearTimeout(cursorTimer);
      document.body.classList.remove('hide-cursor');
    }
  });

  document.addEventListener('mousemove', () => {
    if (document.fullscreenElement) {
      document.body.classList.remove('hide-cursor');
      clearTimeout(cursorTimer);
      cursorTimer = setTimeout(() => document.body.classList.add('hide-cursor'), 2000);
    }
  });

})();
```

---

## 3. 도움말 오버레이 HTML

```html
<div class="help-overlay" id="helpOverlay">
  <div class="help-content">
    <h3>키보드 단축키</h3>
    <table>
      <tr><td><kbd>&rarr;</kbd> <kbd>Space</kbd></td><td>다음 슬라이드</td></tr>
      <tr><td><kbd>&larr;</kbd></td><td>이전 슬라이드</td></tr>
      <tr><td><kbd>Home</kbd></td><td>첫 슬라이드</td></tr>
      <tr><td><kbd>End</kbd></td><td>마지막 슬라이드</td></tr>
      <tr><td><kbd>F</kbd></td><td>풀스크린 토글</td></tr>
      <tr><td><kbd>?</kbd></td><td>이 도움말 토글</td></tr>
    </table>
    <p style="margin-top: 14px; font-size: 13px; color: var(--color-text-dim);">
      터치 기기: 좌/우 스와이프로 네비게이션 | 내부 요소는 자동 등장
    </p>
  </div>
</div>
```

---

## 4. 고급 패턴

### 4.1 발표자 뷰 (BroadcastChannel)

메인 창과 발표자 뷰를 `BroadcastChannel`로 양방향 동기화한다.

```html
<!-- 슬라이드 내부에 숨김 노트 -->
<aside class="speaker-notes" hidden>
  이 슬라이드에서 강조할 포인트...
</aside>
```

```javascript
// 메인 창에서 발표자 뷰로 동기화
const channel = new BroadcastChannel('presenter-sync');

function syncPresenterView() {
  const notes = slides[currentSlide].querySelector('.speaker-notes')?.textContent || '';
  channel.postMessage({
    type: 'slide-change',
    slideIndex: currentSlide,
    totalSlides: totalSlides,
    notes: notes
  });
}
```

### 4.2 코드 라인 하이라이트

`data-highlight-lines="1-3|5|7-9"` 속성으로 스텝별 줄 강조를 구현한다.

```css
.code-line {
  display: block; padding: 0 0.5em;
  transition: background-color 0.3s ease, opacity 0.3s ease;
}
.code-line.highlighted {
  background-color: rgba(255, 255, 100, 0.15);
  border-left: 3px solid #ffd700;
}
.code-block.has-highlight .code-line:not(.highlighted) {
  opacity: 0.35;
}
```

### 4.3 다양한 Fragment 효과

```css
/* slide-up */
.fragment.slide-up { transform: translateY(40px); }
.fragment.slide-up.visible { transform: translateY(0); }

/* grow */
.fragment.grow { transform: scale(0.5); }
.fragment.grow.visible { transform: scale(1); }

/* blur-in */
.fragment.blur-in { filter: blur(8px); }
.fragment.blur-in.visible { filter: blur(0); }
```

### 4.4 슬라이드 전환 효과 변형

기본은 fade + scale이며, 필요시 다른 전환 효과를 적용할 수 있다.

**Slide (좌우 이동)**:
```css
.slide { transform: translateX(100%); transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
.slide.active { transform: translateX(0); z-index: 1; }
.slide.prev { transform: translateX(-100%); }
```

**Zoom**:
```css
.slide { opacity: 0; transform: scale(0.8); transition: opacity 0.5s ease, transform 0.5s ease; }
.slide.active { opacity: 1; transform: scale(1); }
```

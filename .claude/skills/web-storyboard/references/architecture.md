# 웹 스토리보드 상세 구현 참조

SKILL.md의 요약을 보완하는 전체 CSS/JS 코드와 목업 컴포넌트 상세를 담고 있다.

## 목차

1. [전체 CSS 코드](#1-전체-css-코드)
2. [목업 컴포넌트 CSS](#2-목업-컴포넌트-css)
3. [패널 컴포넌트 CSS](#3-패널-컴포넌트-css)
4. [전체 JS 엔진 코드](#4-전체-js-엔진-코드)
5. [HTML 오버레이 템플릿](#5-html-오버레이-템플릿)
6. [목업 조합 예시](#6-목업-조합-예시)

---

## 1. 전체 CSS 코드

```css
/* ─── 리셋 ─── */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

/* ─── 웹폰트 ─── */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=Fira+Code:wght@400;500&display=swap');

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

html, body {
  width: 100%; height: 100%;
  overflow: hidden;
  background: #010409;
  font-family: var(--font-sans);
  color: var(--color-text);
}

/* ═══ 역할별 색상 ═══ */
[data-role="ROLE_USER"]    { --role-color: #3FB950; --role-bg: #0d2818; --role-text: #a7f3d0; }
[data-role="ROLE_ADMIN"]   { --role-color: #58a6ff; --role-bg: #0c2d6b; --role-text: #bfdbfe; }
[data-role="ROLE_MANAGER"] { --role-color: #F59E0B; --role-bg: #451a03; --role-text: #fde68a; }
[data-role="ROLE_DOCTOR"]  { --role-color: #8B5CF6; --role-bg: #2e1065; --role-text: #ddd6fe; }

/* ═══ 슬라이드 레이아웃 ═══ */
.presentation {
  width: 100vw; height: 100vh;
  display: grid; place-items: center;
  background: #010409;
}

.slides {
  width: var(--slide-width);
  height: var(--slide-height);
  display: grid;
  transform: scale(var(--slide-scale, 1));
  transform-origin: center center;
  overflow: hidden;
  position: relative;
}

.slide {
  grid-area: 1 / 1;
  width: 100%; height: 100%;
  opacity: 0; visibility: hidden;
  transition: opacity 0.45s ease, visibility 0.45s;
  background: var(--color-bg);
  overflow: hidden;
}

.slide.active { opacity: 1; visibility: visible; z-index: 1; }

/* ═══ 타이틀 슬라이드 ═══ */
.title-slide {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center;
  background: linear-gradient(135deg, #0d1117 0%, #161b22 40%, #1a1f35 100%);
}

.title-slide h1 {
  font-size: 36px; font-weight: 900;
  background: linear-gradient(135deg, #58a6ff, #3FB950);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
}

.title-slide .subtitle { font-size: 16px; color: var(--color-text-dim); margin-bottom: 20px; }
.title-slide .meta-info { display: flex; gap: 16px; font-size: 12px; color: var(--color-text-dim); }

.tag {
  display: inline-block; padding: 3px 10px; border-radius: 12px;
  font-size: 11px; font-weight: 600;
}
.tag-blue   { background: rgba(88,166,255,0.15); color: #58a6ff; }
.tag-green  { background: rgba(63,185,80,0.15);  color: #3FB950; }
.tag-purple { background: rgba(188,140,255,0.15); color: #bc8cff; }
.tag-yellow { background: rgba(210,153,34,0.15);  color: #d29922; }

/* ═══ 정보 슬라이드 ═══ */
.info-slide {
  display: flex; flex-direction: column; padding: 40px 48px;
}

.info-slide h2 {
  font-size: 22px; font-weight: 700; color: var(--color-text-bright);
  margin-bottom: 20px; padding-bottom: 10px;
  border-bottom: 2px solid var(--color-border);
}

.info-slide h3 {
  font-size: 14px; font-weight: 600; color: var(--color-link); margin: 14px 0 8px;
}

.info-table {
  width: 100%; border-collapse: collapse; font-size: 12px;
}
.info-table th {
  background: var(--color-surface); color: var(--color-link);
  padding: 6px 10px; text-align: left; font-weight: 600;
  border-bottom: 1px solid var(--color-border-light);
}
.info-table td {
  padding: 5px 10px; border-bottom: 1px solid var(--color-border); color: var(--color-text);
}

.role-dot {
  display: inline-block; width: 10px; height: 10px;
  border-radius: 50%; margin-right: 6px; vertical-align: middle;
}

/* ═══ 스토리보드 슬라이드 (3행 구조) ═══ */
.sb-slide {
  display: grid;
  grid-template-rows: 44px 32px 1fr;
  grid-template-areas: "header" "badges" "main";
}

/* 1행: 헤더 배너 */
.slide-header {
  grid-area: header;
  background: var(--role-bg);
  border-bottom: 2px solid var(--role-color);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 16px;
  color: var(--role-text);
  font-size: 12px; font-weight: 600;
}

.header-screen-id {
  font-size: 11px; opacity: 0.7;
  background: rgba(255,255,255,0.08);
  padding: 2px 8px; border-radius: 10px;
}

/* 2행: 메타 배지 */
.slide-badges {
  grid-area: badges;
  display: flex; align-items: center; gap: 8px;
  padding: 0 16px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 10px; border-radius: 10px;
  font-size: 10px; font-weight: 600; white-space: nowrap;
}

.badge-method  { background: #1a3a1a; color: #4ade80; border: 1px solid #166534; }
.badge-template{ background: #1a2a3a; color: #93c5fd; border: 1px solid #1e40af; }
.badge-access  { background: var(--role-bg); color: var(--role-text); border: 1px solid var(--role-color); }

.method-label { font-family: var(--font-mono); font-weight: 700; }
.method-get    { color: #61affe; }
.method-post   { color: #49cc90; }
.method-put    { color: #fca130; }
.method-delete { color: #f93e3e; }
.method-patch  { color: #50e3c2; }

/* 3행: 메인 (좌우 분할) */
.slide-main {
  grid-area: main;
  display: grid;
  grid-template-columns: 3fr 2fr;
  overflow: hidden;
}

/* ═══ 여정도 슬라이드 ═══ */
.journey-flow {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin: 10px 0;
}
.journey-node {
  background: var(--color-surface); border: 1px solid var(--color-border-light);
  border-radius: 6px; padding: 8px 14px; font-size: 11px;
  color: var(--color-text); text-align: center; min-width: 80px;
}
.journey-node.start { border-color: var(--role-color); color: var(--role-color); font-weight: 700; }
.journey-arrow { color: var(--color-text-dim); font-size: 16px; }

/* ═══ 역할 필터 바 ═══ */
.role-filter {
  position: fixed; top: 8px; right: 8px; z-index: 100;
  display: flex; gap: 4px; background: rgba(22,27,34,0.95);
  padding: 4px 8px; border-radius: 8px;
  border: 1px solid var(--color-border);
}
.role-filter-btn {
  padding: 3px 10px; border-radius: 6px; border: 1px solid var(--color-border-light);
  background: transparent; color: var(--color-text-dim);
  font-size: 10px; font-weight: 600; cursor: pointer;
  font-family: var(--font-sans); transition: all 0.15s;
}
.role-filter-btn:hover { background: var(--color-surface); }
.role-filter-btn.active { background: var(--color-border-light); color: var(--color-text-bright); }

/* ═══ 프로그레스 바 & 카운터 ═══ */
.progress-bar {
  position: fixed; bottom: 0; left: 0; width: 100%; height: 3px;
  background: rgba(255,255,255,0.05); z-index: 100;
}
.progress-fill {
  height: 100%; width: 0%;
  background: linear-gradient(90deg, #58a6ff, #3FB950);
  transition: width 0.3s ease;
}
.slide-counter {
  position: fixed; bottom: 8px; right: 12px; z-index: 100;
  font-size: 11px; color: var(--color-text-dim); font-family: var(--font-mono);
}

/* ═══ TOC 사이드바 ═══ */
.toc-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  z-index: 999; opacity: 0; pointer-events: none;
  transition: opacity 0.25s ease;
}
.toc-overlay.visible { opacity: 1; pointer-events: auto; }

.toc-sidebar {
  position: fixed; top: 0; left: 0;
  width: 280px; height: 100vh;
  background: var(--color-surface); color: var(--color-text);
  overflow-y: auto; z-index: 1000; padding: 1.5rem;
  transform: translateX(-100%);
  transition: transform 0.25s ease;
  border-right: 1px solid var(--color-border);
}
.toc-sidebar.toc-open { transform: translateX(0); }

.toc-title {
  font-size: 14px; font-weight: 700; color: var(--color-text-bright);
  margin-bottom: 16px; padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}

#toc-list { list-style: none; }

.toc-set-header {
  font-size: 10px; font-weight: 700; color: var(--color-link);
  text-transform: uppercase; letter-spacing: 0.1em;
  padding: 10px 0 4px; margin-top: 4px;
  border-top: 1px solid var(--color-border);
}
.toc-set-header:first-child { border-top: none; margin-top: 0; }

.toc-item {
  padding: 5px 8px; font-size: 11px; cursor: pointer;
  border-radius: 4px; transition: background 0.1s;
  display: flex; align-items: center; gap: 8px;
}
.toc-item:hover { background: var(--color-border); }
.toc-item.active { background: rgba(88,166,255,0.12); color: var(--color-link); }

.toc-role-badge {
  font-size: 9px; padding: 1px 5px; border-radius: 8px;
  background: var(--color-border); color: var(--color-text-dim); font-weight: 600;
}

/* ═══ 도움말 오버레이 ═══ */
.help-overlay {
  position: fixed; inset: 0; z-index: 3000;
  background: rgba(1,4,9,0.92);
  display: none; place-items: center;
}
.help-overlay.show { display: grid; }

.help-box {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 12px; padding: 32px 40px;
  max-width: 500px; width: 90%;
}
.help-box h2 { font-size: 18px; color: var(--color-text-bright); margin-bottom: 16px; }
.help-row {
  display: flex; justify-content: space-between;
  padding: 6px 0; border-bottom: 1px solid var(--color-border); font-size: 12px;
}
.help-key {
  display: inline-block; background: var(--color-border);
  padding: 2px 8px; border-radius: 4px;
  font-family: var(--font-mono); font-size: 11px; color: var(--color-text-bright);
}
```

---

## 2. 목업 컴포넌트 CSS

```css
/* ═══ 좌측: 목업 영역 ═══ */
.slide-mockup {
  background: #0d1117;
  border-right: 1px solid var(--color-border);
  overflow: hidden; padding: 8px;
  display: flex; flex-direction: column;
  font-size: 10px; color: var(--color-text-dim);
}

/* ─── 브라우저 프레임 ─── */
.mock-browser {
  border: 1px solid var(--color-border-light);
  border-radius: 6px; overflow: hidden;
  flex: 1; display: flex; flex-direction: column;
}
.mock-browser-bar {
  background: var(--color-surface);
  padding: 4px 8px; display: flex; align-items: center; gap: 6px;
  border-bottom: 1px solid var(--color-border-light);
}
.mock-browser-dots { display: flex; gap: 3px; }
.mock-browser-dots span {
  width: 6px; height: 6px; border-radius: 50%; background: var(--color-border-light);
}
.mock-browser-url {
  flex: 1; background: var(--color-bg); border-radius: 3px;
  padding: 2px 6px; font-size: 8px; color: var(--color-link);
  font-family: var(--font-mono);
}
.mock-browser-body { flex: 1; padding: 6px; overflow: hidden; }

/* ─── 네비게이션 바 ─── */
.mock-navbar {
  background: var(--color-surface);
  padding: 4px 8px; display: flex; align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border-light);
  font-size: 9px; margin-bottom: 6px; border-radius: 3px;
}
.mock-navbar-brand { color: var(--color-text-bright); font-weight: 700; }
.mock-navbar-links { display: flex; gap: 8px; }
.mock-navbar-links span { color: var(--color-text-dim); cursor: default; }
.mock-navbar-links span.active { color: var(--role-color, #58a6ff); font-weight: 600; }

/* ─── 검색 바 ─── */
.mock-search-bar { display: flex; gap: 4px; margin-bottom: 6px; }
.mock-search-input {
  flex: 1; padding: 3px 6px; background: var(--color-bg);
  border: 1px solid var(--color-border-light); border-radius: 3px;
  color: var(--color-text); font-size: 8px;
}

/* ─── 데이터 테이블 ─── */
.mock-table { width: 100%; border-collapse: collapse; font-size: 8px; margin: 4px 0; }
.mock-table th {
  background: var(--color-surface); color: var(--color-link);
  padding: 3px 6px; text-align: left;
  border-bottom: 1px solid var(--color-border-light); font-weight: 600;
}
.mock-table td {
  padding: 3px 6px; border-bottom: 1px solid var(--color-border);
  color: var(--color-text-dim);
}
.mock-table tr:hover td { background: rgba(88,166,255,0.04); }

/* ─── 페이지네이션 ─── */
.mock-pagination { display: flex; gap: 2px; justify-content: center; margin-top: 4px; }
.mock-pagination span {
  display: inline-block; width: 16px; height: 16px; text-align: center;
  line-height: 16px; font-size: 7px; border-radius: 3px;
  background: var(--color-border); color: var(--color-text-dim);
}
.mock-pagination span.active { background: var(--role-color, #58a6ff); color: #fff; }

/* ─── 폼 요소 ─── */
.mock-form-group { margin-bottom: 5px; }
.mock-form-label { display: block; font-size: 8px; color: var(--color-text-dim); margin-bottom: 1px; }
.mock-form-input {
  width: 100%; padding: 3px 6px; background: var(--color-bg);
  border: 1px solid var(--color-border-light); border-radius: 3px;
  color: var(--color-text); font-size: 8px;
}
.mock-form-textarea {
  width: 100%; padding: 3px 6px; background: var(--color-bg);
  border: 1px solid var(--color-border-light); border-radius: 3px;
  color: var(--color-text); font-size: 8px; min-height: 40px; resize: none;
}
.mock-form-select {
  padding: 3px 6px; background: var(--color-bg);
  border: 1px solid var(--color-border-light); border-radius: 3px;
  color: var(--color-text); font-size: 8px;
}

/* ─── 버튼 ─── */
.mock-btn {
  display: inline-block; padding: 2px 8px; border-radius: 3px;
  font-size: 8px; font-weight: 600;
  border: 1px solid var(--color-border-light); cursor: default;
}
.mock-btn-primary { background: var(--role-color, #58a6ff); color: #fff; border-color: transparent; }
.mock-btn-outline { background: transparent; color: var(--color-text-dim); }
.mock-btn-danger  { background: #da3633; color: #fff; border-color: transparent; }

/* ─── 상태 배지 ─── */
.mock-status {
  display: inline-block; padding: 1px 5px; border-radius: 8px;
  font-size: 7px; font-weight: 600;
}
.mock-status-todo    { background: #21262d; color: #8b949e; }
.mock-status-doing   { background: rgba(210,153,34,0.15); color: #d29922; }
.mock-status-done    { background: rgba(63,185,80,0.15);  color: #3FB950; }

/* ─── 카드 ─── */
.mock-card {
  background: var(--color-surface); border: 1px solid var(--color-border-light);
  border-radius: 4px; padding: 6px; margin-bottom: 4px;
}
.mock-card-title { font-size: 9px; font-weight: 600; color: var(--color-text-bright); }
.mock-card-text  { font-size: 8px; color: var(--color-text-dim); margin-top: 2px; }

/* ─── 주석 번호 ─── */
.mock-annotation {
  display: inline-flex; align-items: center; justify-content: center;
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--role-color, #58a6ff); color: #fff;
  font-size: 7px; font-weight: 700;
  position: absolute; z-index: 10;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.5);
}

/* ─── 상세 정보 영역 (Detail 화면용) ─── */
.mock-detail-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 6px; padding-bottom: 4px;
  border-bottom: 1px solid var(--color-border);
}
.mock-detail-title { font-size: 12px; font-weight: 700; color: var(--color-text-bright); }
.mock-detail-row { display: flex; gap: 12px; font-size: 8px; margin-bottom: 3px; }
.mock-detail-label { color: var(--color-text-dim); min-width: 50px; }
.mock-detail-value { color: var(--color-text); }
.mock-detail-content {
  background: var(--color-bg); border: 1px solid var(--color-border);
  border-radius: 4px; padding: 6px; margin-top: 6px;
  font-size: 9px; color: var(--color-text); line-height: 1.5; min-height: 60px;
}
.mock-btn-group { display: flex; gap: 4px; margin-top: 6px; }

/* ─── 모바일 디바이스 프레임 ─── */
.mock-mobile-frame {
  width: 160px;
  border: 2px solid var(--color-border-light);
  border-radius: 16px;
  padding: 20px 4px 16px;
  background: var(--color-bg);
  position: relative;
}
.mock-mobile-frame::before {
  content: '';
  position: absolute; top: 6px; left: 50%;
  transform: translateX(-50%);
  width: 40px; height: 4px;
  border-radius: 2px;
  background: var(--color-border-light);
}
.mock-mobile-frame .mock-screen {
  width: 100%; aspect-ratio: 9 / 16;
  overflow: hidden; border-radius: 4px;
}
```

---

## 3. 패널 컴포넌트 CSS

```css
/* ═══ 우측: 상세 패널 ═══ */
.slide-panel {
  display: flex; flex-direction: column;
  overflow-y: auto; background: var(--color-bg);
  scrollbar-width: thin; scrollbar-color: #475569 transparent;
}

.panel-section { border-bottom: 1px solid var(--color-border); }

.panel-section-header {
  list-style: none;
  display: flex; align-items: center; gap: 6px;
  padding: 7px 12px; font-size: 10px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--role-color); cursor: pointer; user-select: none;
  background: var(--color-surface);
}
.panel-section-header::-webkit-details-marker { display: none; }
.panel-section-header::after {
  content: '▸'; margin-left: auto; font-size: 8px;
  transition: transform 0.2s ease;
}
.panel-section[open] > .panel-section-header::after { transform: rotate(90deg); }

.panel-section-body {
  padding: 8px 12px; font-size: 11px; line-height: 1.6; color: var(--color-text-dim);
}
.panel-section[open] .panel-section-body {
  animation: panel-slide-down 0.15s ease-out;
}
@keyframes panel-slide-down {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── 액션 테이블 ─── */
.action-table, .error-table, .valid-table {
  width: 100%; border-collapse: collapse; font-size: 10px;
}
.action-table th, .error-table th, .valid-table th {
  background: #0f172a; color: #64748b;
  font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em;
  padding: 4px 6px; text-align: left; border-bottom: 1px solid #334155;
}
.action-table td, .error-table td, .valid-table td {
  padding: 3px 6px; border-bottom: 1px solid #1e293b;
}
.action-table code { font-size: 9px; color: #7dd3fc; font-family: var(--font-mono); }

/* ─── HTTP Method 배지 ─── */
.method-badge {
  display: inline-block; padding: 1px 4px; border-radius: 2px;
  font-size: 8px; font-weight: 700; font-family: var(--font-mono);
  min-width: 28px; text-align: center; color: #fff;
}
.method-badge.get    { background: #61affe; }
.method-badge.post   { background: #49cc90; }
.method-badge.put    { background: #fca130; }
.method-badge.delete { background: #f93e3e; }
.method-badge.patch  { background: #50e3c2; }

/* ─── HTTP 상태 배지 ─── */
.status-badge {
  display: inline-block; padding: 1px 5px; border-radius: 3px;
  font-size: 9px; font-weight: 700; font-family: var(--font-mono);
}
.status-401 { background: #fef3c7; color: #92400e; }
.status-403 { background: #fee2e2; color: #991b1b; }
.status-404 { background: #e0e7ff; color: #3730a3; }
.status-500 { background: #f3e8ff; color: #6b21a8; }

/* ─── View Model 트리 ─── */
.vm-tree, .vm-tree ul {
  list-style: none; margin: 0;
  padding: 0 0 0 1em; position: relative;
  font-size: 10px; font-family: var(--font-mono);
}
.vm-tree ul::before {
  content: ''; position: absolute; left: 0.3em;
  top: 0; bottom: 0.5em; border-left: 1px solid #334155;
}
.vm-node {
  position: relative; padding: 2px 0 2px 0.7em;
  display: flex; align-items: baseline; gap: 4px; flex-wrap: wrap;
}
.vm-node::before {
  content: ''; position: absolute; left: -0.7em; top: 0.6em;
  width: 0.7em; border-top: 1px solid #334155;
}
.vm-key  { color: #7dd3fc; font-weight: 600; }
.vm-type { color: #86efac; font-style: italic; }
.vm-node--object > .vm-key::before { content: '▾ '; color: #f59e0b; }

/* ─── 유효성 테이블 ─── */
.valid-field { color: #7dd3fc; font-family: var(--font-mono); font-weight: 600; }
.valid-error { color: #f87171; font-size: 9px; }
.rule-tag {
  display: inline-block; padding: 1px 4px; border-radius: 2px;
  font-size: 8px; font-weight: 600; font-family: var(--font-mono); margin-right: 2px;
}
.rule-required { background: #fef2f2; color: #dc2626; }
.rule-max      { background: #eff6ff; color: #2563eb; }
.rule-min      { background: #f0fdf4; color: #16a34a; }
.rule-format   { background: #fefce8; color: #a16207; }

.perm-row {
  background: #0f172a; color: #94a3b8; font-size: 10px;
  padding: 6px; margin-top: 6px; border-radius: 4px;
}
.perm-badge {
  display: inline-block; padding: 1px 5px; border-radius: 3px;
  font-size: 8px; font-weight: 700;
  background: #7c3aed; color: #fff; margin-right: 4px;
}
```

---

## 4. 전체 JS 엔진 코드

```javascript
(function () {
  'use strict';

  /* ═══ 상태 ═══ */
  let allSlides = [];
  let filtered  = [];
  let currentIdx = 0;
  let isAnimating = false;
  let currentRole = 'ALL';

  /* ═══ DOM 참조 ═══ */
  const slidesContainer = document.querySelector('.slides');
  const progressFill    = document.getElementById('progressFill');
  const counterCurrent  = document.getElementById('counterCurrent');
  const counterTotal    = document.getElementById('counterTotal');
  const helpOverlay     = document.getElementById('helpOverlay');
  const tocSidebar      = document.getElementById('toc-sidebar');
  const tocOverlay      = document.getElementById('toc-overlay');
  const tocList         = document.getElementById('toc-list');

  /* ═══ 초기화 ═══ */
  function init() {
    buildSlideIndex();
    applyRoleFilter('ALL');
    fitSlides();
    window.addEventListener('resize', fitSlides);
    parseHash();
  }

  function buildSlideIndex() {
    allSlides = Array.from(document.querySelectorAll('.slide'));
  }

  /* ═══ 뷰포트 스케일링 ═══ */
  function fitSlides() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / 960, vh / 540, 1.5);
    slidesContainer.style.setProperty('--slide-scale', scale);
  }

  /* ═══ 역할 필터 ═══ */
  function applyRoleFilter(role) {
    currentRole = role;
    filtered = (role === 'ALL')
      ? allSlides
      : allSlides.filter(el => el.dataset.role === role || el.dataset.role === 'ALL');

    allSlides.forEach(el => el.classList.remove('active'));
    currentIdx = 0;
    if (filtered.length > 0) filtered[0].classList.add('active');

    updateProgress();
    updateTOCPanel();
    setHashState(role, filtered[0]?.dataset.id || '00');

    document.querySelectorAll('.role-filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === role);
    });
  }

  /* ═══ 슬라이드 전환 ═══ */
  function showSlide(index) {
    if (isAnimating) return;
    if (index < 0 || index >= filtered.length) return;
    if (index === currentIdx) return;

    isAnimating = true;
    filtered[currentIdx].classList.remove('active');
    currentIdx = index;
    filtered[currentIdx].classList.add('active');

    updateProgress();
    setHashState(currentRole, filtered[currentIdx].dataset.id);

    const slide = filtered[currentIdx];
    slide.addEventListener('transitionend', function handler() {
      slide.removeEventListener('transitionend', handler);
      isAnimating = false;
    });
    setTimeout(() => { isAnimating = false; }, 600);
  }

  /* ═══ 프로그레스 ═══ */
  function updateProgress() {
    const total = filtered.length;
    const pct = total > 1 ? (currentIdx / (total - 1)) * 100 : 100;
    progressFill.style.width = pct + '%';
    counterCurrent.textContent = currentIdx + 1;
    counterTotal.textContent = total;
  }

  /* ═══ URL Hash ═══ */
  function getHashState() {
    const raw = location.hash.replace(/^#/, '');
    const params = new URLSearchParams(raw);
    return { role: params.get('role') || 'ALL', slide: params.get('slide') || '00' };
  }

  function setHashState(role, slideId) {
    const params = new URLSearchParams();
    params.set('role', role);
    params.set('slide', slideId);
    history.replaceState(null, '', '#' + params.toString());
  }

  function parseHash() {
    const state = getHashState();
    if (state.role !== currentRole) applyRoleFilter(state.role);
    const idx = filtered.findIndex(el => el.dataset.id === state.slide);
    if (idx >= 0 && idx !== currentIdx) {
      filtered[currentIdx].classList.remove('active');
      currentIdx = idx;
      filtered[currentIdx].classList.add('active');
      updateProgress();
    }
  }

  /* ═══ 세트 이동 ═══ */
  function nextSet() {
    const currentSet = filtered[currentIdx]?.dataset.set;
    const idx = filtered.findIndex((el, i) => i > currentIdx && el.dataset.set !== currentSet);
    if (idx >= 0) showSlide(idx);
  }

  function prevSet() {
    const currentSet = filtered[currentIdx]?.dataset.set;
    for (let i = currentIdx - 1; i >= 0; i--) {
      if (filtered[i].dataset.set !== currentSet) {
        const setName = filtered[i].dataset.set;
        const first = filtered.findIndex(el => el.dataset.set === setName);
        showSlide(first);
        return;
      }
    }
  }

  /* ═══ TOC 사이드바 ═══ */
  function toggleTOC() {
    const isOpen = tocSidebar.classList.contains('toc-open');
    tocSidebar.classList.toggle('toc-open', !isOpen);
    tocOverlay.classList.toggle('visible', !isOpen);
  }

  function updateTOCPanel() {
    tocList.innerHTML = '';
    let lastSet = null;

    filtered.forEach((el, idx) => {
      const id  = el.dataset.id;
      const set = el.dataset.set || '';
      const role = el.dataset.role || '';

      if (set && set !== lastSet) {
        const header = document.createElement('li');
        header.className = 'toc-set-header';
        header.textContent = set.replace(/-/g, ' ').toUpperCase();
        tocList.appendChild(header);
        lastSet = set;
      }

      const title = el.querySelector('.header-title')?.textContent
        || el.querySelector('h1')?.textContent
        || el.querySelector('h2')?.textContent
        || `슬라이드 ${id}`;

      const item = document.createElement('li');
      item.className = idx === currentIdx ? 'toc-item active' : 'toc-item';
      item.innerHTML = `<span>#${id}</span> <span style="flex:1;font-size:10px;">${title}</span>`;
      if (role !== 'ALL') {
        item.innerHTML += `<span class="toc-role-badge">${role.replace('ROLE_','')}</span>`;
      }
      item.addEventListener('click', () => { showSlide(idx); toggleTOC(); });
      tocList.appendChild(item);
    });
  }

  tocOverlay.addEventListener('click', toggleTOC);

  /* ═══ 풀스크린 ═══ */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }

  /* ═══ 도움말 ═══ */
  function toggleHelp() { helpOverlay.classList.toggle('show'); }

  /* ═══ 키보드 ═══ */
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea, select')) return;

    if (helpOverlay.classList.contains('show')) {
      helpOverlay.classList.remove('show');
      e.preventDefault();
      return;
    }

    switch (e.key) {
      case 'ArrowRight': case ' ': case 'PageDown':
        e.preventDefault(); showSlide(currentIdx + 1); break;
      case 'ArrowLeft': case 'PageUp':
        e.preventDefault(); showSlide(currentIdx - 1); break;
      case 'Home': e.preventDefault(); showSlide(0); break;
      case 'End':  e.preventDefault(); showSlide(filtered.length - 1); break;
      case 'Tab':
        e.preventDefault();
        e.shiftKey ? prevSet() : nextSet();
        break;
      case 't': case 'T': e.preventDefault(); toggleTOC(); break;
      case 'f': case 'F': e.preventDefault(); toggleFullscreen(); break;
      case '?': e.preventDefault(); toggleHelp(); break;
      case 'Escape':
        if (tocSidebar.classList.contains('toc-open')) toggleTOC();
        else if (document.fullscreenElement) document.exitFullscreen();
        break;
    }
  });

  /* ═══ 터치/스와이프 ═══ */
  let pointerStartX = 0;
  document.addEventListener('pointerdown', (e) => { pointerStartX = e.clientX; });
  document.addEventListener('pointerup', (e) => {
    const dx = e.clientX - pointerStartX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? showSlide(currentIdx + 1) : showSlide(currentIdx - 1);
    }
  });

  /* ═══ 역할 필터 버튼 ═══ */
  document.querySelectorAll('.role-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => applyRoleFilter(btn.dataset.filter));
  });

  /* ═══ hashchange ═══ */
  window.addEventListener('hashchange', parseHash);

  /* ═══ 시작 ═══ */
  init();
})();
```

---

## 5. HTML 오버레이 템플릿

```html
<!-- 역할 필터 바 -->
<div class="role-filter">
  <button class="role-filter-btn active" data-filter="ALL">전체</button>
  <!-- 프로젝트 역할에 맞춰 버튼 추가 -->
  <button class="role-filter-btn" data-filter="ROLE_USER"
          style="border-color:#3FB950;color:#3FB950;">USER</button>
  <button class="role-filter-btn" data-filter="ROLE_ADMIN"
          style="border-color:#58a6ff;color:#58a6ff;">ADMIN</button>
</div>

<!-- 프로그레스 바 -->
<div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
<div class="slide-counter">
  <span id="counterCurrent">1</span> / <span id="counterTotal">N</span>
</div>

<!-- TOC 사이드바 -->
<div class="toc-overlay" id="toc-overlay"></div>
<nav class="toc-sidebar" id="toc-sidebar">
  <div class="toc-title">목차</div>
  <ul id="toc-list"></ul>
</nav>

<!-- 도움말 -->
<div class="help-overlay" id="helpOverlay">
  <div class="help-box">
    <h2>키보드 단축키</h2>
    <div class="help-row"><span>이전 / 다음</span><span><span class="help-key">←</span> <span class="help-key">→</span></span></div>
    <div class="help-row"><span>처음 / 끝</span><span><span class="help-key">Home</span> <span class="help-key">End</span></span></div>
    <div class="help-row"><span>다음 / 이전 세트</span><span><span class="help-key">Tab</span> <span class="help-key">Shift+Tab</span></span></div>
    <div class="help-row"><span>목차 토글</span><span><span class="help-key">T</span></span></div>
    <div class="help-row"><span>풀스크린</span><span><span class="help-key">F</span></span></div>
    <div class="help-row"><span>도움말</span><span><span class="help-key">?</span></span></div>
    <div class="help-row"><span>닫기</span><span><span class="help-key">Esc</span></span></div>
    <p style="text-align:center;margin-top:16px;font-size:11px;color:var(--color-text-dim);">아무 키나 눌러 닫기</p>
  </div>
</div>
```

---

## 6. 목업 조합 예시

### 6.1 목록(List) 화면 목업

```html
<div class="slide-mockup">
  <div class="mock-browser">
    <div class="mock-browser-bar">
      <div class="mock-browser-dots"><span></span><span></span><span></span></div>
      <div class="mock-browser-url">/user/order/list</div>
    </div>
    <div class="mock-browser-body">
      <div class="mock-navbar">
        <span class="mock-navbar-brand">AppName</span>
        <div class="mock-navbar-links">
          <span class="active">메뉴1</span><span>메뉴2</span><span>로그아웃</span>
        </div>
      </div>
      <div class="mock-search-bar">
        <div class="mock-form-select" style="width:70px;">전체</div>
        <div class="mock-search-input">검색...</div>
        <span class="mock-btn mock-btn-primary">검색</span>
        <span class="mock-btn mock-btn-primary" style="background:#3FB950;">+ 등록</span>
      </div>
      <table class="mock-table">
        <thead><tr><th>#</th><th>제목</th><th>상태</th><th>날짜</th><th>액션</th></tr></thead>
        <tbody>
          <tr><td>1</td><td style="color:#58a6ff;">항목 A</td>
            <td><span class="mock-status mock-status-doing">진행중</span></td>
            <td>2026-03-15</td>
            <td><span class="mock-btn mock-btn-outline">수정</span> <span class="mock-btn mock-btn-danger">삭제</span></td></tr>
          <tr><td>2</td><td style="color:#58a6ff;">항목 B</td>
            <td><span class="mock-status mock-status-done">완료</span></td>
            <td>2026-03-10</td>
            <td><span class="mock-btn mock-btn-outline">수정</span> <span class="mock-btn mock-btn-danger">삭제</span></td></tr>
        </tbody>
      </table>
      <div class="mock-pagination">
        <span class="active">1</span><span>2</span><span>3</span>
      </div>
    </div>
  </div>
</div>
```

### 6.2 상세(Detail) 화면 목업

```html
<div class="slide-mockup">
  <div class="mock-browser">
    <div class="mock-browser-bar">
      <div class="mock-browser-dots"><span></span><span></span><span></span></div>
      <div class="mock-browser-url">/user/order/1</div>
    </div>
    <div class="mock-browser-body">
      <div class="mock-navbar">
        <span class="mock-navbar-brand">AppName</span>
        <div class="mock-navbar-links"><span class="active">메뉴1</span><span>로그아웃</span></div>
      </div>
      <div class="mock-detail-header">
        <span class="mock-detail-title">항목 제목</span>
        <span class="mock-status mock-status-doing" style="font-size:9px;">진행중</span>
      </div>
      <div class="mock-detail-row">
        <span class="mock-detail-label">작성자</span>
        <span class="mock-detail-value">홍길동</span>
      </div>
      <div class="mock-detail-row">
        <span class="mock-detail-label">작성일</span>
        <span class="mock-detail-value">2026-03-01</span>
      </div>
      <div class="mock-detail-content">
        상세 내용이 여기에 표시됩니다.
      </div>
      <div class="mock-btn-group">
        <span class="mock-btn mock-btn-outline">← 목록</span>
        <span class="mock-btn mock-btn-primary">수정</span>
        <span class="mock-btn mock-btn-danger">삭제</span>
      </div>
    </div>
  </div>
</div>
```

### 6.3 등록/수정(Form) 화면 목업

```html
<div class="slide-mockup">
  <div class="mock-browser">
    <div class="mock-browser-bar">
      <div class="mock-browser-dots"><span></span><span></span><span></span></div>
      <div class="mock-browser-url">/user/order/new</div>
    </div>
    <div class="mock-browser-body">
      <div class="mock-navbar">
        <span class="mock-navbar-brand">AppName</span>
        <div class="mock-navbar-links"><span class="active">메뉴1</span><span>로그아웃</span></div>
      </div>
      <div style="font-size:11px;font-weight:700;color:#f0f6fc;margin-bottom:8px;">등록</div>
      <div class="mock-form-group">
        <label class="mock-form-label">제목 *</label>
        <div class="mock-form-input">입력 내용</div>
      </div>
      <div class="mock-form-group">
        <label class="mock-form-label">내용</label>
        <div class="mock-form-textarea">텍스트 영역 내용</div>
      </div>
      <div style="display:flex;gap:8px;">
        <div class="mock-form-group" style="flex:1;">
          <label class="mock-form-label">상태</label>
          <div class="mock-form-select" style="width:100%;">선택 ▾</div>
        </div>
        <div class="mock-form-group" style="flex:1;">
          <label class="mock-form-label">날짜</label>
          <div class="mock-form-input">2026-03-15</div>
        </div>
      </div>
      <div class="mock-btn-group" style="margin-top:10px;">
        <span class="mock-btn mock-btn-outline">취소</span>
        <span class="mock-btn mock-btn-primary">저장</span>
      </div>
    </div>
  </div>
</div>
```

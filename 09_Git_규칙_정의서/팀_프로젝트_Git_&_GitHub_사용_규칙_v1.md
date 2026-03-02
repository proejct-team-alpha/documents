# 팀 프로젝트 Git & GitHub 사용 규칙

> **마지막 업데이트:** 2026년 3월  
> **적용 대상:** 모든 팀원 (신규 참여자 필수 숙지)  
> **기본 철학:** `dev` 브랜치가 개발의 중심. `main`은 배포/릴리스 전용.

---

## 1. 기본 원칙 (반드시 지켜주세요)

- **`main` 브랜치** : 직접 커밋/푸시 절대 금지 (배포용 안정 버전)
- **`dev` 브랜치** : 모든 개발 통합 브랜치 (직접 푸시 금지 권장)
- 모든 변경은 **`feature/` `bugfix/` `hotfix/`** 등 브랜치 → PR → `dev` 병합
- 코드 리뷰 **최소 1명 이상 Approve** 필수
- conflict 발생 시 **본인이 직접 해결**
- `dev` 브랜치 보호 설정 추천 (GitHub Settings → Branches → Branch protection rules)

---

## 2. 저장소 처음 가져오기 (최초 Clone)

최초 1회만 아래와 같이 clone 합니다. (불필요한 브랜치 다운로드 방지)

```bash
git clone -b dev --single-branch https://github.com/팀명/프로젝트명.git
cd 프로젝트명

# (선택) 기본 브랜치를 dev로 설정해두면 편함
git remote set-head origin dev
```

이후에는 작업 시작 전 항상 `dev`를 최신화합니다.

---

## 3. 일상적인 개발 워크플로우 (매일 반복)

### Step 0. 작업 시작 전 — dev 최신화 (필수!)

```bash
git checkout dev
git pull --ff-only origin dev    # fast-forward만 허용 (충돌 시 알려줌)
# 또는 그냥
# git pull origin dev
```

### Step 1. 새 작업 브랜치 생성

```bash
git checkout -b feature/47-login-with-google
# 또는 bugfix/128-payment-null-check 등
```

> **브랜치 이름 규칙:**

```
{타입}/{이슈번호또는카드번호}-{짧은-영어-설명}
```

> 예: `feature/47-google-login`, `bugfix/91-500-error-signup`

### Step 2. 작업 → 커밋 → 푸시

```bash
# 작업 후
git add .
git commit -m "feat(auth): 구글 로그인 API 연결 구현

closes #47"
git push -u origin feature/47-google-login
```

### Step 3. Pull Request 생성 & 리뷰

- PR 제목 예시: `feat: 구글 소셜 로그인 기능 추가 (#47)`
- PR 본문에 체크리스트, 스크린샷, 리뷰 요청 사항 작성
- 최소 1명 Approve 후 **Squash and merge**로 `dev`에 병합 (기본값 추천)

### Step 4. 다른 팀원의 변경이 dev에 merge된 후 — 본인 브랜치 업데이트

브랜치로 돌아와서 `dev`를 가져옵니다. 두 가지 방법 중 선택 (팀 컨벤션으로 하나 정하는 걸 추천)

**방법 A. Merge 방식** (초·중급 추천 · 히스토리가 조금 더러워져도 OK)

```bash
git checkout feature/47-google-login
git fetch origin
git merge origin/dev          # 또는 git pull origin dev --no-rebase
# 충돌 발생 시 → 해결 → git add → git commit
git push origin feature/47-google-login
```

**방법 B. Rebase 방식** (히스토리 깔끔하게 유지하고 싶을 때)

```bash
git checkout feature/47-google-login
git fetch origin
git rebase origin/dev
# 충돌 발생 시 → 해결 → git rebase --continue (반복)
git push --force-with-lease   # --force-with-lease 필수! (--force 쓰지 마세요)
```

> ⚠️ 팀 내에서 "merge 방식만 사용" 또는 "rebase도 OK" 중 하나로 통일 권장

### Step 5. PR 업데이트 & 재리뷰 → 다시 Squash merge

위 과정을 반복하면서 PR이 계속 살아있는 상태로 유지됩니다.

---

## 4. 브랜치 종류 & 수명 관리

| 브랜치 유형 | 기반 | 병합 대상 | 권장 수명 | 삭제 시점 |
|---|---|---|---|---|
| `feature/*` | `dev` | `dev` | 1~7일 | merge 후 |
| `bugfix/*` | `dev` | `dev` | 1~5일 | merge 후 |
| `hotfix/*` | `main` | `main` + `dev` | 1~3일 | merge 후 |
| `release/*` | `dev` | `main` | 배포 기간 동안 | 배포 완료 후 |

> ⏰ 3일 이상 살아있는 브랜치는 팀 채팅에 리마인더 보내기 권장

---

## 5. Commit Message 규칙 (Conventional Commits 기반)

```
타입(범위): 제목 (명령조, 마침표 금지)

본문 (선택)

이슈번호 #123
```

**👥 팀원 전용**

| 타입 | 설명 |
|---|---|
| `feat` | 새 기능 추가 |
| `fix` | 버그 수정 |
| `test` | 테스트 추가/수정 |

**👑 팀장 전용**

| 타입 | 설명 |
|---|---|
| `docs` | 문서 수정 |
| `chore` | 빌드 설정, 패키지 등 기타 |
| `refactor` | 리팩토링 (기능 변화 없음) |

**🤝 공통**

| 타입 | 설명 |
|---|---|
| `style` | 코드 포맷, 세미콜론 등 (로직 변화 없음) |
| `perf` | 성능 개선 |

---

## 6. Pull Request 규칙 & 템플릿

**PR 생성 전 체크:**

- [ ] `dev` 최신화 완료
- [ ] 로컬 테스트 완료
- [ ] conflict 없음

**추천 PR 템플릿** (`.github/pull_request_template.md`)

```markdown
## 관련 이슈
close #123

## 변경 사항 요약

## 스크린샷 / GIF (UI/UX 변경 시 필수)

## 리뷰 포인트
- 특별히 봐줬으면 하는 부분

## 체크리스트
- [ ] Self-reviewed
- [ ] Conflict resolved
- [ ] Tests passed
```

---

## 7. 추가 안전장치 & 팀 문화

- `dev` 브랜치 보호 설정 추천 (Require PR, Require 1 approve, Restrict who can push)
- force push는 `--force-with-lease`만 허용, 일반 `--force` 금지
- 매일 아침 `dev pull` 습관화 (슬랙/팀 채팅에 "dev pull 완료" 정도만 공유해도 OK)
- PR 3일 이상 미승인 시 → 가볍게 리마인더 보내기
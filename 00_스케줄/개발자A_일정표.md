# 개발자 A(강태오) -- 상세 일정표

> **역할:** 비회원 메인, 외부 예약 폼, 증상 입력 UI, 추천 결과 화면
> **담당 URL:** `/`, `/reservation/**`
> **담당 화면:** 00 (비회원 메인), 01~04 (예약 흐름 전체)
> **담당 레이아웃:** L1 (H1 헤더, F1 푸터, 사이드바 없음)
> **소유 영역:** `reservation/**`, `templates/home/**`, `templates/reservation/**`
> **Git 브랜치:** `feature/home`, `feature/reservation`, `feature/llm-symptom-ui`

---

## W1 -- 홈 화면 & 기본 UI 구성

> **목표:** 비회원 메인 화면 완성, 공통 레이아웃 적용 확인
> **의존:** 책임개발자(김민구)의 Entity·LayoutModelInterceptor 완성 (W1 후반)

### W1 전반 (Day 1~2)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 1 | 비회원 메인(00) 화면 구조 설계 | 화면 레이아웃 초안 | 진료과 안내 영역 구성 확인 |
| 2 | `HomeController` 구현 | `GET /` -> `home/index.mustache` | 메인 페이지 렌더링 성공 |
| 3 | 메인 화면 Mustache 작성 | `home/index.mustache` | 진료과 목록 동적 표시, 예약 버튼 동작 |

### W1 후반 (Day 3~5)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 4 | 공통 레이아웃 적용 확인 | L1 레이아웃 (헤더 + 푸터) | 비회원 화면에 레이아웃 정상 렌더링 |
| 5 | 기본 UI 구성 보조 | CSS 스타일 기초 | 반응형 기본 구조 확인 |
| 6 | 예약 진입점 구성 | 메인 -> 예약 페이지 라우팅 | `AI 추천 받기` / `직접 선택하기` 분기 동작 |

### W1 체크포인트

- [ ] 메인 페이지 정상 렌더링
- [ ] 진료과 목록 DB 조회 후 표시
- [ ] 예약 진입 버튼 라우팅 동작

---

## W2 -- 외부 예약 폼 전체 완성

> **목표:** 직접 선택 예약 전체 흐름 완성 (폼 -> 슬롯 선택 -> 생성 -> 완료)
> **의존:** 책임개발자(김민구)의 SlotService (W1에 develop 머지됨) -- pull 후 사용

### W2 전반 (Day 1~3)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 1 | 예약 폼 화면(01) 구현 | `reservation/form.mustache` | 환자 정보 입력 폼 렌더링 |
| 2 | 진료과 선택 -> 의사 동적 조회 | JS 비동기 호출 | 진료과 선택 시 해당 의사 목록 로드 |
| 3 | 시간 슬롯 선택(02) 구현 | `reservation/slot.mustache` | SlotService.getAvailableSlots() 호출 -> 가용 시간 표시 |
| 4 | `ReservationController` 구현 | GET/POST `/reservation/**` | 예약 폼 GET, 예약 생성 POST (PRG 패턴) |

### W2 후반 (Day 4~5)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 5 | `ReservationService` 구현 | 예약 생성 비즈니스 로직 | SlotService.validateAndLock() 호출 -> 예약 저장 |
| 6 | 예약번호 발급 & 완료 화면(05) | `reservation/complete.mustache` | 예약 완료 후 예약번호 표시 |
| 7 | `PatientRepository` 구현 | Patient findOrCreate 로직 | 기존 환자 조회 또는 신규 생성 |
| 8 | @Valid 유효성 검증 추가 | `ReservationCreateRequest` DTO | 빈 이름·전화번호 시 에러 메시지 표시 |
| 9 | **단위 테스트 작성** | `ReservationServiceTest`, `ReservationRepositoryTest` | 예약 생성, 중복 방지, 페이징 테스트 통과 |
| 10 | PR 제출 & 리뷰 반영 | `feature/reservation` -> `develop` PR | 책임개발자(김민구) 리뷰 승인 |

### W2 테스트

| 테스트 | 유형 | 검증 내용 |
|--------|------|-----------|
| `ReservationServiceTest` | 단위 (Mockito) | 예약 생성 성공, 중복 예약 예외 발생 |
| `ReservationRepositoryTest` | @DataJpaTest | 의사+날짜 조회, 페이징, UNIQUE 제약 |
| `PatientRepositoryTest` | @DataJpaTest | 전화번호 기반 조회, 환자 저장 |
| `ReservationControllerTest` | MockMvc | PRG 패턴, @Valid 검증 실패 |

### W2 체크포인트

- [ ] 직접 선택 예약 전체 흐름 동작 (폼 -> 슬롯 -> 생성 -> 완료)
- [ ] 중복 예약 방지 동작 확인
- [ ] 예약번호 정상 발급
- [ ] @Valid 유효성 검증 에러 메시지 표시
- [ ] 단위 테스트 전체 통과
- [ ] PR 리뷰 승인 & develop 머지

---

## W3 -- 증상 입력 UI 골격 구현

> **목표:** LLM 연동 없이 증상 입력 화면 골격 완성 (더미 데이터로 UI 확인)
> **의존:** 없음 (LlmService 완성 전 독립 작업 가능)

### W3 전반 (Day 1~3)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 1 | 증상 입력 화면(03) 구현 | `reservation/symptom.mustache` | 텍스트 입력 폼 + AI 추천 버튼 렌더링 |
| 2 | 증상 입력 JS 비동기 처리 | fetch 호출 골격 | `POST /llm/symptom/analyze` 호출 구조 구현 (더미 응답) |
| 3 | 추천 결과 영역 UI | 추천 결과 표시 영역 | 진료과·의사·시간 추천 결과 렌더링 구조 |

### W3 후반 (Day 4~5)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 4 | 추천 결과 -> 예약 폼 연결 구조 | 쿼리 파라미터 전달 | 추천 결과 선택 시 예약 폼으로 자동 입력 |
| 5 | 폴백 UI 구현 | 오류 toast + 직접 선택 전환 | API 실패 시 "직접 선택하기" 화면 이동 (3초 후) |
| 6 | 면책 고지 문구 구성 | 고지 문구 UI 컴포넌트 | "AI 참고용, 의학적 진단 아님" 문구 표시 |
| 7 | **W3 금요일 LLM DTO 공유 미팅 참석** | SymptomRequest/Response DTO 확인 | W4 UI 연결 계획 확정 |

### W3 체크포인트

- [ ] 증상 입력 화면 렌더링 (텍스트 입력 + 버튼)
- [ ] 추천 결과 영역 더미 데이터로 UI 확인
- [ ] 폴백 UI 동작 (toast -> 직접 선택 전환)
- [ ] 면책 고지 문구 화면에 표시
- [ ] SymptomRequest/Response DTO 인터페이스 확인 완료

---

## W4 -- LLM 연결 완성 & 최종 마무리

> **목표:** LlmService 연동으로 증상 추천 기능 완성
> **의존:** 책임개발자(김민구)의 LlmService develop 머지 (W4 Day 1) + SymptomRequest/Response DTO

### W4 전반 (Day 1~3)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 1 | LlmService 연결 | fetch 호출 실제 연동 | `POST /llm/symptom/analyze` 실제 API 호출 -> 추천 결과 수신 |
| 2 | 추천 결과 렌더링 완성 | 추천 진료과·의사·시간 표시 | SymptomResponse DTO 기반 동적 렌더링 |
| 3 | 추천 -> 예약 연결 완성 | 쿼리 파라미터 자동 입력 | "이 추천으로 예약하기" 클릭 -> 예약 폼 자동 채움 |
| 4 | CSRF 토큰 처리 | `fetchWithCsrf()` 호출 | AJAX POST 요청 시 CSRF 토큰 전달 |

### W4 후반 (Day 4~5)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 5 | 면책 고지 문구 최종 확인 | 고지 문구 위치·스타일 | 추천 결과 화면에 고지 문구 항상 표시 |
| 6 | 폴백 동작 최종 검증 | API 실패 시나리오 | 타임아웃·서버 에러 시 직접 선택 전환 동작 |
| 7 | 버그 수정 & UI 정리 | 최종 코드 정리 | 전체 예약 흐름 재검증 |
| 8 | PR 제출 & 리뷰 반영 | `feature/llm-symptom-ui` -> `develop` PR | 책임개발자(김민구) 리뷰 승인 |
| 9 | 배포 지원 | 배포 환경 확인 | 운영 서버에서 예약 흐름 동작 확인 |

### W4 체크포인트

- [ ] 증상 입력 -> AI 추천 -> 예약 전체 흐름 동작
- [ ] 폴백 시나리오 (타임아웃, 서버 에러) 정상 동작
- [ ] 면책 고지 문구 표시 확인
- [ ] CSRF 토큰 AJAX 처리 동작
- [ ] PR 리뷰 승인 & develop 머지
- [ ] 운영 서버 동작 확인

---

## 절대 터치 금지 영역

| 파일/디렉터리 | 소유자 | 접근 수준 |
|---------------|--------|-----------|
| `config/SecurityConfig.java` | 책임개발자(김민구) | 읽기 전용 |
| `domain/*.java` (Entity) | 책임개발자(김민구) | 접근 금지 (수정 시 Issue 등록) |
| `common/service/SlotService.java` | 책임개발자(김민구) | 인터페이스 호출만 허용 |
| `llm/LlmService.java` | 책임개발자(김민구) | 인터페이스 호출만 허용 |
| `staff/**`, `doctor/**`, `nurse/**` | 개발자 B(조유지) | 접근 금지 |
| `admin/**` | 개발자 C(강상민) | 접근 금지 |

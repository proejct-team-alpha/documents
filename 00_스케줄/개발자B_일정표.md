# 개발자 B -- 상세 일정표

> **역할:** STAFF·DOCTOR·NURSE 대시보드, 방문 접수, 접수 처리, 진료 기록, 챗봇 UI 컴포넌트
> **담당 URL:** `/staff/**`, `/doctor/**`, `/nurse/**`
> **담당 화면:** 05~16 (STAFF 5개 + DOCTOR 3개 + NURSE 3개) + C1 (챗봇)
> **담당 레이아웃:** L2 / S1(STAFF), S2(DOCTOR), S3(NURSE)
> **소유 영역:** `staff/**`, `doctor/**`, `nurse/**`, `templates/staff/**`, `templates/doctor/**`, `templates/nurse/**`
> **Git 브랜치:** `feature/reception`, `feature/walkin`, `feature/phone-reservation`, `feature/staff-dashboard`, `feature/doctor-treatment`, `feature/nurse`, `feature/llm-chatbot-ui`

---

## W1 -- STAFF 로그인 & 대시보드 골격

> **목표:** STAFF 로그인 동선 확인, 대시보드 기본 골격 구현
> **의존:** 책임개발자의 SecurityConfig·LayoutModelInterceptor 완성 (W1 후반)

### W1 전반 (Day 1~2)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 1 | STAFF 로그인 화면(05) 구조 설계 | 로그인 폼 레이아웃 | Spring Security 연동 로그인 폼 |
| 2 | 로그인 동선 확인 | 로그인 -> 대시보드 라우팅 | 로그인 성공 시 ROLE별 대시보드 리다이렉트 |

### W1 후반 (Day 3~5)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 3 | `StaffDashboardController` 구현 | `GET /staff/dashboard` | STAFF 대시보드 렌더링 |
| 4 | STAFF 대시보드(06) Mustache 작성 | `staff/dashboard.mustache` | 오늘 접수 대기 건수, 주요 메뉴 표시 |
| 5 | L2 레이아웃 + S1 사이드바 적용 확인 | 사이드바 메뉴 렌더링 | STAFF 역할 메뉴 정상 표시 |

### W1 체크포인트

- [ ] STAFF 로그인 성공 -> 대시보드 이동
- [ ] 대시보드 기본 골격 렌더링
- [ ] S1 사이드바 메뉴 표시 확인

---

## W2 -- 접수 처리 & 방문 접수 전체 완성

> **목표:** 접수 목록 -> 접수 처리, 방문 접수, 전화 예약 전체 완성
> **의존:** 책임개발자의 SlotService (W1에 develop 머지됨) -- 방문 접수에서 사용

### W2 전반 (Day 1~3)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 1 | 접수 대기 목록(07) 구현 | `ReceptionController` `GET /staff/reception/list` | 오늘 RESERVED 상태 예약 목록 표시 + 페이징 |
| 2 | 접수 처리(08) 구현 | `POST /staff/reception/receive` | RESERVED -> RECEIVED 상태 전이 |
| 3 | `ReceptionService` 구현 | 상태 검증 + 전이 로직 | 이미 RECEIVED인 건 재접수 차단 |
| 4 | 접수 처리 상세 화면 | 환자 추가 정보 입력 (주소·특이사항) | 접수 시 환자 정보 업데이트 |

### W2 후반 (Day 4~5)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 5 | 전화 예약(09) 구현 | `PhoneReservationController` | STAFF가 예약 등록 (RESERVED 상태) |
| 6 | 방문 접수(10) 구현 | `WalkinController`, `WalkinService` | Patient 생성 + Reservation(RECEIVED) 단일 트랜잭션 |
| 7 | @Valid 유효성 검증 추가 | 접수·방문접수 DTO | 빈 필드 에러 메시지 표시 |
| 8 | **단위 테스트 작성** | `ReceptionServiceTest` | RESERVED->RECEIVED 전이, 역방향 차단 |
| 9 | PR 제출 & 리뷰 반영 | `feature/reception`, `feature/walkin` -> `develop` PR | 책임개발자 리뷰 승인 |

### W2 테스트

| 테스트 | 유형 | 검증 내용 |
|--------|------|-----------|
| `ReceptionServiceTest` | 단위 (Mockito) | RESERVED->RECEIVED 성공, 역방향 전이 차단 |
| `WalkinServiceTest` | 단위 (Mockito) | Patient 생성 + RECEIVED 직행, 트랜잭션 원자성 |
| `ReceptionControllerTest` | MockMvc | 접수 목록 GET, 접수 처리 POST (PRG), ROLE_STAFF 전용 |

### W2 체크포인트

- [ ] 접수 대기 목록 페이징 동작
- [ ] 접수 처리 (RESERVED -> RECEIVED) 성공
- [ ] 전화 예약 등록 동작
- [ ] 방문 접수 Patient + Reservation 동시 생성
- [ ] SlotService.validateAndLock() 호출 확인 (방문 접수)
- [ ] 단위 테스트 전체 통과
- [ ] PR 리뷰 승인 & develop 머지

---

## W3 -- 진료 기록 & DOCTOR·NURSE 화면 전체 완성

> **목표:** 진료 기록 입력·완료 처리, DOCTOR·NURSE 대시보드 및 현황 화면 완성
> **의존:** 없음 (독립 작업)

### W3 전반 (Day 1~3)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 1 | DOCTOR 대시보드(11) 구현 | `DoctorDashboardController` | 오늘 진료 예정 건수, 완료 건수 표시 |
| 2 | 진료 현황(12) 구현 | 오늘 예약 목록 (RECEIVED 상태) | 본인 담당 환자만 표시 |
| 3 | 진료 기록(13) 입력 화면 | `TreatmentController` GET/POST | 진단 내용·처방 입력 폼 |
| 4 | `TreatmentService` 구현 | RECEIVED -> COMPLETED 전이, TreatmentRecord 저장 | 진료 완료 처리 + 기록 저장 |
| 5 | 권한 검증 | 본인 담당 환자만 진료 가능 | `reservation.doctor.staffId == 로그인 staffId` |

### W3 후반 (Day 4~5)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 6 | NURSE 대시보드(14) 구현 | `NurseDashboardController` | 오늘 예약 현황 표시 |
| 7 | 예약 현황(15) 구현 | `ScheduleController` | 오늘 예약 목록 (전체 상태) |
| 8 | 환자 정보 수정(16) | `PatientUpdateController` | 간호사 환자 정보 수정 |
| 9 | **단위 테스트 작성** | `TreatmentServiceTest` | RECEIVED->COMPLETED 전이, 권한 검증 |
| 10 | **W3 금요일 LLM DTO 공유 미팅 참석** | ChatbotRequest/Response DTO 확인 | W4 챗봇 UI 작업 계획 확정 |

### W3 테스트

| 테스트 | 유형 | 검증 내용 |
|--------|------|-----------|
| `TreatmentServiceTest` | 단위 (Mockito) | RECEIVED->COMPLETED 성공, 역방향 차단, 권한 검증 |
| `TreatmentControllerTest` | MockMvc | 진료 목록 GET, 진료 기록 POST, ROLE_DOCTOR 전용 |
| `ChatbotControllerTest` | MockMvc | 챗봇 질의 POST (AJAX), ROLE_DOCTOR/NURSE 접근 |

### W3 체크포인트

- [ ] DOCTOR 대시보드 + 진료 현황 + 진료 기록 전체 동작
- [ ] RECEIVED -> COMPLETED 상태 전이 정상
- [ ] 본인 담당 환자만 진료 가능 (권한 검증)
- [ ] NURSE 대시보드 + 예약 현황 + 환자 수정 전체 동작
- [ ] ChatbotRequest/Response DTO 인터페이스 확인 완료
- [ ] PR 리뷰 승인 & develop 머지

---

## W4 -- 챗봇 UI 완성 & 최종 마무리

> **목표:** 병원 규칙 Q&A 챗봇 UI 완성, 대화 이력 저장 연결
> **의존:** 책임개발자의 LlmService develop 머지 (W4 Day 1) + ChatbotRequest/Response DTO

### W4 전반 (Day 1~3)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 1 | 챗봇 오버레이 UI 구현 | `common/chatbot-overlay.mustache` | 우측 하단 챗봇 버튼 + 대화 창 토글 |
| 2 | 챗봇 질의 AJAX 연결 | `fetchWithCsrf('POST /llm/chatbot/ask')` | 질문 전송 -> 답변 수신 -> 대화 영역 렌더링 |
| 3 | 대화 이력 표시 | 대화 목록 동적 추가 | 질문·답변 순차 표시, 스크롤 자동 이동 |
| 4 | 대화 이력 저장 연결 | ChatbotHistory DB 저장 | 세션 단위 대화 이력 저장 확인 |

### W4 후반 (Day 4~5)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 5 | 챗봇 접근 권한 확인 | DOCTOR/NURSE 화면에서만 표시 | STAFF/ADMIN 화면에서 챗봇 버튼 미표시 |
| 6 | 챗봇 에러 처리 | API 실패 시 안내 메시지 | "잠시 후 다시 시도해 주세요" 메시지 표시 |
| 7 | 전체 UI 최종 점검 | STAFF·DOCTOR·NURSE 전체 화면 | 모든 화면 레이아웃·기능 정상 동작 |
| 8 | 버그 수정 | 통합 테스트 발견 이슈 수정 | 책임개발자 리포트 기준 |
| 9 | PR 제출 & 리뷰 반영 | `feature/llm-chatbot-ui` -> `develop` PR | 책임개발자 리뷰 승인 |
| 10 | 배포 지원 | 배포 환경 확인 | 운영 서버에서 접수·진료·챗봇 동작 확인 |

### W4 체크포인트

- [ ] 챗봇 UI 정상 동작 (질문 -> 답변 표시)
- [ ] 대화 이력 DB 저장 확인
- [ ] DOCTOR/NURSE 화면에서만 챗봇 표시
- [ ] API 실패 시 에러 메시지 표시
- [ ] CSRF 토큰 AJAX 처리 동작
- [ ] 전체 STAFF·DOCTOR·NURSE 화면 최종 점검 완료
- [ ] PR 리뷰 승인 & develop 머지
- [ ] 운영 서버 동작 확인

---

## 절대 터치 금지 영역

| 파일/디렉터리 | 소유자 | 접근 수준 |
|---------------|--------|-----------|
| `config/SecurityConfig.java` | 책임개발자 | 읽기 전용 |
| `domain/*.java` (Entity) | 책임개발자 | 접근 금지 (수정 시 Issue 등록) |
| `common/service/SlotService.java` | 책임개발자 | 인터페이스 호출만 허용 |
| `llm/LlmService.java` | 책임개발자 | 인터페이스 호출만 허용 |
| `reservation/**` | 개발자 A | 접근 금지 |
| `admin/**` | 개발자 C | 접근 금지 |

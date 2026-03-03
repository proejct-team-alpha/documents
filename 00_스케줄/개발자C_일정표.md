# 개발자 C -- 상세 일정표

> **역할:** 관리자 화면 전체, 물품 CRUD, 병원 규칙 CRUD, 전체 접수 목록, 진료과 상세
> **담당 URL:** `/admin/**`
> **담당 화면:** 17~32 (관리자 대시보드 + 모든 관리 CRUD) -- 총 16개 화면
> **담당 레이아웃:** L2 / S4 (ADMIN 사이드 메뉴)
> **소유 영역:** `admin/**`, `templates/admin/**`
> **Git 브랜치:** `feature/admin-dashboard`, `feature/admin-reservation`, `feature/admin-staff`, `feature/admin-department`, `feature/admin-item`, `feature/admin-rule`
> **RESTful API:** `/api/staff/**`, `/api/reservations/**`, `/api/items/**`, `/api/rules/**`

---

## W1 -- 관리자 대시보드 골격 구성

> **목표:** 관리자 대시보드 기본 골격 완성, ADMIN 레이아웃 적용 확인
> **의존:** 책임개발자의 Entity·LayoutModelInterceptor 완성 (W1 후반)

### W1 전반 (Day 1~2)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 1 | 관리자 대시보드(17) 구조 설계 | 화면 레이아웃 초안 | 통계 4종 영역 구성 |
| 2 | `AdminDashboardController` 구현 | `GET /admin/dashboard` | 대시보드 렌더링 |

### W1 후반 (Day 3~5)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 3 | 대시보드 통계 4종 구현 | 전체 환자 수, 오늘 예약 수, 직원 수, 진료과 수 | Repository 집계 쿼리 동작 |
| 4 | L2 레이아웃 + S4 사이드바 적용 확인 | 관리자 전용 사이드바 | ADMIN 메뉴 항목 전체 표시 |
| 5 | 관리자 화면 공통 템플릿 구조 수립 | 목록·등록·수정·상세 Mustache 구조 | CRUD 공통 패턴 확립 |

### W1 체크포인트

- [ ] ADMIN 로그인 -> 대시보드 이동
- [ ] 통계 4종 정상 표시
- [ ] S4 사이드바 메뉴 전체 항목 표시

---

## W2 -- 예약 관리 & 직원·진료과 CRUD

> **목표:** 예약 목록 조회·취소, 직원 CRUD, 진료과 CRUD 완성
> **의존:** 책임개발자의 Entity (W1에 develop 머지됨)

### W2 전반 (Day 1~3)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 1 | 예약 목록(18) 구현 | `AdminReservationController` `GET /admin/reservation/list` | 전체 예약 목록 페이징 + 상태 필터 |
| 2 | 예약 취소 기능 | `POST /admin/reservation/cancel` | RESERVED -> CANCELLED 상태 전이 (ADMIN 전용) |
| 3 | RESTful API: 예약 취소 | `DELETE /api/reservations/{id}` | JSON 응답 기반 예약 취소 |
| 4 | 직원 목록(22) 구현 | `AdminStaffController` `GET /admin/staff/list` | 직원 목록 페이징 + 검색 |
| 5 | 직원 등록(23) 구현 | `GET/POST /admin/staff/new` | 직원 정보 입력 + BCrypt 비밀번호 암호화 |
| 6 | 직원 수정(24) 구현 | `GET/POST /admin/staff/edit/{id}` | 직원 정보 수정 |

### W2 후반 (Day 4~5)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 7 | RESTful API: 직원 수정 | `PUT /api/staff/{id}` | JSON 요청/응답 기반 직원 수정 |
| 8 | 진료과 목록(25) 구현 | `AdminDepartmentController` | 진료과 목록 페이징 |
| 9 | 진료과 상세(26) 구현 | `GET/POST /admin/department/**` | 진료과 등록·수정·상세 |
| 10 | @Valid 유효성 검증 추가 | 직원·진료과 DTO | 빈 필드 에러 메시지 표시 |
| 11 | **단위 테스트 작성** | `AdminStaffServiceTest`, `AdminDepartmentServiceTest` | CRUD, 중복 방지, 비밀번호 암호화 테스트 |
| 12 | PR 제출 & 리뷰 반영 | `feature/admin-staff`, `feature/admin-department` -> `develop` PR | 책임개발자 리뷰 승인 |

### W2 테스트

| 테스트 | 유형 | 검증 내용 |
|--------|------|-----------|
| `AdminStaffServiceTest` | 단위 (Mockito) | 직원 CRUD, 비밀번호 암호화, 중복 방지 |
| `AdminDepartmentServiceTest` | 단위 (Mockito) | 진료과 CRUD, 중복 진료과명 방지 |
| `AdminControllerTest` | MockMvc | CRUD 엔드포인트, ROLE_ADMIN 전용, 페이징 |
| `DepartmentRepositoryTest` | @DataJpaTest | 진료과 조회, 페이징 |

### W2 체크포인트

- [ ] 예약 목록 페이징 + 상태 필터 동작
- [ ] 예약 취소 (SSR + REST API) 동작
- [ ] 직원 CRUD 전체 동작 (목록·등록·수정)
- [ ] 진료과 CRUD 전체 동작 (목록·상세·등록·수정)
- [ ] RESTful API (`PUT /api/staff/{id}`, `DELETE /api/reservations/{id}`) 동작
- [ ] @Valid 유효성 검증 동작
- [ ] 단위 테스트 전체 통과
- [ ] PR 리뷰 승인 & develop 머지

---

## W3 -- 전체 접수 목록 & 물품·규칙 CRUD

> **목표:** 전체 접수 목록, 물품 CRUD 완성, 규칙 CRUD 골격 시작
> **의존:** 없음 (독립 작업)

### W3 전반 (Day 1~3)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 1 | 전체 접수 목록(19) 구현 | `AdminReceptionController` `GET /admin/reception/list` | 당일 접수 현황 모니터링 + 페이징 |
| 2 | 환자 목록(20)·상세(21) 구현 | `AdminPatientController` | 환자 목록 검색 + 상세 정보 표시 |
| 3 | RESTful API: 환자 부분 수정 | `PATCH /api/patients/{id}` | JSON 요청/응답 기반 환자 정보 부분 수정 |
| 4 | 물품 목록(27) 구현 | `AdminItemController` `GET /admin/item/list` | 물품 목록 페이징 + 카테고리 필터 |
| 5 | 물품 등록(28) 구현 | `GET/POST /admin/item/new` | 물품 정보 입력 + 저장 |

### W3 후반 (Day 4~5)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 6 | 물품 수정(29) 구현 | `GET/POST /admin/item/edit/{id}` | 물품 전체 필드 수정 |
| 7 | RESTful API: 물품 삭제 | `DELETE /api/items/{id}` | JSON 응답 기반 물품 삭제 |
| 8 | 규칙 CRUD 골격(30) 시작 | `AdminRuleController` 기본 구조 | 규칙 목록 화면 렌더링 |
| 9 | **단위 테스트 작성** | `AdminItemServiceTest`, `HospitalRuleServiceTest` | 물품 CRUD, 활성 규칙 조회 |
| 10 | PR 제출 & 리뷰 반영 | `feature/admin-item` -> `develop` PR | 책임개발자 리뷰 승인 |

### W3 테스트

| 테스트 | 유형 | 검증 내용 |
|--------|------|-----------|
| `AdminItemServiceTest` | 단위 (Mockito) | 물품 CRUD, 카테고리별 조회 |
| `HospitalRuleServiceTest` | 단위 (Mockito) | 규칙 CRUD, 활성 규칙 조회 (is_active=true) |
| `HospitalRuleRepositoryTest` | @DataJpaTest | 활성 규칙 조회, 카테고리별 조회 |
| `ItemRepositoryTest` | @DataJpaTest | 물품 CRUD, 페이징 |

### W3 체크포인트

- [ ] 전체 접수 목록 페이징 동작
- [ ] 환자 목록·상세 동작
- [ ] 물품 CRUD 전체 동작 (목록·등록·수정)
- [ ] RESTful API (`PATCH /api/patients/{id}`, `DELETE /api/items/{id}`) 동작
- [ ] 규칙 목록 화면 골격 렌더링
- [ ] 단위 테스트 전체 통과
- [ ] PR 리뷰 승인 & develop 머지

---

## W4 -- 규칙 CRUD 완성 & 전체 UI 정리

> **목표:** 병원 규칙 CRUD 완성, 전체 관리자 화면 최종 점검
> **의존:** 없음 (규칙 CRUD는 독립 작업, 챗봇 연동은 책임개발자·개발자 B 담당)

### W4 전반 (Day 1~3)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 1 | 규칙 목록(30) 완성 | `GET /admin/rule/list` | 규칙 목록 페이징 + 카테고리 필터 + 활성 상태 표시 |
| 2 | 규칙 등록(31) 구현 | `GET/POST /admin/rule/new` | 제목·내용·카테고리·활성 여부 입력 + 저장 |
| 3 | 규칙 수정(32) 구현 | `GET/POST /admin/rule/edit/{id}` | 규칙 전체 필드 수정 |
| 4 | RESTful API: 규칙 삭제 | `DELETE /api/rules/{id}` | JSON 응답 기반 규칙 삭제 |
| 5 | @Valid 유효성 검증 추가 | 규칙 DTO | 빈 제목·내용 에러 메시지 표시 |

### W4 후반 (Day 4~5)

| 순서 | 작업 | 산출물 | 완료 기준 |
|------|------|--------|-----------|
| 6 | 전체 관리자 화면 UI 점검 | 16개 화면 전수 검사 | 레이아웃·페이징·검색·필터 정상 동작 |
| 7 | 통계 대시보드 최종 검증 | 통계 4종 정확성 | DB 데이터 기준 정확한 집계 |
| 8 | 버그 수정 | 통합 테스트 발견 이슈 수정 | 책임개발자 리포트 기준 |
| 9 | PR 제출 & 리뷰 반영 | `feature/admin-rule` -> `develop` PR | 책임개발자 리뷰 승인 |
| 10 | 배포 지원 | 배포 환경 확인 | 운영 서버에서 관리자 전체 기능 동작 확인 |

### W4 테스트

| 테스트 | 유형 | 검증 내용 |
|--------|------|-----------|
| `AdminDashboardServiceTest` | 단위 (Mockito) | 통계 4종 count 정확성 |
| `HospitalRuleServiceTest` | 단위 (Mockito) | 규칙 CRUD, 활성 규칙 on/off 전환 |
| `AdminControllerTest` (추가) | MockMvc | 규칙 CRUD 엔드포인트, ROLE_ADMIN 전용 |

### W4 체크포인트

- [ ] 규칙 CRUD 전체 동작 (목록·등록·수정·삭제)
- [ ] RESTful API (`DELETE /api/rules/{id}`) 동작
- [ ] 전체 RESTful API 5개 동작 확인 (PUT 1 + PATCH 1 + DELETE 3)
- [ ] 관리자 16개 화면 전수 검사 완료
- [ ] 통계 대시보드 정확성 검증
- [ ] PR 리뷰 승인 & develop 머지
- [ ] 운영 서버 동작 확인

---

## RESTful API 담당 목록 (PBL 필수)

| # | Method | Endpoint | 화면 연동 | 완료 목표 |
|---|--------|----------|-----------|-----------|
| 1 | PUT | `/api/staff/{id}` | 직원 수정(24) | W2 |
| 2 | PATCH | `/api/patients/{id}` | 환자 상세(21) | W3 |
| 3 | DELETE | `/api/reservations/{id}` | 예약 목록(18) | W2 |
| 4 | DELETE | `/api/items/{id}` | 물품 목록(27) | W3 |
| 5 | DELETE | `/api/rules/{id}` | 규칙 목록(30) | W4 |

---

## 절대 터치 금지 영역

| 파일/디렉터리 | 소유자 | 접근 수준 |
|---------------|--------|-----------|
| `config/SecurityConfig.java` | 책임개발자 | 읽기 전용 |
| `domain/*.java` (Entity) | 책임개발자 | 접근 금지 (수정 시 Issue 등록) |
| `common/service/SlotService.java` | 책임개발자 | 인터페이스 호출만 허용 |
| `llm/LlmService.java` | 책임개발자 | 접근 금지 |
| `reservation/**` | 개발자 A | 접근 금지 |
| `staff/**`, `doctor/**`, `nurse/**` | 개발자 B | 접근 금지 |
| `ReservationRepository` | 개발자 A | 읽기 전용 (조회만 허용), `save()` 호출 금지 |

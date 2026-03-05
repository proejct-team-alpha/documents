# 🏥 병원 예약 & 내부 업무 시스템 — ERD 문서 v4

> **문서 버전:** v4.0 (스토리보드 정합 반영)
**작성일:** 2026년
**연관 문서:** 프로젝트 계획서 v4.1 / 화면 흐름 시퀀스 다이어그램 / 스토리보드 v1
**변경 내역:** STAFF.employee_number 추가, TREATMENT_RECORD 필드 3분할, PATIENT.updated_at 추가, ITEM.created_at 추가, HOSPITAL_RULE.content 3000자 제한 명시, 예약 상태 전이 권한 스토리보드 기준 통일, **ITEM_CATEGORY 테이블 신규 추가 및 ITEM.category → category_id FK 정규화**, **RULE_CATEGORY 테이블 신규 추가 및 HOSPITAL_RULE.category → category_id FK 정규화**
>

---

## 목차

1. [ERD 전체 다이어그램](#1-erd-전체-다이어그램)
2. [테이블 정의서](#2-테이블-정의서)
3. [관계 정의](#3-관계-정의)
4. [상태 코드 정의](#4-상태-코드-정의)
5. [v3.0 → v4.0 변경 내역](#5-v30--v40-변경-내역)
6. [설계 결정 사항 & 주의사항](#6-설계-결정-사항--주의사항)
7. [전체 테이블 요약](#-전체-테이블-요약)

---

## 1. ERD 전체 다이어그램

```mermaid
erDiagram

    PATIENT {
        bigint      id              PK
        varchar     name
        varchar     phone
        date        birth_date
        char        gender
        varchar     email
        varchar     address
        varchar     note
        datetime    created_at
        datetime    updated_at
    }

    DEPARTMENT {
        bigint      id              PK
        varchar     name
        boolean     is_active
    }

    STAFF {
        bigint      id              PK
        varchar     username        UK
        varchar     employee_number UK
        varchar     password
        varchar     name
        varchar     role
        bigint      department_id   FK
        boolean     is_active
        datetime    created_at
    }

    DOCTOR {
        bigint      id              PK
        bigint      staff_id        FK
        bigint      department_id   FK
        varchar     available_days
        varchar     specialty
    }

    RESERVATION {
        bigint      id              PK
        varchar     reservation_number  UK
        bigint      patient_id      FK
        bigint      doctor_id       FK
        bigint      department_id   FK
        date        reservation_date
        varchar     time_slot
        varchar     status
        varchar     source
        datetime    created_at
        datetime    updated_at
    }

    TREATMENT_RECORD {
        bigint      id              PK
        bigint      reservation_id  FK
        bigint      doctor_id       FK
        text        diagnosis
        text        prescription
        text        remark
        datetime    created_at
    }

    ITEM_CATEGORY {
        bigint      id              PK
        varchar     name
        boolean     is_active
        datetime    created_at
        datetime    updated_at
    }

    ITEM {
        bigint      id              PK
        varchar     name
        bigint      category_id     FK
        int         quantity
        int         min_quantity
        datetime    created_at
        datetime    updated_at
    }

    RULE_CATEGORY {
        bigint      id              PK
        varchar     name
        boolean     is_active
        datetime    created_at
        datetime    updated_at
    }

    HOSPITAL_RULE {
        bigint      id              PK
        varchar     title
        text        content
        bigint      category_id     FK
        boolean     is_active
        datetime    created_at
        datetime    updated_at
    }

    LLM_RECOMMENDATION {
        bigint      id              PK
        text        symptom_text
        varchar     recommended_dept
        varchar     recommended_doctor
        varchar     recommended_time
        text        llm_response_raw
        boolean     is_used
        datetime    created_at
    }

    CHATBOT_HISTORY {
        bigint      id              PK
        varchar     session_id
        bigint      staff_id        FK
        text        question
        text        answer
        datetime    created_at
    }

    PATIENT             ||--o{    RESERVATION         : "1 : N"
    DOCTOR              ||--o{    RESERVATION         : "1 : N"
    DEPARTMENT          ||--o{    RESERVATION         : "1 : N"
    RESERVATION         ||--o|    TREATMENT_RECORD    : "1 : 1"
    DOCTOR              ||--o{    TREATMENT_RECORD    : "1 : N"
    STAFF               ||--||    DOCTOR              : "1 : 1"
    STAFF               }o--||    DEPARTMENT          : "N : 1"
    DEPARTMENT          ||--o{    DOCTOR              : "1 : N"
    ITEM_CATEGORY       ||--o{    ITEM                : "1 : N"
    RULE_CATEGORY       ||--o{    HOSPITAL_RULE       : "1 : N"
    STAFF               ||--o{    CHATBOT_HISTORY     : "1 : N"
```

---

## 2. 테이블 정의서

### 2.1 PATIENT — 비회원 환자

> 외부 예약 시 생성되는 환자 정보 테이블.
회원 인증 없이 이름·연락처만으로 식별하며, `User` 테이블을 대체한다.
>

| 컬럼명 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 환자 고유 ID |
| `name` | VARCHAR(50) | NOT NULL | 성명 |
| `phone` | VARCHAR(20) | NOT NULL | 연락처 |
| `birth_date` | DATE | NULL | 생년월일 (선택 입력, 예: 2000-01-01) |
| `gender` | CHAR(1) | NULL | 성별 (1=남, 2=여, 9=미상 — 주민번호 7번째 자리와 동일) |
| `email` | VARCHAR(100) | NULL | 이메일 (선택 입력) |
| `address` | VARCHAR(255) | NULL | 주소 — 접수 단계(ROLE_STAFF)에서 추가 입력 |
| `note` | VARCHAR(500) | NULL | 특이사항 — 접수 단계에서 추가 입력 |
| `created_at` | DATETIME | NOT NULL, DEFAULT NOW() | 최초 예약 생성 시각 |
| `updated_at` | DATETIME | NULL | 환자 정보 수정 시각 |

**설계 포인트**

- `birth_date`, `gender`는 선택 입력. 주민번호 7번째 자리(200001011 → 2000-01-01, 1=남) 형식과 호환된다.
- `address`, `note`는 외부 예약 시 NULL. `ROLE_STAFF`의 접수 처리 단계에서 UPDATE된다.
- 동명이인 구분이 어려우므로 `phone`을 준식별자로 활용하는 것을 권장한다.
- LLM 증상 추천 흐름에서 환자가 예약을 확정할 때 이 테이블에 레코드가 생성된다.
- `updated_at`은 `ROLE_STAFF`가 접수 시 환자 정보를 수정하거나, `ROLE_NURSE`가 환자 정보를 수정할 때 갱신된다.

---

### 2.2 DEPARTMENT — 진료과

> 병원 내 진료과 정보. 의사 소속, 예약, LLM 추천의 공통 기준 단위.
>

| 컬럼명 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 진료과 고유 ID |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | 진료과명 (예: 내과, 외과) |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | 운영 여부 — FALSE 시 예약 화면에서 노출 제외 |

**설계 포인트**

- LLM 증상 추천 시 시스템 프롬프트에 `is_active = TRUE`인 진료과 목록만 동적으로 주입한다.

---

### 2.3 STAFF — 내부 직원 (로그인 계정)

> 병원 내부 시스템에 로그인하는 모든 직원의 인증 정보.
외부 환자는 이 테이블을 사용하지 않는다.
>

| 컬럼명 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 직원 고유 ID |
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | 로그인 ID |
| `employee_number` | VARCHAR(20) | NOT NULL, UNIQUE | 사번 — 형식: `{역할코드}-{YYYYMMDD}` |
| `password` | VARCHAR(255) | NOT NULL | BCrypt 암호화 비밀번호 |
| `name` | VARCHAR(50) | NOT NULL | 직원 실명 |
| `role` | VARCHAR(20) | NOT NULL | 권한 — 아래 역할 코드 참조 |
| `department_id` | BIGINT | FK, NULL | 소속 진료과 (간호사·원무는 선택적) |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | 재직 여부 |
| `created_at` | DATETIME | NOT NULL, DEFAULT NOW() | 등록 일시 |

**설계 포인트**

- `employee_number`는 `{역할코드}-{YYYYMMDD}` 형식으로 생성한다.
  - `D-20190305` = DOCTOR (의사)
  - `S-20230401` = STAFF (원무/접수)
  - `N-20210812` = NURSE (간호사)
  - `A-20220601` = ADMIN (관리자)
  - `I-20240115` = ITEM_MANAGER (물품 관리자)
- 역할코드는 role의 첫 글자이며, YYYYMMDD는 입사일(또는 등록일)을 의미한다. (ITEM_MANAGER의 역할코드는 `I`)

**역할(ROLE) 코드**

| role 값 | 설명 | 접근 URL 패턴 | LLM 챗봇 |
| --- | --- | --- | --- |
| `ADMIN` | 관리자 | `/admin/**` | 없음 (규칙 관리) |
| `DOCTOR` | 의사 | `/doctor/**` | **병원 규칙 Q&A 챗봇** |
| `NURSE` | 간호사 | `/nurse/**` | **병원 규칙 Q&A 챗봇** |
| `STAFF` | 원무/접수 | `/staff/**` | 없음 (v1.1 예정) |
| `ITEM_MANAGER` | 물품 관리자 | `/item-manager/**` | 없음 |

---

### 2.4 DOCTOR — 의사 상세 정보

> `STAFF`와 1:1 관계. `role = 'DOCTOR'`인 직원의 진료 관련 부가 정보를 저장한다.
>

| 컬럼명 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 의사 고유 ID |
| `staff_id` | BIGINT | FK, UNIQUE | Staff 참조 — 1:1 제약 |
| `department_id` | BIGINT | FK, NOT NULL | 소속 진료과 |
| `available_days` | VARCHAR(20) | NULL | 진료 가능 요일 (예: `MON,WED,FRI`) |
| `specialty` | VARCHAR(100) | NULL | 전문 분야 (예: 소화기내과) |

**설계 포인트**

- `available_days`는 쉼표 구분 문자열로 저장한다. (예: `"MON,TUE,THU"`)
- 외부 예약 화면에서 날짜 선택 시 해당 요일에 진료 가능한 의사만 필터링하여 표시한다.
- LLM 추천 시 시스템 프롬프트에 의사명과 전문 분야(`specialty`) 목록을 함께 주입한다.

---

### 2.5 RESERVATION — 예약

> 외부 환자의 예약 정보. 시스템 전체 상태 변화의 중심 테이블이다.
>

| 컬럼명 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 예약 고유 ID |
| `reservation_number` | VARCHAR(20) | NOT NULL, UNIQUE | 예약번호 (예: `RES-20260301-001`) |
| `patient_id` | BIGINT | FK, NOT NULL | 환자 참조 |
| `doctor_id` | BIGINT | FK, NOT NULL | 담당 의사 참조 |
| `department_id` | BIGINT | FK, NOT NULL | 진료과 참조 |
| `reservation_date` | DATE | NOT NULL | 예약 날짜 |
| `time_slot` | VARCHAR(10) | NOT NULL | 예약 시간 슬롯 (예: `09:00`) |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT `RESERVED` | 예약 상태 — 코드 정의 참조 |
| `source` | VARCHAR(20) | NOT NULL, DEFAULT `ONLINE` | 예약 경로 (ONLINE/PHONE/WALKIN) |
| `created_at` | DATETIME | NOT NULL, DEFAULT NOW() | 예약 생성 일시 |
| `updated_at` | DATETIME | NULL | 마지막 상태 변경 일시 |

**중복 예약 방지 UNIQUE 제약**

```sql
UNIQUE KEY uq_reservation (doctor_id, reservation_date, time_slot)
-- 동일 의사·날짜·시간 슬롯에 2개 이상의 예약을 DB 레벨에서 차단
```

**예약번호 생성 규칙**

```
형식: RES-{YYYYMMDD}-{당일 순번 3자리}
예시: RES-20260301-001
```

**LLM 추천 연결 흐름**

```
LLM_RECOMMENDATION (추천 이력)
  recommended_dept, recommended_doctor, recommended_time
       ↓ 환자가 "이 추천으로 예약하기" 선택
RESERVATION 생성 시 해당 값이 자동 입력됨
LLM_RECOMMENDATION.is_used = TRUE 로 업데이트
```

---

### 2.6 TREATMENT_RECORD — 진료 기록

> 의사가 진료 완료 후 작성하는 기록. `RESERVATION`과 1:1 관계.
>

| 컬럼명 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 진료 기록 고유 ID |
| `reservation_id` | BIGINT | FK, UNIQUE | 예약 참조 — UNIQUE로 1:1 보장 |
| `doctor_id` | BIGINT | FK, NOT NULL | 진료한 의사 참조 |
| `diagnosis` | TEXT | NOT NULL | 진단명 |
| `prescription` | TEXT | NOT NULL | 처방 |
| `remark` | TEXT | NULL | 비고 (선택) |
| `created_at` | DATETIME | NOT NULL, DEFAULT NOW() | 진료 기록 작성 시각 |

**설계 포인트**

- 기존 `diagnosis_note` 단일 컬럼을 `diagnosis`(진단명), `prescription`(처방), `remark`(비고)로 3분할하여 스토리보드 화면 구조와 정합성을 확보하였다.
- `diagnosis`와 `prescription`은 필수 입력(NOT NULL)이며, `remark`는 선택 입력(NULL 허용)이다.
- `TreatmentRecord` 저장과 `Reservation.status = COMPLETED` 변경은 **반드시 하나의 트랜잭션**으로 처리한다.
- `reservation_id`에 UNIQUE 제약 → 하나의 예약에 하나의 진료 기록만 허용.

---

### 2.7 ITEM_CATEGORY — 물품 카테고리 ★ 신규 (v4.1)

> 물품(`ITEM`)의 카테고리를 관리하는 코드 테이블.
기존 `ITEM.category` VARCHAR 컬럼의 하드코딩 방식을 정규화하여, 물품 관리자(`ROLE_ITEM_MANAGER`)가 카테고리를 동적으로 추가·수정·비활성화할 수 있도록 분리하였다.
>

| 컬럼명 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 카테고리 고유 ID |
| `name` | VARCHAR(50) | NOT NULL, UNIQUE | 카테고리명 (예: 의료 소모품, 의료 장비) |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | 사용 여부 — FALSE 시 물품 등록 화면에서 선택 제외 |
| `created_at` | DATETIME | NOT NULL, DEFAULT NOW() | 등록 일시 |
| `updated_at` | DATETIME | NOT NULL | 수정 일시 |

**설계 포인트**

- 물품 등록·수정 화면의 카테고리 드롭다운에는 `is_active = TRUE`인 카테고리만 노출한다.
- 카테고리 삭제 대신 `is_active = FALSE`로 비활성화하여, 기존 물품의 FK 무결성을 유지한다.
- 초기 데이터: `의료 소모품(MEDICAL_SUPPLIES)`, `의료 장비(MEDICAL_EQUIPMENT)`, `일반 소모품(GENERAL_SUPPLIES)` 3건을 시드 데이터로 INSERT한다.

**초기 시드 데이터**

```sql
INSERT INTO item_category (name, is_active, created_at, updated_at) VALUES
('의료 소모품', TRUE, NOW(), NOW()),
('의료 장비',   TRUE, NOW(), NOW()),
('일반 소모품', TRUE, NOW(), NOW());
```

---

### 2.8 ITEM — 물품 (재고)

> 병원 내 물품 및 재고 정보. 단순 수량 관리만 지원한다. (입출고 로그는 v1.1 확장 예정)
>

| 컬럼명 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 물품 고유 ID |
| `name` | VARCHAR(100) | NOT NULL | 물품명 |
| `category_id` | BIGINT | FK, NOT NULL | 카테고리 참조 — `ITEM_CATEGORY.id` |
| `quantity` | INT | NOT NULL, DEFAULT 0 | 현재 재고 수량 |
| `min_quantity` | INT | NOT NULL, DEFAULT 0 | 최소 재고 기준 (부족 판단 기준) |
| `created_at` | DATETIME | NOT NULL, DEFAULT NOW() | 물품 등록 일시 |
| `updated_at` | DATETIME | NOT NULL | 최근 수량 수정 일시 |

**재고 부족 판단 로직**

```sql
-- 물품 관리자 대시보드 / 관리자 대시보드 통계 쿼리 (단순 count)
SELECT COUNT(*) FROM item WHERE quantity < min_quantity
```

---

### 2.9 RULE_CATEGORY — 병원 규칙 카테고리 ★ 신규 (v4.2)

> 병원 규칙(`HOSPITAL_RULE`)의 카테고리를 관리하는 코드 테이블.
기존 `HOSPITAL_RULE.category` VARCHAR 컬럼의 하드코딩 방식을 정규화하여, 관리자(`ROLE_ADMIN`)가 카테고리를 동적으로 추가·수정·비활성화할 수 있도록 분리하였다.
>

| 컬럼명 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 카테고리 고유 ID |
| `name` | VARCHAR(50) | NOT NULL, UNIQUE | 카테고리명 (예: 응급 처치, 당직·근무) |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | 사용 여부 — FALSE 시 규칙 등록 화면에서 선택 제외 |
| `created_at` | DATETIME | NOT NULL, DEFAULT NOW() | 등록 일시 |
| `updated_at` | DATETIME | NOT NULL | 수정 일시 |

**설계 포인트**

- 규칙 등록·수정 화면의 카테고리 드롭다운에는 `is_active = TRUE`인 카테고리만 노출한다.
- 카테고리 삭제 대신 `is_active = FALSE`로 비활성화하여, 기존 규칙의 FK 무결성을 유지한다.
- 챗봇 시스템 프롬프트 주입 시 `RULE_CATEGORY.name`을 카테고리 구분자로 활용한다.
- 초기 데이터: `응급 처치(EMERGENCY)`, `물품·비품(SUPPLY)`, `당직·근무(DUTY)`, `위생·감염(HYGIENE)`, `기타(OTHER)` 5건을 시드 데이터로 INSERT한다.

**초기 시드 데이터**

```sql
INSERT INTO rule_category (name, is_active, created_at, updated_at) VALUES
('응급 처치', TRUE, NOW(), NOW()),
('물품·비품', TRUE, NOW(), NOW()),
('당직·근무', TRUE, NOW(), NOW()),
('위생·감염', TRUE, NOW(), NOW()),
('기타',      TRUE, NOW(), NOW());
```

---

### 2.10 HOSPITAL_RULE — 병원 규칙 문서 ★ 수정 (v4.2)

> 관리자(`ROLE_ADMIN`)가 등록·관리하는 병원 내부 규칙 문서.
`ROLE_DOCTOR` · `ROLE_NURSE`의 Q&A 챗봇 시스템 프롬프트 컨텍스트로 사용된다.
>

| 컬럼명 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 규칙 고유 ID |
| `title` | VARCHAR(200) | NOT NULL | 규칙 제목 (예: 응급 처치 절차) |
| `content` | TEXT | NOT NULL | 규칙 본문 텍스트 |
| `category_id` | BIGINT | FK, NOT NULL | 카테고리 참조 — `RULE_CATEGORY.id` |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | 챗봇 컨텍스트 포함 여부 — FALSE 시 프롬프트에서 제외 |
| `created_at` | DATETIME | NOT NULL, DEFAULT NOW() | 등록 일시 |
| `updated_at` | DATETIME | NOT NULL | 수정 일시 |

**설계 포인트**

- `content`는 애플리케이션 레벨에서 최대 3000자 제한을 적용한다. DB 컬럼 타입은 TEXT를 유지하되, Service 레이어에서 입력값 검증(validation)으로 3000자를 초과하지 않도록 차단한다.
- `category_id`는 `RULE_CATEGORY.id`를 참조하는 외래 키이며, ON DELETE RESTRICT로 카테고리에 규칙이 존재하는 한 삭제를 차단한다.

**챗봇 프롬프트 주입 방식**

```sql
-- LlmService에서 챗봇 호출 시 아래 쿼리로 규칙 전체를 조회하여 시스템 프롬프트에 주입
SELECT hr.title, hr.content, rc.name AS category_name
FROM hospital_rule hr
JOIN rule_category rc ON hr.category_id = rc.id
WHERE hr.is_active = TRUE
ORDER BY rc.name
```

---

### 2.11 LLM_RECOMMENDATION — 증상 추천 이력 ★ 신규 (v4.1)

> 환자의 증상 분석 요청과 LLM 추천 결과를 기록하는 이력 테이블.
실제 예약으로 이어졌는지 추적하여 추후 추천 품질 개선에 활용한다.
**이미지 관련 컬럼 없음** — v4.1에서 텍스트 전용으로 확정.
>

| 컬럼명 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 추천 이력 고유 ID |
| `symptom_text` | TEXT | NOT NULL | 환자 입력 증상 텍스트 |
| `recommended_dept` | VARCHAR(100) | NULL | LLM 추천 진료과명 |
| `recommended_doctor` | VARCHAR(100) | NULL | LLM 추천 의사명 |
| `recommended_time` | VARCHAR(50) | NULL | LLM 추천 시간대 (예: 오전) |
| `llm_response_raw` | TEXT | NULL | LLM 응답 원문 JSON (디버깅·분석용) |
| `is_used` | BOOLEAN | NOT NULL, DEFAULT FALSE | 이 추천으로 실제 예약이 생성되었는지 여부 |
| `created_at` | DATETIME | NOT NULL, DEFAULT NOW() | 추천 요청 일시 |

**설계 포인트**

- `has_image` 컬럼 없음 — v4.1에서 이미지 입력 기능 제외로 불필요.
- `is_used`는 환자가 "이 추천으로 예약하기"를 선택하여 `RESERVATION`이 생성될 때 `TRUE`로 UPDATE된다.
- `llm_response_raw`는 원문 JSON을 그대로 저장하여 LLM 응답 파싱 오류 발생 시 디버깅에 활용한다.
- **외래 키 미설정** — 비회원 예약 특성상 `PATIENT`와 연결하지 않는다. 추천 → 예약 전환 추적은 `is_used` 플래그로만 관리한다.

---

### 2.12 CHATBOT_HISTORY — 챗봇 대화 이력 ★ 신규 (v3.0)

> 의사(`ROLE_DOCTOR`)·간호사(`ROLE_NURSE`)가 병원 규칙 Q&A 챗봇을 사용할 때 발생하는 대화 이력을 저장하는 테이블.
세션 단위로 대화 이력을 관리하며, 로그아웃 시 이력은 DB에 보존되고 다음 로그인 시 새 세션 ID로 시작한다.
>

| 컬럼명 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | BIGINT | PK, AUTO_INCREMENT | 대화 이력 고유 ID |
| `session_id` | VARCHAR(100) | NOT NULL, INDEX | HTTP 세션 ID (Spring Session) |
| `staff_id` | BIGINT | FK, NOT NULL | 질문한 직원 참조 (STAFF.id) |
| `question` | TEXT | NOT NULL | 직원 질문 |
| `answer` | TEXT | NOT NULL | LLM 응답 |
| `created_at` | DATETIME | NOT NULL, DEFAULT NOW() | 대화 생성 일시 |

**설계 포인트**

- 세션 단위로 대화 이력을 관리한다. 로그아웃 시 이력은 DB에 보존되며, 다음 로그인 시 새 세션 ID로 시작한다.
- `DOCTOR`/`NURSE` 역할만 사용하는 테이블이다.
- `session_id`에 인덱스를 설정하여 세션별 대화 목록 조회 성능을 확보한다.
- `staff_id`는 `STAFF.id`를 참조하는 외래 키이며, ON DELETE CASCADE로 직원 삭제 시 대화 이력도 함께 삭제된다.

---

## 3. 관계 정의

### 3.1 관계 목록

| 관계 | 형태 | 설명 |
| --- | --- | --- |
| `PATIENT` → `RESERVATION` | 1:N | 한 환자가 여러 예약을 가질 수 있다 |
| `DOCTOR` → `RESERVATION` | 1:N | 한 의사가 여러 예약을 담당한다 |
| `DEPARTMENT` → `RESERVATION` | 1:N | 한 진료과에 여러 예약이 존재한다 |
| `RESERVATION` → `TREATMENT_RECORD` | 1:1 | 하나의 예약에 하나의 진료 기록 |
| `DOCTOR` → `TREATMENT_RECORD` | 1:N | 한 의사가 여러 진료 기록을 작성한다 |
| `STAFF` → `DOCTOR` | 1:1 | 의사 역할 직원의 진료 부가 정보 |
| `DEPARTMENT` → `DOCTOR` | 1:N | 한 진료과에 여러 의사 소속 |
| `DEPARTMENT` → `STAFF` | 1:N | 한 진료과에 여러 직원 소속 |
| `STAFF` → `CHATBOT_HISTORY` | 1:N | 한 직원이 여러 챗봇 대화 이력을 가진다 |
| `ITEM_CATEGORY` → `ITEM` | 1:N | 한 카테고리에 여러 물품이 속한다 |
| `RULE_CATEGORY` → `HOSPITAL_RULE` | 1:N | 한 카테고리에 여러 병원 규칙이 속한다 |
| `LLM_RECOMMENDATION` | 독립 | 다른 테이블과 FK 없음. 추천 이력 전용 |

### 3.2 외래 키(FK) 목록

| 테이블 | FK 컬럼 | 참조 테이블 | 참조 컬럼 | ON DELETE |
| --- | --- | --- | --- | --- |
| `STAFF` | `department_id` | `DEPARTMENT` | `id` | SET NULL |
| `DOCTOR` | `staff_id` | `STAFF` | `id` | CASCADE |
| `DOCTOR` | `department_id` | `DEPARTMENT` | `id` | RESTRICT |
| `RESERVATION` | `patient_id` | `PATIENT` | `id` | RESTRICT |
| `RESERVATION` | `doctor_id` | `DOCTOR` | `id` | RESTRICT |
| `RESERVATION` | `department_id` | `DEPARTMENT` | `id` | RESTRICT |
| `TREATMENT_RECORD` | `reservation_id` | `RESERVATION` | `id` | CASCADE |
| `TREATMENT_RECORD` | `doctor_id` | `DOCTOR` | `id` | RESTRICT |
| `ITEM` | `category_id` | `ITEM_CATEGORY` | `id` | RESTRICT |
| `HOSPITAL_RULE` | `category_id` | `RULE_CATEGORY` | `id` | RESTRICT |
| `CHATBOT_HISTORY` | `staff_id` | `STAFF` | `id` | CASCADE |

---

## 4. 상태 코드 정의

### 4.1 RESERVATION.status 상태 흐름

```mermaid
stateDiagram-v2
    [*] --> RESERVED : 예약 생성\n(외부 비회원 / LLM 추천 확정)

    RESERVED --> RECEIVED  : 접수 처리 (ROLE_STAFF)
    RECEIVED --> COMPLETED : 진료 완료 (ROLE_DOCTOR)

    RESERVED --> CANCELLED : 취소 (ROLE_ADMIN)
    RECEIVED --> CANCELLED : 미방문 취소 (ROLE_ADMIN)

    COMPLETED --> [*]
    CANCELLED --> [*]
```

### 4.2 상태별 상세 정의

| 상태값 | 한국어 | 전환 주체 | 진입 조건 | 가능한 다음 상태 |
| --- | --- | --- | --- | --- |
| `RESERVED` | 예약완료 | 외부 비회원 (직접 / LLM 추천) | 예약 폼 제출 성공 | `RECEIVED`, `CANCELLED` |
| `RECEIVED` | 접수완료 | `ROLE_STAFF` | 이전 상태가 `RESERVED`인 경우만 허용 | `COMPLETED`, `CANCELLED` |
| `COMPLETED` | 진료완료 | `ROLE_DOCTOR` | 이전 상태가 `RECEIVED`인 경우만 허용 | 없음 (최종 상태) |
| `CANCELLED` | 취소 | `ROLE_ADMIN` | `COMPLETED` 이전 상태에서만 허용 | 없음 (최종 상태) |

**상태 전이 검증 규칙 (Service 레이어 필수 구현)**

```
RESERVED  → RECEIVED  : 허용 — ROLE_STAFF
RECEIVED  → COMPLETED : 허용 — ROLE_DOCTOR
RESERVED  → CANCELLED : 허용 — ROLE_ADMIN
RECEIVED  → CANCELLED : 허용 — ROLE_ADMIN
COMPLETED → 어떤 상태  : 금지 — 역방향 전이 불가
CANCELLED → 어떤 상태  : 금지 — 취소 후 복구 불가
```

### 4.3 STAFF.role 코드

| 값 | 설명 | 접근 URL | LLM 기능 |
| --- | --- | --- | --- |
| `ADMIN` | 관리자 | `/admin/**` | 병원 규칙 CRUD |
| `DOCTOR` | 의사 | `/doctor/**` | 규칙 Q&A 챗봇 사용 |
| `NURSE` | 간호사 | `/nurse/**` | 규칙 Q&A 챗봇 사용 |
| `STAFF` | 원무/접수 | `/staff/**` | 없음 (v1.1 예정) |
| `ITEM_MANAGER` | 물품 관리자 | `/item-manager/**` | 없음 |

### 4.4 ITEM 카테고리 (ITEM_CATEGORY 테이블 관리)

> v4.0까지는 `ITEM.category` VARCHAR 컬럼에 하드코딩된 코드 값으로 관리하였으나,
> v4.1부터 `ITEM_CATEGORY` 테이블로 정규화하여 동적 관리가 가능하도록 변경하였다.
> 아래는 초기 시드 데이터로 등록되는 기본 카테고리이다.

| 초기 카테고리명 | 설명 | 비고 |
| --- | --- | --- |
| `의료 소모품` | 주사기, 거즈, 소독약 등 | 시드 데이터 |
| `의료 장비` | 혈압계, 체온계, 심전도기 등 | 시드 데이터 |
| `일반 소모품` | 사무용품, 청소용품 등 | 시드 데이터 |

- 물품 관리자(`ROLE_ITEM_MANAGER`)가 카테고리 관리 화면에서 추가·수정·비활성화 가능

### 4.5 HOSPITAL_RULE 카테고리 (RULE_CATEGORY 테이블 관리)

> v4.1까지는 `HOSPITAL_RULE.category` VARCHAR 컬럼에 하드코딩된 코드 값으로 관리하였으나,
> v4.2부터 `RULE_CATEGORY` 테이블로 정규화하여 동적 관리가 가능하도록 변경하였다.
> 아래는 초기 시드 데이터로 등록되는 기본 카테고리이다.

| 초기 카테고리명 | 설명 | 비고 |
| --- | --- | --- |
| `응급 처치` | 응급 처치 관련 규칙 | 시드 데이터 |
| `물품·비품` | 물품·비품 보관 위치 | 시드 데이터 |
| `당직·근무` | 당직·근무 관련 규정 | 시드 데이터 |
| `위생·감염` | 감염 예방·위생 수칙 | 시드 데이터 |
| `기타` | 기타 규칙 | 시드 데이터 |

- 관리자(`ROLE_ADMIN`)가 카테고리 관리 화면에서 추가·수정·비활성화 가능

### 4.6 RESERVATION.source 코드

| 값 | 설명 | 생성 주체 |
| --- | --- | --- |
| `ONLINE` | 비회원 온라인 예약 | 비회원 환자 |
| `PHONE` | 전화 예약 | ROLE_STAFF |
| `WALKIN` | 방문 접수 | ROLE_STAFF |

---

## 5. v3.0 → v4.0 변경 내역

| 항목 | ERD v3.0 | ERD v4.0 | 변경 이유 |
| --- | --- | --- | --- |
| STAFF.employee_number | 없음 | **컬럼 추가** (VARCHAR(20), NOT NULL, UNIQUE) | 스토리보드 정합 — 사번 표시 필요 |
| TREATMENT_RECORD 필드 | `diagnosis_note` TEXT 단일 컬럼 | **3분할**: `diagnosis` TEXT NOT NULL, `prescription` TEXT NOT NULL, `remark` TEXT NULL | 스토리보드 진료 기록 화면 구조 반영 |
| PATIENT.updated_at | 없음 | **컬럼 추가** (DATETIME, NULL) | 접수·간호사 환자 정보 수정 시각 추적 |
| ITEM.created_at | 없음 | **컬럼 추가** (DATETIME, NOT NULL, DEFAULT NOW()) | 물품 등록 일시 기록 |
| HOSPITAL_RULE.content | 제한 없음 | **최대 3000자** (Service 레이어 검증) | 애플리케이션 레벨 입력 제한 명시 |
| 예약 상태 전이 권한 | RESERVED→RECEIVED: STAFF/ADMIN, RECEIVED→COMPLETED: DOCTOR/ADMIN, →CANCELLED: STAFF/ADMIN | RESERVED→RECEIVED: **STAFF only**, RECEIVED→COMPLETED: **DOCTOR only**, →CANCELLED: **ADMIN only** | 스토리보드 기준 역할별 권한 통일 |
| **ITEM_CATEGORY 테이블** | 없음 | **테이블 신규 추가** (id, name, is_active, created_at, updated_at) | 물품 카테고리 동적 관리를 위해 정규화 |
| **ITEM.category** | `category` VARCHAR(50) 하드코딩 | **`category_id` BIGINT FK** → ITEM_CATEGORY.id 참조 | 카테고리 코드 정규화 (VARCHAR → FK) |
| **RULE_CATEGORY 테이블** | 없음 | **테이블 신규 추가** (id, name, is_active, created_at, updated_at) | 병원 규칙 카테고리 동적 관리를 위해 정규화 |
| **HOSPITAL_RULE.category** | `category` VARCHAR(50) 하드코딩 | **`category_id` BIGINT FK** → RULE_CATEGORY.id 참조 | 카테고리 코드 정규화 (VARCHAR → FK) |

---

## 6. 설계 결정 사항 & 주의사항

### 6.1 핵심 설계 결정 5가지

**① User 테이블 미사용 — PATIENT + STAFF 분리**

외부 환자는 `PATIENT`, 내부 직원은 `STAFF`로 완전히 분리한다. 두 테이블은 서로 FK 관계가 없다. Spring Security는 `STAFF` 테이블만 인증 대상으로 처리하여 설정 복잡도를 최소화한다.

**② STAFF와 DOCTOR 분리 설계**

직원 로그인 정보(`STAFF`)와 의사 진료 부가 정보(`DOCTOR`)를 분리하여 간호사·원무 직원이 불필요한 의사 컬럼을 갖지 않도록 한다. `role = 'DOCTOR'`인 직원만 `DOCTOR` 레코드를 1:1로 보유한다.

**③ 중복 예약 방지 — DB 레벨 + Service 레벨 이중 방어**

- Service 레이어에서 사전 조회 후 명확한 오류 메시지 반환 (사용자 경험)
- DB UNIQUE 제약 `(doctor_id, reservation_date, time_slot)`으로 최후 방어 (데이터 정합성)

**④ HOSPITAL_RULE 카테고리 정규화 & LLM_RECOMMENDATION 독립 설계**

- `HOSPITAL_RULE`: `RULE_CATEGORY` 테이블과 FK 관계(`category_id`)를 갖는다. 카테고리를 동적으로 관리하며, 챗봇 프롬프트 주입 시 JOIN 쿼리로 카테고리명과 함께 조회한다.
- `LLM_RECOMMENDATION`: 다른 테이블과 FK 관계를 갖지 않는다(독립). `PATIENT`와 연결하지 않는 이유는 추천 시점에 아직 `PATIENT`가 생성되기 전이기 때문.

**⑤ TreatmentRecord + Reservation 트랜잭션 묶음 처리**

```java
// 반드시 @Transactional 내에서 두 작업 처리
treatmentRecordRepository.save(record);
reservation.updateStatus(ReservationStatus.COMPLETED);
// 둘 중 하나 실패 시 전체 롤백
```

### 6.2 LLM 연동 시 DB 활용 흐름 정리

```
[증상 추천 흐름]
1. DEPARTMENT: is_active=TRUE 목록 조회 → 프롬프트 주입
2. DOCTOR: specialty, available_days 조회 → 프롬프트 주입
3. Claude API 호출 → JSON 응답 수신
4. LLM_RECOMMENDATION: 추천 이력 저장
5. 환자가 예약 확정 → PATIENT, RESERVATION 생성
6. LLM_RECOMMENDATION.is_used = TRUE 업데이트

[규칙 Q&A 챗봇 흐름]
1. HOSPITAL_RULE + RULE_CATEGORY: is_active=TRUE 규칙을 카테고리명과 함께 JOIN 조회 → 시스템 프롬프트 주입
2. Claude API 호출 → 자연어 답변 수신
3. CHATBOT_HISTORY: 질문·답변 이력 저장
```

### 6.3 MVP 범위에서 의도적으로 제외한 설계 요소

| 제외 항목 | 이유 | v1.1 계획 |
| --- | --- | --- |
| `has_image` 컬럼 | 이미지 입력 기능 v4.1 제외 결정 | 추가 예정 |
| 재고 입출고 로그 테이블 | 동시성 처리 복잡도 | 추가 예정 |
| LLM 추천 피드백 테이블 | 범위 초과 | 검토 예정 |
| Soft Delete (`deleted_at`) | 단순 CRUD 수준 유지 | 적용 권장 |
| 환자 방문 이력 집계 뷰 | 초진/재진 구분 로직 복잡 | 검토 예정 |

### 6.4 인덱스 권장사항

```sql
-- 예약 조회 성능 (당일 예약 조회 빈번)
CREATE INDEX idx_reservation_date   ON reservation(reservation_date);
CREATE INDEX idx_reservation_status ON reservation(status);
CREATE INDEX idx_reservation_doctor ON reservation(doctor_id, reservation_date);
CREATE INDEX idx_reservation_source ON reservation(source);

-- 직원 로그인 성능
CREATE UNIQUE INDEX idx_staff_username ON staff(username);

-- 직원 사번 조회 성능
CREATE UNIQUE INDEX idx_staff_employee_number ON staff(employee_number);

-- 물품 카테고리 조회 성능
CREATE INDEX idx_item_category ON item(category_id);

-- 규칙 카테고리 조회 성능
CREATE INDEX idx_rule_category ON hospital_rule(category_id);

-- 규칙 챗봇 조회 성능
CREATE INDEX idx_rule_active ON hospital_rule(is_active);

-- LLM 추천 이력 분석용
CREATE INDEX idx_llm_used ON llm_recommendation(is_used);
CREATE INDEX idx_llm_created ON llm_recommendation(created_at);

-- 챗봇 대화 이력 조회 성능
CREATE INDEX idx_chatbot_session ON chatbot_history(session_id);
CREATE INDEX idx_chatbot_staff ON chatbot_history(staff_id);
```

### 6.5 JPA 엔티티 패키지 구조 (권장)

```
com.hospital.domain
├─ patient
│   └─ Patient.java
├─ staff
│   ├─ Staff.java
│   ├─ StaffRole.java            (Enum: ADMIN, DOCTOR, NURSE, STAFF, ITEM_MANAGER)
│   └─ Doctor.java
├─ department
│   └─ Department.java
├─ reservation
│   ├─ Reservation.java
│   ├─ ReservationStatus.java    (Enum: RESERVED, RECEIVED, COMPLETED, CANCELLED)
│   └─ TreatmentRecord.java
├─ inventory
│   ├─ Item.java
│   └─ ItemCategory.java         (Entity: ITEM_CATEGORY 테이블 매핑 — 카테고리 동적 관리)
└─ llm
    ├─ HospitalRule.java
    ├─ RuleCategory.java           (Entity: RULE_CATEGORY 테이블 매핑 — 카테고리 동적 관리)
    ├─ LlmRecommendation.java
    └─ ChatbotHistory.java
```

---

## 📋 전체 테이블 요약

| 테이블 | 레코드 규모 | 주요 역할 | FK 관계 | LLM 연관 |
| --- | --- | --- | --- | --- |
| `PATIENT` | 중간 | 비회원 환자 정보 | RESERVATION | 추천 확정 시 생성 |
| `DEPARTMENT` | 소수 | 진료과 목록 | STAFF, DOCTOR, RESERVATION | 프롬프트 주입 소스 |
| `STAFF` | 소수 | 내부 직원 계정·인증 | DEPARTMENT, CHATBOT_HISTORY | 없음 |
| `DOCTOR` | 소수 | 의사 진료 부가 정보 | STAFF, DEPARTMENT | 프롬프트 주입 소스 |
| `RESERVATION` | 다수 | 예약 중심·상태 흐름 | PATIENT, DOCTOR, DEPARTMENT | 추천 연결 대상 |
| `TREATMENT_RECORD` | 다수 | 진료 기록 | RESERVATION, DOCTOR | 없음 |
| `ITEM_CATEGORY` | 소수 | 물품 카테고리 관리 | ITEM | 없음 |
| `ITEM` | 소수 | 물품·재고 관리 | ITEM_CATEGORY | 없음 |
| `RULE_CATEGORY` | 소수 | 병원 규칙 카테고리 관리 | HOSPITAL_RULE | 없음 |
| `HOSPITAL_RULE` | 소수 | 병원 규칙 문서 | RULE_CATEGORY | **챗봇 컨텍스트** |
| `LLM_RECOMMENDATION` | 다수 | 증상 추천 이력 | **없음 (독립)** | **추천 이력 저장** |
| `CHATBOT_HISTORY` | 다수 | 챗봇 대화 이력 | STAFF | **대화 이력 저장** |

---

*본 ERD는 프로젝트 계획서 v4.1, 화면 흐름 시퀀스 다이어그램, 스토리보드 v1을 기반으로 작성되었습니다. 변경 발생 시 GitHub Wiki에서 버전 이력을 관리합니다.*
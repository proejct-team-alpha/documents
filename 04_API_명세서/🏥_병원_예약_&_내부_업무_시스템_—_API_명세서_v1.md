# 🏥 병원 예약 & 내부 업무 시스템 — API 명세서 v1

> **문서 버전:** v1.0
**작성일:** 2026년
**연관 문서:** 프로젝트 계획서 v4.1 / ERD v2.0 / 시퀀스 다이어그램 v2.0
**기준:** Spring Boot SSR (Mustache) + REST 혼용 구조
**인증 방식:** 세션 기반 (Spring Security)
> 

---

## 목차

1. [공통 규칙](#1-공통-규칙)
2. [인증 API](#2-인증-api)
3. [외부 예약 API](#3-외부-예약-api)
4. [LLM 증상 추천 API](#4-llm-증상-추천-api)
5. [접수 직원 API (ROLE_STAFF)](#5-접수-직원-api-role_staff)
6. [의사 API (ROLE_DOCTOR)](#6-의사-api-role_doctor)
7. [간호사 API (ROLE_NURSE)](#7-간호사-api-role_nurse)
8. [LLM 규칙 챗봇 API](#8-llm-규칙-챗봇-api)
9. [관리자 — 예약·환자 API (ROLE_ADMIN)](#9-관리자--예약환자-api-role_admin)
10. [관리자 — 인사 관리 API (ROLE_ADMIN)](#10-관리자--인사-관리-api-role_admin)
11. [관리자 — 진료과 API (ROLE_ADMIN)](#11-관리자--진료과-api-role_admin)
12. [관리자 — 물품 관리 API (ROLE_ADMIN)](#12-관리자--물품-관리-api-role_admin)
13. [관리자 — 병원 규칙 API (ROLE_ADMIN)](#13-관리자--병원-규칙-api-role_admin)
14. [관리자 — 대시보드 API (ROLE_ADMIN)](#14-관리자--대시보드-api-role_admin)
15. [에러 코드 정의](#15-에러-코드-정의)
16. [전체 API 목록 요약](#전체-api-목록-요약)
17. [v2.0 URL 설계 변경 요약](#v20-url-설계-변경-요약)

---

## 1. 공통 규칙

### 1.1 Base URL

```
http://{host}:{port}
```

### 1.2 URL 구조 규칙

| 접두어 | 대상 | 인증 |
| --- | --- | --- |
| `/reservation/**` | 외부 비회원 환자 | 불필요 |
| `/staff/**` | ROLE_STAFF | 세션 필요 |
| `/doctor/**` | ROLE_DOCTOR | 세션 필요 |
| `/nurse/**` | ROLE_NURSE | 세션 필요 |
| `/admin/**` | ROLE_ADMIN | 세션 필요 |
| `/api/llm/**` | 내부 LLM 비동기 호출 | 세션 필요 (DOCTOR, NURSE) |

### 1.3 HTTP 메서드 규칙

| 메서드 | 용도 |
| --- | --- |
| `GET` | 화면 렌더링 요청 (Mustache SSR) 또는 데이터 조회 |
| `POST` | 데이터 생성 / 상태 변경 / LLM 호출 |
| `PUT` | 데이터 전체 수정 |
| `PATCH` | 특정 필드 부분 수정 (상태 변경 등) |
| `DELETE` | 데이터 삭제 |

### 1.4 공통 응답 형식

**성공 응답**

```json
{
  "success": true,
  "data": { },
  "message": "처리 완료"
}
```

**실패 응답**

```json
{
  "success": false,
  "errorCode": "DUPLICATE_RESERVATION",
  "message": "이미 예약된 시간대입니다."
}
```

### 1.5 공통 헤더

```
Content-Type: application/json
Accept: application/json
```

> SSR 화면 요청(GET)은 Content-Type 불필요.
AJAX 비동기 요청(LLM 챗봇 등)은 Content-Type: application/json 필요.
> 

### 1.6 인증 오류 공통 응답

| 상황 | HTTP 상태 | 처리 |
| --- | --- | --- |
| 미로그인 접근 | `302` | `/login` 리다이렉트 |
| 권한 없는 접근 | `403` | 권한 오류 화면 렌더링 |
| 세션 만료 | `302` | `/login` 리다이렉트 |

---

## 2. 인증 API

### 2.1 로그인 화면

```
GET /login
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 로그인 폼 화면 렌더링 |
| 인증 | 불필요 |
| 응답 | 로그인 화면 (Mustache) |

---

### 2.2 로그인 처리

```
POST /login
```

| 항목 | 내용 |
| --- | --- |
| 설명 | username + password 인증 후 세션 발급 |
| 인증 | 불필요 |
| 처리 | Spring Security 자동 처리 |

**Request Body (Form)**

```
username=admin01
password=password123
```

**성공 시 리다이렉트**

| ROLE | 리다이렉트 경로 |
| --- | --- |
| `ROLE_ADMIN` | `/admin/dashboard` |
| `ROLE_DOCTOR` | `/doctor/today` |
| `ROLE_NURSE` | `/nurse/today` |
| `ROLE_STAFF` | `/staff/reception` |

**실패 시**

```
리다이렉트: /login?error=true
```

---

### 2.3 로그아웃

```
POST /logout
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 세션 무효화 후 로그인 화면으로 이동 |
| 인증 | 세션 필요 |
| 처리 | Spring Security 자동 처리 |

**성공 시**

```
리다이렉트: /login?logout=true
```

---

## 3. 외부 예약 API

> 비회원 환자 대상. 세션 인증 불필요.
> 

### 3.1 예약 방식 선택 화면

```
GET /reservation
```

| 항목 | 내용 |
| --- | --- |
| 설명 | AI 추천 예약 / 직접 선택 예약 분기 화면 렌더링 |
| 인증 | 불필요 |
| 응답 | 예약 방식 선택 화면 (Mustache) |

---

### 3.2 증상 입력 화면

```
GET /reservation/symptom
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 증상 텍스트 입력 폼 렌더링 |
| 인증 | 불필요 |
| 응답 | 증상 입력 화면 (Mustache) |

---

### 3.3 직접 선택 예약 화면

```
GET /reservation/direct
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 진료과·의사·날짜·시간 직접 선택 예약 폼 렌더링 |
| 인증 | 불필요 |

**Query Parameters**

| 파라미터 | 필수 | 설명 |
| --- | --- | --- |
| `recommendedDept` | 선택 | LLM 추천 결과에서 전달받은 진료과명 (자동 입력용) |
| `recommendedDoctor` | 선택 | LLM 추천 결과에서 전달받은 의사명 (자동 입력용) |
| `recommendedTime` | 선택 | LLM 추천 결과에서 전달받은 시간대 (자동 입력용) |

**Response Body (Model)**

```json
{
  "departments": [
    { "id": 1, "name": "내과" },
    { "id": 2, "name": "외과" }
  ],
  "prefilledDept": "외과",
  "prefilledDoctor": "김철수",
  "prefilledTime": "오전"
}
```

---

### 3.4 의사별 예약 가능 시간 조회

```
GET /reservation/slots
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 선택한 의사·날짜 기준 예약 가능한 시간 슬롯 조회 |
| 인증 | 불필요 |

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `doctorId` | Long | ✅ | 의사 ID |
| `date` | String | ✅ | 예약 날짜 (yyyy-MM-dd) |

**Response Body**

```json
{
  "success": true,
  "data": {
    "availableSlots": ["09:00", "09:30", "10:00", "11:00"],
    "unavailableSlots": ["10:30", "11:30"]
  }
}
```

---

### 3.5 진료과별 의사 조회

```
GET /reservation/doctors
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 선택한 진료과에 소속된 의사 목록 조회 |
| 인증 | 불필요 |

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `departmentId` | Long | ✅ | 진료과 ID |
| `date` | String | 선택 | 날짜 지정 시 available_days 기반 필터링 (yyyy-MM-dd) |

**Response Body**

```json
{
  "success": true,
  "data": {
    "doctors": [
      {
        "id": 1,
        "name": "김철수",
        "specialty": "소화기내과",
        "availableDays": ["MON", "WED", "FRI"]
      }
    ]
  }
}
```

---

### 3.6 예약 생성

```
POST /reservation
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 비회원 예약 생성. 중복 체크 후 Patient + Reservation 저장 |
| 인증 | 불필요 |

**Request Body**

```json
{
  "patientName": "홍길동",
  "patientPhone": "010-1234-5678",
  "patientEmail": "hong@example.com",
  "departmentId": 2,
  "doctorId": 1,
  "reservationDate": "2026-03-15",
  "timeSlot": "09:00",
  "llmRecommendationId": 3
}
```

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `patientName` | String | ✅ | 환자 성명 |
| `patientPhone` | String | ✅ | 연락처 |
| `patientEmail` | String | 선택 | 이메일 |
| `departmentId` | Long | ✅ | 진료과 ID |
| `doctorId` | Long | ✅ | 의사 ID |
| `reservationDate` | String | ✅ | yyyy-MM-dd |
| `timeSlot` | String | ✅ | HH:mm (30분 단위 고정 슬롯) |
| `llmRecommendationId` | Long | 선택 | LLM 추천 경유 시 전달 → is_used = TRUE 업데이트 |

**Response Body (성공)**

```json
{
  "success": true,
  "data": {
    "reservationNumber": "RES-20260315-001",
    "patientName": "홍길동",
    "departmentName": "외과",
    "doctorName": "김철수",
    "reservationDate": "2026-03-15",
    "timeSlot": "09:00"
  },
  "message": "예약이 완료되었습니다."
}
```

**Response Body (중복 오류)**

```json
{
  "success": false,
  "errorCode": "DUPLICATE_RESERVATION",
  "message": "해당 시간대는 이미 예약이 완료되었습니다."
}
```

---

### 3.7 예약 완료 화면

```
GET /reservation/complete
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 예약 완료 후 예약번호 표시 화면 렌더링 |
| 인증 | 불필요 |

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `reservationNumber` | String | ✅ | 발급된 예약번호 |

---

## 4. LLM 증상 추천 API

### 4.1 증상 분석 및 추천

```
POST /api/llm/symptom
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 증상 텍스트를 Claude API에 전달하여 진료과·의사·시간 추천 반환 |
| 인증 | 불필요 (외부 환자 대상) |
| 처리 방식 | 서버 사이드 Claude API 호출 (API Key 노출 없음) |
| 타임아웃 | 5초 초과 시 폴백 응답 반환 |

**Request Body**

```json
{
  "symptomText": "3일 전부터 오른쪽 아랫배가 아프고 미열이 지속됩니다."
}
```

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `symptomText` | String | ✅ | 환자 증상 텍스트 (최대 1000자) |

**Response Body (성공)**

```json
{
  "success": true,
  "data": {
    "recommendationId": 42,
    "recommendedDepartment": "외과",
    "recommendedDoctor": "김철수",
    "recommendedTime": "오전",
    "summary": "복통과 미열 증상으로 외과 진료가 적합합니다.",
    "disclaimer": "이 결과는 AI 참고 안내이며, 의학적 진단이 아닙니다. 최종 판단은 반드시 의사에게 받으시기 바랍니다."
  }
}
```

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `recommendationId` | Long | LLM_RECOMMENDATION 저장 ID (예약 확정 시 전달 필요) |
| `recommendedDepartment` | String | 추천 진료과명 |
| `recommendedDoctor` | String | 추천 의사명 |
| `recommendedTime` | String | 추천 시간대 (오전 / 오후) |
| `summary` | String | LLM 생성 증상 요약 |
| `disclaimer` | String | 면책 고지 문구 (화면 필수 표시) |

**Response Body (LLM API 실패 — 폴백)**

```json
{
  "success": false,
  "errorCode": "LLM_SERVICE_UNAVAILABLE",
  "message": "AI 추천 서비스가 일시적으로 불가합니다. 직접 선택하여 예약해 주세요."
}
```

> **폴백 처리:** 프론트에서 `LLM_SERVICE_UNAVAILABLE` 수신 시 `/reservation/direct`로 자동 이동.
> 

---

## 5. 접수 직원 API (ROLE_STAFF)

### 5.1 오늘 예약 목록 화면

```
GET /staff/reception
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 당일 RESERVED 상태 예약 목록 렌더링 |
| 인증 | ROLE_STAFF, ROLE_ADMIN |

**Response Body (Model)**

```json
{
  "reservations": [
    {
      "id": 10,
      "reservationNumber": "RES-20260315-001",
      "patientName": "홍길동",
      "patientPhone": "010-1234-5678",
      "departmentName": "외과",
      "doctorName": "김철수",
      "timeSlot": "09:00",
      "status": "RESERVED"
    }
  ],
  "today": "2026-03-15",
  "totalCount": 12
}
```

---

### 5.2 접수 처리 화면

```
GET /staff/reception/{reservationId}
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 특정 예약의 접수 처리 폼 렌더링 (환자 추가 정보 입력) |
| 인증 | ROLE_STAFF, ROLE_ADMIN |

**Path Parameters**

| 파라미터 | 타입 | 설명 |
| --- | --- | --- |
| `reservationId` | Long | 예약 ID |

**Response Body (Model)**

```json
{
  "reservation": {
    "id": 10,
    "reservationNumber": "RES-20260315-001",
    "status": "RESERVED",
    "timeSlot": "09:00",
    "departmentName": "외과",
    "doctorName": "김철수"
  },
  "patient": {
    "id": 5,
    "name": "홍길동",
    "phone": "010-1234-5678",
    "email": "hong@example.com",
    "address": null,
    "note": null
  }
}
```

---

### 5.3 접수 처리 — 상태 변경

```
PATCH /staff/reception/{reservationId}/receive
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 환자 추가 정보 업데이트 + 예약 상태 RESERVED → RECEIVED 변경 |
| 인증 | ROLE_STAFF, ROLE_ADMIN |

**Path Parameters**

| 파라미터 | 타입 | 설명 |
| --- | --- | --- |
| `reservationId` | Long | 예약 ID |

**Request Body**

```json
{
  "address": "부산시 해운대구 xx로 123",
  "note": "고혈압 약 복용 중"
}
```

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `address` | String | 선택 | 환자 주소 |
| `note` | String | 선택 | 특이사항 |

**Response Body (성공)**

```json
{
  "success": true,
  "data": {
    "reservationId": 10,
    "status": "RECEIVED"
  },
  "message": "접수가 완료되었습니다."
}
```

**Response Body (상태 오류)**

```json
{
  "success": false,
  "errorCode": "INVALID_STATUS_TRANSITION",
  "message": "RESERVED 상태에서만 접수 처리가 가능합니다."
}
```

---

### 5.4 전화 예약 등록 화면

```
GET /staff/reservation/new
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 접수 직원이 창구에서 전화 예약을 직접 등록하는 폼 렌더링 |
| 인증 | ROLE_STAFF, ROLE_ADMIN |

---

### 5.5 전화 예약 등록 처리

```
POST /staff/reservation
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 접수 직원이 환자 대신 예약 생성 |
| 인증 | ROLE_STAFF, ROLE_ADMIN |

**Request Body**

```json
{
  "patientName": "이영희",
  "patientPhone": "010-9876-5432",
  "patientEmail": null,
  "departmentId": 1,
  "doctorId": 2,
  "reservationDate": "2026-03-16",
  "timeSlot": "14:00"
}
```

**Response Body (성공)**

```json
{
  "success": true,
  "data": {
    "reservationNumber": "RES-20260316-003"
  },
  "message": "전화 예약이 등록되었습니다."
}
```

---

## 6. 의사 API (ROLE_DOCTOR)

### 6.1 오늘 진료 목록 화면

```
GET /doctor/today
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 로그인한 의사의 당일 RECEIVED 상태 환자 목록 렌더링 |
| 인증 | ROLE_DOCTOR, ROLE_ADMIN |

**Response Body (Model)**

```json
{
  "treatments": [
    {
      "reservationId": 10,
      "patientName": "홍길동",
      "timeSlot": "09:00",
      "status": "RECEIVED",
      "note": "고혈압 약 복용 중"
    },
    {
      "reservationId": 11,
      "patientName": "박민준",
      "timeSlot": "09:30",
      "status": "RECEIVED",
      "note": null
    }
  ],
  "doctorName": "김철수",
  "today": "2026-03-15"
}
```

---

### 6.2 진료 기록 입력 화면

```
GET /doctor/treatment/{reservationId}
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 특정 환자의 진료 기록 입력 폼 렌더링 |
| 인증 | ROLE_DOCTOR (본인 담당 환자만), ROLE_ADMIN |

**Path Parameters**

| 파라미터 | 타입 | 설명 |
| --- | --- | --- |
| `reservationId` | Long | 예약 ID |

**Response Body (Model)**

```json
{
  "reservation": {
    "id": 10,
    "status": "RECEIVED",
    "timeSlot": "09:00",
    "departmentName": "외과"
  },
  "patient": {
    "name": "홍길동",
    "phone": "010-1234-5678",
    "address": "부산시 해운대구 xx로 123",
    "note": "고혈압 약 복용 중"
  }
}
```

---

### 6.3 진료 완료 처리

```
POST /doctor/treatment/{reservationId}/complete
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 진료 기록 저장 + 예약 상태 RECEIVED → COMPLETED 변경 (단일 트랜잭션) |
| 인증 | ROLE_DOCTOR (본인 담당 환자만), ROLE_ADMIN |

**Path Parameters**

| 파라미터 | 타입 | 설명 |
| --- | --- | --- |
| `reservationId` | Long | 예약 ID |

**Request Body**

```json
{
  "diagnosisNote": "급성 맹장염 의심. 정밀 검사 후 수술 여부 결정 예정. 금식 지시."
}
```

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `diagnosisNote` | String | 선택 | 진료 내용 (증상, 처방, 소견 등) |

**Response Body (성공)**

```json
{
  "success": true,
  "data": {
    "reservationId": 10,
    "status": "COMPLETED",
    "treatmentRecordId": 7
  },
  "message": "진료가 완료 처리되었습니다."
}
```

**Response Body (상태 오류)**

```json
{
  "success": false,
  "errorCode": "INVALID_STATUS_TRANSITION",
  "message": "RECEIVED 상태에서만 진료 완료 처리가 가능합니다."
}
```

---

## 7. 간호사 API (ROLE_NURSE)

### 7.1 오늘 예약·접수 현황 화면

```
GET /nurse/today
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 당일 전체 예약 현황을 상태별로 분류하여 렌더링 |
| 인증 | ROLE_NURSE, ROLE_ADMIN |

**Response Body (Model)**

```json
{
  "today": "2026-03-15",
  "summary": {
    "reserved": 5,
    "received": 3,
    "completed": 4,
    "cancelled": 1
  },
  "reservations": [
    {
      "reservationId": 10,
      "patientName": "홍길동",
      "timeSlot": "09:00",
      "doctorName": "김철수",
      "departmentName": "외과",
      "status": "RECEIVED"
    }
  ]
}
```

---

### 7.2 환자 정보 조회

```
GET /nurse/patient/{patientId}
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 특정 환자의 기본 정보 조회 화면 렌더링 |
| 인증 | ROLE_NURSE, ROLE_ADMIN |

**Path Parameters**

| 파라미터 | 타입 | 설명 |
| --- | --- | --- |
| `patientId` | Long | 환자 ID |

---

### 7.3 환자 정보 수정

```
PUT /nurse/patient/{patientId}
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 환자 기본 정보 수정 (이름, 연락처, 특이사항) |
| 인증 | ROLE_NURSE, ROLE_ADMIN |

**Path Parameters**

| 파라미터 | 타입 | 설명 |
| --- | --- | --- |
| `patientId` | Long | 환자 ID |

**Request Body**

```json
{
  "name": "홍길동",
  "phone": "010-1234-9999",
  "note": "당뇨 이력 있음, 고혈압 약 복용 중"
}
```

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `name` | String | ✅ | 환자 성명 |
| `phone` | String | ✅ | 연락처 |
| `note` | String | 선택 | 특이사항 |

**Response Body**

```json
{
  "success": true,
  "message": "환자 정보가 수정되었습니다."
}
```

---

## 8. LLM 규칙 챗봇 API

### 8.1 병원 규칙 질문

```
POST /api/llm/rules/ask
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 직원 질문을 Claude API에 전달하여 병원 규칙 기반 답변 반환 |
| 인증 | ROLE_DOCTOR, ROLE_NURSE |
| 처리 방식 | 서버 사이드 Claude API 호출 |
| 대화 이력 | 저장 없음 (매 요청 독립 처리) |
| 타임아웃 | 5초 초과 시 폴백 응답 반환 |

**Request Body**

```json
{
  "question": "응급 처치 키트는 어디에 보관되어 있나요?"
}
```

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `question` | String | ✅ | 직원 질문 텍스트 (최대 500자) |

**Response Body (성공 — 규칙 내 답변)**

```json
{
  "success": true,
  "data": {
    "answer": "응급 키트는 3층 간호사 스테이션 좌측 캐비닛에 보관되어 있습니다. 사용 후에는 반드시 담당 간호사에게 보고하여 재보충 처리해 주세요."
  }
}
```

**Response Body (규칙 외 질문)**

```json
{
  "success": true,
  "data": {
    "answer": "등록된 병원 규칙에서 해당 질문의 답변을 확인할 수 없습니다. 관련 담당자에게 직접 문의해 주세요."
  }
}
```

**Response Body (LLM API 실패 — 폴백)**

```json
{
  "success": false,
  "errorCode": "LLM_SERVICE_UNAVAILABLE",
  "message": "챗봇 서비스가 일시적으로 불가합니다. 관리자에게 문의해 주세요."
}
```


---

## 9. 관리자 — 예약·환자 API (ROLE_ADMIN)

### 9.1 대시보드 화면

```
GET /admin/dashboard
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 단순 통계 4종 표시 대시보드 렌더링 |
| 인증 | ROLE_ADMIN |

---

### 9.2 전체 예약 목록 화면

```
GET /admin/reservations
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 전체 예약 조회 (날짜·상태·의사 필터 가능) |
| 인증 | ROLE_ADMIN |

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `date` | String | 선택 | 특정 날짜 필터 (yyyy-MM-dd) |
| `status` | String | 선택 | 상태 필터 (RESERVED / RECEIVED / COMPLETED / CANCELLED) |
| `doctorId` | Long | 선택 | 특정 의사 필터 |
| `page` | Integer | 선택 | 페이지 번호 (기본값: 0) |
| `size` | Integer | 선택 | 페이지 크기 (기본값: 20) |

**Response Body (Model)**

```json
{
  "reservations": [
    {
      "id": 10,
      "reservationNumber": "RES-20260315-001",
      "patientName": "홍길동",
      "patientPhone": "010-1234-5678",
      "departmentName": "외과",
      "doctorName": "김철수",
      "reservationDate": "2026-03-15",
      "timeSlot": "09:00",
      "status": "RECEIVED",
      "createdAt": "2026-03-10T14:22:00"
    }
  ],
  "totalCount": 87,
  "page": 0,
  "size": 20
}
```

---

### 9.3 예약 상태 변경 (취소)

```
PATCH /admin/reservations/{reservationId}/cancel
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 예약 취소 처리. COMPLETED 상태에서는 취소 불가 |
| 인증 | ROLE_ADMIN |

**Path Parameters**

| 파라미터 | 타입 | 설명 |
| --- | --- | --- |
| `reservationId` | Long | 예약 ID |

**Response Body (성공)**

```json
{
  "success": true,
  "data": {
    "reservationId": 10,
    "status": "CANCELLED"
  },
  "message": "예약이 취소되었습니다."
}
```

**Response Body (취소 불가)**

```json
{
  "success": false,
  "errorCode": "CANNOT_CANCEL_COMPLETED",
  "message": "진료가 완료된 예약은 취소할 수 없습니다."
}
```

---

### 9.4 환자 목록 조회

```
GET /admin/patients
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 전체 환자 목록 조회 |
| 인증 | ROLE_ADMIN |

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `name` | String | 선택 | 환자 이름 검색 |
| `phone` | String | 선택 | 연락처 검색 |
| `page` | Integer | 선택 | 기본값: 0 |
| `size` | Integer | 선택 | 기본값: 20 |

---

### 9.5 환자 상세 조회 (예약 이력 포함)

```
GET /admin/patients/{patientId}
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 특정 환자 상세 정보 + 전체 예약 이력 조회 |
| 인증 | ROLE_ADMIN |

**Response Body (Model)**

```json
{
  "patient": {
    "id": 5,
    "name": "홍길동",
    "phone": "010-1234-5678",
    "email": "hong@example.com",
    "address": "부산시 해운대구 xx로 123",
    "note": "고혈압 약 복용 중",
    "createdAt": "2026-03-10T14:22:00"
  },
  "reservations": [
    {
      "reservationNumber": "RES-20260315-001",
      "departmentName": "외과",
      "doctorName": "김철수",
      "reservationDate": "2026-03-15",
      "timeSlot": "09:00",
      "status": "COMPLETED"
    }
  ]
}
```

---

## 10. 관리자 — 인사 관리 API (ROLE_ADMIN)

### 10.1 직원 목록 조회

```
GET /admin/staff
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 전체 직원 목록 조회 (ROLE별 분류) |
| 인증 | ROLE_ADMIN |

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `role` | String | 선택 | ROLE 필터 (ADMIN / DOCTOR / NURSE / STAFF) |
| `isActive` | Boolean | 선택 | 재직 여부 필터 (기본값: true) |

**Response Body (Model)**

```json
{
  "staffList": [
    {
      "id": 1,
      "username": "doctor01",
      "name": "김철수",
      "role": "DOCTOR",
      "departmentName": "외과",
      "isActive": true,
      "createdAt": "2026-01-01T09:00:00"
    }
  ],
  "totalCount": 15
}
```

---

### 10.2 직원 등록 화면

```
GET /admin/staff/new
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 직원 등록 폼 렌더링 (진료과 목록 포함) |
| 인증 | ROLE_ADMIN |

---

### 10.3 직원 등록

```
POST /admin/staff
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 직원 등록. ROLE_DOCTOR인 경우 Doctor 레코드 동시 저장 (단일 트랜잭션) |
| 인증 | ROLE_ADMIN |

**Request Body**

```json
{
  "username": "doctor02",
  "password": "securePass123!",
  "name": "이민지",
  "role": "DOCTOR",
  "departmentId": 2,
  "availableDays": ["MON", "TUE", "THU"],
  "specialty": "외상외과"
}
```

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `username` | String | ✅ | 로그인 ID (UNIQUE) |
| `password` | String | ✅ | 비밀번호 (BCrypt 암호화) |
| `name` | String | ✅ | 직원 실명 |
| `role` | String | ✅ | ADMIN / DOCTOR / NURSE / STAFF |
| `departmentId` | Long | 선택 | 소속 진료과 ID |
| `availableDays` | Array | 선택 | ROLE_DOCTOR인 경우 진료 가능 요일 |
| `specialty` | String | 선택 | ROLE_DOCTOR인 경우 전문 분야 |

**Response Body (성공)**

```json
{
  "success": true,
  "data": {
    "staffId": 16,
    "username": "doctor02",
    "role": "DOCTOR"
  },
  "message": "직원이 등록되었습니다."
}
```

---

### 10.4 직원 상세 조회 및 수정 화면

```
GET /admin/staff/{staffId}
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 특정 직원 상세 정보 조회 및 수정 폼 렌더링 |
| 인증 | ROLE_ADMIN |

---

### 10.5 직원 정보 수정

```
PUT /admin/staff/{staffId}
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 직원 정보 수정 (ROLE_DOCTOR인 경우 Doctor 정보도 동시 수정) |
| 인증 | ROLE_ADMIN |

**Request Body**

```json
{
  "name": "이민지",
  "departmentId": 3,
  "availableDays": ["MON", "WED", "FRI"],
  "specialty": "복강경외과"
}
```

---

### 10.6 직원 비활성화 (퇴직 처리)

```
PATCH /admin/staff/{staffId}/deactivate
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 직원 재직 상태를 비활성화 (is_active = FALSE). 삭제 아님. |
| 인증 | ROLE_ADMIN |

**Response Body**

```json
{
  "success": true,
  "message": "직원이 비활성화되었습니다. 해당 직원은 더 이상 로그인할 수 없습니다."
}
```

---

## 11. 관리자 — 진료과 API (ROLE_ADMIN)

### 11.1 진료과 목록 조회

```
GET /admin/departments
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 전체 진료과 목록 화면 렌더링 |
| 인증 | ROLE_ADMIN |

---

### 11.2 진료과 등록

```
POST /admin/departments
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 새 진료과 등록 |
| 인증 | ROLE_ADMIN |

**Request Body**

```json
{
  "name": "피부과"
}
```

**Response Body**

```json
{
  "success": true,
  "data": {
    "departmentId": 6,
    "name": "피부과"
  },
  "message": "진료과가 등록되었습니다."
}
```

---

### 11.3 진료과 수정

```
PUT /admin/departments/{departmentId}
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 진료과 정보 수정 |
| 인증 | ROLE_ADMIN |

**Request Body**

```json
{
  "name": "피부·성형외과",
  "isActive": true
}
```

---

### 11.4 진료과 비활성화

```
PATCH /admin/departments/{departmentId}/deactivate
```

| 항목 | 내용 |
| --- | --- |
| 설명 | is_active = FALSE. 비활성 진료과는 예약 화면 및 LLM 프롬프트에서 제외 |
| 인증 | ROLE_ADMIN |

---

## 12. 관리자 — 물품 관리 API (ROLE_ADMIN)

### 12.1 물품 목록 조회

```
GET /admin/items
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 전체 물품 목록 (재고 부족 항목 강조 포함) |
| 인증 | ROLE_ADMIN |

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `category` | String | 선택 | 카테고리 필터 |
| `shortage` | Boolean | 선택 | true 시 재고 부족 항목만 조회 |

**Response Body (Model)**

```json
{
  "items": [
    {
      "id": 1,
      "name": "일회용 주사기",
      "category": "MEDICAL_SUPPLIES",
      "quantity": 50,
      "minQuantity": 100,
      "isShortage": true,
      "updatedAt": "2026-03-14T10:00:00"
    }
  ],
  "totalCount": 32,
  "shortageCount": 5
}
```

---

### 12.2 물품 등록

```
POST /admin/items
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 새 물품 등록 |
| 인증 | ROLE_ADMIN |

**Request Body**

```json
{
  "name": "혈압계",
  "category": "MEDICAL_EQUIPMENT",
  "quantity": 5,
  "minQuantity": 2
}
```

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `name` | String | ✅ | 물품명 |
| `category` | String | ✅ | MEDICAL_SUPPLIES / MEDICAL_EQUIPMENT / GENERAL_SUPPLIES |
| `quantity` | Integer | ✅ | 현재 수량 |
| `minQuantity` | Integer | ✅ | 최소 재고 기준 |

---

### 12.3 물품 수량 수정

```
PATCH /admin/items/{itemId}/quantity
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 물품 재고 수량 직접 수정 (입출고 로그 없음 — MVP) |
| 인증 | ROLE_ADMIN |

**Path Parameters**

| 파라미터 | 타입 | 설명 |
| --- | --- | --- |
| `itemId` | Long | 물품 ID |

**Request Body**

```json
{
  "quantity": 80
}
```

**Response Body**

```json
{
  "success": true,
  "data": {
    "itemId": 1,
    "name": "일회용 주사기",
    "quantity": 80,
    "isShortage": false
  },
  "message": "재고 수량이 수정되었습니다."
}
```

---

### 12.4 물품 삭제

```
DELETE /admin/items/{itemId}
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 물품 삭제 |
| 인증 | ROLE_ADMIN |

---

## 13. 관리자 — 병원 규칙 API (ROLE_ADMIN)

### 13.1 규칙 목록 조회

```
GET /admin/rules
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 전체 병원 규칙 목록 (is_active 포함) 화면 렌더링 |
| 인증 | ROLE_ADMIN |

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `category` | String | 선택 | 카테고리 필터 |
| `isActive` | Boolean | 선택 | 활성 여부 필터 |

**Response Body (Model)**

```json
{
  "rules": [
    {
      "id": 1,
      "title": "응급 처치 절차",
      "category": "EMERGENCY",
      "isActive": true,
      "updatedAt": "2026-02-01T09:00:00"
    }
  ],
  "totalCount": 12,
  "activeCount": 10
}
```

---

### 13.2 규칙 등록

```
POST /admin/rules
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 병원 규칙 등록. 즉시 챗봇 프롬프트에 반영됨. |
| 인증 | ROLE_ADMIN |

**Request Body**

```json
{
  "title": "응급 처치 절차",
  "content": "응급 상황 발생 시\n1. 담당 의사에게 즉시 연락한다.\n2. 응급 키트는 3층 간호사 스테이션 좌측에 보관되어 있다.\n3. 119 연락은 원무과 담당자가 수행한다.",
  "category": "EMERGENCY"
}
```

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `title` | String | ✅ | 규칙 제목 (최대 200자) |
| `content` | String | ✅ | 규칙 본문 텍스트 |
| `category` | String | ✅ | EMERGENCY / SUPPLY / DUTY / HYGIENE / OTHER |

**Response Body**

```json
{
  "success": true,
  "data": {
    "ruleId": 13,
    "title": "응급 처치 절차",
    "isActive": true
  },
  "message": "규칙이 등록되었습니다. 챗봇에 즉시 반영됩니다."
}
```

---

### 13.3 규칙 수정

```
PUT /admin/rules/{ruleId}
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 병원 규칙 전체 수정. 즉시 챗봇에 반영됨. |
| 인증 | ROLE_ADMIN |

**Request Body**

```json
{
  "title": "응급 처치 절차 (개정)",
  "content": "응급 상황 발생 시\n1. 담당 의사에게 즉시 연락한다. (내선: 301)\n...",
  "category": "EMERGENCY"
}
```

---

### 13.4 규칙 활성화 상태 변경

```
PATCH /admin/rules/{ruleId}/toggle
```

| 항목 | 내용 |
| --- | --- |
| 설명 | is_active 토글. FALSE 시 챗봇 프롬프트에서 즉시 제외. |
| 인증 | ROLE_ADMIN |

**Response Body**

```json
{
  "success": true,
  "data": {
    "ruleId": 1,
    "isActive": false
  },
  "message": "규칙이 비활성화되었습니다. 챗봇에서 제외됩니다."
}
```

---

### 13.5 규칙 삭제

```
DELETE /admin/rules/{ruleId}
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 병원 규칙 삭제. 삭제 전 비활성화 권장. |
| 인증 | ROLE_ADMIN |

---

## 14. 관리자 — 대시보드 API (ROLE_ADMIN)

### 14.1 통계 데이터 조회

```
GET /admin/dashboard/stats
```

| 항목 | 내용 |
| --- | --- |
| 설명 | 대시보드 단순 통계 4종 데이터 반환 |
| 인증 | ROLE_ADMIN |

**Response Body**

```json
{
  "success": true,
  "data": {
    "todayReservationCount": 18,
    "totalReservationCount": 1247,
    "departmentStats": [
      { "departmentName": "내과", "count": 432 },
      { "departmentName": "외과", "count": 389 },
      { "departmentName": "피부과", "count": 218 }
    ],
    "itemShortageCount": 5
  }
}
```

| 필드 | 설명 | 쿼리 |
| --- | --- | --- |
| `todayReservationCount` | 오늘 예약 수 | `COUNT(*) WHERE reservation_date = TODAY` |
| `totalReservationCount` | 전체 예약 수 | `COUNT(*)` |
| `departmentStats` | 진료과별 예약 수 | `COUNT(*) GROUP BY department_id` |
| `itemShortageCount` | 재고 부족 물품 수 | `COUNT(*) WHERE quantity < min_quantity` |


---

## 15. 에러 코드 정의

### 15.1 예약 관련

| 에러 코드 | HTTP 상태 | 설명 |
| --- | --- | --- |
| `DUPLICATE_RESERVATION` | `409` | 동일 의사·날짜·시간 중복 예약 |
| `INVALID_TIME_SLOT` | `400` | 유효하지 않은 시간 슬롯 |
| `DOCTOR_NOT_AVAILABLE` | `400` | 해당 날짜 의사 진료 불가 (available_days 불일치) |
| `RESERVATION_NOT_FOUND` | `404` | 예약 ID 없음 |
| `CANNOT_CANCEL_COMPLETED` | `409` | 진료 완료 예약 취소 불가 |

### 15.2 상태 전이 관련

| 에러 코드 | HTTP 상태 | 설명 |
| --- | --- | --- |
| `INVALID_STATUS_TRANSITION` | `409` | 허용되지 않는 상태 전이 시도 |
| `ALREADY_CANCELLED` | `409` | 이미 취소된 예약 |
| `ALREADY_COMPLETED` | `409` | 이미 완료된 예약 |

### 15.3 인증·권한 관련

| 에러 코드 | HTTP 상태 | 설명 |
| --- | --- | --- |
| `UNAUTHORIZED` | `401` | 미인증 접근 |
| `ACCESS_DENIED` | `403` | 권한 없는 접근 (ROLE 불일치) |
| `NOT_OWN_PATIENT` | `403` | 본인 담당이 아닌 환자 접근 (의사) |

### 15.4 LLM 관련

| 에러 코드 | HTTP 상태 | 설명 |
| --- | --- | --- |
| `LLM_SERVICE_UNAVAILABLE` | `503` | Claude API 호출 실패 / 타임아웃 |
| `LLM_PARSE_ERROR` | `500` | LLM 응답 JSON 파싱 오류 |

### 15.5 데이터 관련

| 에러 코드 | HTTP 상태 | 설명 |
| --- | --- | --- |
| `RESOURCE_NOT_FOUND` | `404` | 요청한 리소스 없음 |
| `DUPLICATE_USERNAME` | `409` | 이미 존재하는 로그인 ID |
| `VALIDATION_ERROR` | `400` | 필수 필드 누락 또는 형식 오류 |

---

## 전체 API 목록 요약

| 번호 | 메서드 | URL | 설명 | 인증 |
| --- | --- | --- | --- | --- |
| 1 | GET | `/login` | 로그인 화면 | ❌ |
| 2 | POST | `/login` | 로그인 처리 | ❌ |
| 3 | POST | `/logout` | 로그아웃 | ✅ |
| 4 | GET | `/reservation` | 예약 방식 선택 | ❌ |
| 5 | GET | `/reservation/symptom` | 증상 입력 화면 | ❌ |
| 6 | GET | `/reservation/direct` | 직접 선택 예약 화면 | ❌ |
| 7 | GET | `/reservation/getSlots` | 예약 가능 시간 조회 | ❌ |
| 8 | GET | `/reservation/getDoctors` | 진료과별 의사 조회 | ❌ |
| 9 | POST | `/reservation/create` | 예약 생성 | ❌ |
| 10 | GET | `/reservation/complete` | 예약 완료 화면 | ❌ |
| 11 | POST | `/llm/symptom/analyze` | LLM 증상 분석·추천 | ❌ |
| 12 | GET | `/staff/reception/list` | 오늘 예약 목록 | STAFF |
| 13 | GET | `/staff/reception/detail` | 접수 처리 화면 | STAFF |
| 14 | POST | `/staff/reception/receive` | 접수 처리 | STAFF |
| 15 | GET | `/staff/reservation/new` | 전화 예약 등록 화면 | STAFF |
| 16 | POST | `/staff/reservation/create` | 전화 예약 등록 | STAFF |
| 17 | GET | `/doctor/treatment/list` | 오늘 진료 목록 | DOCTOR |
| 18 | GET | `/doctor/treatment/detail` | 진료 기록 입력 화면 | DOCTOR |
| 19 | POST | `/doctor/treatment/complete` | 진료 완료 처리 | DOCTOR |
| 20 | GET | `/nurse/schedule/list` | 오늘 예약 현황 | NURSE |
| 21 | GET | `/nurse/patient/detail` | 환자 정보 조회 | NURSE |
| 22 | POST | `/nurse/patient/update` | 환자 정보 수정 | NURSE |
| 23 | POST | `/llm/rules/ask` | 규칙 Q&A 챗봇 | DOCTOR, NURSE |
| 24 | GET | `/admin/dashboard` | 대시보드 화면 | ADMIN |
| 25 | GET | `/admin/dashboard/stats` | 통계 데이터 조회 | ADMIN |
| 26 | GET | `/admin/reservation/list` | 전체 예약 목록 | ADMIN |
| 27 | POST | `/admin/reservation/cancel` | 예약 취소 | ADMIN |
| 28 | GET | `/admin/patient/list` | 환자 목록 | ADMIN |
| 29 | GET | `/admin/patient/detail` | 환자 상세·이력 | ADMIN |
| 30 | GET | `/admin/staff/list` | 직원 목록 | ADMIN |
| 31 | GET | `/admin/staff/new` | 직원 등록 화면 | ADMIN |
| 32 | POST | `/admin/staff/create` | 직원 등록 | ADMIN |
| 33 | GET | `/admin/staff/detail` | 직원 상세·수정 화면 | ADMIN |
| 34 | POST | `/admin/staff/update` | 직원 정보 수정 | ADMIN |
| 35 | POST | `/admin/staff/deactivate` | 직원 비활성화 | ADMIN |
| 36 | GET | `/admin/department/list` | 진료과 목록 | ADMIN |
| 37 | POST | `/admin/department/create` | 진료과 등록 | ADMIN |
| 38 | POST | `/admin/department/update` | 진료과 수정 | ADMIN |
| 39 | POST | `/admin/department/deactivate` | 진료과 비활성화 | ADMIN |
| 40 | GET | `/admin/item/list` | 물품 목록 | ADMIN |
| 41 | POST | `/admin/item/create` | 물품 등록 | ADMIN |
| 42 | POST | `/admin/item/updateQuantity` | 수량 수정 | ADMIN |
| 43 | POST | `/admin/item/delete` | 물품 삭제 | ADMIN |
| 44 | GET | `/admin/rule/list` | 규칙 목록 | ADMIN |
| 45 | POST | `/admin/rule/create` | 규칙 등록 | ADMIN |
| 46 | POST | `/admin/rule/update` | 규칙 수정 | ADMIN |
| 47 | POST | `/admin/rule/toggleActive` | 규칙 활성화 토글 | ADMIN |
| 48 | POST | `/admin/rule/delete` | 규칙 삭제 | ADMIN |

**총 48개 엔드포인트 | GET 24개 · POST 24개**

---

## v2.0 URL 설계 변경 요약

### URL 구조 변경 사항

| 구분 | 변경 내용 | 예시 |
| --- | --- | --- |
| 메서드 | GET / POST 만 사용 | `POST /admin/item/delete` |
| ID 전달 | Path Variable 제거 → Query Param (GET) 또는 Body (POST) | `GET /staff/reception/detail?reservationId=10` |
| 액션 명시 | URL 마지막 세그먼트에 동사 명시 | `/list` · `/detail` · `/create` · `/update` · `/delete` |
| 복수형 제거 | 자원명 단수 통일 | `/admin/reservation/list` (reservations → reservation) |
| 경로 단순화 | `/api/` 불필요 접두어 제거 | `/llm/symptom/analyze` |

### 주요 액션 URL 패턴

| 액션 | 메서드 | URL 패턴 | ID 전달 방식 |
| --- | --- | --- | --- |
| 목록 조회 | `GET` | `/{역할}/{자원}/list` | Query Param (선택) |
| 상세 조회 | `GET` | `/{역할}/{자원}/detail` | Query Param (필수) |
| 등록 화면 | `GET` | `/{역할}/{자원}/new` | — |
| 생성 | `POST` | `/{역할}/{자원}/create` | Body 불필요 |
| 수정 | `POST` | `/{역할}/{자원}/update` | Body 필수 |
| 삭제 | `POST` | `/{역할}/{자원}/delete` | Body 필수 |
| 비활성화 | `POST` | `/{역할}/{자원}/deactivate` | Body 필수 |
| 상태 변경 | `POST` | `/{역할}/{자원}/{액션}` | Body 필수 |

---

*⬅️ 이전 문서: API 명세서 (2/3) — 9. 관리자 예약·환자 API ~ 14. 관리자 대시보드 API*

*본 API 명세서는 프로젝트 계획서 v4.1, ERD v2.0, 시퀀스 다이어그램 v2.0을 기반으로 작성되었습니다.변경 발생 시 GitHub Wiki에서 버전 이력을 관리합니다.*
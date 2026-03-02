# 🏥 병원 예약 & 내부 업무 시스템 (HMS) — 프로젝트 문서

> **프로젝트명:** hospital-reservation
> **개발 기간:** 4주 (고정)
> **팀 구성:** 책임개발자 1명 + 개발자 3명 + AI 보조
> **기술 스택:** Spring Boot + Mustache SSR + Redis + Claude LLM API
> **GitHub:** [https://github.com/hospital-reservation-system-mng/docs](https://github.com/hospital-reservation-system-mng/docs)

---

## 📚 문서 목차

### 1. 프로젝트 계획서

| 문서 | 버전 | 설명 | 링크 |
|------|------|------|------|
| 프로젝트 계획서 v1 | v1.0 | 초기 계획 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/01_프로젝트_계획서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8_%EA%B3%84%ED%9A%8D%EC%84%9C_v1.md) |
| 프로젝트 계획서 v2 | v2.0 | 2차 수정 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/01_프로젝트_계획서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8_%EA%B3%84%ED%9A%8D%EC%84%9C_v2.md) |
| 프로젝트 계획서 v3 | v3.0 | 3차 수정 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/01_프로젝트_계획서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8_%EA%B3%84%ED%9A%8D%EC%84%9C_v3.md) |
| 프로젝트 계획서 v4_0 | v4.0 | LLM 기능 통합 (5주) | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/01_프로젝트_계획서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8_%EA%B3%84%ED%9A%8D%EC%84%9C_v4_0.md) |
| 프로젝트 계획서 v4_1 | v4.1 | 4주 압축 + 증상 텍스트 전용 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/01_프로젝트_계획서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8_%EA%B3%84%ED%9A%8D%EC%84%9C_v4_1.md) |
| 프로젝트 계획서 v4_2 | v4.2 | 화면 33개·API 61개 확장 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/01_프로젝트_계획서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8_%EA%B3%84%ED%9A%8D%EC%84%9C_v4_2.md) |
| **프로젝트 계획서 v4_3** | **v4.3** | **PBL 정합: API 67개, Redis, RESTful API 레이어 (권장)** | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/01_프로젝트_계획서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8_%EA%B3%84%ED%9A%8D%EC%84%9C_v4_3.md) |

**v4.3 핵심 요약:** 비회원 증상 텍스트 → Claude API 분석 → 진료과·의사·시간 추천 / 내부 직원: STAFF, DOCTOR, NURSE, ADMIN / 병원 규칙 Q&A 챗봇 / PBL 필수: Redis 세션, RESTful API, @Valid

---

### 2. ERD 문서

| 문서 | 버전 | 설명 | 링크 |
|------|------|------|------|
| ERD 문서 v1 | v1.0 | 초기 스키마 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/02_ERD_문서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_ERD_%EB%AC%B8%EC%84%9C_v1.md) |
| ERD 문서 v2 | v2.0 | HOSPITAL_RULE·LLM_RECOMMENDATION 추가 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/02_ERD_문서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_ERD_%EB%AC%B8%EC%84%9C_v2.md) |
| ERD 문서 v3 | v3.0 | CHATBOT_HISTORY, RESERVATION.source 추가 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/02_ERD_문서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_ERD_%EB%AC%B8%EC%84%9C_v3.md) |
| **ERD 문서 v4** | **v4.0** | **스토리보드 정합 (권장)** | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/02_ERD_문서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_ERD_%EB%AC%B8%EC%84%9C_v4.md) |

---

### 3. 프로젝트 아키텍처 정의서

| 문서 | 버전 | 설명 | 링크 |
|------|------|------|------|
| 프로젝트 아키텍처 정의서 v1 | v1.0 | Spring Boot 레이어 구조, 패키지·소유자 맵핑 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/03_프로젝트_아키텍처_정의서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8_%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98_%EC%A0%95%EC%9D%98%EC%84%9C_v1.md) |
| **프로젝트 아키텍처 정의서 v2** | **v2.0** | **Redis, @Valid, CSRF, RESTful API 레이어 (권장)** | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/03_프로젝트_아키텍처_정의서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8_%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98_%EC%A0%95%EC%9D%98%EC%84%9C_v2.md) |

---

### 4. API 명세서

| 문서 | 버전 | 설명 | 링크 |
|------|------|------|------|
| API 명세서 v1 | v1.0 | REST 혼용 구조 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/04_API_명세서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_API_%EB%AA%85%EC%84%B8%EC%84%9C_v1.md) |
| API 명세서 v2 | v2.0 | RPC 스타일 계층형 URL | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/04_API_명세서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_API_%EB%AA%85%EC%84%B8%EC%84%9C_v2.md) |
| API 명세서 v3 | v3.0 | 단일 문서, 컨트롤러 반환 패턴 개정 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/04_API_명세서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_API_%EB%AA%85%EC%84%B8%EC%84%9C_v3.md) |
| API 명세서 v4 | v4.0 | RESTful API 레이어, @Valid | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/04_API_명세서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_API_%EB%AA%85%EC%84%B8%EC%84%9C_v4.md) |
| **API 명세서 v5** | **v5.0** | **스토리보드 정합, 총 75개 (권장)** | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/04_API_명세서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_API_%EB%AA%85%EC%84%B8%EC%84%9C_v5.md) |

---

### 5. 화면 흐름 시퀀스 다이어그램

| 문서 | 버전 | 설명 | 링크 |
|------|------|------|------|
| 화면 흐름 시퀀스 다이어그램 v1 | v1.0 | 초기 흐름 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/05_화면_흐름_시퀀스_다이어그램/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%ED%99%94%EB%A9%B4_%ED%9D%90%EB%A6%84_%EC%8B%9C%ED%80%80%EC%8A%A4_%EB%8B%A4%EC%9D%B4%EC%96%B4%EA%B7%B8%EB%9E%A8_v1.md) |
| 화면 흐름 시퀀스 다이어그램 v2 | v2.0 | v4.1 기반 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/05_화면_흐름_시퀀스_다이어그램/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%ED%99%94%EB%A9%B4_%ED%9D%90%EB%A6%84_%EC%8B%9C%ED%80%80%EC%8A%A4_%EB%8B%A4%EC%9D%B4%EC%96%B4%EA%B7%B8%EB%9E%A8_v2.md) |
| 화면 흐름 시퀀스 다이어그램 v3 | v3.0 | v4.2 + API spec v3.0, PRG 패턴 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/05_화면_흐름_시퀀스_다이어그램/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%ED%99%94%EB%A9%B4_%ED%9D%90%EB%A6%84_%EC%8B%9C%ED%80%80%EC%8A%A4_%EB%8B%A4%EC%9D%B4%EC%96%B4%EA%B7%B8%EB%9E%A8_v3.md) |
| 화면 흐름 시퀀스 다이어그램 v4 | v4.0 | ERD v3.0 정합 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/05_화면_흐름_시퀀스_다이어그램/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%ED%99%94%EB%A9%B4_%ED%9D%90%EB%A6%84_%EC%8B%9C%ED%80%80%EC%8A%A4_%EB%8B%A4%EC%9D%B4%EC%96%B4%EA%B7%B8%EB%9E%A8_v4.md) |
| **화면 흐름 시퀀스 다이어그램 v5** | **v5.0** | **스토리보드 정합 (권장)** | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/05_화면_흐름_시퀀스_다이어그램/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%ED%99%94%EB%A9%B4_%ED%9D%90%EB%A6%84_%EC%8B%9C%ED%80%80%EC%8A%A4_%EB%8B%A4%EC%9D%B4%EC%96%B4%EA%B7%B8%EB%9E%A8_v5.md) |

---

### 6. 화면 기능 정의서

| 문서 | 버전 | 설명 | 링크 |
|------|------|------|------|
| 전체 화면 목록 및 화면별 기능 정의서 v1 | v1.0 | 초기 화면 정의 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/06_화면_기능_정의서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%EC%A0%84%EC%B2%B4_%ED%99%94%EB%A9%B4_%EB%AA%A9%EB%A1%9D_%EB%B0%8F_%ED%99%94%EB%A9%B4%EB%B3%84_%EA%B8%B0%EB%8A%A5_%EC%A0%95%EC%9D%98%EC%84%9C_v1.md) |
| 전체 화면 목록 및 화면별 기능 정의서 v2 | v2.0 | 역할 분리·정보관리 추가 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/06_화면_기능_정의서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%EC%A0%84%EC%B2%B4_%ED%99%94%EB%A9%B4_%EB%AA%A9%EB%A1%9D_%EB%B0%8F_%ED%99%94%EB%A9%B4%EB%B3%84_%EA%B8%B0%EB%8A%A5_%EC%A0%95%EC%9D%98%EC%84%9C_v2.md) |
| 전체 화면 목록 및 화면별 기능 정의서 v3 | v3.0 | API spec v3.0 동기화, 33개+C1 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/06_화면_기능_정의서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%EC%A0%84%EC%B2%B4_%ED%99%94%EB%A9%B4_%EB%AA%A9%EB%A1%9D_%EB%B0%8F_%ED%99%94%EB%A9%B4%EB%B3%84_%EA%B8%B0%EB%8A%A5_%EC%A0%95%EC%9D%98%EC%84%9C_v3.md) |
| 전체 화면 목록 및 화면별 기능 정의서 v4 | v4.0 | 진료과 API 정합, ITEM 카테고리 통일 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/06_화면_기능_정의서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%EC%A0%84%EC%B2%B4_%ED%99%94%EB%A9%B4_%EB%AA%A9%EB%A1%9D_%EB%B0%8F_%ED%99%94%EB%A9%B4%EB%B3%84_%EA%B8%B0%EB%8A%A5_%EC%A0%95%EC%9D%98%EC%84%9C_v4.md) |
| **전체 화면 목록 및 화면별 기능 정의서 v5** | **v5.0** | **스토리보드 정합, 37개+C1 (권장)** | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/06_화면_기능_정의서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%EC%A0%84%EC%B2%B4_%ED%99%94%EB%A9%B4_%EB%AA%A9%EB%A1%9D_%EB%B0%8F_%ED%99%94%EB%A9%B4%EB%B3%84_%EA%B8%B0%EB%8A%A5_%EC%A0%95%EC%9D%98%EC%84%9C_v5.md) |

---

### 7. 요구사항 정의서

| 문서 | 설명 | 링크 |
|------|------|------|
| PBL 프로젝트 최소 요구사항 정의서 | PBL 교육용 최소 필수 요구사항 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/07_요구사항_정의서/PBL_프로젝트_최소_요구사항_정의서.md) |

---

### 8. 스토리보드

| 문서 | 버전 | 설명 | 링크 |
|------|------|------|------|
| 스토리보드 v1 | v1.0 | 화면 와이어프레임·UI 목업 (56슬라이드) | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/08_스토리보드/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%EC%8A%A4%ED%86%A0%EB%A6%AC%EB%B3%B4%EB%93%9C.pptx) |

---

### 9. Git 규칙 정의서

| 문서 | 버전 | 설명 | 링크 |
|------|------|------|------|
| Git & GitHub 사용 규칙 v1 | v1.0 | main/dev 브랜치 전략 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/09_Git_규칙_정의서/%ED%8C%80_%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8_Git_%26_GitHub_%EC%82%AC%EC%9A%A9_%EA%B7%9C%EC%B9%99_v1.md) |
| **Git & GitHub 사용 규칙 v2** | **v2.0** | **브랜치명 develop 통일 (권장)** | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/09_Git_규칙_정의서/%ED%8C%80_%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8_Git_%26_GitHub_%EC%82%AC%EC%9A%A9_%EA%B7%9C%EC%B9%99_v2.md) |

---

### 10. 환경 설정 템플릿

| 문서 | 설명 | 링크 |
|------|------|------|
| application.properties.example | 공통 설정 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/10_환경_설정_템플릿/application.properties.example) |
| application-dev.properties.example | 개발 환경 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/10_환경_설정_템플릿/application-dev.properties.example) |
| application-prod.properties.example | 운영 환경 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/10_환경_설정_템플릿/application-prod.properties.example) |

---

### 11. 테스트 전략서

| 문서 | 설명 | 링크 |
|------|------|------|
| 테스트 전략서 | JUnit5, MockMvc, @DataJpaTest 기반 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/11_테스트_전략서/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%ED%85%8C%EC%8A%A4%ED%8A%B8_%EC%A0%84%EB%9E%B5%EC%84%9C.md) |

---

### 12. 코드 리뷰 규칙

| 문서 | 버전 | 설명 | 링크 |
|------|------|------|------|
| 코드 리뷰 규칙 v1 | v1.0 | PR 작성 규칙, 리뷰 체크리스트 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/12_코드_리뷰_규칙/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%EC%BD%94%EB%93%9C_%EB%A6%AC%EB%B7%B0_%EA%B7%9C%EC%B9%99_v1.md) |
| **코드 리뷰 규칙 v2** | **v2.0** | **커밋 타입 팀원/팀장 구분 (권장)** | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/12_코드_리뷰_규칙/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%EC%BD%94%EB%93%9C_%EB%A6%AC%EB%B7%B0_%EA%B7%9C%EC%B9%99_v2.md) |

---

### 13. 배포 가이드

| 문서 | 설명 | 링크 |
|------|------|------|
| 배포 가이드 | Linux 배포, Nginx, 보안 체크리스트 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/13_배포_가이드/%F0%9F%8F%A5_%EB%B3%91%EC%9B%90_%EC%98%88%EC%95%BD_%26_%EB%82%B4%EB%B6%80_%EC%97%85%EB%AC%B4_%EC%8B%9C%EC%8A%A4%ED%85%9C_%E2%80%94_%EB%B0%B0%ED%8F%AC_%EA%B0%80%EC%9D%B4%EB%93%9C.md) |

---

### 14. 문서 분석 보고서 (99_etc)

| 문서 | 설명 | 링크 |
|------|------|------|
| 문서 누락 분석 보고서 | 17건 누락/불일치 식별 및 조치 현황 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/99_etc/%EB%AC%B8%EC%84%9C_%EB%88%84%EB%9D%BD_%EB%B6%84%EC%84%9D_%EB%B3%B4%EA%B3%A0%EC%84%9C.md) |
| 스토리보드 불일치 분석 보고서 | 30건 불일치 식별 및 조치 결과 | [GitHub](https://github.com/hospital-reservation-system-mng/docs/blob/master/99_etc/%EC%8A%A4%ED%86%A0%EB%A6%AC%EB%B3%B4%EB%93%9C_%EB%B6%88%EC%9D%BC%EC%B9%98_%EB%B6%84%EC%84%9D_%EB%B3%B4%EA%B3%A0%EC%84%9C.md) |

---

## 🔗 문서 연관 관계

```
프로젝트 계획서 v4.3 (권장)
    ├── ERD v4.0
    ├── API 명세서 v5.0
    ├── 화면 흐름 시퀀스 다이어그램 v5.0
    ├── 전체 화면 목록 및 화면별 기능 정의서 v5.0
    ├── 프로젝트 아키텍처 정의서 v2.0
    ├── 스토리보드 v1.0 (PPTX)
    ├── 테스트 전략서
    └── 배포 가이드
```

---

## 📁 폴더 구조

```
hms-doc/
├── 01_프로젝트_계획서/          # v1 ~ v4.3
├── 02_ERD_문서/                 # v1 ~ v4
├── 03_프로젝트_아키텍처_정의서/ # v1, v2
├── 04_API_명세서/               # v1 ~ v5
├── 05_화면_흐름_시퀀스_다이어그램/ # v1 ~ v5
├── 06_화면_기능_정의서/         # v1 ~ v5
├── 07_요구사항_정의서/
├── 08_스토리보드/
├── 09_Git_규칙_정의서/         # v1, v2
├── 10_환경_설정_템플릿/
├── 11_테스트_전략서/
├── 12_코드_리뷰_규칙/          # v1, v2
├── 13_배포_가이드/
├── 99_etc/                     # 노션 정리용 MD, 문서 분석 보고서
└── README.md
```

# PBL 프로젝트 최소 요구사항 정의서

## 1. 프로젝트 개요
- **교육 방식**: PBL (Problem-Based Learning)
- **개발 방향**: 실무 수준의 Spring Boot 기반 웹 애플리케이션 개발
- **주요 기술 스택**  
  - Backend: Spring Boot 3.x  
  - ORM: Spring Data JPA  
  - Template Engine: Mustache (SSR)  
  - Session Store: Redis  
  - Database: MySQL or PostgreSQL  
  - Frontend 통신: Ajax (fetch / Axios 등)

## 2. 최소 필수 요구사항 (모두 구현해야 프로젝트 완료로 인정)

| 번호 | 요구사항              | 세부 기준                                                                                 | 중요도 |
|------|-----------------------|-------------------------------------------------------------------------------------------|--------|
| 1    | REST API              | 최소 **3개 이상**의 RESTful 엔드포인트<br>(GET, POST, PUT/PATCH, DELETE 조합 가능)       | ★★★★★ |
|      |                       | 프론트엔드에서 **Ajax** 방식으로 호출 (fetch 또는 axios 권장)                             |        |
| 2    | DB 테이블 & 연관관계  | 최소 **4개 이상**의 엔티티 테이블<br>JPA 연관관계 매핑 반드시 포함<br>(@OneToMany, @ManyToOne 등 최소 1건 이상) | ★★★★★ |
| 3    | 인증·인가             | - 회원가입 기능<br>- 로그인 기능<br>- **최소 2개 이상** 역할(Role) 구분 (예: USER, ADMIN) | ★★★★★ |
| 4    | 세션 저장소           | **Redis**를 이용한 세션 저장소 구성<br>(spring-session-data-redis 의존성 사용)            | ★★★★★ |
| 5    | 화면 구성             | **Mustache** 템플릿 엔진을 이용한 **Server Side Rendering**(SSR) 구현                     | ★★★★★ |
| 6    | 예외처리 & 유효성검증 | - **글로벌 예외 핸들러** 구현 (@ControllerAdvice)<br>- 서버 사이드 유효성 검증 처리 (@Valid + BindingResult) | ★★★★★ |
| 7    | 페이징 & 정렬         | 목록 조회 시 **페이징** 기능 필수 구현<br>(Pageable 활용, Page 또는 Slice 반환 권장)      | ★★★★★ |


## 3. 추가 학습 권장 항목 (자기주도 / 가점 요소)

| 우선순위 | 항목                  | 주요 학습 내용                               | 추천 기술 키워드                              | 난이도 |
|----------|-----------------------|----------------------------------------------|------------------------------------------------|--------|
| ★★★★★    | 파일 업로드           | 이미지/파일 업로드 및 저장                   | MultipartFile, 파일 경로 관리, UUID 파일명     | 중     |
| ★★★★     | 실시간 알림           | 댓글/주문 상태 변경 등 실시간 푸시 알림      | Spring SseEmitter, SSE (Server-Sent Events)    | 상     |
| ★★★★     | Spring Security 심화  | 필터 체인 커스터마이징, CSRF, Remember-me 등 | SecurityFilterChain, UserDetailsService        | 중상   |
| ★★★      | JPA Repository 테스트 | 쿼리 메서드 및 @Query 단위 테스트 작성       | JUnit5, @DataJpaTest, TestEntityManager        | 중     |
| ★★       | 기타 심화 기능        | 이메일 인증, OAuth2 로그인, 비밀번호 재설정 등 | JavaMailSender, OAuth2, Thymeleaf 등           | 다양   |

## 4. 구현 시 주의사항 & 팁

- Redis 세션 설정은 `application.yml` 또는 `application.properties`에 명시해야 정상 동작
- Mustache 파일은 반드시 `src/main/resources/templates` 폴더에 `.mustache` 확장자로 위치
- 연관관계는 단방향만 구현하는 경우가 많으나, **양방향 매핑** 또는 **중간 엔티티** 사용 시 가점 가능
- 예외 처리는 `try-catch`를 각 메서드마다 넣는 방식이 아닌 **글로벌 핸들러**로 통합 필수
- 페이징 구현 시 단순 `List` 반환보다 `Page<T>` 또는 `Slice<T>` 반환 권장
- Ajax 호출 시 **CSRF 토큰** 문제 발생 가능 → Spring Security 기본 설정 확인
---
원문: https://developers.openai.com/codex/enterprise/governance
동기화일: 2026-05-15
---

# 거버넌스 (Governance)

> 조직의 Codex 관리 거버넌스 가이드

거버넌스와 관측성.

Codex가 엔터프라이즈 팀에 채택·영향 가시성 + 보안·컴플라이언스 프로그램에 필요한 감사 가능성 제공. 일상 추적엔 self-serve 대시보드, 프로그래매틱 리포팅엔 Analytics API, 거버넌스 스택에 자세한 로그 export엔 Compliance API.

## Codex 사용량 추적 방법

세 가지:
- **Analytics Dashboard**: 채택·코드 리뷰 영향 빠른 가시성
- **Analytics API**: 데이터 웨어하우스·BI 도구로 구조화 일별 메트릭 pull
- **Compliance API**: 감사·모니터링·조사용 자세한 활동 로그 export

## Analytics Dashboard

### 대시보드 view

[analytics 대시보드](https://chatgpt.com/codex/cloud/settings/analytics#usage)로 ChatGPT 워크스페이스 admin과 분석 viewer가 Codex 채택, 사용량, Code Review 피드백 추적. 사용량 데이터는 최대 12시간 lag 가능.

일·주 view용 날짜 범위 통제. 핵심 차트:
- 제품 surface별 활성 사용자 (CLI, IDE 확장, cloud, 데스크톱, Code Review)
- 워크스페이스·개인 사용량 분류 (제품 surface별 크레딧·토큰 사용량)
- 클라이언트별 스레드·턴 제품 활동
- 사용자 랭킹 테이블 — 클라이언트 필터 + 정렬 옵션 (크레딧, 스레드, 턴, 텍스트 토큰, 현재 streak)
- Code Review 활동 — 리뷰된 PR, 우선순위별 이슈, 코멘트, 답글, 반응, 피드백 sentiment
- 워크스페이스에 그 기능 있을 시 스킬 호출, 에이전트 신원 사용량, 액세스 토큰 사용량

### 데이터 export

Admin이 Codex 분석 데이터를 CSV·JSON으로 export 가능:
- 워크스페이스 사용량 — surface별 일별 활성 사용자, 스레드, 턴, 크레딧
- 사용자별 사용량 — surface 전반 일별 스레드, 턴, 크레딧 (허용 시 선택적 이메일 주소)
- Code Review 디테일 — 일별 코멘트, 반응, 답글, 우선순위 레벨 발견 사항

## Analytics API

리포팅 자동화, 내부 대시보드 빌드, Codex 메트릭과 기존 엔지니어링 데이터 join → [Analytics API](https://chatgpt.com/codex/cloud/settings/apireference)

### 측정

엔터프라이즈 Analytics API가 워크스페이스의 일·주 UTC 버킷 반환. 워크스페이스 레벨·사용자별 사용량, 클라이언트별 분류, Code Review 처리량, Code Review 코멘트 우선순위, Code Review 코멘트에 대한 사용자 engagement 지원.

### 엔드포인트

Base URL `https://api.chatgpt.com/v1/analytics/codex`. 모든 엔드포인트가 `has_more`와 `next_page` 있는 페이지네이션 `page` 객체 반환.

- `start_time`: 리포팅 윈도우 시작의 inclusive Unix 타임스탬프
- `end_time`: 윈도우 끝의 exclusive Unix 타임스탬프
- `group_by`: `day` 또는 `week`
- `limit`: 페이지 크기
- `page`: 이전 응답에서 계속

요청은 최대 90일 look back 가능.

#### Usage

`GET /workspaces/{workspace_id}/usage`

- 일·주 버킷의 스레드, 턴, 크레딧, 클라이언트별 사용량 합계 반환
- `group` 생략 → 사용자별 행 반환
- `group=workspace` → 워크스페이스 전반 행 반환
- 텍스트 입력, cached 입력, 출력 토큰 필드 포함

#### Code review activity

`GET /workspaces/{workspace_id}/code_reviews`

- Codex 완료 PR 리뷰 반환
- Codex 생성 총 코멘트 반환
- 코멘트를 P0, P1, P2 우선순위로 분류

#### User engagement with code review

`GET /workspaces/{workspace_id}/code_review_responses`

- Codex 코멘트에 대한 답글·반응 반환
- 반응을 positive, negative, 기타로 분류
- 반응, 답글, 또는 어느 engagement 형태든 받은 코멘트 카운트

### 동작 방식

Analytics는 시간 윈도우 사용 + day·week 그룹화 지원. 결과는 time-ordered + cursor 기반 페이지네이션 페이지로 반환. `codex.enterprise.analytics.read`로 스코프된 API 키 사용.

### 흔한 use case

- 엔지니어링 관측성 대시보드
- 리더십 갱신용 채택 리포팅
- 사용량 거버넌스·비용 모니터링

## Compliance API

보안, 법무, 거버넌스 워크플로용 감사 가능 레코드 → [Compliance API](https://chatgpt.com/admin/api-reference)

### 측정

엔터프라이즈가 Codex 활동 로그·메타데이터 export 가능 → 그 데이터를 기존 감사·모니터링·보안 워크플로에 연결. eDiscovery, DLP, SIEM, 다른 컴플라이언스 시스템 같은 도구와 사용 설계.

ChatGPT 통해 인증된 Codex 사용은 Compliance API export가 Codex 활동 감사 레코드 제공 + 조사·컴플라이언스 워크플로 사용 가능. 이 감사 로그는 최대 30일 보존. API 키 인증 Codex 사용은 API 조직 설정 따름 + Compliance API export에 미포함.

### Export 가능한 것

#### 활동 로그

- Codex에 보낸 prompt 텍스트
- Codex 생성 응답
- workspace, user, timestamp, model 같은 식별자
- 토큰 사용량·관련 요청 메타데이터

#### 감사·조사용 메타데이터

레코드 메타데이터로 답할 질문:
- 누가 작업 실행했는지
- 누가 액세스 토큰 생성·회수했는지
- 언제 실행됐는지
- 어느 모델 사용됐는지
- 얼마나 많은 콘텐츠 처리됐는지

#### 흔한 use case

- 보안 조사
- 컴플라이언스 리포팅
- 정책 enforcement 감사
- SIEM·eDiscovery 파이프라인에 이벤트 라우팅

### 제공 안 하는 것

- 생성 코드 라인 수 (생산성에 noisy proxy + 잘못된 동작 incentivize)
- 제안 acceptance rate (사용자가 보통 변경 먼저 수용 → 거의 100%)
- 코드 품질·성능 KPI

## 권장 패턴

대부분 엔터프라이즈가 결합 사용:

1. self-serve 모니터링·빠른 답변용 **Analytics Dashboard**
2. 자동화 리포팅·BI 통합용 **Analytics API**
3. 감사 export·조사용 **Compliance API**

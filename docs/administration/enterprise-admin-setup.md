---
원문: https://developers.openai.com/codex/enterprise/admin-setup
동기화일: 2026-05-15
---

# Admin Setup

> ChatGPT Enterprise 워크스페이스용 Codex 셋업

이 가이드는 ChatGPT Enterprise admin이 워크스페이스에 Codex 셋업할 때 사용. 단계별 rollout 가이드. 자세한 정책·설정·자동화·모니터링은 링크 페이지: [Authentication](auth.md), [Agent approvals & security](agent-approvals-security.md), [Access tokens](access-tokens.md), [Managed configuration](enterprise-managed-config.md), [Governance](enterprise-governance.md).

## 엔터프라이즈급 보안과 프라이버시

Codex가 ChatGPT Enterprise 보안 기능 지원:
- 엔터프라이즈 데이터로 학습 안 함
- 앱·CLI·IDE의 Zero data retention (코드는 개발자 환경에 머물기)
- ChatGPT Enterprise 정책 따르는 residency·retention
- Granular 사용자 액세스 통제
- 저장 시 (AES-256)·전송 시 (TLS 1.2+) 데이터 암호화
- ChatGPT Compliance API 통한 감사 로깅

→ 보안 통제·런타임 보호: [Agent approvals & security](agent-approvals-security.md). [Zero Data Retention (ZDR)](https://platform.openai.com/docs/guides/your-data#zero-data-retention) 자세히. 더 넓은 엔터프라이즈 보안 개요: [Codex 보안 white paper](https://trust.openai.com/?itemUid=382f924d-54f3-43a8-a9df-c39e6c959958&source=click)

## 전제조건: 소유자·rollout 전략 결정

Rollout 동안 팀원이 다른 측면 지원 가능. 다음 소유자 확보:
- **ChatGPT Enterprise 워크스페이스 owner**: 워크스페이스의 Codex 설정 구성 필요
- **보안 owner**: Codex의 에이전트 권한 설정 결정
- **분석 owner**: 분석·컴플라이언스 API를 데이터 파이프라인에 통합

사용할 Codex surface 결정:
- **Codex local**: Codex 앱, CLI, IDE 확장. 에이전트가 개발자 컴퓨터의 샌드박스에서 실행.
- **Codex cloud**: 호스팅 Codex 기능 (Codex 클라우드, iOS, Code Review, [Slack](../web/integrations-slack.md)·[Linear](../web/integrations-linear.md) 통합 생성 작업). 에이전트가 코드베이스로 호스팅 컨테이너에서 원격 실행.
- **둘 다**: local + cloud 함께

local, cloud, 또는 둘 다 활성화 가능 + 워크스페이스 설정과 RBAC로 액세스 통제.

## Step 1: 워크스페이스에 Codex 활성화

ChatGPT Enterprise 워크스페이스 설정에서 Codex 액세스 구성.

[Workspace Settings → Settings and Permissions](https://chatgpt.com/admin/settings)으로.

### Codex local

새 ChatGPT Enterprise 워크스페이스에 기본 활성화. 워크스페이스 owner 아니면 [Codex 설치](../getting-started/quickstart.md) + 회사 이메일 로그인으로 액세스 테스트 가능.

**Allow members to use Codex Local** ON.

→ 허용 사용자에게 Codex 앱·CLI·IDE 확장 사용 가능.

멤버가 프로그래매틱 Codex local 워크플로 필요 → **Allow members to use Codex access tokens** ON 또는 커스텀 역할 통해 액세스 토큰 권한 부여. → 셋업·권한: [Access tokens](access-tokens.md)

Codex Local 토글 OFF면 Codex 앱·CLI·IDE 사용 시도 사용자가 다음 에러 봄: "403 - Unauthorized. Contact your ChatGPT administrator for access."

#### CLI device code 인증 활성화

비인터랙티브 환경 (예: 원격 dev 박스)에서 CLI 사용 시 device code로 로그인 허용. → [authentication](auth.md)

### Codex cloud

#### 전제조건

Codex cloud는 **GitHub (cloud-hosted) 리포** 필요. 코드베이스가 on-premise 또는 GitHub 아님 → Codex SDK로 자체 인프라에 유사 워크플로 빌드 가능.

Admin 셋업 위해 조직 전반 흔히 사용 리포에 GitHub 액세스 필요. 없으면 가진 엔지니어와 작업.

#### 워크스페이스 설정에서 Codex cloud 활성화

[Workspace Settings → Settings and Permissions](https://chatgpt.com/admin/settings) Codex 섹션에서 ChatGPT GitHub Connector ON.

Codex cloud 활성화 → **Allow members to use Codex cloud** ON. 활성화 후 사용자가 ChatGPT 좌측 navigation 패널에서 Codex 직접 액세스.

> Codex가 ChatGPT에 나타나기까지 최대 10분 걸릴 수 있음.

#### Codex Slack 앱이 작업 완료 시 답변 게시

Codex가 작업 완료 시 Slack에 전체 답변 게시. 그 외엔 작업 링크만 게시.

→ [Slack의 Codex](../web/integrations-slack.md)

#### Codex 에이전트 인터넷 액세스 활성화

기본적으로 Codex cloud 에이전트는 prompt injection 같은 보안·안전 위험 보호 위해 런타임 인터넷 액세스 없음.

이 설정으로 사용자가 흔한 SW 의존성 도메인 allowlist 사용, 도메인·신뢰 사이트 추가, 허용 HTTP 메소드 명시 가능.

→ 인터넷 액세스 보안 영향·런타임 통제: [Agent approvals & security](agent-approvals-security.md)

## Step 2: 커스텀 역할 (RBAC) 셋업

RBAC로 Codex local·cloud 액세스의 granular 권한 통제.

### RBAC가 가능하게 하는 것

ChatGPT admin 설정의 RBAC로 워크스페이스 owner가:
- 어떤 커스텀 역할도 할당 안 된 사용자의 기본 역할 설정
- granular 권한으로 커스텀 역할 생성
- Group에 1개 이상 커스텀 역할 할당
- SCIM 통해 사용자를 Group에 자동 sync
- Custom Roles 탭에서 중앙 역할 관리

사용자가 1개 초과 역할 상속 가능 + 권한이 그 역할 전반에서 가장 permissive (가장 덜 제한적) 액세스로 resolve.

### Codex Admin 그룹 생성

광범위 audience에 Codex 관리 부여 대신 전용 "Codex Admin" 그룹 셋업.

**Allow members to administer Codex** 토글이 Codex Admin 역할 부여. Codex Admin이 가능:
- Codex [워크스페이스 분석](https://chatgpt.com/codex/settings/analytics) 보기
- 클라우드 관리 `requirements.toml` 정책 관리용 Codex [Policies 페이지](https://chatgpt.com/codex/settings/policies) 열기
- 그 managed 정책을 사용자 그룹에 할당 또는 기본 fallback 정책 구성
- Codex 클라우드 환경 관리 (편집·삭제 포함)

> Codex rollout, 정책 관리, 거버넌스 소유 작은 admin 셋용. 일반 Codex 사용자에 불필요. 이 토글 활성화에 Codex cloud 불필요.

권장 rollout 패턴:
- Codex 사용해야 할 사람용 "Codex Users" 그룹 생성
- Codex 설정·정책 관리할 작은 셋용 별도 "Codex Admin" 그룹 생성
- **Allow members to administer Codex** 활성화된 커스텀 역할을 "Codex Admin" 그룹에만 할당
- "Codex Admin" 그룹 멤버십을 워크스페이스 owner·지정 플랫폼·IT·거버넌스 운영자로 제한
- SCIM 사용 시 신원 프로바이더로 "Codex Admin" 그룹 backing → 멤버십 변경 감사·중앙 관리

이 분리로 분석·환경 관리·정책 배포를 신뢰 admin에 제한하면서 Codex rollout 쉬워짐. → RBAC 셋업·전체 권한 모델: [OpenAI RBAC Help Center](https://help.openai.com/en/articles/11750701-rbac)

## Step 3: Codex local requirements 구성

Codex Admin이 admin 강제 `requirements.toml` 정책을 [Policies 페이지](https://chatgpt.com/codex/settings/policies)에서 배포.

다른 그룹에 다른 로컬 Codex 제약을 디바이스 레벨 파일 먼저 배포 없이 적용 원할 때. Managed 정책은 [Managed configuration](enterprise-managed-config.md)에 기술된 같은 `requirements.toml` 형식 사용 → 허용 승인 정책, 샌드박스 모드, 웹 검색 동작, MCP 서버 allowlist, 기능 pin, 제한 명령 룰 정의 가능. Browser Use, in-app 브라우저, Computer Use 비활성화: [Pin feature flags](enterprise-managed-config.md)

권장 셋업:

1. 대부분 사용자용 baseline 정책 생성 → 필요한 곳에만 더 엄격·permissive variant
2. 각 managed 정책을 특정 사용자 그룹에 할당 + 모든 다른 사용자에 기본 fallback 정책 구성
3. 그룹 룰 순서 신중히. 사용자가 1개 초과 그룹 특정 룰에 매치 → 첫 매치 룰 적용.
4. 각 정책을 그 그룹의 완전 프로파일로 다루기. Codex가 나중 매치 그룹 룰에서 누락 필드 채우지 않음.

이 클라우드 관리 정책은 사용자가 ChatGPT 로그인 시 Codex local surface (앱, CLI, IDE 확장) 전반 적용.

### `requirements.toml` 정책 예시

각 그룹에 원하는 가드레일 강제. 아래는 적응 가능한 예시 — 필수 설정 아님.

표준 로컬 rollout의 웹 검색·샌드박스 모드·승인 제한:
```toml
allowed_web_search_modes = ["disabled", "cached"]
allowed_sandbox_modes = ["workspace-write"]
allowed_approval_policies = ["on-request"]
```

Browser Use, in-app 브라우저, Computer Use 비활성화:
```toml
[features]
browser_use = false
in_app_browser = false
computer_use = false
```

특정 명령 차단·gate 위한 제한 명령 룰:
```toml
[rules]
prefix_rules = [
  { pattern = [{ token = "git" }, { any_of = ["push", "commit"] }], decision = "prompt", justification = "Require review before mutating remote history." },
]
```

각 예 단독 또는 그룹의 단일 managed 정책에 결합 가능. → 정확한 키, 우선순위, 더 많은 예: [Managed configuration](enterprise-managed-config.md), [Agent approvals & security](agent-approvals-security.md)

### 사용자 정책 체크

워크플로 끝의 정책 lookup 도구로 어떤 managed 정책이 사용자에 적용되는지 확인. 그룹별 또는 사용자 이메일 입력으로 정책 할당 체크.

로컬 클라이언트의 로그인 방법·워크스페이스 제한 계획 → [Authentication](auth.md)의 admin 관리 인증 제한.

## Step 4: Team Config로 로컬 설정 표준화

조직 전반 Codex 표준화 원하는 팀은 모든 로컬 설정에 셋업 중복 없이 기본값·룰·스킬 공유에 Team Config 사용.

리포의 `.codex` 디렉터리 아래 Team Config 설정 체크인 가능. 사용자가 그 리포 열 때 Codex가 자동 픽업.

가장 트래픽 많은 리포에 Team Config 시작 → 팀이 Codex 가장 많이 사용하는 곳에 일관 동작.

| 타입 | 경로 | 사용 |
| --- | --- | --- |
| [Config basics](../configuration/config-basic.md) | `config.toml` | 샌드박스 모드, 승인, 모델, reasoning effort 등 기본값 |
| [Rules](../configuration/rules.md) | `rules/` | 샌드박스 외부 Codex 실행 가능 명령 통제 |
| [Skills](../configuration/skills.md) | `skills/` | 팀에 공유 스킬 가용 |

→ 위치·우선순위: [Config basics](../configuration/config-basic.md)

## Step 5: Codex cloud 사용 구성 (활성화 시)

Codex cloud 워크스페이스 토글 활성화 후 리포·환경 셋업.

### Codex cloud를 리포에 연결

1. [Codex](https://chatgpt.com/codex) → **Get started**
2. **Connect to GitHub** → ChatGPT GitHub Connector 설치 (아직 GitHub를 ChatGPT에 연결 안 했으면)
3. ChatGPT GitHub Connector 설치·연결
4. ChatGPT Connector 설치 타깃 선택 (보통 메인 조직)
5. Codex에 연결 원하는 리포 허용

GitHub Enterprise Managed Users (EMU) — 사용자가 Codex cloud에서 리포 연결 전 조직 owner가 조직용 Codex GitHub App 설치해야.

→ [클라우드 환경](../web/environments.md)

Codex가 각 작업에 short-lived, least-privilege GitHub App 설치 토큰 사용 + 사용자 기존 GitHub 리포 권한·브랜치 보호 룰 존중.

### IP 주소 구성

GitHub 조직이 앱 연결 IP 주소 통제 → [egress IP 범위](https://openai.com/chatgpt-agents.json) 포함 확인.

이 IP 범위 변경 가능. 자동 체크 + 최신 값 기반 allow list 갱신 고려.

### Codex cloud로 코드 리뷰 활성화

Codex가 GitHub에서 코드 리뷰 수행 허용 → [Settings → Code review](https://chatgpt.com/codex/settings/code-review).

리포 레벨에서 코드 리뷰 구성 가능. 사용자가 PR에 자동 리뷰 활성화 + Codex가 자동 리뷰 트리거 시점 선택 가능. → [GitHub 통합 페이지](../web/integrations-github.md)

개요 페이지로 워크스페이스에 코드 리뷰 ON 확인 + 가용 리뷰 통제 보기.

자동 리뷰 설정으로 Codex가 연결 리포 PR 자동 리뷰 여부 결정.

리뷰 트리거로 어느 PR 이벤트가 Codex 리뷰 시작할지 통제.

### Codex security 구성

Codex Security가 엔지니어링·보안 팀이 연결 GitHub 리포의 가능 취약점 발견·확인·치료 도움.

상위 레벨에서 Codex Security:
- 연결 리포를 commit 단위 스캔
- 가능 발견 사항 랭크 + 가능 시 확인
- 증거, 중요도, 제안 치료가 있는 구조화 발견 사항 표시
- 우선순위·검토 품질 개선 위해 팀이 리포 위협 모델 정제 가능

→ 셋업, 스캔 생성, 발견 사항 검토, 위협 모델 가이드: [Codex Security 셋업](security-setup.md). 제품 개요: [Codex Security](security-overview.md)

통합 문서: [Slack](../web/integrations-slack.md), [GitHub](../web/integrations-github.md), [Linear](../web/integrations-linear.md)

## Step 6: 거버넌스·관측성 셋업

Codex가 엔터프라이즈 팀에 채택·영향 가시성 옵션 제공. 거버넌스 일찍 셋업 → 팀이 채택 추적, 이슈 조사, 컴플라이언스 워크플로 지원 가능.

### Codex 거버넌스 보통 사용

- 빠른 self-serve 가시성용 Analytics Dashboard
- 프로그래매틱 리포팅·BI 통합용 Analytics API
- 감사·조사 워크플로용 Compliance API

### 권장 baseline 셋업

- 채택 리포팅 owner 할당
- 감사·컴플라이언스 검토 owner 할당
- 검토 cadence 정의
- 성공 정의

### Analytics API 셋업 단계

Analytics API 키 셋업:

1. owner·admin으로 [OpenAI API Platform Portal](https://platform.openai.com) 로그인 + 올바른 조직 선택
2. [API keys 페이지](https://platform.openai.com/settings/organization/api-keys)로
3. Codex Analytics 전용 새 secret key 생성 + "Codex Analytics API" 같은 설명적 이름
4. 조직에 적합한 프로젝트 선택. 프로젝트 1개만 있으면 기본 OK.
5. 분석 데이터만 retrieval하므로 권한을 Read only로
6. 키 값 복사·안전 저장 (한 번만 봄)
7. [support@openai.com](mailto:support@openai.com)에 이메일 → 키를 `codex.enterprise.analytics.read`만으로 스코프. OpenAI가 API 키 Codex Analytics API 액세스 확인 대기.

Analytics API 키 사용:

1. [ChatGPT Admin console](https://chatgpt.com/admin) Workspace details에서 `workspace_id` 찾기
2. Platform API 키로 Analytics API 호출 — `https://api.chatgpt.com/v1/analytics/codex` + 경로에 `workspace_id` 포함
3. 쿼리할 엔드포인트 선택:
   - `/workspaces/{workspace_id}/usage`
   - `/workspaces/{workspace_id}/code_reviews`
   - `/workspaces/{workspace_id}/code_review_responses`
4. 필요 시 `start_time`·`end_time`으로 리포팅 날짜 범위
5. 응답이 1페이지 초과 시 `next_page`로 다음 페이지 retrieval

워크스페이스 사용량 retrieval 예 curl:
```bash
curl -H "Authorization: Bearer YOUR_PLATFORM_API_KEY" \
  "https://api.chatgpt.com/v1/analytics/codex/workspaces/WORKSPACE_ID/usage"
```

→ Analytics API 자세히: [Analytics API](enterprise-governance.md)

### Compliance API 셋업 단계

Compliance API 키 셋업:

1. owner·admin으로 [OpenAI API Platform Portal](https://platform.openai.com) 로그인 + 올바른 조직 선택
2. [API keys 페이지](https://platform.openai.com/settings/organization/api-keys)로
3. Compliance API 전용 새 secret key 생성 + 조직에 적합한 프로젝트 선택
4. All permissions 선택
5. 키 값 복사·안전 저장
6. [support@openai.com](mailto:support@openai.com) 이메일 — 다음 포함:
   - API 키 마지막 4자리
   - 키 이름
   - 생성자 이름
   - 필요 스코프: `read`, `delete`, 또는 둘 다
7. OpenAI가 API 키 Compliance API 액세스 확인 대기

Compliance API 키 사용:

1. [ChatGPT Admin console](https://chatgpt.com/admin) Workspace details에서 `workspace_id` 찾기
2. `https://api.chatgpt.com/v1/`에서 Compliance API 사용
3. Compliance API 키를 Authorization 헤더에 Bearer 토큰으로
4. Codex 관련 컴플라이언스 데이터 엔드포인트:
   - `/compliance/workspaces/{workspace_id}/logs`
   - `/compliance/workspaces/{workspace_id}/logs/{log_file_id}`
   - `/compliance/workspaces/{workspace_id}/codex_tasks`
   - `/compliance/workspaces/{workspace_id}/codex_environments`
5. 대부분 Codex 컴플라이언스 통합은 logs 엔드포인트로 시작 + `CODEX_LOG`나 `CODEX_SECURITY_LOG` 같은 Codex 이벤트 타입 요청
6. `/logs`로 가용 Codex 컴플라이언스 로그 파일 나열 → `/logs/{log_file_id}`로 특정 파일 다운로드

컴플라이언스 로그 파일 나열 예 curl:
```bash
curl -L -H "Authorization: Bearer YOUR_COMPLIANCE_API_KEY" \
  "https://api.chatgpt.com/v1/compliance/workspaces/WORKSPACE_ID/logs?event_type=CODEX_LOG&after=2026-03-01T00:00:00Z"
```

Codex 작업 나열 예 curl:
```bash
curl -H "Authorization: Bearer YOUR_COMPLIANCE_API_KEY" \
  "https://api.chatgpt.com/v1/compliance/workspaces/WORKSPACE_ID/codex_tasks"
```

→ Compliance API 자세히: [Compliance API](enterprise-governance.md)

## Step 7: 셋업 확인·검증

### 검증할 것

- 사용자가 Codex local 로그인 가능 (ChatGPT 또는 API 키)
- (활성 시) 사용자가 Codex cloud 로그인 가능 (ChatGPT 로그인 필요)
- MFA·SSO 요구사항이 엔터프라이즈 보안 정책과 매치
- RBAC와 워크스페이스 토글이 기대 액세스 동작 생산
- Managed configuration이 사용자에 적용
- 거버넌스 데이터가 admin에 가시

→ 인증 옵션·엔터프라이즈 로그인 제한: [Authentication](auth.md)

팀이 셋업에 자신감 가지면 더 많은 팀·조직에 Codex rollout.

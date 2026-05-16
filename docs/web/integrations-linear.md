---
원문: https://developers.openai.com/codex/integrations/linear
동기화일: 2026-05-15
---

# Linear에서 Codex 사용

> Linear 이슈에서 Codex 작업 실행

이슈에서 작업 위임. Codex에 이슈 할당 또는 코멘트에 `@Codex` mention → Codex가 클라우드 작업 생성 + 진행·결과 응답.

Linear의 Codex는 유료 플랜 가용 (→ [Pricing](../getting-started/pricing.md)).

Enterprise 플랜이면 ChatGPT 워크스페이스 admin이 [워크스페이스 설정](https://chatgpt.com/admin/settings)에서 Codex 클라우드 작업 ON + [connector 설정](https://chatgpt.com/admin/ca)에서 **Codex for Linear** 활성화.

## Linear 통합 셋업

1. [Codex](https://chatgpt.com/codex)에서 GitHub 연결 + Codex가 작업할 리포에 [환경](environments.md) 생성으로 [Codex 클라우드 작업](overview.md) 셋업
2. [Codex 설정](https://chatgpt.com/codex/settings/connectors) → 워크스페이스에 **Codex for Linear** 설치
3. Linear 이슈 코멘트 스레드에서 `@Codex` mention해 Linear 계정 연결

## Codex에 작업 위임

두 가지 방법.

### Codex에 이슈 할당

통합 설치 후 팀원에게 할당하듯이 Codex에 이슈 할당. Codex가 작업 시작 + 이슈에 갱신 게시.

### 코멘트에 `@Codex` mention

코멘트 스레드에 `@Codex` mention해 작업 위임·질문. Codex 응답 후 스레드에서 후속해 같은 세션 계속.

Codex가 이슈 작업 시작 후 [환경·리포 선택](#codex가-환경리포-선택하는-방식). 특정 리포 pin → 코멘트에 포함 (예: `@Codex fix this in openai/codex`).

진행 추적:
- 이슈의 **Activity**로 진행 갱신 보기
- 작업 링크로 더 상세 follow

작업 종료 시 Codex가 요약 + 완료 작업 링크 게시 → PR 생성 가능.

### Codex가 환경·리포 선택하는 방식

- Linear가 이슈 컨텍스트 기반 리포 제안. Codex가 그 제안과 가장 잘 매치되는 환경 선택. 모호하면 가장 최근 사용 환경으로 fallback.
- 작업은 그 환경의 repo map 첫 리포 기본 브랜치에서 실행. 다른 기본·더 많은 리포 필요하면 Codex repo map 갱신.
- 적합한 환경·리포 없으면 Codex가 Linear에 fix 방법 안내 응답 → 재시도.

## 자동 이슈 할당

triage rule로 Codex에 이슈 자동 할당:

1. Linear에서 **Settings**
2. **Your teams** → 팀 선택
3. workflow 설정에서 **Triage** 열고 ON
4. **Triage rules**에서 룰 생성 + **Delegate** > **Codex** (필요한 다른 속성도)

Linear가 triage에 들어오는 새 이슈를 Codex에 자동 할당. triage rule 사용 시 Codex가 이슈 생성자 계정으로 작업 실행.

## 데이터 사용·프라이버시·보안

`@Codex` mention 또는 이슈 할당 시 Codex가 이슈 콘텐츠 받음. 데이터 처리는 OpenAI [Privacy Policy](https://openai.com/privacy), [Terms of Use](https://openai.com/terms/), 기타 [정책](https://openai.com/policies) 따름. 보안: [Codex 보안 문서](../administration/agent-approvals-security.md)

> Codex는 LLM 사용 — 실수 가능. 답변·diff 항상 검토.

## 팁과 트러블슈팅

- **연결 누락**: Linear 연결 확인 못 하면 이슈에 계정 연결 링크 응답
- **예상치 못한 환경 선택**: 스레드에 원하는 환경 응답 (예: `@Codex please run this in openai/codex`)
- **잘못된 코드 부분**: 이슈에 컨텍스트 추가 또는 `@Codex` 코멘트에 명시적 instructions
- **추가 도움**: [OpenAI Help Center](https://help.openai.com/)

## 로컬 작업용 Linear 연결 (MCP)

Codex 앱·CLI·IDE 확장 사용 + Codex가 Linear 이슈 로컬 액세스 → Linear MCP 서버 사용 설정.

→ [Linear MCP 문서](https://linear.app/integrations/codex-mcp)

MCP 서버 셋업 단계는 IDE 확장이든 CLI든 동일 (같은 설정 공유).

### CLI 사용 (권장)

```bash
codex mcp add linear --url https://mcp.linear.app/mcp
```

Linear 계정 로그인 + Codex 연결 prompt.

### 수동 설정

1. `~/.codex/config.toml` 편집
2. 추가:
   ```toml
   [mcp_servers.linear]
   url = "https://mcp.linear.app/mcp"
   ```
3. 로그인: `codex mcp login linear`

---
원문: https://developers.openai.com/codex/integrations/slack
동기화일: 2026-05-15
---

# Slack에서 Codex 사용

> 채널과 스레드에서 Codex에 작업 요청

Slack에서 채널·스레드에서 코딩 작업 kick off. `@Codex` mention + prompt → Codex가 클라우드 작업 생성 + 결과 응답.

## Slack 앱 셋업

1. [Codex 클라우드 작업](overview.md) 셋업. Plus, Pro, Business, Enterprise, Edu 플랜 (→ [ChatGPT pricing](https://chatgpt.com/pricing)) + 연결된 GitHub 계정 + 1개 이상 [환경](environments.md) 필요
2. [Codex 설정](https://chatgpt.com/codex/settings/connectors) → 워크스페이스에 Slack 앱 설치. Slack 워크스페이스 정책에 따라 admin 승인 필요할 수 있음.
3. 채널에 `@Codex` 추가. 미추가 시 mention할 때 Slack이 prompt.

## 작업 시작

1. 채널·스레드에서 `@Codex` mention + prompt 포함. Codex가 스레드 이전 메시지 참조 가능 → 컨텍스트 재진술 자주 불필요.
2. (선택) prompt에 환경·리포 명시 (예: `@Codex fix the above in openai/codex`)
3. Codex 반응 (👀) + 작업 링크 응답 대기. 종료 시 Codex가 결과 게시 + 설정에 따라 스레드에 답변.

### Codex가 환경·리포 선택하는 방식

- Codex가 액세스 권한 있는 환경 검토 → 요청과 가장 잘 매치되는 환경 선택. 모호하면 가장 최근 사용 환경으로 fallback.
- 작업은 그 환경의 repo map 첫 리포 기본 브랜치에서 실행. 다른 기본·더 많은 리포 필요하면 Codex에서 repo map 갱신.
- 적합한 환경·리포 없으면 Codex가 Slack에 fix 방법 안내 응답 → 재시도.

### Enterprise 데이터 통제

기본적으로 Codex는 스레드에 답변 응답 — 실행한 환경의 정보 포함 가능. 방지: Enterprise admin이 [ChatGPT 워크스페이스 설정](https://chatgpt.com/admin/settings)에서 **Allow Codex Slack app to post answers on task completion** clear. admin이 답변 OFF하면 Codex가 작업 링크만 응답.

### 데이터 사용·프라이버시·보안

`@Codex` mention 시 Codex가 메시지·스레드 히스토리 받음 — 요청 이해 + 작업 생성. 데이터 처리는 OpenAI [Privacy Policy](https://openai.com/privacy), [Terms of Use](https://openai.com/terms/), 기타 [정책](https://openai.com/policies) 따름. 보안: [Codex 보안 문서](../administration/agent-approvals-security.md)

> Codex는 LLM 사용 — 실수 가능. 답변·diff 항상 검토.

### 팁과 트러블슈팅

- **연결 누락**: Slack·GitHub 연결 확인 못 하면 재연결 링크 응답
- **예상치 못한 환경 선택**: 스레드에 원하는 환경 응답 (예: `Please run this in openai/openai (applied)`) → `@Codex` 다시 mention
- **길거나 복잡한 스레드**: 마지막 메시지에 핵심 요약 → Codex가 스레드 깊이 묻힌 컨텍스트 놓치지 않도록
- **워크스페이스 게시**: 일부 Enterprise 워크스페이스가 최종 답변 게시 제한. 그때는 작업 링크 열어 진행·결과 보기.
- **추가 도움**: [OpenAI Help Center](https://help.openai.com/)

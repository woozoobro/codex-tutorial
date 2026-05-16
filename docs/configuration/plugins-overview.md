---
원문: https://developers.openai.com/codex/plugins
동기화일: 2026-05-15
---

# 플러그인 개요

> 스킬·앱 통합으로 재사용 가능 워크플로 추가

## 개요

플러그인은 스킬·앱 통합·MCP 서버를 Codex의 재사용 가능 워크플로로 묶는다.

확장 예시:
- Gmail 플러그인 → Codex가 Gmail 읽기·관리
- Google Drive 플러그인 → Drive, Docs, Sheets, Slides
- Slack 플러그인 → 채널 요약·답장 초안

플러그인이 포함할 수 있는 것:
- **Skills**: 특정 종류의 작업용 재사용 지시. Codex가 필요할 때 로드 → 작업에 맞는 단계·참조·헬퍼 스크립트 사용.
- **Apps**: GitHub, Slack, Google Drive 같은 도구 연결 → Codex가 그 도구에서 정보 읽고 액션 수행.
- **MCP 서버**: 추가 도구나 공유 정보(주로 로컬 프로젝트 외부 시스템)에 Codex가 접근하는 서비스.

더 많은 플러그인 능력 곧 지원.

## 플러그인 사용·설치

### Codex 앱의 Plugin Directory

앱에서 **Plugins**를 열어 큐레이트된 플러그인 탐색·설치.

### CLI의 플러그인 디렉터리

```
codex
/plugins
```

CLI 플러그인 브라우저는 마켓플레이스별로 플러그인 그룹화. 마켓플레이스 탭으로 소스 전환, 플러그인 열어 상세 검사, 마켓플레이스 항목 설치·제거, 설치된 플러그인에서 Space로 활성/비활성 토글.

### 설치와 사용

플러그인 디렉터리를 열면:

1. 검색·탐색 → 상세 열기
2. 설치 버튼 (앱: + 또는 **Add to Codex**, CLI: `Install plugin`)
3. 외부 앱 필요 시 prompt에 따라 연결. 일부는 설치 중 인증, 일부는 첫 사용 시 인증.
4. 설치 후 새 스레드 시작 → Codex에 플러그인 사용 요청

설치 후 prompt 창에서 직접 사용:

**작업 직접 기술**

원하는 결과 요청. 예: "Summarize unread Gmail threads from today", "Pull the latest launch notes from Google Drive."

→ Codex가 작업에 맞는 설치 도구를 선택하길 원할 때.

**특정 플러그인 선택**

`@` → 플러그인 또는 번들 스킬 명시 호출.

→ 어떤 플러그인·스킬을 쓸지 명시하고 싶을 때. → [Codex 앱 명령어](../ide/app-commands.md), [Skills](skills.md)

### 권한과 데이터 공유

플러그인 설치는 워크플로를 Codex에 가용하게 하지만, 기존 [승인 설정](../administration/agent-approvals-security.md)이 그대로 적용. 연결된 외부 서비스는 자체 인증·프라이버시·데이터 공유 정책 적용.

- 번들 스킬은 설치 즉시 가용
- 앱 포함 시 셋업이나 첫 사용 때 ChatGPT에서 그 앱 설치·로그인 prompt
- MCP 서버 포함 시 추가 셋업·인증 필요할 수 있음
- 번들 앱을 통해 Codex가 데이터 보낼 때 그 앱의 약관·프라이버시 정책 적용

### 플러그인 제거·비활성

제거: 플러그인 브라우저에서 다시 열기 → **Uninstall plugin**.

플러그인 제거는 번들을 Codex에서 제거하지만, 번들된 앱은 ChatGPT에서 관리할 때까지 설치된 상태 유지.

설치는 유지하고 끄려면 `~/.codex/config.toml`에서 항목을 `enabled = false`로 설정 후 Codex 재시작:

```toml
[plugins."gmail@openai-curated"]
enabled = false
```

## 자체 플러그인 만들기

생성·테스트·배포 → [Build plugins](plugins-build.md) 참고. 로컬 scaffolding, 수동 마켓플레이스 셋업, 플러그인 manifest, 패키징 가이드 포함.

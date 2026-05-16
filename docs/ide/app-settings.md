---
원문: https://developers.openai.com/codex/app/settings
동기화일: 2026-05-15
---

# Codex 앱 설정

> Codex 앱 동작·선호 구성

설정 패널로 Codex 앱이 어떻게 동작하는지, 파일을 어떻게 여는지, 도구에 어떻게 연결하는지 튜닝. 앱 메뉴의 **Settings** 또는 Cmd+,.

## General

파일 열림 위치, 스레드의 명령 출력 양 선택. 멀티라인 prompt에 Cmd+Enter 요구 또는 스레드 실행 중 sleep 방지도.

## Notifications

턴 완료 알림 표시 시점, 앱이 알림 권한 prompt 여부 선택.

## 에이전트 설정

앱의 Codex 에이전트는 IDE·CLI 확장과 같은 설정 상속. 흔한 설정은 in-app 컨트롤 사용, 고급 옵션은 `config.toml` 편집. → [Codex 보안](../administration/agent-approvals-security.md), [config basics](../configuration/config-basic.md)

## Appearance

**Settings**에서 base 테마 선택, accent·배경·전경 색 조정, UI·코드 폰트 변경. 커스텀 테마를 친구와 공유 가능.

### Codex pets

Codex pets는 앱의 선택적 애니메이션 동반자. **Settings → Appearance → Pets** → 빌트인 pet 선택 또는 로컬 Codex 홈에서 커스텀 pet 새로고침. composer에 `/pet` 입력, **Settings > Appearance**에서 **Wake Pet**·**Tuck Away Pet**, 또는 Cmd+K/Ctrl+K → 같은 명령 → floating overlay 토글.

Overlay는 다른 앱 사용 중에도 활성 Codex 작업 보임. 활성 스레드 표시, Codex 실행/입력 대기/검토 준비 상태 반영, 그 상태와 짧은 진행 prompt 페어링 → 스레드 다시 열지 않고 변경 확인.

자체 pet 생성: `hatch-pet` 스킬 설치:
```
$skill-installer hatch-pet
```

명령 메뉴에서 스킬 reload. Cmd+K/Ctrl+K → **Force Reload Skills** → 스킬에 pet 생성 요청:
```
$hatch-pet create a new pet inspired by my recent projects
```

## Git

브랜치 이름 표준화, Codex가 force push 사용할지 선택. Codex가 commit 메시지·PR 설명 생성에 사용할 prompt도 설정.

## Integrations & MCP

MCP로 외부 도구 연결. 추천 서버 활성화 또는 자체 추가. OAuth 필요 서버는 앱이 auth 플로 시작. 이 설정은 CLI·IDE 확장에도 적용 (MCP 설정이 `config.toml`에 있으므로). → [MCP 문서](../configuration/mcp.md)

## Browser use

번들된 Browser 플러그인 설치·활성화, [Codex Chrome 확장](app-chrome-extension.md) 셋업, allowlist·blocklist 웹사이트 관리. allowlist 안 했으면 Codex가 웹사이트 사용 전 질문. blocklist에서 사이트 제거 → Codex가 브라우저에서 사용 전 다시 질문 가능.

→ 브라우저 미리보기·코멘트·browser use 워크플로: [in-app 브라우저](app-browser.md)

## Computer Use

macOS에서 Computer Use 설정 — 셋업 후 데스크톱 앱 액세스·관련 선호 검토. 시스템 레벨 액세스 취소 → macOS Privacy & Security 설정의 Screen Recording 또는 Accessibility 권한 갱신. 출시 시점 EEA/UK/스위스 미가용.

## Personalization

기본 personality로 **Friendly**, **Pragmatic**, **None** 선택. **None**은 personality instructions 비활성화. 언제든 갱신.

자체 커스텀 instructions 추가도. 커스텀 instructions 편집 → [`AGENTS.md`의 개인 instructions](../configuration/agents-md.md) 갱신.

## Context-aware suggestions

context-aware suggestion으로 Codex 시작·복귀 시 재개 원할 follow-up·작업 표시.

## Memories

Memories 활성화 (가용 시) → Codex가 과거 스레드 유용한 컨텍스트를 미래 작업으로. → [Memories](../concepts/memories.md)

## Archived threads

**Archived threads** 섹션은 archive된 chat을 날짜·프로젝트 컨텍스트와 함께 나열. **Unarchive**로 스레드 복원.

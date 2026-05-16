---
원문: https://developers.openai.com/codex/agent-approvals-security
동기화일: 2026-05-15
---

# 에이전트 승인 & 보안

> 샌드박싱·승인·네트워크 통제로 Codex 안전 운영

Codex는 코드·데이터 보호 + 오용 위험 감소.

> 이 페이지는 Codex 안전 운영 — 샌드박싱, 승인, 네트워크 액세스. 연결 GitHub 리포 스캔 제품 Codex Security는 [Codex Security](security-overview.md).

기본적으로 에이전트는 네트워크 액세스 OFF로 실행. 로컬에서 Codex가 OS 강제 샌드박스 사용 → 접근 가능 범위 제한 (보통 현재 워크스페이스) + 액션 전 멈춰 묻는 시점 통제하는 승인 정책.

→ Codex 앱·IDE 확장·CLI에 걸친 샌드박싱 상위 설명: [샌드박싱](../concepts/sandboxing.md). 더 넓은 엔터프라이즈 보안 개요: [Codex 보안 white paper](https://trust.openai.com/?itemUid=382f924d-54f3-43a8-a9df-c39e6c959958&source=click)

## 샌드박스와 승인

Codex 보안 통제는 함께 동작하는 두 레이어:

- **샌드박스 모드**: Codex가 모델 생성 명령 실행 시 기술적으로 할 수 있는 것 (어디 쓸 수 있는지, 네트워크 도달 가능 여부)
- **승인 정책**: Codex가 액션 실행 전 사용자에게 묻는 시점 (샌드박스 떠나기, 네트워크 사용, 신뢰 셋 외 명령 실행 등)

실행 위치별 다른 샌드박스 모드:

- **Codex 클라우드**: 격리된 OpenAI 관리 컨테이너에서 실행 → 호스트 시스템·무관 데이터 액세스 방지. 두 단계 런타임 모델 — 셋업이 에이전트 단계 전 실행 + 지정 의존성 설치를 위해 네트워크 액세스 가능, 그 다음 에이전트 단계는 환경에 인터넷 액세스 활성화 안 했으면 기본 오프라인. 클라우드 환경 시크릿은 셋업 동안만 가용 + 에이전트 단계 시작 전 제거.
- **CLI / IDE 확장**: OS 레벨 메커니즘이 샌드박스 정책 강제. 기본 — 네트워크 액세스 없음 + 활성 워크스페이스로 쓰기 권한 제한. 샌드박스, 승인 정책, 네트워크 설정을 위험 허용도 기반 구성 가능.

`Auto` 프리셋 (`--sandbox workspace-write --ask-for-approval on-request`)에서 Codex가 작업 디렉터리에서 파일 읽기·편집·명령 실행 자동.

워크스페이스 외부 파일 편집·네트워크 액세스 필요 명령 실행에 Codex가 승인 요청. 변경 없이 채팅·계획만 → `/permissions`로 `read-only` 모드 전환.

부수 효과 advertise하는 앱(connector) 도구 호출에도 승인 elicit 가능 — 셸 명령·파일 변경 아니어도. Destructive 앱·MCP 도구 호출은 도구가 destructive annotation advertise 시 항상 승인 필요 (다른 힌트, 예: read-only 힌트도 advertise해도).

## 네트워크 액세스 [Elevated Risk]

Codex 클라우드 — 풀 인터넷 액세스 또는 도메인 allow list 활성화: [에이전트 인터넷 액세스](../web/internet-access.md)

앱·CLI·IDE 확장 — 기본 `workspace-write` 샌드박스 모드는 설정에서 활성화 안 하면 네트워크 액세스 OFF:

```toml
[sandbox_workspace_write]
network_access = true
```

spawned 명령에 풀 네트워크 액세스 부여 없이 [웹 검색 도구](https://platform.openai.com/docs/guides/tools-web-search) 통제도. Codex는 결과 액세스에 웹 검색 캐시 기본 사용. 캐시는 OpenAI 유지 prebuilt index → 캐시 모드는 라이브 페이지 fetch 대신 prebuilt 결과 반환. 임의 라이브 콘텐츠 prompt injection 노출 ↓ (단, 결과는 untrusted로 다루기). `--yolo` 또는 다른 [full access 샌드박스 설정](#흔한-샌드박스승인-조합) 사용 시 라이브 결과 기본. 라이브 brwsing 허용 → `--search` 또는 `web_search = "live"`. 도구 OFF → `"disabled"`.

```toml
web_search = "cached"  # 기본
# web_search = "disabled"
# web_search = "live"  # --search와 동일
```

> Codex에 네트워크 액세스·웹 검색 활성화 시 신중. Prompt injection이 에이전트가 신뢰 안 하는 instructions fetch·따르게 할 수 있음.

## 기본값과 권장사항

- 시작 시 Codex가 폴더 버전 통제 여부 감지 + 권장:
  - **버전 통제 폴더**: `Auto` (workspace-write + on-request 승인)
  - **비-버전 통제 폴더**: `read-only`

셋업에 따라 Codex가 작업 디렉터리 명시 신뢰까지 read-only로 시작 가능 (예: 온보딩 prompt나 `/permissions`).

워크스페이스는 현재 디렉터리와 `/tmp` 같은 임시 디렉터리 포함. `/status`로 워크스페이스 디렉터리 확인.

기본값 수용 → `codex` 실행. 명시 설정:
```bash
codex --sandbox workspace-write --ask-for-approval on-request
codex --sandbox read-only --ask-for-approval on-request
```

### Writable roots의 보호 경로

기본 `workspace-write` 샌드박스 정책에서 writable roots는 보호 경로 포함:

- `<root>/.git`은 디렉터리·파일 어느 형태든 read-only로 보호
- `<root>/.git`이 포인터 파일 (`gitdir: ...`)이면 resolve된 Git 디렉터리 경로도 read-only 보호
- `<root>/.agents`는 디렉터리로 존재 시 read-only 보호
- `<root>/.codex`는 디렉터리로 존재 시 read-only 보호
- 보호는 재귀 → 그 경로 아래 모든 것 read-only

### 파일시스템 프로파일로 읽기 거부

명명된 권한 프로파일은 정확한 경로·glob 패턴에 읽기 거부도 가능. 워크스페이스가 쓰기 가능 유지 + 특정 민감 파일 (예: 로컬 환경 파일) 읽기 불가 유지에 유용:

```toml
default_permissions = "workspace"

[permissions.workspace.filesystem]
":project_roots" = { "." = "write", "**/*.env" = "none" }
glob_scan_max_depth = 3
```

Codex가 읽으면 안 되는 경로·glob에 `"none"`. 샌드박스 정책이 로컬 macOS·Linux 명령 실행에 glob 평가. 샌드박스 시작 전 glob 매치 미리 expand하는 플랫폼 — unbounded `**` 패턴엔 `glob_scan_max_depth` 설정, 또는 명시 깊이 (`*.env`, `*/*.env`, `*/*/*.env`) 나열.

### 승인 prompt 없이 실행

`--ask-for-approval never` 또는 `-a never`로 승인 prompt 비활성화.

모든 `--sandbox` 모드와 동작 → Codex 자율도 통제. 설정 제약 안에서 best effort.

승인 prompt 없이 네트워크 액세스 + 파일 읽기·편집·명령 실행 → `--sandbox danger-full-access` (또는 `--dangerously-bypass-approvals-and-sandbox`). 신중히.

중간 — `approval_policy = { granular = { ... } }`로 특정 승인 prompt 카테고리 인터랙티브 유지 + 다른 것 자동 거부. Granular 정책은 샌드박스 승인, execpolicy 룰 prompt, MCP prompt, `request_permissions` prompt, 스킬 스크립트 승인 커버.

### 자동 승인 리뷰

기본은 사용자에게 승인 요청 라우팅:
```toml
approvals_reviewer = "user"
```

자동 승인 리뷰는 `approval_policy = "on-request"` 또는 granular 정책처럼 승인 인터랙티브일 때 적용. `approvals_reviewer = "auto_review"`로 자격 승인 요청을 Codex 실행 전 reviewer 에이전트로 라우팅:

```toml
approval_policy = "on-request"
approvals_reviewer = "auto_review"
```

→ reviewer 라이프사이클, 트리거 조건, 설정 우선순위, 실패 동작: [Auto-review](../concepts/auto-review.md)

Reviewer는 이미 승인 필요 액션만 평가 — 샌드박스 escalation, 차단 네트워크 요청, `request_permissions` prompt, 부수 효과 앱·MCP 도구 호출. 샌드박스 안에 머무는 액션은 추가 리뷰 단계 없이 계속.

Reviewer 정책 체크: 데이터 exfiltration, 자격증명 prob, 영구 보안 약화, destructive 액션. 저·중 위험 액션은 정책 허용 시 진행. 정책이 critical 위험 액션 거부. 고위험 액션은 충분한 사용자 권한 + 매칭 deny 룰 없을 때만. Prompt-build, review-session, parse 실패는 fail closed. 타임아웃은 별도 표시, 액션은 여전히 실행 안 됨.

[기본 reviewer 정책](https://github.com/openai/codex/blob/main/codex-rs/core/src/guardian/policy.md)은 오픈소스 Codex 리포. 엔터프라이즈는 managed requirements의 `guardian_policy_config`로 tenant 특화 섹션 교체. 로컬 `[auto_review].policy` 텍스트도 지원, managed requirements가 우선. → 셋업 디테일: [Managed configuration](enterprise-managed-config.md)

Codex 앱에서 이 리뷰는 자동 리뷰 항목으로 표시 — 상태 (Reviewing, Approved, Denied, Aborted, Timed out). 리뷰된 요청의 위험 레벨·사용자 권한 평가도 포함 가능.

자동 리뷰는 추가 모델 호출 사용 → Codex 사용량 추가 가능. Admin이 `allowed_approvals_reviewers`로 제약 가능.

### 흔한 샌드박스·승인 조합

| 의도 | 플래그·config | 효과 |
| --- | --- | --- |
| Auto (프리셋) | (플래그 없음) 또는 `--sandbox workspace-write --ask-for-approval on-request` | 워크스페이스에서 파일 읽기·편집·명령 실행. 외부 편집·네트워크 액세스에 승인 필요 |
| 안전 read-only browsing | `--sandbox read-only --ask-for-approval on-request` | 파일 읽기·답변. 편집·명령·네트워크에 승인 필요 |
| Read-only 비인터랙티브 (CI) | `--sandbox read-only --ask-for-approval never` | 파일 읽기만, 승인 안 물음 |
| 자동 편집 + 신뢰 안 하는 명령엔 승인 | `--sandbox workspace-write --ask-for-approval untrusted` | 파일 읽기·편집, 신뢰 안 하는 명령 실행 전 승인 |
| Auto-review 모드 | `--sandbox workspace-write --ask-for-approval on-request -c approvals_reviewer=auto_review` | 표준 on-request 모드와 같은 샌드박스 경계, 자격 승인은 사용자 표시 대신 Auto-review가 검토 |
| 위험한 풀 액세스 | `--dangerously-bypass-approvals-and-sandbox` (alias `--yolo`) | [Elevated Risk] 샌드박스 없음, 승인 없음 (권장 안 함) |

비인터랙티브 실행 — `codex exec --sandbox workspace-write` 사용. `codex exec --full-auto`는 deprecated 호환 경로로 유지, 경고 출력.

`--ask-for-approval untrusted` — 알려진 안전 읽기 작업만 자동 실행. 상태 변경·외부 실행 경로 트리거 명령 (예: destructive Git 작업, Git output·config-override 플래그)은 승인 필요.

#### `config.toml` 설정

→ 더 넓은 설정 워크플로: [Config basics](../configuration/config-basic.md), [Advanced Config](../configuration/config-advanced.md), [Configuration Reference](../configuration/config-reference.md)

```toml
# 항상 승인 모드
approval_policy = "untrusted"
sandbox_mode    = "read-only"
allow_login_shell = false  # 선택 hardening: 셸 도구의 login shell 금지

# 선택: workspace-write 모드에서 네트워크 허용
[sandbox_workspace_write]
network_access = true

# 선택: granular 승인 정책
# approval_policy = { granular = {
#   sandbox_approval = true,
#   rules = true,
#   mcp_elicitations = true,
#   request_permissions = false,
#   skill_approval = false
# } }
```

프리셋을 프로파일로 저장 + `codex --profile <name>`:
```toml
[profiles.full_auto]
approval_policy = "on-request"
sandbox_mode    = "workspace-write"

[profiles.readonly_quiet]
approval_policy = "never"
sandbox_mode    = "read-only"
```

### 로컬 샌드박스 테스트

Codex 샌드박스 아래 명령 실행 시 일어나는 것 보기:
```bash
# macOS
codex sandbox macos [--permissions-profile <NAME>] [--log-denials] [COMMAND]...
# Linux
codex sandbox linux [--permissions-profile <NAME>] [COMMAND]...
# Windows
codex sandbox windows [--permissions-profile <NAME>] [COMMAND]...
```

`sandbox` 명령은 `codex debug`로도 가용, 플랫폼 헬퍼는 별칭 (예: `codex sandbox seatbelt`, `codex sandbox landlock`).

## OS 레벨 샌드박스

OS별 다른 샌드박스 강제:

- **macOS**: Seatbelt 정책 + `--sandbox` 모드와 매칭되는 프로파일 (`-p`)로 `sandbox-exec`로 명령 실행. 제한 읽기 액세스가 플랫폼 기본 활성화 시 Codex가 큐레이트된 macOS 플랫폼 정책 append (`/System` 광범위 허용 대신) → 흔한 도구 호환성 보존.
- **Linux**: 기본 `bwrap` + `seccomp`.
- **Windows**: [WSL2](windows.md) 실행 시 Linux 샌드박스 구현. WSL1은 Codex `0.114`까지 지원, `0.115`부터 Linux 샌드박스가 `bwrap`으로 이동 → WSL1 미지원. Windows에서 네이티브 실행 시 [Windows 샌드박스](windows.md) 구현.

Windows에서 IDE 확장 사용 시 WSL2 직접 지원. VS Code 설정에 다음 → 가용 시 에이전트 WSL2 안에 유지:
```json
{
  "chatgpt.runCodexInWindowsSubsystemForLinux": true
}
```

→ IDE 확장이 호스트 OS가 Windows여도 명령·승인·파일시스템 액세스에 Linux 샌드박스 시멘틱 상속. → [Windows 셋업](windows.md)

Windows 네이티브 실행 시 `config.toml`에 네이티브 샌드박스 모드 구성:
```toml
[windows]
sandbox = "unelevated"  # 또는 "elevated"
# sandbox_private_desktop = true  # 기본; 호환성 위해서만 false
```

→ [Windows 샌드박스](windows.md)

Linux를 Docker 같은 컨테이너 환경에서 실행 시 호스트·컨테이너 구성이 namespace, setuid `bwrap`, `seccomp` 작업 차단 시 샌드박스 동작 안 할 수 있음.

그때 필요한 격리 제공하도록 Docker 컨테이너 구성 → 컨테이너 안에서 `--sandbox danger-full-access` (또는 `--dangerously-bypass-approvals-and-sandbox`)로 `codex` 실행.

### Dev Containers에서 Codex 실행

호스트가 Linux 샌드박스 직접 실행 못 하거나 조직이 이미 컨테이너화 개발 표준화 → Codex를 Dev Containers로 실행 + Docker가 외부 격리 경계 제공. VS Code Dev Containers·호환 도구와 동작.

[Codex 보안 devcontainer 예시](https://github.com/openai/codex/tree/main/.devcontainer)를 참조 구현으로. 예시는 Codex, 흔한 개발 도구, `bubblewrap`, firewall 기반 outbound 통제 설치.

> Devcontainer는 상당한 보호, 모든 공격 방지는 아님. 컨테이너 안에서 `--sandbox danger-full-access` 또는 `--dangerously-bypass-approvals-and-sandbox`로 Codex 실행 시 악성 프로젝트가 devcontainer 안 모든 것 (Codex 자격증명 포함) exfiltrate 가능. 신뢰 리포만 + 다른 elevated 환경처럼 Codex 활동 모니터.

참조 구현 포함:
- Codex와 흔한 개발 도구 설치된 Ubuntu 24.04 base 이미지
- outbound 액세스용 allowlist 주도 firewall 프로파일
- 컨테이너에서 워크스페이스 다시 열기용 VS Code 설정·확장 권장
- 명령 히스토리·Codex 설정 영속 마운트
- 컨테이너가 필요 capability 부여 시 Codex가 여전히 Linux 샌드박스 사용 가능한 `bubblewrap`

시도:
1. VS Code + [Dev Containers 확장](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) 설치
2. Codex 예시 `.devcontainer` 셋업을 리포에 복사 또는 Codex 리포에서 직접 시작
3. VS Code에서 **Dev Containers: Open Folder in Container...** → `.devcontainer/devcontainer.secure.json` 선택
4. 컨테이너 시작 후 터미널 열고 `codex` 실행

CLI에서 컨테이너 시작:
```bash
devcontainer up --workspace-folder . --config .devcontainer/devcontainer.secure.json
```

예시 3개 주요 부분:
- `.devcontainer/devcontainer.secure.json` — 컨테이너 설정, capability, 마운트, 환경 변수, VS Code 확장
- `.devcontainer/Dockerfile.secure` — Ubuntu base 이미지·설치 도구 정의
- `.devcontainer/init-firewall.sh` — outbound 네트워크 정책 적용

> 참조 firewall은 의도적 시작점. 격리에 도메인 allowlisting 의존하면 환경에 맞는 DNS rebinding·DNS refresh 보호 (TTL-aware refresh, DNS-aware firewall) 구현.

컨테이너 안 모드 선택:
- Dev Container 프로파일이 `bwrap`이 inner 샌드박스 생성에 필요한 capability 부여하면 Codex Linux 샌드박스 활성 유지
- 컨테이너가 의도된 보안 경계면 컨테이너 안에서 `--sandbox danger-full-access`로 Codex 실행 → Codex가 두 번째 샌드박스 레이어 생성 시도 안 함

## 버전 통제

Codex는 버전 통제 워크플로와 가장 잘 동작:
- 기능 브랜치에서 작업 + 위임 전 `git status` clean 유지 → Codex 패치 격리·revert 쉬워짐
- 추적 파일 직접 편집보다 패치 기반 워크플로 (예: `git diff`/`git apply`) 우선. 자주 commit → 작은 증분으로 롤백 가능.
- Codex 제안을 다른 PR처럼 다루기 — 타겟 검증 실행, diff 검토, 감사 위해 commit 메시지에 결정 문서화.

## 모니터링과 텔레메트리

OpenTelemetry (OTel) opt-in 모니터링 지원 → 팀이 사용량 감사, 이슈 조사, 컴플라이언스 요구사항 충족 (로컬 보안 기본값 약화 없이). 텔레메트리는 기본 OFF, 설정에서 명시 활성화.

### 개요

- Codex는 로컬 실행을 self-contained로 유지하기 위해 OTel export 기본 OFF
- 활성화 시 대화, API 요청, SSE/WebSocket 스트림 활동, 사용자 prompt (기본 redact), 도구 승인 결정, 도구 결과 커버하는 구조화 로그 이벤트 emit
- Codex가 export 이벤트에 `service.name` (originator), CLI 버전, 환경 라벨 태그 → dev/staging/prod 트래픽 분리

### OTel 활성화 (opt-in)

Codex 설정 (보통 `~/.codex/config.toml`)에 `[otel]` 블록 추가 — exporter 선택 + prompt 텍스트 로그 여부:

```toml
[otel]
environment = "staging"   # dev | staging | prod
exporter = "none"          # none | otlp-http | otlp-grpc
log_user_prompt = false    # 정책 허용 시 외엔 prompt 텍스트 redact
```

`exporter = "none"`은 instrumentation 활성 유지 + 데이터 어디에도 보내지 않음.

자체 collector에 이벤트 보내기:
```toml
[otel]
exporter = { otlp-http = {
  endpoint = "https://otel.example.com/v1/logs",
  protocol = "binary",
  headers = { "x-otlp-api-key" = "${OTLP_TOKEN}" }
}}
```

```toml
[otel]
exporter = { otlp-grpc = {
  endpoint = "https://otel.example.com:4317",
  headers = { "x-otlp-meta" = "abc123" }
}}
```

Codex가 이벤트 batch + shutdown 시 flush. Codex는 자체 OTel 모듈 생산 텔레메트리만 export.

### 이벤트 카테고리

대표 타입:
- `codex.conversation_starts` (모델, reasoning 설정, 샌드박스/승인 정책)
- `codex.api_request` (시도, 상태/성공, duration, 에러 디테일)
- `codex.sse_event` (스트림 이벤트 종류, 성공/실패, duration, `response.completed`에서 토큰 카운트)
- `codex.websocket_request`, `codex.websocket_event` (요청 duration + 메시지별 종류/성공/에러)
- `codex.user_prompt` (길이; 명시 활성화 외엔 콘텐츠 redact)
- `codex.tool_decision` (승인/거부, 출처: 설정 vs 사용자)
- `codex.tool_result` (duration, 성공, 출력 스니펫)

연관 OTel 메트릭 (counter + duration histogram 페어): `codex.api_request`, `codex.sse_event`, `codex.websocket.request`, `codex.websocket.event`, `codex.tool.call` (해당 `.duration_ms` instrument 포함).

→ 전체 이벤트 카탈로그·설정 레퍼런스: [GitHub의 Codex 설정 문서](https://github.com/openai/codex/blob/main/docs/config.md#otel)

### 보안·프라이버시 가이드

- 정책이 prompt 콘텐츠 저장 명시 허용 안 하면 `log_user_prompt = false` 유지. Prompt가 소스 코드·민감 데이터 포함 가능.
- 통제하는 collector로만 텔레메트리 라우팅 + 컴플라이언스 요구사항에 맞는 retention 한도·액세스 통제 적용
- 도구 인자·출력을 민감으로 다루기. 가능하면 collector·SIEM에서 redaction 우선.
- Codex가 `CODEX_HOME` 아래 세션 트랜스크립트 저장 안 하길 원하면 로컬 데이터 retention 설정 (`history.persistence`/`history.max_bytes`) 검토. → [Advanced Config](../configuration/config-advanced.md), [Configuration Reference](../configuration/config-reference.md)
- 네트워크 액세스 OFF로 CLI 실행 시 OTel export가 collector에 도달 못 함. Export → workspace-write 모드에서 OTel 엔드포인트에 네트워크 액세스 허용 또는 Codex 클라우드에서 collector 도메인을 승인 리스트에 두고 export.
- 승인·샌드박스 변경, 예상 안 한 도구 실행 위해 정기 이벤트 검토.

OTel은 선택, 위 샌드박스·승인 보호 보완용 (대체 아님).

## Managed configuration

엔터프라이즈 admin이 워크스페이스의 Codex 보안 설정을 [Managed configuration](enterprise-managed-config.md)에서 구성 가능. 그 페이지에 셋업·정책 디테일.

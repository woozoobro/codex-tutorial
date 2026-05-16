---
원문: https://developers.openai.com/codex/config-advanced
동기화일: 2026-05-15
---

# 고급 설정 (Advanced Configuration)

> 로컬 Codex 클라이언트의 고급 설정

프로바이더, 정책, 통합에 대한 더 많은 제어가 필요할 때 사용. 빠른 시작은 [Config basics](config-basic.md) 참고.

프로젝트 가이드, 재사용 능력, 커스텀 슬래시 명령, 서브에이전트 워크플로, 통합의 배경은 [Customization](../concepts/customization.md). 설정 키는 [Configuration Reference](config-reference.md).

## Profiles

프로필로 명명된 설정 값 셋을 저장하고 CLI에서 전환.

> ⚠️ 프로필은 실험 — 향후 릴리스에서 변경·제거될 수 있음. IDE 확장 미지원.

`config.toml`의 `[profiles.<name>]` 아래 정의 → `codex --profile <name>`:

```toml
model = "gpt-5.4"
approval_policy = "on-request"
model_catalog_json = "/Users/me/.codex/model-catalogs/default.json"

[profiles.deep-review]
model = "gpt-5-pro"
model_reasoning_effort = "high"
approval_policy = "never"
model_catalog_json = "/Users/me/.codex/model-catalogs/deep-review.json"

[profiles.lightweight]
model = "gpt-4.1"
approval_policy = "untrusted"
```

기본 프로필 만들기: `config.toml` top level에 `profile = "deep-review"`. CLI에서 오버라이드하지 않으면 그 프로필 로드.

`model_catalog_json`도 오버라이드 가능. top level과 선택된 프로필 둘 다 설정 시 프로필 우선.

## CLI에서 일회성 오버라이드

`~/.codex/config.toml` 편집 외에:
- 전용 플래그 우선 (예: `--model`)
- 임의 키 오버라이드: `-c` / `--config`

```bash
# 전용 플래그
codex --model gpt-5.4

# 일반 key/value (값은 TOML, JSON 아님)
codex --config model='"gpt-5.4"'
codex --config sandbox_workspace_write.network_access=true
codex --config 'shell_environment_policy.include_only=["PATH","HOME"]'
```

메모:
- 키는 점 표기법으로 nested 값 (예: `mcp_servers.context7.enabled=false`)
- `--config` 값은 TOML로 파싱. 모호하면 따옴표로 묶어 셸이 공백으로 split하지 않게.
- TOML로 파싱 안 되면 문자열 처리.

## Config·상태 위치

Codex는 로컬 상태를 `CODEX_HOME` (기본 `~/.codex`) 아래 저장.

흔히 보는 파일:
- `config.toml` — 로컬 설정
- `auth.json` — 파일 기반 자격증명 저장 시 (또는 OS keychain/keyring)
- `history.jsonl` — 히스토리 영속화 활성 시
- 사용자별 상태 (로그, 캐시 등)

→ 인증 상세: [Authentication](../administration/auth.md). 전체 설정 키: [Configuration Reference](config-reference.md). 리포·시스템 경로의 공유 기본값·룰·스킬: [Team Config](../administration/enterprise-admin-setup.md).

빌트인 OpenAI 프로바이더를 LLM 프록시·라우터·data residency 프로젝트로 가리키려면 `openai_base_url` 설정 (새 프로바이더 정의 대신):

```toml
openai_base_url = "https://us.api.openai.com/v1"
```

## 프로젝트 config 파일 (`.codex/config.toml`)

사용자 config 외에 리포 안 `.codex/config.toml`에서 프로젝트 스코프 오버라이드. Codex가 프로젝트 루트에서 현재 작업 디렉터리까지 walk하며 발견된 모든 `.codex/config.toml` 로드. 같은 키 정의 시 작업 디렉터리에 가장 가까운 파일 우승.

보안: 프로젝트가 신뢰될 때만 로드. 신뢰되지 않으면 프로젝트 `.codex/` 레이어 (config, hooks, rules) 무시. 사용자·시스템 레이어는 별도 유지·로드.

프로젝트 config 안 상대 경로 (예: `model_instructions_file`)는 그 `config.toml`을 포함하는 `.codex/` 폴더 기준 resolve.

## Hooks

활성 config 레이어 옆 `hooks.json` 또는 `config.toml`의 인라인 `[hooks]` 테이블에서 라이프사이클 훅 로드.

실용적 4대 위치:
- `~/.codex/hooks.json`
- `~/.codex/config.toml`
- `<project>/.codex/hooks.json`
- `<project>/.codex/config.toml`

프로젝트 로컬 훅은 프로젝트 `.codex/` 레이어 신뢰 시만. 사용자 레벨 훅은 프로젝트 신뢰와 무관.

인라인 TOML 훅은 `hooks.json`과 같은 이벤트 구조:

```toml
[[hooks.PreToolUse]]
matcher = "^Bash$"

[[hooks.PreToolUse.hooks]]
type = "command"
command = '/usr/bin/python3 "$(git rev-parse --show-toplevel)/.codex/hooks/pre_tool_use_policy.py"'
timeout = 30
statusMessage = "Checking Bash command"
```

한 레이어에 `hooks.json`과 인라인 `[hooks]` 둘 다 있으면 둘 다 로드 + 경고. 레이어당 하나 권장.

→ 현재 이벤트, 입력 필드, 출력 동작, 제한: [Hooks](hooks.md)

## 에이전트 역할 (`[agents]`)

서브에이전트 역할 설정 → [Subagents](subagents.md)

## 프로젝트 루트 감지

Codex는 작업 디렉터리에서 위로 walk하여 프로젝트 루트까지 갈 때 프로젝트 설정 (`.codex/`, `AGENTS.md`) 발견.

기본은 `.git` 포함 디렉터리를 프로젝트 루트로 처리. 커스터마이징:

```toml
project_root_markers = [".git", ".hg", ".sl"]
```

`project_root_markers = []`로 부모 디렉터리 탐색 스킵 → 현재 작업 디렉터리를 프로젝트 루트로.

## 커스텀 모델 프로바이더

모델 프로바이더는 Codex가 모델에 연결하는 방식 정의 (base URL, wire API, 인증, 선택 HTTP 헤더). 커스텀 프로바이더는 빌트인 ID (`openai`, `ollama`, `lmstudio`) 재사용 불가.

```toml
model = "gpt-5.4"
model_provider = "proxy"

[model_providers.proxy]
name = "OpenAI using LLM proxy"
base_url = "http://proxy.example.com"
env_key = "OPENAI_API_KEY"

[model_providers.local_ollama]
name = "Ollama"
base_url = "http://localhost:11434/v1"

[model_providers.mistral]
name = "Mistral"
base_url = "https://api.mistral.ai/v1"
env_key = "MISTRAL_API_KEY"
```

요청 헤더:
```toml
[model_providers.example]
http_headers = { "X-Example-Header" = "example-value" }
env_http_headers = { "X-Example-Features" = "EXAMPLE_FEATURES" }
```

명령 기반 인증 (외부 자격증명 헬퍼에서 bearer token fetch):
```toml
[model_providers.proxy]
name = "OpenAI using LLM proxy"
base_url = "https://proxy.example.com/v1"
wire_api = "responses"

[model_providers.proxy.auth]
command = "/usr/local/bin/fetch-codex-token"
args = ["--audience", "codex"]
timeout_ms = 5000
refresh_interval_ms = 300000
```

auth 명령은 stdin 받지 않고 stdout으로 토큰 출력. Codex가 양 끝 공백 트림, 빈 토큰은 에러, `refresh_interval_ms`마다 사전 새로고침. `refresh_interval_ms = 0`면 인증 재시도 후에만 새로고침. `[model_providers.<id>.auth]`를 `env_key`, `experimental_bearer_token`, `requires_openai_auth`와 결합 금지.

### Amazon Bedrock 프로바이더

빌트인 `amazon-bedrock` 프로바이더. 직접 `model_provider`에 설정. 커스텀 프로바이더와 달리 nested AWS profile·region 오버라이드만 지원.

```toml
model_provider = "amazon-bedrock"
model = "<bedrock-model-id>"

[model_providers.amazon-bedrock.aws]
profile = "default"
region = "eu-central-1"
```

`profile` 생략 시 표준 AWS credential chain 사용.

## OSS 모드 (로컬 프로바이더)

`--oss`로 로컬 OSS 프로바이더 (Ollama, LM Studio) 실행. `--oss`만 지정 시 Codex는 `oss_provider`를 기본으로 사용.

```toml
oss_provider = "ollama"  # 또는 "lmstudio"
```

## Azure 프로바이더 + 프로바이더별 튜닝

```toml
[model_providers.azure]
name = "Azure"
base_url = "https://YOUR_PROJECT_NAME.openai.azure.com/openai"
env_key = "AZURE_OPENAI_API_KEY"
query_params = { api-version = "2025-04-01-preview" }
wire_api = "responses"
request_max_retries = 4
stream_max_retries = 10
stream_idle_timeout_ms = 300000
```

빌트인 OpenAI 프로바이더 base URL 변경은 `openai_base_url` 사용. `[model_providers.openai]` 만들지 말 것 — 빌트인 ID 오버라이드 불가.

## ChatGPT data residency 사용자

[data residency](https://help.openai.com/en/articles/9903489-data-residency-and-inference-residency-for-chatgpt) 활성 프로젝트는 [올바른 prefix](https://platform.openai.com/docs/guides/your-data#which-models-and-features-are-eligible-for-data-residency)로 base_url 갱신:

```toml
model_provider = "openaidr"
[model_providers.openaidr]
name = "OpenAI Data Residency"
base_url = "https://us.api.openai.com/v1"  # 'us'를 도메인 prefix로 교체
```

## 모델 reasoning, verbosity, 한도

```toml
model_reasoning_summary = "none"          # 요약 비활성화
model_verbosity = "low"                   # 짧은 응답
model_supports_reasoning_summaries = true # reasoning 강제
model_context_window = 128000             # 컨텍스트 윈도우 크기
```

`model_verbosity`는 Responses API 프로바이더만 적용. Chat Completions 프로바이더는 무시.

## 승인 정책·샌드박스 모드

승인 엄격도 (Codex가 일시정지하는 시점) + 샌드박스 레벨 (파일·네트워크 접근).

운영 디테일: [Common sandbox and approval combinations](../administration/agent-approvals-security.md), [Protected paths](../administration/agent-approvals-security.md), [Network access](../administration/agent-approvals-security.md) 참고.

Granular 승인 정책 (`approval_policy = { granular = { ... } }`)으로 카테고리별 허용/자동 거부. 일부는 일반 인터랙티브 승인, 다른 것 (`request_permissions`, 스킬 스크립트 prompt 등)은 자동 fail closed.

`approvals_reviewer = "auto_review"`로 자격 인터랙티브 승인 요청을 자동 리뷰로 라우팅. 리뷰어만 변경, 샌드박스 경계는 그대로.

`[auto_review].policy`는 로컬 리뷰어 정책 instructions. Managed `guardian_policy_config`가 우선.

```toml
approval_policy = "untrusted"   # 다른 옵션: on-request, never, { granular = { ... } }
approvals_reviewer = "user"     # 또는 "auto_review"
sandbox_mode = "workspace-write"
allow_login_shell = false       # 선택 hardening: 셸 도구의 login shell 금지

# Granular 정책 예:
# approval_policy = { granular = {
#   sandbox_approval = true,
#   rules = true,
#   mcp_elicitations = true,
#   request_permissions = false,
#   skill_approval = false
# } }

[sandbox_workspace_write]
exclude_tmpdir_env_var = false  # $TMPDIR 허용
exclude_slash_tmp = false       # /tmp 허용
writable_roots = ["/Users/YOU/.pyenv/shims"]
network_access = false          # outbound 네트워크 opt-in

[auto_review]
policy = """
Use your organization's automatic review policy.
"""
```

### 명명된 권한 프로필

`default_permissions`로 샌드박스 프로필 재사용. 빌트인: `:read-only`, `:workspace`, `:danger-no-sandbox`.

```toml
default_permissions = ":workspace"
```

커스텀 프로필: `default_permissions`에 `[permissions.<name>]`로 정의한 이름 지정.

```toml
default_permissions = "workspace"

[permissions.workspace.filesystem]
":project_roots" = { "." = "write", "**/*.env" = "none" }
glob_scan_max_depth = 3

[permissions.workspace.network]
enabled = true
mode = "limited"

[permissions.workspace.network.domains]
"api.openai.com" = "allow"
```

빌트인은 콜론 prefix, 커스텀은 콜론 없이 + 매칭 `permissions` 테이블 필수.

→ 전체 키 (프로필 스코프 오버라이드, requirements 제약): [Configuration Reference](config-reference.md), [Managed configuration](../administration/enterprise-managed-configuration.md)

workspace-write 모드에서 일부 환경은 워크스페이스 나머지가 쓰기 가능해도 `.git/`와 `.codex/`를 read-only로 유지. → `git commit` 같은 명령이 샌드박스 외부 실행 승인을 요구할 수 있음. 특정 명령을 Codex가 건너뛰게 하려면 [rules](rules.md) 사용.

샌드박싱 완전 비활성화 (이미 프로세스 격리된 환경에서만):
```toml
sandbox_mode = "danger-full-access"
```

## 셸 환경 정책

`shell_environment_policy`는 Codex가 launch하는 서브프로세스에 전달할 환경 변수 제어. 깨끗한 시작 (`inherit = "none"`) 또는 트림된 셋 (`inherit = "core"`)으로 시작 → exclude/include/override 레이어로 시크릿 leak 방지하면서 필요한 path·key·flag 제공.

```toml
[shell_environment_policy]
inherit = "none"
set = { PATH = "/usr/bin", MY_FLAG = "1" }
ignore_default_excludes = false
exclude = ["AWS_*", "AZURE_*"]
include_only = ["PATH", "HOME"]
```

패턴은 case-insensitive glob (`*`, `?`, `[A-Z]`). `ignore_default_excludes = false`는 자동 KEY/SECRET/TOKEN 필터를 includes/excludes 실행 전에 유지.

## MCP 서버

→ [MCP](mcp.md) 참고.

## 관측·텔레메트리

OpenTelemetry (OTel) 로그 export로 Codex 실행 추적 (API 요청, SSE/이벤트, prompt, 도구 승인/결과). 기본 비활성, `[otel]`로 opt-in:

```toml
[otel]
environment = "staging"   # 기본 "dev"
exporter = "none"         # otlp-http 또는 otlp-grpc로 이벤트 전송
log_user_prompt = false   # 명시적으로 활성화 안 하면 사용자 prompt redact
```

Exporter 선택:

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

`exporter = "none"`이면 이벤트 기록만 + 전송 안 함. Exporter는 비동기 batch + shutdown 시 flush. 이벤트 메타데이터는 service name, CLI 버전, env tag, 대화 id, 모델, 샌드박스/승인 설정, 이벤트별 필드 포함.

### Emit 이벤트 종류 (대표)

- `codex.conversation_starts` — 모델, reasoning 설정, 샌드박스/승인 정책
- `codex.api_request` — attempt, status/success, duration, 에러 상세
- `codex.sse_event` — 스트림 이벤트 종류, success/failure, duration, `response.completed`에서 토큰 카운트
- `codex.websocket_request`, `codex.websocket_event` — 요청 duration + 메시지별 종류/success/error
- `codex.user_prompt` — 길이 (콘텐츠는 명시적으로 활성화 안 하면 redact)
- `codex.tool_decision` — approved/denied + 결정 출처 (config vs user)
- `codex.tool_result` — duration, success, 출력 스니펫

### OTel 메트릭

OTel 메트릭 파이프라인 활성 시 API, 스트림, 도구 활동의 카운터·duration 히스토그램 emit. 모든 메트릭에 기본 메타데이터 태그: `auth_mode`, `originator`, `session_source`, `model`, `app.version`.

| 메트릭 | 타입 | 필드 | 설명 |
| --- | --- | --- | --- |
| `codex.api_request` | counter | `status`, `success` | API 요청 카운트 |
| `codex.api_request.duration_ms` | histogram | `status`, `success` | API 요청 duration |
| `codex.sse_event` | counter | `kind`, `success` | SSE 이벤트 카운트 |
| `codex.sse_event.duration_ms` | histogram | `kind`, `success` | SSE 이벤트 처리 duration |
| `codex.websocket.request` | counter | `success` | WebSocket 요청 카운트 |
| `codex.websocket.request.duration_ms` | histogram | `success` | WebSocket 요청 duration |
| `codex.websocket.event` | counter | `kind`, `success` | WebSocket 메시지/이벤트 카운트 |
| `codex.websocket.event.duration_ms` | histogram | `kind`, `success` | WebSocket 메시지/이벤트 처리 duration |
| `codex.tool.call` | counter | `tool`, `success` | 도구 호출 카운트 |
| `codex.tool.call.duration_ms` | histogram | `tool`, `success` | 도구 실행 duration |

→ 더 많은 메트릭 (memory, multi_agent, plugins, threads, windows_sandbox 등): 원문 참고. → 보안·프라이버시: [Security](../administration/agent-approvals-security.md)

### 익명 사용량 메트릭

Codex는 기본적으로 OpenAI에 소량의 익명 사용량·헬스 데이터 전송 — 정상 작동 감지 + 가장 사용되는 기능 파악. PII 없음. OTel log/trace export와 독립.

비활성화:
```toml
[analytics]
enabled = false
```

### 피드백 통제

기본적으로 `/feedback`으로 피드백 전송 가능. 비활성화:
```toml
[feedback]
enabled = false
```

비활성화 시 `/feedback`은 비활성 메시지 표시 + Codex가 제출 거부.

### Reasoning 이벤트 숨김·표시

CI 로그 등에서 noisy reasoning 출력 줄이기:
```toml
hide_agent_reasoning = true
```

모델이 emit하는 raw reasoning 표시:
```toml
show_raw_agent_reasoning = true
```

워크플로에 적합할 때만 raw reasoning 활성화. 일부 모델·프로바이더 (`gpt-oss` 등)는 raw reasoning emit 안 함 → 이 설정 가시 효과 없음.

## Notifications

`notify`로 Codex가 지원 이벤트 emit 시 외부 프로그램 트리거 (현재 `agent-turn-complete`만). 데스크톱 토스트, 채팅 webhook, CI 갱신, 사이드 채널 알림에 유용.

```toml
notify = ["python3", "/path/to/notify.py"]
```

`notify.py` 예 (truncated):
```python
#!/usr/bin/env python3
import json, subprocess, sys

def main() -> int:
    notification = json.loads(sys.argv[1])
    if notification.get("type") != "agent-turn-complete":
        return 0
    title = f"Codex: {notification.get('last-assistant-message', 'Turn Complete!')}"
    message = " ".join(notification.get("input-messages", []))
    subprocess.check_output([
        "terminal-notifier",
        "-title", title,
        "-message", message,
        "-group", "codex-" + notification.get("thread-id", ""),
        "-activate", "com.googlecode.iterm2",
    ])
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

스크립트는 단일 JSON 인자 받음. 흔한 필드:
- `type` (현재 `agent-turn-complete`)
- `thread-id` (세션 식별자)
- `turn-id` (턴 식별자)
- `cwd` (작업 디렉터리)
- `input-messages` (이 턴을 부른 사용자 메시지)
- `last-assistant-message` (마지막 어시스턴트 메시지 텍스트)

### `notify` vs `tui.notifications`

- `notify`: 외부 프로그램 실행 (webhook, 데스크톱 알림, CI 훅에 적합)
- `tui.notifications`: TUI 빌트인 + 이벤트 타입 필터 가능 (`agent-turn-complete`, `approval-requested` 등)
- `tui.notification_method`: TUI 터미널 알림 방식 (`auto`, `osc9`, `bel`)
- `tui.notification_condition`: 알림 발화 조건 (`unfocused` 또는 `always`)

`auto` 모드에서 Codex는 OSC 9 (일부 터미널이 데스크톱 알림으로 해석하는 escape sequence) 우선, 그 외 BEL (`\x07`) fallback.

## 히스토리 영속화

기본은 `CODEX_HOME` 아래 (예: `~/.codex/history.jsonl`)에 트랜스크립트 저장. 비활성화:

```toml
[history]
persistence = "none"
```

크기 cap:
```toml
[history]
max_bytes = 104857600  # 100 MiB
```

cap 초과 시 가장 오래된 항목 drop + 최신 레코드 유지하며 압축.

## 클릭 가능 citations

지원 터미널·에디터 통합에서 Codex가 파일 citation을 클릭 가능 링크로 렌더. URI 스킴 선택:

```toml
file_opener = "vscode"  # 또는 cursor, windsurf, vscode-insiders, none
```

예: `/home/user/project/main.py:42` citation을 `vscode://file/...:42`로 rewrite.

## 프로젝트 instructions discovery

Codex는 `AGENTS.md` (관련 파일)를 읽고 세션 첫 턴에 제한된 양의 프로젝트 가이드 포함. 두 노브:
- `project_doc_max_bytes`: 각 `AGENTS.md`에서 읽을 양
- `project_doc_fallback_filenames`: `AGENTS.md` 누락 시 시도할 추가 파일명

→ 자세한 walkthrough: [AGENTS.md](agents-md.md)

## TUI 옵션

`codex` 서브명령 없이 실행 시 인터랙티브 TUI. `[tui]` 아래 TUI 특화 설정:
- `tui.notifications`: 알림 활성/비활성 (특정 타입 제한)
- `tui.notification_method`: `auto`, `osc9`, `bel`
- `tui.notification_condition`: `unfocused` 또는 `always`
- `tui.animations`: ASCII 애니메이션·shimmer 효과
- `tui.alternate_screen`: 대체 스크린 (스크롤백 유지하려면 `never`)
- `tui.show_tooltips`: 환영 화면 온보딩 툴팁

`tui.notification_method` 기본 `auto`. `auto`에서 Codex는 터미널이 지원해 보일 때 OSC 9 우선 → 아니면 BEL (`\x07`) fallback.

→ 전체 키 리스트: [Configuration Reference](config-reference.md)

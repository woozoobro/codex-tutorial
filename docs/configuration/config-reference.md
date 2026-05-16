---
원문: https://developers.openai.com/codex/config-reference
동기화일: 2026-05-15
---

# 설정 레퍼런스 (Configuration Reference)

> Codex `config.toml`과 `requirements.toml`의 완전 레퍼런스

이 페이지는 Codex 설정 파일의 검색 가능한 레퍼런스. 컨셉 가이드와 예시는 [Config basics](config-basic.md), [Advanced Config](config-advanced.md) 참고.

> ⚠️ 이 레퍼런스는 키가 매우 많습니다. 자주 쓰는 키는 아래에 한국어 설명, **전체 표는 원문에서**: https://developers.openai.com/codex/config-reference

## config.toml

사용자 레벨 설정은 `~/.codex/config.toml`. 프로젝트 스코프 오버라이드는 `.codex/config.toml`. 프로젝트 스코프는 신뢰 프로젝트만 로드.

샌드박스·승인 키 (`approval_policy`, `sandbox_mode`, `sandbox_workspace_write.*`)는 [Sandbox and approvals](../administration/agent-approvals-security.md)와 함께 참고.

### 카테고리별 핵심 키

#### 모델·프로바이더

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `model` | string | 사용할 모델 (예: `gpt-5.5`) |
| `model_provider` | string | `model_providers`의 프로바이더 id (기본 `openai`) |
| `model_reasoning_effort` | `minimal\|low\|medium\|high\|xhigh` | 추론 강도 |
| `model_reasoning_summary` | `auto\|concise\|detailed\|none` | 추론 요약 디테일 |
| `model_verbosity` | `low\|medium\|high` | GPT-5 Responses API verbosity 오버라이드 |
| `model_context_window` | number | 활성 모델 컨텍스트 윈도우 토큰 |
| `model_auto_compact_token_limit` | number | 히스토리 자동 압축 트리거 토큰 임계값 |
| `model_instructions_file` | path | `AGENTS.md` 대신 빌트인 instruction 대체 |
| `service_tier` | `flex\|fast` | 새 턴의 service tier 선호 |
| `oss_provider` | `lmstudio\|ollama` | `--oss` 실행 시 기본 로컬 프로바이더 |
| `openai_base_url` | string | 빌트인 `openai` 프로바이더 base URL 오버라이드 |

#### 모델 프로바이더 (`[model_providers.<id>]`)

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `name` | string | 표시 이름 |
| `base_url` | string | API base URL |
| `env_key` | string | API 키를 공급할 환경 변수 |
| `env_key_instructions` | string | 키 셋업 가이드 (선택) |
| `requires_openai_auth` | boolean | OpenAI 인증 사용 여부 |
| `wire_api` | `responses` | 프로토콜 (현재 `responses`만 지원, 기본) |
| `request_max_retries` | number | HTTP 재시도 횟수 (기본 4) |
| `stream_max_retries` | number | SSE 스트리밍 인터럽션 재시도 (기본 5) |
| `stream_idle_timeout_ms` | number | SSE 스트림 idle 타임아웃 (ms, 기본 300000) |
| `auth.command` | string | bearer token 명령 (stdout으로 토큰 출력) |
| `auth.refresh_interval_ms` | number | 토큰 사전 새로고침 주기 (ms, 기본 300000) |
| `http_headers` | map | 정적 HTTP 헤더 |
| `env_http_headers` | map | 환경 변수 기반 HTTP 헤더 |

빌트인 프로바이더 ID (`openai`, `ollama`, `lmstudio`)는 예약, 오버라이드 불가.

#### 승인 정책·샌드박스

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `approval_policy` | `untrusted\|on-request\|never\|{granular={...}}` | 명령 실행 전 승인 일시정지 시점. `granular`로 카테고리별 제어 |
| `sandbox_mode` | `read-only\|workspace-write\|danger-full-access` | 명령 실행 시 파일시스템·네트워크 접근 정책 |
| `sandbox_workspace_write.network_access` | boolean | workspace-write 샌드박스 안에서 outbound 네트워크 허용 |
| `sandbox_workspace_write.writable_roots` | array | workspace-write 모드의 추가 쓰기 가능 루트 |
| `sandbox_workspace_write.exclude_slash_tmp` | boolean | `/tmp` 제외 |
| `sandbox_workspace_write.exclude_tmpdir_env_var` | boolean | `$TMPDIR` 제외 |
| `default_permissions` | string | 기본 권한 프로필 이름. 빌트인: `:read-only`, `:workspace`, `:danger-no-sandbox` |
| `approvals_reviewer` | `user\|auto_review` | `on-request`/granular에서 누가 승인 prompt를 검토하는지 |

#### 권한 프로필 (`[permissions.<name>]`)

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `filesystem.<path>` | `"read"\|"write"\|"none"\|table` | 경로·glob·특수 토큰에 직접 권한 부여 |
| `filesystem.":project_roots".<sub>` | `"read"\|"write"\|"none"` | 감지된 프로젝트 루트 기준 스코프 권한 |
| `network.enabled` | boolean | 네트워크 접근 활성화 |
| `network.mode` | `limited\|full` | 서브프로세스 트래픽용 프록시 모드 |
| `network.domains` | map | 도메인 룰 (`allow`/`deny`) |
| `network.allow_local_binding` | boolean | 로컬 bind/listen 허용 |
| `network.proxy_url` | string | 관리 프록시 사용 시 HTTP 프록시 엔드포인트 |
| `network.socks_url` | string | SOCKS5 프록시 엔드포인트 |
| `network.enable_socks5` | boolean | SOCKS5 리스너 노출 |
| `network.unix_sockets` | map | Unix 소켓 룰 |

#### 웹 검색

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `web_search` | `disabled\|cached\|live` | 웹 검색 모드 (기본 `cached`; full access 샌드박스 시 `live`) |
| `tools.web_search` | boolean / object | 컨텍스트 크기, 허용 도메인, 위치 등 객체 형태로 설정 |

#### MCP 서버 (`[mcp_servers.<name>]`)

→ [MCP 페이지](mcp.md)에서 자세히. 주요 키:

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `command` | string | stdio 서버 launcher 명령 |
| `args` | array | 명령 인자 |
| `env` | map | stdio 서버에 forward할 환경 변수 |
| `env_vars` | array | 추가 환경 변수 화이트리스트. `source = "remote"`는 executor 백엔드 원격 stdio용 |
| `cwd` | string | stdio 서버 작업 디렉터리 |
| `url` | string | streamable HTTP 서버 엔드포인트 |
| `bearer_token_env_var` | string | bearer token 환경 변수 |
| `http_headers` | map | 정적 HTTP 헤더 |
| `env_http_headers` | map | 환경 변수 기반 HTTP 헤더 |
| `enabled` | boolean | 삭제 없이 비활성화 |
| `required` | boolean | 시작/재개 시 초기화 실패하면 시작 실패 |
| `enabled_tools` | array | 도구 allow list |
| `disabled_tools` | array | deny list (`enabled_tools` 후 적용) |
| `startup_timeout_sec` | number | 시작 타임아웃 (기본 10초) |
| `tool_timeout_sec` | number | 도구 타임아웃 (기본 60초) |
| `scopes` | array | OAuth 스코프 |
| `oauth_resource` | string | RFC 8707 OAuth resource 파라미터 |
| `experimental_environment` | `local\|remote` | 실험적 배치 |

OAuth 콜백 관련 top-level:
- `mcp_oauth_callback_port`: 고정 포트 (미설정 시 ephemeral)
- `mcp_oauth_callback_url`: redirect URI 오버라이드
- `mcp_oauth_credentials_store`: `auto\|file\|keyring`

#### 에이전트·서브에이전트

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `agents.max_threads` | number | 동시 열린 에이전트 스레드 cap (기본 6) |
| `agents.max_depth` | number | spawn 에이전트 nesting 깊이 (기본 1) |
| `agents.job_max_runtime_seconds` | number | `spawn_agents_on_csv` worker당 기본 타임아웃 (기본 1800) |
| `agents.<role>.config_file` | path | 그 역할의 TOML config 레이어 경로 |
| `agents.<role>.description` | string | Codex가 그 에이전트 타입 선택·spawn 시 보는 가이드 |
| `agents.<role>.nickname_candidates` | array | spawn된 에이전트의 표시 nickname 풀 |

#### Skills

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `skills.config[].path` | path | `SKILL.md`가 있는 스킬 폴더 경로 |
| `skills.config[].enabled` | boolean | 참조된 스킬 활성/비활성 |

#### 메모리 (`[memories]`)

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `generate_memories` | boolean | 새 스레드를 메모리 생성 입력으로 저장 (기본 true) |
| `use_memories` | boolean | 미래 세션에 기존 메모리 주입 (기본 true) |
| `consolidation_model` | string | 글로벌 메모리 통합용 모델 오버라이드 |
| `extract_model` | string | 스레드별 메모리 추출용 모델 오버라이드 |
| `disable_on_external_context` | boolean | MCP/web search/tool search 사용 스레드를 메모리 생성에서 제외 |
| `max_rollout_age_days` | number | 메모리 생성 고려 스레드 최대 나이 (기본 30, 0~90) |
| `max_rollouts_per_startup` | number | 시작 패스당 처리 후보 수 (기본 16, 최대 128) |
| `max_unused_days` | number | 메모리 미사용 최대일 (기본 30, 0~365) |
| `min_rollout_idle_hours` | number | 메모리 생성 고려 전 최소 idle (기본 6, 1~48) |
| `min_rate_limit_remaining_percent` | number | 메모리 생성 시작 전 rate limit 남은 % 최소치 (기본 25) |
| `max_raw_memories_for_consolidation` | number | 글로벌 통합 보유 raw 메모리 최대 (기본 256, 최대 4096) |

#### Hooks

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `hooks` | table | `config.toml` 인라인 라이프사이클 훅. `hooks.json`과 같은 이벤트 스키마 |

→ [Hooks 페이지](hooks.md) 참고.

#### Apps (`[apps.*]`)

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `_default.enabled` | boolean | 모든 앱의 기본 enabled 상태 |
| `_default.destructive_enabled` | boolean | `destructive_hint = true` 도구 기본 허용 |
| `_default.open_world_enabled` | boolean | `open_world_hint = true` 도구 기본 허용 |
| `<app_id>.enabled` | boolean | 특정 앱·connector 활성/비활성 |
| `<app_id>.default_tools_enabled` | boolean | 그 앱 도구 기본 enabled |
| `<app_id>.default_tools_approval_mode` | `auto\|prompt\|approve` | 도구 기본 승인 |
| `<app_id>.tools.<tool_name>.enabled` | boolean | 개별 도구 오버라이드 |
| `<app_id>.tools.<tool_name>.approval_mode` | `auto\|prompt\|approve` | 도구별 승인 |

#### 셸 환경 정책 (`[shell_environment_policy]`)

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `inherit` | `all\|core\|none` | 베이스라인 환경 상속 |
| `include_only` | array | 화이트리스트 패턴 |
| `exclude` | array | 기본값 후 제거할 패턴 |
| `set` | map | 모든 서브프로세스에 주입할 명시적 오버라이드 |
| `ignore_default_excludes` | boolean | KEY/SECRET/TOKEN 변수를 다른 필터 전에 유지 |
| `experimental_use_profile` | boolean | 서브프로세스 spawn 시 사용자 셸 프로필 사용 |

#### TUI

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `tui.theme` | string | 신택스 하이라이트 테마 (kebab-case) |
| `tui.alternate_screen` | `auto\|always\|never` | 대체 스크린 사용 (기본 auto) |
| `tui.animations` | boolean | 터미널 애니메이션 (기본 true) |
| `tui.notifications` | boolean / array | TUI 알림 활성화, 이벤트 타입 제한 가능 |
| `tui.notification_condition` | `unfocused\|always` | 포커스와 관계없이 발화할지 |
| `tui.notification_method` | `auto\|osc9\|bel` | 알림 방식 |
| `tui.show_tooltips` | boolean | 환영 툴팁 (기본 true) |
| `tui.status_line` | array / null | 푸터 상태줄 항목 순서 |
| `tui.terminal_title` | array / null | 터미널 타이틀 항목 순서 (기본 `["spinner", "project"]`) |
| `tui.keymap.<context>.<action>` | string / array | 단축키 바인딩 |

#### 프로젝트 instructions

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `project_doc_fallback_filenames` | array | `AGENTS.md` 누락 시 시도할 추가 파일명 |
| `project_doc_max_bytes` | number | 프로젝트 instructions 빌드 시 `AGENTS.md`에서 읽을 최대 바이트 |
| `project_root_markers` | array | 프로젝트 루트 marker 파일명 |
| `projects.<path>.trust_level` | `"trusted"\|"untrusted"` | 프로젝트·worktree 신뢰 표시 |

#### 프로필 (`[profiles.<name>]`)

지원되는 어떤 설정 키든 프로필 스코프 오버라이드 가능. 자주 쓰는 것:

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `profiles.<name>.*` | various | 모든 키의 프로필 스코프 오버라이드 |
| `profiles.<name>.web_search` | `disabled\|cached\|live` | 프로필별 웹 검색 모드 |
| `profiles.<name>.personality` | `none\|friendly\|pragmatic` | 프로필별 personality |
| `profiles.<name>.service_tier` | `flex\|fast` | 프로필별 service tier |
| `profiles.<name>.windows.sandbox` | `unelevated\|elevated` | Windows 샌드박스 모드 |

`profile` (top-level): 시작 시 적용할 기본 프로필 (`--profile`과 동등).

#### Windows

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `windows.sandbox` | `unelevated\|elevated` | Windows 네이티브 샌드박스 모드 |
| `windows.sandbox_private_desktop` | boolean | private desktop에서 sandboxed child 실행 |
| `windows_wsl_setup_acknowledged` | boolean | Windows 온보딩 ack 추적 |

#### 인증·인증 저장소

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `cli_auth_credentials_store` | `file\|keyring\|auto` | CLI 인증 저장소 |
| `forced_chatgpt_workspace_id` | uuid | ChatGPT 로그인을 특정 workspace로 제한 |
| `forced_login_method` | `chatgpt\|api` | 인증 방식 제한 |
| `chatgpt_base_url` | string | ChatGPT 로그인 플로 base URL |

#### Features (`[features]`)

→ [Config basics](config-basic.md) 참고. 주요 토글: `apps`, `codex_git_commit`, `enable_request_compression`, `fast_mode`, `hooks`, `memories`, `multi_agent`, `personality`, `plugin_hooks`, `prevent_idle_sleep`, `shell_snapshot`, `shell_tool`, `skill_mcp_dependency_install`, `undo`, `unified_exec`, `web_search` (deprecated), `web_search_cached` (deprecated), `web_search_request` (deprecated).

#### OpenTelemetry (`[otel]`)

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `otel.environment` | string | 이벤트에 적용할 environment 태그 (기본 `dev`) |
| `otel.exporter` | `none\|otlp-http\|otlp-grpc` | exporter 선택 |
| `otel.exporter.<x>.endpoint` | string | exporter 엔드포인트 |
| `otel.exporter.<x>.headers` | map | 정적 헤더 |
| `otel.exporter.<x>.protocol` | `binary\|json` | OTLP/HTTP 프로토콜 |
| `otel.exporter.<x>.tls.*` | string | TLS 인증서 경로 |
| `otel.metrics_exporter` | `none\|statsig\|otlp-http\|otlp-grpc` | 메트릭 exporter (기본 `statsig`) |
| `otel.trace_exporter` | `none\|otlp-http\|otlp-grpc` | 트레이스 exporter |
| `otel.log_user_prompt` | boolean | OpenTelemetry 로그에 raw 사용자 prompt export 옵트인 |

#### 기타 자주 쓰는 키

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `personality` | `none\|friendly\|pragmatic` | 기본 커뮤니케이션 스타일 |
| `notify` | array | 알림용 명령. JSON payload 받음 |
| `log_dir` | path | 로그 파일 디렉터리 (기본 `$CODEX_HOME/log`) |
| `sqlite_home` | path | 에이전트 작업 SQLite 상태 DB 디렉터리 |
| `history.persistence` | `save-all\|none` | 트랜스크립트 history.jsonl 저장 |
| `history.max_bytes` | number | 히스토리 파일 크기 cap (오래된 항목 drop) |
| `analytics.enabled` | boolean | 머신·프로필 분석 활성/비활성 |
| `feedback.enabled` | boolean | `/feedback` 활성화 (기본 true) |
| `commit_attribution` | string | `[features].codex_git_commit` 활성 시 커밋 co-author trailer (기본 `Codex <codex@openai.com>`) |
| `review_model` | string | `/review`용 모델 오버라이드 |
| `auto_review.policy` | string | 자동 리뷰용 로컬 마크다운 정책 instructions |
| `file_opener` | `vscode\|vscode-insiders\|windsurf\|cursor\|none` | Citation 열기용 URI 스킴 (기본 `vscode`) |
| `tool_output_token_limit` | number | 개별 도구 출력의 토큰 budget |
| `disable_paste_burst` | boolean | TUI burst-paste 감지 비활성화 |
| `hide_agent_reasoning` | boolean | TUI와 `codex exec`에서 reasoning 이벤트 숨김 |
| `show_raw_agent_reasoning` | boolean | 활성 모델이 emit할 때 raw reasoning 표시 |
| `check_for_update_on_startup` | boolean | 시작 시 업데이트 확인 |
| `allow_login_shell` | boolean | 셸 도구의 login-shell 시멘틱 허용 (기본 true) |
| `background_terminal_max_timeout` | number | 빈 `write_stdin` 폴 최대 폴 윈도우 (ms, 기본 300000) |
| `tools.view_image` | boolean | 로컬 이미지 첨부 도구 활성화 |
| `tool_suggest.discoverables` | array | 추가 발견 가능 connector·플러그인 제안 허용 |

### 스키마와 자동완성

최신 JSON 스키마: https://developers.openai.com/codex/config-schema.json

VS Code/Cursor에서 `config.toml` 자동완성·진단을 원하면 [Even Better TOML](https://marketplace.visualstudio.com/items?itemName=tamasfe.even-better-toml) 설치 후 `config.toml` 상단에:

```toml
#:schema https://developers.openai.com/codex/config-schema.json
```

> 메모: `experimental_instructions_file` → `model_instructions_file`로 이름 변경. 기존 config 갱신.

---

## requirements.toml

`requirements.toml`은 사용자가 오버라이드할 수 없는 보안 민감 설정을 제약하는 admin 강제 파일. 자세한 위치·예시는 [Admin-enforced requirements](../administration/enterprise-managed-configuration.md) 참고.

ChatGPT Business·Enterprise는 클라우드 fetched requirements 적용 가능. 우선순위는 보안 페이지 참고.

`requirements.toml`의 `[features]`는 `config.toml`과 같은 정식 키로 기능 플래그를 pin. 생략된 키는 제약 없음.

### 주요 키

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `allowed_approval_policies` | array | `approval_policy` 허용 값 (`untrusted`, `on-request`, `never`, `granular`) |
| `allowed_approvals_reviewers` | array | `approvals_reviewer` 허용 값 (`user`, `auto_review`) |
| `allowed_sandbox_modes` | array | `sandbox_mode` 허용 값 |
| `allowed_web_search_modes` | array | `web_search` 허용 값. `disabled`는 항상 허용, 빈 리스트 = `disabled`만 |
| `features` | table | 정식 키로 기능 값 pin |
| `features.<key>` | boolean | 특정 기능 키를 활성/비활성 강제 |
| `features.browser_use` | boolean | Browser Use·Browser Agent 비활성화 |
| `features.computer_use` | boolean | Computer Use 비활성화 |
| `features.in_app_browser` | boolean | in-app 브라우저 비활성화 |
| `guardian_policy_config` | string | 자동 리뷰용 managed 마크다운 정책. 로컬 `[auto_review].policy`보다 우선 |
| `hooks` | table | admin 강제 managed 라이프사이클 훅. managed 훅 디렉터리 필요 |
| `hooks.managed_dir` | absolute path | macOS·Linux의 managed 훅 스크립트 디렉터리 |
| `hooks.windows_managed_dir` | absolute path | Windows의 managed 훅 스크립트 디렉터리 |
| `mcp_servers` | table | 활성화 가능한 MCP 서버 allowlist. 이름 + identity 모두 매치되어야 |
| `mcp_servers.<name>.identity.command` | string | stdio 서버: `command` 매치 시 허용 |
| `mcp_servers.<name>.identity.url` | string | streamable HTTP: `url` 매치 시 허용 |
| `permissions.filesystem.deny_read` | array | admin 강제 파일시스템 읽기 거부. 사용자가 약화 불가 |
| `remote_sandbox_config[]` | array | 호스트 특정 샌드박스 요구사항. `hostname_patterns` 매치 시 그 requirements 소스의 `allowed_sandbox_modes` 오버라이드 |
| `rules.prefix_rules[]` | array | admin 강제 명령 룰 (`.rules` 파일과 머지). requirements 룰은 제한적 (`prompt`/`forbidden`만, `allow` 불가) |
| `rules.prefix_rules[].pattern[]` | array | `token` 또는 `any_of`로 prefix 토큰 정의 |
| `rules.prefix_rules[].decision` | `prompt\|forbidden` | 결정 (필수) |
| `rules.prefix_rules[].justification` | string | 비어있지 않은 사유 (선택) |

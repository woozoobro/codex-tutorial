---
원문: https://developers.openai.com/codex/config-sample
동기화일: 2026-05-15
---

# 샘플 설정 (Sample Configuration)

> 복사·수정 가능한 완전한 `config.toml` 예시

원문 페이지에는 Codex가 `config.toml`에서 읽는 거의 모든 키와 기본 동작·권장 값·짧은 메모가 포함된 ~620줄 분량의 샘플이 있다.

이 문서는 그 샘플의 **섹션 구조와 각 섹션 핵심 키**를 한국어로 정리한다. 전체 샘플은 원문에서 복사:
**https://developers.openai.com/codex/config-sample**

설명·가이드:
- [Config basics](config-basic.md)
- [Advanced Config](config-advanced.md)
- [Config Reference](config-reference.md)
- [Sandbox and approvals](../administration/agent-approvals-security.md)
- [Managed configuration](../administration/enterprise-managed-configuration.md)

## 사용법

원문 스니펫을 참조용으로 사용. 필요한 키·섹션만 `~/.codex/config.toml` (또는 프로젝트 스코프 `.codex/config.toml`)에 복사 후 셋업에 맞게 조정.

> 메모: TOML에서 root 키는 테이블 앞에 와야 한다. "unset 기본"인 선택 키는 주석 처리된 채 표시. MCP 서버, 프로필, 모델 프로바이더는 예시 — 제거·수정.

## 섹션 구조

원문 샘플은 다음 큰 섹션으로 나뉜다:

### 1. Core Model Selection (코어 모델 선택)
주요 키: `model`, `model_provider`, `personality`, `review_model`, `oss_provider`, `service_tier`, `model_context_window`, `model_auto_compact_token_limit`, `tool_output_token_limit`, `model_catalog_json`, `background_terminal_max_timeout`, `log_dir`, `sqlite_home`

```toml
model = "gpt-5.5"
model_provider = "openai"
# personality = "pragmatic"
# service_tier = "flex"
```

### 2. Reasoning & Verbosity (Responses API 모델)
`model_reasoning_effort` (`minimal\|low\|medium\|high\|xhigh`), `plan_mode_reasoning_effort`, `model_reasoning_summary` (`auto\|concise\|detailed\|none`), `model_verbosity` (`low\|medium\|high`), `model_supports_reasoning_summaries`

### 3. Instruction Overrides
`developer_instructions`, `compact_prompt`, `commit_attribution`, `model_instructions_file`, `experimental_compact_prompt_file`

### 4. Notifications
`notify` (외부 notifier 프로그램 argv 배열)

### 5. Approval & Sandbox

```toml
# 승인 정책: untrusted | on-request | never | { granular = { ... } }
approval_policy = "on-request"
approvals_reviewer = "user"  # 또는 "auto_review"

# Granular 예:
# approval_policy = { granular = {
#   sandbox_approval = true,
#   rules = true,
#   mcp_elicitations = true,
#   request_permissions = false,
#   skill_approval = false
# } }

allow_login_shell = true   # false면 login shell 강제 거부

sandbox_mode = "workspace-write"   # read-only | workspace-write | danger-full-access

default_permissions = ":workspace"  # 빌트인: :read-only | :workspace | :danger-no-sandbox
```

커스텀 권한 프로필 예:
```toml
[permissions.workspace.filesystem]
":project_roots" = { "." = "write", "**/*.env" = "none" }
glob_scan_max_depth = 3

[permissions.workspace.network]
enabled = true
mode = "limited"

[permissions.workspace.network.domains]
"api.openai.com" = "allow"
```

### 6. Authentication & Login
`cli_auth_credentials_store` (`file\|keyring\|auto`), `chatgpt_base_url`, `openai_base_url`, `forced_login_method`, `forced_chatgpt_workspace_id`

### 7. Project Documentation Controls
`project_doc_max_bytes`, `project_doc_fallback_filenames`, `project_root_markers`

### 8. History & File Opener
`file_opener` (`vscode\|vscode-insiders\|windsurf\|cursor\|none`)

### 9. UI, Notifications, and Misc (top-level)
`hide_agent_reasoning`, `show_raw_agent_reasoning`, `disable_paste_burst`, `check_for_update_on_startup`

### 10. Web Search

```toml
web_search = "cached"  # cached | live | disabled
# `--yolo` 또는 full access 샌드박스 설정 사용 시 자동 live
```

### 11. Agents (멀티 에이전트 역할·한도)

```toml
[agents]
max_threads = 6
max_depth = 1
job_max_runtime_seconds = 1800
```

### 12. Skills (스킬별 오버라이드)

```toml
[[skills.config]]
path = "/path/to/skill/SKILL.md"
enabled = false
```

### 13. Sandbox settings (테이블)

```toml
[sandbox_workspace_write]
exclude_tmpdir_env_var = false
exclude_slash_tmp = false
writable_roots = ["/Users/YOU/.pyenv/shims"]
network_access = false
```

### 14. Shell Environment Policy

```toml
[shell_environment_policy]
inherit = "none"            # all | core | none
set = { PATH = "/usr/bin", MY_FLAG = "1" }
ignore_default_excludes = false
exclude = ["AWS_*", "AZURE_*"]
include_only = ["PATH", "HOME"]
# experimental_use_profile = false
```

### 15. Managed network proxy
`permissions.<name>.network.*` (allow_local_binding, allow_upstream_proxy, dangerously_allow_all_unix_sockets, dangerously_allow_non_loopback_proxy, enable_socks5, enable_socks5_udp, mode, proxy_url, socks_url, domains, unix_sockets)

### 16. History (테이블)

```toml
[history]
persistence = "save-all"    # save-all | none
max_bytes = 104857600       # 100 MiB
```

### 17. UI, Notifications, Misc (테이블)

```toml
[tui]
animations = true
show_tooltips = true
notifications = true
notification_method = "auto"      # auto | osc9 | bel
notification_condition = "unfocused"  # unfocused | always
alternate_screen = "auto"          # auto | always | never (Zellij에서는 auto가 스크롤백 보존)
status_line = ["model", "context", "git-branch", "tokens"]
terminal_title = ["spinner", "project"]
theme = "tokyo-night-dark"

[tui.keymap.global]
open_transcript = "ctrl-t"
```

`status_line` 항목 ID: app-name, project, spinner, status, thread, git-branch, model, context-stats, rate-limits, token-counters, session-id, current-directory/project-root, codex-version. 커스텀 `.tmTheme`은 `$CODEX_HOME/themes` 아래 추가.

### 18. Centralized Feature Flags (권장)

```toml
[features]
hooks = true            # 라이프사이클 훅
plugin_hooks = false    # 플러그인 번들 훅 opt-in
fast_mode = true
shell_snapshot = true
shell_tool = true
unified_exec = true     # Windows 제외 기본 true
multi_agent = true
personality = true
memories = false
undo = false
codex_git_commit = false
apps = false
prevent_idle_sleep = false
# web_search = (deprecated)
```

### 19. Memories (테이블)

```toml
[memories]
generate_memories = true
use_memories = true
# consolidation_model = "gpt-5.5"
# extract_model = "gpt-5.4-mini"
disable_on_external_context = false
max_rollout_age_days = 30
max_rollouts_per_startup = 16
max_unused_days = 30
min_rollout_idle_hours = 6
min_rate_limit_remaining_percent = 25
max_raw_memories_for_consolidation = 256
```

### 20. Hooks
인라인 `[hooks]` 또는 sibling `hooks.json`. → [Hooks](hooks.md) 참고.

### 21. MCP Servers
빌트인 예 + 커스텀. → [MCP](mcp.md) 참고.

### 22. Apps / Connectors

```toml
[apps._default]
enabled = true
destructive_enabled = false
open_world_enabled = false

[apps.<app_id>]
enabled = true
default_tools_enabled = true
default_tools_approval_mode = "prompt"   # auto | prompt | approve

[apps.<app_id>.tools.<tool_name>]
enabled = true
approval_mode = "auto"
```

### 23. Profiles (명명된 프리셋)

```toml
[profiles.deep-review]
model = "gpt-5-pro"
model_reasoning_effort = "high"
approval_policy = "never"

[profiles.lightweight]
model = "gpt-4.1"
approval_policy = "untrusted"
```

기본 프로필: top-level에 `profile = "deep-review"`.

### 24. Projects (신뢰 레벨)

```toml
[projects."/path/to/repo"]
trust_level = "trusted"   # trusted | untrusted
```

### 25. Tools

```toml
[tools]
view_image = true
web_search = { context_size = "medium", allowed_domains = ["docs.example.com"] }
```

### 26. OpenTelemetry (OTEL) — 기본 비활성

```toml
[otel]
environment = "dev"
exporter = "none"          # none | otlp-http | otlp-grpc
trace_exporter = "none"
metrics_exporter = "statsig"   # none | statsig | otlp-http | otlp-grpc
log_user_prompt = false

# OTLP HTTP exporter 예:
# exporter = { otlp-http = {
#   endpoint = "https://otel.example.com/v1/logs",
#   protocol = "binary",
#   headers = { "x-otlp-api-key" = "${OTLP_TOKEN}" }
# }}
```

### 27. Windows

```toml
[windows]
sandbox = "elevated"            # unelevated | elevated
sandbox_private_desktop = true  # 호환성 위해 false 가능
```

### 28. Analytics & Feedback

```toml
[analytics]
enabled = true   # 익명 사용량·헬스 데이터 (PII 없음)

[feedback]
enabled = true   # /feedback 활성화
```

### 29. Notice 추적 (사용자 ack)

`notice.hide_full_access_warning`, `notice.hide_world_writable_warning`, `notice.hide_rate_limit_model_nudge`, `notice.hide_gpt5_1_migration_prompt`, `notice.hide_gpt-5.1-codex-max_migration_prompt`, `notice.model_migrations` (map)

### 30. 기타 영역

- `tool_suggest.discoverables`, `tool_suggest.disabled_tools`
- `mcp_oauth_callback_port`, `mcp_oauth_callback_url`, `mcp_oauth_credentials_store`
- `instructions` (예약, 미래 사용)
- `experimental_use_unified_exec_tool` (legacy → `[features].unified_exec` 우선)

## 전체 샘플

원문에서 복사: https://developers.openai.com/codex/config-sample

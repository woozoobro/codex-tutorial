---
원문: https://developers.openai.com/codex/config-basic
동기화일: 2026-05-15
---

# 설정 기본 (Config basics)

> 로컬 Codex 클라이언트 설정의 기초

Codex는 여러 위치에서 설정을 읽는다. 개인 기본값은 `~/.codex/config.toml`에, 프로젝트 오버라이드는 `.codex/config.toml`로 추가. 보안을 위해 프로젝트 `.codex/` 레이어는 프로젝트가 신뢰됐을 때만 로드.

## Codex 설정 파일

사용자 레벨 설정은 `~/.codex/config.toml`. 프로젝트나 서브폴더로 스코프하려면 리포에 `.codex/config.toml` 추가.

IDE 확장에서 열기: 우측 상단 gear 아이콘 → **Codex Settings → Open config.toml**.

CLI와 IDE 확장은 같은 설정 레이어를 공유. 다음 용도:
- 기본 모델·프로바이더 설정
- [승인 정책·샌드박스 설정](../administration/agent-approvals-security.md)
- [MCP 서버](mcp.md) 설정

## 설정 우선순위

가장 높은 우선순위부터:

1. CLI 플래그와 `--config` 오버라이드
2. [프로필](config-advanced.md) 값 (`--profile <name>`)
3. 프로젝트 config 파일: `.codex/config.toml`, 프로젝트 루트부터 현재 작업 디렉터리까지 (가까운 게 우승, 신뢰 프로젝트만)
4. 사용자 config: `~/.codex/config.toml`
5. 시스템 config (있으면): Unix는 `/etc/codex/config.toml`
6. 빌트인 기본값

이 우선순위로 공유 기본값은 top level에, 프로필은 차이값에만 집중.

프로젝트를 untrusted로 표시하면 Codex는 프로젝트 스코프 `.codex/` 레이어 (프로젝트 로컬 config, hooks, rules 포함) 건너뜀. 사용자·시스템 config (사용자/글로벌 hooks·rules 포함)는 그대로 로드.

`-c`/`--config` 일회성 오버라이드(TOML 인용 룰 포함)는 [Advanced Config](config-advanced.md) 참고.

관리 머신에서 조직이 `requirements.toml`로 제약을 강제할 수 있음 (예: `approval_policy = "never"` 또는 `sandbox_mode = "danger-full-access"` 금지). → [Managed configuration](../administration/enterprise-managed-configuration.md)

## 자주 쓰는 옵션

### 기본 모델

```toml
model = "gpt-5.5"
```

### 승인 prompt

생성 명령 실행 전 일시정지 시점 제어.

```toml
approval_policy = "on-request"
```

`untrusted`/`on-request`/`never` 차이는 [Run without approval prompts](../administration/agent-approvals-security.md)와 [Common sandbox and approval combinations](../administration/agent-approvals-security.md) 참고.

### 샌드박스 레벨

명령 실행 시 파일시스템·네트워크 접근량 조정.

```toml
sandbox_mode = "workspace-write"
```

모드별 동작 (`.git`/`.codex` 보호 경로, 네트워크 기본값 포함)은 [Sandbox and approvals](../administration/agent-approvals-security.md) 참고.

### 권한 프로필

세션 간 재사용할 한 개의 파일시스템·네트워크 정책:

```toml
default_permissions = ":workspace"
```

빌트인 프로필: `:read-only`, `:workspace`, `:danger-no-sandbox`. 커스텀 룰은 `[permissions.<name>]` 테이블 정의 후 `default_permissions`에 그 이름.

### Windows 샌드박스 모드

Windows 네이티브 실행 시 `windows` 테이블에 `elevated` 권장:

```toml
[windows]
sandbox = "elevated"      # 권장
# sandbox = "unelevated"  # 관리자 권한·셋업 불가 시 fallback
```

### 웹 검색 모드

Codex는 로컬 작업에서 웹 검색을 기본 활성화하고, 웹 검색 캐시(OpenAI가 유지하는 prebuilt index)에서 결과 제공. 임의 라이브 콘텐츠 prompt injection 노출 감소 (단, 결과는 untrusted로 간주). `--yolo` 또는 [full access 샌드박스](../administration/agent-approvals-security.md) 사용 시 라이브 결과 기본.

```toml
web_search = "cached"      # 기본; 캐시에서 제공
# web_search = "live"      # 최신 데이터 (--search와 동일)
# web_search = "disabled"
```

### Reasoning effort

지원 모델에서 추론 강도 조정.

```toml
model_reasoning_effort = "high"
```

### 커뮤니케이션 스타일

```toml
personality = "friendly"   # 또는 "pragmatic", "none"
```

활성 세션에서 `/personality`로, app-server API 사용 시 스레드/턴 단위로 오버라이드 가능.

### TUI 키맵

`tui.keymap` 아래에 터미널 단축키 커스터마이징. 컨텍스트 바인딩이 `tui.keymap.global` 오버라이드, 빈 리스트는 액션 unbind.

```toml
[tui.keymap.global]
open_transcript = "ctrl-t"

[tui.keymap.composer]
submit = ["enter", "ctrl-m"]
```

### 명령 환경

Codex가 spawn한 명령에 forward할 환경 변수 제어.

```toml
[shell_environment_policy]
include_only = ["PATH", "HOME"]
```

### 로그 디렉터리

`codex-tui.log` 같은 로컬 로그 파일 위치 오버라이드.

```toml
log_dir = "/absolute/path/to/codex-logs"
```

일회성:
```bash
codex -c log_dir=./.codex-log
```

## 기능 플래그

`config.toml`의 `[features]` 테이블로 선택·실험 능력 토글.

```toml
[features]
shell_snapshot = true   # 반복 명령 가속
```

### 지원 기능

| 키 | 기본 | Maturity | 설명 |
| --- | --- | --- | --- |
| `apps` | false | Experimental | ChatGPT Apps/connectors 지원 |
| `codex_git_commit` | false | Experimental | Codex 생성 git commit + commit attribution trailer |
| `hooks` | true | Stable | `hooks.json` 또는 인라인 `[hooks]`의 라이프사이클 훅. → [Hooks](hooks.md) |
| `plugin_hooks` | false | Under development | 플러그인에 번들된 라이프사이클 훅 opt-in |
| `fast_mode` | true | Stable | Fast mode 선택 + `service_tier = "fast"` 경로 |
| `memories` | false | Stable | [Memories](../concepts/memories.md) 활성화 |
| `multi_agent` | true | Stable | 서브에이전트 협업 도구 |
| `personality` | true | Stable | personality 선택 컨트롤 |
| `shell_snapshot` | true | Stable | 셸 환경 스냅샷으로 반복 명령 가속 |
| `shell_tool` | true | Stable | 기본 `shell` 도구 |
| `unified_exec` | true (Windows 제외) | Stable | 통합 PTY 백엔드 exec 도구 |
| `undo` | false | Stable | 턴별 git ghost 스냅샷으로 undo |
| `web_search` | true | Deprecated | 레거시 토글 — top-level `web_search` 우선 |
| `web_search_cached` | false | Deprecated | 미설정 시 `web_search = "cached"`로 매핑 |
| `web_search_request` | false | Deprecated | 미설정 시 `web_search = "live"`로 매핑 |

→ [Feature Maturity](../resources/feature-maturity.md) 라벨 해석법

기능 키 생략 시 기본값 유지.

라이프사이클 훅 설정은 [Hooks](hooks.md) 참고.

### 기능 활성화

- `config.toml`에 `[features]` 아래 `feature_name = true`
- CLI: `codex --enable feature_name`
- 여러 개: `codex --enable feature_a --enable feature_b`
- 비활성화: `config.toml`에서 `false`로

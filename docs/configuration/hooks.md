---
원문: https://developers.openai.com/codex/hooks
동기화일: 2026-05-15
---

# 훅 (Hooks)

> Codex 라이프사이클 동안 결정적 스크립트 실행

훅은 Codex 확장 프레임워크. 자체 스크립트를 agentic loop에 주입할 수 있게 하여 다음 같은 기능을 가능하게 한다:

- 대화를 커스텀 로깅·분석 엔진으로 전송
- 팀의 prompt 스캔하여 실수로 API 키 붙여넣는 것 차단
- 대화 요약하여 영구 메모리 자동 생성
- 대화 턴 종료 시 커스텀 검증 실행으로 표준 강제
- 특정 디렉터리에 있을 때 prompt 커스터마이징

훅은 기본 활성화. `config.toml`에서 끄려면:

```toml
[features]
hooks = false
```

`hooks`가 정식 키. `codex_hooks`는 deprecated alias로 동작.

관리자는 `requirements.toml`에서 `[features].hooks = false`로 동일하게 강제 가능.

런타임 동작:
- 여러 파일에서 매치된 훅 모두 실행
- 같은 이벤트의 매치된 명령 훅 여러 개는 동시 launch — 한 훅이 다른 매치된 훅 시작을 막을 수 없음
- 비-managed 명령 훅은 실행 전 검토·신뢰 필요
- `PreToolUse`, `PermissionRequest`, `PostToolUse`, `UserPromptSubmit`, `Stop`은 턴 스코프

## Codex가 훅을 찾는 위치

활성 config 레이어 옆에서 다음 형식으로 발견:
- `hooks.json`
- `config.toml` 안의 인라인 `[hooks]` 테이블

설치된 플러그인은 plugin manifest나 기본 `hooks/hooks.json`으로 라이프사이클 config를 번들 가능. → [Build plugins](plugins-build.md)

실용적 4대 위치:
- `~/.codex/hooks.json`
- `~/.codex/config.toml`
- `<project>/.codex/hooks.json`
- `<project>/.codex/config.toml`

훅 소스가 둘 이상이면 모든 매치 훅 로드. 더 높은 우선순위 config 레이어가 낮은 레이어의 훅을 대체하지 않음. 한 레이어에 `hooks.json`과 인라인 `[hooks]` 둘 다 있으면 머지 + 시작 시 경고. **레이어당 한 표현 권장**.

이번 릴리스에서 플러그인 훅 기본 OFF. `[features].plugin_hooks = true`면 활성 플러그인의 번들 훅 로드.

프로젝트 로컬 훅은 프로젝트 `.codex/` 레이어가 신뢰됐을 때만 로드. Untrusted 프로젝트에서도 사용자·시스템 훅은 자체 활성 config 레이어에서 그대로 로드.

## 훅 검토·관리

Codex는 어떤 훅이 실행될지 결정 전 설정된 훅 나열. CLI에서 `/hooks`로 훅 소스 검사, 새/변경된 훅 검토, 훅 신뢰, 개별 비-managed 훅 비활성. 시작 시 훅 검토가 필요하면 Codex가 `/hooks` 열라고 경고.

system, MDM, cloud, `requirements.toml` 출처의 managed 훅은 managed로 표시 + 정책으로 신뢰됨 + 사용자 훅 브라우저에서 비활성 불가.

## Config 형태

훅은 3 레벨로 구성:
- **훅 이벤트** (`PreToolUse`, `PostToolUse`, `Stop` 등)
- **matcher 그룹** — 그 이벤트가 언제 매치되는지 결정
- **하나 이상의 훅 핸들러** — matcher 그룹이 매치되면 실행

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.codex/hooks/session_start.py",
            "statusMessage": "Loading session notes"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/bin/python3 \"$(git rev-parse --show-toplevel)/.codex/hooks/pre_tool_use_policy.py\"",
            "statusMessage": "Checking Bash command"
          }
        ]
      }
    ],
    "PermissionRequest": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/bin/python3 \"$(git rev-parse --show-toplevel)/.codex/hooks/permission_request.py\"",
            "statusMessage": "Checking approval request"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/bin/python3 \"$(git rev-parse --show-toplevel)/.codex/hooks/post_tool_use_review.py\"",
            "statusMessage": "Reviewing Bash output"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/usr/bin/python3 \"$(git rev-parse --show-toplevel)/.codex/hooks/user_prompt_submit_data_flywheel.py\""
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/usr/bin/python3 \"$(git rev-parse --show-toplevel)/.codex/hooks/stop_continue.py\"",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

주의:
- `timeout`은 초
- 생략 시 Codex는 `600`초 사용
- `statusMessage`는 선택
- `async`는 파싱되지만 비동기 명령 훅 미지원 → `async: true` 핸들러는 건너뜀
- 현재 `type: "command"` 핸들러만 실행. `prompt`, `agent` 핸들러는 파싱되지만 건너뜀
- 명령은 세션 `cwd`에서 실행
- 리포 로컬 훅은 `.codex/hooks/...` 같은 상대 경로 대신 git root에서 resolve 권장. Codex가 서브디렉터리에서 시작될 수 있어 git-root 기반 경로가 안정.

`config.toml`의 동등한 인라인 TOML:

```toml
[[hooks.PreToolUse]]
matcher = "^Bash$"

[[hooks.PreToolUse.hooks]]
type = "command"
command = '/usr/bin/python3 "$(git rev-parse --show-toplevel)/.codex/hooks/pre_tool_use_policy.py"'
timeout = 30
statusMessage = "Checking Bash command"

[[hooks.PostToolUse]]
matcher = "^Bash$"

[[hooks.PostToolUse.hooks]]
type = "command"
command = '/usr/bin/python3 "$(git rev-parse --show-toplevel)/.codex/hooks/post_tool_use_review.py"'
timeout = 30
statusMessage = "Reviewing Bash output"
```

## requirements.toml의 Managed 훅

Enterprise 관리 requirements는 `[hooks]` 아래 인라인 훅 정의 가능. 관리자가 훅 설정을 강제하면서 실제 스크립트는 MDM 등으로 전달할 때 유용. 사용자가 로컬에서 훅을 끈 경우에도 managed 훅을 강제하려면 `requirements.toml`에 `[features].hooks = true`를 `[hooks]`와 함께 pin.

```toml
[features]
hooks = true

[hooks]
managed_dir = "/enterprise/hooks"
windows_managed_dir = 'C:\enterprise\hooks'

[[hooks.PreToolUse]]
matcher = "^Bash$"

[[hooks.PreToolUse.hooks]]
type = "command"
command = "python3 /enterprise/hooks/pre_tool_use_policy.py"
timeout = 30
statusMessage = "Checking managed Bash command"
```

Managed 훅 주의:
- `managed_dir`는 macOS·Linux용
- `windows_managed_dir`는 Windows용
- Codex는 `managed_dir`의 스크립트를 배포하지 않음 → 엔터프라이즈 도구로 별도 설치·갱신
- Managed 훅 명령은 설정된 managed 디렉터리 아래의 절대 스크립트 경로 사용 권장

## 플러그인 번들 훅

이번 릴리스에서 플러그인 번들 훅은 opt-in. `[features].plugin_hooks = true`이고 플러그인 활성화 시, Codex가 그 플러그인의 라이프사이클 훅을 사용자·프로젝트·managed 훅과 함께 로드.

```toml
[features]
plugin_hooks = true
```

기본적으로 Codex는 플러그인 root 안의 `hooks/hooks.json` 찾음. plugin manifest의 `.codex-plugin/plugin.json`에 `hooks` 항목으로 오버라이드 가능. manifest 항목은 `./` 접두사 경로, `./` 경로 배열, 인라인 hooks 객체, 또는 인라인 hooks 객체 배열.

```json
{
  "name": "repo-policy",
  "hooks": "./hooks/hooks.json"
}
```

manifest 훅 경로는 플러그인 root 기준 resolve, 그 root 안에 머물러야 함. manifest가 `hooks` 정의 시 기본 `hooks/hooks.json` 대신 manifest 항목 사용.

플러그인 훅 명령이 받는 환경 변수:
- `PLUGIN_ROOT` — Codex 특화 확장. 설치된 플러그인 root.
- `PLUGIN_DATA` — Codex 특화 확장. 플러그인의 쓰기 가능 데이터 디렉터리.
- 호환성을 위해 `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA`도 설정.

플러그인 훅은 다른 훅과 같은 이벤트 스키마. 비-managed 훅이라 실행 전 신뢰 검토 필요.

## Matcher 패턴

`matcher` 필드는 정규식 문자열로 훅 발화 시점 필터. `"*"`, `""`, 또는 `matcher` 전체 생략 시 지원 이벤트 모든 발생에 매치.

| 이벤트 | matcher 필터 대상 | 메모 |
| --- | --- | --- |
| `PermissionRequest` | tool name | `Bash`, `apply_patch`*, MCP 도구 이름 지원 |
| `PostToolUse` | tool name | `Bash`, `apply_patch`*, MCP 도구 이름 지원 |
| `PreToolUse` | tool name | `Bash`, `apply_patch`*, MCP 도구 이름 지원 |
| `SessionStart` | start source | 현재 런타임 값: `startup`, `resume`, `clear` |
| `UserPromptSubmit` | 미지원 | 설정된 `matcher` 무시 |
| `Stop` | 미지원 | 설정된 `matcher` 무시 |

*`apply_patch`는 `Edit`/`Write`도 사용 가능.

예시:
- `Bash`
- `^apply_patch$`
- `Edit|Write`
- `mcp__filesystem__read_file`
- `mcp__filesystem__.*`
- `startup|resume|clear`

## 공통 입력 필드

모든 명령 훅은 `stdin`으로 JSON 객체 1개를 받음.

| 필드 | 타입 | 의미 |
| --- | --- | --- |
| `session_id` | `string` | 현재 세션·스레드 id |
| `transcript_path` | `string \| null` | 세션 트랜스크립트 파일 경로 (있으면) |
| `cwd` | `string` | 세션 작업 디렉터리 |
| `hook_event_name` | `string` | 현재 훅 이벤트 이름 |
| `model` | `string` | Codex 특화 확장. 활성 모델 slug |

턴 스코프 훅은 자체 이벤트 표에서 `turn_id`를 Codex 특화 확장으로 나열.

`SessionStart`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `UserPromptSubmit`, `Stop`은 `permission_mode`도 포함 (`default`, `acceptEdits`, `plan`, `dontAsk`, `bypassPermissions`).

`transcript_path`는 편의용 — transcript 형식은 안정 인터페이스가 아니며 변경될 수 있음.

전체 wire format은 [Schemas](#schemas) 참조.

## 공통 출력 필드

`SessionStart`, `UserPromptSubmit`, `Stop`은 다음 공유 JSON 필드 지원:

```json
{
  "continue": true,
  "stopReason": "optional",
  "systemMessage": "optional",
  "suppressOutput": false
}
```

| 필드 | 효과 |
| --- | --- |
| `continue` | `false`면 그 훅 실행을 stopped로 표시 |
| `stopReason` | 중지 사유로 기록 |
| `systemMessage` | UI나 이벤트 스트림에 경고로 표시 |
| `suppressOutput` | 파싱되지만 미구현 |

출력 없이 exit `0` → 성공 + Codex 계속.

`PreToolUse`와 `PermissionRequest`는 `systemMessage` 지원, `continue`/`stopReason`/`suppressOutput`는 미지원.

`PostToolUse`는 `systemMessage`, `continue: false`, `stopReason` 지원. `suppressOutput`는 파싱되지만 미지원.

## 이벤트별 상세

### SessionStart

`matcher`는 `source`에 적용.

추가 필드:
| 필드 | 타입 | 의미 |
| --- | --- | --- |
| `source` | `string` | 세션 시작 방식: `startup`, `resume`, `clear` |

`stdout`의 plain text → 추가 developer context.

`stdout`의 JSON은 공통 출력 + 다음 형태 지원:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Load the workspace conventions before editing."
  }
}
```

`additionalContext` 텍스트는 추가 developer context로 추가.

### PreToolUse

Bash, `apply_patch` 통한 파일 편집, MCP 도구 호출 가로채기 가능. 완전한 enforcement boundary가 아닌 guardrail — Codex가 다른 지원 도구 경로로 등가 작업 수행 가능.

모든 셸 호출 가로채기 미지원, 단순한 것만. 새 `unified_exec`는 더 풍부한 stdin/stdout 스트리밍 지원하지만 가로채기 불완전. `WebSearch` 등 비-셸·비-MCP 도구 호출도 미가로채기.

`matcher`는 `tool_name`과 matcher alias에 적용. `apply_patch` 통한 파일 편집은 `apply_patch`, `Edit`, `Write` 모두 사용 가능. 훅 입력은 여전히 `tool_name: "apply_patch"` 보고.

추가 필드:
| 필드 | 타입 | 의미 |
| --- | --- | --- |
| `turn_id` | `string` | Codex 특화. 활성 Codex 턴 id |
| `tool_name` | `string` | 정식 훅 도구 이름 (`Bash`, `apply_patch`, `mcp__fs__read` 같은 MCP 이름) |
| `tool_use_id` | `string` | 이 호출의 tool-call id |
| `tool_input` | `JSON value` | 도구별 입력. `Bash`/`apply_patch`는 `tool_input.command` 사용, MCP는 모든 args 전송 |

`stdout` plain text 무시.

`stdout` JSON은 `systemMessage` 사용 가능. 지원 도구 호출 거부:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Destructive command blocked by hook."
  }
}
```

이전 형태도 수용:

```json
{
  "decision": "block",
  "reason": "Destructive command blocked by hook."
}
```

exit code `2` + stderr에 차단 사유 작성도 가능.

차단 없이 모델 가시 컨텍스트 추가 → `hookSpecificOutput.additionalContext`:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "additionalContext": "The pending command touches generated files."
  }
}
```

`permissionDecision: "ask"`, 레거시 `decision: "approve"`, `updatedInput`, `continue: false`, `stopReason`, `suppressOutput`는 파싱되지만 미지원 → fail open.

### PermissionRequest

Codex가 승인 요청 (셸 escalation, managed-network 승인 등) 직전 실행. 요청 허용/거부, 또는 결정 보류하고 일반 승인 prompt 진행. 승인 불필요 명령에는 실행 안 됨.

`matcher`는 `tool_name`과 matcher alias에 적용. 정식 값: `Bash`, `apply_patch`, `mcp__server__tool` 같은 MCP 도구 이름. `apply_patch`는 `Edit`/`Write`도 매치.

추가 필드:
| 필드 | 타입 | 의미 |
| --- | --- | --- |
| `turn_id` | `string` | Codex 특화. 활성 Codex 턴 id |
| `tool_name` | `string` | 정식 훅 도구 이름 |
| `tool_input` | `JSON value` | 도구별 입력 |

`stdout` plain text 무시.

승인:
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": { "behavior": "allow" }
  }
}
```

거부:
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "deny",
      "message": "Blocked by repository policy."
    }
  }
}
```

여러 매치 훅이 결정을 반환하면 `deny`가 우승. 아니면 `allow`가 승인 prompt 표시 없이 요청 진행. 어떤 매치 훅도 결정 안 하면 일반 승인 플로.

`updatedInput`, `updatedPermissions`, `interrupt`는 미래 동작용 → fail closed.

### PostToolUse

지원 도구가 출력을 낸 후 실행 (Bash, `apply_patch`, MCP). Bash는 비-zero exit 명령 후에도 실행. 이미 실행된 도구의 부수 효과 되돌릴 수 없음.

추가 필드:
| 필드 | 타입 | 의미 |
| --- | --- | --- |
| `turn_id` | `string` | Codex 특화. 활성 턴 id |
| `tool_name` | `string` | 정식 훅 도구 이름 |
| `tool_use_id` | `string` | tool-call id |
| `tool_input` | `JSON value` | 도구별 입력 |
| `tool_response` | `JSON value` | 도구별 출력. MCP는 MCP 호출 결과. |

`stdout` plain text 무시.

`stdout` JSON은 `systemMessage` + 다음 형태:

```json
{
  "decision": "block",
  "reason": "The Bash output needs review before continuing.",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "The command updated generated files."
  }
}
```

이 이벤트의 `decision: "block"`은 완료된 Bash 명령 되돌리지 않음. Codex는 피드백 기록 + 도구 결과를 그 피드백으로 교체 + 훅 제공 메시지로 모델 계속.

exit code `2` + stderr에 피드백 사유도 가능.

이미 실행된 명령의 원본 도구 결과 일반 처리 중지 → `continue: false`. Codex가 도구 결과를 피드백·중지 텍스트로 교체 + 거기서 계속.

`updatedMCPToolOutput`, `suppressOutput`는 파싱되지만 미지원 → fail open.

### UserPromptSubmit

이 이벤트는 `matcher` 미사용.

추가 필드:
| 필드 | 타입 | 의미 |
| --- | --- | --- |
| `turn_id` | `string` | Codex 특화. 활성 턴 id |
| `prompt` | `string` | 전송 직전 사용자 prompt |

`stdout` plain text → 추가 developer context.

`stdout` JSON은 공통 출력 + 다음 형태:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Ask for a clearer reproduction before editing files."
  }
}
```

prompt 차단:
```json
{
  "decision": "block",
  "reason": "Ask for confirmation before doing that."
}
```

exit code `2` + stderr 사유도 가능.

### Stop

이 이벤트는 `matcher` 미사용.

추가 필드:
| 필드 | 타입 | 의미 |
| --- | --- | --- |
| `turn_id` | `string` | Codex 특화. 활성 턴 id |
| `stop_hook_active` | `boolean` | 이 턴이 이미 `Stop`으로 계속됐는지 |
| `last_assistant_message` | `string \| null` | 가능하면 최신 어시스턴트 메시지 텍스트 |

`Stop`은 exit `0` 시 `stdout`에 JSON 기대. plain text 출력은 이 이벤트에 invalid.

`stdout` JSON은 공통 출력 지원. Codex 계속 진행:

```json
{
  "decision": "block",
  "reason": "Run one more pass over the failing tests."
}
```

exit code `2` + stderr 사유도 가능.

이 이벤트의 `decision: "block"`은 턴을 거부하지 않음. Codex에 계속하라고 알리고 → `reason`을 prompt 텍스트로 사용한 새 continuation prompt 자동 생성 → 새 사용자 prompt처럼 동작.

매치된 `Stop` 훅이 `continue: false` 반환하면 다른 매치된 `Stop` 훅의 continuation 결정보다 우선.

## Schemas

링크된 `main` 브랜치 스키마는 현재 릴리스에 없는 훅 필드를 포함할 수 있음. 이 페이지를 릴리스 동작 레퍼런스로.

정확한 현재 wire format: [Codex GitHub repo의 generated schema](https://github.com/openai/codex/tree/main/codex-rs/hooks/schema/generated)

---
원문: https://developers.openai.com/codex/subagents
동기화일: 2026-05-15
---

# 서브에이전트 (Subagents)

> Codex에서 서브에이전트와 커스텀 에이전트 사용

Codex는 특화 에이전트를 병렬 spawn하고 결과를 한 응답으로 모으는 서브에이전트 워크플로 실행 가능. 코드베이스 탐색이나 멀티스텝 기능 계획 구현 같은 고도로 병렬화 가능한 복잡 작업에 특히 유용.

서브에이전트 워크플로로 작업별로 다른 모델 설정·지시를 가진 자체 커스텀 에이전트도 정의 가능.

서브에이전트 워크플로의 컨셉과 트레이드오프 (컨텍스트 오염, 컨텍스트 부패, 모델 선택 가이드)는 [Subagent concepts](../concepts/subagents.md) 참고.

## 가용성

현재 Codex 릴리스는 서브에이전트 워크플로 기본 활성화.

서브에이전트 활동은 현재 Codex 앱과 CLI에서 표시. IDE 확장 가시성은 곧 지원.

Codex는 명시적으로 요청해야만 서브에이전트 spawn. 각 서브에이전트가 자체 모델·도구 작업을 하므로 단일 에이전트 대비 토큰 소비량 ↑.

## 일반 워크플로

Codex가 에이전트 간 오케스트레이션 처리: 새 서브에이전트 spawn, 후속 지시 라우팅, 결과 대기, 에이전트 스레드 종료.

여러 에이전트 실행 시 모든 요청 결과 가용해질 때까지 대기 → 통합 응답 반환.

직접 시도해 볼 prompt:

```
I would like to review the following points on the current PR (this branch vs main). Spawn one agent per point, wait for all of them, and summarize the result for each point.
1. Security issue
2. Code quality
3. Bugs
4. Race
5. Test flakiness
6. Maintainability of the code
```

## 서브에이전트 관리

- CLI에서 `/agent` → 활성 에이전트 스레드 전환·검사
- Codex에 직접 요청 → 실행 중 서브에이전트 조정·중지·완료 스레드 종료

## 승인과 샌드박스 통제

서브에이전트는 현재 샌드박스 정책 상속.

인터랙티브 CLI 세션에서, 메인 스레드를 보고 있어도 비활성 에이전트 스레드에서 승인 요청이 표시될 수 있음. 승인 오버레이는 출처 스레드 라벨 표시, 승인·거부·답변 전 `o`로 그 스레드 열기 가능.

비인터랙티브 플로 또는 새 승인을 표시할 수 없을 때, 새 승인이 필요한 액션은 실패하고 Codex가 부모 워크플로에 에러 표시.

Codex는 자식을 spawn할 때 부모 턴의 라이브 런타임 오버라이드도 재적용. 세션 중 인터랙티브로 설정한 샌드박스·승인 선택 (`/approvals` 변경, `--yolo`)이 포함됨 — 선택된 커스텀 에이전트 파일이 다른 기본값을 설정해도.

개별 [커스텀 에이전트](#커스텀-에이전트)에 대해 샌드박스 설정 오버라이드 가능 (예: 명시적으로 read-only로).

## 커스텀 에이전트

Codex 빌트인 에이전트:

- `default`: 범용 fallback 에이전트
- `worker`: 구현·수정에 집중한 실행 에이전트
- `explorer`: 읽기 위주 코드베이스 탐색 에이전트

자체 커스텀 에이전트 정의: 개인 에이전트는 `~/.codex/agents/`, 프로젝트 스코프 에이전트는 `.codex/agents/` 아래에 standalone TOML 파일.

각 파일은 한 커스텀 에이전트 정의. Codex는 이 파일들을 spawn된 세션의 설정 레이어로 로드 → 커스텀 에이전트가 일반 Codex 세션 config의 같은 설정을 오버라이드 가능. 전용 에이전트 manifest보다 무겁게 느껴질 수 있고, 저작·공유가 성숙하면 형식이 진화할 수 있음.

모든 standalone 커스텀 에이전트 파일에 필수:
- `name`
- `description`
- `developer_instructions`

선택 필드 (`nickname_candidates`, `model`, `model_reasoning_effort`, `sandbox_mode`, `mcp_servers`, `skills.config`)는 생략 시 부모 세션에서 상속.

### 글로벌 설정

글로벌 서브에이전트 설정은 [config](config-basic.md)의 `[agents]` 아래.

| 필드 | 타입 | 필수 | 목적 |
| --- | --- | --- | --- |
| `agents.max_threads` | number | No | 동시 열린 에이전트 스레드 cap |
| `agents.max_depth` | number | No | spawn된 에이전트 nesting 깊이 (root 세션은 0부터) |
| `agents.job_max_runtime_seconds` | number | No | `spawn_agents_on_csv` 작업의 worker당 기본 타임아웃 |

**메모:**
- `agents.max_threads` 기본 `6`
- `agents.max_depth` 기본 `1` — 직계 자식 에이전트 spawn 허용, 더 깊은 nesting 방지. 재귀 위임이 명시적으로 필요 없으면 기본 유지. 값을 올리면 광범위 위임 지시가 반복 fan-out으로 변해 토큰 사용·지연·로컬 리소스 소비 ↑. `agents.max_threads`가 동시 스레드 cap이지만 더 깊은 재귀의 비용·예측가능성 위험은 제거하지 않음.
- `agents.job_max_runtime_seconds`는 선택. 미설정 시 `spawn_agents_on_csv`는 worker당 기본 1800초 사용.
- 커스텀 에이전트 이름이 빌트인(`explorer` 등)과 매치되면 커스텀 에이전트 우선.

### 커스텀 에이전트 파일 스키마

| 필드 | 타입 | 필수 | 목적 |
| --- | --- | --- | --- |
| `name` | string | Yes | spawn·참조 시 사용할 에이전트 이름 |
| `description` | string | Yes | Codex가 이 에이전트를 언제 사용해야 하는지 사람용 가이드 |
| `developer_instructions` | string | Yes | 에이전트 동작 정의 핵심 지시 |
| `nickname_candidates` | string[] | No | spawn된 에이전트의 표시 nickname 풀 |

다른 지원 `config.toml` 키 (`model`, `model_reasoning_effort`, `sandbox_mode`, `mcp_servers`, `skills.config`)도 커스텀 에이전트 파일에 포함 가능.

Codex는 `name` 필드로 커스텀 에이전트 식별. 파일명을 에이전트 이름과 일치시키는 것이 가장 단순한 컨벤션, `name` 필드가 source of truth.

### 표시 nickname

같은 커스텀 에이전트 인스턴스를 여러 개 실행할 때 UI에 같은 이름 반복 대신 구별되는 라벨을 보이고 싶다면 `nickname_candidates`.

Nickname은 표시 전용. Codex는 `name`으로 에이전트 식별·spawn.

Nickname 후보는 비어있지 않은 unique 이름 리스트. ASCII 문자, 숫자, 공백, 하이픈, 언더스코어 사용.

예:
```toml
name = "reviewer"
description = "PR reviewer focused on correctness, security, and missing tests."
developer_instructions = """
Review code like an owner.
Prioritize correctness, security, behavior regressions, and missing test coverage.
"""
nickname_candidates = ["Atlas", "Delta", "Echo"]
```

실무에서 Codex 앱·CLI는 에이전트 활동이 표시되는 곳에 nickname을 보여주고, 내부 에이전트 타입은 `reviewer`로 유지.

### 커스텀 에이전트 예시

좋은 커스텀 에이전트는 좁고 명확하다. 각각에 명확한 일, 그 일에 맞는 도구 표면, 인접 작업으로 표류 안 하게 하는 지시를 부여.

#### 예 1: PR 리뷰

3개 집중 커스텀 에이전트로 리뷰 분할:
- `pr_explorer`: 코드베이스 매핑 + 증거 수집
- `reviewer`: 정확성, 보안, 테스트 위험 탐색
- `docs_researcher`: 전용 MCP 서버로 프레임워크·API 문서 확인

프로젝트 config (`.codex/config.toml`):
```toml
[agents]
max_threads = 6
max_depth = 1
```

`.codex/agents/pr-explorer.toml`:
```toml
name = "pr_explorer"
description = "Read-only codebase explorer for gathering evidence before changes are proposed."
model = "gpt-5.3-codex-spark"
model_reasoning_effort = "medium"
sandbox_mode = "read-only"
developer_instructions = """
Stay in exploration mode.
Trace the real execution path, cite files and symbols, and avoid proposing fixes unless the parent agent asks for them.
Prefer fast search and targeted file reads over broad scans.
"""
```

`.codex/agents/reviewer.toml`:
```toml
name = "reviewer"
description = "PR reviewer focused on correctness, security, and missing tests."
model = "gpt-5.4"
model_reasoning_effort = "high"
sandbox_mode = "read-only"
developer_instructions = """
Review code like an owner.
Prioritize correctness, security, behavior regressions, and missing test coverage.
Lead with concrete findings, include reproduction steps when possible, and avoid style-only comments unless they hide a real bug.
"""
```

`.codex/agents/docs-researcher.toml`:
```toml
name = "docs_researcher"
description = "Documentation specialist that uses the docs MCP server to verify APIs and framework behavior."
model = "gpt-5.4-mini"
model_reasoning_effort = "medium"
sandbox_mode = "read-only"
developer_instructions = """
Use the docs MCP server to confirm APIs, options, and version-specific behavior.
Return concise answers with links or exact references when available.
Do not make code changes.
"""

[mcp_servers.openaiDeveloperDocs]
url = "https://developers.openai.com/mcp"
```

이 셋업에 맞는 prompt:
```
Review this branch against main. Have pr_explorer map the affected code paths, reviewer find real risks, and docs_researcher verify the framework APIs that the patch relies on.
```

#### 예 2: 프론트엔드 통합 디버깅

UI 회귀, flaky 브라우저 플로, 앱 코드와 실행 중 제품을 가로지르는 통합 버그에 유용.

프로젝트 config (`.codex/config.toml`):
```toml
[agents]
max_threads = 6
max_depth = 1
```

`.codex/agents/code-mapper.toml`:
```toml
name = "code_mapper"
description = "Read-only codebase explorer for locating the relevant frontend and backend code paths."
model = "gpt-5.4-mini"
model_reasoning_effort = "medium"
sandbox_mode = "read-only"
developer_instructions = """
Map the code that owns the failing UI flow.
Identify entry points, state transitions, and likely files before the worker starts editing.
"""
```

`.codex/agents/browser-debugger.toml`:
```toml
name = "browser_debugger"
description = "UI debugger that uses browser tooling to reproduce issues and capture evidence."
model = "gpt-5.4"
model_reasoning_effort = "high"
sandbox_mode = "workspace-write"
developer_instructions = """
Reproduce the issue in the browser, capture exact steps, and report what the UI actually does.
Use browser tooling for screenshots, console output, and network evidence.
Do not edit application code.
"""

[mcp_servers.chrome_devtools]
url = "http://localhost:3000/mcp"
startup_timeout_sec = 20
```

`.codex/agents/ui-fixer.toml`:
```toml
name = "ui_fixer"
description = "Implementation-focused agent for small, targeted fixes after the issue is understood."
model = "gpt-5.3-codex-spark"
model_reasoning_effort = "medium"
developer_instructions = """
Own the fix once the issue is reproduced.
Make the smallest defensible change, keep unrelated files untouched, and validate only the behavior you changed.
"""

[[skills.config]]
path = "/Users/me/.agents/skills/docs-editor/SKILL.md"
enabled = false
```

이 셋업에 맞는 prompt:
```
Investigate why the settings modal fails to save. Have browser_debugger reproduce it, code_mapper trace the responsible code path, and ui_fixer implement the smallest fix once the failure mode is clear.
```

## CSV 배치를 서브에이전트로 처리 (실험)

이 워크플로는 실험 — 서브에이전트 지원 진화에 따라 변경될 수 있음. 작업 항목당 한 행에 매핑되는 유사 작업이 많을 때 `spawn_agents_on_csv` 사용. Codex가 CSV 읽기 → 행당 worker 서브에이전트 spawn → 전체 배치 완료 대기 → 결합 결과를 CSV로 export.

다음 같은 반복 감사에 적합:
- 행당 한 파일·패키지·서비스 리뷰
- 사고, PR, 마이그레이션 대상 리스트 검사
- 유사 입력 다수에 대한 구조화 요약 생성

도구 인자:
- `csv_path`: 소스 CSV
- `instruction`: worker prompt 템플릿, `{column_name}` placeholder 사용
- `id_column`: 특정 컬럼에서 안정적 항목 id가 필요할 때
- `output_schema`: 각 worker가 고정 형태 JSON 객체 반환할 때
- `output_csv_path`, `max_concurrency`, `max_runtime_seconds`: 작업 제어

각 worker는 `report_agent_job_result`를 정확히 한 번 호출. 결과 보고 없이 worker 종료 시 Codex가 export CSV에 그 행을 에러로 표시.

예 prompt:
```
Create /tmp/components.csv with columns path,owner and one row per frontend component.

Then call spawn_agents_on_csv with:
- csv_path: /tmp/components.csv
- id_column: path
- instruction: "Review {path} owned by {owner}. Return JSON with keys path, risk, summary, and follow_up via report_agent_job_result."
- output_csv_path: /tmp/components-review.csv
- output_schema: an object with required string fields path, risk, summary, and follow_up
```

`codex exec`로 실행 시 배치 진행 중 stderr에 한 줄 진행 업데이트 표시. Export CSV는 원본 행 데이터 + `job_id`, `item_id`, `status`, `last_error`, `result_json` 같은 메타데이터 포함.

관련 런타임 설정:
- `agents.max_threads`: 동시 열린 에이전트 스레드 cap
- `agents.job_max_runtime_seconds`: CSV fan-out 작업 worker당 기본 타임아웃. per-call `max_runtime_seconds` 오버라이드가 우선.
- `sqlite_home`: 에이전트 작업과 export 결과용 SQLite 백엔드 상태 저장 위치

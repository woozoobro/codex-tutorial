---
원문: https://developers.openai.com/codex/enterprise/managed-configuration
동기화일: 2026-05-15
---

# Managed configuration

> Codex requirements와 기본값 관리

엔터프라이즈 admin이 로컬 Codex 동작을 두 가지로 통제:

- **Requirements**: 사용자가 오버라이드 못 하는 admin 강제 제약
- **Managed defaults**: Codex launch 시 적용되는 시작 값. 사용자가 세션 중 설정 변경 가능, Codex가 다음 시작 시 managed defaults 재적용.

## Admin 강제 requirements (`requirements.toml`)

Requirements는 보안 민감 설정 (승인 정책, 승인 reviewer, 자동 리뷰 정책, 샌드박스 모드, 웹 검색 모드, managed 훅, 선택적으로 사용자가 활성화 가능 MCP 서버) 제약. 설정 resolve 시 (`config.toml`, 프로필, CLI config 오버라이드) 값이 강제 룰과 충돌하면 Codex가 호환 값으로 fallback + 사용자 알림. `mcp_servers` allowlist 구성 시 Codex가 이름과 identity 둘 다 승인 항목과 매치될 때만 MCP 서버 활성화. 그 외엔 비활성화.

Requirements는 `requirements.toml`의 `[features]` 테이블 통해 [기능 플래그](../configuration/config-basic.md)도 제약 가능. 기능이 항상 보안 민감 아니지만 엔터프라이즈가 원하면 값 pin 가능. 생략 키는 unconstrained 유지.

→ 정확한 키 리스트: [Configuration Reference의 `requirements.toml` 섹션](../configuration/config-reference.md)

### 위치와 우선순위

Codex가 requirements 레이어 적용 순서 (필드별 더 빠른 것 우승):

1. 클라우드 관리 requirements (ChatGPT Business·Enterprise)
2. macOS managed preferences (MDM) — `com.openai.codex:requirements_toml_base64`
3. 시스템 `requirements.toml`:
   - Unix (Linux/macOS): `/etc/codex/requirements.toml`
   - Windows: `%ProgramData%\OpenAI\Codex\requirements.toml`

레이어 전반 Codex가 필드별 머지 — 더 빠른 레이어가 필드 (빈 리스트 포함) 설정 시 나중 레이어가 그 필드 오버라이드 못 함, 더 낮은 레이어는 unset 유지 필드 채우기 가능.

호환성 위해 Codex가 레거시 `managed_config.toml` 필드 `approval_policy`와 `sandbox_mode`도 requirements로 해석 (그 단일 값만 허용).

### 클라우드 관리 requirements

Business·Enterprise 플랜에서 ChatGPT 로그인 시 Codex가 Codex 서비스에서 admin 강제 requirements도 fetch 가능. 다른 `requirements.toml` 호환 requirements 출처. CLI, App, IDE 확장 포함 Codex surface 전반 적용.

#### 클라우드 관리 requirements 구성

[Codex managed-config 페이지](https://chatgpt.com/codex/settings/managed-configs)로.

`requirements.toml`과 같은 형식·키로 새 managed requirements 파일 생성:

```toml
enforce_residency = "us"
allowed_approval_policies = ["on-request"]
allowed_sandbox_modes = ["read-only", "workspace-write"]

[rules]
prefix_rules = [
  { pattern = [{ any_of = ["bash", "sh", "zsh"] }], decision = "prompt", justification = "Require explicit approval for shell entrypoints" },
]
```

저장. 저장 후 갱신 managed requirements가 매칭 사용자에 즉시 적용.

#### 그룹에 requirements 할당

Admin이 다른 사용자 그룹에 다른 managed requirements 구성 가능 + 기본 fallback requirements 정책도 설정.

사용자가 1개 초과 그룹 특정 룰에 매치 → 첫 매치 룰 적용. Codex가 나중 매치 그룹 룰에서 unset 필드 채우지 않음.

예 — 첫 매치 그룹 룰이 `allowed_sandbox_modes = ["read-only"]`만 설정 + 나중 매치 그룹 룰이 `allowed_approval_policies = ["on-request"]` 설정 → Codex가 첫 매치 그룹 룰만 적용 + 나중 룰에서 `allowed_approval_policies` 안 채움.

#### Codex가 클라우드 관리 requirements 로컬 적용 방식

사용자가 Codex 시작 + Business·Enterprise 플랜 ChatGPT 로그인 시 Codex가 best-effort로 managed requirements 적용. Codex가 먼저 유효·미만료 로컬 managed requirements 캐시 항목 체크 + 가용 시 사용. 캐시 누락·만료·corrupted·현재 auth 신원 불일치 시 Codex가 서비스에서 managed requirements fetch 시도 (재시도 포함) + 성공 시 새 서명 캐시 항목 작성. 유효 캐시 항목 가용 안 + fetch 실패·타임아웃 시 Codex가 managed requirements 레이어 없이 계속.

캐시 resolve 후 Codex가 위에 기술한 일반 requirements 레이어링의 일부로 managed requirements 강제.

### `requirements.toml` 예시

`--ask-for-approval never`와 `--sandbox danger-full-access` (`--yolo` 포함) 차단:
```toml
allowed_approval_policies = ["untrusted", "on-request"]
allowed_sandbox_modes = ["read-only", "workspace-write"]
```

### 호스트별 샌드박스 requirements 오버라이드

한 managed 정책이 다른 호스트에 다른 샌드박스 requirements 적용해야 → `[[remote_sandbox_config]]`. 예: 노트북엔 더 엄격 기본 유지 + 매칭 devbox나 CI 러너에 워크스페이스 쓰기 허용. 호스트 특정 항목은 현재 `allowed_sandbox_modes`만 오버라이드:

```toml
allowed_sandbox_modes = ["read-only"]

[[remote_sandbox_config]]
hostname_patterns = ["*.devbox.example.com", "runner-??.ci.example.com"]
allowed_sandbox_modes = ["read-only", "workspace-write"]
```

Codex가 각 `hostname_patterns` 항목을 best-effort resolve 호스트 이름과 비교. 가용 시 FQDN 우선 + 로컬 호스트 이름 fallback. 매치는 case-insensitive — `*`는 임의 문자 시퀀스 매치, `?`는 한 문자 매치.

같은 requirements 출처 안에서 첫 매치 `[[remote_sandbox_config]]` 항목 우승. 매치 항목 없으면 Codex가 top-level `allowed_sandbox_modes` 유지. 호스트 이름 매칭은 정책 선택 전용 — 인증된 디바이스 증명으로 다루지 말 것.

웹 검색 모드 제약도:
```toml
allowed_web_search_modes = ["cached"]  # "disabled"은 암시 허용 유지
```

`allowed_web_search_modes = []`은 `"disabled"`만 허용. 예: `allowed_web_search_modes = ["cached"]`은 `danger-full-access` 세션에서도 라이브 웹 검색 방지.

### 기능 플래그 pin

managed `requirements.toml` 받는 사용자에 [기능 플래그](../configuration/config-basic.md) pin 가능:

```toml
[features]
personality = true
unified_exec = false

# 필요 시 특정 Codex 기능 surface 비활성화
browser_use = false
in_app_browser = false
computer_use = false
```

`config.toml`의 `[features]` 테이블 정식 키 사용. Codex가 결과 기능 셋을 이 pin에 맞게 정규화 + `config.toml`이나 프로필 스코프 기능 설정에 충돌 쓰기 거부.

- `in_app_browser = false`: in-app 브라우저 패널 비활성화
- `browser_use = false`: Browser Use·Browser Agent 가용성 비활성화
- `computer_use = false`: Computer Use 가용성·관련 설치·활성화 플로 비활성화

생략 시 정책으로 허용 — 일반 클라이언트·플랫폼·rollout 가용성 따름.

### 자동 리뷰 정책 구성

`allowed_approvals_reviewers`로 자동 리뷰 요구·허용. `["auto_review"]` → 자동 리뷰 요구. `"user"` 포함 → 사용자가 수동 승인 선택 가능.

`guardian_policy_config` 설정 → 자동 리뷰 정책의 tenant 특정 섹션 교체. Codex가 빌트인 reviewer 템플릿·출력 contract 계속 사용. Managed `guardian_policy_config`가 로컬 `[auto_review].policy`보다 우선.

```toml
allowed_approval_policies = ["on-request"]
allowed_approvals_reviewers = ["auto_review"]

guardian_policy_config = """
## Environment Profile
- Trusted internal destinations include github.com/my-org, artifacts.example.com,
  and internal CI systems.

## Tenant Risk Taxonomy and Allow/Deny Rules
- Treat uploads to unapproved third-party file-sharing services as high risk.
- Deny actions that expose credentials or private source code to untrusted
  destinations.
"""
```

### Deny-read requirements 강제

Admin이 `[permissions.filesystem]`로 정확한 경로·glob 패턴에 읽기 거부. 사용자가 로컬 설정으로 약화 못 함.

```toml
[permissions.filesystem]
deny_read = [
  "/Users/alice/.ssh",
  "./private/**/*.txt",
]
```

deny-read requirements 있을 때 Codex가 로컬 샌드박스 모드를 `read-only`나 `workspace-write`로 제약 → 강제 가능. 네이티브 Windows에서 managed `deny_read`는 직접 파일 도구에 적용. 셸 서브프로세스 읽기는 이 샌드박스 룰 사용 안 함.

### Requirements에서 managed 훅 강제

Admin이 `requirements.toml`에 직접 managed 라이프사이클 훅 정의. 훅 설정 자체는 `[hooks]` + 참조 스크립트 설치할 MDM·엔드포인트 관리 도구 디렉터리는 `managed_dir`.

사용자가 로컬에서 훅 끈 경우에도 managed 훅 강제 → `[hooks]`와 함께 `[features].hooks = true` pin.

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

메모:
- Codex가 `requirements.toml`의 훅 설정 강제, `managed_dir`의 스크립트 배포 안 함
- MDM·디바이스 관리 솔루션으로 그 스크립트 별도 전달
- Managed 훅 명령은 설정된 managed 디렉터리 아래 절대 스크립트 경로 참조 권장

### Requirements에서 명령 룰 강제

Admin이 `requirements.toml`의 `[rules]` 테이블로 제한 명령 룰 강제. 일반 `.rules` 파일과 머지 + 가장 제한적 결정 우승.

`.rules`와 달리 requirements 룰은 `decision` 명시 필수 + 그 결정은 `"prompt"` 또는 `"forbidden"` (`"allow"` 아님).

```toml
[rules]
prefix_rules = [
  { pattern = [{ token = "rm" }], decision = "forbidden", justification = "Use git clean -fd instead." },
  { pattern = [{ token = "git" }, { any_of = ["push", "commit"] }], decision = "prompt", justification = "Require review before mutating history." },
]
```

Codex가 활성화 가능 MCP 서버 제한 → `mcp_servers` 승인 리스트 추가. stdio 서버는 `command` 매치, streamable HTTP 서버는 `url` 매치:

```toml
[mcp_servers.docs]
identity = { command = "codex-mcp" }

[mcp_servers.remote]
identity = { url = "https://example.com/mcp" }
```

`mcp_servers` 있지만 비어있으면 Codex가 모든 MCP 서버 비활성화.

## Managed defaults (`managed_config.toml`)

Managed defaults는 사용자 로컬 `config.toml` 위에 머지 + CLI `--config` 오버라이드보다 우선 → Codex launch 시 시작 값 설정. 사용자가 세션 중 설정 변경 가능, Codex가 다음 시작 시 재적용.

> Managed defaults가 requirements 충족하는지 확인. Codex가 비허용 값 거부.

### 우선순위·레이어링

Codex가 effective 설정 조립 순서 (위가 아래 오버라이드):
- Managed preferences (macOS MDM, 가장 높은 우선순위)
- `managed_config.toml` (시스템·managed 파일)
- `config.toml` (사용자 base 설정)

CLI `--config key=value` 오버라이드는 base에 적용, managed 레이어가 그것 오버라이드. → 로컬 플래그 제공해도 매 실행이 managed defaults에서 시작.

클라우드 관리 requirements는 requirements 레이어에 영향 (managed defaults 아님). → 위 admin 강제 requirements 섹션의 우선순위.

### 위치

- Linux/macOS (Unix): `/etc/codex/managed_config.toml`
- Windows·non-Unix: `~/.codex/managed_config.toml`

파일 누락 시 Codex가 managed 레이어 건너뜀.

### macOS managed preferences (MDM)

macOS에서 admin이 base64 인코딩 TOML payload를 디바이스 프로필로 push:
- Preference 도메인: `com.openai.codex`
- 키: `config_toml_base64` (managed defaults)
- `requirements_toml_base64` (requirements)

Codex가 이 "managed preferences" payload를 TOML로 파싱. Managed defaults (`config_toml_base64`)는 managed preferences가 가장 높은 우선순위. Requirements (`requirements_toml_base64`)는 위 클라우드 관리 requirements 순서 따름. 같은 requirements 측 `[features]` 테이블이 `requirements_toml_base64`에서 동작 — 정식 기능 키 사용.

### MDM 셋업 워크플로

Codex가 표준 macOS MDM payload 존중 → `Jamf Pro`, `Fleet`, `Kandji` 같은 도구로 설정 배포. 가벼운 배포:

1. managed payload TOML 빌드 + `base64`로 인코드 (wrapping 없음)
2. 그 문자열을 MDM 프로필의 `com.openai.codex` 도메인 아래 `config_toml_base64` (managed defaults) 또는 `requirements_toml_base64` (requirements)에 drop
3. 프로필 push → 사용자에게 Codex 재시작 + 시작 config 요약이 managed 값 반영 확인 요청
4. 정책 회수·변경 시 managed payload 갱신 → CLI가 다음 launch 시 새로고침된 preference 읽음

> Payload에 시크릿·high-churn 동적 값 임베드 회피. Managed TOML을 다른 MDM 설정처럼 변경 통제 아래 다루기.

### `managed_config.toml` 예시

```toml
# 보수적 기본값 설정
approval_policy = "on-request"
sandbox_mode    = "workspace-write"

[sandbox_workspace_write]
network_access = false  # 명시 허용 외엔 네트워크 비활성화 유지

[otel]
environment = "prod"
exporter = "otlp-http"  # collector에 가리키기
log_user_prompt = false  # prompt redact 유지
# exporter 디테일은 exporter 테이블 — Monitoring and telemetry 위 참고
```

### 권장 가드레일

- 대부분 사용자에 `workspace-write` + 승인 우선. 풀 액세스는 통제된 컨테이너에 예약.
- 보안 검토가 collector·워크플로 필요 도메인 허용 안 하면 `network_access = false` 유지
- managed configuration으로 OTel 설정 (exporter, environment) pin, 정책이 prompt 콘텐츠 저장 명시 허용 안 하면 `log_user_prompt = false` 유지
- 로컬 `config.toml`과 managed 정책 사이 diff 정기 감사로 drift 캐치 — managed 레이어가 로컬 플래그·파일 우승해야

---
원문: https://developers.openai.com/codex/skills
동기화일: 2026-05-15
---

# 에이전트 스킬 (Agent Skills)

> Codex에 새 능력과 전문성 부여

스킬은 작업 특화 능력으로 Codex를 확장한다. 지시·리소스·선택적 스크립트를 패키징해 Codex가 워크플로를 안정적으로 따르게 한다. [open agent skills 표준](https://agentskills.io) 기반.

스킬은 재사용 가능 워크플로의 **저작 형식**, 플러그인은 Codex의 재사용 가능 스킬·앱 **설치 배포 단위**. 워크플로 자체를 스킬로 설계하고, 다른 개발자에게 배포할 때 [플러그인](plugins-overview.md)으로 패키징.

CLI, IDE 확장, Codex 앱에서 모두 사용 가능.

스킬은 **점진적 공개(progressive disclosure)**로 컨텍스트를 효율 관리: Codex는 각 스킬의 이름·설명·파일 경로로 시작, 스킬 사용을 결정하면 그때 전체 `SKILL.md`를 로드.

Codex는 컨텍스트에 사용 가능 스킬의 초기 리스트를 포함해 작업에 맞는 스킬을 고를 수 있게 한다. 나머지 prompt를 밀어내지 않게 모델 컨텍스트 윈도우의 약 2% 또는 알 수 없으면 8,000자로 cap. 스킬이 많이 설치되면 설명을 먼저 줄이고, 매우 큰 셋이면 일부 생략 + 경고 표시.

이 budget은 **초기 스킬 리스트에만** 적용. Codex가 스킬을 선택하면 그 스킬의 전체 SKILL.md를 읽음.

스킬은 `SKILL.md` 파일 + 선택적 스크립트·참조가 있는 디렉터리. `SKILL.md`엔 `name`과 `description` 필수.

```
my-skill/
├── SKILL.md          # 필수: 지시 + 메타데이터
├── scripts/          # 선택: 실행 코드
├── references/       # 선택: 문서
├── assets/           # 선택: 템플릿, 리소스
└── agents/
    └── openai.yaml   # 선택: 외형, 의존성
```

## Codex가 스킬을 사용하는 방식

활성화 두 가지:

1. **명시적 호출**: prompt에 직접 포함. CLI/IDE에서 `/skills` 또는 `$`로 스킬 mention.
2. **암시적 호출**: 작업이 스킬 `description`과 매치되면 Codex가 선택.

암시 매치는 `description`에 의존하므로 **간결한 설명 + 명확한 범위·경계** 작성. 핵심 use case와 trigger 단어를 앞에 두면 설명이 줄어도 매치 가능.

## 스킬 만들기

빌트인 creator 사용:

```
$skill-creator
```

Creator가 묻는 것: 스킬이 뭘 하는지, 언제 trigger되어야 하는지, instruction-only인지 스크립트 포함인지. 기본은 instruction-only.

수동으로도 가능 — `SKILL.md` 파일이 있는 폴더 생성:

```markdown
---
name: skill-name
description: Explain exactly when this skill should and should not trigger.
---

Skill instructions for Codex to follow.
```

Codex는 스킬 변경을 자동 감지. 갱신이 안 보이면 재시작.

## 스킬 저장 위치

Codex는 리포·사용자·관리자·시스템 위치에서 스킬 읽음. 리포의 경우 현재 작업 디렉터리에서 리포 루트까지 모든 디렉터리의 `.agents/skills` 스캔. 두 스킬이 같은 `name`이면 머지하지 않고 둘 다 selector에 표시.

| 스코프 | 위치 | 권장 사용 |
| --- | --- | --- |
| `REPO` | `$CWD/.agents/skills` (Codex launch한 현재 디렉터리) | 작업 폴더에 관련된 스킬 체크인. 마이크로서비스나 모듈 전용 스킬. |
| `REPO` | `$CWD/../.agents/skills` (Git 리포 안에서 Codex launch 시 CWD 위 폴더) | nested 폴더 리포에서 부모 폴더의 공유 영역에 관련된 스킬 |
| `REPO` | `$REPO_ROOT/.agents/skills` (Git 리포의 최상위 루트) | nested 폴더 리포 전체에서 누구나 사용. 어떤 서브폴더에서도 root 스킬로 접근 가능. |
| `USER` | `$HOME/.agents/skills` | 사용자가 어떤 리포에서 작업하든 적용되는 개인 스킬 큐레이션 |
| `ADMIN` | `/etc/codex/skills` (머신·컨테이너 공유 시스템 위치) | SDK 스크립트, 자동화, 머신 모든 사용자에게 가능한 기본 admin 스킬 |
| `SYSTEM` | OpenAI가 Codex와 함께 번들 | skill-creator, plan 같은 광범위한 스킬. Codex 시작 시 모두에게 가능. |

심볼릭 링크 스킬 폴더 지원 — 스캔 시 링크 타깃 따라감.

이 위치들은 **저작 + 로컬 발견용**. 단일 리포 너머로 재사용 스킬을 배포하거나 앱 통합과 번들하려면 [플러그인](plugins-overview.md) 사용.

## 플러그인으로 스킬 배포

직접 스킬 폴더는 로컬 저작·리포 스코프 워크플로에 적합. 다음의 경우 플러그인으로 패키징:
- 재사용 스킬을 배포하고 싶을 때
- 스킬 두 개 이상 묶을 때
- 앱 통합과 함께 출시할 때

플러그인은 스킬을 1개 이상 포함 가능. 앱 매핑, MCP 서버 설정, 프레젠테이션 자산도 한 패키지에 번들 가능.

## 큐레이트된 스킬 로컬 설치

빌트인 외에 큐레이트된 스킬을 자신의 로컬 Codex 셋업에 추가하려면 `$skill-installer` 사용. 예: `$linear` 스킬:

```
$skill-installer linear
```

다른 리포에서 다운로드하도록 prompt 가능. Codex가 새 스킬을 자동 감지, 안 보이면 재시작.

로컬 셋업·실험용. 자신의 스킬을 재사용 가능하게 배포하려면 플러그인 우선.

## 스킬 활성/비활성

`~/.codex/config.toml`의 `[[skills.config]]` 항목으로 삭제 없이 비활성화:

```toml
[[skills.config]]
path = "/path/to/skill/SKILL.md"
enabled = false
```

`~/.codex/config.toml` 변경 후 Codex 재시작.

## 선택적 메타데이터

`agents/openai.yaml`로 [Codex 앱](../ide/app-overview.md)의 UI 메타데이터, 호출 정책, 도구 의존성 선언 가능 — 스킬 사용 경험을 더 매끄럽게.

```yaml
interface:
  display_name: "Optional user-facing name"
  short_description: "Optional user-facing description"
  icon_small: "./assets/small-logo.svg"
  icon_large: "./assets/large-logo.png"
  brand_color: "#3B82F6"
  default_prompt: "Optional surrounding prompt to use the skill with"

policy:
  allow_implicit_invocation: false

dependencies:
  tools:
    - type: "mcp"
      value: "openaiDeveloperDocs"
      description: "OpenAI Docs MCP server"
      transport: "streamable_http"
      url: "https://developers.openai.com/mcp"
```

`allow_implicit_invocation` (기본 `true`): `false`면 사용자 prompt 기반 암시 호출 안 함. 명시 `$skill` 호출은 그대로 작동.

## 모범 사례

- 스킬 하나당 하나의 일에 집중
- 결정적 동작이나 외부 도구가 필요하지 않으면 스크립트보다 지시 우선
- 명시적 입력·출력이 있는 명령형 단계 작성
- 스킬 description에 대해 prompt 테스트로 올바른 trigger 동작 확인

더 많은 예시: [github.com/openai/skills](https://github.com/openai/skills), [agent skills 명세](https://agentskills.io/specification)

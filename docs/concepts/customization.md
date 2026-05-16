---
원문: https://developers.openai.com/codex/concepts/customization
동기화일: 2026-05-15
---

# 커스터마이징 (Customization)

> 프로젝트 가이드, 스킬, MCP, 서브에이전트로 Codex 커스터마이징

커스터마이징은 Codex가 팀 방식대로 일하게 만드는 방법.

함께 동작하는 레이어:
- **프로젝트 가이드 (`AGENTS.md`)**: 영구 지시
- **[Memories](memories.md)**: 이전 작업에서 학습한 유용한 컨텍스트
- **Skills**: 재사용 가능 워크플로와 도메인 전문성
- **[MCP](../configuration/mcp.md)**: 외부 도구·공유 시스템 접근
- **[Subagents](subagents.md)**: 특화 서브에이전트에 작업 위임

상호 보완 관계, 경쟁 관계 아님. `AGENTS.md`는 동작 형성, 메모리는 로컬 컨텍스트 이월, 스킬은 반복 가능 프로세스 패키징, MCP는 로컬 워크스페이스 외부 시스템에 연결.

## AGENTS 가이드

`AGENTS.md`는 리포와 함께 다니며 에이전트 작업 시작 전 적용되는 영구 프로젝트 가이드. 작게 유지.

리포에서 Codex가 항상 따라야 할 룰:
- 빌드·테스트 명령
- 리뷰 기대치
- 리포 특정 컨벤션
- 디렉터리별 지시

에이전트가 코드베이스를 잘못 가정하면 `AGENTS.md`에서 수정 + 에이전트에게 `AGENTS.md` 갱신 요청 → 수정 영구화. 피드백 루프로 다루기.

**`AGENTS.md` 갱신**: 정말 중요한 지시만으로 시작. 반복되는 리뷰 피드백을 코드화, 가장 가까운 디렉터리에 가이드 배치, 수정 시 에이전트에게 `AGENTS.md` 갱신 요청해 미래 세션이 fix 상속.

### `AGENTS.md`를 갱신할 때

- **반복 실수**: 에이전트가 같은 실수 반복 → 룰 추가
- **너무 많이 읽음**: 올바른 파일은 찾지만 너무 많은 문서 읽기 → 라우팅 가이드 추가 (어느 디렉터리·파일을 우선시할지)
- **반복 PR 피드백**: 같은 피드백 두 번 이상 → 코드화
- **GitHub에서**: PR 코멘트에서 `@codex` 태그 + 요청 (예: `@codex add this to AGENTS.md`) → 클라우드 작업에 위임
- **drift 체크 자동화**: [automations](../ide/app-automations.md)로 정기 체크 (예: 매일) — 가이드 갭 찾고 `AGENTS.md`에 추가할 것 제안

`AGENTS.md`를 룰을 강제하는 인프라와 페어링: pre-commit 훅, 린터, 타입 체커가 사용자 보기 전에 이슈 잡음 → 시스템이 반복 실수 예방에 더 똑똑해짐.

Codex는 여러 위치에서 가이드 로드: Codex 홈 디렉터리의 글로벌 파일 (개발자 자신용) + 팀이 체크인할 수 있는 리포 특정 파일. 작업 디렉터리에 가까운 파일 우선. 글로벌 파일은 Codex가 사용자와 소통하는 방식 (리뷰 스타일, verbosity, 기본값) 형성에, 리포 파일은 팀·코드베이스 룰에 집중.

```
~/.codex/AGENTS.md       # 글로벌 (개발자 자신용)
repo-root/AGENTS.md      # 리포 특정 (팀용)
```

→ [AGENTS.md 가이드](../configuration/agents-md.md)

## Skills

스킬은 반복 가능 워크플로용 재사용 능력. 풍부한 지시·스크립트·참조를 작업 간 재사용 가능하게 유지하므로 재사용 워크플로에 가장 적합. 스킬은 에이전트에게 로드되어 (적어도 메타데이터는) 보임 → Codex가 암시적으로 발견·선택 가능. 풍부한 워크플로를 사전에 컨텍스트 부풀리지 않고 가용하게 유지.

로컬 저작·반복은 스킬 폴더로. 워크플로용 플러그인이 이미 있으면 검증된 셋업 재사용 위해 먼저 설치. 자체 워크플로를 팀에 배포하거나 앱 통합과 번들하려면 [플러그인](../configuration/plugins-build.md)으로 패키징. 스킬은 저작 형식, 플러그인은 설치 가능 배포 단위.

스킬은 일반적으로 `SKILL.md` + 선택적 스크립트·참조·자산.

```
my-skill/
├── SKILL.md          # 필수: 지시 + 메타데이터
├── scripts/          # 선택: 실행 코드
├── references/       # 선택: 문서
└── assets/           # 선택: 템플릿, 리소스
```

스킬 디렉터리는 워크플로 일부로 Codex가 호출하는 CLI 스크립트가 든 `scripts/` 폴더 포함 가능 (예: 데이터 시드, 검증 실행). 외부 시스템(이슈 트래커, 디자인 도구, 문서 서버)이 필요하면 [MCP](../configuration/mcp.md)와 페어링.

`SKILL.md` 예:
```markdown
---
name: commit
description: Stage and commit changes in semantic groups. Use when the user wants to commit, organize commits, or clean up a branch before pushing.
---

1. Do not run `git add .`. Stage files in logical groups by purpose.
2. Group into separate commits: feat → test → docs → refactor → chore.
3. Write concise commit messages that match the change scope.
4. Keep each commit focused and reviewable.
```

스킬을 쓸 때:
- 반복 워크플로 (릴리스 단계, 리뷰 루틴, 문서 갱신)
- 팀 특화 전문성
- 예시·참조·헬퍼 스크립트가 필요한 절차

스킬은 글로벌 (사용자 디렉터리, 개발자 자신용) 또는 리포 특정 (`.agents/skills`에 체크인, 팀용). 워크플로가 그 프로젝트에 적용되면 리포 스킬을 `.agents/skills`에, 모든 리포에서 원하는 것은 사용자 디렉터리에.

| 레이어 | Global | Repo |
| --- | --- | --- |
| AGENTS | `~/.codex/AGENTS.md` | 리포 루트 또는 nested 디렉터리의 `AGENTS.md` |
| Skills | `$HOME/.agents/skills` | 리포의 `.agents/skills` |

Codex는 스킬에 점진적 공개 사용:
- 발견용 메타데이터 (`name`, `description`)부터 시작
- 스킬 선택 시만 `SKILL.md` 로드
- 필요할 때만 참조 읽기·스크립트 실행

스킬은 명시적으로 호출 가능, Codex가 스킬 description과 작업 매치 시 암시적으로 선택도 가능. 명확한 스킬 description이 트리거 신뢰성 향상.

→ [Agent Skills](../configuration/skills.md)

## MCP

MCP (Model Context Protocol)는 Codex를 외부 도구·컨텍스트 프로바이더에 연결하는 표준. Figma, Linear, GitHub, 팀이 의존하는 내부 지식 서비스 같은 원격 호스팅 시스템에 특히 유용.

Codex가 로컬 리포 외부의 능력 (이슈 트래커, 디자인 도구, 브라우저, 공유 문서 시스템)이 필요할 때 MCP 사용.

생각하는 한 가지 방법:
- **Host**: Codex
- **Client**: Codex 안의 MCP 연결
- **Server**: 외부 도구 또는 컨텍스트 프로바이더

MCP 서버가 노출하는 것:
- **Tools** (액션)
- **Resources** (읽을 수 있는 데이터)
- **Prompts** (재사용 가능 prompt 템플릿)

이 분리는 신뢰·능력 경계를 추론하는 데 도움. 일부 서버는 주로 컨텍스트 제공, 다른 서버는 강력한 액션 노출.

실무에서 MCP는 스킬과 페어링될 때 가장 유용:
- 스킬이 워크플로 정의 + 사용할 MCP 도구 명명

→ [Model Context Protocol](../configuration/mcp.md)

## 서브에이전트

다른 역할의 다른 에이전트를 만들고 도구를 다르게 사용하도록 prompt 가능. 예: 한 에이전트는 특정 테스트 명령·설정 실행, 다른 에이전트는 디버깅용 프로덕션 로그 fetch하는 MCP 서버 보유. 각 서브에이전트가 자기 일에 집중 + 적합한 도구 사용.

→ [Subagent concepts](subagents.md)

## Skills + MCP 함께

스킬 + MCP는 모든 게 합쳐지는 곳: 스킬이 반복 워크플로 정의, MCP가 외부 도구·시스템에 연결. 스킬이 MCP에 의존하면 `agents/openai.yaml`에 의존성 선언 → Codex가 자동 설치·wire 가능 (→ [Agent Skills](../configuration/skills.md))

## 다음 단계

빌드 순서:

1. [AGENTS.md](../configuration/agents-md.md) — Codex가 리포 컨벤션 따르게. pre-commit 훅과 린터로 룰 강제.
2. 재사용 워크플로가 이미 있으면 [플러그인](../configuration/plugins-overview.md) 설치. 아니면 [스킬](../configuration/skills.md) 만들고 공유 시 플러그인으로 패키징.
3. 워크플로가 외부 시스템 필요하면 [MCP](../configuration/mcp.md) (Linear, GitHub, 문서 서버, 디자인 도구).
4. 노이지하거나 특화 작업 위임 준비되면 [서브에이전트](../configuration/subagents.md).

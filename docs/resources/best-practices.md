---
원문: https://developers.openai.com/codex/learn/best-practices
동기화일: 2026-05-15
---

# 모범 사례 (Best practices)

> Codex 시작하기 + 더 나은 결과를 위한 검증된 사례

Codex나 코딩 에이전트가 처음이면 이 가이드가 더 빨리 더 나은 결과 얻기 도움. [CLI](../cli/overview.md), [IDE 확장](../ide/overview.md), [Codex 앱](../ide/app-overview.md) 전반에 Codex를 더 효과적으로 만드는 핵심 습관 — prompting과 계획부터 검증, MCP, skills, automations까지.

Codex는 일회성 어시스턴트보다 시간 지나며 구성·개선하는 팀 동료처럼 다룰 때 가장 잘 동작.

생각하는 방법: 올바른 작업 컨텍스트로 시작 → `AGENTS.md`로 영구 가이드 사용 → 워크플로에 맞게 Codex 구성 → MCP로 외부 시스템 연결 → 반복 작업을 스킬로 → 안정 워크플로 자동화.

## 강한 첫 사용: 컨텍스트와 prompt

Codex는 prompt 완벽 안 해도 유용할 만큼 이미 강함. 어려운 문제를 최소 셋업으로 넘겨도 강한 결과 자주. 명확한 [prompting](../concepts/prompting.md)이 가치 얻기에 필수 아님, 그러나 결과 더 안정적 — 특히 큰 코드베이스·고-stake 작업에서.

큰·복잡한 리포에서 작업하면 가장 큰 unlock은 Codex에 올바른 작업 컨텍스트 + 원하는 것의 명확한 구조 부여.

좋은 기본 — prompt에 4가지 포함:

- **Goal**: 무엇을 변경·빌드하려는지
- **Context**: 어느 파일·폴더·문서·예시·에러가 이 작업에 중요한지. 특정 파일을 `@` mention으로 컨텍스트.
- **Constraints**: 어떤 표준·아키텍처·안전 요구사항·컨벤션 따라야 하는지
- **Done when**: 작업 완료 전 무엇이 true여야 하는지 (테스트 통과, 동작 변경, 버그 더 이상 재현 안 됨 등)

→ Codex가 스코프 유지, 더 적은 가정, 더 검토 쉬운 작업 생산.

작업 난이도 기반 reasoning 레벨 선택 + 워크플로에 맞는 것 테스트:
- **Low**: 더 빠른 well-scoped 작업
- **Medium / High**: 더 복잡한 변경·디버깅
- **Extra High**: 길고 agentic·reasoning-heavy 작업

컨텍스트 더 빠르게 → Codex 앱의 음성 dictation으로 타이핑 대신 말하기.

## 어려운 작업엔 계획 먼저

작업이 복잡, 모호, 잘 기술 어려움 → 코딩 시작 전 계획 요청.

좋은 접근:

**Plan mode 사용**: 대부분 사용자에 가장 쉽고 효과적. Codex가 컨텍스트 수집, 명확화 질문, 구현 전 더 강한 계획 빌드. `/plan` 또는 Shift+Tab으로 토글.

**Codex가 인터뷰하게**: 원하는 것의 대략 아이디어 있지만 잘 기술 모호 → Codex에 먼저 질문하라고 요청. 가정에 challenge + 모호한 아이디어를 코드 작성 전 구체적인 것으로 변환.

**`PLANS.md` 템플릿**: 더 고급 워크플로 — Codex가 더 긴·멀티스텝 작업에 `PLANS.md`나 실행 계획 템플릿 따르도록 구성. → [실행 계획 가이드](https://developers.openai.com/cookbook/articles/codex_exec_plans)

## AGENTS.md로 가이드 재사용 가능하게

Prompting 패턴이 동작 → 다음 단계는 수동 반복 멈추기. → [AGENTS.md](../configuration/agents-md.md).

`AGENTS.md`는 에이전트용 open-format README로 생각. 컨텍스트에 자동 로드 + 리포에서 사용자·팀이 Codex가 어떻게 동작하길 원하는지 인코드하는 최선의 곳.

좋은 `AGENTS.md` 커버:
- 리포 레이아웃과 중요 디렉터리
- 프로젝트 실행 방법
- Build, test, lint 명령
- 엔지니어링 컨벤션과 PR 기대치
- 제약과 do-not 룰
- done이 무슨 의미 + 작업 검증 방법

CLI의 `/init` 슬래시 명령이 현재 디렉터리에 starter `AGENTS.md` scaffold 빠른 시작 명령. 좋은 출발점, 팀이 실제 빌드·테스트·리뷰·shipping 하는 방식과 매치되게 결과 편집.

`AGENTS.md` 파일을 다른 레벨에 생성: `~/.codex`의 글로벌 `AGENTS.md` (개인 기본값), 공유 표준용 리포 레벨 파일, 로컬 룰용 더 구체적 서브디렉터리 파일. 현재 디렉터리에 더 가까운 더 구체적 파일이 있으면 그 가이드 우승.

> 실용적으로 유지. 짧고 정확한 `AGENTS.md`가 모호한 룰 가득한 긴 파일보다 유용. 기본부터 시작 + 반복 실수 발견한 후에만 새 룰 추가.

`AGENTS.md`가 너무 커지면 메인 파일 간결 유지 + 계획·코드 리뷰·아키텍처 같은 작업별 마크다운 파일 참조.

Codex가 같은 실수 두 번 → 회고 요청 + `AGENTS.md` 갱신. 가이드가 실제 마찰 기반으로 실용적 유지.

## 일관성 위해 Codex 구성

설정은 세션·surface 전반 Codex가 더 일관 동작하게 만드는 주요 방법 중 하나. 예 — 모델 선택, reasoning effort, 샌드박스 모드, 승인 정책, 프로필, MCP 셋업 기본값 설정.

좋은 출발 패턴:
- 개인 기본값은 `~/.codex/config.toml` (Settings → Configuration → Open config.toml from the Codex app)
- 리포 특정 동작은 `.codex/config.toml`
- CLI 사용 시 일회성 상황에만 커맨드라인 오버라이드

[`config.toml`](../configuration/config-basic.md)은 MCP 서버, 프로필, 멀티 에이전트 셋업, 기능 플래그 같은 영구 선호 정의 위치. 직접 편집 또는 Codex에 갱신 요청.

Codex는 운영 레벨 샌드박싱 + 통제 가능한 두 핵심 노브:
- 승인 모드: Codex가 명령 실행 권한 묻는 시점
- 샌드박스 모드: Codex가 디렉터리에서 읽기·쓰기 가능 여부 + 에이전트 액세스 가능 파일

코딩 에이전트 처음이면 기본 권한으로 시작. 승인·샌드박싱을 기본 tight 유지 + 신뢰 리포·특정 워크플로의 필요 명확해진 후에만 권한 느슨.

> CLI, IDE, Codex 앱 모두 같은 설정 레이어 공유. → [샘플 설정](../configuration/config-sample.md)

실제 환경에 Codex 일찍 구성. 많은 품질 이슈가 실제 셋업 이슈 — 잘못된 작업 디렉터리, 쓰기 액세스 누락, 잘못된 모델 기본값, 도구·connector 누락.

## 테스트·리뷰로 신뢰성 향상

Codex에 변경 요청에서 멈추지 말 것. 필요 시 테스트 생성, 관련 체크 실행, 결과 확인, 수용 전 작업 리뷰 요청.

Codex가 이 루프 가능, "good"이 무엇인지 알 때만. 가이드는 prompt나 `AGENTS.md`에서.

포함:
- 변경에 테스트 작성·갱신
- 올바른 테스트 셋 실행
- Lint, formatting, 타입 체크
- 최종 동작이 요청과 매치 확인
- 버그·회귀·위험 패턴 위해 diff 검토

Codex 앱의 diff 패널 토글로 [변경을 로컬에서 직접 검토](../ide/app-review.md). 특정 행 클릭 → 다음 Codex 턴 컨텍스트로 들어갈 피드백 제공.

여기서 유용한 옵션 — `/review` 슬래시 명령:
- PR 스타일 리뷰용 base 브랜치 대비 리뷰
- Uncommitted 변경 리뷰
- Commit 리뷰
- 커스텀 리뷰 instructions

팀이 `code_review.md` 파일 + `AGENTS.md`에서 참조 → Codex가 리뷰 동안 그 가이드도 따름. 리포·기여자 전반 리뷰 동작 일관성 유지 원하는 팀에 강한 패턴.

> Codex가 코드 생성만 아님. 올바른 instructions로 **테스트, 체크, 리뷰**도 도움.

GitHub Cloud 사용 → Codex가 [PR에 코드 리뷰 실행](../web/integrations-github.md) 셋업. OpenAI에선 Codex가 PR 100% 리뷰. 자동 리뷰 활성화 또는 `@Codex` 시 reactive 리뷰 가능.

## 외부 컨텍스트엔 MCP

Codex가 필요한 컨텍스트가 리포 외부에 있을 때 MCP. 이미 사용하는 도구·시스템에 Codex 연결 → 라이브 정보를 prompt에 계속 복붙할 필요 없음.

[MCP](../configuration/mcp.md)는 Codex를 외부 도구·시스템에 연결하는 open standard.

MCP 사용 시:
- 필요 컨텍스트가 리포 외부
- 데이터가 자주 변경
- Codex가 paste된 instructions에 의존 대신 도구 사용 원함
- 사용자·프로젝트 전반 반복 가능 통합 필요

Codex가 STDIO와 Streamable HTTP 서버 with OAuth 모두 지원.

Codex 앱 → Settings → MCP servers로 커스텀·추천 서버 보기. 자주 Codex가 필요 서버 설치 도움. 요청만 하면 됨. CLI에서 `codex mcp add` 명령으로 이름·URL·기타 디테일과 커스텀 서버 추가도.

> 도구는 실제 워크플로 unlock할 때만 추가. 사용하는 모든 도구 wiring으로 시작 안 함. 자주 하는 수동 루프 명확히 제거하는 1-2개 도구로 시작 → 거기서 확장.

## 반복 작업을 스킬로

워크플로가 반복 가능 → 긴 prompt나 반복 back-and-forth 의존 멈추기. [Skill](../configuration/skills.md)로 instructions를 SKILL.md 파일에 패키지 + Codex가 일관 적용해야 할 컨텍스트·지원 로직.스킬은 CLI, IDE 확장, Codex 앱 전반 동작.

각 스킬을 한 일에 집중 유지. 2-3개 구체 use case로 시작, 명확한 입력·출력 정의, 스킬이 무엇을 하고 언제 사용하는지 description 작성. 사용자가 실제 말할 트리거 phrase 종류 포함.

> 처음부터 모든 엣지 케이스 커버 시도 안 함. 한 대표 작업으로 시작 → 잘 동작시키기 → 그 워크플로를 스킬로 변환 → 거기서 개선.

좋은 rule of thumb: 같은 prompt 계속 재사용 또는 같은 워크플로 계속 수정 → 아마 스킬이 되어야.

스킬 특히 유용한 반복 작업:
- 로그 triage
- 릴리스 노트 초안
- 체크리스트 대비 PR 리뷰
- 마이그레이션 계획
- 텔레메트리·사고 요약
- 표준 디버깅 플로

`$skill-creator` 스킬이 첫 버전 scaffold에 최선 출발점. 반복 동안 첫 버전 로컬 유지. 광범위 공유 준비되면 [플러그인](../configuration/plugins-build.md)으로 패키지. 스킬의 가장 중요 부분 중 하나는 description — 스킬이 무엇을 하고 언제 사용하는지.

개인 스킬은 `$HOME/.agents/skills`, 공유 팀 스킬은 리포 안 `.agents/skills`에 체크인. 새 팀원 온보딩에 특히 유용.

## 반복 작업엔 automations

워크플로 안정 → Codex가 백그라운드에서 실행하도록 스케줄. Codex 앱의 [automations](../ide/app-automations.md)로 반복 작업의 프로젝트, prompt, cadence, 실행 환경 선택.

작업이 반복 → Codex 앱의 Automations 탭에서 자동화 생성. 어느 프로젝트에서 실행, 어느 prompt 실행 (스킬 호출 가능), 어느 cadence로 실행 선택. 자동화가 전용 git worktree에서 실행 또는 로컬 환경에서 실행 선택도. → [git worktrees](../ide/app-worktrees.md)

좋은 후보:
- 최근 commit 요약
- 가능 버그 스캔
- 릴리스 노트 초안
- CI 실패 체크
- Standup 요약 생산
- 스케줄로 반복 분석 워크플로 실행

> 유용한 룰: 스킬은 방법 정의, 자동화는 스케줄 정의. 워크플로가 여전히 많은 steering 필요 → 먼저 스킬로. 예측 가능해지면 자동화가 force multiplier.

자동화를 reflection·maintenance에 사용 — 단순 실행 아님. 최근 세션 검토, 반복 마찰 요약, prompt·instructions·워크플로 셋업을 시간 지나며 개선.

## 세션 통제로 장기 작업 조직

Codex 세션은 채팅 히스토리만 아님 — 시간 지나며 컨텍스트, 결정, 액션 축적하는 작업 스레드. 잘 관리가 품질에 큰 영향.

Codex 앱 UI가 스레드 관리 가장 쉬움 — 스레드 pin + worktree 생성. CLI 사용 시 특히 유용한 [슬래시 명령](../cli/slash-commands.md):

- `/experimental` — 실험 기능 토글 + `config.toml`에 추가
- `/resume` — 저장 대화 재개
- `/fork` — 원본 트랜스크립트 보존하며 새 스레드 생성
- `/compact` — 스레드 길어지고 이전 컨텍스트 요약 버전 원할 때. Codex가 자동 압축도 함.
- `/agent` — 병렬 에이전트 실행 중 활성 에이전트 스레드 사이 전환
- `/theme` — 신택스 하이라이트 테마 선택
- `/apps` — Codex에서 직접 ChatGPT 앱 사용
- `/status` — 현재 세션 상태 검사

> 일관 작업 단위당 한 스레드 유지. 작업이 여전히 같은 문제 일부 → reasoning trail 보존 위해 같은 스레드에 머무는 게 자주 더 나음. 작업이 진짜 분기할 때만 fork.

Codex의 [서브에이전트](../concepts/subagents.md) 워크플로로 메인 스레드에서 경계 작업 offload. 메인 에이전트는 코어 문제에 집중 + 서브에이전트는 탐색·테스트·triage 같은 작업.

## 흔한 실수

Codex 처음 사용 시 회피:

- 영구 룰을 `AGENTS.md`나 스킬로 옮기는 대신 prompt에 overload
- 빌드·테스트 명령 최선 실행 디테일 안 줘서 에이전트가 자기 작업 못 보게 함
- 멀티스텝·복잡 작업에 계획 건너뛰기
- 워크플로 이해 전 Codex에 컴퓨터 풀 권한 부여
- git worktree 없이 같은 파일에 라이브 스레드 실행
- 수동으로 안정적이기 전 반복 작업을 자동화로 변환
- 자체 작업과 병렬 사용 대신 Codex를 단계별 watch해야 하는 것처럼 다룸
- 작업당 한 스레드 대신 프로젝트당 한 스레드 → 부풀린 컨텍스트 + 시간 지나며 더 나쁜 결과

---
원문: https://developers.openai.com/codex/app/features
동기화일: 2026-05-15
---

# Codex 앱 기능

> Codex 앱으로 할 수 있는 일

Codex 앱은 Codex 스레드를 병렬로 작업하는 집중 데스크톱 경험 — worktree 지원, 자동화, Git 기능 빌트인.

대부분 기능 macOS와 Windows 모두 가용. 플랫폼 특화 예외는 아래 노트.

## 프로젝트 간 멀티태스크

한 Codex 앱 윈도우로 프로젝트 간 작업. 코드베이스마다 프로젝트 추가 + 필요 시 전환.

[Codex CLI](../cli/overview.md)를 써봤다면 프로젝트는 특정 디렉터리에서 세션 시작과 비슷.

리포 하나에 앱·패키지 2개 이상 작업하면 프로젝트별로 분리 → [샌드박스](../administration/agent-approvals-security.md)가 그 프로젝트 파일만 포함.

## Skills 지원

CLI·IDE 확장과 같은 [에이전트 스킬](../configuration/skills.md) 지원. 사이드바 Skills 클릭으로 팀이 다른 프로젝트에서 만든 새 스킬 보기·탐색.

## 자동화

스킬과 [automations](app-automations.md) 결합 — 텔레메트리 에러 평가·fix 제출, 최근 코드베이스 변경 리포트 같은 루틴 작업. 한 스레드에 머물러야 할 진행 작업은 [thread automation](app-automations.md).

## 모드

각 스레드는 선택 모드에서 실행. 스레드 시작 시 선택:

- **Local**: 현재 프로젝트 디렉터리에서 직접 작업
- **Worktree**: Git worktree에 변경 격리. → [상세](app-worktrees.md)
- **Cloud**: 설정된 클라우드 환경에서 원격 실행

**Local**과 **Worktree** 둘 다 컴퓨터에서 실행.

용어·개념 전체: [개념 섹션](../concepts/prompting.md)

## 빌트인 Git 도구

흔한 Git 기능을 앱 안에서 직접 제공.

diff 패널은 로컬 프로젝트·worktree 체크아웃의 Git diff 표시. Codex가 다룰 인라인 코멘트 추가 + 특정 chunk나 전체 파일 stage·revert.

로컬·worktree 작업의 commit, push, PR 생성도 앱 안에서 직접.

더 고급 Git 작업: [통합 터미널](#통합-터미널)

## Worktree 지원

새 스레드 생성 시 **Local** 또는 **Worktree** 선택. **Local**은 프로젝트 안 직접 작업. **Worktree**는 새 [Git worktree](https://git-scm.com/docs/git-worktree) 생성 → 변경이 일반 프로젝트와 격리.

**Worktree** 사용 시점:
- 현재 작업 건드리지 않고 새 아이디어 시도
- Codex가 같은 프로젝트에서 독립 작업 나란히 실행

자동화는 Git 리포에는 전용 백그라운드 worktree에서, 비-버전 관리 프로젝트는 프로젝트 디렉터리에서 직접 실행.

→ [Worktree 자세히](app-worktrees.md)

## 통합 터미널

각 스레드에 현재 프로젝트·worktree 스코프 빌트인 터미널. 우상단 터미널 아이콘 또는 Cmd+J로 토글.

변경 검증, 스크립트 실행, Git 작업을 앱 떠나지 않고 수행. Codex도 현재 터미널 출력 읽기 가능 — 실행 중 dev 서버 상태 확인 또는 실패한 빌드 다시 참조 가능.

흔한 작업:
- `git status`
- `git pull --rebase`
- `pnpm test` 또는 `npm test`
- `pnpm run lint` 또는 유사 프로젝트 명령

자주 실행하는 작업은 [로컬 환경](app-local-environments.md) 안에 **action** 정의 → 앱 윈도우 상단 단축키 버튼 추가.

> Cmd+K는 명령 팔레트 — 터미널 clear 안 함. 터미널 clear는 Ctrl+L.

## 네이티브 Windows 샌드박스

Windows에서 Codex가 WSL·VM 없이 PowerShell 네이티브 실행 + 네이티브 Windows 샌드박스. Windows 네이티브 워크플로 유지 + 경계 권한 유지.

→ [Windows 셋업·샌드박싱](app-windows.md)

## 음성 dictation

Codex prompt에 음성 사용. composer 보일 때 Ctrl+M 누르고 말하기. 전사. 전사된 prompt 편집 또는 전송 → Codex 작업 시작.

## Floating pop-out 윈도우

활성 대화 스레드를 별도 윈도우로 pop out → 적극 작업하는 곳으로 이동. 프론트엔드 작업에 이상적 — 브라우저·에디터·디자인 미리보기 옆에 스레드 유지하며 빠르게 반복.

워크플로 전반에서 보이게 하려면 pop-out 윈도우 stay on top 토글.

## In-app 브라우저

[in-app 브라우저](app-browser.md)로 로컬 dev 서버, 파일 백엔드 미리보기, 로그인 불필요 공개 페이지 미리보기·검토·코멘트 — 웹 앱 반복하면서.

> in-app 브라우저는 인증 플로, 로그인 페이지, 일반 브라우저 프로필, 쿠키, 확장, 기존 탭 미지원.

브라우저 코멘트로 페이지의 특정 요소·영역 표시 → Codex에 그 피드백 다루도록 요청.

Codex가 페이지를 직접 운영하려면 로컬 dev 서버·파일 백엔드 페이지에 [browser use](app-browser.md). Browser 플러그인, 허용 웹사이트, 차단 웹사이트는 설정에서 관리.

## Computer use

[Computer use](app-computer-use.md)는 Codex가 macOS 앱을 보고·클릭·타이핑해 운영하도록 도움. 데스크톱 앱 테스트, 브라우저·시뮬레이터 플로 체크, 플러그인 미가용 데이터 소스 작업, 앱 설정 변경, GUI-only 버그 재현에 유용.

> Computer use는 프로젝트 워크스페이스 외부 앱·시스템 상태 영향 가능 → 작업 좁게 유지 + 진행 전 권한 prompt 검토.

> 출시 시점 EU/UK/스위스 미가용.

## 비-코드 artifact 작업

작업이 비-코드 artifact 생산 시 사이드바가 PDF, 스프레드시트, 문서, 프레젠테이션 미리보기. Codex에 소스 데이터, 기대 파일 타입, 구조, 중요한 검토 기준 제공.

스프레드시트·프레젠테이션은 시트, 컬럼, 차트, 슬라이드 섹션, 중요한 체크 기술. 출력 저장 위치 + 결과 체크 방법 설명 요청.

작업 사이드바로 스레드 실행 중 Codex 동작 follow. 에이전트 계획, 출처, 생성 artifact, 작업 요약 표시 → 작업 조정·생성 파일 검사·다시 패스 필요한 것 결정.

## IDE 확장과 sync

에디터에 [Codex IDE 확장](overview.md) 설치 시 같은 프로젝트면 Codex 앱과 IDE 확장 자동 sync.

sync 시 Codex 앱 composer에 **IDE context** 옵션 표시. "Auto context" 활성 시 Codex 앱이 보고 있는 파일 추적 → 간접 참조 가능 (예: "What's this file about?"). IDE 확장 안에서 Codex 앱 실행 스레드 + 그 반대도 보기 가능.

앱이 컨텍스트 포함하는지 모르겠으면 OFF + 같은 질문 다시 → 결과 비교.

## Thread automations

자동화는 단일 스레드에 attach 가능. 이 thread automation은 스레드 컨텍스트 보존하는 반복 wake-up 호출 → Codex가 장기 작업 체크, 새 정보 위해 소스 폴, 후속 루프 계속. 스케줄로 같은 대화에 계속 돌아가야 할 heartbeat 스타일 자동화에 사용.

다음 실행이 현재 대화에 의존 → thread automation. Codex가 1개 이상 프로젝트의 새 반복 작업 시작 → standalone 또는 프로젝트 [automation](app-automations.md).

## 승인과 샌드박싱

승인·샌드박스 설정이 Codex 액션 제약.

- 승인: 명령 실행 전 Codex가 일시정지하는 시점
- 샌드박스: Codex가 사용할 수 있는 디렉터리·네트워크 액세스

"approve once", "approve for this session" 같은 prompt → 도구 실행에 다른 스코프 권한 부여. 모르겠으면 가장 좁은 옵션 승인 + 반복.

기본적으로 Codex는 작업을 현재 프로젝트로 스코프. 대부분 옳은 제약.

작업이 리포·디렉터리 1개 초과 필요 → Codex가 프로젝트 root 외부 roam 요청 대신 별도 프로젝트 또는 worktree 우선.

워크스페이스에 [자동 리뷰](../administration/agent-approvals-security.md) 가용 시 권한 selector에서 선택 가능. 같은 샌드박스 경계 유지 + 자격 승인 요청을 사용자 대기 대신 설정된 리뷰 정책으로 라우팅.

→ 상위 개요: [샌드박싱](../concepts/sandboxing.md), 설정: [agent approvals & security](../administration/agent-approvals-security.md)

## MCP 지원

Codex 앱·CLI·IDE 확장은 [MCP](../configuration/mcp.md) 설정 공유. 한 곳에서 MCP 서버 설정하면 다른 곳도 자동 채택. 새 서버 설정 → 앱 설정의 MCP 섹션에서 추천 서버 활성화 또는 새 서버 추가.

## 웹 검색

first-party 웹 검색 도구. 로컬 작업에서 기본 활성화 + 웹 검색 캐시 결과 제공. 샌드박스를 [full access](../administration/agent-approvals-security.md)로 설정 시 라이브 결과 기본. → [Config basics](../configuration/config-basic.md)에서 비활성화·라이브 전환.

## 이미지 생성

스레드에서 Codex에 이미지 생성·편집 요청. UI 자산, 배너, 배경, 일러스트, 스프라이트 시트, placeholder를 코드와 함께 생성에 유용. 기존 자산 변형·확장에는 참조 이미지 추가.

자연어 또는 prompt에 `$imagegen` 명시.

내장 이미지 생성은 `gpt-image-2` — 일반 Codex 사용량 한도 카운트, 비슷한 턴 대비 평균 3-5배 빠르게 한도 소진. → [Pricing](../getting-started/pricing.md)

대량: `OPENAI_API_KEY` 환경 변수 + API 경로.

## 이미지 입력

prompt composer에 이미지 드래그·드롭으로 컨텍스트 포함. 드롭 시 `Shift` 누르기.

시스템 이미지 보기 요청도 가능. 작업 중인 앱 스크린샷 도구로 Codex에 작업 검증.

## Chats

특정 프로젝트 폴더·Git 리포 불필요한 작업 → chat 시작. 리서치, triage, 계획, 플러그인 위주 워크플로 등 — 코드베이스 편집 대신 connected 도구 사용.

Chat은 Codex 홈 아래 Codex 관리 `threads` 디렉터리를 작업 위치로. 기본 `~/.codex/threads`.

## Memories

[Memories](../concepts/memories.md) 가용 시 — 과거 작업의 유용한 컨텍스트를 미래 스레드로. 안정적 선호, 프로젝트 컨벤션, 반복 작업 패턴, 알려진 함정에 가장 유용.

## 알림

기본적으로 앱 백그라운드일 때 작업 완료·승인 필요 시 Codex 앱 알림 전송.

설정에서 알림 안 함 또는 항상 (focus 중에도) 선택.

## 컴퓨터 깨우기

작업이 시간 걸릴 수 있음 → 앱 설정의 "Prevent sleep while running" 토글로 컴퓨터 sleep 방지.

## 참고

- [Settings](app-settings.md)
- [Automations](app-automations.md)
- [In-app 브라우저](app-browser.md)
- [Computer use](app-computer-use.md)
- [Review 패널](app-review.md)
- [Local 환경](app-local-environments.md)
- [Worktrees](app-worktrees.md)

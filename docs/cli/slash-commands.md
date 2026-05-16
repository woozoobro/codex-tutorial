---
원문: https://developers.openai.com/codex/cli/slash-commands
동기화일: 2026-05-15
---

# CLI 슬래시 명령어

> 인터랙티브 세션 중 Codex 제어

슬래시 명령어는 키보드 우선의 빠른 제어를 제공한다. composer에서 `/`를 누르면 슬래시 popup이 열리고, 명령을 선택하면 모델 전환·권한 조정·긴 대화 요약 같은 작업을 터미널에서 바로 실행한다.

이 가이드는:
- 작업에 맞는 빌트인 슬래시 명령어 찾기
- `/model`, `/fast`, `/personality`, `/permissions`, `/agent`, `/status` 같은 명령으로 활성 세션 조정

## 빌트인 슬래시 명령어 일람

작업이 이미 실행 중일 때 슬래시 명령을 입력하고 `Tab`을 누르면 다음 턴으로 큐잉된다. 큐잉된 명령은 실행 시점에 파싱되므로, 메뉴와 에러는 현재 턴 종료 후 표시. 큐잉 전 슬래시 자동완성은 그대로 동작.

| 명령 | 목적 | 사용 시점 |
| --- | --- | --- |
| [`/permissions`](#permissions로-권한-갱신) | Codex가 묻지 않고 할 수 있는 범위 설정 | 세션 중 Auto ↔ Read Only 전환 |
| [`/sandbox-add-read-dir`](#sandbox-add-read-dir-windows) | 추가 디렉터리에 샌드박스 읽기 권한 (Windows 전용) | 현재 읽기 가능 루트 외부 절대 경로가 필요할 때 |
| [`/agent`](#agent로-에이전트-스레드-전환) | 활성 에이전트 스레드 전환 | spawned 서브에이전트 스레드 검사·이어가기 |
| [`/apps`](#apps로-앱-탐색) | 앱(connectors) 탐색 + 프롬프트 삽입 | 앱을 `$app-slug`로 첨부 후 Codex에 사용 요청 |
| [`/plugins`](#plugins로-플러그인-탐색) | 설치된·발견 가능한 플러그인 탐색 | 플러그인 도구 검사, 추천 설치, 활성/비활성 관리 |
| [`/hooks`](#hooks로-훅-검토) | 라이프사이클 훅 검토 | 훅 검사, 신규/변경 훅 신뢰, 비-managed 훅 비활성화 |
| [`/clear`](#clear로-터미널-초기화--새-채팅) | 터미널 + 채팅 초기화 | UI와 대화를 함께 리셋 |
| [`/compact`](#compact로-트랜스크립트-요약) | 보이는 대화를 요약해 토큰 절약 | 긴 작업 후 핵심 유지 + 컨텍스트 윈도우 보호 |
| [`/copy`](#copy로-최신-응답-복사) | 마지막 완료된 Codex 출력 복사 | 수동 선택 없이 결과 잡기 (Ctrl+O 단축키) |
| [`/diff`](#diff로-변경사항-검토) | Git diff (untracked 파일 포함) | 커밋·테스트 전 Codex 편집 검토 |
| [`/exit`](#quitexit로-종료) | CLI 종료 (`/quit`과 동일) | 대안 철자 |
| [`/experimental`](#experimental로-실험-기능-토글) | 실험 기능 토글 | CLI에서 서브에이전트 같은 옵션 활성화 |
| [`/feedback`](#feedback로-피드백-전송) | 메인테이너에게 로그 전송 | 이슈 보고, 진단 공유 |
| [`/init`](#init으로-agentsmd-생성) | 현재 디렉터리에 `AGENTS.md` 스캐폴드 생성 | 리포·서브디렉터리에 영구 지시 캡처 |
| [`/logout`](#logout으로-로그아웃) | Codex 로그아웃 | 공용 머신에서 자격증명 정리 |
| [`/mcp`](#mcp로-mcp-도구-나열) | 설정된 MCP 도구 나열 | 세션에서 호출 가능한 외부 도구 확인. `verbose`로 서버 상세 |
| [`/mention`](#mention으로-파일-강조) | 대화에 파일 첨부 | 다음 턴에 검사할 특정 파일·폴더 지정 |
| [`/model`](#model로-모델-설정) | 활성 모델 (가능 시 reasoning effort) 선택 | `gpt-4.1-mini` ↔ deeper reasoning 전환 |
| [`/fast`](#fast로-fast-mode-토글) | 지원 모델의 Fast mode 토글 | on/off/status |
| [`/plan`](#plan으로-plan-mode-전환) | plan mode 전환, 선택적으로 프롬프트 전송 | 구현 전 실행 계획 제안 요청 |
| [`/goal`](#goal로-실험-goal-설정) | 장기 작업의 실험 목표 설정·확인 | 큰 작업 진행 중 추적할 영구 타깃 (`features.goals` 필요) |
| [`/personality`](#personality로-커뮤니케이션-스타일) | 응답 커뮤니케이션 스타일 선택 | 지시 수정 없이 더 간결·설명적·협력적으로 |
| [`/ps`](#ps로-백그라운드-터미널-확인) | 실험 백그라운드 터미널 + 최근 출력 표시 | 메인 트랜스크립트 떠나지 않고 장시간 명령 확인 |
| [`/stop`](#stop으로-백그라운드-터미널-중지) | 모든 백그라운드 터미널 중지 | 현재 세션이 시작한 백그라운드 작업 취소 |
| [`/fork`](#fork로-현재-대화-fork) | 현재 대화를 새 스레드로 fork | 트랜스크립트 잃지 않고 새 접근 시도 |
| [`/side`](#side로-사이드-대화) | 일회성 사이드 대화 시작 | 메인 스레드 방해 없이 집중 후속 질문 |
| [`/resume`](#resume으로-저장된-대화-재개) | 세션 목록에서 저장된 대화 재개 | 이전 CLI 세션에서 이어가기 |
| [`/new`](#new로-새-대화-시작) | 같은 CLI 세션 안에서 새 대화 | CLI 떠나지 않고 같은 리포에서 새 프롬프트 |
| [`/quit`](#quitexit로-종료) | CLI 종료 | 즉시 떠나기 |
| [`/review`](#review로-작업-트리-리뷰) | Codex에 작업 트리 리뷰 요청 | 작업 후 또는 로컬 변경 second-pair-of-eyes |
| [`/status`](#status로-세션-검사) | 세션 설정 + 토큰 사용량 표시 | 활성 모델, 승인 정책, 쓰기 가능 루트, 남은 컨텍스트 확인 |
| [`/debug-config`](#debug-config로-config-레이어-검사) | 설정 레이어 + 요구사항 진단 | 우선순위·정책 디버그 (실험 네트워크 제약 포함) |
| [`/statusline`](#statusline으로-푸터-구성) | TUI 상태줄 필드 인터랙티브 구성 | 푸터 항목 선택·재정렬, `config.toml` 영구 저장 |
| [`/title`](#title로-터미널-타이틀-구성) | 터미널 창/탭 타이틀 필드 인터랙티브 구성 | 프로젝트, 상태, 스레드, 브랜치, 모델, 작업 진행 등 |
| [`/keymap`](#keymap으로-tui-단축키-재배치) | TUI 키보드 단축키 재배치 | 커스텀 바인딩 검사·영구 저장 |

`/quit`과 `/exit` 모두 CLI 종료. 중요한 작업은 저장·커밋 후.

`/approvals`는 별칭으로 동작하지만 슬래시 popup 목록에는 더 이상 표시되지 않음.

---

## 세션 제어 명령어

### `/model`로 모델 설정

1. Codex 시작 → composer 열기
2. `/model` + Enter
3. popup에서 모델 선택 (예: `gpt-4.1-mini`, `gpt-4.1`)

기대: 트랜스크립트에 새 모델 확인 메시지. `/status`로 검증.

### `/fast`로 Fast mode 토글

1. `/fast on`, `/fast off`, `/fast status`
2. 영구화하려면 Codex가 저장 제안 시 확인

기대: 현재 스레드의 Fast mode 상태 보고. TUI 푸터에 Fast mode 항목 표시: `/statusline`.

### `/personality`로 커뮤니케이션 스타일

프롬프트 다시 쓰지 않고 Codex 커뮤니케이션 변경.

1. 대화 중 `/personality` + Enter
2. popup에서 스타일 선택

지원: `friendly`, `pragmatic`, `none`. `none`은 personality 지시 비활성화.

활성 모델이 personality 지시를 지원하지 않으면 명령 숨김.

### `/plan`으로 plan mode 전환

1. `/plan` + Enter → plan mode
2. 인라인 프롬프트 가능 (예: `/plan Propose a migration plan for this service`)
3. 인라인 인자 사용 시에도 콘텐츠 붙여넣기·이미지 첨부 가능

작업 실행 중에는 일시 사용 불가.

### `/goal`로 실험 goal 설정

`/goal`은 실험 기능, `features.goals` 활성화 시만. `/experimental`로 토글 또는 `config.toml`의 `[features]`에 `goals = true`.

1. `/goal <text>` (예: `/goal Finish the migration and keep tests green`)
2. `/goal` — 현재 목표 보기
3. `/goal pause`, `/goal resume`, `/goal clear`

### `/experimental`로 실험 기능 토글

1. `/experimental` + Enter
2. 원하는 기능 토글 (예: Apps, Smart Approvals), 필요 시 재시작

기대: config에 저장 + 재시작 시 적용.

### `/clear`로 터미널 초기화 + 새 채팅

1. `/clear` + Enter

기대: 터미널 초기화 + 트랜스크립트 리셋 + 같은 CLI 세션 안에서 새 채팅.

Ctrl+L과 다름: Ctrl+L은 화면만 지움, 현재 채팅 유지. 작업 중에는 둘 다 비활성.

### `/permissions`로 권한 갱신

1. `/permissions` + Enter
2. 승인 프리셋 선택 (예: 무인 작업 `Auto`, 검토 `Read Only`)

기대: 정책 변경 알림. 다시 변경 전까지 미래 액션이 새 모드 따름.

### `/copy`로 최신 응답 복사

1. `/copy` + Enter

기대: 마지막 완료된 Codex 출력을 클립보드로.

진행 중 턴이 있으면 진행 중 응답 대신 마지막 완료된 출력 사용. 첫 완료 출력 전, 롤백 직후엔 사용 불가.

메인 TUI에서 Ctrl+O로도 복사 가능.

### `/sandbox-add-read-dir` (Windows)

CLI 네이티브 Windows에서만 가능.

1. `/sandbox-add-read-dir C:\absolute\directory\path` + Enter
2. 경로가 존재하는 절대 디렉터리인지 확인

기대: Windows 샌드박스 정책 새로고침 + 이후 샌드박스 명령에 읽기 권한 부여.

### `/status`로 세션 검사

1. `/status`
2. 활성 모델, 승인 정책, 쓰기 가능 루트, 토큰 사용량 검토

쉘의 `codex status` 출력과 같은 요약.

### `/debug-config`로 config 레이어 검사

1. `/debug-config`
2. config 레이어 순서 (가장 낮은 우선순위 먼저), on/off, 정책 출처 검토

설정된 경우 `allowed_approval_policies`, `allowed_sandbox_modes`, `mcp_servers`, `rules`, `enforce_residency`, `experimental_network` 같은 정책도 표시.

`config.toml`과 effective 설정이 다를 때 디버그용.

### `/statusline`으로 푸터 구성

1. `/statusline`
2. picker로 항목 토글·재정렬 → 확인

기대: 푸터 즉시 갱신 + `tui.status_line` (config.toml) 저장.

가능 항목: model, model+reasoning, context stats, rate limits, git branch, token counters, session id, current directory/project root, Codex version.

### `/title`로 터미널 타이틀 구성

1. `/title`
2. picker로 토글·재정렬 → 확인

기대: 즉시 갱신 + `tui.terminal_title` 저장.

가능 항목: app name, project, spinner, status, thread, git branch, model, task progress.

### `/keymap`으로 TUI 단축키 재배치

1. `/keymap`
2. 변경할 컨텍스트와 액션 선택
3. 새 바인딩 입력 또는 기존 제거

기대: 액티브 키맵 갱신 + `tui.keymap` 저장.

키 이름: `ctrl-a`, `shift-enter`, `page-down` 등. 컨텍스트 바인딩이 `tui.keymap.global` 오버라이드. 빈 바인딩 리스트는 액션 unbind.

### `/ps`로 백그라운드 터미널 확인

1. `/ps`
2. 백그라운드 터미널 목록 + 상태 검토

기대: 각 터미널의 명령 + 최근 비어있지 않은 출력 3줄까지 표시.

`unified_exec` 사용 중에만 등장. 아니면 빈 목록.

### `/stop`으로 백그라운드 터미널 중지

1. `/stop`
2. 확인 요청 시 승인

기대: 현재 세션 모든 백그라운드 터미널 중지. `/clean`은 별칭.

### `/compact`로 트랜스크립트 요약

1. 긴 교환 후 `/compact`
2. Codex가 요약 제안 시 확인

기대: 이전 턴을 간결한 요약으로 교체, 핵심 유지하며 컨텍스트 절약.

### `/diff`로 변경사항 검토

1. `/diff`
2. CLI 안에서 출력 스크롤

기대: staged, unstaged, untracked 변경 모두 표시 → 어떤 것 유지할지 결정.

### `/mention`으로 파일 강조

1. `/mention <path>` (예: `/mention src/lib/api.ts`)
2. popup에서 결과 선택

기대: 파일을 대화에 추가 → 후속 턴이 직접 참조.

### `/new`로 새 대화 시작

1. `/new` + Enter

기대: 같은 CLI 세션에서 새 대화. `/clear`와 다른 점: 현재 터미널 view를 먼저 지우지 않음.

### `/resume`으로 저장된 대화 재개

1. `/resume` + Enter
2. picker에서 세션 선택

기대: 선택 대화 트랜스크립트 리로드, 원본 히스토리 유지.

### `/fork`로 현재 대화 fork

1. `/fork` + Enter

기대: 현재 대화를 새 ID의 새 스레드로 클론, 원본 트랜스크립트 보존 → 병렬 대안 탐색.

저장된 세션을 fork하려면 터미널에서 `codex fork`로 picker 열기.

### `/side`로 사이드 대화

`/side`는 메인 작업에서 떠나지 않고 일회성 fork.

1. `/side` → 사이드 대화 열기
2. 인라인 텍스트 가능 (예: `/side Check whether this plan has an obvious risk`)
3. 집중 후속 질문 끝나면 부모 스레드로 복귀

기대: 부모와 분리된 트랜스크립트의 사이드 대화. 사이드 모드 동안에도 TUI는 부모 스레드 상태 표시 → 메인 작업 진행 여부 확인 가능.

다른 사이드 대화 안, review 모드에서는 사용 불가.

### `/init`으로 AGENTS.md 생성

1. 영구 지시를 둘 디렉터리에서 `/init`
2. 생성된 `AGENTS.md` 검토 → 리포 컨벤션에 맞게 편집

기대: `AGENTS.md` 스캐폴드 생성 → 다음 세션을 위해 다듬고 커밋.

### `/review`로 작업 트리 리뷰

1. `/review`
2. 정확한 파일 변경을 보려면 `/diff`로 후속

기대: 작업 트리에서 발견한 이슈 요약 (행동 변경, 누락 테스트 중심). 현재 세션 모델 사용, `config.toml`의 `review_model`로 오버라이드 가능.

### `/mcp`로 MCP 도구 나열

1. `/mcp`
2. 어떤 MCP 서버·도구가 가능한지 확인

`/mcp verbose`로 상세 진단. `verbose` 외 인자 → 사용법 표시.

### `/apps`로 앱 탐색

1. `/apps`
2. 목록에서 앱 선택

기대: composer에 `$app-slug`로 앱 mention 삽입 → 즉시 사용 요청 가능.

### `/plugins`로 플러그인 탐색

1. `/plugins`
2. 마켓플레이스 탭 선택 → 플러그인 검사

기대: 플러그인 브라우저 열림 → 설치/발견 가능 플러그인, 설치 상태 검토. 설치된 플러그인에서 Space로 enabled 토글.

### `/hooks`로 훅 검토

1. `/hooks`
2. 훅 이벤트 선택 → 매칭 핸들러 검사
3. 비-managed 훅에 대해 신뢰/비활성/재활성

기대: 훅 브라우저. Managed 훅은 managed 표시, 사용자 훅 브라우저에서 비활성화 불가.

### `/agent`로 에이전트 스레드 전환

1. `/agent` + Enter
2. picker에서 스레드 선택

기대: 활성 스레드 전환 → 해당 에이전트 작업 검사·이어가기.

### `/feedback`로 피드백 전송

1. `/feedback` + Enter
2. 로그·진단 포함 prompt 따르기

기대: 요청된 진단 수집 → 메인테이너에게 제출.

### `/logout`으로 로그아웃

1. `/logout` + Enter

기대: 현재 사용자 세션의 로컬 자격증명 정리.

### `/quit`/`/exit`로 종료

1. `/quit` (또는 `/exit`) + Enter

기대: 즉시 종료. 중요한 작업은 먼저 저장·커밋.

---
원문: https://developers.openai.com/codex/app/worktrees
동기화일: 2026-05-15
---

# Worktrees

> Codex 앱에서 Git worktree로 Codex가 병렬 작업

Worktree는 같은 프로젝트에서 여러 독립 작업을 서로 간섭 없이 실행. Git 리포의 [automations](app-automations.md)는 전용 백그라운드 worktree에서 실행 → 진행 작업과 충돌 안 함. 비-버전 관리 프로젝트는 프로젝트 디렉터리에서 직접. worktree에서 수동 스레드 시작 + Handoff로 Local과 Worktree 사이 스레드 이동도.

## Worktree란

Worktree는 Git 리포에 속한 프로젝트만 동작 — 내부적으로 [Git worktree](https://git-scm.com/docs/git-worktree) 사용. Worktree는 리포의 두 번째 사본 ("checkout") 생성. 각 worktree는 자체 파일 사본 + 같은 메타데이터 (`.git` 폴더 — commit, branch 등) 공유. 여러 브랜치 병렬 체크아웃·작업 가능.

## 용어

- **Local checkout**: 사용자가 만든 리포. 앱에서 그냥 **Local**.
- **Worktree**: 앱에서 로컬 체크아웃으로부터 만든 [Git worktree](https://git-scm.com/docs/git-worktree).
- **Handoff**: Local과 Worktree 사이 스레드 이동 플로. Codex가 둘 사이 작업 안전 이동에 필요한 Git 작업 처리.

## Worktree 사용 이유

1. 현재 Local 셋업 방해하지 않고 Codex와 병렬 작업
2. 포어그라운드에 집중 유지하면서 백그라운드 작업 큐
3. 검사·테스트·협업 더 직접 원할 때 나중에 Local로 스레드 이동

## 시작하기

> Worktree는 Git 리포 필요. 선택 프로젝트가 Git 리포 안에 있는지 확인.

1. **Worktree 선택**: 새 스레드 view에서 composer 아래 **Worktree** 선택. 선택적으로 worktree에 셋업 스크립트 실행할 [로컬 환경](app-local-environments.md) 선택.
2. **시작 브랜치 선택**: composer 아래 worktree base가 될 Git 브랜치 선택. `main`/`master`, 기능 브랜치, 또는 unstaged 로컬 변경 있는 현재 브랜치.
3. **prompt 제출**: 작업 제출 → Codex가 선택 브랜치 base의 Git worktree 생성. 기본적으로 Codex는 [detached HEAD](https://git-scm.com/docs/git-checkout#_detached_head)에서 작업.
4. **계속 작업할 곳 선택**: 준비 시 worktree에서 직접 계속 작업 또는 로컬 체크아웃으로 핸드오프. 핸드오프는 스레드와 코드 둘 다 이동 → 다른 체크아웃에서 계속.

## Local과 Worktree 사이 작업

Worktree는 로컬 체크아웃과 비슷한 모양·느낌. 차이는 플로 안 위치. Local = 포어그라운드, Worktree = 백그라운드. Handoff로 둘 사이 스레드 이동.

내부적으로 Handoff는 두 체크아웃 사이 작업 안전 이동에 필요한 Git 작업 처리. **Git은 한 브랜치를 한 곳에서만 체크아웃 허용** — 한 worktree에서 브랜치 체크아웃하면 동시에 로컬 체크아웃에서 같은 브랜치 체크아웃 **불가**.

실무 두 흔한 경로:

1. [Worktree에서만 작업](#옵션-1-worktree에서-작업) — worktree에서 변경 직접 검증 가능할 때 (예: [로컬 환경 셋업 스크립트](app-local-environments.md)로 의존성·도구 설치)
2. [Local로 스레드 핸드오프](#옵션-2-local로-스레드-핸드오프) — 스레드를 포어그라운드로 가져오고 싶을 때 (예: 일반 IDE에서 변경 검사 또는 앱 인스턴스 1개만 실행 가능)

### 옵션 1: Worktree에서 작업

Worktree에서만 변경 유지하려면 스레드 헤더의 **Create branch here** 버튼으로 worktree를 브랜치로 변환.

여기서 변경 commit, 원격 리포에 브랜치 push, GitHub에서 PR 열기.

헤더 "Open" 버튼으로 worktree에서 IDE 열기, 통합 터미널 사용, worktree 디렉터리에서 필요한 작업 등.

> worktree에 브랜치 생성 시 다른 worktree (로컬 체크아웃 포함)에서 체크아웃 불가.

### 옵션 2: Local로 스레드 핸드오프

스레드를 포어그라운드로 → 스레드 헤더의 **Hand off** 클릭 → **Local**로 이동.

일반 IDE 윈도우에서 변경 읽기, 기존 dev 서버 실행, 일상 환경에서 작업 검증할 때 유용.

Codex가 worktree와 로컬 체크아웃 사이 안전 스레드 이동에 필요한 Git 단계 처리.

각 스레드는 시간 지나도 같은 연결된 worktree 유지. 나중에 worktree로 다시 핸드오프 시 Codex가 같은 백그라운드 환경으로 복귀 → 이어서 진행.

반대 방향도. Local에서 작업 중 포어그라운드 비우고 싶으면 **Hand off**로 스레드를 worktree로. Codex가 백그라운드에서 계속 작업 + 로컬에서 다른 것에 집중 전환.

> Handoff는 Git 작업 사용 → `.gitignore` 안 파일은 스레드와 함께 이동 안 함.

## 고급 디테일

### Codex 관리 worktree와 영구 worktree

기본적으로 스레드는 Codex 관리 worktree 사용. 가벼운·일회성 느낌. Codex 관리 worktree는 보통 한 스레드 전용, 나중에 다시 핸드오프 시 같은 worktree로 반환.

장기 환경 원하면 사이드바 프로젝트의 세 점 메뉴에서 영구 worktree 생성 → 자체 프로젝트로 새 영구 worktree. 영구 worktree는 자동 삭제 안 됨, 같은 worktree에서 여러 스레드 시작 가능.

### Codex가 worktree 관리 방식

Codex는 `$CODEX_HOME/worktrees`에 worktree 생성. 시작 commit은 스레드 시작 시 선택 브랜치의 `HEAD` commit. 로컬 변경 있는 브랜치 선택 시 uncommitted 변경도 worktree에 적용. Worktree는 브랜치로 체크아웃 안 됨 — [detached HEAD](https://git-scm.com/docs/git-checkout#_detached_head) 상태. → Codex가 브랜치 오염 없이 여러 worktree 생성 가능.

### 브랜치 제한

Codex가 worktree에서 작업 끝내고 **Create branch here**로 `feature/a` 브랜치 생성했다고 가정. 로컬 체크아웃에서 시도 시:
```
fatal: 'feature/a' is already used by worktree at '<path>'
```

해결: worktree에서 `feature/a` 대신 다른 브랜치 체크아웃.

브랜치를 로컬에 체크아웃 계획이면 같은 브랜치를 두 곳에 동시 체크아웃 시도 대신 Handoff로 스레드를 Local로 이동.

#### 이 제한이 있는 이유

Git은 같은 브랜치를 동시에 1개 초과 worktree에 체크아웃 못 하게 함 — 브랜치는 단일 가변 reference (`refs/heads/<name>`)로 그 의미가 작업 트리의 "현재 체크아웃 상태"이기 때문.

브랜치 체크아웃 시 Git은 그 HEAD를 그 worktree 소유로 취급 + commit, reset, rebase, merge 같은 작업이 그 reference를 well-defined·serialized 방식으로 진행 기대. 같은 브랜치를 동시에 여러 worktree에 체크아웃 허용은 어느 worktree 작업이 브랜치 reference 갱신할지 모호함·race condition 생성 → 잃어버린 commit, 일관성 없는 인덱스, 불명확 충돌 해결 가능.

worktree당 브랜치 1개 룰 강제로 Git이 각 브랜치에 단일 권위 작업 사본 보장 + 다른 worktree가 detached HEAD나 별도 브랜치로 같은 commit 안전 참조 가능.

### Worktree 정리

Worktree는 디스크 공간 많이 사용. 각각 자체 리포 파일, 의존성, 빌드 캐시 등. → 앱이 worktree 수를 합리적 한도로 유지.

기본 Codex가 가장 최근 15개 Codex 관리 worktree 유지. 한도 변경 또는 자동 삭제 OFF는 설정에서.

Codex는 여전히 중요한 worktree 삭제 회피. Codex 관리 worktree가 자동 삭제 안 되는 경우:
- 핀된 대화가 묶임
- 스레드 진행 중
- 영구 worktree

자동 삭제되는 경우:
- 연결 스레드 archive
- Codex가 설정 한도 안에 머물려 더 오래된 worktree 삭제 필요

Codex 관리 worktree 삭제 전 Codex가 작업 스냅샷 저장. worktree 삭제 후 대화 열면 복원 옵션 표시.

## FAQ

### Worktree 생성 위치 제어 가능?

오늘은 안 됨. Codex가 일관 관리 위해 `$CODEX_HOME/worktrees` 아래 생성.

### Local과 Worktree 사이 스레드 이동 가능?

예. 스레드 헤더 **Hand off**로 로컬 체크아웃과 worktree 사이 이동. Codex가 환경 사이 안전 이동에 필요한 Git 작업 처리. 나중에 worktree로 다시 핸드오프 시 같은 연결 worktree로 반환.

### Worktree 삭제 시 스레드는?

기저 worktree 디렉터리 삭제돼도 스레드는 히스토리에 남을 수 있음. Codex 관리 worktree는 삭제 전 스냅샷 저장 + 연결 스레드 다시 열면 복원 제공. 영구 worktree는 스레드 archive 시 자동 삭제 안 됨.

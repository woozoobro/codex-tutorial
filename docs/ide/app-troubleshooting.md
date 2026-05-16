---
원문: https://developers.openai.com/codex/app/troubleshooting
동기화일: 2026-05-15
---

# 트러블슈팅

> 흔한 Codex 앱 이슈 FAQ와 fix

## FAQ

### Codex가 편집 안 한 파일이 사이드 패널에 표시

프로젝트가 Git 리포 안이면 리뷰 패널이 자동으로 프로젝트 Git 상태 기반 변경 표시 — Codex가 안 만든 변경 포함.

리뷰 패널에서 staged 변경과 not yet staged 변경 전환, 브랜치를 main과 비교 가능.

마지막 Codex 턴 변경만 보려면 diff 패널을 "Last turn changes" view로 전환.

→ [리뷰 패널 사용법](app-review.md)

### 사이드바에서 프로젝트 제거

프로젝트 이름에 hover → 세 점 클릭 → "Remove". 복원: **Threads** 옆 **Add new project** 버튼 또는 Cmd+O로 재추가.

### Archived 스레드 찾기

Archived 스레드는 [Settings](codex://settings)에 있음. unarchive 시 사이드바 원위치에 다시 표시.

### 일부 스레드만 사이드바에 표시

사이드바는 프로젝트 상태에 따라 스레드 필터 가능. 스레드 누락 시 **Threads** 라벨 옆 필터 아이콘 → Chronological로 전환. 여전히 안 보이면 [Settings](codex://settings) → archived chats 또는 archived threads 섹션 체크.

### Worktree에서 코드 실행 안 됨

Worktree는 다른 디렉터리에 생성 + Git 체크인 파일만 상속. 의존성·도구 관리 방식에 따라 [로컬 환경](app-local-environments.md)으로 worktree에 셋업 스크립트 실행 필요할 수 있음. 또는 일반 로컬 프로젝트에 변경 체크아웃. → [worktree 문서](app-worktrees.md)

### 팀원 공유 로컬 환경 앱이 픽업 안 함

로컬 환경 설정은 프로젝트 root의 `.codex` 폴더 안에 있어야. 1개 초과 프로젝트의 monorepo 작업 시 `.codex` 폴더 포함 디렉터리에서 프로젝트 열기.

### Codex가 Apple Music 액세스 요청

작업에 따라 Codex가 파일시스템 탐색 필요할 수 있음. macOS의 Music, Downloads, Desktop 같은 특정 디렉터리는 추가 사용자 승인 필요. Codex가 홈 디렉터리 읽기 필요 시 macOS가 그 폴더 액세스 승인 prompt.

### 자동화가 worktree 많이 생성

잦은 자동화는 시간 지나며 많은 worktree 생성. 더 이상 필요 없는 자동화 실행 archive + worktree 유지 의도 아니면 실행 pin 피하기.

### 잘못된 타깃 선택 후 prompt 복구

잘못된 타깃 (**Local**, **Worktree**, **Cloud**)으로 실수 스레드 시작 → 현재 실행 취소 + composer에서 위 화살표 키로 이전 prompt 복구.

### CLI에선 동작하는 기능이 앱에선 안 됨

앱과 CLI는 같은 기저 Codex 에이전트·설정 사용하지만 어느 시점이든 다른 버전에 의존 가능, 일부 실험 기능은 CLI에 먼저 land 가능.

CLI 버전 확인:
```bash
codex --version
```

앱에 번들된 Codex 버전 확인:
```bash
/Applications/Codex.app/Contents/Resources/codex --version
```

## 피드백과 로그

메시지 composer에 `/` → 팀에 피드백 제공. 기존 대화에서 트리거 시 피드백과 함께 기존 세션 공유 선택 가능. 피드백 제출 후 팀과 공유 가능한 세션 ID 받음.

이슈 보고:
1. Codex GitHub 리포의 [기존 이슈](https://github.com/openai/codex/issues) 찾기
2. [새 GitHub 이슈](https://github.com/openai/codex/issues/new?template=2-bug-report.yml) 열기

추가 로그 위치:
- 앱 로그 (macOS): `~/Library/Logs/com.openai.codex/YYYY/MM/DD`
- 세션 트랜스크립트: `$CODEX_HOME/sessions` (기본 `~/.codex/sessions`)
- Archived 세션: `$CODEX_HOME/archived_sessions` (기본 `~/.codex/archived_sessions`)

> 로그 공유 시 민감 정보 없는지 먼저 검토.

## Stuck 상태와 회복 패턴

스레드가 stuck:
1. Codex가 승인 대기 중인지 체크
2. 터미널 열고 `git status` 같은 기본 명령 실행
3. 더 작고 집중된 prompt로 새 스레드 시작

worktree 생성 실수 취소 + prompt 잃음 → composer에서 위 화살표로 복구.

## 터미널 이슈

### 터미널 stuck

1. 터미널 패널 닫기
2. Cmd+J로 다시 열기
3. `pwd` 또는 `git status` 같은 기본 명령 재실행

명령 동작이 기대와 다르면 터미널에서 현재 디렉터리·브랜치 먼저 검증.

계속 stuck → 활성 Codex 스레드 완료까지 대기 + 앱 재시작.

### 폰트가 올바르게 렌더 안 됨

Codex는 리뷰 패널, 통합 터미널, 앱 안 표시 다른 코드에 같은 폰트 사용. [Settings](codex://settings) 패널에서 **Code font**로 구성.

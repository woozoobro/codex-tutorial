---
원문: https://developers.openai.com/codex/app/review
동기화일: 2026-05-15
---

# Review

> 앱 안에서 Codex 변경 검토·반복

리뷰 패널은 Codex가 무엇을 변경했는지 이해, 타겟 피드백 제공, 유지할 것 결정에 도움.

> Git 리포 안 프로젝트만 동작. Git 리포 아니면 리뷰 패널이 생성 prompt.

## 보이는 변경

리뷰 패널은 Git 리포 상태 반영 — Codex 편집만이 아님. 표시:
- Codex 변경
- 사용자 자체 변경
- 리포의 다른 uncommitted 변경

기본은 **uncommitted 변경**에 집중. 스코프 전환 가능:
- **All branch changes** (base 브랜치 대비 diff)
- **Last turn changes** (가장 최근 어시스턴트 턴만)

로컬 작업 시 **Unstaged**와 **Staged** 변경 사이 토글도.

## 리뷰 패널 탐색

- 파일 이름 클릭 → 보통 선택 에디터에서 그 파일 열림. 기본 에디터는 [설정](app-settings.md)에서 선택.
- 파일 이름 배경 클릭 → diff 펼침·접음
- Cmd 누른 상태 단일 라인 클릭 → 그 라인을 선택 에디터에서 열림
- 변경이 만족스러우면 [stage 또는 revert](#staging과-reverting-파일)

## 인라인 코멘트로 피드백

인라인 코멘트는 diff의 특정 라인에 직접 피드백 attach. Codex를 올바른 fix로 안내하는 가장 빠른 방법.

인라인 코멘트:
1. 리뷰 패널 열기
2. 코멘트할 라인에 hover
3. 표시되는 **+** 버튼 클릭
4. 피드백 작성 + 제출
5. 피드백 끝낸 후 스레드에 메시지 다시 전송

라인 특화 코멘트라 Codex가 일반 instruction보다 더 정확하게 응답.

Codex는 인라인 코멘트를 리뷰 가이드로 다룸. 코멘트 남긴 후 의도 명시 후속 메시지 (예: "Address the inline comments and keep the scope minimal.")

## 코드 리뷰 결과

`/review`로 코드 리뷰 실행 시 코멘트가 리뷰 패널에 직접 인라인 표시.

## PR 리뷰

Codex가 리포에 GitHub 액세스 있고 현재 프로젝트가 PR 브랜치에 있으면, Codex 앱이 앱 떠나지 않고 PR 피드백 다루기 도움. 사이드바에 PR 컨텍스트와 reviewer 피드백, 리뷰 패널에 코멘트와 diff 나란히 → 같은 스레드에서 Codex에 이슈 다루기 요청.

GitHub CLI (`gh`) 설치 + `gh auth login`으로 인증 → Codex가 PR 컨텍스트, 리뷰 코멘트, 변경 파일 로드. `gh` 누락·미인증 시 PR 디테일이 사이드바·리뷰 패널에 안 나타날 수 있음.

전체 fix 루프를 한 곳에 유지하는 플로:
1. PR 브랜치에서 리뷰 패널 열기
2. PR 컨텍스트, 코멘트, 변경 파일 검토
3. 처리할 특정 코멘트를 Codex에 fix 요청
4. 결과 diff를 리뷰 패널에서 검사
5. 준비 시 PR 브랜치에 stage·commit·push

GitHub 트리거 리뷰: [GitHub의 Codex 사용](../web/integrations-github.md)

## Staging과 reverting 파일

리뷰 패널은 commit 전 diff를 형성하는 Git 액션 포함.

stage·unstage·revert 레벨:
- **전체 diff**: 리뷰 헤더의 액션 버튼 ("Stage all", "Revert all" 등)
- **파일별**: 개별 파일 stage·unstage·revert
- **hunk별**: 단일 hunk stage·unstage·revert

작업 일부 수용 → staging. 폐기 → revert.

### Staged와 unstaged 상태

Git은 같은 파일에 staged와 unstaged 변경 둘 다 표현 가능. 그러면 패널이 staged·unstaged view 간에 "같은 파일 두 번" 보일 수 있음. 정상 Git 동작.

---
원문: https://developers.openai.com/codex/app/automations
동기화일: 2026-05-15
---

# Automations

> 반복 Codex 작업 스케줄

백그라운드에서 반복 작업 자동화. Codex가 발견 사항을 inbox에 추가, 보고할 게 없으면 자동 archive. 더 복잡한 작업은 [skills](../configuration/skills.md)와 결합 가능.

프로젝트 스코프 자동화는 앱 실행 중이어야 + 선택 프로젝트가 디스크에 가용해야.

Git 리포에서는 자동화가 로컬 프로젝트 또는 새 [worktree](app-worktrees.md)에서 실행 선택 가능. 둘 다 백그라운드 실행. Worktree는 자동화 변경을 끝나지 않은 로컬 작업과 분리, 로컬 프로젝트 실행은 작업 중 파일 수정 가능. 비-버전 관리 프로젝트는 프로젝트 디렉터리에서 직접 실행.

모델·reasoning effort는 기본 유지 또는 명시적 선택.

## 작업 관리

Codex 앱 사이드바의 automations 패널에서 모든 자동화·실행 찾기.

"Triage" 섹션은 inbox 역할. 발견 사항 있는 자동화 실행이 표시, all 또는 unread만 필터.

Standalone 자동화는 스케줄로 fresh 실행 시작 + Triage에 결과 보고. 각 실행이 독립이거나 한 자동화가 1개 이상 프로젝트에서 실행해야 할 때. 커스텀 cadence 필요 시 cron 문법 입력.

Git 리포의 각 자동화는 로컬 프로젝트 또는 전용 백그라운드 [worktree](app-features.md)에서 실행. Worktree는 자동화 변경을 끝나지 않은 로컬 작업과 격리. 로컬 모드는 메인 체크아웃에서 직접 작업 (적극 편집 중 파일 변경 가능 인지). 비-버전 관리 프로젝트는 프로젝트 디렉터리에서 직접. 같은 자동화를 1개 이상 프로젝트에서 실행 가능.

자동화는 기본 샌드박스 설정 사용. read-only 모드에서 파일 수정·네트워크 액세스·앱 작업 필요 도구 호출 실패. full access 활성 시 백그라운드 자동화 elevated 위험. 샌드박스 설정 [Settings](app-settings.md)에서 조정 + 명령을 [rules](../configuration/rules.md)로 선택적 allowlist.

자동화는 Codex가 가용한 같은 플러그인·스킬 사용 가능. 팀 간 유지·공유 가능하게 [skills](../configuration/skills.md)로 액션 정의 + 도구·컨텍스트 제공. 자동화 안에 `$skill-name`으로 스킬 명시 트리거.

## Codex에 자동화 생성·갱신 요청

일반 Codex 스레드에서 자동화 생성·갱신. 작업, 스케줄, 자동화가 현재 스레드에 attach 또는 fresh 실행 시작 여부 기술. Codex가 자동화 prompt 초안, 올바른 자동화 타입 선택, 스코프·cadence 변경 시 갱신 가능.

예 — 배포 끝날 때까지 이 스레드에서 알림 또는 프로젝트를 반복 스케줄로 체크하는 standalone 자동화 생성 요청.

스킬도 자동화 생성·갱신 가능. 예 — PR 베이비시팅 스킬이 GitHub 플러그인으로 PR 상태 체크 + 새 리뷰 피드백 fix하는 반복 자동화 셋업.

## Thread automations

현재 스레드에 attach된 heartbeat 스타일 반복 wake-up 호출. 스케줄로 같은 대화에 계속 돌아가게 하고 싶을 때.

매번 새 prompt에서 시작 대신 스레드 컨텍스트 보존해야 할 때.

분 단위 간격 (적극 follow-up 루프) 또는 일·주 스케줄 (특정 시간 체크인) 사용.

유용한 경우:
- 장기 명령 종료까지 체크
- 결과가 같은 스레드에 머물러야 할 때 Slack/GitHub/다른 connected 소스 폴
- 고정 cadence로 리뷰 루프 계속하라고 Codex 알림
- 플러그인 사용 스킬 주도 워크플로 (PR 상태 체크 + 새 피드백 다루기)
- 진행 리서치·triage 작업에 chat 집중 유지

각 실행이 독립이거나 1개 이상 프로젝트에서 실행해야 하거나 발견 사항이 Triage에 별도 자동화 실행으로 나타나야 할 때 → standalone 또는 프로젝트 자동화.

thread 자동화 생성 시 prompt를 durable하게. 스레드가 wake할 때마다 Codex가 무엇을 할지, 보고할 중요한 게 있는지 결정 방법, 언제 멈추거나 입력 요청할지 기술.

## 자동화 테스트

스케줄 전 일반 스레드에서 prompt 수동 테스트. 확인:
- prompt가 명확하고 올바른 스코프
- 선택·기본 모델, reasoning effort, 도구가 기대대로 동작
- 결과 diff가 검토 가능

스케줄 시작 시 첫 몇 출력 검토 + prompt·cadence 필요 시 조정.

## Worktree cleanup

Git 리포에 worktree 선택 시 잦은 스케줄이 시간 지나며 많은 worktree 생성. 더 이상 필요 없는 자동화 실행 archive. worktree 유지 의도 아니면 실행 pin 피하기.

## 권한과 보안 모델

자동화는 무인 실행 + 기본 샌드박스 설정 사용.

- **read-only**: 파일 수정·네트워크 액세스·앱 작업 필요 도구 호출 실패. workspace-write로 갱신 고려.
- **workspace-write**: 워크스페이스 외부 파일 수정·네트워크 액세스·앱 작업 필요 도구 호출 실패. [rules](../configuration/rules.md)로 명령을 선택적으로 샌드박스 외부 실행 allowlist.
- **full access**: 백그라운드 자동화 elevated 위험 — Codex가 묻지 않고 파일 변경·명령 실행·네트워크 액세스 가능. workspace-write로 갱신 + [rules](../configuration/rules.md)로 어떤 명령을 풀 액세스로 실행할지 선택적 정의 고려.

관리 환경이면 admin이 admin 강제 requirements로 이 동작 제한 가능. 예: `approval_policy = "never"` 금지 또는 허용 샌드박스 모드 제약. → [Admin 강제 requirements](../administration/enterprise-managed-config.md)

자동화는 조직 정책이 허용하면 `approval_policy = "never"` 사용. admin requirements가 `approval_policy = "never"` 금지 시 선택 모드의 승인 동작으로 fallback.

## 예시

### 새 스킬 자동 생성

```
Scan all of the `~/.codex/sessions` files from the past day and if there have been any issues using particular skills, update the skills to be more helpful. Personal skills only, no repo skills.

If there's anything we've been doing often and struggle with that we should save as a skill to speed up future work, let's do it.

Definitely don't feel like you need to update any- only if there's a good reason!

Let me know if you make any.
```

### 프로젝트 최신 상태 유지

```
Look at the latest remote origin/master or origin/main . Then produce an exec briefing for the last 24 hours of commits that touch <area>

Formatting + structure:
- Use rich Markdown (H1 workstream sections, italics for the subtitle, horizontal rules as needed).
- Preamble can read something like "Here's the last 24h brief for <area>:"
- Subtitle should read: "Narrative walkthrough with owners; grouped by workstream."
- Group by workstream rather than listing each commit. Workstream titles should be H1.
- Write a short narrative per workstream that explains the changes in plain language.
- Use bullet points and bolding when it makes things more readable
- Feel free to make bullets per person, but bold their name

Content requirements:
- Include PR links inline (e.g., [#123](...)) without a "PRs:" label.
- Do NOT include commit hashes or a "Key commits" section.
- It's fine if multiple PRs appear under one workstream, but avoid per-commit bullet lists.

Scope rules:
- Only include changes within the current cwd (or main checkout equivalent)
- Only include the last 24h of commits.
- Use `gh` to fetch PR titles and descriptions if it helps.
  Also feel free to pull PR reviews and comments
```

### 자동화 + 스킬 결합 — 자체 commit 버그 fix

`$recent-code-bugfix` 스킬 생성 + [개인 스킬에 저장](../configuration/skills.md):

```markdown
---
name: recent-code-bugfix
description: Find and fix a bug introduced by the current author within the last week in the current working directory. Use when a user wants a proactive bugfix from their recent changes, when the prompt is empty, or when asked to triage/fix issues caused by their recent commits. Root cause must map directly to the author's own changes.
---

# Recent Code Bugfix

## Overview
Find a bug introduced by the current author in the last week, implement a fix, and verify it when possible. Operate in the current working directory, assume the code is local, and ensure the root cause is tied directly to the author's own edits.

## Workflow

### 1) Establish the recent-change scope
- Determine author from `git config user.name`/`user.email`.
- Use `git log --since=1.week --author=<author>` to list recent commits/files.
- If user's prompt is empty, proceed with this default scope.

### 2) Find a concrete failure tied to recent changes
- Look for recent failures (tests, lint, runtime errors).
- If no failures provided, run the smallest relevant verification.
- Confirm root cause is directly connected to the author's changes.

### 3) Implement the fix
- Minimal fix aligned with project conventions.
- Avoid extra defensive checks or unrelated refactors.

### 4) Verify
- Prefer smallest validation step.

### 5) Report
- Summarize root cause, fix, verification.
- Explicit on how root cause ties to author's recent changes.
```

이후 새 자동화:
```
Check my commits from the last 24h and submit a $recent-code-bugfix.
```

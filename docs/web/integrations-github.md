---
원문: https://developers.openai.com/codex/integrations/github
동기화일: 2026-05-15
---

# GitHub의 Codex Code Review

> GitHub PR용 Codex 코드 리뷰 셋업, `@codex review`로 리뷰 요청, 자동 리뷰 활성화, 리뷰 가이드라인 커스터마이즈

GitHub PR에서 high-signal 추가 리뷰를 위해 사용. Codex가 PR diff 리뷰 → 리포 가이드 따름 → 심각 이슈 집중 표준 GitHub 코드 리뷰 게시.

## 시작 전

준비:
- 리뷰할 리포에 [Codex cloud](overview.md) 셋업
- [Codex code review 설정](https://chatgpt.com/codex/settings/code-review) 액세스
- 리포 특화 리뷰 가이드 원하면 `AGENTS.md`

## 셋업

1. [Codex cloud](overview.md) 셋업
2. [Codex 설정](https://chatgpt.com/codex/settings/code-review)으로
3. 리포에 **Code review** 활성화

## Codex 리뷰 요청

1. PR 코멘트에 `@codex review` mention
2. Codex 반응 (👀) + 리뷰 게시 대기

Codex가 팀 동료처럼 PR에 리뷰 게시. GitHub에서는 P0·P1 이슈만 flag → 리뷰 코멘트가 우선순위 높은 위험에 집중.

## 자동 리뷰 활성화

모든 PR을 Codex가 자동 리뷰 → [Codex 설정](https://chatgpt.com/codex/settings/code-review)에서 **Automatic reviews** ON. `@codex review` 코멘트 없이 새 PR 열릴 때마다 Codex 리뷰 게시.

## Codex가 리뷰하는 것 커스터마이즈

Codex는 리포에서 `AGENTS.md` 검색 + **Review guidelines** 섹션 따름.

리포에 가이드라인 — top-level `AGENTS.md`에 다음 같은 섹션 추가·갱신:

```markdown
## Review guidelines

- Don't log PII.
- Verify that authentication middleware wraps every route.
```

Codex는 변경 파일에 가장 가까운 `AGENTS.md`의 가이드 적용. 특정 패키지에 추가 검토 필요하면 트리 더 깊은 곳에 더 구체적 instruction 배치.

일회성 focus는 PR 코멘트에:
```
@codex review for security regressions
```

문서의 typo flag 원하면 `AGENTS.md`에 가이드 추가 (예: "Treat typos in docs as P1.").

## 리뷰 발견 액션

Codex 리뷰 게시 후 같은 PR에서 이슈 fix 요청 — 다른 코멘트로:
```
@codex fix the P1 issue
```

Codex가 PR을 컨텍스트로 클라우드 작업 시작 + 권한 있으면 브랜치에 fix push.

## 다른 작업 위임

`review` 외 다른 것과 함께 `@codex` mention하면 Codex가 PR을 컨텍스트로 [클라우드 작업](overview.md) 시작.
```
@codex fix the CI failures
```

## 트러블슈팅

Codex가 반응 안 하거나 리뷰 안 게시:
- [Codex 설정](https://chatgpt.com/codex/settings/code-review)에서 리포에 **Code review** ON 확인
- PR이 [Codex cloud](overview.md) 셋업된 리포에 속하는지 확인
- PR 코멘트에 정확한 트리거 `@codex review` 사용
- 자동 리뷰는 **Automatic reviews** ON + PR 이벤트가 리뷰 트리거 설정과 매치 확인

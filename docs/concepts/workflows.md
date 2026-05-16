---
원문: https://developers.openai.com/codex/workflows
동기화일: 2026-05-15
---

# 워크플로 (Workflows)

> Codex 사용 패턴

Codex는 명시적 컨텍스트와 명확한 "done" 정의를 가진 팀 동료처럼 다룰 때 가장 잘 동작. 이 페이지는 Codex IDE 확장, CLI, Cloud의 end-to-end 워크플로 예시.

처음이면 [Prompting](prompting.md) 먼저 → 여기로 돌아와 구체적 레시피.

## 예시 읽는 법

각 워크플로에 포함:
- **사용 시점** + 어떤 Codex surface가 가장 적합 (IDE, CLI, Cloud)
- **단계** + 예시 사용자 prompt
- **컨텍스트 메모**: Codex가 자동으로 보는 것 vs 첨부해야 할 것
- **검증**: 출력 체크 방법

> **메모**: IDE 확장은 열린 파일을 자동 컨텍스트로 포함. CLI에서는 보통 경로 명시 (또는 `/mention`과 `@` 경로 자동완성으로 첨부) 필요.

## 코드베이스 설명

온보딩, 서비스 인계, 프로토콜·데이터 모델·요청 플로 추론할 때.

### IDE 확장 (로컬 탐색에 가장 빠름)

1. 가장 관련 있는 파일 열기
2. 관심 코드 선택 (선택, 권장)
3. Codex prompt:
   ```
   Explain how the request flows through the selected code. Include:
   - a short summary of the responsibilities of each module involved
   - what data is validated and where
   - one or two "gotchas" to watch for when changing this
   ```

검증 — 빠르게 검증할 수 있는 다이어그램·체크리스트 요청:
```
Summarize the request flow as a numbered list of steps. Then list the files involved.
```

### CLI (트랜스크립트 + 셸 명령 원할 때)

1. 인터랙티브 세션 시작: `codex`
2. 파일 첨부 (선택) + prompt:
   ```
   I need to understand the protocol used by this service. Read @foo.ts @schema.ts and explain the schema and request/response flow. Focus on required vs optional fields and backward compatibility rules.
   ```

컨텍스트 메모: composer에서 `@`로 워크스페이스 파일 경로 삽입, `/mention`으로 특정 파일 첨부.

## 버그 수정

로컬 재현 가능한 실패 동작이 있을 때.

### CLI (재현·검증과 함께 tight loop)

1. 리포 루트에서 Codex: `codex`
2. 재현 레시피 + 의심 파일:
   ```
   Bug: Clicking "Save" on the settings screen sometimes shows "Saved" but doesn't persist the change.

   Repro:
   1) Start the app: npm run dev
   2) Go to /settings
   3) Toggle "Enable alerts"
   4) Click Save
   5) Refresh the page: the toggle resets

   Constraints:
   - Do not change the API shape.
   - Keep the fix minimal and add a regression test if feasible.

   Start by reproducing the bug locally, then propose a patch and run checks.
   ```

컨텍스트 메모:
- 사용자가 제공: 재현 단계와 제약 (상위 설명보다 중요)
- Codex가 제공: 명령 출력, 발견한 호출 사이트, 트리거되는 스택 트레이스

검증:
- Codex가 fix 후 재현 단계 재실행
- 표준 체크 파이프라인 있으면 실행 요청:
  ```
  After the fix, run lint + the smallest relevant test suite. Report the commands and results.
  ```

### IDE 확장

1. 버그가 있다고 생각하는 파일 + 가장 가까운 caller 열기
2. Codex prompt:
   ```
   Find the bug causing "Saved" to show without persisting changes. After proposing the fix, tell me how to verify it in the UI.
   ```

## 테스트 작성

테스트하고 싶은 스코프를 매우 명시적으로 하고 싶을 때.

### IDE 확장 (선택 기반)

1. 함수가 있는 파일 열기
2. 함수 정의 라인 선택. command palette에서 "Add to Codex Thread" → 컨텍스트에 추가
3. Codex prompt:
   ```
   Write a unit test for this function. Follow conventions used in other tests.
   ```

컨텍스트 메모: "Add to Codex Thread" 명령으로 선택 라인 (line number 스코프) + 열린 파일 제공.

### CLI (prompt에 path + 라인 범위 기술)

1. Codex 시작: `codex`
2. 함수 이름과 prompt:
   ```
   Add a test for the invert_list function in @transform.ts. Cover the happy path plus edge cases.
   ```

## 스크린샷에서 프로토타입

디자인 mock, 스크린샷, UI 레퍼런스 → 빠른 작동 프로토타입.

### CLI (이미지 + prompt)

1. 스크린샷 로컬 저장 (예: `./specs/ui.png`)
2. `codex`
3. 이미지 파일을 터미널에 드래그 → prompt에 첨부
4. 제약·구조 후속:
   ```
   Create a new dashboard based on this image.

   Constraints:
   - Use react, vite, and tailwind. Write the code in typescript.
   - Match spacing, typography, and layout as closely as possible.

   Deliverables:
   - A new route/page that renders the UI
   - Any small components needed
   - README.md with instructions to run it locally
   ```

컨텍스트 메모:
- 이미지가 시각 요구사항 제공, 구현 제약 (프레임워크, 라우팅, 컴포넌트 스타일)은 명시 필요
- 최상의 결과: non-obvious 동작 (hover, validation, 키보드)을 텍스트로 포함

검증 — Codex에 dev 서버 실행 + 정확한 위치 알려달라 요청:
```
Start the dev server and tell me the local URL/route to view the prototype.
```

### IDE 확장 (이미지 + 기존 파일)

1. Codex chat에 이미지 첨부 (드래그·드롭 또는 paste)
2. Codex prompt:
   ```
   Create a new settings page. Use the attached screenshot as the target UI. Follow design and visual patterns from other files in this project.
   ```

## UI 라이브 업데이트로 반복

"design → tweak → refresh → tweak" tight 루프, Codex가 코드 편집 동안.

### CLI (Vite 실행 + 작은 prompt로 반복)

1. `codex`
2. 별도 터미널 창에서 dev 서버: `npm run dev`
3. Codex에 변경 prompt:
   ```
   Propose 2-3 styling improvements for the landing page.
   ```
4. 방향 선택 + 작은 구체적 prompt로 반복:
   ```
   Go with option 2. Change only the header:
   - make the typography more editorial
   - increase whitespace
   - ensure it still looks good on mobile
   ```
5. 집중 요청 반복:
   ```
   Next iteration: reduce visual noise. Keep the layout, but simplify colors and remove any redundant borders.
   ```

검증:
- 코드 갱신 시 브라우저에서 변경 "라이브" 검토
- 마음에 드는 변경 commit, 아닌 것 revert
- 변경을 revert·수정하면 Codex에 알려서 다음 prompt에서 덮어쓰지 않게

## 클라우드에 리팩토링 위임

신중히 설계 (로컬 컨텍스트, 빠른 검사) → 긴 구현을 병렬 실행 가능한 클라우드 작업에 outsource.

### 로컬 계획 (IDE)

1. 변경을 깔끔히 비교할 수 있게 현재 작업 commit (또는 stash)
2. Codex에 리팩토링 계획 요청. `$plan` 스킬 가용하면 명시적 호출:
   ```
   $plan
   We need to refactor the auth subsystem to:
   - split responsibilities (token parsing vs session loading vs permissions)
   - reduce circular imports
   - improve testability

   Constraints:
   - No user-visible behavior changes
   - Keep public APIs stable
   - Include a step-by-step migration plan
   ```
3. 계획 검토 + 변경 협상:
   ```
   Revise the plan to:
   - specify exactly which files move in each milestone
   - include a rollback strategy
   ```

컨텍스트 메모: 계획은 Codex가 현재 코드를 로컬 스캔할 수 있을 때 가장 잘 동작 (entrypoints, 모듈 경계, dependency graph 힌트).

### 클라우드 위임 (IDE → Cloud)

1. 아직 셋업 안 했으면 [Codex cloud 환경](../web/environments.md)
2. prompt composer 아래 클라우드 아이콘 → 클라우드 환경 선택
3. 다음 prompt 입력 시 Codex가 기존 스레드 컨텍스트 (계획 + 로컬 소스 변경 포함)를 가져가는 새 클라우드 스레드 생성:
   ```
   Implement Milestone 1 from the plan.
   ```
4. 클라우드 diff 검토 + 필요 시 반복
5. 클라우드에서 직접 PR 생성 또는 변경을 로컬로 pull → 테스트·마무리
6. 추가 마일스톤 반복

## 로컬 코드 리뷰

commit 또는 PR 생성 전 second pair of eyes.

### CLI (작업 트리 리뷰)

1. `codex`
2. 리뷰 명령: `/review`
3. 선택 — 커스텀 focus 지시:
   ```
   /review Focus on edge cases and security issues
   ```

검증: 리뷰 피드백 기반 fix 적용 → `/review` 재실행으로 이슈 해결 확인.

## GitHub PR 리뷰

브랜치를 로컬에 pull 안 하고 리뷰 피드백 원할 때.

먼저 리포에 Codex **Code review** 활성화 필요. → [Code review](../web/integrations-github.md)

### GitHub 워크플로 (코멘트 기반)

1. GitHub에서 PR 열기
2. Codex 태그 + 명시적 focus area 코멘트:
   ```
   @codex review
   ```
3. 선택 — 더 명시적 지시:
   ```
   @codex review for security vulnerabilities and security concerns
   ```

## 문서 갱신

정확하고 명확한 문서 변경 필요할 때.

### IDE 또는 CLI (로컬 편집 + 로컬 검증)

1. 변경할 문서 파일 식별 → 열기 (IDE) 또는 `@` mention (IDE/CLI)
2. Codex에 스코프·검증 요구사항으로 prompt:
   ```
   Update the "advanced features" documentation to provide authentication troubleshooting guidance. Verify that all links are valid.
   ```
3. Codex가 변경 초안 작성 후 문서 검토 → 필요 시 반복

검증: 렌더된 페이지 읽기.

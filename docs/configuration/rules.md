---
원문: https://developers.openai.com/codex/rules
동기화일: 2026-05-15
---

# 규칙 (Rules)

> Codex가 샌드박스 외부에서 어떤 명령을 실행할 수 있는지 제어

샌드박스 외부 명령 실행을 제어하는 규칙. (실험 기능, 변경될 수 있음.)

## 규칙 파일 만들기

1. 활성 config 레이어 옆에 `rules/` 폴더와 `.rules` 파일 생성 (예: `~/.codex/rules/default.rules`)
2. 규칙 추가. 예시: `gh pr view`를 샌드박스 외부에서 실행하기 전 prompt:

```python
# Prompt before running commands with the prefix `gh pr view` outside the sandbox.
prefix_rule(
    pattern = ["gh", "pr", "view"],
    decision = "prompt",
    justification = "Viewing PRs is allowed with approval",
    match = [
        "gh pr view 7888",
        "gh pr view --repo openai/codex",
        "gh pr view 7888 --json title,body,comments",
    ],
    not_match = [
        # pattern은 정확한 prefix여야 매치
        "gh pr --repo openai/codex view 7888",
    ],
)
```

3. Codex 재시작.

Codex는 시작 시 활성 config 레이어 모두의 `rules/`를 스캔. [Team Config](../administration/enterprise-admin-setup.md) 위치와 `~/.codex/rules/` 사용자 레이어 포함. 프로젝트 로컬 `<project>/.codex/rules/`는 프로젝트 `.codex/` 레이어가 신뢰됐을 때만 로드.

TUI에서 명령을 allow list에 추가하면 Codex는 사용자 레이어 (`~/.codex/rules/default.rules`)에 기록 → 다음 실행부터 prompt 건너뜀.

Smart approvals 활성화 시 (기본) Codex가 escalation 요청 중 `prefix_rule`을 제안할 수 있음. 수락 전 prefix 신중히 검토.

관리자는 [`requirements.toml`](../administration/enterprise-managed-configuration.md)에서 제한적 `prefix_rule`을 강제할 수 있음.

## 규칙 필드

`prefix_rule()` 지원 필드:

- **`pattern` (필수)**: 매치할 명령 prefix를 정의하는 비어있지 않은 리스트. 각 요소는:
  - 리터럴 문자열 (예: `"pr"`)
  - 리터럴 union (예: `["view", "list"]`) — 해당 인자 위치에서 대안 매치

- **`decision`** (기본 `"allow"`): 매치 시 액션. 여러 규칙이 매치되면 가장 제한적 결정 적용 (forbidden > prompt > allow).
  - `allow`: 샌드박스 외부 실행, prompt 없음
  - `prompt`: 매치된 호출마다 prompt
  - `forbidden`: prompt 없이 차단

- **`justification`** (선택): 사람이 읽을 수 있는 비어있지 않은 사유. Codex가 승인 prompt나 거부 메시지에 노출할 수 있음. `forbidden` 사용 시 적절하면 대체 명령 권장 추가 (예: `"Use \`rg\` instead of \`grep\`."`).

- **`match`, `not_match`** (기본 `[]`): Codex가 규칙 로드 시 검증하는 예시. 규칙이 적용되기 전 실수 캐치.

Codex는 명령 실행 고려 시 명령의 인자 리스트와 `pattern` 비교. 내부적으로 명령을 인자 리스트로 처리 (`execvp(3)`이 받는 형태).

## 셸 래퍼와 복합 명령

일부 도구는 여러 셸 명령을 한 호출로 감싼다:

```
["bash", "-lc", "git add . && rm -rf /"]
```

이런 명령은 한 문자열에 여러 액션을 숨길 수 있어, Codex는 `bash -lc`, `bash -c`, 그리고 `zsh`/`sh` 등가물을 특별 처리한다.

### Codex가 안전하게 스크립트 분할하는 경우

스크립트가 다음 조건의 선형 명령 체인일 때:
- 평문 단어만 (변수 확장, `VAR=...`, `$FOO`, `*` 등 없음)
- 안전 연산자 (`&&`, `||`, `;`, `|`)로 연결

→ Codex가 tree-sitter로 파싱 → 개별 명령으로 분할 후 규칙 적용.

위 예시는 두 개로 처리:
- `["git", "add", "."]`
- `["rm", "-rf", "/"]`

각각을 규칙에 평가, 가장 제한적 결과 채택.

`pattern=["git", "add"]`를 allow해도 `git add . && rm -rf /`는 자동 허용 안 됨 — `rm -rf /` 부분이 따로 평가되어 전체 호출의 자동 허용을 막음.

→ 안전한 명령에 위험한 명령을 끼워넣는 것 방지.

### Codex가 분할하지 않는 경우

스크립트가 더 고급 셸 기능을 쓸 때 (리다이렉션 `>`, `>>`, `<` 등) → 단일 호출로 평가, 규칙은 그 호출 전체에 적용.

이 처리로 안전할 때는 명령별 평가의 보안성, 그렇지 않을 때는 보수적 동작을 모두 얻음.

## 규칙 파일 테스트

`codex execpolicy check`로 규칙 적용 테스트:

```bash
codex execpolicy check --pretty \
  --rules ~/.codex/rules/default.rules \
  -- gh pr view 7888 --json title,body,comments
```

가장 제한적 결정 + 매치된 규칙 (매치된 규칙의 `justification` 포함)을 JSON으로 출력. `--rules`를 여러 번 써서 파일 결합, `--pretty`로 포맷.

## 규칙 언어

`.rules` 파일 형식은 `Starlark` 사용 ([언어 스펙](https://github.com/bazelbuild/starlark/blob/master/spec.md)). 문법은 Python과 비슷하지만 안전 실행을 위해 설계 — 규칙 엔진이 부수효과(파일시스템 접근 등) 없이 실행 가능.

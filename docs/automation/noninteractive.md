---
원문: https://developers.openai.com/codex/noninteractive
동기화일: 2026-05-15
---

# Non-interactive 모드

> 스크립트와 CI에서 `codex exec`로 Codex 실행

비인터랙티브 모드는 인터랙티브 TUI 열지 않고 스크립트(예: CI 작업)에서 Codex 실행. `codex exec`로 호출.

→ 플래그 디테일: [`codex exec`](../cli/reference.md)

## `codex exec`를 쓸 때

- 파이프라인 (CI, pre-merge 체크, 스케줄 작업)의 일부로 실행
- 다른 도구로 pipe할 출력 생성 (릴리스 노트, 요약 등)
- 명령 출력을 Codex로 체이닝하고 Codex 출력을 다른 도구로 전달하는 CLI 워크플로에 자연 적합
- 명시적·사전 설정된 샌드박스·승인 설정으로 실행

## 기본 사용

작업 prompt를 단일 인자로 전달:

```bash
codex exec "summarize the repository structure and list the top 5 risky areas"
```

`codex exec` 실행 동안 Codex는 진행 상황을 stderr로 스트림, 최종 에이전트 메시지만 stdout으로 출력. → 결과 redirect·pipe 직관적:

```bash
codex exec "generate release notes for the last 10 commits" | tee release-notes.md
```

세션 rollout 파일을 디스크에 영속화하고 싶지 않으면 `--ephemeral`:

```bash
codex exec --ephemeral "triage this repository and suggest next steps"
```

stdin이 pipe되고 prompt 인자도 제공하면 Codex는 prompt를 지시로, pipe된 콘텐츠를 추가 컨텍스트로 처리.

→ 한 명령으로 입력 생성 + Codex에 직접 전달 쉬움:

```bash
curl -s https://jsonplaceholder.typicode.com/comments \
  | codex exec "format the top 20 items into a markdown table" \
  > table.md
```

더 고급 stdin pipe 패턴: [Advanced stdin piping](#advanced-stdin-piping)

## 권한과 안전

기본적으로 `codex exec`는 read-only 샌드박스에서 실행. 자동화에서 워크플로에 필요한 최소 권한 설정:

- 편집 허용: `codex exec --sandbox workspace-write "<prompt>"`
- 더 넓은 액세스: `codex exec --sandbox danger-full-access "<prompt>"`

`danger-full-access`는 통제된 환경 (격리된 CI 러너, 컨테이너)에서만.

`codex exec --full-auto`는 deprecated 호환 플래그로 유지, 경고 출력. 새 스크립트는 명시적 `--sandbox workspace-write` 우선.

`--ignore-user-config`는 `$CODEX_HOME/config.toml` 로드 안 하는 실행 필요할 때, `--ignore-rules`는 통제된 자동화 환경에서 사용자·프로젝트 execpolicy `.rules` 파일 건너뛸 때.

`required = true` MCP 서버를 활성화 설정했고 초기화 실패 시 `codex exec`는 그 서버 없이 계속하지 않고 에러로 종료.

## 머신 판독 가능 출력

스크립트에서 Codex 출력 소비 → JSON Lines 출력:

```bash
codex exec --json "summarize the repo structure" | jq
```

`--json` 활성화 시 stdout이 JSONL 스트림 → Codex가 실행 중 emit하는 모든 이벤트 캡처. 이벤트 타입: `thread.started`, `turn.started`, `turn.completed`, `turn.failed`, `item.*`, `error`.

Item 타입: 에이전트 메시지, reasoning, 명령 실행, 파일 변경, MCP 도구 호출, 웹 검색, 계획 갱신.

샘플 JSON 스트림 (각 줄 JSON):
```json
{"type":"thread.started","thread_id":"0199a213-81c0-7800-8aa1-bbab2a035a53"}
{"type":"turn.started"}
{"type":"item.started","item":{"id":"item_1","type":"command_execution","command":"bash -lc ls","status":"in_progress"}}
{"type":"item.completed","item":{"id":"item_3","type":"agent_message","text":"Repo contains docs, sdk, and examples directories."}}
{"type":"turn.completed","usage":{"input_tokens":24763,"cached_input_tokens":24448,"output_tokens":122,"reasoning_output_tokens":0}}
```

최종 메시지만 필요하면 `-o <path>` / `--output-last-message <path>`로 파일에 기록 (stdout에도 출력).

## 스키마로 구조화 출력

다운스트림 단계용 구조화 데이터 → `--output-schema`로 JSON Schema 준수 최종 응답 요청. 자동화 워크플로 안정 필드 (작업 요약, 위험 리포트, 릴리스 메타데이터)에 유용.

`schema.json`:
```json
{
  "type": "object",
  "properties": {
    "project_name": { "type": "string" },
    "programming_languages": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["project_name", "programming_languages"],
  "additionalProperties": false
}
```

스키마와 함께 실행 + 최종 JSON 응답을 디스크에 저장:
```bash
codex exec "Extract project metadata" \
  --output-schema ./schema.json \
  -o ./project-metadata.json
```

예시 최종 출력:
```json
{
  "project_name": "Codex CLI",
  "programming_languages": ["Rust", "TypeScript", "Shell"]
}
```

## CI에서 인증

`codex exec`는 기본적으로 저장된 CLI 인증 재사용. CI에선 자격증명 명시 제공 흔함.

### API 키 인증 사용 (권장)

- `CODEX_API_KEY`를 작업의 시크릿 환경 변수로 설정
- prompt와 도구 출력에 민감 코드·데이터 포함 가능 인지

단일 실행에 다른 API 키 사용:
```bash
CODEX_API_KEY=<key> codex exec --json "triage open bug reports"
```

`CODEX_API_KEY`는 `codex exec`에서만 지원.

### CI/CD에서 ChatGPT 관리 인증 사용 (고급)

API 키 대신 Codex 사용자 계정으로 CI/CD 작업 실행 필요할 때 — 신뢰 러너에서 ChatGPT 관리 Codex 액세스 사용하는 엔터프라이즈 팀, 또는 API 키 사용량 대신 ChatGPT/Codex rate limit 필요한 사용자.

> API 키가 자동화의 올바른 기본값 — 프로비저닝·로테이션 더 단순. Codex 계정으로 실행이 특별히 필요할 때만 이 경로.

`~/.codex/auth.json`을 비밀번호처럼 다루기 — 액세스 토큰 포함. commit·티켓 paste·chat 공유 금지.

> 공개·오픈소스 리포에는 사용 금지. 러너에서 `codex login`이 옵션 아니면 보안 저장소로 `auth.json` seed → 러너에서 Codex 실행해 자체 갱신 → 실행 간 갱신 파일 영속화.

→ [Maintain Codex account auth in CI/CD (advanced)](../administration/auth.md)

## 비인터랙티브 세션 재개

이전 실행 계속 (예: 2단계 파이프라인): `resume`:

```bash
codex exec "review the change for race conditions"
codex exec resume --last "fix the race conditions you found"
```

특정 세션 ID 타깃: `codex exec resume <SESSION_ID>`.

## Git 리포 필요

Codex는 destructive 변경 방지를 위해 Git 리포 안에서 명령 실행 요구. 환경이 안전함을 확신하면 `codex exec --skip-git-repo-check`로 오버라이드.

## 흔한 자동화 패턴

### 예시: GitHub Actions에서 CI 실패 자동 수정

`codex exec`로 CI 워크플로 실패 시 자동 fix 제안 가능. 일반 패턴:

1. 메인 CI 워크플로가 에러로 완료될 때 후속 워크플로 트리거
2. 실패 commit SHA 체크아웃
3. 의존성 설치 + 좁은 prompt + 최소 권한으로 Codex 실행
4. 테스트 명령 재실행
5. 결과 패치로 PR 열기

#### CLI 사용 최소 워크플로

```yaml
name: Codex auto-fix on CI failure

on:
  workflow_run:
    workflows: ["CI"]
    types: [completed]

permissions:
  contents: write
  pull-requests: write

jobs:
  auto-fix:
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}
    runs-on: ubuntu-latest
    env:
      OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      FAILED_HEAD_SHA: ${{ github.event.workflow_run.head_sha }}
      FAILED_HEAD_BRANCH: ${{ github.event.workflow_run.head_branch }}
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ env.FAILED_HEAD_SHA }}
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: |
          if [ -f package-lock.json ]; then npm ci; else npm i; fi

      - name: Install Codex
        run: npm i -g @openai/codex

      - name: Authenticate Codex
        run: codex login --api-key "$OPENAI_API_KEY"

      - name: Run Codex
        run: |
          codex exec --sandbox workspace-write \
            "Read the repository, run the test suite, identify the minimal change needed to make all tests pass, implement only that change, and stop. Do not refactor unrelated files."

      - name: Verify tests
        run: npm test --silent

      - name: Create pull request
        if: success()
        uses: peter-evans/create-pull-request@v6
        with:
          branch: codex/auto-fix-${{ github.event.workflow_run.run_id }}
          base: ${{ env.FAILED_HEAD_BRANCH }}
          title: "Auto-fix failing CI via Codex"
```

#### 대안: Codex GitHub Action

CLI 직접 설치를 피하려면 [Codex GitHub Action](github-action.md)으로 `codex exec` 실행 + prompt를 입력으로 전달.

## Advanced stdin piping

다른 명령이 Codex 입력 생성 시 지시 출처에 따라 stdin 패턴 선택. 지시를 이미 알고 pipe된 출력을 컨텍스트로 전달 → prompt-plus-stdin. stdin이 전체 prompt가 되어야 → `codex exec -`.

### prompt-plus-stdin 사용

다른 명령이 Codex가 검사할 데이터를 이미 생성할 때 유용. 사용자가 지시 작성 + 출력을 컨텍스트로 pipe → 명령 출력·로그·생성 데이터 중심 CLI 워크플로에 자연 적합.

```bash
npm test 2>&1 \
  | codex exec "summarize the failing tests and propose the smallest likely fix" \
  | tee test-summary.md
```

#### 더 많은 prompt-plus-stdin 예시

**로그 요약**:
```bash
tail -n 200 app.log \
  | codex exec "identify the likely root cause, cite the most important errors, and suggest the next three debugging steps" \
  > log-triage.md
```

**TLS·HTTP 이슈 검사**:
```bash
curl -vv https://api.example.com/health 2>&1 \
  | codex exec "explain the TLS or HTTP failure and suggest the most likely fix" \
  > tls-debug.md
```

**Slack 업데이트 준비**:
```bash
gh run view 123456 --log \
  | codex exec "write a concise Slack-ready update on the CI failure, including the likely cause and next step" \
  | pbcopy
```

**CI 로그에서 PR 코멘트 초안**:
```bash
gh run view 123456 --log \
  | codex exec "summarize the failure in 5 bullets for the pull request thread" \
  | gh pr comment 789 --body-file -
```

### `codex exec -` (stdin이 prompt)

prompt 인자 생략 → Codex가 stdin에서 prompt 읽음. 그 동작 명시적으로 강제 → `codex exec -`.

`-` sentinel은 다른 명령·스크립트가 전체 prompt를 동적 생성할 때 유용. prompt를 파일에 저장, 셸 스크립트로 prompt 조립, 라이브 명령 출력과 지시를 결합해 전체 prompt를 Codex에 넘기는 경우 적합.

```bash
cat prompt.txt | codex exec -
```

```bash
printf "Summarize this error log in 3 bullets:\n\n%s\n" "$(tail -n 200 app.log)" \
  | codex exec -
```

```bash
generate_prompt.sh | codex exec - --json > result.jsonl
```

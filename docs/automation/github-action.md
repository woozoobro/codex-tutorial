---
원문: https://developers.openai.com/codex/github-action
동기화일: 2026-05-15
---

# Codex GitHub Action

> GitHub 이벤트에서 Codex 액션 트리거

Codex GitHub Action (`openai/codex-action@v1`)으로 CI/CD 작업에서 Codex 실행, 패치 적용, GitHub Actions 워크플로에서 리뷰 게시. 액션이 Codex CLI 설치 → API 키 제공 시 Responses API 프록시 시작 → 지정 권한 아래 `codex exec` 실행.

다음과 같을 때 사용:
- CLI 직접 관리 없이 PR·릴리스에 Codex 피드백 자동화
- CI 파이프라인 일부로 Codex 주도 품질 체크에 변경 게이트
- 워크플로 파일에서 반복 Codex 작업 (코드 리뷰, 릴리스 준비, 마이그레이션) 실행

CI 예시: [Non-interactive 모드](noninteractive.md), 소스: [openai/codex-action repo](https://github.com/openai/codex-action)

## 전제조건

- OpenAI 키를 GitHub 시크릿으로 저장 (예: `OPENAI_API_KEY`) → 워크플로에서 참조
- Linux 또는 macOS 러너에서 실행. Windows는 `safety-strategy: unsafe`.
- 액션 호출 전 코드 체크아웃 → Codex가 리포 콘텐츠 읽기 가능
- 실행할 prompt 결정. `prompt`로 인라인 텍스트 또는 `prompt-file`로 리포에 commit된 파일 가리키기.

## 예시 워크플로

새 PR 리뷰 + Codex 응답 캡처 + PR에 게시:

```yaml
name: Codex pull request review
on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  codex:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    outputs:
      final_message: ${{ steps.run_codex.outputs.final-message }}
    steps:
      - uses: actions/checkout@v5
        with:
          ref: refs/pull/${{ github.event.pull_request.number }}/merge

      - name: Pre-fetch base and head refs
        run: |
          git fetch --no-tags origin \
            ${{ github.event.pull_request.base.ref }} \
            +refs/pull/${{ github.event.pull_request.number }}/head

      - name: Run Codex
        id: run_codex
        uses: openai/codex-action@v1
        with:
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          prompt-file: .github/codex/prompts/review.md
          output-file: codex-output.md
          safety-strategy: drop-sudo
          sandbox: workspace-write

  post_feedback:
    runs-on: ubuntu-latest
    needs: codex
    if: needs.codex.outputs.final_message != ''
    steps:
      - name: Post Codex feedback
        uses: actions/github-script@v7
        with:
          github-token: ${{ github.token }}
          script: |
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.payload.pull_request.number,
              body: process.env.CODEX_FINAL_MESSAGE,
            });
        env:
          CODEX_FINAL_MESSAGE: ${{ needs.codex.outputs.final_message }}
```

`.github/codex/prompts/review.md`를 자체 prompt 파일로 교체 또는 인라인 텍스트는 `prompt`. 예시는 최종 Codex 메시지를 `codex-output.md`로 기록 → 나중에 검사·artifact 업로드.

## `codex exec` 설정

`codex exec` 옵션과 매핑되는 액션 입력으로 실행 미세 조정:

- `prompt` 또는 `prompt-file` (택 1): 인라인 지시 또는 작업이 든 마크다운·텍스트 리포 경로. `.github/codex/prompts/`에 prompt 저장 고려.
- `codex-args`: 추가 CLI 플래그. JSON 배열 (`["--json"]`) 또는 셸 문자열 (`--sandbox workspace-write --json`)로 편집·스트리밍·MCP 설정 허용.
- `model`과 `effort`: 원하는 Codex 에이전트 설정. 기본값은 비워둠.
- `sandbox`: 실행 중 Codex가 필요한 권한과 매치 (`workspace-write`, `read-only`, `danger-full-access`).
- `output-file`: 최종 Codex 메시지를 디스크에 저장 → 이후 단계에서 업로드·diff 가능.
- `codex-version`: 특정 CLI 릴리스 pin. 비우면 최신.
- `codex-home`: 단계 간 설정 파일·MCP 셋업 재사용 위해 공유 Codex 홈 디렉터리 가리키기.

## 권한 관리

GitHub 호스트 러너에서 Codex는 제한 없으면 광범위 액세스. 노출 통제 입력:

- `safety-strategy` (기본 `drop-sudo`): Codex 실행 전 `sudo` 제거. 작업에 비가역, 메모리의 시크릿 보호. Windows는 `safety-strategy: unsafe`.
- `unprivileged-user`: `safety-strategy: unprivileged-user`와 `codex-user` 페어링 → 특정 계정으로 Codex 실행. 사용자가 리포 체크아웃 읽기·쓰기 가능 보장 (소유권 fix는 `.cache/codex-action/examples/unprivileged-user.yml` 참고).
- `read-only`: Codex가 파일 변경·네트워크 사용 안 함, 단 elevated 권한으로 실행. 시크릿 보호에 `read-only`만 의존 금지.
- `sandbox`: Codex 자체 안의 파일시스템·네트워크 액세스 제한. 작업 완료 가능한 가장 좁은 옵션.
- `allow-users`, `allow-bots`: 워크플로 트리거 가능 사용자 제한. 기본은 write 액세스 사용자만 실행 가능 — 추가 신뢰 계정 명시 또는 빈 필드로 기본 동작.

## 출력 캡처

액션은 `final-message` 출력으로 마지막 Codex 메시지 emit. 작업 출력으로 매핑 (위 예시) 또는 후속 단계에서 직접 처리. 러너에서 전체 트랜스크립트 수집 원하면 `output-file`을 업로드된 artifacts와 결합. 구조화 데이터 필요 시 `codex-args`로 `--output-schema` 전달해 JSON 형태 강제.

## 보안 체크리스트

- 워크플로 시작자 제한. 모두에게 Codex 실행 허용 대신 신뢰 이벤트나 명시 승인 우선.
- PR, commit 메시지, 이슈 본문의 prompt 입력 sanitize → prompt injection 방지. Codex에 전달 전 HTML 코멘트나 숨겨진 텍스트 검토.
- `OPENAI_API_KEY` 보호: `safety-strategy`를 `drop-sudo`로 유지 또는 unprivileged 사용자로 Codex 이동. 멀티-tenant 러너에 `unsafe` 모드로 두지 말 것.
- Codex를 작업의 마지막 단계로 실행 → 후속 단계가 의도치 않은 상태 변경 상속 안 함.
- 프록시 로그·액션 출력이 시크릿 노출됐다고 의심하면 키 즉시 로테이션.

## 트러블슈팅

- **prompt와 prompt-file 둘 다 설정**: 중복 입력 제거, 정확히 하나 제공
- **responses-api-proxy가 server info 안 씀**: API 키 존재·유효 확인. `openai-api-key` 제공 시만 프록시 시작.
- **sudo 제거 기대했는데 sudo 성공**: 이전 단계에서 sudo 복원 안 했는지, 러너 OS가 Linux/macOS인지 확인. 새 작업으로 재실행.
- **`drop-sudo` 후 권한 에러**: 액션 실행 전 write 액세스 부여 (예: `chmod -R g+rwX "$GITHUB_WORKSPACE"` 또는 unprivileged-user 패턴)
- **Unauthorized 트리거 차단**: 기본 write collaborator 외 service 계정 허용 필요 시 `allow-users`/`allow-bots` 입력 조정

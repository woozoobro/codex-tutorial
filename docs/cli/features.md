---
원문: https://developers.openai.com/codex/cli/features
동기화일: 2026-05-15
---

# CLI 기능

> Codex 터미널 클라이언트의 기능 개요

Codex는 채팅 이상의 워크플로를 지원한다. 각 기능이 무엇을 가능하게 하고 언제 쓰면 좋은지 정리한다.

## 인터랙티브 모드

`codex`를 실행하면 풀스크린 TUI가 시작된다. 리포 읽기, 파일 수정, 명령 실행을 함께 반복할 수 있다.

```bash
codex
codex "Explain this codebase to me"
```

세션이 열린 후 가능한 동작:

- 프롬프트, 코드 스니펫, 스크린샷([이미지 입력](#이미지-입력)) 전송
- Codex가 변경 전 계획을 설명 → 단계별 승인/거부
- 신택스 하이라이트된 마크다운 코드 블록과 diff 보기, `/theme`로 테마 미리보기·저장
- `/clear`로 채팅 초기화 (Ctrl+L은 화면만 지움)
- `/copy` 또는 Ctrl+O로 마지막 완료된 출력 복사
- Codex가 동작 중일 때 Tab으로 다음 턴에 보낼 텍스트·슬래시 명령·`!` 셸 명령 큐잉
- Up/Down으로 작성 히스토리 탐색
- Ctrl+R로 프롬프트 히스토리 검색
- Ctrl+C 또는 `/exit`로 종료

## 대화 재개 (Resume)

Codex는 트랜스크립트를 로컬에 저장한다. 컨텍스트 반복 없이 이전 작업을 이어가려면 `resume` 사용.

- `codex resume` — 최근 인터랙티브 세션 picker 열기
- `codex resume --all` — 현재 작업 디렉터리 외부 세션도 표시
- `codex resume --last` — 현재 디렉터리의 최신 세션으로 바로 (`--all`로 디렉터리 필터 무시)
- `codex resume <id>` — 특정 세션 ID. ID는 picker, `/status`, `~/.codex/sessions/`에서 확인

비인터랙티브 자동화도 재개 가능:

```bash
codex exec resume --last "Fix the race conditions you found"
codex exec resume 7f9f9a2e-1b3c-... "Implement the plan"
```

원본 트랜스크립트, 계획 히스토리, 승인 내역이 유지된다. 재개 전에 `--cd`로 작업 디렉터리를 바꾸거나 `--add-dir`로 추가 루트를 지정할 수 있다.

## TUI를 원격 app server에 연결

원격 TUI 모드는 한 머신에서 app server를 실행하고, 다른 머신에서 TUI로 접속한다. 코드·자격증명·실행 환경이 원격에 있을 때 유용.

원격 호스트:
```bash
codex app-server --listen ws://127.0.0.1:4500
```

로컬 TUI:
```bash
codex --remote ws://127.0.0.1:4500
```

다른 머신에서 접속하려면 닿을 수 있는 인터페이스에 바인드:
```bash
codex app-server --listen ws://0.0.0.0:4500
```

`--remote`는 명시적인 `ws://host:port` 또는 `wss://host:port`만 받는다. 평문 WebSocket이면 localhost나 SSH 포트 포워딩 권장. 외부에 노출할 때는 인증 + TLS 필수.

### WebSocket 인증 모드

- **인증 없음**: localhost 또는 SSH 포트 포워딩 전용. 비-localhost 리스너도 인증 없이 시작 가능하지만 경고 로그 + 시작 배너로 알림.
- **Capability token**: app-server 호스트에 공유 토큰 파일 저장 → `--ws-auth capability-token --ws-token-file /abs/path/to/token`. TUI 호스트는 환경 변수에 토큰 저장 후 `--remote-auth-token-env <ENV_VAR>`.
- **Signed bearer token**: HMAC 공유 시크릿 파일 → `--ws-auth signed-bearer-token --ws-shared-secret-file /abs/path/to/secret`. TUI는 서명된 JWT bearer token을 `--remote-auth-token-env`로 전송. 시크릿은 32바이트 이상, HS256, `exp` 필수.

Capability token 생성 예:
```bash
TOKEN_FILE="$HOME/.codex/codex-app-server-token"
install -d -m 700 "$(dirname "$TOKEN_FILE")"
openssl rand -base64 32 > "$TOKEN_FILE"
chmod 600 "$TOKEN_FILE"
```

TLS proxy 뒤에서 사용하는 예:
```bash
# 원격 호스트
TOKEN_FILE="$HOME/.codex/codex-app-server-token"
codex app-server \
  --listen ws://0.0.0.0:4500 \
  --ws-auth capability-token \
  --ws-token-file "$TOKEN_FILE"

# TUI 호스트
export CODEX_REMOTE_AUTH_TOKEN="$(ssh devbox 'cat ~/.codex/codex-app-server-token')"
codex --remote wss://codex-devbox.example.com:4500 \
  --remote-auth-token-env CODEX_REMOTE_AUTH_TOKEN
```

TUI는 토큰을 `Authorization: Bearer <token>`으로 WebSocket 핸드셰이크에 실어 보낸다. `wss://` 또는 호스트가 `localhost`/`127.0.0.1`/`::1`인 `ws://`에서만 토큰을 보낸다. 네트워크 인증이 필요하면 비-로컬 리스너는 반드시 TLS 뒤에 둘 것.

## 모델과 추론

대부분 작업에는 `gpt-5.5` 권장 (사용 가능할 때). OpenAI의 최신 프론티어 모델로 복잡한 코딩, 컴퓨터 사용, 지식 작업, 리서치 워크플로에 강함. 멀티스텝 작업의 계획·도구 사용·후속 처리가 우수. 사용 불가면 `gpt-5.4`. 매우 빠른 작업이 필요하면 ChatGPT Pro 가입자는 GPT-5.3-Codex-Spark (research preview) 사용 가능.

세션 중 `/model` 명령으로 전환하거나, 시작 시 지정:
```bash
codex --model gpt-5.5
```

→ [Codex 모델 자세히 보기](../concepts/models.md)

## 기능 플래그 (Feature flags)

```bash
codex features list
codex features enable unified_exec
codex features disable shell_snapshot
```

`enable`/`disable`은 `~/.codex/config.toml`에 기록. `--profile`로 실행하면 해당 프로필에 기록.

## 서브에이전트

큰 작업을 병렬화할 때 사용. 셋업·역할 설정(`[agents]` in `config.toml`)·예시는 [Subagents](../configuration/subagents.md) 참고.

명시적으로 요청해야만 Codex가 서브에이전트를 띄운다. 각 서브에이전트가 자체 모델·도구를 쓰므로 단일 에이전트 대비 토큰 소비량 ↑.

## 이미지 입력

스크린샷·디자인 스펙을 첨부해 Codex가 함께 읽도록. composer에 붙여넣거나 커맨드라인에 파일 지정.

```bash
codex -i screenshot.png "Explain this error"
codex --image img1.png,img2.jpg "Summarize these diagrams"
```

PNG, JPEG 등 일반 포맷 지원. 여러 파일은 콤마로 구분.

## 이미지 생성

CLI에서 직접 이미지 생성·편집 가능. 아이콘, 배너, 일러스트, 스프라이트 시트, 플레이스홀더 아트에 적합. 기존 자산을 변형/확장하려면 참조 이미지를 함께 첨부.

자연어로 요청하거나 프롬프트에 `$imagegen`을 명시.

내장 이미지 생성은 `gpt-image-2` 사용. 일반 Codex 사용량 한도에 카운트되며, 평균적으로 비슷한 턴 대비 3-5배 빠르게 한도 소진 (이미지 품질·크기에 따라). → [Pricing](../getting-started/pricing.md)

대량 생성은 `OPENAI_API_KEY` 환경 변수를 설정하고 API 경로로 요청해 API 가격 적용.

## 신택스 하이라이트와 테마

TUI는 fenced 마크다운 코드 블록과 파일 diff에 신택스 하이라이트 적용.

`/theme`로 picker 열기 → 라이브 미리보기 → 선택값을 `tui.theme`에 저장 (`~/.codex/config.toml`). `$CODEX_HOME/themes`에 커스텀 `.tmTheme` 파일 추가 가능.

## 로컬 코드 리뷰

CLI에서 `/review` 입력 → 리뷰 프리셋 열림. 작업 트리를 건드리지 않고 선택한 diff를 읽어 우선순위가 매겨진 액션 가능 발견 사항을 보고. 기본은 현재 세션 모델 사용, `config.toml`의 `review_model`로 오버라이드.

- **Review against a base branch** — 로컬 브랜치 선택 → upstream 머지 베이스 대비 diff → PR 전 위험 강조
- **Review uncommitted changes** — staged·unstaged·untracked 모두 검사
- **Review a commit** — 최근 커밋 목록에서 SHA 선택
- **Custom review instructions** — 직접 작성한 지시문으로 같은 리뷰어 실행 (예: "접근성 회귀에 집중")

각 실행은 자체 턴으로 트랜스크립트에 남아 코드 변화에 따라 재실행·비교 가능.

## 웹 검색

Codex에는 first-party 웹 검색 도구가 내장. 로컬 작업에서는 기본 활성화되며, OpenAI가 유지하는 웹 검색 캐시(prebuilt index)에서 결과 제공. 임의 라이브 콘텐츠로부터 prompt injection 노출 감소 효과 (단, 결과는 여전히 untrusted로 간주). `--yolo` 또는 [full access sandbox](../administration/agent-approvals-security.md)에서는 라이브 결과 기본.

최신 데이터가 필요하면:
- 단일 실행: `--search`
- 영구: `web_search = "live"` ([Config basics](../configuration/config-basic.md))
- 끄기: `web_search = "disabled"`

트랜스크립트나 `codex exec --json`에서 `web_search` 항목으로 표시.

## 입력 프롬프트로 실행 (1회성)

```bash
codex "explain this codebase"
```

작업 디렉터리를 읽고 → 계획 → 응답 스트리밍 → 종료. `--path`로 디렉터리 지정, `--model`로 동작 조정.

## 셸 자동완성

```bash
codex completion bash
codex completion zsh
codex completion fish
```

zsh 예시:
```bash
# ~/.zshrc
eval "$(codex completion zsh)"
```

새 세션에서 `codex` + Tab. `command not found: compdef` 에러가 나면 `eval` 라인 위에 `autoload -Uz compinit && compinit` 추가 후 재시작.

## 승인 모드 (Approval modes)

Codex가 확인 없이 얼마나 할 수 있는지 정의. 인터랙티브 세션에서 `/permissions`로 전환.

- **Auto** (기본) — 작업 디렉터리 안에서 읽기·편집·실행 자유. 외부 접근이나 네트워크 사용은 확인.
- **Read-only** — 컨설턴트 모드. 파일 탐색만, 변경·실행은 계획 승인 후.
- **Full Access** — 머신 전반 + 네트워크 접근, 확인 없이. 신뢰하는 리포·작업에서만 제한적으로.

Codex는 항상 액션 트랜스크립트를 보여주므로 git으로 검토·롤백 가능.

## Codex 스크립팅

`exec`로 비인터랙티브 실행, 최종 계획·결과를 stdout으로:

```bash
codex exec "fix the CI failure"
```

셸 스크립트와 결합해 changelog 자동 갱신, 이슈 분류, PR 전 에디토리얼 검사 같은 워크플로 구축.

## Codex Cloud 작업

`codex cloud`로 [Codex cloud tasks](../web/overview.md)를 터미널에서 처리. 인자 없이 실행 → 인터랙티브 picker → 활성/완료 작업 탐색 → 변경을 로컬에 적용.

직접 실행:
```bash
codex cloud exec --env ENV_ID "Summarize open bugs"
```

`--attempts` (1–4)로 best-of-N 실행:
```bash
codex cloud exec --env ENV_ID --attempts 3 "Summarize open bugs"
```

환경 ID는 Codex cloud 설정에서 → `codex cloud` + Ctrl+O 또는 웹 대시보드에서 확인. 인증은 기존 CLI 로그인을 따르고, 제출 실패 시 non-zero exit으로 CI 연계 가능.

## 슬래시 명령어

`/review`, `/fork`, `/side` 등 + 재사용 가능한 자체 프롬프트. 빌트인 카탈로그와 커스텀 작성법은 [슬래시 명령어](slash-commands.md) 참고.

## 프롬프트 에디터

긴 프롬프트 작성 시 외부 에디터로 전환. composer에서 Ctrl+G → `VISUAL` (또는 `EDITOR`) 환경 변수의 에디터 열림.

## MCP (Model Context Protocol)

`~/.codex/config.toml`에서 STDIO·streaming HTTP 서버 추가, 또는 `codex mcp` 명령으로 관리. 세션 시작 시 자동 launch, 빌트인 도구와 나란히 노출. Codex 자체를 다른 에이전트의 MCP 서버로도 실행 가능.

→ [MCP 자세히 보기](../configuration/mcp.md)

## 팁과 단축키

- composer에 `@` → 워크스페이스 루트 fuzzy 파일 검색, Tab/Enter로 경로 삽입
- Codex 동작 중 Enter → 현재 턴에 새 지시 주입, Tab → 다음 턴 입력 큐잉. 큐잉된 입력은 일반 프롬프트, 슬래시 명령(`/review` 등), `!` 셸 명령 모두 가능.
- 줄 앞에 `!` → 로컬 셸 명령 실행 (예: `!ls`). Codex는 사용자 제공 명령 결과로 취급, 승인·샌드박스 설정 적용.
- composer가 비었을 때 Esc 두 번 → 직전 사용자 메시지 편집, 계속 Esc → 트랜스크립트 위로, Enter로 그 지점에서 fork.
- `codex --cd <path>` → 작업 루트만 다르게. 헤더에 활성 경로 표시.
- `--add-dir`로 쓰기 가능 루트 추가 (예: `codex --cd apps/frontend --add-dir ../backend --add-dir ../shared`)
- 환경(파이썬 venv, 데몬, 환경 변수)은 Codex 시작 전 미리 셋업 → 토큰 절약

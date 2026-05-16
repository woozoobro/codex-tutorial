---
원문: https://developers.openai.com/codex/cli/reference
동기화일: 2026-05-15
---

# 커맨드라인 옵션 (Command line options)

> Codex 터미널 클라이언트의 옵션과 플래그

## 읽는 법

이 페이지는 문서화된 모든 Codex CLI 명령과 플래그를 정리한다. 각 섹션은 옵션의 안정도(stable / experimental)와 위험한 조합을 표기한다.

CLI는 대부분의 기본값을 `~/.codex/config.toml`에서 상속한다. 커맨드라인의 `-c key=value` 오버라이드는 해당 실행에 한해 우선한다. → [Config basics](../configuration/config-basic.md)

## 글로벌 플래그

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `--add-dir` | `path` | 메인 워크스페이스와 함께 쓰기 가능한 추가 디렉터리. 여러 경로면 반복. |
| `--ask-for-approval, -a` | `untrusted \| on-request \| never` | 명령 실행 전 사람 승인 모드. `on-failure`는 deprecated; 인터랙티브에는 `on-request`, 비인터랙티브엔 `never` 권장. |
| `--cd, -C` | `path` | 에이전트가 요청 처리 전에 사용할 작업 디렉터리 |
| `--config, -c` | `key=value` | 설정 오버라이드. 가능하면 JSON으로 파싱, 아니면 문자열 그대로 |
| `--dangerously-bypass-approvals-and-sandbox, --yolo` | `boolean` | 승인·샌드박스 모두 우회. 외부에서 강하게 격리된 환경에서만. |
| `--disable` | `feature` | 기능 플래그 강제 비활성화 (`-c features.<name>=false`). 반복 가능. |
| `--enable` | `feature` | 기능 플래그 강제 활성화. 반복 가능. |
| `--image, -i` | `path[,path...]` | 초기 프롬프트에 이미지 첨부. 콤마 구분 또는 반복. |
| `--model, -m` | `string` | 설정의 모델 오버라이드 (예: `gpt-5.4`) |
| `--no-alt-screen` | `boolean` | TUI 대체 스크린 모드 비활성화 (이번 실행만) |
| `--oss` | `boolean` | 로컬 OSS 모델 프로바이더 사용 (`-c model_provider="oss"` 동등). Ollama 실행 검증. |
| `--profile, -p` | `string` | `~/.codex/config.toml`에서 로드할 프로필 이름 |
| `--remote` | `ws://host:port \| wss://host:port` | TUI를 원격 app-server WebSocket에 연결. `codex`, `codex resume`, `codex fork`만 지원. |
| `--remote-auth-token-env` | `ENV_VAR` | `--remote` 연결 시 bearer token을 읽을 환경 변수. `wss://` 또는 localhost `ws://`에서만 전송. |
| `--sandbox, -s` | `read-only \| workspace-write \| danger-full-access` | 모델 생성 셸 명령에 적용할 샌드박스 정책 |
| `--search` | `boolean` | 라이브 웹 검색 활성화 (`web_search = "live"`, 기본 `cached`) |
| `PROMPT` | `string` | 세션 시작 시 제공할 텍스트 지시 (선택) |

플래그는 베이스 `codex` 명령에 적용되고, 명시되지 않으면 서브명령으로도 전파된다. 서브명령 사용 시 글로벌 플래그를 **서브명령 뒤에** 두어야 의도대로 적용 (예: `codex exec --oss ...`).

## 명령 개요

Maturity 컬럼은 Experimental, Beta, Stable 중 하나. → [Feature Maturity](../resources/feature-maturity.md)

| 명령 | Maturity | 설명 |
| --- | --- | --- |
| `codex` | Stable | 터미널 UI 시작. 글로벌 플래그 + 선택적 프롬프트·이미지. |
| `codex app` | Stable | 데스크톱 앱 실행 (macOS/Windows). macOS는 워크스페이스 경로 열기, Windows는 경로 출력. |
| `codex app-server` | Experimental | Codex app server 실행 (개발/디버깅용) |
| `codex apply` | Stable | 가장 최근 Codex Cloud 작업의 diff를 로컬에 적용. Alias: `codex a`. |
| `codex cloud` | Experimental | TUI 없이 터미널에서 Codex Cloud 작업 탐색·실행. Alias: `codex cloud-tasks`. |
| `codex completion` | Stable | Bash, Zsh, Fish, PowerShell 자동완성 스크립트 생성 |
| `codex debug app-server send-message-v2` | Experimental | app-server에 V2 메시지 한 건 전송 (디버그) |
| `codex debug models` | Experimental | Codex가 보는 raw 모델 카탈로그 출력 |
| `codex exec` | Stable | 비인터랙티브 실행. Alias: `codex e`. stdout/JSONL 스트림, 이전 세션 재개 가능. |
| `codex execpolicy` | Experimental | execpolicy 룰 평가 (allow/prompt/block) |
| `codex features` | Stable | 기능 플래그 목록·영구 활성화/비활성화 (`config.toml` 기록) |
| `codex fork` | Stable | 이전 인터랙티브 세션을 새 스레드로 fork |
| `codex login` | Stable | ChatGPT OAuth, device auth, 또는 stdin API 키로 인증 |
| `codex logout` | Stable | 저장된 자격증명 제거 |
| `codex mcp` | Experimental | MCP 서버 관리 (list/add/remove/authenticate) |
| `codex mcp-server` | Experimental | Codex 자체를 stdio MCP 서버로 실행. 다른 에이전트가 Codex를 소비할 때 유용. |
| `codex plugin marketplace` | Experimental | Git/로컬 소스에서 플러그인 마켓플레이스 추가·업그레이드·제거 |
| `codex resume` | Stable | ID 또는 최신 세션으로 인터랙티브 세션 재개 |
| `codex sandbox` | Experimental | Codex의 macOS/Linux/Windows 샌드박스에서 임의 명령 실행 |
| `codex update` | Stable | self-update 가능한 릴리스에서 CLI 업데이트 |

---

## 명령 상세

### `codex` (인터랙티브)

서브명령 없이 `codex` 실행 시 인터랙티브 TUI 시작. 글로벌 플래그 + 이미지 첨부 지원. 웹 검색 기본은 cached, `--search`로 라이브. 부담 적은 로컬 작업: `--sandbox workspace-write --ask-for-approval on-request`.

원격 app server 연결: `--remote ws://host:port` 또는 `--remote wss://host:port` (`codex app-server --listen ws://IP:PORT`로 시작한 서버에 접속). 인증 필요 시 `--remote-auth-token-env <ENV_VAR>`. → [features#TUI 원격 연결](features.md#tui를-원격-app-server에-연결)

### `codex app-server`

로컬 app server 실행. 주로 개발·디버깅용, 사전 공지 없이 변경될 수 있음.

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `--listen` | `stdio:// \| ws://IP:PORT` | 트랜스포트 리스너 URL. WebSocket 엔드포인트는 `ws://IP:PORT` |
| `--ws-audience` | `string` | 서명된 bearer token의 `aud` 클레임. `--ws-auth signed-bearer-token` 필요 |
| `--ws-auth` | `capability-token \| signed-bearer-token` | WebSocket 클라이언트 인증 모드. 미지정 시 비활성화, 비-로컬 리스너는 시작 시 경고 |
| `--ws-issuer` | `string` | 서명된 bearer token의 `iss` 클레임 |
| `--ws-max-clock-skew-seconds` | `number` | `exp`/`nbf` 검증 시 시계 편차 허용 |
| `--ws-shared-secret-file` | `absolute path` | JWT bearer token 검증용 HMAC 시크릿 파일. signed-bearer-token에 필수 |
| `--ws-token-file` | `absolute path` | 공유 capability token 파일. capability-token에 필수 |

`--listen stdio://`는 기본 JSONL-over-stdio. `ws://IP:PORT`는 WebSocket 트랜스포트. `wss://`로 받으려면 TLS 종단 또는 보안 프록시 사용. 클라이언트 바인딩용 스키마 생성에는 `--experimental` 추가.

### `codex app`

데스크톱 Codex 앱 실행. macOS는 지정 경로로 워크스페이스 열기, Windows는 경로 출력.

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `--download-url` | `url` | 설치 시 사용할 인스톨러 URL 오버라이드 (고급) |
| `PATH` | `path` | 워크스페이스 경로 |

설치된 앱이 있으면 열고, 없으면 인스톨러 시작.

### `codex apply`

Codex Cloud 작업의 가장 최근 diff를 로컬 리포에 적용. 인증 + 작업 접근 권한 필요.

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `TASK_ID` | `string` | diff를 적용할 Codex Cloud 작업 ID |

패치된 파일 출력. `git apply` 실패(예: 충돌) 시 non-zero exit.

### `codex cloud`

터미널에서 Codex cloud 작업 다루기. 기본은 인터랙티브 picker, `codex cloud exec`는 작업 직접 제출, `codex cloud list`는 최근 작업을 스크립팅 친화 출력.

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `--attempts` | `1-4` | best-of-N 시도 수 |
| `--env` | `ENV_ID` | 대상 Codex Cloud 환경 ID (필수). `codex cloud`로 목록 확인. |
| `QUERY` | `string` | 작업 프롬프트. 생략 시 인터랙티브로 입력. |

#### `codex cloud list`

최근 클라우드 작업 나열, 필터링·페이지네이션 가능.

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `--cursor` | `string` | 이전 요청에서 받은 페이지네이션 커서 |
| `--env` | `ENV_ID` | 환경 ID로 필터 |
| `--json` | `boolean` | 머신 판독 가능한 JSON 출력 |
| `--limit` | `1-20` | 최대 작업 수 |

JSON 페이로드: `tasks` 배열 + `cursor`. 각 작업은 `id`, `url`, `title`, `status`, `updated_at`, `environment_id`, `environment_label`, `summary`, `is_review`, `attempt_total` 포함.

### `codex completion`

셸 자동완성 스크립트 생성. 출력은 stdout으로 (예: `codex completion zsh > "${fpath[1]}/_codex"`).

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `SHELL` | `bash \| zsh \| fish \| power-shell \| elvish` | 대상 셸 |

### `codex features`

`~/.codex/config.toml`의 기능 플래그 관리. `enable`/`disable`은 영구 저장. `--profile` 사용 시 해당 프로필에 기록.

| 서브 | 형식 | 설명 |
| --- | --- | --- |
| `list` | `codex features list` | 알려진 플래그 + maturity + 현재 상태 표시 |
| `enable` | `codex features enable <feature>` | 영구 활성화 |
| `disable` | `codex features disable <feature>` | 영구 비활성화 |

### `codex exec`

스크립트·CI용 비인터랙티브 실행 (alias: `codex e`).

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `--cd, -C` | `path` | 작업 루트 |
| `--color` | `always \| never \| auto` | stdout ANSI 컬러 |
| `--image, -i` | `path[,path...]` | 첫 메시지에 이미지 첨부 |
| `--json, --experimental-json` | `boolean` | newline-delimited JSON 이벤트 출력 |
| `--model, -m` | `string` | 모델 오버라이드 |
| `--oss` | `boolean` | 로컬 OSS 프로바이더 (Ollama 필요) |
| `--output-last-message, -o` | `path` | 어시스턴트 최종 메시지를 파일에 기록 |
| `--output-schema` | `path` | 최종 응답 형태 검증용 JSON Schema |
| `--profile, -p` | `string` | 설정 프로필 |
| `--sandbox, -s` | `read-only \| workspace-write \| danger-full-access` | 샌드박스 정책 |
| `--skip-git-repo-check` | `boolean` | Git 리포 외부에서 실행 허용 |
| `-c, --config` | `key=value` | 인라인 설정 오버라이드 (반복 가능) |
| `PROMPT` | `string \| -` | 초기 지시. `-`로 stdin에서 읽기. |

기본 출력은 포맷팅된 텍스트. `--json` 추가 시 상태 변화당 한 줄 JSON 이벤트.

#### `codex exec resume`

비인터랙티브 작업 재개. `--last`로 현재 디렉터리 최신 세션, `--all`로 모든 디렉터리 세션 검색.

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `--all` | `boolean` | 디렉터리 외부 세션 포함 |
| `--image, -i` | `path[,path...]` | 후속 프롬프트에 이미지 첨부 |
| `--last` | `boolean` | 현재 디렉터리의 최신 대화 재개 |
| `PROMPT` | `string \| -` | 재개 직후 보낼 후속 지시 |
| `SESSION_ID` | `uuid` | 특정 세션 재개 (생략하면 `--last` 사용) |

### `codex execpolicy`

execpolicy 룰 파일을 저장 전 검사. `--rules` 플래그(반복 가능)로 룰 파일 지정 → 가장 엄격한 결정 + 매칭 룰을 JSON으로 출력. `--pretty`로 포맷팅. (Preview)

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `--pretty` | `boolean` | JSON pretty-print |
| `--rules, -r` | `path (반복)` | 평가할 execpolicy 룰 파일 |
| `COMMAND...` | `var-args` | 검사할 명령 |

### `codex login`

ChatGPT 계정 또는 API 키로 CLI 인증. 플래그 없이 실행 시 ChatGPT OAuth로 브라우저 열림.

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `--device-auth` | `boolean` | 브라우저 대신 OAuth device code flow |
| `--with-api-key` | `boolean` | stdin에서 API 키 읽기 (예: `printenv OPENAI_API_KEY \| codex login --with-api-key`) |
| `status` | `codex login status` | 활성 인증 모드 출력, 로그인 상태면 exit 0 |

### `codex logout`

API 키·ChatGPT 자격증명 모두 제거. 플래그 없음.

### `codex mcp`

`~/.codex/config.toml`의 MCP 서버 항목 관리.

| 서브 | 옵션 | 설명 |
| --- | --- | --- |
| `add <name>` | `-- <command>` 또는 `--url <url>` | stdio 런처 또는 streamable HTTP URL로 서버 등록. stdio는 `--env KEY=VALUE` 지원 |
| `get <name>` | `--json` | 특정 서버 설정 표시. `--json`은 raw 항목 |
| `list` | `--json` | 설정된 MCP 서버 목록 |
| `login <name>` | `--scopes scope1,scope2` | streamable HTTP 서버 OAuth 로그인 (OAuth 지원 서버만) |
| `logout <name>` | — | streamable HTTP 서버의 저장된 OAuth 자격증명 제거 |
| `remove <name>` | — | 저장된 MCP 서버 정의 삭제 |

#### `add` 옵션

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `--bearer-token-env-var` | `ENV_VAR` | streamable HTTP 서버 연결 시 bearer token으로 보낼 환경 변수 |
| `--env KEY=VALUE` | 반복 가능 | stdio 서버 launch 시 적용할 환경 변수 |
| `--url` | `https://...` | streamable HTTP 서버 등록 (`COMMAND...`와 상호 배타) |
| `COMMAND...` | stdio 트랜스포트 | MCP 서버 launch 실행 파일 + 인자. `--` 뒤에 작성. |

OAuth 액션(`login`, `logout`)은 streamable HTTP 서버에서만 동작 (그리고 서버가 OAuth 지원 시).

### `codex plugin marketplace`

Codex가 탐색·설치할 수 있는 플러그인 마켓플레이스 소스 관리.

| 서브 | 옵션 | 설명 |
| --- | --- | --- |
| `add <source>` | `[--ref REF] [--sparse PATH]` | GitHub 약식, Git URL, SSH URL, 로컬 디렉터리에서 마켓플레이스 설치. `--sparse`는 Git 소스만, 반복 가능 |
| `remove <name>` | — | 마켓플레이스 제거 |
| `upgrade [marketplace-name]` | — | 한 개 또는 모든 Git 마켓플레이스 새로고침 |

지원 소스: GitHub 약식 (`owner/repo` 또는 `owner/repo@ref`), HTTP/HTTPS Git URL, SSH Git URL, 로컬 디렉터리. `--ref`로 Git ref 고정.

### `codex mcp-server`

다른 도구가 연결할 수 있도록 Codex를 stdio MCP 서버로 실행. 글로벌 설정 오버라이드 상속, 다운스트림 클라이언트가 연결 종료 시 종료.

### `codex resume`

ID로 또는 최신 대화로 인터랙티브 세션 이어가기. `--last`는 현재 작업 디렉터리에 한정 (벗어나려면 `--all`). `codex`의 글로벌 플래그(model, sandbox 오버라이드 등) 모두 수용.

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `--all` | `boolean` | 현재 디렉터리 외부 세션 포함 |
| `--last` | `boolean` | picker 건너뛰고 최신 대화 재개 |
| `SESSION_ID` | `uuid` | 특정 세션 재개 |

### `codex fork`

이전 인터랙티브 세션을 새 스레드로 fork. 기본은 picker, `--last`로 최신 fork.

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `--all` | `boolean` | picker에서 디렉터리 외부 세션도 표시 |
| `--last` | `boolean` | picker 건너뛰고 최신 자동 fork |
| `SESSION_ID` | `uuid` | 특정 세션 fork |

### `codex sandbox`

Codex 내부와 동일한 정책으로 명령 실행하는 헬퍼.

#### macOS Seatbelt

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `--allow-unix-socket` | `path` | 이 경로 기반 Unix 소켓 bind/connect 허용. 반복 가능 |
| `--cd, -C` | `DIR` | 프로필 해석·실행에 사용할 작업 디렉터리. `--permissions-profile` 필요 |
| `--config, -c` | `key=value` | 설정 오버라이드 (반복) |
| `--include-managed-config` | `boolean` | 명시적 권한 프로필 해석 시 managed 요구사항 포함 |
| `--log-denials` | `boolean` | 실행 중 macOS 샌드박스 거부를 `log stream`으로 캡처해 종료 후 출력 |
| `--permissions-profile` | `NAME` | 활성 설정 스택에서 명명된 권한 프로필 적용 |
| `COMMAND...` | `var-args` | Seatbelt 하에서 실행할 셸 명령. `--` 뒤 모든 것 전달 |

#### Linux Landlock

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `--cd, -C` | `DIR` | 작업 디렉터리. `--permissions-profile` 필요 |
| `--config, -c` | `key=value` | 설정 오버라이드 |
| `--include-managed-config` | `boolean` | managed 요구사항 포함 |
| `--permissions-profile` | `NAME` | 권한 프로필 적용 |
| `COMMAND...` | `var-args` | Landlock + seccomp 하에서 실행 |

#### Windows

| 키 | 타입/값 | 설명 |
| --- | --- | --- |
| `--cd, -C` | `DIR` | 작업 디렉터리. `--permissions-profile` 필요 |
| `--config, -c` | `key=value` | 설정 오버라이드 |
| `--include-managed-config` | `boolean` | managed 요구사항 포함 |
| `--permissions-profile` | `NAME` | 권한 프로필 적용 |
| `COMMAND...` | `var-args` | 네이티브 Windows 샌드박스에서 실행 |

### `codex update`

self-update 가능한 릴리스에서 CLI 업데이트. Debug 빌드는 release 빌드를 설치하라고 안내만 출력.

---

## 플래그 조합 & 안전 팁

- 워크스페이스 안에서 무인 작업: `--sandbox workspace-write` 사용. 전용 샌드박스 VM 안이 아니면 `--dangerously-bypass-approvals-and-sandbox` 피하기.
- 추가 디렉터리에 쓰기 권한: `--add-dir` 우선, `--sandbox danger-full-access` 강제 금지.
- CI에서 `--json`과 `--output-last-message`를 함께 → 머신 판독 가능한 진행 상황 + 최종 자연어 요약 캡처.

## 관련 자료

- [CLI 개요](overview.md) — 설치, 업그레이드, 빠른 팁
- [Config basics](../configuration/config-basic.md) — 모델·프로바이더 등 기본값 영구 저장
- [Advanced Config](../configuration/config-advanced.md) — 프로필, 프로바이더, 샌드박스 튜닝, 통합
- [AGENTS.md](../configuration/agents-md.md) — Codex 에이전트 능력과 모범 사례 개념

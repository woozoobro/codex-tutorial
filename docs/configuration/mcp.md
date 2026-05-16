---
원문: https://developers.openai.com/codex/mcp
동기화일: 2026-05-15
---

# MCP (Model Context Protocol)

> Codex에 서드파티 도구·컨텍스트 접근 부여

MCP는 모델을 도구·컨텍스트와 연결한다. 서드파티 문서 접근, 브라우저나 Figma 같은 개발 도구 상호작용에 사용.

CLI와 IDE 확장 모두 MCP 서버 지원.

## 지원 기능

- **STDIO 서버**: 로컬 프로세스로 실행 (명령으로 시작). 환경 변수 지원.
- **Streamable HTTP 서버**: 주소로 접근하는 서버.
  - Bearer token 인증
  - OAuth 인증 (`codex mcp login <name>`으로 OAuth 지원 서버 로그인)

## MCP 서버 연결

Codex는 MCP 설정을 다른 Codex 설정과 함께 `config.toml`에 저장. 기본 `~/.codex/config.toml`. `.codex/config.toml`로 프로젝트 스코프도 가능 (신뢰 프로젝트만).

CLI와 IDE 확장은 같은 설정 공유 → 한 번 설정하면 두 클라이언트 간 재셋업 불필요.

설정 방법 두 가지:

1. **CLI 사용**: `codex mcp`로 추가·관리
2. **`config.toml` 직접 편집**: `~/.codex/config.toml` 또는 신뢰 프로젝트의 `.codex/config.toml`

### CLI로 설정

#### MCP 서버 추가

```bash
codex mcp add <name> --env VAR1=VALUE1 --env VAR2=VALUE2 -- <command>
```

예: Context7 (개발 문서용 무료 MCP 서버):

```bash
codex mcp add context7 -- npx -y @upstash/context7-mcp
```

#### 기타 CLI 명령

`codex mcp --help`로 모든 MCP 명령 확인.

#### TUI에서

`codex` TUI에서 `/mcp`로 활성 MCP 서버 확인.

### config.toml로 설정

더 세밀한 제어가 필요하면 `~/.codex/config.toml` (또는 프로젝트 스코프 `.codex/config.toml`) 편집. IDE 확장에서는 gear 메뉴 → **MCP settings → Open config.toml**.

각 서버는 `[mcp_servers.<name>]` 테이블로.

#### STDIO 서버

- `command` (필수): 서버 시작 명령
- `args` (선택): 서버에 전달할 인자
- `env` (선택): 서버에 설정할 환경 변수
- `env_vars` (선택): 허용·전달할 환경 변수
- `cwd` (선택): 서버 시작 작업 디렉터리
- `experimental_environment` (선택): `remote`로 설정 시 가능하면 원격 executor 환경에서 stdio 서버 시작

`env_vars`는 평문 변수 이름 또는 source 객체:

```toml
env_vars = ["LOCAL_TOKEN", { name = "REMOTE_TOKEN", source = "remote" }]
```

문자열 항목과 `source = "local"`은 Codex 로컬 환경에서, `source = "remote"`는 원격 executor 환경에서 읽음 (원격 MCP stdio 필요).

#### Streamable HTTP 서버

- `url` (필수): 서버 주소
- `bearer_token_env_var` (선택): `Authorization`에 보낼 bearer token의 환경 변수
- `http_headers` (선택): 정적 값 헤더 맵
- `env_http_headers` (선택): 환경 변수에서 값을 가져올 헤더 맵

#### 기타 옵션

- `startup_timeout_sec` (선택): 서버 시작 타임아웃 (초). 기본 `10`.
- `tool_timeout_sec` (선택): 도구 실행 타임아웃 (초). 기본 `60`.
- `enabled` (선택): `false`로 삭제 없이 비활성화
- `required` (선택): `true`면 활성 서버 초기화 실패 시 시작 실패
- `enabled_tools` (선택): 도구 allow list
- `disabled_tools` (선택): 도구 deny list (`enabled_tools` 적용 후)

OAuth 프로바이더가 고정 콜백 포트를 요구하면 top-level `mcp_oauth_callback_port`. 미설정 시 ephemeral 포트 사용.

특정 콜백 URL이 필요하면 (예: 원격 Devbox ingress URL, 커스텀 콜백 경로) `mcp_oauth_callback_url` 설정. Codex는 이를 OAuth `redirect_uri`로 사용하고 `mcp_oauth_callback_port`는 콜백 리스너 포트로 계속 사용. 로컬 콜백 URL (예: `localhost`)은 로컬 인터페이스에 bind, 비-로컬은 `0.0.0.0`에 bind 해서 콜백이 호스트에 닿게 함.

MCP 서버가 `scopes_supported`를 advertise하면 OAuth 로그인 중 그 스코프를 우선. 아니면 `config.toml` 설정 스코프로 fallback.

#### config.toml 예시

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
env_vars = ["LOCAL_TOKEN"]

[mcp_servers.context7.env]
MY_ENV_VAR = "MY_ENV_VALUE"
```

```toml
# 선택적 MCP OAuth 콜백 오버라이드 (`codex mcp login`이 사용)
mcp_oauth_callback_port = 5555
mcp_oauth_callback_url = "https://devbox.example.internal/callback"
```

```toml
[mcp_servers.figma]
url = "https://mcp.figma.com/mcp"
bearer_token_env_var = "FIGMA_OAUTH_TOKEN"
http_headers = { "X-Figma-Region" = "us-east-1" }
```

```toml
[mcp_servers.chrome_devtools]
url = "http://localhost:3000/mcp"
enabled_tools = ["open", "screenshot"]
disabled_tools = ["screenshot"]  # enabled_tools 후 적용
startup_timeout_sec = 20
tool_timeout_sec = 45
enabled = true
```

## 유용한 MCP 서버 예시

- [OpenAI Docs MCP](https://developers.openai.com/learn/docs-mcp): OpenAI 개발자 문서 검색·읽기
- [Context7](https://github.com/upstash/context7): 최신 개발자 문서 연결
- Figma [Local](https://developers.figma.com/docs/figma-mcp-server/local-server-installation/) / [Remote](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/): Figma 디자인 접근
- [Playwright](https://www.npmjs.com/package/@playwright/mcp): Playwright로 브라우저 제어·검사
- [Chrome Developer Tools](https://github.com/ChromeDevTools/chrome-devtools-mcp/): Chrome 제어·검사
- [Sentry](https://docs.sentry.io/product/sentry-mcp/#codex): Sentry 로그 접근
- [GitHub](https://github.com/github/github-mcp-server): `git`이 지원하지 않는 GitHub 관리 (PR, 이슈 등)

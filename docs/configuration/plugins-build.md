---
원문: https://developers.openai.com/codex/plugins/build
동기화일: 2026-05-15
---

# 플러그인 빌드 (Build plugins)

> Codex 플러그인 생성·테스트·배포

이 페이지는 플러그인 작성자용. 탐색·설치·사용은 [Plugins](plugins-overview.md) 참고. 한 리포·개인 워크플로에서 반복하는 단계라면 로컬 스킬로 시작. 다음 경우 플러그인 빌드:
- 그 워크플로를 팀에 공유
- 앱 통합·MCP config 번들
- 라이프사이클 훅 패키지
- 안정적 패키지 발행

## $plugin-creator로 플러그인 생성

가장 빠른 셋업: 빌트인 `$plugin-creator` 스킬.

필수 `.codex-plugin/plugin.json` manifest를 scaffold + 테스트용 로컬 마켓플레이스 항목 생성 가능. 이미 플러그인 폴더가 있어도 `$plugin-creator`로 로컬 마켓플레이스에 wire 가능.

### 자체 큐레이트 플러그인 리스트 빌드

마켓플레이스는 플러그인의 JSON 카탈로그. `$plugin-creator`로 단일 플러그인용 생성 → 같은 마켓플레이스에 항목 추가하며 자체 큐레이트 리스트 빌드.

각 마켓플레이스는 플러그인 디렉터리에서 선택 가능 소스로 표시. 리포 스코프 리스트는 `$REPO_ROOT/.agents/plugins/marketplace.json`, 개인 리스트는 `~/.agents/plugins/marketplace.json`. `plugins[]` 아래 플러그인당 한 항목 추가, 각 `source.path`가 마켓플레이스 root 기준 `./` 접두사 상대 경로로 플러그인 폴더 가리키게 함, `interface.displayName`은 picker에 표시할 라벨. → Codex 재시작.

플러그인당 별도 마켓플레이스 불필요. 한 마켓플레이스가 테스트 중엔 단일 플러그인을 노출하다가 더 큰 큐레이트 카탈로그로 성장 가능.

### CLI에서 마켓플레이스 추가

`config.toml`을 수동 편집하는 대신 Codex가 마켓플레이스 소스를 설치·추적하게 하려면:

```bash
codex plugin marketplace add owner/repo
codex plugin marketplace add owner/repo --ref main
codex plugin marketplace add https://github.com/example/plugins.git --sparse .agents/plugins
codex plugin marketplace add ./local-marketplace-root
```

마켓플레이스 소스: GitHub 약식 (`owner/repo` 또는 `owner/repo@ref`), HTTP/HTTPS Git URL, SSH Git URL, 로컬 마켓플레이스 root. `--ref`로 Git ref 고정, `--sparse PATH` 반복으로 Git 백엔드 마켓플레이스의 sparse checkout. `--sparse`는 Git 마켓플레이스 소스에만 유효.

새로고침·제거:
```bash
codex plugin marketplace upgrade
codex plugin marketplace upgrade marketplace-name
codex plugin marketplace remove marketplace-name
```

### 수동으로 플러그인 만들기

스킬 한 개를 패키징한 최소 플러그인부터.

1. `.codex-plugin/plugin.json` manifest가 있는 플러그인 폴더:

```bash
mkdir -p my-first-plugin/.codex-plugin
```

`my-first-plugin/.codex-plugin/plugin.json`:
```json
{
  "name": "my-first-plugin",
  "version": "1.0.0",
  "description": "Reusable greeting workflow",
  "skills": "./skills/"
}
```

`name`은 안정적 kebab-case. Codex가 플러그인 식별자·컴포넌트 namespace로 사용.

2. `skills/<name>/SKILL.md` 아래 스킬 추가:

```bash
mkdir -p my-first-plugin/skills/hello
```

`my-first-plugin/skills/hello/SKILL.md`:
```markdown
---
name: hello
description: Greet the user with a friendly message.
---

Greet the user warmly and ask how you can help.
```

3. 플러그인을 마켓플레이스에 추가. `$plugin-creator`로 생성하거나 [자체 큐레이트 리스트](#자체-큐레이트-플러그인-리스트-빌드) 따라 수동 wire.

이후 MCP config, 앱 통합, 마켓플레이스 메타데이터 추가 가능.

### 로컬 플러그인 수동 설치

리포 마켓플레이스 또는 개인 마켓플레이스 — 누가 플러그인·큐레이트 리스트에 접근할지에 따라.

#### 리포 마켓플레이스 예

마켓플레이스 파일 `$REPO_ROOT/.agents/plugins/marketplace.json`, 플러그인은 `$REPO_ROOT/plugins/` 아래.

Step 1: 플러그인 폴더 복사
```bash
mkdir -p ./plugins
cp -R /absolute/path/to/my-plugin ./plugins/my-plugin
```

Step 2: `$REPO_ROOT/.agents/plugins/marketplace.json` 추가·갱신, `source.path`는 `./` 접두사 상대 경로로 플러그인 디렉터리 가리킴:

```json
{
  "name": "local-repo",
  "plugins": [
    {
      "name": "my-plugin",
      "source": {
        "source": "local",
        "path": "./plugins/my-plugin"
      },
      "policy": {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL"
      },
      "category": "Productivity"
    }
  ]
}
```

Step 3: Codex 재시작 → 플러그인 표시 확인.

#### 개인 마켓플레이스 예

마켓플레이스 파일 `~/.agents/plugins/marketplace.json`, 플러그인은 `~/.codex/plugins/` 아래.

Step 1:
```bash
mkdir -p ~/.codex/plugins
cp -R /absolute/path/to/my-plugin ~/.codex/plugins/my-plugin
```

Step 2: `~/.agents/plugins/marketplace.json`에서 항목의 `source.path`가 그 디렉터리 가리키도록.

Step 3: Codex 재시작.

마켓플레이스 파일이 플러그인 위치를 가리키므로, 위 디렉터리는 예시 — 고정 요구사항 아님. Codex는 `source.path`를 마켓플레이스 root 기준으로 resolve (`.agents/plugins/` 폴더 기준 아님).

플러그인 변경 후 마켓플레이스 항목이 가리키는 플러그인 디렉터리 갱신 + Codex 재시작 → 로컬 설치가 새 파일 픽업.

### 마켓플레이스 메타데이터

리포 마켓플레이스: `$REPO_ROOT/.agents/plugins/marketplace.json`. 개인: `~/.agents/plugins/marketplace.json`. 마켓플레이스 파일은 Codex 카탈로그의 플러그인 순서·설치 정책 제어. 테스트 중 한 플러그인을 표현하거나, 한 마켓플레이스 이름 아래 함께 보일 큐레이트 리스트 표현 가능. 플러그인 추가 전 `version`, publisher 메타데이터, 설치면 카피가 다른 개발자에게 보일 준비 완료 확인.

```json
{
  "name": "local-example-plugins",
  "interface": {
    "displayName": "Local Example Plugins"
  },
  "plugins": [
    {
      "name": "my-plugin",
      "source": {
        "source": "local",
        "path": "./plugins/my-plugin"
      },
      "policy": {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL"
      },
      "category": "Productivity"
    },
    {
      "name": "research-helper",
      "source": {
        "source": "local",
        "path": "./plugins/research-helper"
      },
      "policy": {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL"
      },
      "category": "Productivity"
    }
  ]
}
```

- top-level `name`: 마켓플레이스 식별
- `interface.displayName`: Codex에 표시될 마켓플레이스 제목
- `plugins` 아래 플러그인당 한 객체 추가
- 각 항목의 `source.path`는 Codex가 로드할 플러그인 디렉터리. 리포 설치는 보통 `./plugins/` 아래, 개인 설치는 `./.codex/plugins/<plugin-name>` 일반.
- `source.path`는 마켓플레이스 root 기준 상대, `./`로 시작, root 안에 머물러야 함
- 로컬 항목의 `source`는 평문 문자열 경로도 가능 (`"./plugins/my-plugin"`)
- 각 플러그인 항목에 `policy.installation`, `policy.authentication`, `category` 항상 포함
- `policy.installation` 값: `AVAILABLE`, `INSTALLED_BY_DEFAULT`, `NOT_AVAILABLE`
- `policy.authentication`: 설치 시 또는 첫 사용 시 인증 여부

마켓플레이스 항목은 Git 백엔드 플러그인 소스도 가리킬 수 있음. 플러그인이 리포 root에 있으면 `"source": "url"`, 서브디렉터리에 있으면 `"source": "git-subdir"`:

```json
{
  "name": "remote-helper",
  "source": {
    "source": "git-subdir",
    "url": "https://github.com/example/codex-plugins.git",
    "path": "./plugins/remote-helper",
    "ref": "main"
  },
  "policy": {
    "installation": "AVAILABLE",
    "authentication": "ON_INSTALL"
  },
  "category": "Productivity"
}
```

Git 항목은 `ref` 또는 `sha` selector 사용 가능. 마켓플레이스 항목 소스를 resolve 못 하면 전체 마켓플레이스 실패 대신 그 항목만 건너뜀.

### Codex가 마켓플레이스를 사용하는 방식

플러그인 마켓플레이스는 Codex가 읽고 설치할 수 있는 플러그인 JSON 카탈로그.

Codex가 읽을 수 있는 마켓플레이스 파일:
- 공식 Plugin Directory를 구동하는 큐레이트 마켓플레이스
- 리포 마켓플레이스: `$REPO_ROOT/.agents/plugins/marketplace.json`
- 레거시 호환 마켓플레이스: `$REPO_ROOT/.claude-plugin/marketplace.json`
- 개인 마켓플레이스: `~/.agents/plugins/marketplace.json`

마켓플레이스를 통해 노출된 어떤 플러그인이든 설치 가능. Codex는 `~/.codex/plugins/cache/$MARKETPLACE_NAME/$PLUGIN_NAME/$VERSION/`에 설치. 로컬 플러그인은 `$VERSION`이 `local`, Codex가 마켓플레이스 항목에서 직접 로드 대신 그 캐시 경로의 설치 사본 로드.

각 플러그인 개별 활성/비활성 가능. on/off 상태는 `~/.codex/config.toml`에 저장.

## 패키지·배포

### 플러그인 구조

모든 플러그인은 `.codex-plugin/plugin.json` manifest. 추가로 `skills/`, 라이프사이클 훅용 `hooks/`, 앱·connector 가리키는 `.app.json`, MCP 서버 설정용 `.mcp.json`, 지원 surface에 플러그인을 표현할 자산 포함 가능.

```
my-plugin/
├── .codex-plugin/
│   └── plugin.json     # 필수: 플러그인 manifest
├── skills/
│   └── my-skill/
│       └── SKILL.md    # 선택: 스킬 지시
├── hooks/
│   └── hooks.json      # 선택: 라이프사이클 훅
├── .app.json           # 선택: 앱·connector 매핑
├── .mcp.json           # 선택: MCP 서버 설정
└── assets/             # 선택: 아이콘, 로고, 스크린샷
```

`plugin.json`만 `.codex-plugin/`에. `skills/`, `hooks/`, `assets/`, `.mcp.json`, `.app.json`은 플러그인 root에.

발행 플러그인은 보통 quick-start scaffold의 최소 예보다 풍부한 manifest 사용. Manifest 3가지 역할:
- 플러그인 식별
- 번들 컴포넌트 (스킬, 앱, MCP 서버, 훅) 가리킴
- 설치면 메타데이터 (설명, 아이콘, 법적 링크)

완전한 manifest 예:
```json
{
  "name": "my-plugin",
  "version": "0.1.0",
  "description": "Bundle reusable skills and app integrations.",
  "author": {
    "name": "Your team",
    "email": "team@example.com",
    "url": "https://example.com"
  },
  "homepage": "https://example.com/plugins/my-plugin",
  "repository": "https://github.com/example/my-plugin",
  "license": "MIT",
  "keywords": ["research", "crm"],
  "skills": "./skills/",
  "mcpServers": "./.mcp.json",
  "apps": "./.app.json",
  "hooks": "./hooks/hooks.json",
  "interface": {
    "displayName": "My Plugin",
    "shortDescription": "Reusable skills and apps",
    "longDescription": "Distribute skills and app integrations together.",
    "developerName": "Your team",
    "category": "Productivity",
    "capabilities": ["Read", "Write"],
    "websiteURL": "https://example.com",
    "privacyPolicyURL": "https://example.com/privacy",
    "termsOfServiceURL": "https://example.com/terms",
    "defaultPrompt": [
      "Use My Plugin to summarize new CRM notes.",
      "Use My Plugin to triage new customer follow-ups."
    ],
    "brandColor": "#10A37F",
    "composerIcon": "./assets/icon.png",
    "logo": "./assets/logo.png",
    "screenshots": ["./assets/screenshot-1.png"]
  }
}
```

`.codex-plugin/plugin.json`이 필수 진입점. 다른 manifest 필드는 선택이지만 발행 플러그인이 흔히 사용.

### Manifest 필드

Top-level 필드로 패키지 메타데이터 정의 + 번들 컴포넌트 가리킴:
- `name`, `version`, `description`: 플러그인 식별
- `author`, `homepage`, `repository`, `license`, `keywords`: publisher·discovery 메타데이터
- `skills`, `mcpServers`, `apps`, `hooks`: 플러그인 root 기준 번들 컴포넌트
- `interface`: 설치면 표현 제어

`interface` 객체 — 설치면 메타데이터:
- `displayName`, `shortDescription`, `longDescription`: 제목·설명 카피
- `developerName`, `category`, `capabilities`: publisher·능력 메타데이터
- `websiteURL`, `privacyPolicyURL`, `termsOfServiceURL`: 외부 링크
- `defaultPrompt`, `brandColor`, `composerIcon`, `logo`, `screenshots`: 시작 prompt와 시각 표현

### 경로 룰

- Manifest 경로는 플러그인 root 기준 상대, `./`로 시작
- 시각 자산 (`composerIcon`, `logo`, `screenshots`)은 가능하면 `./assets/` 아래
- `skills`는 번들 스킬 폴더, `apps`는 `.app.json`, `mcpServers`는 `.mcp.json`, `hooks`는 라이프사이클 훅
- 이번 릴리스에서 플러그인 훅 기본 OFF — `[features].plugin_hooks = true` 없이는 번들 훅 실행 안 됨
- 플러그인 훅 활성화 시 `hooks` 생략 → 기본 `./hooks/hooks.json` (있으면) 사용

### 번들 MCP 서버와 라이프사이클 훅

`mcpServers`는 직접 server map 또는 wrapped `mcp_servers` 객체 포함하는 `.mcp.json` 가리킴.

직접 server map:
```json
{
  "docs": {
    "command": "docs-mcp",
    "args": ["--stdio"]
  }
}
```

Wrapped server map:
```json
{
  "mcp_servers": {
    "docs": {
      "command": "docs-mcp",
      "args": ["--stdio"]
    }
  }
}
```

플러그인 훅 기본 OFF. `[features].plugin_hooks = true`이고 플러그인 활성화 시 Codex가 사용자·프로젝트·managed 훅과 함께 플러그인의 라이프사이클 훅 로드.

```toml
[features]
plugin_hooks = true
```

기본 플러그인 훅 파일 `hooks/hooks.json`:
```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 ${PLUGIN_ROOT}/hooks/session_start.py",
            "statusMessage": "Loading plugin context"
          }
        ]
      }
    ]
  }
}
```

`.codex-plugin/plugin.json`에 `hooks` 정의 시 기본 `hooks/hooks.json` 대신 manifest 항목 사용. Manifest 필드는 단일 경로, 경로 배열, 인라인 hooks 객체, 또는 인라인 hooks 객체 배열.

```json
{
  "name": "repo-policy",
  "hooks": ["./hooks/session.json", "./hooks/tools.json"]
}
```

훅 경로는 `skills`, `apps`, `mcpServers`와 같은 manifest 경로 룰: `./` 시작, 플러그인 root 기준 resolve, root 안에 머물기.

플러그인 훅 명령은 Codex 특화 환경 변수 받음:
- `PLUGIN_ROOT`: 설치된 플러그인 root
- `PLUGIN_DATA`: 플러그인의 쓰기 가능 데이터 디렉터리

호환성을 위해 `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA`도 설정.

플러그인 훅은 일반 훅과 같은 이벤트 스키마. → [Hooks](hooks.md)

### 공식 공개 플러그인 발행

공식 Plugin Directory에 플러그인 추가는 **곧 지원**. Self-serve 플러그인 발행·관리도 곧 지원.

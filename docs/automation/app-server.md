---
원문: https://developers.openai.com/codex/app-server
동기화일: 2026-05-15
---

# Codex App Server

> app-server 프로토콜로 Codex를 제품에 임베드

Codex app-server는 Codex가 풍부한 클라이언트 (예: Codex VS Code 확장)을 구동할 때 사용하는 인터페이스. 자체 제품 안에 깊은 통합 — 인증, 대화 히스토리, 승인, 스트림 에이전트 이벤트 — 을 원할 때 사용. 오픈소스: [openai/codex/codex-rs/app-server](https://github.com/openai/codex/tree/main/codex-rs/app-server). 전체 OS 컴포넌트 리스트: [Open Source](../resources/open-source.md)

> 작업 자동화나 CI에서 Codex 실행이면 [Codex SDK](sdk.md)를 대신 사용.

> ⚠️ 이 페이지는 **JSON-RPC API 레퍼런스**. 매우 상세한 메소드·페이로드 스키마는 원문 참고: https://developers.openai.com/codex/app-server. 이 문서는 핵심 구조와 메소드 카테고리를 한국어로 정리.

## 프로토콜

[MCP](https://modelcontextprotocol.io/)처럼 `codex app-server`는 JSON-RPC 2.0 메시지로 양방향 통신 (`"jsonrpc":"2.0"` 헤더는 wire에서 생략).

지원 트랜스포트:
- `stdio` (`--listen stdio://`, 기본): newline-delimited JSON (JSONL)
- `websocket` (`--listen ws://IP:PORT`, 실험·미지원): WebSocket text frame당 JSON-RPC 메시지 1개
- `off` (`--listen off`): 로컬 트랜스포트 노출 안 함

`--listen ws://IP:PORT` 실행 시 같은 리스너가 기본 HTTP 헬스 프로브도 제공:
- `GET /readyz` → 리스너가 새 연결 수용 시 `200 OK`
- `GET /healthz` → 요청에 `Origin` 헤더 없으면 `200 OK`
- `Origin` 헤더 있는 요청은 `403 Forbidden`

WebSocket 트랜스포트는 실험·미지원. `ws://127.0.0.1:PORT` 같은 loopback 리스너는 localhost·SSH 포트 포워딩 워크플로에 적합. 비-loopback WebSocket 리스너는 현재 rollout 중 기본 미인증 연결 허용 → 원격 노출 전 WebSocket auth 설정.

지원 WebSocket auth 플래그:
- `--ws-auth capability-token --ws-token-file /absolute/path`
- `--ws-auth capability-token --ws-token-sha256 HEX`
- `--ws-auth signed-bearer-token --ws-shared-secret-file /absolute/path`

서명된 bearer token은 `--ws-issuer`, `--ws-audience`, `--ws-max-clock-skew-seconds`도 설정 가능. 클라이언트는 WebSocket 핸드셰이크 동안 `Authorization: Bearer <token>` 제시, app-server가 JSON-RPC `initialize` 전에 auth 강제.

> 커맨드라인에 raw bearer token 전달보다 `--ws-token-file` 우선. 클라이언트가 raw 고-엔트로피 토큰을 별도 로컬 시크릿 저장소에 보관할 때만 `--ws-token-sha256` — 해시는 검증자일 뿐, 클라이언트는 여전히 원본 토큰 필요.

WebSocket 모드에서 app-server는 bounded queue 사용. 요청 수신이 가득 차면 서버는 JSON-RPC 에러 코드 `-32001` + 메시지 `"Server overloaded; retry later."`로 새 요청 거부. 클라이언트는 exponentially increasing delay + jitter로 재시도.

## 메시지 스키마

요청 — `method`, `params`, `id`:
```json
{ "method": "thread/start", "id": 10, "params": { "model": "gpt-5.4" } }
```

응답 — `id` echo + `result` 또는 `error`:
```json
{ "id": 10, "result": { "thread": { "id": "thr_123" } } }
```
```json
{ "id": 10, "error": { "code": 123, "message": "Something went wrong" } }
```

알림 — `id` 생략, `method`와 `params`만:
```json
{ "method": "turn/started", "params": { "turn": { "id": "turn_456" } } }
```

CLI에서 TypeScript 스키마 또는 JSON Schema 번들 생성 가능. 출력은 실행한 Codex 버전 특정:
```bash
codex app-server generate-ts --out ./schemas
codex app-server generate-json-schema --out ./schemas
```

## 시작하기

1. 서버 시작: `codex app-server` (기본 stdio) 또는 `codex app-server --listen ws://127.0.0.1:4500` (실험 WebSocket)
2. 선택 트랜스포트로 클라이언트 연결 → `initialize` 후 `initialized` 알림
3. 스레드와 턴 시작 → 활성 트랜스포트 스트림에서 알림 계속 읽기

Node.js / TypeScript 예시:
```typescript
import { spawn } from "node:child_process";
import readline from "node:readline";

const proc = spawn("codex", ["app-server"], {
  stdio: ["pipe", "pipe", "inherit"],
});
const rl = readline.createInterface({ input: proc.stdout });

const send = (message: unknown) => {
  proc.stdin.write(`${JSON.stringify(message)}\n`);
};

let threadId: string | null = null;

rl.on("line", (line) => {
  const msg = JSON.parse(line) as any;
  console.log("server:", msg);

  if (msg.id === 1 && msg.result?.thread?.id && !threadId) {
    threadId = msg.result.thread.id;
    send({
      method: "turn/start",
      id: 2,
      params: {
        threadId,
        input: [{ type: "text", text: "Summarize this repo." }],
      },
    });
  }
});

send({
  method: "initialize",
  id: 0,
  params: {
    clientInfo: {
      name: "my_product",
      title: "My Product",
      version: "0.1.0",
    },
  },
});
send({ method: "initialized", params: {} });
send({ method: "thread/start", id: 1, params: { model: "gpt-5.4" } });
```

## 핵심 primitives

- **Thread**: 사용자와 Codex 에이전트의 대화. 턴 포함.
- **Turn**: 단일 사용자 요청 + 그 뒤를 잇는 에이전트 작업. 항목 포함 + 증분 갱신 스트림.
- **Item**: 입력·출력 단위 (사용자 메시지, 에이전트 메시지, 명령 실행, 파일 변경, 도구 호출 등)

스레드 API로 대화 생성·나열·archive. 턴 API로 대화 진행 + 턴 알림으로 진행 스트림.

## 라이프사이클 개요

- **연결당 한 번 initialize**: 트랜스포트 연결 직후 클라이언트 메타데이터로 `initialize` 요청 → `initialized` emit. 서버는 이 핸드셰이크 전 어떤 요청도 거부.
- **스레드 시작·재개**: 새 대화는 `thread/start`, 기존 대화 계속은 `thread/resume`, 히스토리를 새 스레드 ID로 분기는 `thread/fork`.
- **턴 시작**: 대상 `threadId`와 사용자 입력으로 `turn/start`. 선택 필드로 모델·personality·`cwd`·샌드박스 정책 등 오버라이드.
- **활성 턴 조정**: `turn/steer`로 새 턴 생성 없이 현재 in-flight 턴에 사용자 입력 append.
- **이벤트 스트림**: `turn/start` 후 stdout에서 알림 계속 읽기 — `thread/archived`, `thread/unarchived`, `item/started`, `item/completed`, `item/agentMessage/delta`, 도구 진행, 기타 갱신.
- **턴 종료**: 모델 완료 또는 `turn/interrupt` 취소 후 서버가 최종 status로 `turn/completed` emit.

## Initialization

클라이언트는 트랜스포트 연결당 다른 메소드 호출 전 단일 `initialize` 요청 → `initialized` 알림으로 ack. Initialize 전 요청은 `Not initialized` 에러, 같은 연결의 반복 `initialize`는 `Already initialized` 반환.

서버는 upstream 서비스에 제시할 user agent 문자열 + 런타임 타깃을 설명하는 `platformFamily`·`platformOs` 값 반환. 통합 식별을 위해 `clientInfo` 설정.

`initialize.params.capabilities`는 연결당 알림 opt-out (`optOutNotificationMethods`)도 지원 — 그 연결에서 억제할 정확한 메소드 이름 리스트.

> **중요**: OpenAI Compliance Logs Platform용 클라이언트 식별을 위해 `clientInfo.name` 사용. 엔터프라이즈 사용 의도된 새 Codex 통합 개발 시 known clients 리스트 추가를 위해 OpenAI에 연락. → [Codex logs reference](https://chatgpt.com/admin/api-reference#tag/Logs:-Codex)

VS Code 확장 예:
```json
{
  "method": "initialize",
  "id": 0,
  "params": {
    "clientInfo": {
      "name": "codex_vscode",
      "title": "Codex VS Code Extension",
      "version": "0.1.0"
    }
  }
}
```

## 실험 API opt-in

일부 app-server 메소드·필드는 의도적으로 `experimentalApi` capability 뒤에 게이트.

- `capabilities` 생략 (또는 `experimentalApi: false`) → 안정 API surface 유지, 서버가 실험 메소드·필드 거부
- `capabilities.experimentalApi: true` → 실험 메소드·필드 활성화

```json
{
  "method": "initialize",
  "id": 1,
  "params": {
    "clientInfo": {
      "name": "my_client",
      "title": "My Client",
      "version": "0.1.0"
    },
    "capabilities": {
      "experimentalApi": true
    }
  }
}
```

opt-in 없이 실험 메소드·필드 전송 시:
`<method/field> requires experimentalApi capability`

## API 메소드 일람

> 각 메소드의 정확한 페이로드 스키마는 원문 참고. 이 일람은 카테고리별 메소드 이름과 한국어 설명.

### Threads

| 메소드 | 설명 |
| --- | --- |
| `thread/start` | 새 스레드 생성. `thread/started` emit + 그 스레드의 turn/item 이벤트 자동 구독 |
| `thread/resume` | id로 기존 스레드 재오픈 → 이후 `turn/start` 호출이 그것에 append |
| `thread/fork` | 저장 히스토리 복사로 스레드를 새 ID로 fork. 새 스레드용 `thread/started` emit |
| `thread/read` | 재개 없이 저장 스레드 읽기. `includeTurns`로 전체 턴 히스토리 반환 |
| `thread/list` | 저장 스레드 로그 페이지. cursor 기반 페이지네이션 + `modelProviders`/`sourceKinds`/`archived`/`cwd`/`searchTerm` 필터 |
| `thread/turns/list` | 재개 없이 저장 스레드의 턴 히스토리 페이지 |
| `thread/loaded/list` | 메모리 안에 로드된 스레드 ID 나열 |
| `thread/name/set` | 로드된 스레드·영속 rollout의 사용자용 이름 설정·갱신. `thread/name/updated` emit |
| `thread/goal/set/get/clear` | 로드된 스레드 goal 설정·읽기·clear (실험) |
| `thread/metadata/update` | SQLite 백엔드 저장 스레드 메타데이터 패치 (현재 영속 `gitInfo` 지원) |
| `thread/archive` | 스레드 로그 파일을 archived 디렉터리로. 성공 시 `{}` 반환 + `thread/archived` emit |
| `thread/unarchive` | archived 스레드 rollout을 활성 sessions 디렉터리로 복원 |
| `thread/unsubscribe` | 이 연결의 스레드 turn/item 이벤트 구독 해제. 마지막 구독자였으면 inactivity grace period 후 unload + `thread/closed` emit |
| `thread/status/changed` | (notify) 로드된 스레드의 런타임 status 변경 시 emit |
| `thread/compact/start` | 스레드의 대화 히스토리 압축 트리거. 즉시 `{}` 반환, 진행은 `turn/*`/`item/*` 알림으로 스트림 |
| `thread/shellCommand` | 스레드에 대해 사용자 시작 셸 명령 실행. 샌드박스 외부, 풀 액세스 |
| `thread/backgroundTerminals/clean` | 스레드의 모든 실행 중 백그라운드 터미널 중지 (실험) |
| `thread/rollback` | 메모리 컨텍스트에서 마지막 N개 턴 drop + rollback marker 영속화 |
| `thread/inject_items` | 사용자 턴 시작 없이 raw Responses API 항목을 로드된 스레드 모델 가시 히스토리에 append |

### Turns

| 메소드 | 설명 |
| --- | --- |
| `turn/start` | 사용자 입력을 스레드에 추가 + Codex 생성 시작. 초기 `turn` 응답 + 이벤트 스트림. `collaborationMode`의 `settings.developer_instructions: null`은 "선택 모드의 빌트인 instructions 사용" 의미 |
| `turn/steer` | 스레드의 활성 in-flight 턴에 사용자 입력 append. 수용된 `turnId` 반환 |
| `turn/interrupt` | in-flight 턴 취소 요청. 성공 시 `{}`, 턴은 `status: "interrupted"`로 종료 |

### Review

| 메소드 | 설명 |
| --- | --- |
| `review/start` | 스레드의 Codex reviewer kick off. `enteredReviewMode`/`exitedReviewMode` 항목 emit |

### Command execution

| 메소드 | 설명 |
| --- | --- |
| `command/exec` | 스레드/턴 시작 없이 서버 샌드박스 아래 단일 명령 실행 |
| `command/exec/write` | 실행 중 `command/exec` 세션에 stdin 바이트 쓰기 또는 stdin 닫기 |
| `command/exec/resize` | 실행 중 PTY 백엔드 `command/exec` 세션 리사이즈 |
| `command/exec/terminate` | 실행 중 `command/exec` 세션 중지 |
| `command/exec/outputDelta` | (notify) 스트리밍 `command/exec` 세션의 base64 인코딩 stdout/stderr 청크 |

### Filesystem (v2)

| 메소드 | 설명 |
| --- | --- |
| `fs/readFile`, `fs/writeFile` | 절대 경로 파일 읽기·쓰기 |
| `fs/createDirectory`, `fs/getMetadata`, `fs/readDirectory`, `fs/remove`, `fs/copy` | 파일시스템 작업 |
| `fs/watch`, `fs/unwatch`, `fs/changed` | 파일 watch + 변경 알림 |

### Models & Providers

| 메소드 | 설명 |
| --- | --- |
| `model/list` | 가용 모델 + capability 나열. effort 옵션, 선택 `upgrade`, `inputModalities` 포함. `includeHidden: true`로 숨김 항목 포함 |
| `modelProvider/capabilities/read` | 모델/프로바이더 조합의 프로바이더 capability bound 읽기 (실험) |

### Features

| 메소드 | 설명 |
| --- | --- |
| `experimentalFeature/list` | 라이프사이클 stage 메타데이터 + cursor 페이지네이션으로 기능 플래그 나열 |
| `experimentalFeature/enablement/set` | `apps`, `plugins` 같은 지원 기능 키의 메모리 런타임 enablement 패치 |
| `collaborationMode/list` | collaboration 모드 프리셋 나열 (실험, 페이지네이션 없음) |

### Skills

| 메소드 | 설명 |
| --- | --- |
| `skills/list` | 하나 이상의 `cwd` 값에 대한 스킬 나열 (`forceReload`, 선택 `perCwdExtraUserRoots` 지원) |
| `skills/changed` | (notify) watch된 로컬 스킬 파일 변경 시 emit |
| `skills/config/write` | 경로별 스킬 활성/비활성 |

### Plugins & Marketplaces

| 메소드 | 설명 |
| --- | --- |
| `marketplace/add` | 원격 플러그인 마켓플레이스 추가 + 사용자 마켓플레이스 config에 영속화 |
| `marketplace/upgrade` | 설정된 Git 마켓플레이스 새로고침 (이름 생략 시 모두) |
| `plugin/list` | 발견된 플러그인 마켓플레이스와 플러그인 상태 나열 (install/auth 정책 메타데이터, 마켓플레이스 로드 에러, featured 플러그인 ID, 로컬·Git·원격 소스 메타데이터 포함) |
| `plugin/read` | 마켓플레이스 경로 또는 원격 마켓플레이스 이름과 플러그인 이름으로 플러그인 1개 읽기 |
| `plugin/install`, `plugin/uninstall` | 플러그인 설치·제거 |

### Apps (Connectors)

| 메소드 | 설명 |
| --- | --- |
| `app/list` | 가용 앱 (connectors) 페이지네이션 + accessibility/enabled 메타데이터 |

### MCP

| 메소드 | 설명 |
| --- | --- |
| `mcpServer/oauth/login` | 설정된 MCP 서버 OAuth 로그인 시작. 인증 URL 반환 + 완료 시 `mcpServer/oauthLogin/completed` emit |
| `mcpServerStatus/list` | MCP 서버, 도구, 리소스, auth 상태 나열 (cursor + limit 페이지네이션). `detail: "full"` 또는 `detail: "toolsAndAuthOnly"` |
| `mcpServer/resource/read` | 초기화된 MCP 서버를 통해 단일 MCP 리소스 읽기 |
| `mcpServer/tool/call` | 스레드의 설정된 MCP 서버에서 도구 호출 |
| `mcpServer/startupStatus/updated` | (notify) 로드된 스레드의 설정된 MCP 서버 시작 상태 변경 시 |
| `config/mcpServer/reload` | 디스크에서 MCP 서버 설정 reload + 로드된 스레드 새로고침 큐 |

### Tools (사용자 입력)

| 메소드 | 설명 |
| --- | --- |
| `tool/requestUserInput` | 도구 호출용 1-3개 짧은 질문으로 사용자 prompt (실험). `isOther`로 free-form 옵션 |

### Windows Sandbox

| 메소드 | 설명 |
| --- | --- |
| `windowsSandbox/setupStart` | `elevated`/`unelevated` 모드의 Windows 샌드박스 셋업 시작. 빠르게 반환 + `windowsSandbox/setupCompleted` emit |

### Feedback

| 메소드 | 설명 |
| --- | --- |
| `feedback/upload` | 피드백 리포트 제출 (분류 + 선택 사유/로그 + 대화 ID + 선택 `extraLogFiles`) |

### Configuration

| 메소드 | 설명 |
| --- | --- |
| `config/read` | 설정 레이어링 resolve 후 디스크의 effective 설정 fetch |
| `config/value/write` | 사용자 `config.toml`에 단일 설정 키/값 쓰기 |
| `config/batchWrite` | 사용자 `config.toml`에 설정 편집 atomic 적용 |
| `configRequirements/read` | `requirements.toml`·MDM에서 requirements fetch (allow-list, pinned `featureRequirements`, residency/network 요구사항) |

### External Agent Migration

| 메소드 | 설명 |
| --- | --- |
| `externalAgentConfig/detect` | 마이그레이션 가능한 외부 에이전트 artifact 감지. `includeHome`과 선택 `cwds` 포함. 각 항목 `cwd` (홈은 `null`) |
| `externalAgentConfig/import` | 명시적 `migrationItems`와 `cwd`로 선택된 외부 에이전트 마이그레이션 항목 적용. 지원 타입: config, skills, AGENTS.md, plugins, MCP server config, subagents, hooks, commands, sessions. 플러그인 import는 `externalAgentConfig/import/completed` emit |

### Auth endpoints

→ 원문 https://developers.openai.com/codex/app-server#auth-endpoints 참고. ChatGPT OAuth 플로, API 키 인증 등 포함.

## 이벤트·에러·승인 (Notifications)

### Events

`item/started`, `item/completed`, `item/agentMessage/delta`, `turn/started`, `turn/completed`, `turn/failed`, `thread/started`, `thread/closed`, `thread/archived`, `thread/unarchived`, `thread/status/changed`, `thread/name/updated`, `thread/goal/updated`, `thread/goal/cleared`, `mcpServer/startupStatus/updated`, `skills/changed`, `command/exec/outputDelta`, `windowsSandbox/setupCompleted`, `mcpServer/oauthLogin/completed`, `externalAgentConfig/import/completed`, `fs/changed` 등.

### Errors

표준 JSON-RPC 에러. WebSocket overload는 `-32001` (`"Server overloaded; retry later."`). 기타 코드와 의미는 원문 참고.

### Approvals

샌드박스 escalation이나 도구 호출이 사용자 승인 필요할 때 발생. payload에 `threadId`, 액션 디테일 포함. 클라이언트가 승인·거부 응답.

## Plugin source 타입

플러그인 요약은 `source` union 포함:
- 로컬 플러그인: `{ "type": "local", "path": ... }`
- Git 백엔드 마켓플레이스 항목: `{ "type": "git", "url": ..., "path": ..., "refName": ..., "sha": ... }`
- 원격 카탈로그 항목: `{ "type": "remote" }`

원격 전용 카탈로그 항목의 `PluginMarketplaceEntry.path`는 `null` 가능 → 읽기·설치 시 `marketplacePath` 대신 `remoteMarketplaceName` 전달.

---

## 자세한 메소드 스키마

각 메소드의 완전한 요청·응답 페이로드, 옵션 필드, 예시, 에러 동작은 **원문 참고**:

https://developers.openai.com/codex/app-server

원문의 주요 섹션:
- Models 메소드 디테일 (line ~283)
- Threads 메소드 디테일 (line ~347)
- Turns 메소드 디테일 (line ~621)
- Review (line ~758)
- Command execution (line ~824)
- Filesystem (line ~897)
- Events (line ~919)
- Errors (line ~991)
- Approvals (line ~1007)
- Skills (line ~1059)
- Apps (connectors) (line ~1154)
- Auth endpoints (line ~1353)

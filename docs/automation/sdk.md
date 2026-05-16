---
원문: https://developers.openai.com/codex/sdk
동기화일: 2026-05-15
---

# Codex SDK

> 로컬 Codex 에이전트를 프로그램으로 제어

CLI, IDE 확장, Codex Web으로 Codex 사용 시 프로그램으로도 제어 가능.

SDK가 필요한 경우:
- CI/CD 파이프라인 일부로 Codex 제어
- Codex와 상호작용해 복잡 엔지니어링 작업 수행하는 자체 에이전트 생성
- Codex를 자체 내부 도구·워크플로에 빌드
- Codex를 자체 애플리케이션에 통합

## TypeScript 라이브러리

비인터랙티브 모드보다 더 포괄적이고 유연한 방식으로 애플리케이션 안에서 Codex 제어.

서버 사이드용. Node.js 18+ 필요.

### 설치

```bash
npm install @openai/codex-sdk
```

### 사용

스레드 시작 + prompt로 실행:

```typescript
import { Codex } from "@openai/codex-sdk";

const codex = new Codex();
const thread = codex.startThread();
const result = await thread.run(
  "Make a plan to diagnose and fix the CI failures"
);

console.log(result);
```

같은 스레드 계속 → `run()` 다시 호출. 과거 스레드 재개 → 스레드 ID 제공:

```typescript
// 같은 스레드
const result = await thread.run("Implement the plan");
console.log(result);

// 과거 스레드 재개
const threadId = "<thread_id>";
const thread2 = codex.resumeThread(threadId);
const result2 = await thread2.run("Pick up where you left off");
console.log(result2);
```

→ 자세한 사항: [TypeScript repo](https://github.com/openai/codex/tree/main/sdk/typescript)

## Python 라이브러리

Python SDK는 실험 — 로컬 Codex app-server를 JSON-RPC로 제어. Python 3.10+ 필요 + 오픈소스 Codex 리포 로컬 체크아웃.

### 설치

Codex 리포 root에서 editable 모드 설치:

```bash
cd sdk/python
python -m pip install -e .
```

수동 로컬 SDK 사용 시 `AppServerConfig(codex_bin=...)`로 로컬 `codex` 바이너리 가리키기, 또는 리포 예시·노트북 부트스트랩 사용.

### 사용

Codex 시작 → 스레드 생성 → prompt 실행:

```python
from codex_app_server import Codex

with Codex() as codex:
    thread = codex.thread_start(model="gpt-5.4")
    result = thread.run("Make a plan to diagnose and fix the CI failures")
    print(result.final_response)
```

비동기 애플리케이션이면 `AsyncCodex`:

```python
import asyncio

from codex_app_server import AsyncCodex

async def main() -> None:
    async with AsyncCodex() as codex:
        thread = await codex.thread_start(model="gpt-5.4")
        result = await thread.run("Implement the plan")
        print(result.final_response)

asyncio.run(main())
```

→ 자세한 사항: [Python repo](https://github.com/openai/codex/tree/main/sdk/python)

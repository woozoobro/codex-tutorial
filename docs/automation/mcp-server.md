---
원문: https://developers.openai.com/codex/guides/agents-sdk
동기화일: 2026-05-15
---

# MCP Server (Agents SDK와 함께 사용)

> Codex를 MCP 서버로 호출해 멀티 에이전트 개발 워크플로 빌드

## Codex를 MCP 서버로 실행

Codex를 MCP 서버로 실행 → 다른 MCP 클라이언트 (예: [OpenAI Agents SDK MCP 통합](https://developers.openai.com/api/docs/guides/agents/integrations-observability#mcp)으로 빌드된 에이전트)에서 연결.

```bash
codex mcp-server
```

[Model Context Protocol Inspector](https://modelcontextprotocol.io/legacy/tools/inspector)로 launch:
```bash
npx @modelcontextprotocol/inspector codex mcp-server
```

`tools/list` 요청 → 두 도구:

### `codex`

Codex 세션 실행. Codex `Config` 구조체와 매치되는 설정 파라미터 수용.

| Property | Type | 설명 |
| --- | --- | --- |
| **`prompt`** (필수) | string | Codex 대화 시작할 초기 사용자 prompt |
| `approval-policy` | string | 모델 생성 셸 명령의 승인 정책: `untrusted`, `on-request`, `never` |
| `base-instructions` | string | 기본 instructions 대신 사용할 instructions 셋 |
| `config` | object | `$CODEX_HOME/config.toml` 내용을 오버라이드하는 개별 설정 |
| `cwd` | string | 세션 작업 디렉터리. 상대 경로면 서버 프로세스 현재 디렉터리 기준 resolve. |
| `include-plan-tool` | boolean | 대화에 plan tool 포함 여부 |
| `model` | string | 모델 이름 오버라이드 (예: `o3`, `o4-mini`) |
| `profile` | string | `config.toml`에서 기본 옵션 지정할 설정 프로필 |
| `sandbox` | string | 샌드박스 모드: `read-only`, `workspace-write`, `danger-full-access` |

### `codex-reply`

스레드 ID와 prompt 제공해 Codex 세션 계속.

| Property | Type | 설명 |
| --- | --- | --- |
| **`prompt`** (필수) | string | Codex 대화 계속할 다음 사용자 prompt |
| **`threadId`** (필수) | string | 계속할 스레드 ID |
| `conversationId` (deprecated) | string | `threadId`의 deprecated 별칭 (호환성 유지) |

`tools/call` 응답의 `structuredContent.threadId`에서 `threadId` 사용. 승인 prompt (exec/patch)도 `params` payload에 `threadId` 포함.

응답 payload 예:
```json
{
  "structuredContent": {
    "threadId": "019bbb20-bff6-7130-83aa-bf45ab33250e",
    "content": "`ls -lah` (or `ls -alh`) — long listing, includes dotfiles, human-readable sizes."
  },
  "content": [
    {
      "type": "text",
      "text": "`ls -lah` (or `ls -alh`) — long listing, includes dotfiles, human-readable sizes."
    }
  ]
}
```

> 메모: 모던 MCP 클라이언트는 보통 `structuredContent`만 도구 호출 결과로 보고 (있으면), Codex MCP 서버는 구버전 호환성 위해 `content`도 반환.

## 멀티 에이전트 워크플로 만들기

Codex CLI는 ad-hoc 작업 실행 이상 가능. CLI를 [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) 서버로 노출 + OpenAI Agents SDK로 오케스트레이션 → 단일 에이전트에서 완전한 SW 배포 파이프라인까지 스케일하는 결정적·검토 가능한 워크플로 생성.

이 가이드는 [OpenAI Cookbook](https://github.com/openai/openai-cookbook/blob/main/examples/codex/codex_mcp_agents_sdk/building_consistent_workflows_codex_cli_agents_sdk.ipynb)의 워크플로를 따른다:
- 장시간 실행 MCP 서버로 Codex CLI launch
- playable 브라우저 게임 만드는 집중 단일 에이전트 워크플로 빌드
- 핸드오프, 가드레일, 나중에 검토 가능한 전체 trace로 멀티 에이전트 팀 오케스트레이션

준비:
- 로컬 [Codex CLI](../cli/overview.md) 설치 (`npx codex` 실행 가능)
- Python 3.10+ + `pip`
- Node.js 18+ (`npx`용)
- 로컬에 OpenAI API 키 저장. → [OpenAI dashboard](https://platform.openai.com/account/api-keys)

작업 디렉터리 생성 + API 키를 `.env`에 추가:
```bash
mkdir codex-workflows
cd codex-workflows
printf "OPENAI_API_KEY=sk-..." > .env
```

## 의존성 설치

Agents SDK가 Codex 간 오케스트레이션, 핸드오프, trace 처리. 최신 SDK 패키지 설치:

```bash
python -m venv .venv
source .venv/bin/activate
pip install --upgrade openai openai-agents python-dotenv
```

가상 환경 활성화 → SDK 의존성을 시스템 나머지와 격리.

## Codex CLI를 MCP 서버로 초기화

Agents SDK가 호출 가능한 MCP 서버로 Codex CLI 변환부터. 서버는 두 도구 노출 (`codex()` 대화 시작, `codex-reply()` 계속) + 여러 에이전트 턴 동안 Codex 유지.

`codex_mcp.py` 생성:
```python
import asyncio

from agents import Agent, Runner
from agents.mcp import MCPServerStdio

async def main() -> None:
    async with MCPServerStdio(
        name="Codex CLI",
        params={
            "command": "npx",
            "args": ["-y", "codex", "mcp-server"],
        },
        client_session_timeout_seconds=360000,
    ) as codex_mcp_server:
        print("Codex MCP server started.")
        # 다음 섹션에 더 많은 로직.
        return

if __name__ == "__main__":
    asyncio.run(main())
```

스크립트 한 번 실행 → Codex 성공적 launch 검증:
```bash
python codex_mcp.py
```

스크립트는 `Codex MCP server started.` 출력 후 종료. 다음 섹션에서 같은 MCP 서버를 더 풍부한 워크플로 안에서 재사용.

## 단일 에이전트 워크플로 빌드

Codex MCP로 작은 브라우저 게임 출시하는 스코프 예시. 두 에이전트:

1. **Game Designer**: 게임 brief 작성
2. **Game Developer**: Codex MCP 호출해 게임 구현

`codex_mcp.py` 갱신 — 위 MCP 서버 셋업 유지 + 두 에이전트 추가:

```python
import asyncio
import os

from dotenv import load_dotenv

from agents import Agent, Runner, set_default_openai_api
from agents.mcp import MCPServerStdio

load_dotenv(override=True)
set_default_openai_api(os.getenv("OPENAI_API_KEY"))

async def main() -> None:
    async with MCPServerStdio(
        name="Codex CLI",
        params={
            "command": "npx",
            "args": ["-y", "codex", "mcp-server"],
        },
        client_session_timeout_seconds=360000,
    ) as codex_mcp_server:
        developer_agent = Agent(
            name="Game Developer",
            instructions=(
                "You are an expert in building simple games using basic html + css + javascript with no dependencies. "
                "Save your work in a file called index.html in the current directory. "
                "Always call codex with \"approval-policy\": \"never\" and \"sandbox\": \"workspace-write\"."
            ),
            mcp_servers=[codex_mcp_server],
        )

        designer_agent = Agent(
            name="Game Designer",
            instructions=(
                "You are an indie game connoisseur. Come up with an idea for a single page html + css + javascript game that a developer could build in about 50 lines of code. "
                "Format your request as a 3 sentence design brief for a game developer and call the Game Developer coder with your idea."
            ),
            model="gpt-5",
            handoffs=[developer_agent],
        )

        await Runner.run(designer_agent, "Implement a fun new game!")

if __name__ == "__main__":
    asyncio.run(main())
```

실행:
```bash
python codex_mcp.py
```

Codex가 designer brief 읽기 → `index.html` 생성 → 디스크에 전체 게임 작성. 브라우저에서 생성 파일 열어 결과 플레이. 매 실행 unique play-style twist와 polish의 다른 디자인.

## 멀티 에이전트 워크플로로 확장

오케스트레이트되고 traceable 워크플로로 변환. 시스템 추가:
- **Project Manager**: 공유 요구사항 생성, 핸드오프 조정, 가드레일 강제
- **Designer**, **Frontend Developer**, **Server Developer**, **Tester**: 각각 스코프 지시와 출력 폴더

> 전체 코드 예시는 원문 참고: https://developers.openai.com/codex/guides/agents-sdk
> 패턴: PM이 `REQUIREMENTS.md`, `TEST.md`, `AGENT_TASKS.md` 작성 → Designer → Frontend + Backend 병렬 → Tester 순으로 핸드오프, 각 에이전트는 자기 폴더에 스코프 artifact 작성 후 PM에게 제어 반환.

핵심 코드 스니펫 (PM 역할):
```python
project_manager_agent = Agent(
    name="Project Manager",
    instructions=(
        f"""{RECOMMENDED_PROMPT_PREFIX}"""
        """
        You are the Project Manager.

        Objective:
        Convert the input task list into three project-root files the team will execute against.

        Deliverables (write in project root):
        - REQUIREMENTS.md
        - TEST.md
        - AGENT_TASKS.md

        Process:
        - Resolve ambiguities with minimal, reasonable assumptions.
        - Create files using Codex MCP with {"approval-policy":"never","sandbox":"workspace-write"}.

        Handoffs (gated by required files):
        1) After three files created, hand off to Designer.
        2) Wait for /design/design_spec.md.
        3) Hand off in parallel to Frontend Developer + Backend Developer.
        4) Wait for /frontend/index.html and /backend/server.js.
        5) Hand off to Tester.
        """
    ),
    model="gpt-5",
    model_settings=ModelSettings(reasoning=Reasoning(effort="medium")),
    handoffs=[designer_agent, frontend_developer_agent, backend_developer_agent, tester_agent],
    mcp_servers=[codex_mcp_server],
)
```

## 워크플로 trace

Codex는 모든 prompt, 도구 호출, 핸드오프 캡처하는 trace 자동 기록. 멀티 에이전트 실행 완료 후 [Traces 대시보드](https://platform.openai.com/trace)에서 실행 타임라인 검사.

상위 trace는 PM이 진행 전 핸드오프 검증하는 방식 강조. 개별 단계 클릭 → prompt, Codex MCP 호출, 작성 파일, 실행 duration 확인. 모든 핸드오프 감사 + 워크플로가 턴 단위로 어떻게 진화했는지 이해 직관적. 추가 instrumentation 없이 워크플로 hiccup 디버그, 에이전트 동작 감사, 시간에 따른 성능 측정.

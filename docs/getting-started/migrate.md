---
원문: https://developers.openai.com/codex/migrate
동기화일: 2026-05-15
---

# 마이그레이션 (Migrate)

다른 에이전트에서 사용하던 셋업을 Codex로 가져온다.

Import 플로우를 통해 instruction, 설정, 스킬, MCP 서버, 훅, 서브에이전트, 최근 세션을 다른 에이전트에서 Codex로 옮길 수 있다. Codex가 직접 처리할 수 있는 부분은 마이그레이션하고, 남은 부분은 후속 스레드에서 도와준다.

## 마이그레이션 시작

1. Codex 앱에서 **Settings** 열기
2. **General** 페이지에서 **Import other agent setup** 찾기
3. **Import** 또는 **Import again** 선택
4. Codex가 찾은 항목 검토 → 가져올 항목 선택 → **Import**
5. Import 완료 후, 결과 확인하고 싶으면 **View imported files** 선택

## 동작 방식

Codex는 사용자 레벨 셋업과 현재 프로젝트를 모두 확인한다.
- 사용자 레벨: 머신의 파일에서 가져옴
- 프로젝트 레벨: 현재 열린 리포의 파일에서 가져옴

Import 단계:
1. 가져올 수 있는 셋업 탐지
2. 직접 마이그레이션 가능한 항목 import
3. Import 완료 후 다시 확인
4. 후속 작업이 필요하면 새 스레드에서 마이그레이션 계속 진행 제안

## 가져올 수 있는 항목

| 탐지된 셋업 | Codex 목적지 |
|-------------|--------------|
| Instruction 파일 | `AGENTS.md` |
| `settings.json` | `config.toml` |
| Skills | Codex skills |
| 최근 30일 내 세션 | Codex threads & projects |
| MCP 서버 설정 | Codex MCP 설정 |
| Hooks | Codex hooks |
| Slash commands | Codex skills |
| Subagents | Codex agents |

## 새 스레드에서 남은 셋업 마무리

일부 셋업은 Codex로 일대일 매핑이 깔끔하지 않다. 이런 경우 Codex가 `migrate-to-codex` 스킬로 새 스레드를 열어 마이그레이션을 마저 진행할 수 있다.

해당 상황이 되면 Codex가 남은 셋업을 보여주며 **Continue in Codex** 옵션을 제공한다.

계속하면 새 스레드에 남은 작업이 채워진 채로 열리고, 사용자 레벨과 프로젝트 레벨이 분리되어 표시되어 각 항목의 위치를 명확히 알 수 있다.

## Import 후 검토 사항

마이그레이션된 셋업은 신뢰하기 전에 반드시 검토한다. 특히:

- Import한 스킬·에이전트의 도구 제한 또는 권한
- 커스텀 인증, 헤더, 환경 변수, 트랜스포트를 사용하는 MCP 서버 설정
- Codex에서 동작이 다를 수 있는 hooks
- 수동 후속 작업이 필요한 플러그인, 마켓플레이스, 기타 셋업
- 인자, 셸 보간(interpolation), 파일 경로 placeholder에 의존하는 프롬프트 템플릿 또는 명령어 스타일 프롬프트

## 전환 후

Import가 끝나면 마이그레이션된 프로젝트 중 하나를 열고 작업을 이어간다. Codex가 처음이라면 [퀵스타트](quickstart.md)에서 나머지 셋업 플로우를 확인한다.

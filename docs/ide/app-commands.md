---
원문: https://developers.openai.com/codex/app/commands
동기화일: 2026-05-15
---

# Codex 앱 명령어

> Codex 앱 명령어와 키보드 단축키 레퍼런스

## 키보드 단축키

| 카테고리 | 액션 | macOS 단축키 |
| --- | --- | --- |
| **General** | Command 메뉴 | Cmd + Shift + P 또는 Cmd + K |
|  | 설정 | Cmd + , |
|  | 폴더 열기 | Cmd + O |
|  | 뒤로 탐색 | Cmd + [ |
|  | 앞으로 탐색 | Cmd + ] |
|  | 폰트 크기 ↑ | Cmd + + 또는 Cmd + = |
|  | 폰트 크기 ↓ | Cmd + - 또는 Cmd + _ |
|  | 사이드바 토글 | Cmd + B |
|  | diff 패널 토글 | Cmd + Option + B |
|  | 터미널 토글 | Cmd + J |
|  | 터미널 clear | Ctrl + L |
| **Thread** | 새 스레드 | Cmd + N 또는 Cmd + Shift + O |
|  | 스레드에서 찾기 | Cmd + F |
|  | 이전 스레드 | Cmd + Shift + [ |
|  | 다음 스레드 | Cmd + Shift + ] |
|  | Dictation | Ctrl + M |

## 슬래시 명령어

스레드 composer 떠나지 않고 Codex 제어. 환경·액세스에 따라 가용 명령 달라짐.

### 슬래시 명령어 사용

1. 스레드 composer에 `/` 입력
2. 리스트에서 선택 또는 계속 입력해 필터 (예: `/status`)

스킬 명시 호출은 composer에 `$`. → [Skills](../configuration/skills.md)

활성 스킬도 슬래시 명령 리스트에 표시.

### 가용 슬래시 명령어

| 명령 | 설명 |
| --- | --- |
| `/feedback` | 피드백 다이얼로그 열기 — 피드백 제출, 선택적 로그 포함 |
| `/mcp` | MCP 상태 — 연결 서버 보기 |
| `/plan-mode` | plan mode 토글 — 멀티스텝 계획 |
| `/review` | 코드 리뷰 모드 — uncommitted 변경 검토 또는 base 브랜치 대비 비교 |
| `/status` | 스레드 ID, 컨텍스트 사용량, rate limit 표시 |

## Deeplinks

Codex 앱은 `codex://` URL 스킴 등록 → 링크가 앱 특정 부분 직접 열기.

| Deeplink | 열림 | 지원 쿼리 파라미터 |
| --- | --- | --- |
| `codex://settings` | Settings | 없음 |
| `codex://skills` | Skills | 없음 |
| `codex://automations` | 자동화 생성 모드 inbox | 없음 |
| `codex://threads/<uuid>` | 로컬 스레드. `<uuid>`는 UUID. | 없음 |
| `codex://new` | 새 스레드 | 선택: `prompt`, `originUrl`, `path` |

새 스레드 deeplink:
- `prompt`: 초기 composer 텍스트
- `path`: 로컬 디렉터리 절대 경로. 유효 시 그 디렉터리를 새 스레드 활성 워크스페이스로.
- `originUrl`: Git remote URL로 현재 워크스페이스 루트 1개 매치 시도. `path`와 `originUrl` 둘 다 있으면 Codex가 `path` 먼저 resolve.

## 참고

- [Features](app-features.md)
- [Settings](app-settings.md)

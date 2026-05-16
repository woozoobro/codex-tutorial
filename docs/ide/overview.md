---
원문: https://developers.openai.com/codex/ide
동기화일: 2026-05-15
---

# Codex IDE 확장 개요

> IDE에서 Codex와 함께 작업

Codex는 OpenAI의 코딩 에이전트 — 코드 읽기·편집·실행. 더 빠른 빌드, 버그 squash, 낯선 코드 이해. Codex VS Code 확장으로 IDE 안에서 Codex를 옆에 두거나 Codex Cloud에 작업 위임.

ChatGPT Plus, Pro, Business, Edu, Enterprise 플랜에 Codex 포함. → [가격](../getting-started/pricing.md)

## 확장 셋업

Codex IDE 확장은 VS Code fork (Cursor, Windsurf 등)에서 동작.

[Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=openai.chatgpt) 또는 IDE별 다운로드:

- [VS Code](vscode:extension/openai.chatgpt)
- [Cursor](cursor:extension/openai.chatgpt)
- [Windsurf](windsurf:extension/openai.chatgpt)
- [VS Code Insiders](https://marketplace.visualstudio.com/items?itemName=openai.chatgpt)
- [JetBrains IDE](#jetbrains-ide-통합)

VS Code 호환 에디터와 JetBrains IDE 통합은 macOS, Windows, Linux 가용. Windows에선 Windows 샌드박스로 네이티브 실행 또는 Linux 환경 필요 시 WSL2. → [Windows 셋업](../administration/windows.md)

설치 후 에디터 사이드바에 Codex 표시. VS Code는 기본적으로 우측 사이드바. 안 보이면 에디터 재시작.

Cursor에서 activity bar는 기본 horizontal — collapsed 항목에 Codex 숨겨질 수 있음. 핀하고 확장 순서 재배열.

## JetBrains IDE 통합

Rider, IntelliJ, PyCharm, WebStorm 같은 JetBrains IDE에서 Codex 사용 → JetBrains IDE 통합 설치. ChatGPT, API 키, JetBrains AI 구독으로 로그인 지원.

### Codex를 우측 사이드바로 이동

VS Code는 자동으로 우측 사이드바에 표시. primary (좌측) 사이드바를 선호하면 Codex 아이콘을 좌측 activity bar로 드래그.

Cursor 같은 fork에서는 수동 이동 필요할 수 있음 — activity bar orientation 일시 변경:

1. 에디터 설정 → `activity bar` 검색 (Workbench 설정)
2. orientation을 `vertical`로
3. 에디터 재시작

이제 Codex 아이콘을 우측 사이드바로 드래그 (예: Cursor chat 옆). 사이드바의 다른 탭으로 표시.

이동 후 activity bar orientation을 `horizontal`로 리셋해 기본 동작 복원. 나중에 마음 바뀌면 언제든 Codex를 좌측 primary 사이드바로 다시 드래그.

### 로그인

확장 설치 후 ChatGPT 계정 또는 API 키 로그인 prompt. ChatGPT 플랜에 사용 크레딧 포함 → 추가 셋업 없이 사용. → [가격](../getting-started/pricing.md)

### 확장 갱신

자동 갱신, IDE 안에서 확장 페이지 열어 갱신 확인 가능.

### 키보드 단축키 셋업

Codex는 IDE 설정에서 키보드 단축키로 바인드 가능한 명령 포함 (Codex 채팅 토글, Codex 컨텍스트에 항목 추가 등).

모든 명령 보기 + 단축키 바인드: Codex 채팅의 settings 아이콘 → **Keyboard shortcuts**. 또는 [Codex IDE 확장 명령어](commands.md) 페이지. 슬래시 명령어 리스트: [IDE 슬래시 명령어](slash-commands.md). 처음이면 [모범 사례 가이드](../resources/best-practices.md) 권장.

## Codex IDE 확장 사용

### 에디터 컨텍스트로 prompt

열린 파일, 선택, `@file` 참조로 더 짧은 prompt에서 더 관련된 결과 얻기.

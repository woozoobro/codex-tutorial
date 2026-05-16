---
원문: https://developers.openai.com/codex/ide/commands
동기화일: 2026-05-15
---

# Codex IDE 확장 명령어

> Codex IDE 확장 명령어와 키보드 단축키 레퍼런스

VS Code Command Palette에서 Codex 제어. 키보드 단축키로 바인드 가능.

## 키 바인딩 할당

1. Command Palette 열기 (macOS: **Cmd+Shift+P**, Windows/Linux: **Ctrl+Shift+P**)
2. **Preferences: Open Keyboard Shortcuts** 실행
3. `Codex` 또는 명령 ID 검색 (예: `chatgpt.newChat`)
4. 연필 아이콘 → 원하는 단축키 입력

## 확장 명령어

| 명령 | 기본 키 바인딩 | 설명 |
| --- | --- | --- |
| `chatgpt.addToThread` | - | 선택 텍스트 범위를 현재 스레드 컨텍스트로 추가 |
| `chatgpt.addFileToThread` | - | 전체 파일을 현재 스레드 컨텍스트로 추가 |
| `chatgpt.newChat` | macOS: `Cmd+N`, Windows/Linux: `Ctrl+N` | 새 스레드 생성 |
| `chatgpt.implementTodo` | - | 선택 TODO 코멘트를 Codex가 처리하도록 요청 |
| `chatgpt.newCodexPanel` | - | 새 Codex 패널 생성 |
| `chatgpt.openSidebar` | - | Codex 사이드바 패널 열기 |

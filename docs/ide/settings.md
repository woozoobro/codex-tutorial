---
원문: https://developers.openai.com/codex/ide/settings
동기화일: 2026-05-15
---

# Codex IDE 확장 설정

> Codex IDE 확장 설정 레퍼런스

이 설정으로 Codex IDE 확장 커스터마이즈.

## 설정 변경

1. 에디터 설정 열기
2. `Codex` 또는 설정 이름 검색
3. 값 갱신

> Codex IDE 확장은 Codex CLI 사용. 기본 모델, 승인, 샌드박스 같은 일부 동작은 에디터 설정 대신 공유 `~/.codex/config.toml`에서 설정. → [Config basics](../configuration/config-basic.md)

확장은 VS Code 빌트인 채팅 폰트 설정도 Codex 대화 surface에 적용.

## 설정 레퍼런스

| 설정 | 설명 |
| --- | --- |
| `chat.fontSize` | Codex 사이드바 채팅 텍스트 (대화 콘텐츠와 composer) |
| `chat.editor.fontSize` | Codex 대화의 코드 렌더 콘텐츠 (코드 스니펫과 diff) |
| `chatgpt.cliExecutable` | 개발 전용 — Codex CLI 실행파일 경로. CLI 적극 개발 중이 아니면 설정 불필요. 수동 설정 시 확장 일부가 기대대로 동작 안 할 수 있음. |
| `chatgpt.commentCodeLensEnabled` | TODO 코멘트 위 CodeLens 표시 → Codex로 완료 |
| `chatgpt.localeOverride` | Codex UI 선호 언어. 비어두면 자동 감지. |
| `chatgpt.openOnStartup` | 확장 시작 완료 시 Codex 사이드바 focus |
| `chatgpt.runCodexInWindowsSubsystemForLinux` | Windows 전용 — WSL 가용 시 Codex를 WSL에서 실행. 리포·도구가 WSL2에 있거나 Linux 네이티브 도구 필요할 때 사용. 그 외엔 Windows 샌드박스로 네이티브 실행. 변경 시 VS Code 재로드. |

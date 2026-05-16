---
원문: https://developers.openai.com/codex/ide/slash-commands
동기화일: 2026-05-15
---

# Codex IDE 확장 슬래시 명령어

> IDE 확장 슬래시 명령어 레퍼런스

채팅 입력에서 Codex 제어. 상태 확인, 로컬·클라우드 모드 전환, 피드백 전송에 사용.

## 슬래시 명령어 사용

1. Codex 채팅 입력에서 `/` 입력
2. 리스트에서 명령 선택, 또는 계속 입력해 필터 (예: `/status`)
3. **Enter**

## 가용 슬래시 명령어

| 명령 | 설명 |
| --- | --- |
| `/auto-context` | Auto Context on/off — 최근 파일과 IDE 컨텍스트 자동 포함 |
| `/cloud` | 클라우드 모드 전환 — 작업 원격 실행 (클라우드 액세스 필요) |
| `/cloud-environment` | 사용할 클라우드 환경 선택 (클라우드 모드에서만) |
| `/feedback` | 피드백 다이얼로그 열기 — 피드백 제출, 선택적으로 로그 포함 |
| `/local` | 로컬 모드 전환 — 워크스페이스에서 작업 실행 |
| `/review` | 코드 리뷰 모드 — uncommitted 변경 검토 또는 base 브랜치 대비 비교 |
| `/status` | 스레드 ID, 컨텍스트 사용량, rate limit 표시 |

---
원문: https://developers.openai.com/codex/prompting
동기화일: 2026-05-15
---

# 프롬프팅 (Prompting)

> Codex 에이전트와 상호작용하는 법

## 프롬프트

Codex와는 prompt(사용자 메시지)를 보내 무엇을 해야 하는지 기술하며 상호작용한다.

예시:

```
Explain how the transform module works and how other modules use it.
```

```
Add a new command-line option `--json` that outputs JSON.
```

prompt 제출 시 Codex는 루프로 작동: 모델 호출 → 모델 출력이 가리키는 액션 수행 (파일 읽기·편집, 도구 호출). 작업 완료 또는 사용자가 취소할 때까지.

ChatGPT와 마찬가지로 Codex의 효과는 지시의 질에 비례. 도움 되는 팁:

- Codex는 작업을 검증할 수 있을 때 더 높은 품질 출력 — 이슈 재현 단계, 기능 검증, 린트·pre-commit 체크 포함
- 복잡한 작업은 작고 집중된 단계로 나눠야 더 잘 처리. 작은 작업은 Codex가 테스트하기도, 사용자가 검토하기도 쉽다. 분할 방법이 모호하면 Codex에 계획 제안 요청.

→ 더 많은 prompt 아이디어: [workflows](workflows.md)

## 스레드 (Threads)

스레드는 단일 세션 — prompt + 그 뒤를 잇는 모델 출력과 도구 호출. 한 스레드에 prompt 여러 개 가능 (예: 첫 prompt에서 기능 구현, 후속 prompt에서 테스트 추가).

스레드는 Codex가 적극 작업 중일 때 "running"이라고 한다. 동시에 여러 스레드 실행 가능, 다만 두 스레드가 같은 파일 수정하지 않게 주의. 다른 prompt로 나중에 이어갈 수도 있음.

스레드는 로컬 또는 클라우드에서 실행:

- **로컬 스레드**: 머신에서 실행. Codex가 파일 읽기·편집·명령 실행 → 변경 확인과 기존 도구 사용 가능. 워크스페이스 외부 의도치 않은 변경 위험을 줄이려 [샌드박스](../administration/agent-approvals-security.md) 안에서 실행.
- **클라우드 스레드**: 격리된 [환경](../web/environments.md)에서 실행. Codex가 리포 클론 + 작업 브랜치 체크아웃. 병렬 실행이나 다른 디바이스에서 작업 위임에 유용. 리포에서 클라우드 스레드 사용은 GitHub에 코드 push 먼저. 로컬 머신에서 [작업 위임](../web/overview.md)도 가능 (현재 작업 상태 포함).

Codex 앱에서는 프로젝트를 선택하지 않고 chat을 시작할 수도 있다. Chat은 저장된 리포·프로젝트 폴더에 묶이지 않음. 리서치, 계획, connected-tool 워크플로, Codex가 코드베이스에서 시작하지 않아야 할 작업에 사용. Chat은 Codex 홈 아래 Codex 관리 `threads` 디렉터리를 작업 위치로 사용. 기본 `~/.codex/threads`. 베이스 위치 변경은 `CODEX_HOME` → [Config and state locations](../configuration/config-advanced.md)

## 컨텍스트

prompt 제출 시 Codex가 사용할 컨텍스트 포함 — 관련 파일 참조, 이미지 등. Codex IDE 확장은 열린 파일 목록과 선택된 텍스트 범위를 자동 컨텍스트로 포함.

에이전트가 작업하면서 파일 내용, 도구 출력, 자체 진행 기록에서 컨텍스트도 수집.

스레드의 모든 정보는 모델의 **컨텍스트 윈도우** (모델별로 다름) 안에 들어가야 함. Codex는 남은 공간 모니터링·보고. 긴 작업의 경우 Codex가 자동으로 컨텍스트를 **compact** — 관련 정보 요약 + 덜 관련된 디테일 폐기. 반복 압축으로 Codex는 많은 단계의 복잡 작업 진행 가능.

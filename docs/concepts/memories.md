---
원문: https://developers.openai.com/codex/memories
동기화일: 2026-05-15
---

# 메모리 (Memories)

> Codex가 스레드 간 유용한 컨텍스트 이월하는 방법

> 메모리는 기본 OFF + 출시 시점 EU/UK/스위스 미지원. Codex 설정에서 활성화 또는 `~/.codex/config.toml`의 `[features]` 테이블에 `memories = true`.

메모리는 Codex가 이전 스레드의 유용한 컨텍스트를 미래 작업으로 이월. 활성화 후 Codex는 안정적 선호, 반복 워크플로, 기술 스택, 프로젝트 컨벤션, 알려진 함정을 기억 → 매 스레드에서 같은 컨텍스트 반복할 필요 ↓.

> 팀이 요구하는 가이드는 `AGENTS.md`나 체크인된 문서에. 메모리는 **항상 적용되어야 하는 룰의 유일한 출처가 아닌 도움 되는 로컬 recall 레이어**로 다룬다.

[Chronicle](chronicle.md)은 화면에서 최근 작업 컨텍스트를 회복해 메모리 빌드.

## 메모리 활성화

Codex 앱: 설정에서 Memories 활성화.

Config 기반 셋업 — `config.toml`에 feature flag:
```toml
[features]
memories = true
```

→ 사용자 레벨 설정 저장과 `~/.codex/config.toml` 로드 방식: [Config basics](../configuration/config-basic.md)

## 메모리 동작 방식

활성화 후 Codex는 자격 있는 이전 스레드의 유용한 컨텍스트를 로컬 메모리 파일로 변환 가능. 활성·짧은 세션은 건너뜀, 생성된 메모리 필드에서 시크릿 redact, 매 스레드 종료 즉시가 아닌 백그라운드에서 갱신.

메모리는 스레드 종료 즉시 갱신 안 될 수 있음 — Codex는 진행 중 작업을 요약하지 않으려 충분히 idle한 후 대기.

Codex rate-limit 남은 % 가 설정 임계값 미만이면 백그라운드 패스 건너뛰기 가능 → 한도 근처에서 quota 소비 안 함.

## 메모리 저장

Codex는 Codex 홈 디렉터리 (기본 `~/.codex`)에 메모리 저장. → `CODEX_HOME` 사용법: [Config and state locations](../configuration/config-advanced.md)

주요 메모리 파일은 `~/.codex/memories/` 아래 — 요약, 영구 항목, 최근 입력, 이전 스레드의 supporting evidence.

이들은 생성된 상태로 다루기. 트러블슈팅이나 Codex 홈 공유 전 검사 가능, 주 제어 표면으로 수동 편집에 의존하지 말 것.

## 스레드별 메모리 제어

Codex 앱과 Codex TUI에서 `/memories`로 현재 스레드 메모리 동작 제어. 스레드 레벨 선택은 현재 스레드가 기존 메모리 사용 가능 여부, Codex가 그 스레드를 미래 메모리 생성에 사용 가능 여부 결정.

스레드 레벨 선택은 글로벌 메모리 설정 변경하지 않음.

## 설정

Codex 앱 설정에서 활성화 또는 `config.toml` `[features]`에 `memories = true`.

설정 파일 위치와 메모리 관련 설정 전체 리스트: [configuration reference](../configuration/config-reference.md)

흔한 메모리 특화 설정:
- `memories.generate_memories`: 새 스레드를 메모리 생성 입력으로 저장 가능 여부
- `memories.use_memories`: Codex가 기존 메모리를 미래 세션에 주입 여부
- `memories.disable_on_external_context`: `true`면 MCP/web search/tool search 같은 외부 컨텍스트 사용 스레드를 메모리 생성에서 제외. 레거시 별칭 `memories.no_memories_if_mcp_or_web_search`도 수용.
- `memories.min_rate_limit_remaining_percent`: 메모리 생성 시작 전 필요한 Codex rate-limit 남은 % 최소
- `memories.extract_model`: 스레드별 메모리 추출용 모델 오버라이드
- `memories.consolidation_model`: 글로벌 메모리 통합용 모델 오버라이드

## 메모리 검토

> 메모리에 시크릿 저장 금지. Codex가 생성된 메모리 필드에서 시크릿 redact하지만, Codex 홈 디렉터리나 생성된 메모리 artifact 공유 전 메모리 파일 검토 필수.

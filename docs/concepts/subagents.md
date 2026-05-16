---
원문: https://developers.openai.com/codex/concepts/subagents
동기화일: 2026-05-15
---

# 서브에이전트 (개념)

> 서브에이전트 워크플로가 Codex를 집중하게 하는 방식 + 다른 에이전트의 모델 선택

Codex는 특화 에이전트를 병렬 spawn하여 동시에 탐색·tackle·분석할 수 있는 서브에이전트 워크플로 실행 가능.

이 페이지는 핵심 개념과 트레이드오프 설명. 셋업·에이전트 설정·예시: [Subagents 설정](../configuration/subagents.md)

## 서브에이전트 워크플로가 도움 되는 이유

큰 컨텍스트 윈도우라도 모델은 한도 있음. 메인 대화 (요구사항·제약·결정 정의 중)에 noisy 중간 출력 (탐색 노트, 테스트 로그, 스택 트레이스, 명령 출력)을 쏟아부으면 시간이 지나면서 세션 신뢰성 ↓.

자주 묘사:
- **Context pollution (컨텍스트 오염)**: 유용한 정보가 noisy 중간 출력 아래 묻힘
- **Context rot (컨텍스트 부패)**: 덜 관련된 디테일로 대화가 차면서 성능 저하

→ 배경: Chroma의 [context rot](https://research.trychroma.com/context-rot) 글

서브에이전트 워크플로의 도움:
- **메인 에이전트**를 요구사항·결정·최종 출력에 집중
- 탐색·테스트·로그 분석을 위해 특화 **서브에이전트**를 병렬 실행
- 서브에이전트는 raw 중간 출력 대신 **요약** 반환

작업이 독립적으로 병렬 실행 가능하면 시간도 절약, 큰 형태의 작업을 경계 있는 조각으로 나눠 더 다루기 쉽게 함. 예: Codex가 수백만 토큰 문서 분석을 작은 문제로 분할하고 메인 스레드에 distilled takeaway 반환.

시작점으로 탐색·테스트·분류·요약 같은 read-heavy 작업에 병렬 에이전트 사용. 병렬 write-heavy 워크플로는 더 신중 — 동시에 코드 편집하는 에이전트는 충돌 + 조정 오버헤드 ↑.

## 핵심 용어

- **Subagent workflow**: Codex가 병렬 에이전트 실행 + 결과 결합하는 워크플로
- **Subagent**: 특정 작업 처리를 위해 Codex가 시작한 위임 에이전트
- **Agent thread**: 에이전트의 CLI 스레드. `/agent`로 검사·전환

## 서브에이전트 워크플로 트리거

Codex는 자동으로 서브에이전트 spawn 안 함. **명시적으로 요청해야만** 서브에이전트나 병렬 에이전트 작업 사용.

실무에서 수동 트리거링은 직접 지시 — "spawn two agents", "delegate this work in parallel", "use one agent per point". 서브에이전트 워크플로는 단일 에이전트 대비 토큰 소비 ↑ — 각 서브에이전트가 자체 모델·도구 작업.

좋은 서브에이전트 prompt는 다음을 설명:
- 작업 분할 방법
- Codex가 계속 전 모든 에이전트 대기할지
- 어떤 요약·출력 반환할지

```
Review this branch with parallel subagents. Spawn one subagent for security risks, one for test gaps, and one for maintainability. Wait for all three, then summarize the findings by category with file references.
```

## 모델·reasoning 선택

다른 에이전트는 다른 모델·reasoning 설정 필요.

`model`이나 `model_reasoning_effort`를 pin 안 하면 Codex가 작업의 지능·속도·가격 균형 셋업 선택 가능. 빠른 스캔에 `gpt-5.4-mini`, 더 까다로운 reasoning에 high-effort `gpt-5.5` 선호 가능. 더 세밀한 통제 원하면 prompt에서 그 선택 조정 또는 에이전트 파일에 `model`과 `model_reasoning_effort` 직접 설정.

대부분 Codex 작업은 `gpt-5.5`로 시작. 가벼운 서브에이전트 작업에 더 빠르고 저비용 옵션은 `gpt-5.4-mini`. ChatGPT Pro + 거의 즉각적인 텍스트 전용 반복 원하면 research preview의 `gpt-5.3-codex-spark`.

### 모델 선택

- **`gpt-5.5`**: 까다로운 에이전트의 출발점. 큰 컨텍스트에서 계획·도구 사용·검증·후속이 필요한 모호한 멀티스텝 작업에 가장 강함.
- **`gpt-5.4`**: 워크플로가 GPT-5.4에 pin됐을 때. 강한 코딩, reasoning, 도구 사용, 더 넓은 워크플로 결합.
- **`gpt-5.4-mini`**: 깊이보다 속도·효율 선호 에이전트. 탐색, read-heavy 스캔, 대형 파일 리뷰, 보조 문서 처리. 메인 에이전트에 distilled 결과 반환하는 병렬 worker에 적합.
- **`gpt-5.3-codex-spark`**: ChatGPT Pro면 research preview 모델로 latency가 광범위 능력보다 중요할 때 거의 즉각 텍스트 전용 반복.

### Reasoning effort (`model_reasoning_effort`)

- **`high`**: 복잡 로직 추적, 가정 체크, 엣지 케이스 처리 필요 (예: reviewer, 보안 집중 에이전트)
- **`medium`**: 대부분 에이전트의 균형 기본값
- **`low`**: 작업이 직관적이고 속도가 가장 중요할 때

> 더 높은 reasoning effort는 응답 시간·토큰 사용 ↑, 복잡 작업의 품질 ↑. → [Models](models.md), [Config basics](../configuration/config-basic.md), [Configuration Reference](../configuration/config-reference.md)

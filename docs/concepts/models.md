---
원문: https://developers.openai.com/codex/models
동기화일: 2026-05-15
---

# Codex 모델

> Codex를 구동하는 AI 모델

## 권장 모델

### `gpt-5.5`

OpenAI의 최신 프론티어 모델 — Codex의 복잡 코딩, computer use, 지식 작업, 리서치 워크플로용.

```bash
codex -m gpt-5.5
```

지원: Codex CLI & SDK, 앱 & IDE 확장, Cloud, ChatGPT Credits, API Access.

### `gpt-5.4`

전문 작업용 플래그십 프론티어 모델. GPT-5.3-Codex의 업계 선도 코딩 능력 + 더 강한 reasoning, 도구 사용, agentic 워크플로 결합.

```bash
codex -m gpt-5.4
```

### `gpt-5.4-mini`

응답성 코딩 작업과 서브에이전트용 빠르고 효율적인 mini 모델.

```bash
codex -m gpt-5.4-mini
```

### `gpt-5.3-codex`

복잡 소프트웨어 엔지니어링용 업계 선도 코딩 모델. 그 코딩 능력이 GPT-5.4도 구동.

```bash
codex -m gpt-5.3-codex
```

### `gpt-5.3-codex-spark`

거의 즉각 실시간 코딩 반복용 텍스트 전용 research preview 모델. ChatGPT Pro 사용자 가용.

```bash
codex -m gpt-5.3-codex-spark
```

---

대부분 Codex 작업은 모델 picker에 나오면 `gpt-5.5`로 시작. 복잡 코딩, computer use, 지식 작업, 리서치 워크플로에 가장 강함. ChatGPT 또는 API 키 인증으로 가용.

가벼운 코딩이나 서브에이전트의 더 빠르고 저비용 옵션은 `gpt-5.4-mini`. ChatGPT Pro 가입자는 거의 즉각 실시간 반복 최적화된 `gpt-5.3-codex-spark` (research preview).

## 대체 모델

### `gpt-5.2`

코딩과 agentic 작업의 이전 범용 모델. 더 깊은 deliberation이 도움 되는 어려운 디버깅 작업 포함.

```bash
codex -m gpt-5.2
```

## 기타 모델

ChatGPT 로그인 시 위 모델들과 가장 잘 동작.

[Chat Completions](https://platform.openai.com/docs/api-reference/chat) 또는 [Responses API](https://platform.openai.com/docs/api-reference/responses)를 지원하는 모델·프로바이더에 Codex를 가리킬 수 있음.

> Chat Completions API 지원은 deprecated, 향후 Codex 릴리스에서 제거 예정.

## 모델 설정

### 기본 로컬 모델 설정

CLI와 IDE 확장은 같은 `config.toml` [설정 파일](../configuration/config-basic.md) 사용. `model` 항목 추가. 미지정 시 권장 모델 기본.

```toml
model = "gpt-5.5"
```

계정에서 `gpt-5.5` 미가용이면 `gpt-5.4` 사용.

### 일시적으로 다른 로컬 모델 선택

CLI에서 활성 스레드 중 `/model` 명령으로 모델 변경. IDE 확장은 입력 박스 아래 모델 selector.

특정 모델로 새 CLI 스레드 시작 또는 `codex exec`에 모델 지정: `--model`/`-m` 플래그:

```bash
codex -m gpt-5.5
```

### 클라우드 작업의 모델 선택

현재 Codex 클라우드 작업의 기본 모델 변경 불가.

---
원문: https://developers.openai.com/codex/ide/features
동기화일: 2026-05-15
---

# Codex IDE 확장 기능

> Codex IDE 확장으로 할 수 있는 일

VS Code, Cursor, Windsurf 등 VS Code 호환 에디터에서 Codex 직접 액세스. CLI와 같은 에이전트 + 같은 설정 공유.

## Codex prompt

에디터에서 채팅·편집·미리보기. 열린 파일·선택 코드 컨텍스트가 있을 때 더 짧은 prompt + 더 빠르고 관련된 결과.

prompt에 태그하여 어떤 파일이든 참조:
```
Use @example.tsx as a reference to add a new page named "Resources" to the app that contains a list of resources defined in @resources.ts
```

## 모델 전환

채팅 입력 아래 switcher로 모델 전환.

## Reasoning effort 조정

Codex가 응답 전 얼마나 생각하는지 제어. 더 높은 effort는 복잡 작업에 도움, 응답 시간 ↑. 토큰도 더 사용 → rate limit 빠르게 소비, 특히 더 강력한 모델에서.

같은 모델 switcher에서 모델별 `low`/`medium`/`high` 선택. `medium`으로 시작, 더 깊이 필요할 때만 `high`.

## 승인 모드 선택

기본 `Agent` 모드 — Codex가 작업 디렉터리에서 자동으로 파일 읽기·편집·명령 실행. 작업 디렉터리 외부 또는 네트워크 접근에는 승인 필요.

채팅만 하거나 변경 전 계획만 하고 싶으면 `Chat`으로 전환 (채팅 입력 아래 switcher).

승인 없이 네트워크 액세스 + 파일 읽기·편집·명령 실행 → `Agent (Full Access)`. 신중히 사용.

## 클라우드 위임

큰 작업을 클라우드 Codex에 offload, IDE 떠나지 않고 진행 추적·결과 검토.

1. [Codex 클라우드 환경](https://chatgpt.com/codex/settings/environments) 셋업
2. 환경 선택 → **Run in the cloud**

`main`에서 실행 (새 아이디어 시작에 유용) 또는 로컬 변경에서 실행 (작업 마무리에 유용).

로컬 대화에서 클라우드 작업 시작 시 Codex가 대화 컨텍스트 기억 → 이어서 진행.

## 클라우드 작업 후속

확장이 클라우드 변경 미리보기를 직관적으로. 클라우드에서 후속 실행 요청 가능, 자주 로컬에서 변경 적용·테스트·마무리 원함. 로컬에서 대화 계속 시 Codex가 컨텍스트 유지 → 시간 절약.

[Codex 클라우드 인터페이스](https://chatgpt.com/codex)에서도 클라우드 작업 보기.

## 웹 검색

first-party 웹 검색 도구 내장. IDE 확장 로컬 작업에서 기본 활성화 + 웹 검색 캐시 (OpenAI 유지 prebuilt index)에서 결과 제공. 임의 라이브 콘텐츠 prompt injection 노출 ↓ (단, 결과는 untrusted로 다루기). 샌드박스를 [full access](../administration/agent-approvals-security.md)로 설정 시 라이브 결과 기본. → [Config basics](../configuration/config-basic.md)에서 비활성화 또는 라이브 전환.

Codex가 lookup할 때마다 트랜스크립트나 `codex exec --json`에 `web_search` 항목 표시.

## prompt에 이미지 드래그·드롭

prompt composer에 이미지 드래그·드롭으로 컨텍스트 포함.

> 드롭 시 `Shift` 누르기 — VS Code가 그 외에는 확장의 drop 수용 차단.

## 이미지 생성

에디터 떠나지 않고 Codex에 이미지 생성·편집 요청. UI 자산, 레이아웃, 일러스트, 스프라이트 시트, 빠른 placeholder에 유용. 기존 자산 변형·확장에는 참조 이미지 첨부.

자연어 또는 prompt에 `$imagegen` 명시.

내장 이미지 생성은 `gpt-image-2` — 일반 Codex 사용량 한도 카운트, 비슷한 턴 대비 평균 3-5배 빠르게 한도 소진 (이미지 품질·크기 따라). → [Pricing](../getting-started/pricing.md)

대량 생성: `OPENAI_API_KEY` 환경 변수 설정 + API 경로로 요청 → API 가격 적용.

## 참고

- [Codex IDE 확장 설정](settings.md)

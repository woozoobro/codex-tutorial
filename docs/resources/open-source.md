---
원문: https://developers.openai.com/codex/open-source
동기화일: 2026-05-15
---

# 오픈소스

> Codex 오픈소스 컴포넌트와 협업 위치

OpenAI가 Codex 핵심 부분을 open으로 개발. 그 작업은 GitHub에 → 진행 follow, 이슈 보고, 개선 기여 가능.

널리 사용 오픈소스 프로젝트 유지 또는 중요 프로젝트 stewarding maintainer 추천 → [Codex for OSS 프로그램](https://developers.openai.com/community/codex-for-oss) 신청 가능 — API 크레딧, Codex가 있는 ChatGPT Pro, Codex Security 선택 액세스.

## 오픈소스 컴포넌트

| 컴포넌트 | 위치 | 메모 |
| --- | --- | --- |
| Codex CLI | [openai/codex](https://github.com/openai/codex) | Codex 오픈소스 개발의 primary 홈 |
| Codex SDK | [openai/codex/sdk](https://github.com/openai/codex/tree/main/sdk) | SDK 소스가 Codex 리포에 |
| Codex App Server | [openai/codex/codex-rs/app-server](https://github.com/openai/codex/tree/main/codex-rs/app-server) | App-server 소스가 Codex 리포에 |
| Skills | [openai/skills](https://github.com/openai/skills) | Codex 확장 재사용 스킬 |
| IDE 확장 | - | 오픈소스 아님 |
| Codex web | - | 오픈소스 아님 |
| Universal cloud 환경 | [openai/codex-universal](https://github.com/openai/codex-universal) | Codex 클라우드 사용 base 환경 |

## 이슈 보고·기능 요청 위치

Codex GitHub 리포로 모든 Codex 컴포넌트 버그 보고·기능 요청:

- 버그 보고·기능 요청: [openai/codex/issues](https://github.com/openai/codex/issues)
- 토론 포럼: [openai/codex/discussions](https://github.com/openai/codex/discussions)

이슈 file 시 사용 컴포넌트 (CLI, SDK, IDE 확장, Codex web)와 가능한 버전 포함.

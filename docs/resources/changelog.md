---
원문: https://developers.openai.com/codex/changelog
동기화일: 2026-05-15
---

# Changelog

> Codex 릴리스 노트

> ⚠️ Codex changelog는 매우 길고 (수천 줄) 빠르게 변경됩니다. 한국어 번역 대신 원문 직접 확인을 권장합니다.

## 원문 위치

**https://developers.openai.com/codex/changelog**

원문에는 모든 Codex 컴포넌트 (CLI, IDE 확장, App, Cloud, App Server, SDK, GitHub Action 등)의 릴리스 노트가 시간 순으로 정리되어 있다.

## 핵심 릴리스 정보 찾는 법

### CLI 버전 확인

```bash
codex --version
```

### 앱 버전 확인 (macOS)

```bash
/Applications/Codex.app/Contents/Resources/codex --version
```

### 기능 성숙도 확인

각 기능의 안정도 (Stable/Beta/Experimental) → [Feature Maturity](feature-maturity.md)

### 주요 변경 추적

릴리스 알림·중요 변경:
- Codex GitHub 리포: https://github.com/openai/codex
- 디스커션 포럼: https://github.com/openai/codex/discussions
- OpenAI Developers Community: https://developers.openai.com/community

### Breaking changes

큰 breaking change나 마이그레이션 필요 사항이 발생하면 보통 Codex 앱·CLI 시작 시 in-product 알림으로 표시. 또한 자주 사용하는 워크플로 (CI, automations, 스크립트)는 정기적으로 [Configuration Reference](../configuration/config-reference.md)와 비교해 deprecated 키 확인 권장.

---
원문: https://developers.openai.com/codex/cli
동기화일: 2026-05-15
---

# CLI 개요

> 터미널에서 Codex와 함께 작업한다.

Codex CLI는 OpenAI의 코딩 에이전트로, 로컬 터미널에서 실행한다. 선택한 디렉터리에서 코드를 읽고, 수정하고, 실행할 수 있다. [오픈소스](https://github.com/openai/codex)이며 속도와 효율성을 위해 Rust로 작성되었다.

ChatGPT Plus, Pro, Business, Edu, Enterprise 플랜에 Codex가 포함된다. 자세한 사항은 [가격 페이지](../getting-started/pricing.md) 참고.

## 설치

### npm

```bash
# 설치
npm i -g @openai/codex

# 실행 (최초 실행 시 ChatGPT 또는 API 키로 로그인)
codex

# 업그레이드
npm i -g @openai/codex@latest
```

### Homebrew

```bash
brew install codex
```

새 버전은 정기 릴리스됨. [Changelog](../resources/changelog.md) 참고.

## 플랫폼 지원

macOS, Windows, Linux 모두 지원.
- **Windows**: PowerShell에서 네이티브 실행 (Windows 샌드박스 사용) 또는 Linux 환경이 필요할 때 WSL2 사용. 자세한 셋업은 [Windows 가이드](../administration/windows.md) 참고.

처음 사용한다면 [모범 사례 가이드](../resources/best-practices.md) 권장.

## 사용 시작

```bash
# 인터랙티브 TUI 시작
codex

# 초기 프롬프트와 함께 시작
codex "이 코드베이스를 설명해줘"
```

자세한 기능은 [기능](features.md), 모든 플래그는 [커맨드라인 옵션](reference.md), 슬래시 명령어는 [슬래시 명령어](slash-commands.md) 참고.

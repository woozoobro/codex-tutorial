---
원문: https://developers.openai.com/codex/quickstart
동기화일: 2026-05-15
---

# 퀵스타트 (Quickstart)

**IDE, CLI, 또는 클라우드에서 Codex를 시작한다.**

모든 ChatGPT 플랜에 Codex가 포함되어 있다. OpenAI API 키로 로그인하면 API 크레딧으로도 사용할 수 있다.

## 셋업 옵션

| 옵션 | 위치 | 추천 대상 |
|------|------|-----------|
| **App** (권장) | 데스크톱 앱 (macOS / Windows) | 가장 풍부한 기능을 원하는 사용자 |
| **IDE Extension** | VS Code, Cursor, Windsurf | IDE 안에서 작업하는 사용자 |
| **CLI** | 터미널 (macOS, Windows, Linux) | 터미널 우선 워크플로 |
| **Cloud** | 브라우저 (chatgpt.com/codex) | 백그라운드 작업, GitHub PR 위임 |

---

## App 설치 (macOS / Windows)

대부분의 Codex 앱 기능은 양쪽 플랫폼에서 동일하게 동작한다. 플랫폼별 차이는 관련 문서에 명시되어 있다.

### 1. Codex 앱 다운로드 및 설치

- [macOS (Apple Silicon) 다운로드](https://persistent.oaistatic.com/codex-app-prod/Codex.dmg)
- [macOS (Intel) 다운로드](https://persistent.oaistatic.com/codex-app-prod/Codex-latest-x64.dmg)
- [Windows 다운로드](https://get.microsoft.com/installer/download/9PLM9XGG6VKS?cid=website_cta_psi)
- [Linux 알림 신청](https://openai.com/form/codex-app/)

Intel Mac이면 Intel 빌드를 선택한다.

### 2. Codex 열기 및 로그인

설치 후 앱을 열고 ChatGPT 계정 또는 OpenAI API 키로 로그인한다.

> 참고: API 키로 로그인하면 클라우드 스레드 등 일부 기능을 사용할 수 없다.

### 3. 프로젝트 선택

Codex가 작업할 프로젝트 폴더를 선택한다. 이전에 Codex 앱·CLI·IDE 확장을 사용한 적이 있으면 과거 프로젝트가 표시된다.

### 4. 첫 메시지 보내기

**Local**이 선택되어 있는지 확인한 후 (로컬 머신에서 작업), 첫 메시지를 보낸다. 예시:

- "이 프로젝트에 대해 알려줘"
- "이 레포에 클래식 Snake 게임을 만들어줘"
- "내 코드베이스에서 버그를 찾아 최소한의 안전한 변경으로 고쳐줘"

영감이 더 필요하면 [활용 사례](use-cases.md)와 [모범 사례 가이드](../resources/best-practices.md)를 참고한다.

---

## IDE Extension 설치

### 1. 확장 설치

- [VS Code](vscode:extension/openai.chatgpt)
- [Cursor](cursor:extension/openai.chatgpt)
- [Windsurf](windsurf:extension/openai.chatgpt)
- [VS Code Insiders](https://marketplace.visualstudio.com/items?itemName=openai.chatgpt)

### 2. Codex 패널 열기

설치 후 Codex 확장이 사이드바에 나타난다 (접힌 섹션에 숨어 있을 수 있음). 원한다면 패널을 에디터 오른쪽으로 이동시킬 수 있다.

### 3. 로그인 및 첫 작업

ChatGPT 계정 또는 API 키로 로그인. Codex는 기본적으로 **Agent 모드**로 시작하며, 프로젝트 디렉터리에서 파일 읽기·명령어 실행·변경사항 쓰기가 가능하다.

### 4. Git 체크포인트 활용

Codex가 코드베이스를 수정할 수 있으므로, 작업 전후로 Git 체크포인트를 남겨두면 쉽게 되돌릴 수 있다.

→ [Codex IDE 확장 자세히 보기](../ide/overview.md)

---

## CLI 설치

macOS, Windows, Linux 모두 지원한다.

### 1. CLI 설치

```bash
# npm
npm install -g @openai/codex

# Homebrew
brew install codex
```

### 2. `codex` 실행 및 로그인

터미널에서 `codex` 실행 → ChatGPT 계정 또는 API 키로 로그인.

### 3. 현재 디렉터리에서 작업 요청

인증되면 현재 디렉터리에서 작업을 요청할 수 있다.

### 4. Git 체크포인트

CLI 작업 시에도 마찬가지로 작업 전후 체크포인트 권장.

→ [Codex CLI 자세히 보기](../cli/overview.md)

---

## Cloud 설치

[chatgpt.com/codex](https://chatgpt.com/codex) 에서 사용한다.

### 1. 브라우저로 접속

GitHub PR 코멘트에서 `@codex` 태그로 작업을 위임할 수도 있다 (ChatGPT 로그인 필요).

### 2. 환경 셋업

첫 작업 전에 환경 설정 필요. [환경 설정 페이지](https://chatgpt.com/codex/settings/environments)에서 GitHub 리포 연결 단계 진행.

### 3. 작업 실행 및 진행 모니터링

환경 준비 완료되면 Codex 인터페이스에서 코딩 작업을 시작한다. 실시간 로그로 진행 상황 확인 가능, 백그라운드 실행도 지원.

### 4. 변경 검토 및 PR 생성

작업 완료 시 diff 뷰에서 변경 검토 → 결과 반복 개선 또는 PR 직접 생성. 미리보기를 확인하거나 로컬에서 브랜치 체크아웃해 테스트할 수도 있다.

```bash
git fetch
git checkout <branch-name>
```

→ [Codex Cloud 자세히 보기](../web/overview.md)

---

## 다음 단계

- [Codex 앱 자세히 보기](../ide/app-overview.md) — 로컬 프로젝트 작업
- [Codex로 마이그레이션](migrate.md) — 다른 에이전트의 instruction 파일, MCP 서버, 스킬, 서브에이전트 가져오기

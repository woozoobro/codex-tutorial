---
원문: https://developers.openai.com/codex/app/local-environments
동기화일: 2026-05-15
---

# Local environments

> worktree용 흔한 액션·셋업 스크립트 구성

로컬 환경으로 worktree 셋업 단계 + 프로젝트 흔한 액션 구성.

[Codex 앱 설정](codex://settings) 패널에서 구성. 생성된 파일을 프로젝트 Git 리포에 체크인해 공유 가능.

Codex는 이 설정을 프로젝트 root의 `.codex` 폴더에 저장. 리포에 1개 초과 프로젝트면 공유 `.codex` 폴더 포함하는 프로젝트 디렉터리 열기.

## 셋업 스크립트

Worktree는 로컬 작업과 다른 디렉터리에서 실행 → 프로젝트가 완전 셋업 안 되어 있을 수 있음 + 리포에 체크인 안 된 의존성·파일 누락 가능. 셋업 스크립트는 Codex가 새 스레드 시작 시 새 worktree 생성할 때 자동 실행.

환경 구성에 필요한 명령 (의존성 설치, 빌드 프로세스 등) 실행에 사용.

TypeScript 프로젝트 예 — 의존성 설치 + 초기 빌드:
```bash
npm install
npm run build
```

플랫폼 특화 셋업이면 macOS, Windows, Linux용 셋업 스크립트 정의해 기본 오버라이드.

## Actions

Actions로 흔한 작업 정의 (앱 dev 서버 시작, 테스트 셋 실행 등). Codex 앱 상단 바에 빠른 액세스로 표시. 앱 [통합 터미널](app-features.md)에서 실행.

Actions는 빌드 트리거나 dev 서버 시작 같은 흔한 액션 타이핑 절약에 도움. 일회성 빠른 디버깅은 통합 터미널 직접 사용.

Node.js 프로젝트 예 — "Run" 액션:
```bash
npm start
```

액션 명령이 플랫폼 특화면 macOS, Windows, Linux용 플랫폼 특화 스크립트 정의.

각 액션 식별을 위해 연관 아이콘 선택.

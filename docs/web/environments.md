---
원문: https://developers.openai.com/codex/cloud/environments
동기화일: 2026-05-15
---

# 클라우드 환경 (Environments)

> Codex의 의존성·도구 커스터마이즈

환경으로 Codex가 클라우드 작업 동안 설치·실행하는 것 제어. 의존성 추가, 린터·포매터 같은 도구 설치, 환경 변수 설정 등.

→ [Codex 설정](https://chatgpt.com/codex/settings/environments)에서 환경 구성

## 클라우드 작업 실행 방식

작업 제출 시:

1. Codex가 컨테이너 생성 + 선택된 브랜치/commit SHA에서 리포 체크아웃
2. 셋업 스크립트 실행 + (캐시 컨테이너 재개 시) 선택적 maintenance 스크립트
3. 인터넷 액세스 설정 적용. 셋업 스크립트는 인터넷 액세스로 실행. 에이전트 인터넷 액세스 기본 OFF, 필요 시 limited·unrestricted 활성화. → [에이전트 인터넷 액세스](internet-access.md)
4. 에이전트가 루프로 터미널 명령 실행 — 코드 편집, 체크 실행, 작업 검증 시도. 리포에 `AGENTS.md`가 있으면 프로젝트 특화 lint·테스트 명령에 사용.
5. 에이전트 종료 시 답변 + 변경 파일 diff 표시. PR 열기 또는 후속 질문 가능.

## 기본 universal 이미지

Codex 에이전트는 `universal` 기본 컨테이너 이미지에서 실행 — 흔한 언어, 패키지, 도구 사전 설치.

환경 설정에서 **Set package versions** → Python, Node.js 등 런타임 버전 pin.

설치된 것 디테일: [openai/codex-universal](https://github.com/openai/codex-universal) — 참조 Dockerfile과 로컬 pull·테스트 가능 이미지.

`codex-universal`은 속도·편의 위해 언어 사전 설치, 추가 패키지 설치는 [셋업 스크립트](#수동-셋업) 사용.

## 환경 변수와 시크릿

**환경 변수**: 작업 전체 (셋업 스크립트와 에이전트 단계 포함) 동안 설정.

**시크릿**: 환경 변수와 비슷, 다른 점:
- 추가 암호화 레이어로 저장, 작업 실행에만 복호화
- 셋업 스크립트에만 가용. 보안상 에이전트 단계 시작 전 제거.

## 자동 셋업

흔한 패키지 매니저 (`npm`, `yarn`, `pnpm`, `pip`, `pipenv`, `poetry`) 사용 프로젝트는 Codex가 의존성·도구 자동 설치 가능.

## 수동 셋업

개발 셋업이 더 복잡하면 커스텀 셋업 스크립트 제공:

```bash
# 타입 체커 설치
pip install pyright

# 의존성 설치
poetry install --with test
pnpm install
```

> 셋업 스크립트는 에이전트와 별도 Bash 세션에서 실행 — `export` 같은 명령은 에이전트 단계로 영속 안 됨. 환경 변수 영속화는 `~/.bashrc`에 추가 또는 환경 설정에서 구성.

## 컨테이너 캐싱

Codex는 컨테이너 상태를 최대 12시간 캐시 → 새 작업·후속 가속.

캐시 시:
- Codex가 리포 클론 + 기본 브랜치 체크아웃
- 셋업 스크립트 실행 + 결과 컨테이너 상태 캐시

캐시 컨테이너 재개 시:
- Codex가 작업 지정 브랜치 체크아웃
- maintenance 스크립트 실행 (선택). 셋업 스크립트가 더 오래된 commit에서 실행됐고 의존성 갱신 필요할 때 유용.

Codex는 셋업 스크립트, maintenance 스크립트, 환경 변수, 시크릿 변경 시 캐시 자동 무효화. 리포가 캐시 상태와 호환 안 되게 변경되면 환경 페이지의 **Reset cache** 선택.

> Business·Enterprise 사용자는 환경 액세스 권한 가진 모든 사용자 간 캐시 공유. 캐시 무효화는 워크스페이스 환경 모든 사용자에게 영향.

## 인터넷 액세스와 네트워크 프록시

셋업 스크립트 단계에서 의존성 설치 위해 인터넷 액세스 가용. 에이전트 단계는 기본 OFF, limited·unrestricted 액세스 구성 가능. → [에이전트 인터넷 액세스](internet-access.md)

환경은 보안·남용 방지 위해 HTTP/HTTPS 네트워크 프록시 뒤에서 실행. 모든 outbound 인터넷 트래픽이 이 프록시 통과.

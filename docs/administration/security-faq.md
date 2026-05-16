---
원문: https://developers.openai.com/codex/security/faq
동기화일: 2026-05-15
---

# Codex Security FAQ

> Codex Security에 대한 흔한 질문

## 시작하기

### Codex Security란?

소프트웨어 보안은 엔지니어링의 가장 어렵고 중요한 문제 중 하나. Codex Security는 LLM 주도 보안 분석 툴킷 — 소스 코드 검사 + 구조화·랭크 취약점 발견 사항 + 제안 패치 반환. 개발자·보안 팀이 보안 이슈를 스케일로 발견·fix 도움.

### 왜 중요한가?

소프트웨어는 현대 산업·사회 기반 + 취약점은 시스템 위험 생성. Codex Security는 가능 이슈 지속 식별, 가능 시 검증, fix 제안으로 defender-first 워크플로 지원. → 개발 속도 안 늦추면서 보안 개선.

### 어떤 비즈니스 문제 해결?

의심 이슈에서 증거·제안 패치 있는 확인·재현 가능 발견 사항까지 경로 단축. → 전통 스캐너만 사용 대비 triage 부하 ↓ + false positive ↓.

### 동작 방식?

Codex Security는 ephemeral·격리 컨테이너에서 분석 실행 + 타깃 리포 임시 클론. 코드 레벨 분석 수행 + 설명, 파일·위치, 중요도, root cause, 제안 치료가 있는 구조화 발견 사항 반환.

검증 단계 포함 발견 사항은 시스템이 같은 샌드박스에서 제안 명령·테스트 실행 + 성공·실패, exit 코드, stdout, stderr, 테스트 결과, 생성 diff·artifact 기록 + 그 출력을 검토 증거로 attach.

### SAST 대체?

아님. Codex Security는 SAST 보완. 시맨틱·LLM 기반 reasoning + 자동 검증 추가. 기존 SAST 도구는 여전히 광범위 결정적 커버리지 제공.

## 기능

### 분석 파이프라인은?

스테이지 파이프라인:

1. **Analysis**: 리포 위협 모델 빌드
2. **Commit scanning**: merge된 commit과 리포 히스토리에서 가능 이슈 검토
3. **Validation**: false positive 감소 위해 샌드박스에서 가능 취약점 재현 시도
4. **Patching**: Codex와 통합해 reviewer가 PR 열기 전 검사 가능한 패치 제안

GitHub, Codex, 표준 검토 워크플로의 엔지니어와 함께 동작.

### 지원 언어?

Language-agnostic. 실무에서 성능은 리포 언어·프레임워크에 대한 모델 reasoning 능력에 달림.

### 스캔 완료 후 받는 출력?

중요도, 검증 상태, 가용 시 제안 패치가 있는 랭크 발견 사항. 발견 사항은 crash 출력, 재현 증거, call-path 컨텍스트, 관련 annotation 포함 가능.

### 고객 코드 격리는?

각 분석·검증 작업은 세션 스코프 도구가 있는 ephemeral Codex 컨테이너에서 실행. Artifact 검토용 추출 → 작업 완료 후 컨테이너 폐기.

### 패치 자동 적용?

아님. 제안 패치는 권장 치료. 사용자가 검토 + 발견 사항 UI에서 GitHub로 PR push 가능, Codex Security가 리포 변경 자동 적용 안 함.

### 스캔에 프로젝트 빌드 필요?

아님. 컴파일 단계 없이 리포·commit 컨텍스트에서 발견 사항 생산 가능. auto-validation 중 이슈 재현 도움 되면 컨테이너 안에서 프로젝트 빌드 시도 가능. → 환경 셋업 디테일: [Codex 클라우드 환경](../web/environments.md)

### false positive 감소·patch 깨짐 회피 방식?

두 스테이지 사용. 먼저 모델이 가능 이슈 랭크. 다음 auto-validation이 깨끗한 컨테이너에서 각 이슈 재현 시도. 성공 재현된 발견 사항은 validated 표시 → 사람 검토 전 false positive ↓.

### 초기 스캔 시간?

리포 크기, 빌드 시간, 검증 진행 발견 사항 수에 의존. 일부 리포 몇 시간, 큰 리포 며칠. 이후 스캔은 보통 더 빠름 — 새 commit과 증분 변경 집중.

### 위협 모델이란?

리포의 스캔 시점 보안 컨텍스트. 간결 프로젝트 개요 + entry point, trust 경계, auth 가정, 위험 컴포넌트 같은 공격 표면 디테일 결합. → [위협 모델 개선](security-threat-model.md)

### 위협 모델 생성 방식?

Codex Security가 모델에게 리포 아키텍처·보안 entry point 요약, 리포 타입 분류, 특화 추출기 실행, 결과를 스캔 전반에 사용되는 프로젝트 개요·위협 모델 artifact로 머지 prompt.

### 수동 보안 검토 대체?

아님. 검토 가속 + 발견 사항 랭크 도움, 코드 레벨 검증, 악용 가능성 체크, 사람 위협 평가 대체 안 함.

### 위협 모델 편집?

예. Codex Security가 초기 위협 모델 생성 + 아키텍처·위험·비즈니스 컨텍스트 변경 시 갱신. 편집 워크플로: [위협 모델 개선](security-threat-model.md)

### 위협 모델링 전 스캔 구성 필요?

예. 위협 모델 가이드는 어떻게·무엇을 스캔하는지에 묶임 → 리포 먼저 구성. → [Codex Security 셋업](security-setup.md)

### 제안 패치 내용?

치료 생성 가능 시 파일명·라인 컨텍스트가 있는 최소 액션 가능 diff.

### 패치가 PR 브랜치 직접 수정?

아님. 워크플로가 적용 전 maintainer·reviewer 검사용 diff, 패치 파일, 제안 변경 생성.

## 검증

### auto-validation이란?

격리 컨테이너에서 의심 이슈 재현 시도 단계. 재현 성공·실패 기록 + 로그, 명령, 관련 artifact를 증거로 캡처.

### 검증 실패 시?

발견 사항이 unvalidated 유지. 로그·리포트는 시도된 것 캡처 → 엔지니어가 재시도, 추가 조사, 재현 단계 조정 가능.

---
원문: https://developers.openai.com/codex/security/setup
동기화일: 2026-05-15
---

# Codex Security 셋업

> 셋업 → 초기 발견 사항 대기 → 위협 모델 편집으로 결과 개선

이 페이지는 초기 액세스부터 검토된 발견 사항·치료 PR까지 안내.

> Codex Cloud 셋업 먼저 확인. 안 했으면 [Codex Cloud](../web/overview.md)부터.

## 1. 액세스와 환경

Codex Security는 [Codex Cloud](../web/overview.md) 통한 연결 GitHub 리포 스캔.

- 워크스페이스에 Codex Security 액세스 권한 확인
- 스캔할 리포가 Codex Cloud에 가용한지 확인

[Codex 환경](https://chatgpt.com/codex/settings/environments)으로 가서 리포에 환경 이미 있는지 체크. 없으면 거기서 생성.

## 2. 새 보안 스캔

환경 생성 후 [보안 스캔 생성](https://chatgpt.com/codex/security/scans/new) → 방금 연결한 리포 선택.

Codex Security는 리포를 최신 commit부터 거꾸로 스캔. 새 commit 들어옴에 따라 스캔 컨텍스트 빌드·새로고침에 사용.

리포 구성:

1. GitHub 조직 선택
2. 리포 선택
3. 스캔할 브랜치 선택
4. 환경 선택
5. **history window** 선택. 더 긴 윈도우는 더 많은 컨텍스트, 백필 시간 ↑.
6. **Create**

## 3. 초기 스캔은 시간이 걸림

스캔 생성 시 Codex Security가 선택 history window 전반에 commit 레벨 보안 패스 실행. 초기 백필은 몇 시간 걸릴 수 있음 — 특히 큰 리포·긴 윈도우. 발견 사항 즉시 안 보여도 정상. 티켓 열기·트러블슈팅 전 초기 스캔 완료 대기.

> 초기 스캔 셋업은 자동·thorough. 몇 시간 걸릴 수 있음. 첫 발견 사항 셋이 지연돼도 놀라지 말 것.

## 4. 스캔 검토·위협 모델 개선

초기 스캔 종료 시 스캔 열기 + 생성된 위협 모델 검토. 초기 발견 사항 표시 후 위협 모델을 아키텍처, trust 경계, 비즈니스 컨텍스트와 매치되게 갱신. → Codex Security가 팀용으로 이슈 랭크.

스캔 결과 변경 원하면 갱신 스코프, 우선순위, 가정으로 위협 모델 편집.

초기 발견 사항 표시 후 모델 재방문해 스캔 가이드가 현재 우선순위와 정렬 유지. 최신 유지로 더 나은 제안 생산.

→ 위협 모델·중요도·triage 영향 자세히: [위협 모델 개선](security-threat-model.md)

## 5. 발견 사항 검토·패치

초기 백필 완료 후 **Findings** view에서 발견 사항 검토.

두 view:
- **Recommended Findings**: 리포의 가장 critical 이슈 진화 top 10 리스트
- **All Findings**: 리포 전반 발견 사항 정렬·필터 가능 테이블

발견 사항 클릭 → 상세 페이지 — 포함:
- 이슈 간결 설명
- commit 디테일·파일 경로 같은 핵심 메타데이터
- 영향 컨텍스트 reasoning
- 관련 코드 발췌
- 가용 시 call-path·data-flow 컨텍스트
- 검증 단계와 검증 출력

각 발견 사항 검토 + 발견 상세 페이지에서 직접 PR 생성 가능.

## 관련 문서

- [Codex Security](security-overview.md): 제품 개요
- [FAQ](security-faq.md): 흔한 질문
- [위협 모델 개선](security-threat-model.md): 스캔 컨텍스트·발견 우선순위 개선

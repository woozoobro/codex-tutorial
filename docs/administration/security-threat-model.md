---
원문: https://developers.openai.com/codex/security/threat-model
동기화일: 2026-05-15
---

# 위협 모델 개선

> 발견 사항 랭크·검토 가속에 도움 되는 Codex Security 컨텍스트 정제

위협 모델이 무엇이고, 편집이 어떻게 Codex Security 제안 개선하는지.

## 위협 모델이란

위협 모델은 리포가 어떻게 동작하는지 짧은 보안 요약. Codex Security에선 `project overview`로 편집, 시스템이 미래 스캔, 우선순위, 검토의 스캔 컨텍스트로 사용.

Codex Security가 코드에서 첫 초안 생성. 발견 사항이 부적절하게 느껴지면 가장 먼저 편집할 것.

유용한 위협 모델이 호출:
- entry point와 untrusted 입력
- trust 경계와 auth 가정
- 민감 데이터 경로 또는 권한 액션
- 팀이 먼저 검토하길 원하는 영역

예:
> 계정 변경용 공개 API. JSON 요청과 파일 업로드 수용. 신원 체크에 내부 auth 서비스 사용 + 청구 변경을 내부 서비스 통해 작성. auth 체크, 업로드 파싱, 서비스 간 trust 경계 검토 집중.

→ Codex Security에 미래 스캔·발견 우선순위에 더 나은 출발점.

## 위협 모델 개선·재방문

결과 개선 원하면 위협 모델 먼저 편집. 발견 사항이 관심 영역 누락 또는 예상 안 한 곳에 표시될 때 사용. 위협 모델은 미래 스캔 컨텍스트 변경.

일부 사용자는 현재 위협 모델을 Codex에 복사 → 더 면밀 검토 원하는 영역 기반 개선 대화 → 갱신 버전을 웹 UI에 paste.

### 편집 위치

검토·갱신: [Codex Security 스캔](https://chatgpt.com/codex/security/scans) → 리포 열기 → **Edit**.

## 관련 문서

- [Codex Security 셋업](security-setup.md): 리포 셋업과 발견 사항 검토
- [Codex Security](security-overview.md): 제품 개요
- [FAQ](security-faq.md): 흔한 질문

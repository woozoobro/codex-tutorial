---
원문: https://developers.openai.com/codex/pricing
동기화일: 2026-05-15
---

# 가격 (Pricing)

> ⚠️ 가격·사용량 한도는 자주 바뀐다. 결정 전에 반드시 [원문 페이지](https://developers.openai.com/codex/pricing)에서 최신 수치를 확인할 것.

## 플랜 개요

Codex는 ChatGPT 플랜에 포함되어 있다.

| 플랜 | 가격 (대략) | 대상 |
|------|-------------|------|
| Free | $0/월 | 기본 탐색 |
| Go | $8/월 | 가벼운 코딩 작업 |
| Plus | $20/월 | 주간 몇 회 집중 세션 |
| Pro | $100/월부터 | Plus 대비 5x~20x 사용량 |
| Business | Pay-as-you-go | 팀 시트 + 관리자 통제 |
| Enterprise / Edu | 커스텀 | 영업 문의 |
| API Key | 토큰 기반 종량제 | OpenAI API 키 사용 |

## 플랜별 주요 기능

**Plus**
- Web, CLI, IDE, iOS 접근
- 클라우드 통합
- 최신 모델 (GPT-5.5, GPT-5.4, GPT-5.3-Codex)
- 루틴 작업용 mini 모델
- 크레딧 확장 옵션

**Pro 추가**
- GPT-5.3-Codex-Spark (research preview) 접근
- 5x~20x 사용량 multiplier
- 2026-05-31까지 $100 티어에서 사용량 2배 프로모션

**Business 추가**
- 유연한 시트 할당
- 더 큰 VM
- 관리자 통제
- SAML SSO
- 데이터 학습 기본 비활성화

**Enterprise / Edu 추가**
- 우선 처리
- 엔터프라이즈 보안
- SCIM
- 감사 로그
- 데이터 레지던시 통제

## 사용량 한도 (5시간 윈도우 기준)

플랜·모델별로 다르다. 예시:

| 플랜 | GPT-5.5 (로컬 메시지) | GPT-5.4-mini |
|------|------------------------|---------------|
| Plus | 15~80 | 60~350 |
| Pro 5x | 80~400 | 300~1750 |
| Pro 20x | 300~1600 | 1200~7000 |

API Key 사용 시 토큰 소비량에 따라 과금.

## 크레딧 시스템

2026-04-02 부로 토큰 기반 요금제로 전환. 입력 토큰, 캐시된 입력, 출력 토큰별로 크레딧 소비. Business 및 신규 Enterprise 고객은 새 요금표 적용, 기존 플랜은 순차 마이그레이션.

샘플 요금 (Business / 신규 Enterprise):
- GPT-5.5: 1M 입력 토큰당 125 크레딧
- GPT-5.4: 1M 입력 토큰당 62.50 크레딧

→ 정확한 요금표는 https://developers.openai.com/codex/pricing 참고

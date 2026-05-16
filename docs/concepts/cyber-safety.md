---
원문: https://developers.openai.com/codex/concepts/cyber-safety
동기화일: 2026-05-15
---

# 사이버 안전 (Cyber Safety)

> Codex 사용자를 위한 사이버보안 안전장치와 trusted access

[GPT-5.3-Codex](https://openai.com/index/introducing-gpt-5-3-codex/)는 OpenAI의 [Preparedness Framework](https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf) 아래 **High 사이버보안 능력**으로 다루는 첫 모델 — 추가 안전장치 필요. 이 안전장치엔 자격증명 탈취 같은 명백히 악의적 요청을 거부하도록 모델 학습 포함.

안전 학습 외에 자동 classifier 기반 모니터가 의심 사이버 활동 신호 감지 → 고위험 트래픽을 덜 사이버 능력 있는 모델 (GPT-5.2)로 라우팅. 이 mitigation에 영향받는 트래픽은 매우 적은 부분으로 예상, 정책·classifier·in-product 알림 정교화 진행.

## 왜 이렇게 하는가

최근 몇 달간 사이버보안 작업의 모델 성능이 의미 있게 향상 — 개발자와 보안 전문가 모두에게 이익. 모델이 취약점 발견 같은 사이버보안 관련 작업에 좋아지면서 예방적 접근: 합법적 리서치 지원 + 오용 둔화를 위해 보호·enforcement 확장.

사이버 능력은 본질적으로 dual-use. 침투 테스트, 취약점 리서치, 고스케일 스캐닝, 멀웨어 분석, 위협 인텔리전스 같은 중요 방어 작업의 기반이 되는 같은 지식·기법이 실제 피해도 가능.

이 능력·기법은 보안 개선에 사용될 수 있는 컨텍스트에서 가용·사용 쉬워야 함. OpenAI [Trusted Access for Cyber](https://openai.com/index/trusted-access-for-cyber/) 파일럿은 개인·조직이 잠재적 고위험 사이버보안 활동에 모델을 끊김 없이 계속 사용할 수 있게 함.

## 동작 방식

자동 감지 시스템이 [false positive](#false-positives) 가능한 사이버보안 관련 작업이나 유사 활동을 하는 개발자·보안 전문가는 GPT-5.2로 fallback 리라우팅될 수 있음. mitigation 영향 트래픽 매우 적게 예상, 정책·classifier 캘리브레이션 활발 진행.

Codex CLI 최신 alpha는 요청 리라우팅 시 in-product 메시지 포함. 이 메시지는 며칠 내 모든 클라이언트 지원.

mitigation 영향받은 계정은 [Trusted Access](#trusted-access-for-cyber) 프로그램 가입으로 GPT-5.3-Codex 액세스 회복 가능.

Trusted Access 가입이 모두에게 적합하지 않을 수 있음을 인지 → mitigation 스케일링과 사이버 회복력 [강화](https://openai.com/index/strengthening-cyber-resilience/)함에 따라 대부분 경우 계정 레벨 안전 체크에서 요청 레벨 체크로 이동 계획.

## Trusted Access for Cyber

OpenAI는 일반 가용성 위해 정책·classifier 캘리브레이션 동안 개발자가 고급 능력 유지하게 하는 "trusted access" 파일럿 진행. 목표는 매우 적은 사용자가 [Trusted Access for Cyber](https://openai.com/index/trusted-access-for-cyber/) 가입 필요하게 하는 것.

잠재적 고위험 사이버보안 작업에 모델 사용:
- 사용자: [chatgpt.com/cyber](https://chatgpt.com/cyber)에서 신원 검증
- 엔터프라이즈: OpenAI 담당자 통해 팀 전체 기본 [trusted access](https://openai.com/form/enterprise-trusted-access-for-cyber/) 요청

합법적 방어 작업 가속을 위해 더 사이버 능력 있는 또는 허용적 모델이 필요한 보안 연구자·팀은 [invite-only 프로그램](https://docs.google.com/forms/d/e/1FAIpQLSea_ptovrS3xZeZ9FoZFkKtEJFWGxNrZb1c52GW4BVjB2KVNA/viewform?usp=header)에 관심 표명 가능. Trusted access 사용자도 [Usage Policies](https://openai.com/policies/usage-policies/)와 [Terms of Use](https://openai.com/policies/row-terms-of-use/) 준수 필수.

## False positives

합법적 또는 비-사이버보안 활동이 가끔 flag될 수 있음. 리라우팅 시 응답 모델이 API 요청 로그와 (곧 모든 surface의) CLI in-product 알림에 표시. 잘못된 리라우팅 경험 시 false positive를 `/feedback`으로 보고.

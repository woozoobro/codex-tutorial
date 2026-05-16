---
원문: https://developers.openai.com/codex/speed
동기화일: 2026-05-15
---

# 속도 (Speed)

> 지능을 희생하지 않고 속도 올리기

## Fast mode

Codex는 크레딧을 더 소모하는 대가로 모델 속도를 올릴 수 있다.

Fast mode는 지원 모델 속도를 1.5배 빠르게, 크레딧 소비도 Standard 대비 ↑.
- GPT-5.5: Standard의 **2.5배** 크레딧 소비
- GPT-5.4: Standard의 **2배** 크레딧 소비

CLI에서 `/fast on`, `/fast off`, `/fast status`로 변경·확인. 기본값으로 영구화하려면 `config.toml`에 다음 설정:

```toml
service_tier = "fast"

[features]
fast_mode = true
```

지원 환경: Codex IDE 확장, Codex CLI, Codex 앱 (ChatGPT 로그인 시). API 키 사용 시엔 표준 API 가격 적용 → Fast mode 크레딧 사용 불가.

## Codex-Spark

GPT-5.3-Codex-Spark는 거의 즉각적인 실시간 코딩 반복용으로 최적화된 별도의 빠르고 덜 강력한 Codex 모델. Fast mode와 다름:
- Fast mode: 지원 모델 속도를 올리고 크레딧 더 소비
- Codex-Spark: 자체 모델 선택지, 자체 사용량 한도

Research preview 동안 ChatGPT Pro 구독자만 사용 가능.

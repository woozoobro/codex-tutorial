---
원문: https://developers.openai.com/codex/memories/chronicle
동기화일: 2026-05-15
---

# Chronicle

> 최근 화면 컨텍스트로 Codex 메모리 빌드

> Chronicle은 **opt-in research preview**. macOS의 ChatGPT Pro 가입자만 가능. EU·UK·스위스 미지원. 활성화 전 [프라이버시·보안](#프라이버시와-보안) 섹션 검토 필수.

Chronicle은 Codex 메모리에 화면 컨텍스트 추가. prompt 시 그 메모리가 작업 중인 것을 이해하도록 도움 → 컨텍스트 재진술 부담 ↓.

macOS Codex 앱 opt-in research preview. macOS Screen Recording, Accessibility 권한 필요. 활성화 전 인지: Chronicle은 rate limit 빠르게 사용, prompt injection 위험 ↑, 메모리를 디바이스에 비암호화 저장.

## Chronicle이 돕는 방식

Chronicle은 Codex와 작업 시 컨텍스트 재진술 양 ↓. 최근 화면 컨텍스트로 메모리 빌드 개선 → Codex가 참조 대상 이해, 올바른 소스 식별, 의존하는 도구·워크플로 픽업.

### 화면에 있는 것 사용

Codex가 현재 보고 있는 것 이해 → 시간·컨텍스트 전환 절약.

### 빠진 컨텍스트 채우기

컨텍스트를 신중히 만들어 zero에서 시작할 필요 없음. Chronicle이 컨텍스트 갭 메우기.

### 도구·워크플로 기억

작업 수행에 어떤 도구를 써야 하는지 Codex에 설명할 필요 없음. Codex가 작업하면서 학습 → 장기 시간 절약.

이런 경우 Codex는 Chronicle로 추가 컨텍스트 제공. 다른 소스가 더 나으면 (특정 파일, Slack 스레드, Google Doc, 대시보드, PR 읽기) Chronicle은 소스 식별 → 그 소스 직접 사용.

## Chronicle 활성화

1. Codex 앱 설정 열기
2. **Personalization** → **Memories** 활성화 확인
3. Memories 설정 아래 **Chronicle** 켜기
4. Consent 다이얼로그 검토 → **Continue**
5. Prompt에 따라 macOS Screen Recording, Accessibility 권한 부여
6. 셋업 완료 시 **Try it out** 또는 새 스레드 시작

macOS가 Screen Recording/Accessibility 권한 거부 보고 시: System Settings → Privacy & Security → Screen Recording 또는 Accessibility → Codex 활성화. macOS·조직 제한 시 제한 제거 + Codex가 필요 권한 받은 후 Chronicle 시작.

## Chronicle 일시정지·비활성화

화면 컨텍스트로 메모리 생성 시점을 사용자가 통제. Codex 메뉴바 아이콘 → **Pause Chronicle** / **Resume Chronicle**. 미팅 전이나 컨텍스트로 사용 원치 않는 민감 콘텐츠 보기 전 일시정지. 비활성화: **Settings → Personalization → Memories** → **Chronicle** off.

특정 스레드의 메모리 사용 여부도 통제 가능. → [더 알아보기](memories.md)

## Rate limits

Chronicle은 캡처된 화면 이미지에서 메모리 생성용 sandboxed 에이전트를 백그라운드에서 실행. 이 에이전트들은 현재 rate limit 빠르게 소비.

## 프라이버시와 보안

Chronicle은 화면 캡처 사용 → 화면에 보이는 민감 정보 포함 가능. 마이크·시스템 오디오 접근 없음. 동의 없이 미팅·통신 녹음 금지. 메모리에 기억되지 않게 하려는 콘텐츠 볼 때 일시정지.

### 데이터 저장 위치

화면 캡처는 ephemeral, 컴퓨터에 임시 저장. Chronicle 실행 중 임시 화면 캡처 파일이 `$TMPDIR/chronicle/screen_recording/` 아래 나타날 수 있음. 6시간 이상 된 화면 캡처는 Chronicle 실행 중 삭제.

Chronicle 생성 메모리는 다른 Codex 메모리와 동일: 비암호화 마크다운 파일, 필요 시 읽기·수정 가능. Codex에 검색 요청도 가능. 잊게 하려면 폴더 안 해당 파일 삭제 또는 마크다운 파일을 선택적으로 편집해 정보 제거. 수동으로 새 정보 추가 금지. 생성된 Chronicle 메모리는 `$CODEX_HOME/memories_extensions/chronicle/` (보통 `~/.codex/memories_extensions/chronicle`)에 로컬 저장.

화면 캡처와 메모리 디렉터리 모두 민감 정보 포함 가능. 다른 사람과 공유 금지, 컴퓨터의 다른 프로그램도 이 파일에 접근 가능함을 인지.

### OpenAI에 공유되는 데이터

Chronicle은 화면 컨텍스트 로컬 캡처 → 주기적으로 Codex로 최근 활동을 메모리로 요약. 메모리 생성 위해 Chronicle은 화면 컨텍스트 접근 가능한 ephemeral Codex 세션 시작. 그 세션은 선택된 스크린샷 프레임, 스크린샷에서 추출된 OCR 텍스트, 타이밍 정보, 관련 시간 윈도우의 로컬 파일 경로 처리 가능.

메모리 생성에 사용된 화면 캡처는 디바이스에 임시 저장. 메모리 생성 위해 OpenAI 서버에서 처리 → 메모리는 디바이스에 로컬 저장. 법적 요구가 없으면 처리 후 OpenAI 서버에 스크린샷 저장 안 함, 학습에 사용 안 함.

생성 메모리는 `$CODEX_HOME/memories_extensions/chronicle/`에 로컬 저장된 마크다운 파일. 미래 세션에서 Codex가 메모리 사용 시 관련 메모리 콘텐츠가 그 세션 컨텍스트로 포함될 수 있고, ChatGPT 설정에서 허용하면 모델 개선에 사용될 수 있음. → [더 알아보기](https://help.openai.com/en/articles/7730893-data-controls-faq)

## Prompt injection 위험

Chronicle 사용은 화면 콘텐츠로부터의 prompt injection 공격 위험 ↑. 예: 악성 에이전트 지시가 있는 사이트를 browse하면 Codex가 그 지시를 따를 수 있음.

## 트러블슈팅

### Chronicle 활성화 방법

Chronicle 설정이 보이지 않으면 Chronicle 포함 Codex 앱 빌드 사용 중인지 + Settings → Personalization 안 Memories 활성화 확인.

Chronicle은 현재 macOS의 ChatGPT Pro 가입자만. EU·UK·스위스 미지원.

셋업 미완료 시:
1. Codex가 Screen Recording, Accessibility 권한 있는지 확인
2. Codex 앱 종료·재오픈
3. **Settings → Personalization** 열고 Chronicle 상태 확인

### Chronicle 메모리 생성에 사용되는 모델

Chronicle은 다른 [메모리](memories.md)와 같은 모델 사용. 특정 모델 미설정 시 기본 Codex 모델. 특정 모델 선택은 [config](../configuration/config-basic.md)에서 `consolidation_model` 갱신:

```toml
[memories]
consolidation_model = "gpt-5.4-mini"
```

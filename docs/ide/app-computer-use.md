---
원문: https://developers.openai.com/codex/app/computer-use
동기화일: 2026-05-15
---

# Computer Use

> Codex가 작업 중 데스크톱 앱 사용

> Codex 앱의 computer use는 현재 macOS만 가용. 출시 시점 EEA/UK/스위스 미가용. Computer Use 플러그인 설치 + macOS prompt 시 Screen Recording, Accessibility 권한 부여.

Computer use로 Codex가 macOS GUI 보기·운영. CLI 도구·구조화 통합으로 부족한 작업에 사용 — 데스크톱 앱 체크, 브라우저 사용, 앱 설정 변경, 플러그인 미가용 데이터 소스 작업, GUI에서만 발생하는 버그 재현.

> Computer use는 프로젝트 워크스페이스 외부 앱·시스템 상태 영향 가능 → 스코프 작업에 사용 + 진행 전 권한 prompt 검토.

## 셋업

Codex 설정 → **Computer Use** → **Install** → Codex가 데스크톱 앱 운영 요청 전 Computer Use 플러그인 설치. macOS가 액세스 prompt 시 타겟 앱 보기·상호작용 원하면 Screen Recording과 Accessibility 권한 부여.

필수 권한:
- **Screen Recording**: Codex가 타겟 앱 보기
- **Accessibility**: Codex가 클릭·타이핑·탐색

## 사용 시점

작업이 파일·명령 출력만으로 검증 어려운 GUI에 의존할 때.

적합:
- macOS 앱, iOS 시뮬레이터 플로, Codex가 빌드 중인 다른 데스크톱 앱 테스트
- 웹 브라우저 필요 작업
- GUI에서만 나타나는 버그 재현
- UI 클릭 필요 앱 설정 변경
- 플러그인 미가용 앱·데이터 소스 정보 검사
- 다른 곳에서 작업 중 백그라운드 스코프 작업
- 여러 앱 걸친 워크플로

로컬 빌드 중 웹 앱은 [in-app 브라우저](app-browser.md) 우선.

## Computer use 작업 시작

prompt에 `@Computer` 또는 `@AppName` mention 또는 Codex에 computer use 사용 요청. Codex가 운영해야 할 정확한 앱·윈도우·플로 기술.

```
Open the app with computer use, reproduce the onboarding bug, and fix the
smallest code path that causes it. After each change, run the same UI flow
again.
```

```
Open @Chrome and verify the checkout page still works after the latest changes.
```

타겟 앱이 전용 플러그인·MCP 서버 노출 시 데이터 액세스·반복 작업에 그 구조화 통합 우선. Codex가 앱을 시각적으로 검사·운영해야 할 때 computer use.

## 권한과 승인

computer use용 macOS 시스템 권한은 Codex 안 앱 승인과 별도. macOS 권한이 Codex가 앱 보기·운영 가능하게 함. 앱 승인이 어떤 앱을 Codex가 사용 허용할지 결정. 파일 읽기·편집·셸 명령은 여전히 스레드 샌드박스·승인 설정 따름.

Computer use로 Codex가 허용한 앱에서만 보기·액션. 작업 중 Codex가 컴퓨터 앱 사용 전 권한 요청. **Always allow** 선택 시 Codex가 그 앱을 미래에 다시 묻지 않고 사용 가능. **Always allow** 리스트에서 앱 제거는 Codex 설정 **Computer Use** 섹션.

Codex가 민감·disruptive 액션 전에도 권한 요청 가능.

Codex가 앱 보기·제어 못 하면 **System Settings → Privacy & Security** → Codex 앱의 **Screen Recording**과 **Accessibility** 체크.

## 안전 가이드

Computer use로 Codex가 화면 콘텐츠 보기, 스크린샷, 윈도우·메뉴·키보드 입력·클립보드 상태 상호작용. 보이는 앱 콘텐츠, 브라우저 페이지, 스크린샷, 타겟 앱에 열린 파일을 작업 실행 중 Codex가 처리할 수 있는 컨텍스트로 다룰 것.

작업 좁게 유지 + 민감 플로에 동석:
- Codex에 한 번에 하나의 명확한 타겟 앱·플로
- 언제든 작업 중지·컴퓨터 인계 가능
- 작업에 필요 없으면 민감 앱 닫기
- 동석 + 매 단계 승인 가능 시에만 시크릿 필요 작업
- Codex가 앱 사용 허용 전 앱 권한 prompt 검토
- **Always allow**는 미래 작업에서 자동 사용 신뢰하는 앱에만
- 계정·보안·프라이버시·네트워크·결제·자격증명 관련 설정에 동석
- Codex가 잘못된 윈도우와 상호작용 시작하면 작업 취소

Codex가 브라우저 사용 시 이미 로그인된 페이지와 상호작용 가능. 자신이 직접 하듯이 웹사이트 액션 검토 — 웹 페이지에 악성·오해 콘텐츠 가능, 사이트가 승인된 클릭·폼 제출·로그인 액션을 사용자 계정에서 온 것으로 처리 가능. Codex 작업 중 브라우저 계속 사용 → Codex에 다른 브라우저 사용 요청.

> 기능은 터미널 앱·Codex 자체 자동화 불가 — 자동화 시 Codex 보안 정책 우회 가능. 컴퓨터의 administrator 인증·보안·프라이버시 권한 prompt 승인도 불가.

파일 편집·셸 명령은 해당 시 Codex 승인·샌드박스 설정 따름. 데스크톱 앱 통한 변경은 디스크에 저장·프로젝트가 추적할 때까지 리뷰 패널에 안 나타날 수 있음. ChatGPT 데이터 통제가 Codex 통해 처리 콘텐츠 (computer use 스크린샷 포함)에 적용.

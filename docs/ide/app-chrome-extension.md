---
원문: https://developers.openai.com/codex/app/chrome-extension
동기화일: 2026-05-15
---

# Codex Chrome 확장

> Chrome을 Codex와 함께 사용 — 브라우저 권한·웹사이트 승인·browsing 데이터 관리

Codex Chrome 확장으로 Codex가 로그인 브라우저 상태 필요한 브라우저 작업에 Chrome 사용. LinkedIn, Salesforce, Gmail, 내부 도구 같은 사이트 읽기·작업 필요할 때.

로컬 dev 서버, 파일 백엔드 미리보기, 로그인 불필요 공개 페이지는 [in-app 브라우저](app-browser.md) 우선. in-app 브라우저는 Chrome 프로필 사용 없이 미리보기·검증을 Codex 안에 유지.

Codex는 작업이 요구하는 대로 도구 전환 가능 — 전용 통합 가용 시 플러그인, 로그인 브라우저 컨텍스트 필요 시 Chrome, localhost는 in-app 브라우저.

> 페이지 콘텐츠를 untrusted 컨텍스트로 다룰 것 + Codex 진행 허용 전 웹사이트 검토.

## Plugins에서 Chrome 셋업

1. Codex 열고 **Plugins**로
2. **Chrome** 플러그인 추가
3. 셋업 플로 따라 [Codex Chrome 확장](https://chromewebstore.google.com/detail/codex/hehggadaopoacecdllhhajmbjkdcmajg) 설치 + Chrome 권한 prompt 승인
4. Chrome 열고 Codex 확장이 **Connected** 표시 확인

플러그인 셋업 완료 후 새 Codex 스레드 시작. 작업이 로그인 웹사이트 필요할 때 Codex가 Chrome 제안 가능. prompt에서 직접 호출도:

```
@Chrome open Salesforce and update the account from these call notes.
```

Chrome이 안 열려있으면 Codex가 열기 가능. Chrome 브라우저 작업은 Chrome 탭 그룹에서 실행 → 한 스레드 작업이 그룹화 유지.

## 웹사이트 액세스 통제

기본적으로 Codex가 새 웹사이트 상호작용 전 질문. 웹사이트 호스트 (예: `example.com`) 기반 prompt.

Codex가 웹사이트 사용 요청 시 작업·위험 허용도에 맞는 옵션 선택:
- 현재 채팅에 웹사이트 허용
- 호스트 항상 허용 → Codex가 그 웹사이트 다시 묻지 않고 사용
- 웹사이트 거절

### Allowlist와 blocklist 관리

Computer Use 설정에서 도메인 allowlist·blocklist 관리. Allowlist는 다시 묻지 않고 사용할 수 있는 도메인. Blocklist는 사용하지 말아야 할 도메인.

Allowlist에서 도메인 제거 → Codex가 사용 전 다시 질문. Blocklist에서 도메인 제거 → 차단 처리 대신 다시 질문 가능.

#### 항상 브라우저 콘텐츠 허용 [Elevated Risk](https://help.openai.com/articles/20001061)

ON 시 Codex가 웹사이트 사용 전 확인 안 함.

#### 브라우저 히스토리 [Elevated Risk](https://help.openai.com/articles/20001061)

브라우저 히스토리는 민감 텔레메트리, 내부 URL, 검색어, 로그인 디바이스 Chrome 세션 활동 포함 가능. Codex에 브라우저 히스토리 액세스 허용 시 관련 히스토리 항목이 작업 컨텍스트가 될 수 있음. 악성·오해 페이지 콘텐츠가 Codex가 이 데이터를 의도치 않은 곳에 복사할 위험 ↑.

Codex가 브라우저 히스토리 사용 원할 때 질문. 히스토리 액세스를 요청에 스코프 + 항상 허용 옵션 없음.

## 데이터와 보안

### Chrome 확장 권한

Chrome이 확장 설치 시 권한 수용 요청. 권한 prompt 가능 항목:
- 페이지 디버거 액세스
- 모든 웹사이트의 모든 데이터 읽기·변경
- 모든 로그인 디바이스의 browsing 히스토리 읽기·변경
- 알림 표시
- 북마크 읽기·변경
- 다운로드 관리
- 협력 native 애플리케이션과 통신
- 탭 그룹 보기·관리

이 Chrome 권한이 확장에 브라우저 워크플로 운영 능력 부여. Codex는 작업 중 웹사이트·브라우저 히스토리 사용 전 자체 확인·설정·allowlist·blocklist 사용.

### Memories

Browser use는 Codex Memories 설정 따름. Memories ON 시 Codex가 Chrome 작업 중 관련 저장 메모리 사용 가능. OFF 시 browser use는 메모리 사용 안 함.

### OpenAI가 browsing에서 저장하는 것

OpenAI는 확장의 Chrome 액션 별도 완전 레코드 저장 안 함. Codex 컨텍스트 일부가 될 때만 브라우저 활동 저장 — 페이지에서 Codex가 읽은 텍스트, 스크린샷, 도구 호출, 요약, 메시지, 스레드 포함 콘텐츠 등.

ChatGPT·Codex 데이터 통제가 컨텍스트 처리 콘텐츠에 적용. 시크릿·매우 민감 데이터를 브라우저 작업 통해 보내지 않기 — 필수이고 매 prompt 검토 가능할 때만.

## 트러블슈팅

Codex가 Chrome 연결 못 함 → Settings의 blocklist에 액세스 시도 웹사이트 없는지 먼저 확인. 차단 안 됐으면:

1. Chrome 툴바 또는 확장 메뉴에서 Codex 확장 열기 → **Connected** 표시 확인. 미연결 또는 native host 누락 언급 시 Codex의 **Plugins**에서 Chrome 플러그인 제거·재추가 → 셋업 플로 다시.
2. Codex의 **Plugins**에서 Chrome 플러그인 ON 확인. OFF면 ON + 작업 재시도.
3. Codex 확장 설치된 같은 Chrome 프로필 사용 확인. Chrome 프로필 1개 초과 사용 시 활성 프로필에 확장 설치·활성화.
4. 새 Codex 스레드 시작 + Chrome 작업 재시도 → 스레드 특정 연결 상태 clear 가능.
5. Chrome과 Codex 재시작 + 재시도. 여전히 연결 안 되면 Codex Chrome 확장 제거 + **Plugins**에서 Chrome 플러그인 제거·재추가 + 셋업 플로 다시.
6. 확장 **Connected** 표시이지만 Codex가 여전히 Chrome 사용 못 하면 Codex 앱에서 `/feedback` 실행 + 지원 연락 시 스레드 ID 포함.

### 파일 업로드

Chrome 작업이 컴퓨터에서 파일 업로드 필요 → Codex 확장이 Chrome에서 file URL 액세스 허용:

1. Chrome 툴바 확장 아이콘 → **Manage Extensions**
2. Codex 확장 카드 → **Details**
3. **Allow access to file URLs** ON

설정 변경 후 Chrome 작업 재시작.

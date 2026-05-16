---
원문: https://developers.openai.com/codex/app/browser
동기화일: 2026-05-15
---

# In-app 브라우저

> Codex에서 웹 앱 미리보기·코멘트

In-app 브라우저는 사용자와 Codex가 스레드 안에서 렌더된 웹 페이지의 공유 view 사용. 웹 앱 빌드·디버깅 시 페이지 미리보기 + 시각 코멘트 attach.

로컬 dev 서버, 파일 백엔드 미리보기, 로그인 불필요 공개 페이지에 사용. 로그인 상태나 브라우저 확장 의존하는 것은 일반 브라우저나 [Codex Chrome 확장](app-chrome-extension.md).

툴바, URL 클릭, 브라우저 수동 탐색, Cmd+Shift+B (Windows: Ctrl+Shift+B)로 열기.

> in-app 브라우저는 인증 플로, 로그인 페이지, 일반 브라우저 프로필, 쿠키, 확장, 기존 탭 미지원. Codex가 로그인 없이 열 수 있는 페이지에 사용. 페이지 콘텐츠를 untrusted 컨텍스트로 다룰 것 — 시크릿을 브라우저 플로에 paste 금지.

## Browser use

Browser use는 Codex가 in-app 브라우저를 직접 운영. Codex가 클릭·타이핑·렌더 상태 검사·스크린샷·페이지 fix 검증 필요할 때 로컬 dev 서버·파일 백엔드 미리보기에 사용.

사용 — Browser 플러그인 설치·활성화 → 작업에서 Codex에 브라우저 사용 요청 또는 `@Browser` 직접 참조. 앱이 browser use를 in-app 브라우저 안에 유지 + 허용·차단 웹사이트 설정에서 관리.

예:
```
Use the browser to open http://localhost:3000/settings, reproduce the layout
bug, and fix only the overflowing controls.
```

Codex가 allowlist 안 했으면 사용 전 질문. 허용 리스트에서 사이트 제거 → Codex가 사용 전 다시 질문. 차단 리스트에서 사이트 제거 → Codex가 차단 처리 대신 다시 질문 가능.

Chrome의 로그인 웹사이트는 [Codex Chrome 확장](app-chrome-extension.md) 참고.

## 페이지 미리보기

1. [통합 터미널](app-features.md) 또는 [로컬 환경 액션](app-local-environments.md)으로 앱 dev 서버 시작
2. URL 클릭 또는 브라우저 수동 탐색으로 unauthenticated 로컬 라우트, 파일 백엔드 페이지, 공개 페이지 열기
3. 코드 diff와 나란히 렌더 상태 검토
4. 변경 필요한 요소·영역에 브라우저 코멘트
5. Codex에 코멘트 다루기 요청 + 스코프 좁게 유지

예 피드백:
```
I left comments on the pricing page in the in-app browser. Address the mobile
layout issues and keep the card structure unchanged.
```

## 페이지 코멘트

렌더 페이지에서만 보이는 버그는 브라우저 코멘트로 Codex에 정확 피드백.

- 코멘트 모드 ON → 요소·영역 선택 → 코멘트 제출
- 코멘트 모드에서 Shift 누르고 클릭 → 영역 선택
- Cmd 누르고 클릭 → 즉시 코멘트 전송

코멘트 남긴 후 스레드에 다루기 요청 메시지. 코멘트는 Codex가 정확한 시각 변경 필요할 때 가장 유용.

좋은 피드백은 구체적:
```
This button overflows on mobile. Keep the label on one line if it fits,
otherwise wrap it without changing the card height.
```

```
This tooltip covers the data point under the cursor. Reposition the tooltip so
it stays inside the chart bounds.
```

## 브라우저 작업 스코프 유지

In-app 브라우저는 검토·반복용. 각 브라우저 작업을 한 패스 검토 가능할 만큼 작게 유지.

- 페이지·라우트·로컬 URL 이름 짓기
- 중요한 시각 상태 (loading, empty, error, success) 이름 짓기
- 변경 필요한 정확한 요소·영역에 코멘트
- Codex가 코드 변경 후 갱신된 라우트 검토
- 브라우저 사용 전 Codex에 dev 서버 시작·체크 요청

리포 변경 검사·코멘트는 [리뷰 패널](app-review.md).

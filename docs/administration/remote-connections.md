---
원문: https://developers.openai.com/codex/remote-connections
동기화일: 2026-05-15
---

# 원격 연결 (Remote connections)

> 폰·다른 디바이스를 Codex 호스트에 연결, SSH 통한 원격 머신 프로젝트 사용

원격 연결로 Codex 실행 머신에서 떨어져 있을 때, 또는 프로젝트가 다른 머신에 있을 때 Codex 사용. ChatGPT 모바일 앱을 Codex 앱 호스트에 연결, 다른 디바이스에서 작업 픽업, SSH 호스트에서 동작하도록 Codex 구성.

원격 액세스는 연결 호스트의 프로젝트, 스레드, 파일, 자격증명, 권한, 플러그인, Computer Use, 브라우저 셋업, 로컬 도구 사용.

## 원격으로 할 수 있는 것

- 호스트 프로젝트에서 새 스레드 시작 또는 기존 계속
- 후속 instructions 전송, 질문 답변, 활성 작업 조정
- 명령·다른 액션 승인
- 출력, diff, 테스트 결과, 터미널 출력, 스크린샷 검토
- Codex가 작업 완료·관심 필요 시 알림
- 연결 호스트·스레드 사이 전환

다음 섹션은 ChatGPT 모바일 앱으로 Codex 앱 호스트 통제. SSH 호스트 프로젝트에 Codex 연결: [SSH 호스트 연결](#ssh-호스트-연결).

## 모바일 액세스 셋업 전

준비:
- 사용할 ChatGPT 계정·워크스페이스의 Codex 액세스
- iOS·Android 디바이스의 최신 ChatGPT 모바일 앱. 앱에 Codex 안 보이면 ChatGPT 먼저 갱신.
- 같은 계정·워크스페이스에 로그인된 Codex 앱 실행 중인 깨어있는·온라인 Mac 호스트. 모바일 셋업·디바이스 통제는 현재 호스트에 macOS용 Codex 앱 필요. CLI·IDE 확장에서 셋업 플로 미가용.
- 그 계정·워크스페이스에 필요한 MFA, SSO, passkey 구성

ChatGPT 워크스페이스 통한 Codex 사용 시 admin이 폰에서 연결 전 Remote Control 액세스 활성화 필요할 수 있음.

## 모바일 액세스 셋업

연결할 호스트의 Codex 앱에서 시작. 셋업 플로가 그 호스트에 원격 액세스 활성화 → 폰에서 스캔 가능한 QR 코드 표시.

1. **Codex mobile setup 시작**: 호스트에서 Codex 열고 사이드바에서 **Set up Codex mobile** 선택
2. **QR 코드 스캔**: 폰으로 Codex가 보이는 QR 코드 스캔. 코드가 ChatGPT 열어 모바일 앱과 호스트 연결 마무리.
3. **ChatGPT에서 셋업 마무리**: ChatGPT가 Codex 모바일 셋업 플로 열기. 같은 ChatGPT 계정·워크스페이스 확인 → 필요한 MFA, SSO, passkey 단계 완료. 셋업 성공 후 호스트가 폰의 Codex에 표시.
4. **호스트 설정 검토**: 호스트의 Codex에서 **Settings → Connections**로 연결 디바이스 관리. 컴퓨터 깨움 유지, Computer Use 활성화, Chrome 확장 설치도 선택.

## 연결할 것 선택

이미 Codex 사용 중인 Mac 노트북·데스크톱부터 시작. 지속 액세스 또는 다른 환경 필요 시 always-on Mac 또는 SSH 호스트 추가.

### Mac 노트북·데스크톱

매일 Codex 실행하는 Mac 연결. 이미 사용하는 같은 프로젝트, 스레드, 자격증명, 플러그인, 로컬 셋업에 원격 액세스.

Mac이 sleep, 네트워크 액세스 잃기, Codex 닫힘 시 다시 가용까지 원격 액세스 멈춤. 이 컴퓨터를 호스트 디바이스로 사용 시 plugged in 유지 + 호스트 연결 설정의 **Keep this Mac awake** ON.

### 전용 always-on Mac

장시간 작업에 Codex가 도달 가능 유지 → 전용 always-on Mac.

Codex가 사용해야 할 프로젝트, 자격증명, 플러그인, MCP 서버, 도구를 그 머신에 설치.

### 원격 개발 환경

프로젝트가 이미 원격 환경에 → SSH 호스트 또는 관리 devbox. Codex 앱 호스트를 그 환경에 먼저 연결. 폰은 여전히 Codex 앱 호스트에 연결, Codex가 의존성·보안 정책·컴퓨트 리소스가 있는 원격 환경에서 동작.

→ SSH 셋업 디테일: [SSH 호스트 연결](#ssh-호스트-연결)

## 연결 호스트에서 오는 것

폰은 prompt, 승인, 후속 메시지를 Codex에 전송. 연결 호스트가 Codex 사용 환경 제공.

- 리포 파일·로컬 문서는 연결 호스트에서
- 셸 명령은 그 호스트·원격 환경에서 실행
- 그 호스트에 설치된 플러그인은 원격 Codex 사용 시 가용
- MCP 서버, 스킬, 브라우저 액세스, Computer Use는 그 호스트 설정에서
- 로그인 웹사이트·데스크톱 앱은 호스트가 액세스 가능할 때만
- 샌드박싱, 보안 통제, 액션 승인은 연결 세션에 여전히 적용

Codex는 신뢰 머신을 권한 ChatGPT 디바이스 간 도달 가능 유지하는 보안 relay 레이어 사용 → 공개 인터넷에 직접 노출 없이.

## 다른 디바이스에서 작업 픽업

Codex 앱 호스트 1개를 다른 호스트에 연결도. 예 — 노트북 미가용 시 always-on 호스트의 폰에서 스레드 시작 → 나중에 노트북에서 Codex 열고 거기서 그 스레드 계속.

노트북의 Codex에서 **Settings → Connections → Control other devices**로 다른 호스트 추가. 디바이스가 동시에 원격 액세스 허용 + 다른 디바이스 통제 가능.

## SSH 호스트 연결

Codex 앱에서 SSH 호스트의 원격 프로젝트 추가 + 원격 파일시스템·셸에 대해 스레드 실행. 원격 프로젝트 스레드가 원격 호스트에서 명령 실행, 파일 읽기, 변경 작성.

> 원격 호스트를 일반 SSH 액세스와 같은 보안 기대치로 구성 유지 — 신뢰 키, 최소 권한 계정, 인증 안 한 공개 listener 없음.

1. SSH config에 호스트 추가 → Codex 자동 발견:
   ```
   Host devbox
       HostName devbox.example.com
       User you
       IdentityFile ~/.ssh/id_ed25519
   ```
   Codex가 `~/.ssh/config`에서 구체 호스트 alias 읽기 + OpenSSH로 resolve + 패턴 전용 호스트 무시.

2. Codex 앱 실행 머신에서 호스트 SSH 가능 확인:
   ```bash
   ssh devbox
   ```

3. 원격 호스트에 Codex 설치·인증. 앱이 SSH 통해 원격 Codex 앱 서버 시작 (원격 사용자 로그인 셸 사용). `codex` 명령이 그 셸의 원격 호스트 `PATH`에 가용해야.

4. Codex 앱에서 **Settings → Connections** → SSH 호스트 추가·활성화 → 원격 프로젝트 폴더 선택.

## 인증과 네트워크 노출

> 로컬 호스트 WebSocket listener와 함께 SSH 포트 forwarding 사용. 공유·공개 네트워크에 인증 안 한 app-server listener 노출 금지.

현재 네트워크 외부 원격 머신 도달 필요 → app server를 인터넷에 직접 노출 대신 VPN 또는 Tailscale 같은 mesh 네트워킹 도구 사용.

## 트러블슈팅

### 폰에 호스트 안 보임

호스트에 Codex 앱 실행 중, **Allow other devices to connect** 활성화, 두 디바이스에 같은 ChatGPT 계정·워크스페이스 선택 확인.

### 승인 요청 안 나타남

ChatGPT 모바일 앱 열고 Codex로. 폰·호스트가 같은 ChatGPT 계정·워크스페이스 사용 확인 → QR 코드 다시 스캔 또는 호스트에서 셋업 재시작. ChatGPT 워크스페이스 사용 시 admin에게 Remote Control 액세스 활성화 확인 요청.

### 원격 세션 끊김

호스트가 sleep, 네트워크 액세스 잃음, Codex 닫힘 체크. Codex 작업 동안 호스트 깨움·연결 유지.

### 인증이 셋업 차단

셋업 중 표시된 계정·워크스페이스 인증 prompt 완료. 조직이 SSO, MFA, passkey 요구 시 그 플로 마무리 후 재시도. 셋업 여전히 실패 시 워크스페이스 admin에게 Remote Control 액세스 활성화 확인 요청.

## 참고

- [Codex 앱](../ide/app-overview.md)
- [Codex 앱 기능](../ide/app-features.md)
- [Codex 앱 설정](../ide/app-settings.md)
- [Computer Use](../ide/app-computer-use.md)
- [Chrome 확장](../ide/app-chrome-extension.md)
- [커맨드라인 옵션](../cli/reference.md)
- [Authentication](auth.md)

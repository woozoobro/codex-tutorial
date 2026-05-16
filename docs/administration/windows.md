---
원문: https://developers.openai.com/codex/windows
동기화일: 2026-05-15
---

# Windows

> Windows에서 Codex 실행 팁

Windows에서 네이티브 [Codex 앱](../ide/app-windows.md), [CLI](../cli/overview.md), [IDE 확장](../ide/overview.md)으로 Codex 사용.

Windows 앱은 코어 워크플로 (병렬 에이전트 스레드, worktree, 자동화, Git 기능, in-app 브라우저, artifact 미리보기, 플러그인, 스킬) 지원.

플랫폼·셋업에 따라 Codex가 Windows에서 3가지 실용 방식 실행:
- 더 강한 `elevated` 샌드박스로 Windows 네이티브
- fallback `unelevated` 샌드박스로 Windows 네이티브
- [Windows Subsystem for Linux 2 (WSL2)](https://learn.microsoft.com/en-us/windows/wsl/install) 안 — Linux 샌드박스 구현 사용

## Windows 샌드박스

Codex를 Windows에서 네이티브 실행 시 에이전트 모드가 Windows 샌드박스 사용 → 작업 폴더 외부 파일시스템 쓰기 차단 + 명시 승인 없이 네트워크 액세스 방지.

네이티브 Windows 샌드박스 두 모드 (`config.toml`에서 구성):
```toml
[windows]
sandbox = "elevated"  # 또는 "unelevated"
```

`elevated` — 선호 네이티브 Windows 샌드박스. 전용 저권한 샌드박스 사용자, 파일시스템 권한 경계, firewall 룰, 샌드박스 실행 명령에 필요한 로컬 정책 변경 사용.

`unelevated` — fallback 네이티브 Windows 샌드박스. 현재 사용자에서 파생된 제한 Windows 토큰으로 명령 실행, ACL 기반 파일시스템 경계 적용, 전용 offline-user firewall 룰 대신 환경 레벨 offline 통제 사용. `elevated`보다 약함, 그러나 administrator 승인 셋업이 로컬·엔터프라이즈 정책으로 차단될 때 유용.

> 둘 다 가용 시 `elevated` 사용. 환경에서 기본 네이티브 샌드박스 동작 안 하면 셋업 트러블슈팅 동안 `unelevated` fallback.

기본적으로 두 샌드박스 모드 모두 더 강한 UI 격리 위해 private desktop 사용. 호환성 위해 더 오래된 `Winsta0\\Default` 동작 필요할 때만 `windows.sandbox_private_desktop = false`.

### 샌드박스 권한

> Codex를 풀 액세스 모드로 실행하면 프로젝트 디렉터리 제한 없음 + 데이터 손실 destructive 액션 의도치 않게 가능. 더 안전한 자동화 → 샌드박스 경계 유지 + [rules](../configuration/rules.md)로 특정 예외 또는 [승인 정책 never](agent-approvals-security.md)로 [승인·보안 셋업](agent-approvals-security.md) 기반 escalated 권한 묻지 않고 Codex가 문제 해결 시도하게.

### Windows 버전 매트릭스

| Windows 버전 | 지원 레벨 | 메모 |
| --- | --- | --- |
| Windows 11 | 권장 | Windows의 Codex 최선 baseline. 엔터프라이즈 배포 표준화에 사용. |
| 최근, 완전 갱신 Windows 10 | best effort | 동작 가능, Windows 11보다 덜 안정적. ConPTY 포함 모던 콘솔 지원 의존. 실무에서 Windows 10 버전 1809 이상 필요. |
| 더 오래된 Windows 10 빌드 | 권장 안 함 | ConPTY 같은 필수 콘솔 컴포넌트 누락 가능성 ↑ + 엔터프라이즈 셋업에서 실패 가능성 ↑ |

추가 환경 가정:
- `winget` 가용해야. 누락 시 Windows 갱신 또는 Codex 셋업 전 Windows Package Manager 설치.
- 권장 네이티브 샌드박스는 administrator 승인 셋업에 의존.
- 일부 엔터프라이즈 관리 디바이스는 OS 버전이 수용 가능해도 필수 셋업 단계 차단.

### 샌드박스 읽기 액세스 부여

Windows 샌드박스가 디렉터리 읽기 못 해 명령 실패 시:
```
/sandbox-add-read-dir C:\absolute\directory\path
```

경로는 존재하는 절대 디렉터리. 명령 성공 후 현재 세션의 샌드박스 실행 명령이 그 디렉터리 읽기 가능.

> 네이티브 Windows 샌드박스 기본 사용. 같은 보안 유지하며 최선 성능·최고 속도 제공. WSL2는 Windows에서 Linux 네이티브 환경 필요할 때, 워크플로가 이미 WSL2에 있을 때, 또는 두 네이티브 샌드박스 모드 어느 것도 요구 충족 안 할 때.

## Windows Subsystem for Linux

WSL2 선택 시 Codex가 네이티브 Windows 샌드박스 대신 Linux 환경 안에서 실행. Windows에서 Linux 네이티브 도구 필요, 리포·개발 워크플로가 이미 WSL2에 있음, 또는 어느 네이티브 Windows 샌드박스 모드도 환경에 동작 안 할 때 유용.

> WSL1은 Codex `0.114`까지 지원. `0.115`부터 Linux 샌드박스가 `bubblewrap`으로 이동 → WSL1 미지원.

### WSL 안에서 VS Code launch

→ 단계별: [공식 VS Code WSL 튜토리얼](https://code.visualstudio.com/docs/remote/wsl-tutorial)

#### 전제조건

- WSL 설치된 Windows. 설치: PowerShell을 administrator로 열고 `wsl --install` (Ubuntu 흔함)
- [WSL 확장](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) 설치된 VS Code

#### WSL 터미널에서 VS Code 열기

```bash
# WSL 셸에서
cd ~/code/your-project
code .
```

WSL 원격 윈도우 열림 + 필요 시 VS Code Server 설치 + 통합 터미널이 Linux에서 실행.

#### WSL 연결 확인

- 녹색 상태바에 `WSL: <distro>` 표시 확인
- 통합 터미널이 `C:\` 대신 Linux 경로 (`/home/...`) 표시
- 검증:
  ```bash
  echo $WSL_DISTRO_NAME
  ```

상태바에 "WSL: ..." 안 보이면 `Ctrl+Shift+P` → `WSL: Reopen Folder in WSL` → 최선 성능 위해 리포를 `/home/...` 아래 유지 (`C:\` 아님).

Windows 앱·프로젝트 picker가 WSL 리포 안 보이면 file picker나 Explorer에 `\\wsl$` 입력 → distro의 home 디렉터리 탐색.

### WSL과 함께 CLI 사용

elevated PowerShell·Windows Terminal에서:
```powershell
# 기본 Linux 배포판 (Ubuntu 등) 설치
wsl --install

# WSL 안 셸 시작
wsl
```

WSL 셸에서:
```bash
# https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl
# WSL에 Node.js 설치 (nvm 통해)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash

# 새 탭이나 exit + `wsl` 다시 실행 후 Node.js 설치
nvm install 22

# WSL에 Codex 설치·실행
npm i -g @openai/codex
codex
```

### WSL 안에서 코드 작업

- `/mnt/c/...` 같은 Windows 마운트 경로 작업은 Windows 네이티브 경로보다 느릴 수 있음. 더 빠른 I/O + 적은 symlink·권한 이슈 위해 리포를 Linux 홈 디렉터리 (`~/code/my-app`) 아래 유지:
  ```bash
  mkdir -p ~/code && cd ~/code
  git clone https://github.com/your/repo.git
  cd repo
  ```
- 파일에 Windows 액세스 필요 → Explorer의 `\\wsl$\Ubuntu\home\<user>` 아래.

## 트러블슈팅·FAQ

> 관리 Windows 머신 트러블슈팅 시 네이티브 샌드박스 모드, Windows 버전, Codex가 보이는 정책 에러부터 시작. 대부분 네이티브 Windows 지원 이슈는 에디터 자체보다 샌드박스 셋업, logon 권한, 파일시스템 권한에서.

### 네이티브 샌드박스 셋업 실패

`elevated` 샌드박스 셋업 완료 못 하는 가장 흔한 원인:
- Windows UAC·administrator prompt 거부
- 머신이 로컬 사용자·그룹 생성 허용 안 함
- 머신이 firewall 룰 변경 허용 안 함
- 머신이 샌드박스 사용자에 필요한 logon 권한 차단
- 또는 다른 엔터프라이즈 정책이 셋업 플로 일부 차단

시도:
1. `elevated` 샌드박스 셋업 재시도 + 환경 허용 시 administrator prompt 승인
2. 회사 노트북이 차단 → IT 팀에게 머신이 로컬 사용자/그룹 생성, firewall 구성, 필수 샌드박스 사용자 logon 권한에 대한 administrator 승인 셋업 허용 여부 문의
3. 기본 셋업 여전히 실패 → 이슈 조사 동안 `unelevated` 샌드박스로 작업 계속

### Codex가 unelevated 샌드박스로 전환

Codex가 머신에서 더 강한 `elevated` 샌드박스 셋업 마무리 못 함을 의미.

- Codex가 여전히 sandboxed 모드 실행 가능
- ACL 기반 파일시스템 경계 적용, `elevated`의 별도 샌드박스 사용자 경계 사용 안 함 + 더 약한 네트워크 격리
- 유용한 fallback, 선호 장기 엔터프라이즈 구성 아님

관리 엔터프라이즈 노트북이면 IT 팀 도움으로 `elevated` 샌드박스 동작시키기가 보통 최선 장기 fix.

### Windows 에러 1385

Sandboxed 명령이 `1385` 에러로 실패 시 Windows가 샌드박스 사용자가 명령 시작에 필요한 logon 타입 거부.

실무에서 보통 Codex가 샌드박스 사용자 성공 생성, Windows 정책이 그 사용자가 sandboxed 명령 launch 못 하게 막음을 의미.

해결:
1. IT 팀에게 디바이스 정책이 Codex 생성 샌드박스 사용자에 필수 logon 권한 부여 여부 문의
2. 일부 머신·팀에만 영향 시 그룹 정책·OU 차이 비교
3. 즉시 작업 계속 필요 → 정책 이슈 조사 동안 `unelevated` 샌드박스
4. `CODEX_HOME/.sandbox/sandbox.log` + Windows 버전 + 짧은 실패 설명 전송

### Codex가 일부 폴더가 Everyone에게 쓰기 가능 경고

> Codex가 일부 폴더에 `Everyone` 쓰기 액세스 경고 표시 가능 → 그 폴더의 Windows 권한이 샌드박스가 완전 보호하기엔 너무 광범위.

해결:
1. 경고에 Codex가 나열한 폴더 검토
2. 환경에 적절하면 그 폴더에서 `Everyone` 쓰기 액세스 제거
3. 권한 수정 후 Codex 재시작 또는 샌드박스 셋업 재실행

권한 변경 방법 모르면 IT 팀에 도움 요청.

### Sandboxed 명령이 네트워크 도달 못 함

일부 Codex 작업은 사용 권한 모드에 따라 의도적으로 outbound 네트워크 액세스 없이 실행.

작업이 네트워크 도달 못 해 실패:
1. 작업이 네트워크 비활성화로 실행 의도였는지 체크
2. 네트워크 액세스 기대했으면 Codex 재시작·재시도
3. 계속 발생 → 머신이 부분·깨진 샌드박스 상태인지 팀이 체크할 수 있게 샌드박스 로그 수집

### 샌드박싱 이전 동작했는데 이제 멈춤

다음 후 발생 가능:
- 리포·워크스페이스 이동
- 머신 권한 변경
- Windows 정책 변경
- 다른 시스템 구성 변경

시도:
1. Codex 재시작
2. `elevated` 샌드박스 셋업 재시도
3. 안 되면 `unelevated` 샌드박스 임시 fallback
4. 검토 위해 샌드박스 로그 수집

### OpenAI에 진단 전송

여전히 문제 있으면 전송:
- `CODEX_HOME/.sandbox/sandbox.log`

도움 되는 추가 포함:
- 시도하던 것 짧은 설명
- `elevated` 샌드박스 실패였는지 `unelevated` 샌드박스 사용이었는지
- 앱에 보인 에러 메시지
- `1385` 또는 다른 Windows·PowerShell 에러 봤는지
- Windows 11인지 Windows 10인지

> 전송 금지: `CODEX_HOME/.sandbox-secrets/` 내용

### IDE 확장 설치됐지만 unresponsive

시스템에 일부 native 의존성에 필요한 C++ 개발 도구 누락 가능:
- Visual Studio Build Tools (C++ workload)
- Microsoft Visual C++ Redistributable (x64)
- `winget`로: `winget install --id Microsoft.VisualStudio.2022.BuildTools -e`

설치 후 VS Code 완전 재시작.

### WSL에서 큰 리포가 느림

- `/mnt/c` 아래 작업 안 하는지 확인. 리포를 WSL로 이동 (예: `~/code/...`)
- 필요 시 WSL에 메모리·CPU 늘리기 + WSL 최신 갱신:
  ```powershell
  wsl --update
  wsl --shutdown
  ```

### WSL의 VS Code가 codex 못 찾음

WSL 안 PATH의 바이너리 존재 검증:
```bash
which codex || echo "codex not found"
```

바이너리 없으면 [위 instructions](#wsl과-함께-cli-사용) 따라 설치.

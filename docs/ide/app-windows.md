---
원문: https://developers.openai.com/codex/app/windows
동기화일: 2026-05-15
---

# Windows에서 Codex 앱

> 네이티브 샌드박스와 PowerShell 지원으로 Windows에서 Codex 앱

[Windows용 Codex 앱](https://get.microsoft.com/installer/download/9PLM9XGG6VKS?cid=website_cta_psi)은 프로젝트 간 작업, 병렬 에이전트 스레드 실행, 결과 검토를 위한 단일 인터페이스. Windows 앱은 worktree, automations, Git 기능, in-app 브라우저, artifact 미리보기, plugins, skills 같은 코어 워크플로 지원. PowerShell + [Windows 샌드박스](../administration/windows.md)로 네이티브 실행, 또는 [WSL2](#wsl-windows-subsystem-for-linux) 실행 구성 가능.

## 다운로드·갱신

[Microsoft Store](https://get.microsoft.com/installer/download/9PLM9XGG6VKS?cid=website_cta_psi)에서 다운로드.

[퀵스타트](../getting-started/quickstart.md) 따라 시작.

갱신: Microsoft Store → **Downloads** → **Check for updates**.

엔터프라이즈는 Microsoft Store 앱 배포로 admin이 엔터프라이즈 관리 도구로 배포 가능.

명령줄 설치 (Microsoft Store UI 대안):
```powershell
winget install Codex -s msstore
```

## 네이티브 샌드박스

Windows의 Codex 앱은 PowerShell에서 에이전트 실행 시 네이티브 [Windows 샌드박스](../administration/windows.md), [WSL2](#wsl-windows-subsystem-for-linux)에서 에이전트 실행 시 Linux 샌드박싱 지원. 두 모드에서 샌드박스 보호 적용 → Codex에 메시지 전 Composer에서 샌드박스 권한을 **Default permissions**로 설정.

> Codex를 풀 액세스 모드로 실행하면 프로젝트 디렉터리 제한 없음 + 데이터 손실 destructive 액션 의도치 않게 가능. 샌드박스 경계 유지 + [rules](../configuration/rules.md)로 타겟 예외 또는 [승인 정책 never](../administration/agent-approvals-security.md)로 [승인·보안 셋업](../administration/agent-approvals-security.md) 기반 escalated 권한 묻지 않고 Codex가 문제 해결 시도하게.

## 개발 셋업 커스터마이즈

### 선호 에디터

**Open**용 기본 앱 선택 (Visual Studio, VS Code, 다른 에디터). 프로젝트별 오버라이드 가능. 프로젝트의 **Open** 메뉴에서 다른 앱 선택했으면 그 프로젝트 특정 선택 우선.

### 통합 터미널

기본 통합 터미널 선택. 설치된 것에 따라:
- PowerShell
- Command Prompt
- Git Bash
- WSL

새 터미널 세션에만 적용. 통합 터미널 이미 열려 있으면 새 기본 터미널 표시 기대 전 앱 재시작 또는 새 스레드 시작.

## WSL (Windows Subsystem for Linux)

기본적으로 Codex 앱은 Windows 네이티브 에이전트 사용 → 에이전트가 PowerShell에서 명령 실행. WSL2의 프로젝트는 필요 시 `wsl` CLI 사용으로 작동.

WSL 파일시스템 프로젝트 추가 → **Add new project** 또는 Ctrl+O → File Explorer 윈도우에 `\\wsl$\` 입력 → Linux 배포판 + 열 폴더 선택.

Windows 네이티브 에이전트 계속 사용 계획이면 프로젝트를 Windows 파일시스템에 저장 + WSL에서 `/mnt/<drive>/...`로 액세스 우선. WSL 파일시스템에서 프로젝트 직접 열기보다 안정적.

에이전트 자체를 WSL2에서 실행 원함 → **[Settings](codex://settings)** → 에이전트를 Windows native에서 WSL로 전환 + **앱 재시작**. 재시작 전 변경 적용 안 됨. 재시작 후에도 프로젝트 제자리.

> WSL1은 Codex `0.114`까지 지원. `0.115`부터 Linux 샌드박스가 `bubblewrap`으로 이동 → WSL1 더 이상 미지원.

통합 터미널은 에이전트와 별도 구성. 워크플로에 따라 에이전트는 WSL에 두고 터미널은 PowerShell 유지, 또는 둘 다 WSL.

## 유용한 개발 도구

흔한 개발 도구가 이미 설치돼 있을 때 Codex가 가장 잘 동작:
- **Git**: 앱의 리뷰 패널 구동 + 변경 검사·revert
- **Node.js**: 에이전트가 효율 작업에 사용하는 흔한 도구
- **Python**: 에이전트가 효율 작업에 사용
- **.NET SDK**: 네이티브 Windows 앱 빌드에 유용
- **GitHub CLI**: 앱의 GitHub 특화 기능 구동

기본 Windows 패키지 매니저 `winget`으로 [통합 터미널](app-features.md)에 paste 또는 Codex에 설치 요청:

```powershell
winget install --id Git.Git
winget install --id OpenJS.NodeJS.LTS
winget install --id Python.Python.3.14
winget install --id Microsoft.DotNet.SDK.10
winget install --id GitHub.cli
```

GitHub CLI 설치 후 `gh auth login` → 앱의 GitHub 기능 활성화.

다른 Python·.NET 버전 필요 → 패키지 ID를 원하는 버전으로 변경.

## 트러블슈팅·FAQ

### elevated 권한으로 명령 실행

Codex가 elevated 권한 명령 실행 필요 → Codex 앱 자체를 administrator로 시작. 설치 후 시작 메뉴 → Codex 찾기 → Run as administrator. Codex 에이전트가 그 권한 레벨 상속.

### PowerShell execution policy 명령 차단

PowerShell에서 Node.js·`npm` 같은 도구 사용 적 없으면 Codex 에이전트나 통합 터미널이 execution policy 에러 hit 가능.

Codex가 PowerShell 스크립트 생성한 경우도. 그때 PowerShell이 실행하기 전 덜 제한적 execution policy 필요.

에러 예:
```
npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

흔한 fix — execution policy를 `RemoteSigned`로:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```

디테일·다른 옵션: 정책 변경 전 Microsoft [execution policy 가이드](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies) 확인.

### Windows의 로컬 환경 스크립트

[로컬 환경](app-local-environments.md)이 `npm` 스크립트 같은 cross-platform 명령 사용 → 모든 플랫폼에 한 공유 셋업 스크립트·액션 셋 유지 가능.

Windows 특화 동작 필요 → Windows 특화 셋업 스크립트·액션 생성.

액션은 통합 터미널 사용 환경에서 실행.

로컬 셋업 스크립트는 에이전트 환경에서 실행 — WSL이면 WSL, 아니면 PowerShell.

### WSL과 config·auth·세션 공유

Windows 앱은 Windows의 네이티브 Codex와 같은 Codex 홈 디렉터리: `%USERPROFILE%\.codex`.

WSL 안 Codex CLI도 실행 시 CLI는 기본적으로 Linux 홈 디렉터리 사용 → Windows 앱과 설정·캐시 auth·세션 히스토리 자동 공유 안 함.

공유 방법:
- WSL `~/.codex`를 파일시스템의 `%USERPROFILE%\.codex`와 sync
- WSL을 Windows Codex 홈 디렉터리에 가리키기 — `CODEX_HOME` 설정:
  ```bash
  export CODEX_HOME=/mnt/c/Users/<your-username>/.codex
  ```

모든 셸에 그 설정 원하면 WSL 셸 프로필 (`~/.bashrc`, `~/.zshrc`)에 추가.

### Git 기능 미가용

Windows에 Git 네이티브 설치 안 됐으면 앱이 일부 기능 사용 못 함. PowerShell·`cmd.exe`에서 `winget install Git.Git`로 설치.

### `\\wsl$`에서 연 프로젝트의 Git 미감지

지금은 Windows 네이티브 에이전트 + WSL에서도 액세스 가능 프로젝트 사용 시 가장 안정적 workaround: 프로젝트를 네이티브 Windows 드라이브에 저장 + WSL에서 `/mnt/<drive>/...`로 액세스.

### `Cmder`가 open 다이얼로그에 없음

`Cmder` 설치됐지만 Codex open 다이얼로그에 안 보임 → Windows 시작 메뉴에 추가 — `Cmder` 우클릭 → **Add to Start** → Codex 재시작·재부팅.

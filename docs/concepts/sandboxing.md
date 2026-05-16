---
원문: https://developers.openai.com/codex/concepts/sandboxing
동기화일: 2026-05-15
---

# 샌드박스 (Sandbox)

> Codex가 앱·IDE·CLI에서 샌드박스를 사용하는 방식

샌드박스는 Codex가 머신에 무제한 접근하지 않고 자율 행동할 수 있게 하는 경계. **Codex 앱**, **IDE 확장**, **CLI**에서 로컬 명령 실행 시, 그 명령은 기본 풀 액세스 대신 제약 환경 안에서 실행.

그 환경은 Codex가 자체적으로 할 수 있는 것 정의 — 어느 파일을 수정 가능, 명령이 네트워크 사용 가능 여부 등. 작업이 그 경계 안에 머물면 Codex는 확인 없이 계속 진행. 넘어야 하면 승인 플로로 fallback.

샌드박싱과 승인은 함께 동작하는 **다른 통제**. 샌드박스는 기술적 경계 정의, 승인 정책은 Codex가 그 경계를 넘기 전 멈춰 물어야 할 시점 결정.

## 샌드박스가 하는 일

샌드박스는 Codex의 빌트인 파일 작업뿐 아니라 spawn된 명령에도 적용. Codex가 `git`, 패키지 매니저, 테스트 러너 같은 도구 실행 시 그 명령들은 같은 샌드박스 경계 상속.

Codex는 각 OS에서 플랫폼 네이티브 enforcement 사용. macOS, Linux, WSL2, 네이티브 Windows 구현은 다르지만 아이디어는 같음 — 에이전트에게 경계 있는 작업 공간 부여 → 일상 작업이 명확한 한도 안에서 자율 실행 가능.

## 왜 중요한가

샌드박스는 승인 피로 ↓. 모든 저위험 명령 확인 요청 대신, Codex가 이미 승인한 경계 안에서 파일 읽기·편집·일상 프로젝트 명령 실행 가능.

agentic 작업의 더 명확한 trust 모델 제공. 에이전트의 의도만 신뢰하는 게 아니라 **에이전트가 강제된 한도 안에서 동작함을 신뢰**. → Codex가 독립적으로 일하게 두면서도 언제 멈추고 도움 요청할지 알게 됨.

## 시작하기

기본 권한 모드 사용 시 Codex가 자동 샌드박싱 적용.

### 전제조건

- **macOS**: 빌트인 Seatbelt 프레임워크로 out of the box 동작
- **Windows**: PowerShell 실행 시 네이티브 [Windows 샌드박스](../administration/windows.md), WSL2 실행 시 Linux 샌드박스 구현 사용
- **Linux / WSL2**: 패키지 매니저로 `bubblewrap` 먼저 설치

```bash
# Ubuntu/Debian
sudo apt install bubblewrap

# Fedora
sudo dnf install bubblewrap
```

Codex는 `PATH`에서 처음 찾은 `bwrap` 실행파일 사용. 없으면 번들 헬퍼로 fallback, 단 그 헬퍼는 unprivileged user namespace 생성 지원 필요. 배포판이 제공하는 `bwrap` 패키지 설치가 셋업 안정성에 좋음.

`bwrap` 누락 또는 헬퍼가 필요한 user namespace 생성 못 할 때 시작 경고. 이 AppArmor 설정 제한하는 배포판에서는 글로벌 비활성화 대신 `bwrap` AppArmor 프로파일 로드 우선.

**Ubuntu AppArmor 메모**: Ubuntu 25.04에서 Ubuntu 패키지 리포에서 `bubblewrap` 설치는 추가 AppArmor 셋업 없이 작동. `bwrap-userns-restrict` 프로파일이 `apparmor` 패키지에 `/etc/apparmor.d/bwrap-userns-restrict`로 ship.

Ubuntu 24.04는 `bubblewrap` 설치 후에도 user namespace 생성 못 한다고 경고할 수 있음. 추가 프로파일 복사·로드:

```bash
sudo apt update
sudo apt install apparmor-profiles apparmor-utils
sudo install -m 0644 \
  /usr/share/apparmor/extra-profiles/bwrap-userns-restrict \
  /etc/apparmor.d/bwrap-userns-restrict
sudo apparmor_parser -r /etc/apparmor.d/bwrap-userns-restrict
```

`apparmor_parser -r`는 재부팅 없이 커널에 프로파일 로드. 모든 AppArmor 프로파일 reload:
```bash
sudo systemctl reload apparmor.service
```

프로파일이 가용하지 않거나 이슈 해결 못 하면 AppArmor unprivileged user namespace 제한 비활성화:
```bash
sudo sysctl -w kernel.apparmor_restrict_unprivileged_userns=0
```

## 통제 방법

대부분 제품의 권한 컨트롤로 시작.

Codex 앱과 IDE에서 composer/chat 입력 아래 권한 selector로 모드 선택. Codex의 기본 권한, 풀 액세스, 또는 커스텀 설정 사용 가능.

### 기본 권한

Codex가 현재 워크스페이스의 파일 읽기·편집 + 일상 로컬 명령 실행. 인터넷 사용 또는 워크스페이스 경계 초과 전 묻기.

| 항목 | 값 |
| --- | --- |
| Sandbox | `workspace-write` |
| Approvals policy | `on-request` |
| Reviewer | `user` |

CLI에서는 [`/permissions`](../cli/slash-commands.md)로 세션 중 모드 전환.

## 기본값 설정

매번 같은 동작으로 시작하길 원하면 커스텀 설정. Codex는 그 기본값을 `config.toml` (로컬 설정 파일)에 저장. → [Config basics](../configuration/config-basic.md), [Configuration reference](../configuration/config-reference.md)에 `sandbox_mode`, `approval_policy`, `approvals_reviewer`, `sandbox_workspace_write.writable_roots` 정확한 키 문서화.

### 흔한 샌드박스 모드

- `read-only`: Codex 파일 검사 가능, 승인 없이 편집·명령 실행 불가
- `workspace-write`: Codex 파일 읽기 + 워크스페이스 안 편집 + 그 경계 안 일상 로컬 명령 실행. **로컬 작업의 기본 저마찰 모드.**
- `danger-full-access`: Codex가 샌드박스 제약 없이 실행. 파일시스템·네트워크 경계 제거. **Codex가 풀 액세스로 행동하길 원할 때만 사용.**

### 흔한 승인 정책

- `untrusted`: trusted 셋에 없는 명령 실행 전 묻기
- `on-request`: 기본은 샌드박스 안에서 작업, 그 경계 넘어야 할 때 묻기
- `never`: 승인 prompt에 멈추지 않음

승인이 인터랙티브일 때 `approvals_reviewer`로 누가 검토할지 선택:
- `user`: 승인 prompt 사용자에게 표시 (기본)
- `auto_review`: 자격 승인 prompt가 reviewer 에이전트로 (→ [Auto-review](auto-review.md))

**풀 액세스** = `sandbox_mode = "danger-full-access"` + `approval_policy = "never"`.
**저위험 로컬 자동화 프리셋** = `sandbox_mode = "workspace-write"` + `approval_policy = "on-request"` (또는 CLI 플래그 `--sandbox workspace-write --ask-for-approval on-request`). 그 후 수동 승인은 `approvals_reviewer = "user"`, 자동 승인 검토는 `approvals_reviewer = "auto_review"`.

여러 디렉터리에서 작업해야 하면 writable roots로 샌드박스를 완전히 제거하지 않고 수정 가능 위치 확장. 더 넓거나 좁은 trust 경계가 필요하면 일회성 예외 의존 대신 기본 샌드박스 모드와 승인 정책 조정.

재사용 권한 셋: `default_permissions`를 명명된 프로파일로 + `[permissions.<name>.filesystem]` 또는 `[permissions.<name>.network]` 정의. 관리 네트워크 프로파일은 `[permissions.<name>.network.domains]`, `[permissions.<name>.network.unix_sockets]` 같은 map 테이블로 도메인·소켓 룰. 파일시스템 프로파일은 정확한 경로나 glob 패턴에 `"none"` 매칭으로 읽기 거부도 가능 — 워크스페이스 쓰기를 끄지 않고 로컬 시크릿 같은 파일을 읽지 못하게.

특정 예외가 필요한 워크플로는 [rules](../configuration/rules.md). 룰은 샌드박스 외부 명령 prefix를 allow/prompt/forbid 가능 — 액세스를 광범위하게 확장하는 것보다 더 적합한 경우가 많음. 앱의 승인·샌드박스 동작 상위 개요: [Codex 앱 기능](../ide/app-features.md), IDE 특화 설정 진입점: [Codex IDE 확장 설정](../ide/settings.md).

자동 리뷰는 가용해도 샌드박스 경계 변경하지 않음. 그 경계의 승인 요청 (샌드박스 escalation, 차단된 네트워크 액세스, 승인이 필요한 부수효과 도구 호출 등)에 대한 가능한 `approvals_reviewer` 중 하나. 샌드박스 안에서 이미 허용된 액션은 추가 리뷰 없이 실행. → reviewer 라이프사이클, 트리거 타입, 거부 시멘틱, 설정 디테일: [Auto-review](auto-review.md)

플랫폼 디테일은 플랫폼 특화 문서. 네이티브 Windows 셋업·동작·트러블슈팅: [Windows](../administration/windows.md). 샌드박싱·승인의 admin 요구사항·조직 레벨 제약: [Agent approvals & security](../administration/agent-approvals-security.md)

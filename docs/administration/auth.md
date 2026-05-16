---
원문: https://developers.openai.com/codex/auth
동기화일: 2026-05-15
---

# 인증 (Authentication)

> Codex 로그인 방법

## OpenAI 인증

OpenAI 모델 사용 시 두 가지 로그인:
- **ChatGPT 로그인** — 구독 액세스
- **API 키 로그인** — 사용량 기반 액세스

Codex 클라우드는 ChatGPT 로그인 필요. CLI와 IDE 확장은 둘 다 지원.

로그인 방식이 어느 admin 통제·데이터 처리 정책 적용되는지 결정:
- ChatGPT 로그인: ChatGPT 워크스페이스 권한, RBAC, ChatGPT Enterprise retention·residency 설정 따름
- API 키: API 조직의 retention·데이터 공유 설정 따름

CLI는 유효 세션 없을 때 ChatGPT 로그인이 기본 인증 경로.

### ChatGPT 로그인

Codex 앱·CLI·IDE 확장에서 ChatGPT 로그인 시 Codex가 브라우저 윈도우 열어 로그인 플로 완료. 로그인 후 브라우저가 액세스 토큰을 CLI·IDE 확장에 반환.

### API 키 로그인

Codex 앱·CLI·IDE 확장에 API 키 로그인. [OpenAI 대시보드](https://platform.openai.com/api-keys)에서 API 키 받기.

OpenAI는 API 키 사용을 OpenAI Platform 계정으로 표준 API 요율 청구. → [API 가격](https://openai.com/api/pricing/)

[fast mode](../configuration/speed.md) 같은 ChatGPT 크레딧 의존 기능은 ChatGPT 로그인 시만 가용. API 키 로그인 시 표준 API 가격.

> CI/CD 작업 같은 프로그래매틱 CLI 워크플로엔 API 키 인증 권장. Untrusted·공개 환경에 Codex 실행 노출 금지.

### Enterprise 자동화용 Codex 액세스 토큰

ChatGPT Enterprise 워크스페이스에서 admin이 허용 멤버에게 trusted·비인터랙티브 Codex 로컬 워크플로용 Codex 액세스 토큰 생성 허용 가능. 자동화가 ChatGPT 워크스페이스 액세스, ChatGPT 관리 Codex 자격, 엔터프라이즈 워크스페이스 통제를 브라우저 로그인 없이 필요할 때.

> 액세스 토큰은 trusted 스크립트, 스케줄러, 비공개 CI 러너용. 일반 OpenAI API 호출엔 Platform API 키 계속 사용.

→ 셋업, 권한, 로테이션, 회수 가이드: [액세스 토큰](access-tokens.md)

## Codex 클라우드 계정 보안

Codex 클라우드는 코드베이스와 직접 상호작용 → 다른 ChatGPT 기능보다 강한 보안 필요. 멀티 팩터 인증 (MFA) 활성화.

소셜 로그인 (Google, Microsoft, Apple) 사용 시 ChatGPT 계정에 MFA 활성화 의무 아님, 소셜 로그인 프로바이더에서 셋업 가능.

셋업:
- [Google](https://support.google.com/accounts/answer/185839)
- [Microsoft](https://support.microsoft.com/en-us/topic/what-is-multifactor-authentication-e5e39437-121c-be60-d123-eda06bddf661)
- [Apple](https://support.apple.com/en-us/102660)

SSO로 ChatGPT 액세스 시 조직 SSO admin이 모든 사용자에게 MFA 강제해야.

이메일·비밀번호 로그인 시 Codex 클라우드 액세스 전 계정에 MFA 셋업 필수.

계정이 1개 초과 로그인 방법 지원 + 그 중 하나가 이메일·비밀번호 → 다른 방식으로 로그인해도 Codex 액세스 전 MFA 셋업 필수.

## 로그인 캐싱

Codex 앱·CLI·IDE 확장에 ChatGPT·API 키로 로그인 시 Codex가 로그인 디테일 캐시 + 다음 CLI·확장 시작 시 재사용. CLI와 확장은 같은 캐시 로그인 디테일 공유. 한 곳에서 logout 시 다음 CLI·확장 시작 시 다시 로그인 필요.

Codex는 로그인 디테일을 `~/.codex/auth.json` 평문 파일 또는 OS 특정 자격증명 저장소에 로컬 캐시.

ChatGPT 로그인 세션은 만료 전 사용 중 토큰 자동 새로고침 → 활성 세션 보통 다른 브라우저 로그인 없이 계속.

## 자격증명 저장소

`cli_auth_credentials_store`로 CLI 캐시 자격증명 저장 위치 통제:

```toml
# file | keyring | auto
cli_auth_credentials_store = "keyring"
```

- `file`: `CODEX_HOME` (기본 `~/.codex`) 아래 `auth.json`에 저장
- `keyring`: OS 자격증명 저장소
- `auto`: OS 저장소 가용 시 사용, 아니면 `auth.json` fallback

> 파일 기반 저장소 사용 시 `~/.codex/auth.json`을 비밀번호처럼 다룰 것 — 액세스 토큰 포함. commit·티켓 paste·chat 공유 금지.

## 로그인 방법·워크스페이스 강제

관리 환경에서 admin이 사용자 인증 방식 제한 가능:

```toml
# ChatGPT 로그인만 또는 API 키 로그인만 허용
forced_login_method = "chatgpt"  # 또는 "api"

# ChatGPT 로그인 사용 시 사용자를 특정 워크스페이스로 제한
forced_chatgpt_workspace_id = "00000000-0000-0000-0000-000000000000"
```

활성 자격증명이 설정 제한과 매치 안 하면 Codex가 사용자 logout + 종료.

이 설정은 보통 사용자별 셋업 대신 managed configuration으로 적용. → [Managed configuration](enterprise-managed-configuration.md)

## 로그인 진단

직접 `codex login` 실행은 설정된 로그 디렉터리 아래 전용 `codex-login.log` 파일에 작성. 브라우저 로그인·device-code 실패 디버그 또는 지원이 로그인 특정 로그 요청 시 사용.

## 커스텀 CA 번들

네트워크가 회사 TLS 프록시·private root CA 사용 → 로그인 전 `CODEX_CA_CERTIFICATE`를 PEM 번들로. 미설정 시 Codex가 `SSL_CERT_FILE`로 fallback. 같은 커스텀 CA 설정이 로그인, 일반 HTTPS 요청, 안전 websocket 연결에 적용.

```bash
export CODEX_CA_CERTIFICATE=/path/to/corporate-root-ca.pem
codex login
```

## 헤드리스 디바이스 로그인

CLI에서 ChatGPT 로그인 중 브라우저 기반 로그인 UI 동작 안 할 수 있는 상황:
- 원격·헤드리스 환경에서 CLI 실행
- 로컬 네트워킹이 OAuth 토큰 CLI 반환에 Codex가 사용하는 localhost 콜백 차단

이런 경우 device code 인증 (베타) 우선. 인터랙티브 로그인 UI에서 **Sign in with Device Code** 또는 직접 `codex login --device-auth`. 환경에서 안 되면 fallback 사용.

### 권장: Device code 인증 (베타)

1. ChatGPT 보안 설정 (개인) 또는 ChatGPT 워크스페이스 권한 (워크스페이스 admin)에서 device code 로그인 활성화
2. Codex 실행 터미널에서:
   - 인터랙티브 로그인 UI에서 **Sign in with Device Code**
   - 또는 `codex login --device-auth`
3. 브라우저에서 링크 열기 → 로그인 → 일회성 코드 입력

서버에서 device code 로그인 활성화 안 됐으면 Codex가 표준 브라우저 기반 로그인 플로로 fallback.

### Fallback: 로컬에서 인증 + auth 캐시 복사

브라우저 있는 머신에서 로그인 플로 완료 가능 → 캐시 자격증명을 헤드리스 머신으로 복사.

1. 브라우저 기반 로그인 가능 머신에서 `codex login`
2. `~/.codex/auth.json`에 로그인 캐시 존재 확인
3. `~/.codex/auth.json`을 헤드리스 머신의 `~/.codex/auth.json`으로 복사

> `~/.codex/auth.json`을 비밀번호처럼 다루기.

OS가 `~/.codex/auth.json` 대신 자격증명 저장소에 자격증명 저장 시 이 방법 적용 안 될 수 있음. → [자격증명 저장소](#자격증명-저장소)에서 파일 기반 저장 구성.

SSH 통한 원격 머신 복사:
```bash
ssh user@remote 'mkdir -p ~/.codex'
scp ~/.codex/auth.json user@remote:~/.codex/auth.json
```

`scp` 회피 한 줄:
```bash
ssh user@remote 'mkdir -p ~/.codex && cat > ~/.codex/auth.json' < ~/.codex/auth.json
```

Docker 컨테이너 복사:
```bash
CONTAINER_HOME=$(docker exec MY_CONTAINER printenv HOME)
docker exec MY_CONTAINER mkdir -p "$CONTAINER_HOME/.codex"
docker cp ~/.codex/auth.json MY_CONTAINER:"$CONTAINER_HOME/.codex/auth.json"
```

신뢰 CI/CD 러너의 더 고급 패턴: [Maintain Codex account auth in CI/CD (advanced)](#) — Codex가 일반 실행 중 `auth.json` 새로고침 + 다음 작업에 갱신 파일 유지 방법. 자동화엔 API 키가 권장 기본.

### Fallback: SSH로 localhost 콜백 forward

로컬 머신과 원격 호스트 사이 포트 forward 가능 → Codex 로컬 콜백 서버 (기본 `localhost:1455`) 터널링으로 표준 브라우저 기반 플로.

1. 로컬에서 포트 forwarding 시작:
   ```bash
   ssh -L 1455:localhost:1455 user@remote
   ```
2. SSH 세션에서 `codex login` 실행 + 출력된 주소를 로컬 머신에서 따라가기

## 대체 모델 프로바이더

설정에 [커스텀 모델 프로바이더](../configuration/config-advanced.md) 정의 시 인증 방법:
- **OpenAI 인증**: `requires_openai_auth = true` → ChatGPT 또는 API 키 로그인. LLM 프록시 서버 통해 OpenAI 모델 액세스 시 유용. `true`면 `env_key` 무시.
- **환경 변수 인증**: `env_key = "<NAME>"` → 로컬 `<NAME>` 환경 변수의 프로바이더 특화 API 키 사용
- **인증 없음**: `requires_openai_auth` 미설정 (또는 `false`) + `env_key` 미설정 → Codex가 프로바이더가 인증 불필요로 가정. 로컬 모델에 유용.

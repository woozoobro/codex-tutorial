---
원문: https://developers.openai.com/codex/enterprise/access-tokens
동기화일: 2026-05-15
---

# 액세스 토큰 (Access tokens)

> 프로그래매틱 워크플로용 Codex 액세스 토큰 생성·관리

Codex 액세스 토큰으로 신뢰 자동화가 ChatGPT 워크스페이스 신원으로 Codex 로컬 실행. 스크립트, 스케줄 작업, CI 러너가 반복·비인터랙티브 Codex 액세스 필요할 때.

> 현재 ChatGPT Business와 Enterprise 워크스페이스에서 지원.

ChatGPT admin console의 [Access tokens](https://chatgpt.com/admin/access-tokens)에서 생성. 생성한 ChatGPT 사용자·워크스페이스에 묶임, Codex가 프로그래매틱 로컬 워크플로의 에이전트 신원으로 사용.

> Platform API 키가 자동화에 동작하면 API 키 인증 계속 사용. ChatGPT 워크스페이스 액세스, ChatGPT 관리 Codex 자격, 엔터프라이즈 워크스페이스 통제가 워크플로에 특별히 필요할 때 Codex 액세스 토큰.

## 액세스 토큰 동작 방식

사용자가 브라우저 로그인 완료 없이 Codex 실행해야 할 때 사용. 토큰은 생성한 ChatGPT 워크스페이스 사용자 표현 → 실행이 그 사용자의 Codex 액세스 사용 + 워크스페이스 거버넌스 데이터에 표시.

Codex가 실행 시작 시 토큰 체크 + 실행을 그 워크스페이스 신원에 묶음. 다른 자동화 시크릿처럼 다루기 — 시크릿 매니저 저장, 로그에서 제외, 정기 로테이션.

사용:
- 신뢰 자동화에서 실행되는 `codex exec` 작업
- 반복·비인터랙티브 Codex 실행 필요 로컬 스크립트
- API 조직 키 대신 ChatGPT 워크스페이스 사용자에 사용량 연관해야 하는 엔터프라이즈 워크플로

피해야 할 주요 위험:
- **시크릿 leak**: 토큰 가진 누구든 토큰 생성자로 Codex 실행 시작 가능. 시크릿 매니저 저장, 로그 제외, 정기 로테이션.
- **신뢰 안 하는 러너**: 공개 CI, fork된 PR, 공유 머신은 워크스페이스 외부 사람에게 토큰 노출 가능. 신뢰 러너에서만.
- **공유 신원**: 한 사람 토큰을 무관 팀이 재사용 → 소유권·감사 추적 해석 어려워짐. 특정 워크플로 소유자용 생성.
- **Stale 자격증명**: 장기 토큰이 워크플로 변경 후 활성 유지 가능. 유한 만료 우선 + 더 이상 사용 안 하는 토큰 회수.
- **잘못된 자격증명 타입**: 액세스 토큰은 Codex 로컬 워크플로용. 일반 OpenAI API 호출엔 Platform API 키.

## 액세스 토큰 생성 활성화

워크스페이스 설정의 Codex Local 통제로 허용 멤버에게 액세스 토큰 생성 ON.

1. [Workspace Settings → Settings and Permissions](https://chatgpt.com/admin/settings)
2. Codex Local 섹션에서 **Allow members to use Codex Local** ON 확인
3. 모든 허용 멤버가 액세스 토큰 생성 가능해야 → **Allow members to use Codex access tokens** ON
4. 더 좁은 rollout 위해 커스텀 역할 사용 시 토큰 생성 필요 그룹에만 액세스 토큰 권한 할당

> 액세스 토큰 생성을 토큰 저장 위치, 어떤 자동화가 사용할지, 어떻게 로테이션할지 이해하는 사람·서비스 소유자에게 제한 유지.

## 액세스 토큰 생성

Access tokens 페이지에서 토큰 이름 + 만료 시점 선택.

1. [Access tokens](https://chatgpt.com/admin/access-tokens) → **Create**
2. 설명적 이름 입력 (예: `release-ci`, `nightly-docs-check`)
3. 만료 선택. 7, 30, 60, 90일 같은 유한 만료 우선. **No expiration** 선택 시 정기 로테이션.
4. **Create**
5. 생성 액세스 토큰 즉시 복사. 모달 닫은 후 다시 못 봄.
6. 시크릿 매니저·CI 시크릿 저장소에 저장

> 가장 짧은 커스텀 만료는 1일. 회수·만료 토큰은 새 Codex 실행 시작 불가.

## CLI에 액세스 토큰 사용

Ephemeral 자동화 — 토큰을 `CODEX_ACCESS_TOKEN`에 저장 + Codex 일반 실행:
```bash
export CODEX_ACCESS_TOKEN="<your-access-token>"
codex exec --json "review this repository and summarize the top risks"
```

영속 로컬 로그인 — 토큰을 `codex login --with-access-token`에 pipe:
```bash
printf '%s' "$CODEX_ACCESS_TOKEN" | codex login --with-access-token
codex exec "summarize the last release diff"
```

> `codex login --with-access-token`은 Codex auth 저장소에 에이전트 신원 자격증명 저장. 머신에 자격증명 영속화 원치 않으면 `CODEX_ACCESS_TOKEN` 환경 변수 사용.

## 토큰 로테이션·회수

다른 자동화 시크릿 로테이션과 동일:

1. 교체 토큰 생성
2. 러너·스케줄러·시크릿 매니저의 시크릿 갱신
3. 새 토큰으로 smoke 테스트
4. [Access tokens](https://chatgpt.com/admin/access-tokens)에서 이전 토큰 회수

Access tokens 페이지에서 워크스페이스 owner·admin은 어떤 워크스페이스 토큰이든 회수 가능. 액세스 토큰 권한 있는 멤버는 자신이 만든 토큰만 회수.

## 권한 모델

액세스 토큰 권한은 일반 Codex 로컬 권한과 별도. 멤버는 액세스 토큰 생성 허용 없이 Codex 앱·CLI·IDE 확장 액세스 가능.

| 능력 | 워크스페이스 owner·admin | 액세스 토큰 권한 멤버 | 권한 없는 멤버 |
| --- | --- | --- | --- |
| [Access tokens](https://chatgpt.com/admin/access-tokens) 열기 | Yes | Yes | No |
| 액세스 토큰 생성 | Yes (자신의 ChatGPT 워크스페이스 신원) | Yes (자신의) | No |
| 액세스 토큰 나열 | 워크스페이스 리스트 (생성자 포함) | 자신이 만든 토큰만 | No |
| 액세스 토큰 회수 | 워크스페이스의 어떤 토큰 | 자신이 만든 것만 | 페이지 액세스 없음 |
| 액세스 토큰 권한 부여·제거 | Yes | No | No |
| 다른 Codex 엔터프라이즈 설정 관리 | Yes (admin 역할·Codex admin 권한 기반) | No (별도 부여 시 외엔) | No |

요약: 워크스페이스 owner·admin은 워크스페이스 레벨 액세스 관리. 멤버는 자신의 토큰 생성·관리에 액세스 토큰 권한 필요, 그 권한이 admin 권리·다른 멤버 토큰 액세스 부여 안 함.

## 트러블슈팅

### Access tokens 페이지가 404·forbidden 반환

워크스페이스 owner·admin에게 Codex 액세스 토큰 활성화·자신의 역할에 액세스 토큰 권한 포함 확인 요청.

### `codex login --with-access-token` 실패

생성된 액세스 토큰 (브라우저 세션 토큰·Platform API 키 아님) 복사 확인. 토큰 만료·회수 안 됐는지 확인.

## 관련 문서

- [Authentication](auth.md)
- [Non-interactive 모드](../automation/noninteractive.md)
- [Admin setup](enterprise-admin-setup.md)
- [Governance](enterprise-governance.md)

---
원문: https://developers.openai.com/codex/concepts/sandboxing/auto-review
동기화일: 2026-05-15
---

# 자동 리뷰 (Auto-review)

> Codex가 샌드박스 경계 승인을 reviewer 에이전트로 라우팅하는 방식

Auto-review는 샌드박스 경계의 수동 승인을 별도 reviewer 에이전트로 교체. 메인 Codex 에이전트는 같은 샌드박스 안에서 같은 승인 정책·네트워크·파일시스템 한도로 계속 실행. 차이는 **자격 escalation 요청을 누가 검토하는지**.

Auto-review는 승인이 인터랙티브일 때만 적용. 즉 `approval_policy = "on-request"` 또는 관련 prompt 카테고리를 표시하는 granular 승인 정책. `approval_policy = "never"`면 검토할 게 없음.

## 동작 방식

플로:

1. 메인 에이전트가 `read-only` 또는 `workspace-write` 안에서 작업
2. 샌드박스 경계 넘어야 할 때 승인 요청
3. `approvals_reviewer = "auto_review"`면 Codex가 그 승인 요청을 사람 대신 별도 reviewer 에이전트로 라우팅
4. Reviewer가 액션 실행 여부 결정 + 사유 반환
5. 승인되면 실행 계속. 거부되면 메인 에이전트는 실질적으로 더 안전한 경로 찾거나 멈춰 사용자에게 묻도록 지시

> Auto-review는 **reviewer 교체**, 권한 부여 아님. `writable_roots` 확장, 네트워크 액세스 활성화, 보호 경로 약화 안 함. 이미 승인 필요한 액션을 Codex가 처리하는 방식만 변경.

## 트리거 시점

Auto-review는 평소 사람이 멈춰야 할 승인 요청 평가:
- 샌드박스 권한 escalation 요청하는 셸·exec 도구 호출
- 현재 샌드박스·정책으로 차단된 네트워크 요청
- 허용된 writable roots 외부 파일 편집
- 도구 annotation 또는 설정된 승인 모드 기반으로 승인이 필요한 MCP·앱 도구 호출
- Browser Use가 새 웹사이트·도메인에 접근

샌드박스 안에서 이미 허용된 일상 액션에는 Auto-review 실행 안 함. 명령이 활성 `sandbox_mode` 아래 실행 가능하거나 도구 호출이 허용 정책 안에 머물면 메인 에이전트가 리뷰 없이 계속.

Computer Use는 별도. Computer Use 앱 승인은 여전히 사용자에게 직접 표시 → Auto-review가 그 앱 레벨 prompt 교체 안 함.

## Auto-review가 차단하는 것

상위 레벨에서 Auto-review가 차단하도록 설계된 액션:
- 비공개 데이터·시크릿·자격증명을 신뢰 안 하는 목적지로 전송
- 자격증명·토큰·쿠키·세션 자료 prob
- 광범위 또는 영구적 보안 약화
- 되돌릴 수 없는 손상 위험이 큰 destructive 액션

정확한 정책은 오픈소스 Codex 리포: [policy_template.md](https://github.com/openai/codex/blob/main/codex-rs/core/src/guardian/policy_template.md), [policy.md](https://github.com/openai/codex/blob/main/codex-rs/core/src/guardian/policy.md). 엔터프라이즈는 `guardian_policy_config`로, 개별 사용자는 로컬 [`[auto_review].policy`](../configuration/config-advanced.md)로 커스터마이즈.

## Reviewer가 보는 것

Reviewer 자체가 메인 에이전트보다 좁은 일을 하는 Codex 에이전트: **특정 경계 넘기 액션 실행 여부 결정**.

Reviewer는 압축된 트랜스크립트 + 정확한 승인 요청을 봄. 보통 사용자 메시지, 표시된 어시스턴트 갱신, 관련 도구 호출·도구 출력, 지금 승인 제안된 액션 포함. 누락 컨텍스트 수집 위해 read-only 체크도 가능, 드물게.

> 숨겨진 어시스턴트 reasoning은 포함 안 됨. Auto-review는 보존된 대화 항목과 도구 evidence를 봄, private chain-of-thought 아님.

## 거부와 실패 동작

명시적 거부는 일반 샌드박스 에러처럼 다루지 않음. Codex는 review 사유를 메인 에이전트에 반환 + 더 강한 지시 추가:
- workaround, indirect 실행, 정책 우회로 같은 결과 추구 금지
- 실질적으로 더 안전한 대안으로만 계속
- 아니면 멈춰 사용자에게 물어볼 것

Codex는 턴별 거부 circuit breaker 적용. 현재 오픈소스 구현에서 Auto-review는 같은 턴의 마지막 `50` 리뷰의 rolling window에서 `3` 연속 거부 또는 `10` 거부 후 턴 인터럽트.

비-거부는 연속 거부 카운터 리셋. Breaker trip 시 Codex가 경고 emit + 에이전트가 더 많은 escalation 시도로 루프하지 않게 인터럽트로 현재 턴 abort.

타임아웃은 명시적 거부와 별도로 표시, 메인 에이전트는 타임아웃만으로는 액션이 안전하지 않다는 증거 아님을 안내받음.

거부된 액션 명시적 오버라이드 경로도 있음. 현재 오픈소스 TUI에서 `/approve`로 **Auto-review Denials** picker 열기 → 최근 거부 액션 하나 선택 → 한 번 retry 승인. Codex는 스레드당 최근 거부 최대 10개 기록. 그 승인은 좁음: 정확한 거부 액션에만 적용 (유사 미래 액션 X), 같은 컨텍스트의 한 retry에 기록, retry는 여전히 Auto-review 통과. 내부적으로 Codex가 그 정확한 액션에 developer 스코프 승인 marker 주입. Reviewer는 그 명시적 사용자 override를 컨텍스트로 봄, 정책에 따라 사용자가 그 카테고리 거부 덮어쓸 수 없다고 하면 다시 거부 가능.

## 설정

셋업 디테일: [Managed configuration](../administration/enterprise-managed-configuration.md)

기본 reviewer 정책은 오픈소스 Codex 리포: [core/src/guardian/policy.md](https://github.com/openai/codex/blob/main/codex-rs/core/src/guardian/policy.md). 엔터프라이즈는 managed requirements의 `guardian_policy_config`로 tenant 특화 섹션 교체 가능. 개별 사용자는 `config.toml`에 로컬 `[auto_review].policy` 설정 가능, managed requirements가 우선:

```toml
[auto_review]
policy = """
YOUR POLICY GOES HERE
"""
```

> 정책 커스터마이즈: 먼저 전체 기본 정책 표현 복사 → 자체 위험 프로파일 기반으로 반복.

## 보안 약화 없이 리뷰 양 줄이기

Auto-review는 샌드박스가 이미 흔한 안전 워크플로 커버할 때 가장 잘 동작. 너무 많은 mundane 액션이 리뷰 필요하면 reviewer에게 noisy escalation 영구 승인 가르치는 대신 **경계를 먼저 고치자**.

가장 큰 효과:
- 의도적으로 사용하는 scratch 디렉터리·인접 리포에 좁은 [`writable_roots`](../configuration/config-advanced.md) 추가
- 좁은 스코프 [prefix rules](../configuration/rules.md) 추가. `["python"]`이나 `["curl"]` 같은 광범위 패턴보다 `["cargo", "test"]`나 `["pnpm", "run", "lint"]` 같은 정확한 명령 prefix 우선. 광범위 룰은 Auto-review가 지키려는 경계를 지움.

Auto-review 세션 트랜스크립트는 기본 `~/.codex/sessions` 아래 보존 → 정책·권한 변경 전 Codex에 과거 트래픽 분석 요청 가능.

## 한계

Auto-review는 장시간 agentic 작업의 기본 동작점 개선, 하지만 **결정적 보안 보장 아님**.

- 경계 넘기를 요청하는 액션만 평가
- 적대적·비정상 컨텍스트에서 여전히 실수 가능
- 좋은 샌드박스 설계, 모니터링, 조직 특화 정책을 **보완**해야지 대체하면 안 됨

→ 리서치 사유와 발표된 평가 결과: [Alignment Research post on Auto-review](https://alignment.openai.com/auto-review/)

---
원문: https://developers.openai.com/codex/guides/agents-md
동기화일: 2026-05-15
---

# AGENTS.md (커스텀 지시)

> Codex에 프로젝트별 추가 지시와 컨텍스트 제공

Codex는 작업 전에 `AGENTS.md` 파일을 읽는다. 글로벌 가이드와 프로젝트별 오버라이드를 레이어링하여, 어떤 리포를 열든 일관된 기대치로 작업 시작 가능.

## Codex가 가이드를 찾는 방식

Codex는 시작 시 instruction chain을 빌드 (실행당 1회, TUI는 보통 launch한 세션당 1회). 우선순위 순:

1. **Global scope**: Codex 홈 디렉터리 (기본 `~/.codex`, `CODEX_HOME`으로 변경 가능)에서 `AGENTS.override.md`가 있으면 그것, 아니면 `AGENTS.md`. 이 레벨에서는 첫 번째 비어있지 않은 파일만 사용.
2. **Project scope**: 프로젝트 루트(보통 Git 루트)부터 현재 작업 디렉터리까지 내려오며 탐색. 프로젝트 루트를 못 찾으면 현재 디렉터리만 검사. 각 디렉터리에서 `AGENTS.override.md` → `AGENTS.md` → `project_doc_fallback_filenames`의 fallback 이름 순. 디렉터리당 최대 1개.
3. **Merge order**: 루트부터 아래로 빈 줄로 연결. 현재 디렉터리에 가까운 파일이 결합 prompt에서 뒤에 오므로 우선.

빈 파일 건너뜀, 결합 크기가 `project_doc_max_bytes` (기본 32 KiB) 도달 시 더 이상 추가 안 함. 자세한 옵션은 [Project instructions discovery](config-advanced.md). 한도에 닿으면 한도 올리거나 nested 디렉터리로 분할.

## 글로벌 가이드 만들기

모든 리포가 상속할 영구 기본값을 Codex 홈 디렉터리에 작성.

```bash
mkdir -p ~/.codex
```

`~/.codex/AGENTS.md` 작성:

```markdown
# ~/.codex/AGENTS.md
## Working agreements
- Always run `npm test` after modifying JavaScript files.
- Prefer `pnpm` when installing dependencies.
- Ask for confirmation before adding new production dependencies.
```

확인:
```bash
codex --ask-for-approval never "Summarize the current instructions."
```

기대: Codex가 작업 제안 전 `~/.codex/AGENTS.md`의 항목을 인용.

베이스 파일을 지우지 않고 임시 글로벌 오버라이드가 필요하면 `~/.codex/AGENTS.override.md` 사용. 오버라이드 제거 시 공유 가이드로 복귀.

## 프로젝트 지시 레이어링

리포 레벨 파일은 글로벌 기본값을 상속하면서 프로젝트 규범을 Codex에 알린다.

리포 루트:
```markdown
# AGENTS.md
## Repository expectations
- Run `npm run lint` before opening a pull request.
- Document public utilities in `docs/` when you change behavior.
```

특정 팀이 다른 룰이 필요하면 nested 디렉터리에 오버라이드 추가. 예: `services/payments/AGENTS.override.md`:

```markdown
# services/payments/AGENTS.override.md
## Payments service rules
- Use `make test-payments` instead of `npm test`.
- Never rotate API keys without notifying the security channel.
```

payments 디렉터리에서 시작:
```bash
codex --cd services/payments --ask-for-approval never "List the instruction sources you loaded."
```

기대: Codex가 글로벌 → 리포 루트 `AGENTS.md` → payments 오버라이드 순으로 보고.

Codex는 현재 디렉터리에 도달하면 탐색 멈춤 → 오버라이드는 특화 작업 가까이.

샘플 구조:
```
- AGENTS.md                                 # 리포 기대치
- services/payments/
    - AGENTS.md                             # 오버라이드 존재로 무시
    - AGENTS.override.md                    # Payments 서비스 룰
    - README.md
- search/
    - AGENTS.md
    - …
```

## Fallback 파일명 커스터마이징

리포가 다른 파일명을 쓰면 (예: `TEAM_GUIDE.md`) fallback 리스트에 추가.

`~/.codex/config.toml`:
```toml
project_doc_fallback_filenames = ["TEAM_GUIDE.md", ".agents.md"]
project_doc_max_bytes = 65536
```

Codex 재시작 또는 새 명령 실행 → 갱신된 설정 로드.

이제 각 디렉터리 검사 순서: `AGENTS.override.md` → `AGENTS.md` → `TEAM_GUIDE.md` → `.agents.md`. 리스트에 없는 파일명은 무시. 큰 바이트 한도로 잘림 전 더 많은 가이드 결합 가능.

프로젝트별 자동화 사용자 같은 다른 프로필을 원하면 `CODEX_HOME` 환경 변수 사용:
```bash
CODEX_HOME=$(pwd)/.codex codex exec "List active instruction sources"
```

기대: 출력은 커스텀 `.codex` 디렉터리 기준 파일 나열.

## 셋업 검증

- 리포 루트에서 `codex --ask-for-approval never "Summarize the current instructions."` → Codex가 우선순위대로 글로벌·프로젝트 파일 가이드 반복
- `codex --cd subdir --ask-for-approval never "Show which instruction files are active."` → nested 오버라이드가 더 넓은 룰 대체 확인
- 어떤 instruction 파일이 로드됐는지 감사 필요 시 `~/.codex/log/codex-tui.log` (또는 세션 로깅 활성화 시 가장 최근 `session-*.jsonl`) 확인
- 지시가 stale해 보이면 대상 디렉터리에서 Codex 재시작. Codex는 매 실행(그리고 TUI 세션 시작)마다 instruction chain을 다시 빌드 — 수동으로 지울 캐시 없음.

## 트러블슈팅

- **아무것도 로드 안 됨**: 의도한 리포에 있는지, `codex status`가 기대 워크스페이스 루트를 보고하는지 확인. instruction 파일에 내용 있는지 (빈 파일 무시).
- **잘못된 가이드 표시**: 디렉터리 트리 위쪽 또는 Codex 홈 아래에 `AGENTS.override.md`가 있는지 확인. 일반 파일로 fallback하려면 오버라이드 이름 변경·제거.
- **Codex가 fallback 이름 무시**: `project_doc_fallback_filenames`에 오타 없이 명시했는지 확인 → Codex 재시작.
- **지시가 잘림**: `project_doc_max_bytes` 올리거나 큰 파일을 nested 디렉터리로 분할.
- **프로필 혼선**: Codex 시작 전 `echo $CODEX_HOME` → 기본값이 아니면 편집한 곳과 다른 홈 디렉터리를 가리킴.

## 다음 단계

- 공식 사이트: https://agents.md
- [Prompting Codex](../concepts/prompting.md) — 영구 가이드와 잘 어울리는 대화 패턴

---
원문: https://developers.openai.com/codex/security
동기화일: 2026-05-15
---

# Codex Security

> Codex로 보안 이슈 발견·검증·치료

Codex Security는 엔지니어링·보안 팀이 연결된 GitHub 리포의 가능한 취약점을 발견·검증·치료하도록 도움.

> 이 페이지는 Codex Security 제품 — 연결 GitHub 리포의 가능한 보안 이슈 스캔. Codex 샌드박싱·승인·네트워크 통제·admin 설정은 [Agent approvals & security](agent-approvals-security.md).

팀에 도움:

1. **가능한 취약점 발견** — 리포 특화 위협 모델과 실제 코드 컨텍스트 사용
2. **노이즈 감소** — 검토 전 발견 사항 검증
3. **fix를 향해 발견 사항 이동** — 랭크 결과, 증거, 제안 패치 옵션

## 동작 방식

Codex Security는 연결 리포를 commit 단위 스캔. 리포에서 스캔 컨텍스트 빌드, 그 컨텍스트 대비 가능한 취약점 체크, 표시 전 high-signal 이슈를 격리 환경에서 검증.

워크플로 집중:
- 일반 시그니처 대신 리포 특화 컨텍스트
- false positive 감소에 도움 되는 검증 증거
- GitHub에서 검토 가능한 제안 fix

## 액세스·전제조건

Codex Security는 Codex Web 통한 연결 GitHub 리포에서 동작. OpenAI가 액세스 관리. 액세스 필요 또는 리포 안 보임 → OpenAI 계정 팀 연락 + 리포가 Codex Web 워크스페이스 통해 가용한지 확인.

## 관련 문서

- [Codex Security 셋업](security-setup.md): 셋업, 스캔, 발견 사항 검토
- [FAQ](security-faq.md): 흔한 제품 질문
- [위협 모델 개선](security-threat-model.md): 스코프, 공격 표면, 중요도 가정 튜닝

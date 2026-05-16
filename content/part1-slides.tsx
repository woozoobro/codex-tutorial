import type { Slide } from "@/components/slides/types";

export const part1Slides: Slide[] = [
  {
    id: 1,
    section: "Opening",
    title: "아이디어를\n프로젝트로",
    kind: "title",
    content: "Codex 입문 1편",
    caption: "채팅 -> 파일 -> 웹",
  },
  {
    id: 2,
    section: "Opening",
    title: "Codex가 뭐지?",
    kind: "statement",
    content: "내 컴퓨터에서 결과물을 만드는 AI 에이전트.",
    bullets: ["파일 만들기", "코드 수정", "브라우저 확인", "GitHub 연결"],
    image: {
      src: "/slides/part1/codex-agent-working.png",
      alt: "작은 파란 AI 에이전트가 노트북 앞에서 열심히 작업하는 3D 일러스트",
    },
  },
  {
    id: 3,
    section: "Opening",
    title: "저소음 오피스 스낵",
    kind: "statement",
    content: "회의 중에도 눈치 안 보고 먹을 수 있는 간식.",
    image: {
      src: "/slides/part1/opening-shheat-brand.png",
      alt: "회의 중에도 조용히 먹을 수 있는 저소음 오피스 스낵 브랜드 이미지",
    },
  },
  {
    id: 4,
    section: "Situation",
    title: "상황 설명",
    kind: "scene",
    image: {
      src: "/slides/part1/team-lead-brand-brief-v2.png",
      alt: "팀장님이 회의실에서 새로운 커머스 브랜드 아이디어를 제안하는 장면",
    },
  },
  {
    id: 5,
    section: "Ideation",
    title: "아이디어 먼저",
    kind: "prompt",
    content: "처음엔 빠르게 넓힌다.",
    prompt: `저소음 오피스 스낵 브랜드를 아이데이션해줘.

타깃, 고객 문제, 제품 컨셉, 이름 후보를
커머스 스타트업처럼 정리해줘.`,
  },
  {
    id: 6,
    section: "Project",
    title: "프로젝트 = 작업 폴더",
    kind: "bullets",
    bullets: ["문서와 코드 저장", "다음 스레드도 이어짐"],
    caption: "결과물이 쌓이는 공간.",
    image: {
      src: "/slides/part1/project-folder.png",
      alt: "프로젝트 폴더 안에 문서와 코드 파일이 쌓이는 미니멀 UI 이미지",
    },
  },
  {
    id: 7,
    section: "Context",
    title: "AGENTS.md",
    kind: "prompt",
    content: "프로젝트 맥락을 파일로 고정한다.",
    prompt: `현재 프로젝트에 AGENTS.md를 만들어줘.

Shh-eat의 방향, 타깃, 제품 컨셉만
짧게 정리해줘.`,
    image: {
      src: "/slides/part1/agents-manual.png",
      alt: "AGENTS.md를 프로젝트 작업 매뉴얼처럼 비유한 위트 있는 제품 사진",
    },
  },
  {
    id: 8,
    section: "GitHub",
    title: "GitHub = 기록",
    kind: "statement",
    content: "AI가 많이 바꿀수록 기록이 중요해진다.",
    bullets: ["변경 이력", "공유와 배포"],
  },
  {
    id: 9,
    section: "GitHub",
    title: "commit / push",
    kind: "comparison",
    columns: [
      {
        title: "commit",
        items: ["내 컴퓨터에 봉인", "작업 단위 스냅샷"],
        image: {
          src: "/slides/part1/commit-snapshot.png",
          alt: "commit을 현재 작업 상태를 사진 찍어 로컬 보관함에 저장하는 장면으로 비유한 사진",
        },
      },
      {
        title: "push",
        items: ["원격 저장소로 발송", "공유 가능한 이력"],
        image: {
          src: "/slides/part1/push-upload.png",
          alt: "push를 로컬 스냅샷 카드를 원격 저장소로 전송하는 장면으로 비유한 사진",
        },
      },
    ],
  },
  {
    id: 10,
    section: "Research",
    title: "웹으로 시장 조사하기",
    kind: "prompt",
    content: "실제 자료를 찾고, 출처까지 남긴다.",
    prompt: `웹에서 시장 조사를 해줘.

실제 출처만 사용하고,
근거가 약하면 약하다고 표시해줘.

docs/research/market-research.md로 저장해줘.`,
  },
  {
    id: 11,
    section: "Strategy",
    title: "리서치 -> 전략",
    kind: "prompt",
    content: "문서는 다음 판단의 입력이 된다.",
    prompt: `시장 조사 문서를 참고해서
브랜드 전략을 정리해줘.

타깃, 문제, 차별점, 랜딩 메시지,
피해야 할 표현만 남겨줘.`,
  },
  {
    id: 12,
    section: "Mention",
    title: "파일로 맥락 주기",
    kind: "prompt",
    content: "복붙 대신 파일을 멘션한다.",
    prompt: `@docs/research/market-research.md
@docs/brand/brand-strategy.md

이 두 문서를 참고해서
브랜드 비주얼 방향을 정리해줘.`,
  },
  {
    id: 13,
    section: "Planning",
    title: "큰 작업은 계획부터",
    kind: "demo",
    demoLabel: "Plan mode",
    content: "바로 만들기 전에, 먼저 순서를 잡는다.",
    bullets: ["구조 확인", "순서 정리"],
  },
  {
    id: 14,
    section: "Local",
    title: "로컬에서 확인",
    kind: "flow",
    steps: ["설치", "dev server", "브라우저 확인", "수정 반복"],
    caption: "내 컴퓨터에서 먼저 검증한다.",
  },
  {
    id: 15,
    section: "Deploy",
    title: "로컬에서 인터넷으로",
    kind: "bullets",
    bullets: ["로컬: 나만 봄", "배포: 모두가 봄", "GitHub가 기준"],
  },
  {
    id: 16,
    section: "Recap",
    title: "오늘의 작업 흐름",
    kind: "flow",
    steps: ["아이디어", "프로젝트", "문서", "GitHub", "리서치", "웹"],
  },
  {
    id: 17,
    section: "Next",
    title: "다음 편",
    kind: "closing",
    content: "조금 더 에이전트답게.",
    bullets: ["Skills", "Subagents", "Context 관리"],
  },
];

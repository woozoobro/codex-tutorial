import type { Slide } from "@/components/slides/types";

export const part1Slides: Slide[] = [
  {
    id: 1,
    section: "Opening",
    title: "아이디어를 프로젝트로",
    kind: "title",
    content: "쉬잇, 브랜드 하나 만들고 웹까지.",
    caption: "채팅 -> 파일 -> 웹",
    image: {
      src: "/slides/part1/opening-shheat-brand.png",
      alt: "조용한 오피스 스낵 브랜드를 기획하고 웹으로 만드는 작업 무드 이미지",
    },
  },
  {
    id: 2,
    section: "Concept",
    title: "채팅은 시작점",
    kind: "statement",
    content: "결과물은 프로젝트에 남긴다.",
    bullets: ["질문은 가볍게", "산출물은 파일로"],
  },
  {
    id: 3,
    section: "Setup",
    title: "준비물",
    kind: "bullets",
    bullets: ["Codex 앱", "ChatGPT 계정", "GitHub 계정"],
    caption: "장비가 거창해 보여도 시작은 로그인 세 개.",
    image: {
      src: "/slides/part1/starter-kit-chaos.png",
      alt: "AI 작업 시작 준비물을 비상 장비 가방처럼 과장해서 배치한 제품 사진",
    },
  },
  {
    id: 4,
    section: "Ideation",
    title: "아이디어 먼저",
    kind: "prompt",
    content: "처음엔 빠르게 넓힌다.",
    prompt: `저소음 오피스 스낵 브랜드를 아이데이션해줘.

타깃, 고객 문제, 제품 컨셉, 이름 후보를
커머스 스타트업처럼 정리해줘.`,
  },
  {
    id: 5,
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
    id: 6,
    section: "Context",
    title: "AGENTS.md",
    kind: "prompt",
    content: "AI도 온보딩이 필요하다.",
    prompt: `현재 프로젝트에 AGENTS.md를 만들어줘.

Shh-eat의 방향, 타깃, 제품 컨셉만
짧게 정리해줘.`,
    image: {
      src: "/slides/part1/agents-manual.png",
      alt: "AGENTS.md를 프로젝트 작업 매뉴얼처럼 비유한 위트 있는 제품 사진",
    },
  },
  {
    id: 7,
    section: "GitHub",
    title: "GitHub = 기록",
    kind: "statement",
    content: "AI가 많이 바꿀수록 기록이 중요해진다.",
    bullets: ["변경 이력", "공유와 배포"],
  },
  {
    id: 8,
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
    id: 9,
    section: "Research",
    title: "상상에서 근거로",
    kind: "prompt",
    content: "아이디어는 근거를 만나야 한다.",
    prompt: `웹에서 시장 조사를 해줘.

실제 출처만 사용하고,
근거가 약하면 약하다고 표시해줘.

docs/research/market-research.md로 저장해줘.`,
  },
  {
    id: 10,
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
    id: 11,
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
    id: 12,
    section: "Planning",
    title: "큰 작업은 계획부터",
    kind: "demo",
    demoLabel: "Plan mode",
    content: "바로 만들기 전에, 먼저 순서를 잡는다.",
    bullets: ["구조 확인", "순서 정리"],
  },
  {
    id: 13,
    section: "Local",
    title: "로컬에서 확인",
    kind: "flow",
    steps: ["설치", "dev server", "브라우저 확인", "수정 반복"],
    caption: "내 컴퓨터에서 먼저 검증한다.",
  },
  {
    id: 14,
    section: "Deploy",
    title: "로컬에서 인터넷으로",
    kind: "bullets",
    bullets: ["로컬: 나만 봄", "배포: 모두가 봄", "GitHub가 기준"],
  },
  {
    id: 15,
    section: "Recap",
    title: "오늘의 작업 흐름",
    kind: "flow",
    steps: ["아이디어", "프로젝트", "문서", "GitHub", "리서치", "웹"],
  },
  {
    id: 16,
    section: "Next",
    title: "다음 편",
    kind: "closing",
    content: "조금 더 에이전트답게.",
    bullets: ["Skills", "Subagents", "Context 관리"],
  },
];

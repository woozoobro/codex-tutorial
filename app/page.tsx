import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-7xl">
        <div className="mb-16 grid grid-cols-[1fr_auto_1fr] items-center border-b border-[var(--line)] pb-4 slide-label text-[var(--muted)]">
          <span>Codex Tutorial</span>
          <span className="text-[var(--foreground)]">Part 1</span>
          <span className="justify-self-end">Slides</span>
        </div>

        <div className="slide-grid items-end">
          <div className="col-span-full lg:col-span-8">
            <p className="mb-6 flex items-center gap-3 slide-label text-[var(--accent)]">
              <span className="h-2 w-2 bg-[var(--accent)]" />
              촬영용 미니멀 웹 슬라이드
            </p>
            <h1 className="max-w-5xl text-[5.8rem] font-bold leading-[0.98] text-[var(--foreground)]">
              Codex로 아이디어 하나를 실제 프로젝트로 밀어붙이기
            </h1>
          </div>

          <div className="col-span-full border-t border-[var(--line-strong)] pt-6 lg:col-span-4">
            <p className="mb-9 text-[1.85rem] font-bold leading-tight text-[var(--muted)]">
              채팅에서 시작해 파일, GitHub, 리서치, 웹까지 이어갑니다.
            </p>
            <Link
              href="/part1/1"
              className="inline-flex h-14 items-center border border-[var(--foreground)] px-6 text-base font-bold text-[var(--foreground)] transition-colors hover:bg-[var(--foreground)] hover:text-[var(--slide-bg)]"
            >
              Part 1 시작하기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import type { Slide } from "./types";

type SlideFrameProps = {
  children: ReactNode;
  current: Slide;
  currentIndex: number;
  total: number;
  previousId?: number;
  nextId?: number;
  progress: number;
};

export function SlideFrame({
  children,
  current,
  currentIndex,
  total,
  previousId,
  nextId,
  progress,
}: SlideFrameProps) {
  return (
    <article className="slide-stage relative isolate flex overflow-hidden bg-[var(--slide-bg)] text-[var(--foreground)]">
      <div
        className="absolute left-0 top-0 z-20 h-[3px] bg-[var(--accent)] transition-all duration-200"
        style={{ width: `${progress}%` }}
      />

      <div className="flex min-w-0 flex-1 flex-col px-10 py-7 md:px-16 md:py-9 lg:px-20 lg:py-10">
        <header className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-[var(--line)] pb-4 slide-label text-[var(--muted)]">
          <Link className="justify-self-start transition-colors hover:text-[var(--foreground)]" href="/">
            Codex Tutorial
          </Link>
          <span className="justify-self-center text-[var(--foreground)]">Part 1</span>
          <span className="justify-self-end text-[var(--muted)]">{current.section}</span>
        </header>

        <main className="relative flex min-h-0 flex-1 items-center py-7">
          {children}
        </main>

        <footer className="grid grid-cols-[1fr_auto_1fr] items-center border-t border-[var(--line)] pt-4 text-sm font-bold text-[var(--muted)]">
          <span className="font-mono text-[0.82rem] text-[var(--foreground)]">
            {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>

          <span className="slide-label justify-self-center text-[var(--muted-soft)]">
            {current.title}
          </span>

          <nav className="flex items-center gap-3 justify-self-end" aria-label="Slide navigation">
            <Link
              aria-disabled={!previousId}
              className={`flex h-9 w-9 items-center justify-center border border-transparent text-xl transition-colors ${
                previousId
                  ? "text-[var(--foreground)] hover:border-[var(--line-strong)] hover:text-[var(--accent)]"
                  : "pointer-events-none text-[var(--muted-soft)]"
              }`}
              href={previousId ? `/part1/${previousId}` : `/part1/${current.id}`}
            >
              <span aria-hidden="true">←</span>
              <span className="sr-only">이전 슬라이드</span>
            </Link>
            <Link
              aria-disabled={!nextId}
              className={`flex h-9 w-9 items-center justify-center border border-transparent text-xl transition-colors ${
                nextId
                  ? "text-[var(--foreground)] hover:border-[var(--line-strong)] hover:text-[var(--accent)]"
                  : "pointer-events-none text-[var(--muted-soft)]"
              }`}
              href={nextId ? `/part1/${nextId}` : `/part1/${current.id}`}
            >
              <span aria-hidden="true">→</span>
              <span className="sr-only">다음 슬라이드</span>
            </Link>
          </nav>
        </footer>
      </div>
    </article>
  );
}

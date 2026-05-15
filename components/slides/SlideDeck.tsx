"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SlideFrame } from "./SlideFrame";
import { SlideRenderer } from "./SlideRenderer";
import type { Slide } from "./types";

type SlideDeckProps = {
  slides: Slide[];
  currentIndex: number;
};

export function SlideDeck({ slides, currentIndex }: SlideDeckProps) {
  const router = useRouter();
  const current = slides[currentIndex];
  const previous = slides[currentIndex - 1];
  const next = slides[currentIndex + 1];
  const progress = ((currentIndex + 1) / slides.length) * 100;

  const goHome = useCallback(() => {
    router.push("/");
  }, [router]);

  const goPrevious = useCallback(() => {
    if (previous) {
      router.push(`/part1/${previous.id}`);
    }
  }, [previous, router]);

  const goNext = useCallback(() => {
    if (next) {
      router.push(`/part1/${next.id}`);
    }
  }, [next, router]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        goNext();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      }

      if (event.key === "Escape") {
        event.preventDefault();
        goHome();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goHome, goNext, goPrevious]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-4">
      <SlideFrame
        current={current}
        currentIndex={currentIndex}
        nextId={next?.id}
        previousId={previous?.id}
        progress={progress}
        total={slides.length}
      >
        <SlideRenderer slide={current} />
      </SlideFrame>
    </main>
  );
}

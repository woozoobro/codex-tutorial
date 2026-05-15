import { notFound } from "next/navigation";
import { SlideDeck } from "@/components/slides/SlideDeck";
import { part1Slides } from "@/content/part1-slides";

type PageProps = {
  params: Promise<{
    slide: string;
  }>;
};

export function generateStaticParams() {
  return part1Slides.map((slide) => ({
    slide: String(slide.id),
  }));
}

export default async function Part1SlidePage({ params }: PageProps) {
  const { slide } = await params;
  const slideId = Number(slide);
  const currentIndex = part1Slides.findIndex((item) => item.id === slideId);

  if (currentIndex === -1) {
    notFound();
  }

  return <SlideDeck currentIndex={currentIndex} slides={part1Slides} />;
}

export type SlideKind =
  | "title"
  | "statement"
  | "bullets"
  | "prompt"
  | "demo"
  | "flow"
  | "comparison"
  | "closing";

export type Slide = {
  id: number;
  section: string;
  title: string;
  kind: SlideKind;
  content?: string;
  caption?: string;
  bullets?: string[];
  steps?: string[];
  prompt?: string;
  demoLabel?: string;
  image?: {
    src: string;
    alt: string;
  };
  columns?: Array<{
    image?: {
      src: string;
      alt: string;
    };
    title: string;
    items: string[];
  }>;
};

import Image from "next/image";

type TextListProps = {
  compact?: boolean;
  items?: string[];
};

export function SectionKicker({ children }: { children: string }) {
  return (
    <p className="mb-6 flex items-center gap-3 slide-label text-[var(--accent)]">
      <span className="h-2 w-2 bg-[var(--accent)]" />
      {children}
    </p>
  );
}

export function BulletList({ compact = false, items = [] }: TextListProps) {
  return (
    <ol
      className={`grid gap-0 border-t border-[var(--line-strong)] font-bold text-[var(--foreground)] ${
        compact ? "text-[1.55rem] leading-[1.12]" : "text-[2.45rem] leading-[1.08]"
      }`}
    >
      {items.map((item, index) => (
        <li
          className={`grid items-center border-b border-[var(--line)] ${
            compact
              ? "min-h-14 grid-cols-[3.5rem_1fr] gap-3 py-3"
              : "min-h-20 grid-cols-[4.75rem_1fr] gap-5 py-4"
          }`}
          key={item}
        >
          <span className="font-mono text-sm font-bold text-[var(--accent)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function PromptBlock({
  compact = false,
  prompt,
}: {
  compact?: boolean;
  prompt: string;
}) {
  return (
    <figure className="border border-[var(--line-strong)] bg-[var(--code-bg)]">
      <figcaption
        className={`flex items-center justify-between border-b border-[var(--line)] slide-label text-[var(--muted)] ${
          compact ? "px-4 py-2" : "px-5 py-3"
        }`}
      >
        <span>Prompt</span>
        <span className="text-[var(--accent)]">Codex</span>
      </figcaption>
      <pre
        className={`prompt-scroll overflow-auto font-mono font-bold text-[var(--foreground)] ${
          compact
            ? "max-h-[15rem] p-5 text-[1.05rem] leading-[1.55]"
            : "max-h-[28rem] p-7 text-[1.55rem] leading-[1.55]"
        }`}
      >
        <code>{prompt}</code>
      </pre>
    </figure>
  );
}

export function FlowList({ steps = [] }: { steps?: string[] }) {
  const columnCount = steps.length <= 4 ? steps.length : 3;

  return (
    <ol
      className="grid gap-x-8 gap-y-8"
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
    >
      {steps.map((step, index) => (
        <li
          className="min-h-40 border-t border-[var(--line-strong)] pt-5"
          key={step}
        >
          <span className="mb-7 block font-mono text-sm font-bold text-[var(--accent)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-[2.55rem] font-bold leading-[1.05] text-[var(--foreground)]">
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function DemoCue({ label }: { label: string }) {
  return (
    <div className="mb-8 inline-flex items-center gap-3 border border-[var(--line-strong)] bg-[var(--accent-soft)] px-4 py-3 slide-label text-[var(--accent-ink)]">
      <span className="h-2 w-2 bg-[var(--accent)]" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function SlideImage({ alt, src }: { alt: string; src: string }) {
  return (
    <figure className="relative aspect-[1672/941] overflow-hidden border border-[var(--line-strong)] bg-[var(--code-bg)]">
      <Image
        alt={alt}
        className="object-cover object-center"
        fill
        sizes="52vw"
        priority
        src={src}
      />
    </figure>
  );
}

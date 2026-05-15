import type { Slide } from "./types";
import {
  BulletList,
  DemoCue,
  FlowList,
  PromptBlock,
  SectionKicker,
  SlideImage,
} from "./SlideElements";

type SlideRendererProps = {
  slide: Slide;
};

export function SlideRenderer({ slide }: SlideRendererProps) {
  if (slide.kind === "title") {
    return (
      <div className="slide-grid items-end">
        <div className={slide.image ? "col-span-full lg:col-span-6" : "col-span-full lg:col-span-8"}>
          <SectionKicker>Codex Tutorial</SectionKicker>
          <h1 className="slide-display-xl max-w-6xl text-[var(--foreground)]">
            {slide.title}
          </h1>
          {slide.image && slide.content ? (
            <p className="mt-10 max-w-3xl slide-subtitle text-[var(--muted)]">
              {slide.content}
            </p>
          ) : null}
          {slide.image && slide.caption ? (
            <p className="mt-10 font-mono text-[1.45rem] font-bold leading-tight text-[var(--accent)]">
              {slide.caption}
            </p>
          ) : null}
        </div>
        <aside className="col-span-full border-t border-[var(--line-strong)] pt-5 lg:col-span-6">
          {slide.image ? (
            <SlideImage alt={slide.image.alt} src={slide.image.src} />
          ) : (
            <>
              <p className="slide-subtitle text-[var(--foreground)]">{slide.content}</p>
              {slide.caption ? (
                <p className="mt-12 font-mono text-[1.65rem] font-bold leading-tight text-[var(--accent)]">
                  {slide.caption}
                </p>
              ) : null}
            </>
          )}
        </aside>
      </div>
    );
  }

  if (slide.kind === "statement") {
    return (
      <div className="slide-grid items-center">
        <div className="col-span-full lg:col-span-8">
          <SectionKicker>{slide.section}</SectionKicker>
          <h1 className="slide-display-lg text-[var(--foreground)]">
            {slide.title}
          </h1>
          {slide.content ? (
            <p className="mt-10 max-w-5xl slide-subtitle text-[var(--muted)]">
              {slide.content}
            </p>
          ) : null}
        </div>
        <div className="col-span-full lg:col-span-4">
          <BulletList items={slide.bullets} />
        </div>
      </div>
    );
  }

  if (slide.kind === "prompt") {
    if (slide.image) {
      return (
        <div className="slide-grid items-center">
          <div className="col-span-full lg:col-span-5">
            <SectionKicker>{slide.section}</SectionKicker>
            <h1 className="slide-display-md text-[var(--foreground)]">
              {slide.title}
            </h1>
            {slide.content ? (
              <p className="mt-8 max-w-lg text-[2.15rem] font-bold leading-[1.14] text-[var(--muted)]">
                {slide.content}
              </p>
            ) : null}
            {slide.prompt ? (
              <div className="mt-10">
                <PromptBlock compact prompt={slide.prompt} />
              </div>
            ) : null}
          </div>
          <div className="col-span-full lg:col-span-7">
            <SlideImage alt={slide.image.alt} src={slide.image.src} />
          </div>
        </div>
      );
    }

    return (
      <div className="slide-grid items-center">
        <div className="col-span-full lg:col-span-5">
          <SectionKicker>{slide.section}</SectionKicker>
          <h1 className="slide-display-md text-[var(--foreground)]">
            {slide.title}
          </h1>
          {slide.content ? (
            <p className="mt-8 max-w-lg text-[2.15rem] font-bold leading-[1.14] text-[var(--muted)]">
              {slide.content}
            </p>
          ) : null}
        </div>
        <div className="col-span-full lg:col-span-7">
          {slide.prompt ? <PromptBlock prompt={slide.prompt} /> : null}
        </div>
      </div>
    );
  }

  if (slide.kind === "demo") {
    return (
      <div className="slide-grid items-center">
        <div className="col-span-full lg:col-span-8">
          {slide.demoLabel ? <DemoCue label={slide.demoLabel} /> : null}
          <h1 className="slide-display-lg text-[var(--foreground)]">
            {slide.title}
          </h1>
          {slide.content ? (
            <p className="mt-10 max-w-4xl slide-subtitle text-[var(--muted)]">
              {slide.content}
            </p>
          ) : null}
        </div>
        <div className="col-span-full lg:col-span-4">
          <BulletList items={slide.bullets} />
        </div>
      </div>
    );
  }

  if (slide.kind === "flow") {
    return (
      <div className="w-full">
        <SectionKicker>{slide.section}</SectionKicker>
        <div className="mb-11 grid grid-cols-[1fr_24rem] items-end gap-10">
          <h1 className="slide-display-md max-w-5xl text-[var(--foreground)]">
            {slide.title}
          </h1>
          {slide.caption ? (
            <p className="border-t border-[var(--line-strong)] pt-5 text-[1.7rem] font-bold leading-tight text-[var(--muted)]">
              {slide.caption}
            </p>
          ) : null}
        </div>
        <FlowList steps={slide.steps} />
      </div>
    );
  }

  if (slide.kind === "comparison") {
    const hasColumnImages = slide.columns?.some((column) => column.image);

    if (hasColumnImages) {
      return (
        <div className="w-full">
          <SectionKicker>{slide.section}</SectionKicker>
          <h1 className="mb-9 slide-display-md text-[var(--foreground)]">
            {slide.title}
          </h1>
          <div className="grid gap-7 md:grid-cols-2">
            {slide.columns?.map((column) => (
              <section
                className="border-t border-[var(--line-strong)] pt-5"
                key={column.title}
              >
                {column.image ? (
                  <SlideImage alt={column.image.alt} src={column.image.src} />
                ) : null}
                <h2 className="mb-5 mt-6 font-mono text-[2.3rem] font-bold leading-none text-[var(--accent)]">
                  {column.title}
                </h2>
                <BulletList compact items={column.items} />
              </section>
            ))}
          </div>
        </div>
      );
    }

    if (slide.image) {
      return (
        <div className="slide-grid items-center">
          <div className="col-span-full lg:col-span-5">
            <SectionKicker>{slide.section}</SectionKicker>
            <h1 className="mb-11 slide-display-md text-[var(--foreground)]">
              {slide.title}
            </h1>
            <div className="grid gap-8">
              {slide.columns?.map((column) => (
                <section
                  className="border-t border-[var(--line-strong)] pt-5"
                  key={column.title}
                >
                  <h2 className="mb-5 font-mono text-[2.25rem] font-bold leading-none text-[var(--accent)]">
                    {column.title}
                  </h2>
                  <BulletList compact items={column.items} />
                </section>
              ))}
            </div>
          </div>
          <div className="col-span-full lg:col-span-7">
            <SlideImage alt={slide.image.alt} src={slide.image.src} />
          </div>
        </div>
      );
    }

    return (
      <div className="w-full">
        <SectionKicker>{slide.section}</SectionKicker>
        <h1 className="mb-14 slide-display-lg text-[var(--foreground)]">
          {slide.title}
        </h1>
        <div className="grid gap-6 md:grid-cols-2">
          {slide.columns?.map((column) => (
            <section
              className="border-t border-[var(--line-strong)] pt-6"
              key={column.title}
            >
              <h2 className="mb-8 font-mono text-[3.3rem] font-bold leading-none text-[var(--accent)]">
                {column.title}
              </h2>
              <BulletList items={column.items} />
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (slide.kind === "closing") {
    return (
      <div className="slide-grid items-center">
        <div className="col-span-full lg:col-span-7">
          <SectionKicker>{slide.section}</SectionKicker>
          <h1 className="slide-display-xl text-[var(--foreground)]">
            {slide.title}
          </h1>
          {slide.content ? (
            <p className="mt-10 slide-subtitle text-[var(--muted)]">
              {slide.content}
            </p>
          ) : null}
        </div>
        <div className="col-span-full lg:col-span-5">
          <BulletList items={slide.bullets} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className={slide.image ? "slide-grid items-center" : ""}>
        <div className={slide.image ? "col-span-full lg:col-span-5" : ""}>
          <SectionKicker>{slide.section}</SectionKicker>
          <h1 className="mb-14 slide-display-lg max-w-6xl text-[var(--foreground)]">
            {slide.title}
          </h1>
          <div className="max-w-5xl">
            <BulletList items={slide.bullets} />
          </div>
          {slide.caption ? (
            <p className="mt-10 max-w-4xl text-[2.35rem] font-bold leading-tight text-[var(--muted)]">
              {slide.caption}
            </p>
          ) : null}
        </div>
        {slide.image ? (
          <div className="col-span-full lg:col-span-7">
            <SlideImage alt={slide.image.alt} src={slide.image.src} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

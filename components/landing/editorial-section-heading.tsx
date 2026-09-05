import type { ReactNode } from "react";

export function EditorialSectionHeading({
  number,
  eyebrow,
  title,
  description,
}: {
  number: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-5 sm:gap-7">
      <span
        aria-hidden="true"
        className="select-none font-display text-6xl font-extrabold italic leading-[0.76] tracking-[-0.07em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.32)] sm:text-8xl"
      >
        {number}
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-race-red">
          <span className="h-px w-8 bg-race-red" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 className="mt-4 font-display text-4xl font-extrabold uppercase italic leading-[0.84] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        {description ? <p className="mt-5 max-w-xl text-base leading-7 text-white/58">{description}</p> : null}
      </div>
    </div>
  );
}

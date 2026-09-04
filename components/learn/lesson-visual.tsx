import type { CSSProperties } from "react";

import type { LessonVisualKind } from "@/content/lessons";

export function LessonVisual({ kind }: { kind: LessonVisualKind }) {
  if (kind === "weekend") {
    return (
      <VisualFrame label="Weekend flow">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["01", "Practice", "Prepare"],
            ["02", "Qualifying", "Set the grid"],
            ["03", "Race", "Finish order"],
          ].map(([number, title, note], index) => (
            <div
              key={number}
              className="weekend-step border border-border bg-surface-02 p-4"
              style={{ "--lesson-index": index } as CSSProperties}
            >
              <span className="font-mono text-[11px] text-race-red">{number}</span>
              <p className="mt-5 font-display text-xl font-bold uppercase text-white">
                {title}
              </p>
              <p className="mt-1 text-sm text-text-muted">{note}</p>
            </div>
          ))}
        </div>
      </VisualFrame>
    );
  }

  if (kind === "race") {
    return (
      <VisualFrame label="Starting grid to finish">
        <div className="grid grid-cols-[1fr_auto] gap-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {["P1", "P2", "P3", "P4", "P5", "P6"].map((position, index) => (
              <div
                key={position}
                className="flex h-10 items-center border-l-2 border-border bg-surface-02 px-3"
              >
                <span className="font-mono text-xs text-text-muted">{position}</span>
                <span
                  className={
                    index === 0
                      ? "race-grid-car ml-auto h-2 w-10 bg-race-red"
                      : "race-grid-car ml-auto h-2 w-10 bg-text-muted/40"
                  }
                  style={{ "--lesson-index": index } as CSSProperties}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-between border-l border-border pl-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">
              Laps
            </span>
            <span className="font-display text-5xl font-extrabold text-white">56</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-race-red">
              P1 wins
            </span>
          </div>
        </div>
      </VisualFrame>
    );
  }

  if (kind === "overtaking") {
    return (
      <VisualFrame label="Overtaking opportunity">
        <div className="relative h-44 overflow-hidden border border-border bg-surface-02">
          <div className="absolute inset-x-5 top-1/2 h-px bg-border" />
          <div className="overtake-car-a absolute left-[18%] top-[44%] h-4 w-16 bg-white shadow-[0_0_14px_rgba(255,255,255,0.18)]" />
          <div className="overtake-car-b absolute left-[44%] top-[56%] h-4 w-16 bg-race-red shadow-[0_0_14px_rgba(225,6,0,0.25)]" />
          <div className="overtake-trace absolute left-[57%] top-[58%] h-px w-[20%] bg-race-red" />
          <div className="absolute right-[15%] top-[50%] h-20 w-px bg-text-muted/60" />
          <span className="absolute right-[8%] top-4 font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">
            Braking zone
          </span>
          <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">
            Straight → attack → brake
          </span>
        </div>
      </VisualFrame>
    );
  }

  if (kind === "tyres") {
    return (
      <VisualFrame label="Tyre compounds">
        <div className="grid grid-cols-3 gap-4">
          {[
            ["Soft", "border-race-red", "Speed"],
            ["Medium", "border-warning", "Balance"],
            ["Hard", "border-white", "Longer run"],
          ].map(([name, borderClass, note]) => (
            <div key={name} className="text-center">
              <div
                className={`tyre-spin mx-auto flex aspect-square max-w-28 items-center justify-center rounded-full border-[10px] ${borderClass} bg-surface-02`}
              >
                <span className="font-display text-lg font-bold uppercase text-white">
                  {name[0]}
                </span>
              </div>
              <p className="mt-4 font-display text-lg font-bold uppercase text-white">
                {name}
              </p>
              <p className="mt-1 text-sm text-text-muted">{note}</p>
            </div>
          ))}
        </div>
      </VisualFrame>
    );
  }

  if (kind === "flags") {
    return (
      <VisualFrame label="Race control signals">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <FlagTile label="Yellow" className="bg-warning text-warning-foreground" />
          <FlagTile label="Red" className="bg-race-red text-white" />
          <FlagTile label="Blue" className="bg-[#2457c5] text-white" />
          <FlagTile label="Finish" className="bg-white text-black" />
        </div>
        <div className="mt-4 border-l-2 border-race-red bg-surface-02 p-4">
          <p className="font-display text-xl font-bold uppercase text-white">Safety Car</p>
          <p className="mt-1 text-sm text-text-secondary">
            The field slows and bunches together while the track is made safe.
          </p>
        </div>
      </VisualFrame>
    );
  }

  return (
    <VisualFrame label="What to watch">
      <div className="relative grid gap-3 sm:grid-cols-2">
        {["The start", "Tyres & pits", "Overtaking areas", "Final laps"].map(
          (label, index) => (
            <div
              key={label}
              className="weekend-step flex min-h-16 items-center gap-4 border border-border bg-surface-02 px-4"
              style={{ "--lesson-index": index } as CSSProperties}
            >
              <span className="font-mono text-xs text-race-red">0{index + 1}</span>
              <span className="font-display text-lg font-bold uppercase text-white">
                {label}
              </span>
            </div>
          ),
        )}
      </div>
    </VisualFrame>
  );
}

function VisualFrame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="lesson-visual-enter rounded-[6px] border border-border bg-surface-01 p-5 sm:p-6">
      <p className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
        {label}
      </p>
      {children}
    </div>
  );
}

function FlagTile({ label, className }: { label: string; className: string }) {
  return (
    <div className={`flag-wave flex min-h-24 items-end p-3 ${className}`}>
      <span className="font-display text-lg font-bold uppercase">{label}</span>
    </div>
  );
}

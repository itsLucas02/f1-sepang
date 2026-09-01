import {
  SEPANG_TRACK_PATH,
  SEPANG_TRACK_VIEWBOX,
} from "@/lib/sepang-geometry";

export function LandingScene() {
  return (
    <div
      role="img"
      aria-label="Animated SEPANG 56 race opening with starting lights, a Formula-style car silhouette and the real Sepang circuit outline"
      className="relative min-h-[420px] w-full overflow-hidden rounded-[6px] border border-white/10 bg-[#0b0b10] sm:min-h-[520px] lg:min-h-[650px]"
    >
      <div className="race-grid absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="race-noise absolute inset-0 opacity-[0.14]" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -right-[12%] -top-[18%] h-[62%] w-[62%] rounded-full bg-race-red/20 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-[30%] left-[8%] h-[58%] w-[70%] rounded-full bg-white/[0.07] blur-[110px]"
      />

      <div className="absolute left-5 top-5 z-20 flex items-center gap-3 sm:left-7 sm:top-7">
        <span className="h-px w-7 bg-race-red" />
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-white/70 sm:text-[11px]">
          Sepang / Malaysia
        </span>
      </div>

      <div
        aria-hidden="true"
        className="absolute right-5 top-5 z-20 flex gap-1.5 rounded-[4px] border border-white/10 bg-black/40 p-2 backdrop-blur-sm sm:right-7 sm:top-7 sm:gap-2 sm:p-2.5"
      >
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className="hero-start-light block size-4 rounded-full border border-white/15 bg-[#3a0908] sm:size-5"
          />
        ))}
      </div>

      <svg
        aria-hidden="true"
        viewBox={SEPANG_TRACK_VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-[9%] h-[82%] w-[82%] translate-x-[5%] translate-y-[3%] -rotate-[7deg]"
        fill="none"
      >
        <g transform="translate(-99.972483,57.371556)">
          <g transform="matrix(0.6831882,0,0,0.6831882,-1707.7889,-493.83516)">
            <path
              d={SEPANG_TRACK_PATH}
              stroke="#000000"
              strokeWidth="32"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.55"
            />
            <path
              d={SEPANG_TRACK_PATH}
              pathLength={1}
              stroke="#FFFFFF"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.86"
              className="hero-track-draw"
            />
            <path
              d={SEPANG_TRACK_PATH}
              pathLength={1}
              stroke="#E10600"
              strokeWidth="17"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hero-track-accent"
            />
          </g>
        </g>
      </svg>

      <div
        aria-hidden="true"
        className="hero-speed-line absolute left-0 top-[47%] h-px w-[76%] bg-gradient-to-r from-transparent via-white/65 to-transparent"
      />
      <div
        aria-hidden="true"
        className="hero-speed-line absolute left-[8%] top-[51%] h-px w-[64%] bg-gradient-to-r from-transparent via-race-red/70 to-transparent [animation-delay:70ms]"
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 520 150"
        className="hero-car-pass absolute left-[12%] top-[39%] z-10 w-[76%] drop-shadow-[0_22px_22px_rgba(0,0,0,0.55)]"
      >
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M38 91h62l35-22 70-9 46-35h57l24 32 77 15 50 24h25"
            stroke="#ffffff"
            strokeWidth="8"
          />
          <path
            d="M113 96h288M210 60l21 36M335 59l-18 37"
            stroke="#E10600"
            strokeWidth="7"
          />
          <path
            d="M56 104h50M409 104h54"
            stroke="#ffffff"
            strokeWidth="15"
          />
          <circle cx="135" cy="103" r="24" stroke="#70707a" strokeWidth="11" />
          <circle cx="386" cy="103" r="24" stroke="#70707a" strokeWidth="11" />
          <path d="M226 59h91l-17-22h-49z" fill="#1a1a24" stroke="#ffffff" strokeWidth="5" />
          <path d="M238 36h65" stroke="#E10600" strokeWidth="5" />
        </g>
      </svg>

      <div
        aria-hidden="true"
        className="absolute -bottom-12 -right-2 font-display text-[11rem] font-extrabold leading-none tracking-[-0.07em] text-white/[0.055] sm:-bottom-16 sm:text-[17rem] lg:text-[21rem]"
      >
        56
      </div>

      <div className="absolute bottom-5 left-5 z-20 sm:bottom-7 sm:left-7">
        <p className="font-display text-2xl font-bold uppercase leading-none text-white sm:text-3xl">
          The race starts here.
        </p>
        <p className="mt-2 max-w-xs text-sm leading-5 text-white/60">
          Learn the language. Read the circuit. Make the call.
        </p>
      </div>

      <div
        aria-hidden="true"
        className="race-scanline pointer-events-none absolute inset-y-0 left-0 w-1/3"
      />
    </div>
  );
}

export function LandingScene() {
  return (
    <div
      role="img"
      aria-label="Sepang-inspired racing illustration"
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[6px] border border-border bg-surface-01 lg:aspect-[5/4]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-4 p-5 sm:p-6">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted sm:text-xs">
          Sepang / Malaysia
        </span>
        <span className="h-px w-16 bg-race-red sm:w-24" aria-hidden="true" />
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 640 480"
        className="absolute inset-0 h-full w-full p-8 sm:p-12"
        fill="none"
      >
        <path
          d="M117 309C87 283 82 239 105 207C129 174 171 170 210 190L297 235C335 255 378 250 409 220C442 188 459 143 503 132C548 121 585 145 588 181C591 214 565 238 535 254L476 286C443 304 421 332 427 362C433 390 414 410 389 410C361 410 342 389 349 363L365 311C371 291 354 276 334 283L258 311C229 322 212 342 188 350C159 360 136 340 117 309Z"
          stroke="currentColor"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-surface-03"
        />
        <path
          d="M117 309C87 283 82 239 105 207C129 174 171 170 210 190L297 235C335 255 378 250 409 220C442 188 459 143 503 132C548 121 585 145 588 181C591 214 565 238 535 254L476 286C443 304 421 332 427 362C433 390 414 410 389 410C361 410 342 389 349 363L365 311C371 291 354 276 334 283L258 311C229 322 212 342 188 350C159 360 136 340 117 309Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/75"
        />
        <path
          d="M494 136C532 123 568 140 584 167"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="text-race-red"
        />
      </svg>

      <div
        aria-hidden="true"
        className="absolute bottom-6 left-5 flex gap-2 sm:bottom-8 sm:left-6"
      >
        {[0, 1, 2, 3].map((slot) => (
          <span
            key={slot}
            className="block h-10 w-6 border border-white/10 bg-white/[0.025] sm:h-12 sm:w-7"
          />
        ))}
      </div>

      <span
        aria-hidden="true"
        className="absolute -bottom-8 right-3 font-display text-[9rem] font-extrabold leading-none text-white/[0.045] sm:-bottom-12 sm:text-[13rem]"
      >
        56
      </span>

      <div className="absolute bottom-5 right-5 text-right sm:bottom-6 sm:right-6">
        <p className="font-display text-lg font-bold uppercase leading-none text-white sm:text-xl">
          Sepang
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted sm:text-[11px]">
          Learn / Predict / Compete
        </p>
      </div>
    </div>
  );
}

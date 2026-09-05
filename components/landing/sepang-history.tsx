import { EditorialSectionHeading } from "@/components/landing/editorial-section-heading";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SiteContainer } from "@/components/shared/site-container";

const MOMENTS = [
  ["1999", "Drama", "The gift", "Schumacher returns from a broken leg, takes pole, then lets Eddie Irvine through late to preserve Ferrari's title bid."],
  ["2001", "Rain", "Monsoon recovery", "A sudden deluge spins both Ferraris. Safety-car chaos follows, then Schumacher recovers to lead a remarkable Ferrari one-two."],
  ["2003", "Milestone", "Iceman's first", "Kimi Räikkönen keeps his head in the heat and takes his maiden Formula 1 victory for McLaren."],
  ["2009", "Rain", "Half-points chaos", "The race is red-flagged after 31 laps in a storm. Jenson Button wins; only half points are awarded."],
  ["2012", "Drama", "Pérez closes in", "Sergio Pérez hunts down Fernando Alonso on the right tyres in the wet, before a late mistake ends the charge."],
  ["2013", "Infamous", "Multi 21", "Told to hold station behind Mark Webber, Sebastian Vettel attacks anyway. The podium turns glacial; the fallout lasts years."],
  ["2015", "Upset", "Ferrari strikes", "Vettel and Ferrari out-think Mercedes under the safety car for their first win together in the hybrid era."],
  ["2017", "Finale", "The last dance", "Max Verstappen wins the final Malaysian Grand Prix of Sepang's previous Formula 1 chapter."],
] as const;

export function SepangHistory() {
  return (
    <section aria-labelledby="sepang-history-title" className="relative overflow-hidden border-b border-white/8 bg-[#08090c]">
      <div className="race-grid pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
      <SiteContainer className="relative z-10 py-16 sm:py-20 lg:py-24">
        <ScrollReveal variant="slide-left">
          <div id="sepang-history-title">
            <EditorialSectionHeading
              number="05"
              eyebrow="Sepang lore — 1999 to 2017"
              title={<>A circuit with <span className="text-race-red">history.</span></>}
              description="Eight moments from Sepang&apos;s previous Formula 1 chapter—enough context to make the next one mean more."
            />
          </div>
        </ScrollReveal>

        <div className="relative mt-14 sm:mt-16">
          <div className="absolute bottom-0 left-5 top-0 w-px bg-white/14 md:left-1/2" aria-hidden="true" />
          <div className="space-y-10 md:space-y-0">
            {MOMENTS.map(([year, tag, title, detail], index) => {
              const left = index % 2 === 0;

              return (
                <ScrollReveal key={year} variant={left ? "slide-left" : "slide-right"} delay={70}>
                  <article className={`relative flex md:min-h-48 ${left ? "md:justify-start" : "md:justify-end"}`}>
                    <span className="absolute left-5 top-4 z-10 size-3 -translate-x-1/2 rotate-45 border border-race-red bg-[#08090c] md:left-1/2" aria-hidden="true" />
                    <div className={`ml-12 max-w-xl md:ml-0 md:w-[43%] ${left ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                      <p className="font-display text-6xl font-extrabold italic leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.3)] sm:text-7xl">
                        {year}
                      </p>
                      <p className="mt-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-race-red">
                        {tag}
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-extrabold uppercase italic leading-none text-white sm:text-3xl">{title}</h3>
                      <p className="mt-3 text-base leading-7 text-white/64">{detail}</p>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}

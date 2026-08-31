import Link from "next/link";

import { Button } from "@/components/ui/button";
import { RaceFooter } from "@/components/shared/race-footer";
import { RaceHeader } from "@/components/shared/race-header";
import { SiteContainer } from "@/components/shared/site-container";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <RaceHeader />

      <main className="flex flex-1 items-center">
        <SiteContainer className="py-24 md:py-32">
          <section className="max-w-3xl">
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.12em] text-race-red">
              Sepang / Malaysia
            </p>
            <h1 className="max-w-3xl font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-6xl lg:text-7xl">
              F1 Returns to Sepang
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-7 text-text-secondary">
              You don&apos;t need to know F1 to enjoy F1. Learn the basics,
              understand Sepang, make your picks and compete with your friends.
            </p>
            <div className="mt-8">
              <Button asChild>
                <Link href="/learn">Get Race Ready</Link>
              </Button>
            </div>
          </section>
        </SiteContainer>
      </main>

      <RaceFooter />
    </div>
  );
}

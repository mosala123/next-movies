import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { TmdbState } from "@/components/common/tmdb-state";
import { ContentRow3D } from "@/components/home/ContentRow3D";
import { HeroSection3D } from "@/components/home/HeroSection3D";
import { getGenreMap, getHomeSections, isTmdbConfigured } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Home",
  description: "Experience cinema with a fast, premium streaming-inspired interface powered by TMDB.",
};

function RowSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-56 animate-pulse rounded-lg bg-gradient-to-r from-white/10 to-white/5" />
      <div className="flex gap-5 overflow-hidden">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="h-72 w-48 flex-shrink-0 animate-pulse rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent shadow-2xl"
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

export default async function HomePage() {
  if (!isTmdbConfigured()) {
    return (
      <main className="container py-10 lg:py-12">
        <TmdbState title="TMDB is not configured" message="Add TMDB_API_KEY to your environment variables to load the home experience." />
      </main>
    );
  }

  try {
    const [sections, genreMap] = await Promise.all([getHomeSections(), getGenreMap()]);
    const heroItems = sections.flatMap((section) => section.items).slice(0, 5);

    return (
      <main className="space-y-16 pb-12 lg:space-y-20 lg:pb-16">
        <Suspense fallback={<HeroSkeleton />}>
          <div className="w-full">
            <HeroSection3D items={heroItems} />
          </div>
        </Suspense>

        <div className="container space-y-12 lg:space-y-16">
          <section className="surface-panel px-5 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3">
              {sections.map((section) => (
                <Link
                  key={section.id}
                  href={section.href ?? `#${section.id}`}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  {section.title}
                </Link>
              ))}
            </div>
          </section>

          <Suspense fallback={<RowSkeleton />}>
            <div className="space-y-12 lg:space-y-16">
              {sections.map((section, index) => (
                <div key={section.id} id={section.id} className={index === 0 ? "scroll-mt-32" : "scroll-mt-32 pt-4"}>
                  <ContentRow3D
                    title={section.title}
                    description={section.description}
                    items={section.items}
                    href={section.href}
                    genreMap={genreMap}
                    autoplay={index === 0}
                    autoplaySpeed={3200}
                  />
                </div>
              ))}
            </div>
          </Suspense>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="container py-10 lg:py-12">
        <TmdbState
          title="Home experience is temporarily unavailable"
          message={error instanceof Error ? error.message : "Unable to load TMDB content right now."}
        />
      </main>
    );
  }
}
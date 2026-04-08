import type { Metadata } from "next";

import { BrowseShowcase } from "@/components/common/browse-showcase";
import { TmdbState } from "@/components/common/tmdb-state";
import { getCuratedPlays, getGenreMap, searchMovies } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Plays",
};

type PlaysPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function PlaysPage({ searchParams }: PlaysPageProps) {
  try {
    const query = searchParams?.q?.trim();
    const [items, genreMap] = await Promise.all([query ? searchMovies(query) : getCuratedPlays(), getGenreMap()]);

    return (
      <BrowseShowcase
        title="Theatrical Plays"
        description={query ? `Search results for "${query}" across TMDB movies.` : "A dramatic lane for stage-inspired stories, prestige performances, and rich visual atmosphere."}
        items={items}
        genreMap={genreMap}
      />
    );
  } catch (error) {
    return <TmdbState title="Plays are temporarily unavailable" message={error instanceof Error ? error.message : "Unable to load curated plays right now."} />;
  }
}
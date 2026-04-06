import type { Metadata } from "next";

import { BrowseShowcase } from "@/components/common/browse-showcase";
import { TmdbState } from "@/components/common/tmdb-state";
import { getCuratedPlays, getGenreMap } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Plays",
};

export default async function PlaysPage() {
  try {
    const [items, genreMap] = await Promise.all([getCuratedPlays(), getGenreMap()]);

    return <BrowseShowcase title="Theatrical Plays" description="A dramatic lane for stage-inspired stories, prestige performances, and rich visual atmosphere." items={items} genreMap={genreMap} />;
  } catch (error) {
    return <TmdbState title="Plays are temporarily unavailable" message={error instanceof Error ? error.message : "Unable to load curated plays right now."} />;
  }
}
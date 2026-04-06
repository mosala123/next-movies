import type { Metadata } from "next";

import { BrowseShowcase } from "@/components/common/browse-showcase";
import { TmdbState } from "@/components/common/tmdb-state";
import { getGenreMap, getUpcomingMovies } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "New Releases",
};

export default async function NewReleasesPage() {
  try {
    const [items, genreMap] = await Promise.all([getUpcomingMovies(), getGenreMap()]);

    return <BrowseShowcase title="New Releases" description="Upcoming theatrical drops and fresh discovery lanes with a premium release spotlight." items={items} genreMap={genreMap} />;
  } catch (error) {
    return <TmdbState title="New releases are temporarily unavailable" message={error instanceof Error ? error.message : "Unable to load TMDB new releases right now."} />;
  }
}
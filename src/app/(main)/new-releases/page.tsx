import type { Metadata } from "next";

import { BrowseShowcase } from "@/components/common/browse-showcase";
import { TmdbState } from "@/components/common/tmdb-state";
import { getGenreMap, getUpcomingMovies, searchMovies } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "New Releases",
};

type NewReleasesPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function NewReleasesPage({ searchParams }: NewReleasesPageProps) {
  try {
    const query = searchParams?.q?.trim();
    const [items, genreMap] = await Promise.all([query ? searchMovies(query) : getUpcomingMovies(), getGenreMap()]);

    return (
      <BrowseShowcase
        title="New Releases"
        description={query ? `Search results for "${query}" across TMDB movies.` : "Upcoming theatrical drops and fresh discovery lanes with a premium release spotlight."}
        items={items}
        genreMap={genreMap}
      />
    );
  } catch (error) {
    return <TmdbState title="New releases are temporarily unavailable" message={error instanceof Error ? error.message : "Unable to load TMDB new releases right now."} />;
  }
}
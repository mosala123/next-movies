import type { Metadata } from "next";

import { BrowseShowcase } from "@/components/common/browse-showcase";
import { TmdbState } from "@/components/common/tmdb-state";
import { getGenreMap, getTopRatedMovies, searchMovies } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Top Rated",
};

type TopRatedPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function TopRatedPage({ searchParams }: TopRatedPageProps) {
  try {
    const query = searchParams?.q?.trim();
    const [items, genreMap] = await Promise.all([query ? searchMovies(query) : getTopRatedMovies(), getGenreMap()]);

    return (
      <BrowseShowcase
        title="Top Rated"
        description={query ? `Search results for "${query}" across TMDB movies.` : "Prestige films with the strongest critical and audience momentum on TMDB."}
        items={items}
        genreMap={genreMap}
      />
    );
  } catch (error) {
    return <TmdbState title="Top rated titles are temporarily unavailable" message={error instanceof Error ? error.message : "Unable to load top rated movies right now."} />;
  }
}
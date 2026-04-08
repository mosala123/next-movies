import type { Metadata } from "next";

import { BrowseShowcase } from "@/components/common/browse-showcase";
import { TmdbState } from "@/components/common/tmdb-state";
import { getGenreMap, getPopularMovies, searchMovies } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Movies",
};

type MoviesPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  try {
    const query = searchParams?.q?.trim();
    const [items, genreMap] = await Promise.all([query ? searchMovies(query) : getPopularMovies(), getGenreMap()]);

    return (
      <BrowseShowcase
        title="Movies"
        description={query ? `Search results for "${query}" across TMDB movies.` : "Popular films with live TMDB data, cinematic depth, and a polished browse layout."}
        items={items}
        genreMap={genreMap}
      />
    );
  } catch (error) {
    return (
      <TmdbState
        title="Movies are temporarily unavailable"
        message={error instanceof Error ? error.message : "Unable to load TMDB movies right now."}
      />
    );
  }
}
import type { Metadata } from "next";

import { BrowseShowcase } from "@/components/common/browse-showcase";
import { TmdbState } from "@/components/common/tmdb-state";
import { getGenreMap, getPopularMovies } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Movies",
};

export default async function MoviesPage() {
  try {
    const [items, genreMap] = await Promise.all([getPopularMovies(), getGenreMap()]);

    return (
      <BrowseShowcase
        title="Movies"
        description="Popular films with live TMDB data, cinematic depth, and a polished browse layout."
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
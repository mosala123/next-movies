import type { Metadata } from "next";

import { BrowseShowcase } from "@/components/common/browse-showcase";
import { TmdbState } from "@/components/common/tmdb-state";
import { getGenreMap, getPopularSeries } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Series",
};

export default async function SeriesPage() {
  try {
    const [items, genreMap] = await Promise.all([getPopularSeries(), getGenreMap()]);

    return (
      <BrowseShowcase
        title="Series"
        description="Binge-worthy television worlds presented with cinematic browse cards and deeper visual rhythm."
        items={items}
        genreMap={genreMap}
      />
    );
  } catch (error) {
    return <TmdbState title="Series are temporarily unavailable" message={error instanceof Error ? error.message : "Unable to load TMDB series right now."} />;
  }
}
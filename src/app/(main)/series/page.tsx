import type { Metadata } from "next";

import { BrowseShowcase } from "@/components/common/browse-showcase";
import { TmdbState } from "@/components/common/tmdb-state";
import { getGenreMap, getPopularSeries, searchSeries } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Series",
};

type SeriesPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function SeriesPage({ searchParams }: SeriesPageProps) {
  try {
    const query = searchParams?.q?.trim();
    const [items, genreMap] = await Promise.all([query ? searchSeries(query) : getPopularSeries(), getGenreMap()]);

    return (
      <BrowseShowcase
        title="Series"
        description={query ? `Search results for "${query}" across TMDB series.` : "Binge-worthy television worlds presented with cinematic browse cards and deeper visual rhythm."}
        items={items}
        genreMap={genreMap}
      />
    );
  } catch (error) {
    return <TmdbState title="Series are temporarily unavailable" message={error instanceof Error ? error.message : "Unable to load TMDB series right now."} />;
  }
}
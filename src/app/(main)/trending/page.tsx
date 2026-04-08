import type { Metadata } from "next";

import { BrowseShowcase } from "@/components/common/browse-showcase";
import { TmdbState } from "@/components/common/tmdb-state";
import { getGenreMap, getTrendingMedia, searchMedia } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Trending",
};

type TrendingPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function TrendingPage({ searchParams }: TrendingPageProps) {
  try {
    const query = searchParams?.q?.trim();
    const [items, genreMap] = await Promise.all([query ? searchMedia(query) : getTrendingMedia(), getGenreMap()]);

    return (
      <BrowseShowcase
        title="Trending"
        description={query ? `Search results for "${query}" across TMDB movies and series.` : "The titles shaping discovery feeds and weekly conversation right now."}
        items={items}
        genreMap={genreMap}
      />
    );
  } catch (error) {
    return <TmdbState title="Trending titles are temporarily unavailable" message={error instanceof Error ? error.message : "Unable to load trending titles right now."} />;
  }
}
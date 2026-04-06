import type { Metadata } from "next";

import { BrowseShowcase } from "@/components/common/browse-showcase";
import { TmdbState } from "@/components/common/tmdb-state";
import { getGenreMap, getTrendingMedia } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Trending",
};

export default async function TrendingPage() {
  try {
    const [items, genreMap] = await Promise.all([getTrendingMedia(), getGenreMap()]);

    return <BrowseShowcase title="Trending" description="The titles shaping discovery feeds and weekly conversation right now." items={items} genreMap={genreMap} />;
  } catch (error) {
    return <TmdbState title="Trending titles are temporarily unavailable" message={error instanceof Error ? error.message : "Unable to load trending titles right now."} />;
  }
}
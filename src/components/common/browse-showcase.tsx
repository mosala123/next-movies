import type { MediaItem } from "@/types/tmdb";

import { BrowseShowcaseClient } from "@/components/common/browse-showcase-client";

type BrowseShowcaseProps = {
  title: string;
  description: string;
  items: MediaItem[];
  genreMap?: Map<number, string>;
};

export function BrowseShowcase({ title, description, items, genreMap }: BrowseShowcaseProps) {
  return (
    <BrowseShowcaseClient
      title={title}
      description={description}
      items={items}
      genreEntries={genreMap ? Array.from(genreMap.entries()) : []}
    />
  );
}
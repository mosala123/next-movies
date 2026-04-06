import Image from "next/image";
import Link from "next/link";

import { Star } from "lucide-react";

import { formatReleaseYear, formatVote, getLanguageLabel, getTmdbImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/types/tmdb";

type MediaCardProps = {
  item: MediaItem;
  genreMap?: Map<number, string>;
  priority?: boolean;
  className?: string;
};

export function MediaCard({ item, genreMap, priority = false, className }: MediaCardProps) {
  const posterUrl = getTmdbImageUrl(item.posterPath);
  const genreName = item.genreIds.map((genreId) => genreMap?.get(genreId)).find(Boolean);

  return (
    <Link
      href={`/${item.mediaType}/${item.id}`}
      className={cn(
        "tilt-panel group relative block min-w-[220px] overflow-hidden rounded-[24px] border border-white/10 bg-card/80 shadow-xl shadow-black/20",
        className,
      )}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={item.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-background text-sm text-muted-foreground">
            Poster unavailable
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,12,0.08)_0%,rgba(5,8,12,0.25)_34%,rgba(5,8,12,0.96)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent opacity-80" />
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white/80">
            {getLanguageLabel(item.originalLanguage)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-accent">
            <Star className="h-3.5 w-3.5 fill-current" />
            {formatVote(item.voteAverage)}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="line-clamp-1 text-lg font-semibold text-white">{item.title}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-white/75">
            <span>{formatReleaseYear(item.releaseDate)}</span>
            {genreName ? <span className="rounded-full border border-white/10 px-2 py-1">{genreName}</span> : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

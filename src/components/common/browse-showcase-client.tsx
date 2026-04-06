"use client";

import { useDeferredValue, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

import { MediaCard } from "@/components/common/media-card";
import { SectionHeading } from "@/components/common/section-heading";
import { Input } from "@/components/ui/input";
import { formatReleaseYear, formatVote, getLanguageLabel, getTmdbImageUrl } from "@/lib/tmdb";
import type { MediaItem } from "@/types/tmdb";

type BrowseShowcaseClientProps = {
  title: string;
  description: string;
  items: MediaItem[];
  genreEntries: Array<[number, string]>;
};

function sortItems(items: MediaItem[], sortBy: string) {
  const sorted = [...items];

  switch (sortBy) {
    case "rating":
      sorted.sort((a, b) => b.voteAverage - a.voteAverage || b.voteCount - a.voteCount);
      break;
    case "newest":
      sorted.sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? ""));
      break;
    case "title":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      sorted.sort((a, b) => b.popularity - a.popularity || b.voteAverage - a.voteAverage);
      break;
  }

  return sorted;
}

export function BrowseShowcaseClient({ title, description, items, genreEntries }: BrowseShowcaseClientProps) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedMediaType, setSelectedMediaType] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const deferredQuery = useDeferredValue(query);
  const genreMap = new Map(genreEntries);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const availableGenres = Array.from(
    new Set(items.flatMap((item) => item.genreIds.map((genreId) => genreMap.get(genreId)).filter(Boolean) as string[])),
  ).sort((a, b) => a.localeCompare(b));

  const availableLanguages = Array.from(new Set(items.map((item) => getLanguageLabel(item.originalLanguage)))).sort((a, b) => a.localeCompare(b));
  const availableMediaTypes = Array.from(new Set(items.map((item) => item.mediaType)));

  const filteredItems = sortItems(
    items.filter((item) => {
      const matchesQuery = !deferredQuery.trim()
        || [item.title, item.originalTitle, item.overview].some((value) => value.toLowerCase().includes(deferredQuery.trim().toLowerCase()));
      const matchesGenre = selectedGenre === "all" || item.genreIds.some((genreId) => genreMap.get(genreId) === selectedGenre);
      const matchesLanguage = selectedLanguage === "all" || getLanguageLabel(item.originalLanguage) === selectedLanguage;
      const matchesMediaType = selectedMediaType === "all" || item.mediaType === selectedMediaType;

      return matchesQuery && matchesGenre && matchesLanguage && matchesMediaType;
    }),
    sortBy,
  );

  const featured = filteredItems[0] ?? items[0];
  const backdropUrl = featured ? getTmdbImageUrl(featured.backdropPath, "backdrop") : null;
  const spotlight = filteredItems.slice(0, 3);

  const resetFilters = () => {
    setQuery(searchParams.get("q") ?? "");
    setSelectedGenre("all");
    setSelectedLanguage("all");
    setSelectedMediaType("all");
    setSortBy("popularity");
  };

  return (
    <main className="container space-y-8 py-6 sm:space-y-10 lg:space-y-12 lg:py-8">
      <section className="surface-panel cinematic-shell relative overflow-hidden px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="cinematic-orb absolute -right-20 top-10 h-56 w-56 rounded-full blur-3xl" />
        <div className="cinematic-orb absolute -left-12 bottom-0 h-40 w-40 rounded-full blur-3xl" />
        {backdropUrl ? (
          <div className="absolute inset-0 opacity-25">
            <Image src={backdropUrl} alt={featured?.title ?? title} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,10,14,0.96)_18%,rgba(8,10,14,0.74)_58%,rgba(8,10,14,0.96)_100%)]" />
          </div>
        ) : null}

        <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-3xl space-y-5">
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/75">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary">
                <Sparkles className="h-4 w-4" />
                Refined Browse
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{filteredItems.length} titles</span>
              {featured ? <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Featured {formatReleaseYear(featured.releaseDate)}</span> : null}
            </div>

            <SectionHeading title={title} description={description} />

            {featured ? (
              <div className="flex flex-wrap gap-3 text-sm text-white/75">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">TMDB {formatVote(featured.voteAverage)}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{getLanguageLabel(featured.originalLanguage)}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 capitalize">{featured.mediaType}</span>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {spotlight.map((item, index) => (
              <article key={`${item.mediaType}-${item.id}`} className="glass-panel tilt-panel px-4 py-4" style={{ animationDelay: `${index * 110}ms` }}>
                <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Spotlight {index + 1}</p>
                <h3 className="mt-3 line-clamp-1 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/65">{item.overview || "Overview unavailable right now."}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-panel space-y-5 px-5 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-primary">Filters</p>
            <p className="mt-2 text-sm text-white/65">Search, narrow down, and sort titles instantly without leaving the page.</p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Reset filters
          </button>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${title.toLowerCase()}`}
              className="rounded-2xl border-white/10 bg-white/5 pl-11"
            />
          </label>

          <label className="relative block">
            <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
            <select
              value={selectedGenre}
              onChange={(event) => setSelectedGenre(event.target.value)}
              className="h-11 w-full appearance-none rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition focus:border-primary/60"
            >
              <option value="all">All genres</option>
              {availableGenres.map((genre) => (
                <option key={genre} value={genre} className="bg-slate-950 text-white">{genre}</option>
              ))}
            </select>
          </label>

          <select
            value={selectedLanguage}
            onChange={(event) => setSelectedLanguage(event.target.value)}
            className="h-11 w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-primary/60"
          >
            <option value="all">All languages</option>
            {availableLanguages.map((language) => (
              <option key={language} value={language} className="bg-slate-950 text-white">{language}</option>
            ))}
          </select>

          <select
            value={selectedMediaType}
            onChange={(event) => setSelectedMediaType(event.target.value)}
            className="h-11 w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-primary/60"
            disabled={availableMediaTypes.length < 2}
          >
            <option value="all">All formats</option>
            {availableMediaTypes.map((mediaType) => (
              <option key={mediaType} value={mediaType} className="bg-slate-950 text-white">{mediaType}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="h-11 w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-primary/60"
          >
            <option value="popularity">Sort by popularity</option>
            <option value="rating">Sort by rating</option>
            <option value="newest">Sort by newest</option>
            <option value="title">Sort by title</option>
          </select>
        </div>
      </section>

      {filteredItems.length ? (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item, index) => (
            <MediaCard key={`${item.mediaType}-${item.id}`} item={item} priority={index < 4} className="min-w-0" genreMap={genreMap} />
          ))}
        </section>
      ) : (
        <section className="surface-panel px-6 py-12 text-center sm:px-8">
          <h2 className="text-2xl font-semibold text-white">No titles matched your filters</h2>
          <p className="mt-3 text-sm leading-7 text-white/65">Try a different keyword, language, or genre to widen the results.</p>
        </section>
      )}
    </main>
  );
}
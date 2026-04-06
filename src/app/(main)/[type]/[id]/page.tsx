import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ExternalLink, PlayCircle, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatReleaseYear,
  formatRuntime,
  formatVote,
  getMediaCredits,
  getMediaDetails,
  getMediaVideos,
  getMediaWatchLinks,
  getTmdbImageUrl,
  isTmdbConfigured,
  pickPreferredVideo,
} from "@/lib/tmdb";
import type { MediaType } from "@/types/tmdb";

const validTypes = new Set<MediaType>(["movie", "tv", "play"]);

type DetailsPageProps = {
  params: {
    type: string;
    id: string;
  };
};

export async function generateMetadata({ params }: DetailsPageProps): Promise<Metadata> {
  const numericId = Number(params.id);

  if (Number.isNaN(numericId) || !validTypes.has(params.type as MediaType)) {
    return { title: "Not Found" };
  }

  try {
    const item = await getMediaDetails(params.type as MediaType, numericId);
    return {
      title: item.title,
      description: item.overview?.slice(0, 160) || `Discover ${item.title} on Movie Next.`,
    };
  } catch {
    return { title: "Movie Next" };
  }
}

export default async function DetailsPage({ params }: DetailsPageProps) {
  if (!validTypes.has(params.type as MediaType)) {
    notFound();
  }

  const numericId = Number(params.id);
  if (Number.isNaN(numericId)) {
    notFound();
  }

  if (!isTmdbConfigured()) {
    return (
      <main className="container py-6 lg:py-8">
        <section className="surface-panel px-6 py-8 sm:px-8 sm:py-10">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-primary">TMDB Status</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">TMDB API Key Missing</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Add TMDB_API_KEY to your environment variables to load title details.</p>
        </section>
      </main>
    );
  }

  const [item, videos, cast, watchLinks] = await Promise.all([
    getMediaDetails(params.type as MediaType, numericId).catch(() => null),
    getMediaVideos(params.type as MediaType, numericId).catch(() => []),
    getMediaCredits(params.type as MediaType, numericId).catch(() => []),
    getMediaWatchLinks(params.type as MediaType, numericId).catch(() => []),
  ]);

  if (!item) {
    notFound();
  }

  const preferredVideo = pickPreferredVideo(videos);
  const backdropUrl = getTmdbImageUrl(item.backdropPath, "backdrop") ?? getTmdbImageUrl(item.posterPath, "backdrop");
  const posterUrl = getTmdbImageUrl(item.posterPath);
  const metaPills = [
    `Release ${formatReleaseYear(item.releaseDate)}`,
    `TMDB ${formatVote(item.voteAverage)}`,
    item.runtime ? formatRuntime(item.runtime) : null,
    item.status ?? null,
  ].filter(Boolean);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {backdropUrl ? (
        <div className="absolute inset-0">
          <Image src={backdropUrl} alt={item.title} fill className="object-cover opacity-20" sizes="100vw" priority />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,14,0.22)_0%,rgba(8,10,14,0.84)_40%,rgba(8,10,14,1)_100%)]" />
        </div>
      ) : null}

      <div className="container relative space-y-8 py-6 lg:space-y-10 lg:py-8">
        <section className="grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
          <div className="relative mx-auto aspect-[2/3] w-full max-w-[320px] overflow-hidden rounded-[28px] border border-white/10 bg-card shadow-2xl shadow-black/25">
            {posterUrl ? <Image src={posterUrl} alt={item.title} fill sizes="320px" className="object-cover" priority /> : null}
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.35em] text-primary">{item.mediaType} details</p>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">{item.title}</h1>
              {item.tagline ? <p className="text-lg italic text-white/75">{item.tagline}</p> : null}
              <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">{item.overview || "Synopsis unavailable right now."}</p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-white/75">
              {metaPills.map((pill) => (
                <span key={pill} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{pill}</span>
              ))}
            </div>

            {item.genres?.length ? (
              <div className="flex flex-wrap gap-3 text-sm text-white/80">
                {item.genres.map((genre) => (
                  <span key={genre} className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2">{genre}</span>
                ))}
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {preferredVideo?.url ? (
                <Button asChild className="rounded-full px-6">
                  <Link href={preferredVideo.url} target="_blank" rel="noreferrer">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Watch trailer
                  </Link>
                </Button>
              ) : null}

              {item.homepage ? (
                <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                  <Link href={item.homepage} target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Official page
                  </Link>
                </Button>
              ) : null}

              {watchLinks[0] ? (
                <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                  <Link href={watchLinks[0].url} target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Streaming options
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
          <div className="surface-panel overflow-hidden p-3 sm:p-4">
            {preferredVideo?.embedUrl ? (
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/40">
                <div className="aspect-video">
                  <iframe
                    src={preferredVideo.embedUrl}
                    title={preferredVideo.name}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="h-full w-full"
                  />
                </div>
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/5 p-6 text-center">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Inline trailer unavailable</h2>
                  <p className="mt-3 text-sm leading-7 text-white/65">
                    When TMDB provides an embeddable trailer, it will appear here. Until then you can use the external watch links above.
                  </p>
                </div>
              </div>
            )}
          </div>

          <aside className="surface-panel p-6">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-primary">Watch Links</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Open in this page or a new tab</h2>
            <p className="mt-3 text-sm leading-7 text-white/65">
              If the trailer supports embedding, we play it here. Otherwise the external buttons open the best available TMDB watch page or official link in a separate tab.
            </p>

            <div className="mt-5 grid gap-3">
              {watchLinks.length ? (
                watchLinks.map((link) => (
                  <Link
                    key={`${link.region}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10"
                  >
                    {link.label}
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-4 text-sm text-white/60">
                  Streaming links are not available for this title right now.
                </div>
              )}
            </div>
          </aside>
        </section>

        <section className="surface-panel p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.35em] text-primary">Cast</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Actors and characters</h2>
            </div>
          </div>

          {cast.length ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cast.map((person) => {
                const profileUrl = getTmdbImageUrl(person.profilePath);

                return (
                  <article key={person.id} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-[20px] bg-white/5">
                      {profileUrl ? (
                        <Image src={profileUrl} alt={person.name} fill sizes="240px" className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-white/45">No image</div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{person.name}</h3>
                    <p className="mt-1 text-sm text-white/65">{person.character}</p>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="mt-6 text-sm text-white/65">Cast information is unavailable for this title right now.</p>
          )}
        </section>
      </div>
    </main>
  );
}
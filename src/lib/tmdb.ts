import type {
  HomeSection,
  MediaCredit,
  MediaItem,
  MediaType,
  MediaVideo,
  MediaWatchLink,
  TMDBCastResult,
  TMDBGenre,
  TMDBListResponse,
  TMDBMovieDetails,
  TMDBMovieResult,
  TMDBTVDetails,
  TMDBTVResult,
  TMDBVideoResult,
  TMDBWatchProviderRegion,
} from "@/types/tmdb";

const TMDB_API_BASE = "https://api.themoviedb.org/3";
const TMDB_REQUEST_TIMEOUT_MS = 8000;
const curatedPlayIds = [586347, 54138, 796499, 1077093, 76492, 877817];

function getTmdbApiKey() {
  return process.env.TMDB_API_KEY ?? process.env.NEXT_PUBLIC_TMDB_API_KEY ?? "";
}

export function isTmdbConfigured() {
  return Boolean(getTmdbApiKey());
}

function buildTmdbUrl(path: string, params?: Record<string, string | number | undefined>) {
  const apiKey = getTmdbApiKey();

  if (!apiKey) {
    throw new Error("TMDB_API_KEY is missing. Add TMDB_API_KEY to your environment variables.");
  }

  const searchParams = new URLSearchParams({
    api_key: apiKey,
    include_adult: "false",
    ...Object.fromEntries(Object.entries(params ?? {}).flatMap(([key, value]) => (value === undefined ? [] : [[key, String(value)]]))),
  });

  return `${TMDB_API_BASE}${path}?${searchParams.toString()}`;
}

async function tmdbFetch<T>(path: string, params?: Record<string, string | number | undefined>, revalidate = 1800) {
  try {
    const response = await fetch(buildTmdbUrl(path, params), {
      next: { revalidate },
      signal: AbortSignal.timeout(TMDB_REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`TMDB request failed for ${path} with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error(`TMDB request timed out for ${path}.`);
    }

    throw error;
  }
}

function normalizeMovie(movie: TMDBMovieResult, mediaType: MediaType = "movie"): MediaItem {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    genreIds: movie.genre_ids ?? [],
    mediaType,
    originalLanguage: movie.original_language,
    popularity: movie.popularity,
    adult: movie.adult,
    genres: [],
    runtime: null,
    status: undefined,
    tagline: undefined,
    homepage: undefined,
  };
}

function normalizeTV(show: TMDBTVResult): MediaItem {
  return {
    id: show.id,
    title: show.name,
    originalTitle: show.original_name,
    overview: show.overview,
    posterPath: show.poster_path,
    backdropPath: show.backdrop_path,
    releaseDate: show.first_air_date,
    voteAverage: show.vote_average,
    voteCount: show.vote_count,
    genreIds: show.genre_ids ?? [],
    mediaType: "tv",
    originalLanguage: show.original_language,
    popularity: show.popularity,
    adult: show.adult,
    genres: [],
    runtime: null,
    status: undefined,
    tagline: undefined,
    homepage: undefined,
  };
}

function normalizeMovieDetails(movie: TMDBMovieDetails, mediaType: MediaType = "movie"): MediaItem {
  return {
    ...normalizeMovie(movie, mediaType),
    genres: movie.genres?.map((genre) => genre.name) ?? [],
    runtime: movie.runtime ?? null,
    status: movie.status,
    tagline: movie.tagline,
    homepage: movie.homepage,
  };
}

function normalizeTVDetails(show: TMDBTVDetails): MediaItem {
  return {
    ...normalizeTV(show),
    genres: show.genres?.map((genre) => genre.name) ?? [],
    runtime: show.episode_run_time?.[0] ?? null,
    status: show.status,
    tagline: show.tagline,
    homepage: show.homepage,
  };
}

export function getTmdbImageUrl(path: string | null | undefined, variant: "poster" | "backdrop" = "poster") {
  if (!path) {
    return null;
  }

  const size = variant === "backdrop" ? "original" : "w500";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export async function getMovieGenres() {
  const data = await tmdbFetch<{ genres: TMDBGenre[] }>("/genre/movie/list", { language: "en-US" });
  return data.genres;
}

export async function getTvGenres() {
  const data = await tmdbFetch<{ genres: TMDBGenre[] }>("/genre/tv/list", { language: "en-US" });
  return data.genres;
}

async function getMovieList(path: string, params?: Record<string, string | number | undefined>, mediaType: MediaType = "movie") {
  const data = await tmdbFetch<TMDBListResponse<TMDBMovieResult>>(path, { language: "en-US", page: 1, ...params });
  return data.results.map((item) => normalizeMovie(item, mediaType));
}

async function getTvList(path: string, params?: Record<string, string | number | undefined>) {
  const data = await tmdbFetch<TMDBListResponse<TMDBTVResult>>(path, { language: "en-US", page: 1, ...params });
  return data.results.map((item) => normalizeTV(item));
}

export const getPopularMovies = () => getMovieList("/movie/popular");
export const getTopRatedMovies = () => getMovieList("/movie/top_rated");
export const getUpcomingMovies = () => getMovieList("/movie/upcoming");
export const getNowPlayingMovies = () => getMovieList("/movie/now_playing");
export const getPopularSeries = () => getTvList("/tv/popular");
export const getTopRatedSeries = () => getTvList("/tv/top_rated");
export const getArabicMovies = () => getMovieList("/discover/movie", { language: "ar-EG", sort_by: "popularity.desc", with_original_language: "ar" });
export const getArabicSeries = () => getTvList("/discover/tv", { language: "ar-EG", sort_by: "popularity.desc", with_original_language: "ar" });
export const getDocumentaries = () => getMovieList("/discover/movie", { with_genres: 99, sort_by: "popularity.desc" });
export const searchMovies = (query: string) => getMovieList("/search/movie", { query });
export const searchSeries = (query: string) => getTvList("/search/tv", { query });

export async function searchMedia(query: string) {
  const data = await tmdbFetch<TMDBListResponse<TMDBMovieResult & Partial<TMDBTVResult> & { media_type?: string }>>("/search/multi", {
    language: "en-US",
    query,
  });

  return data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => (item.media_type === "tv" ? normalizeTV(item as TMDBTVResult) : normalizeMovie(item)));
}

export async function getTrendingMedia() {
  const data = await tmdbFetch<TMDBListResponse<TMDBMovieResult & Partial<TMDBTVResult> & { media_type?: string }>>("/trending/all/week", {
    language: "en-US",
  });

  return data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => (item.media_type === "tv" ? normalizeTV(item as TMDBTVResult) : normalizeMovie(item)));
}

export async function getCuratedPlays() {
  const plays = await Promise.all(curatedPlayIds.map((id) => tmdbFetch<TMDBMovieResult>(`/movie/${id}`, { language: "en-US" })));
  return plays.map((item) => normalizeMovie({ ...item, genre_ids: item.genre_ids ?? [] }, "play"));
}

export async function getMediaDetails(type: MediaType, id: number) {
  if (type === "tv") {
    const data = await tmdbFetch<TMDBTVDetails>(`/tv/${id}`, { language: "en-US" });
    return normalizeTVDetails(data);
  }

  const data = await tmdbFetch<TMDBMovieDetails>(`/movie/${id}`, { language: "en-US" });
  return normalizeMovieDetails(data, type);
}

function toVideoUrl(video: TMDBVideoResult) {
  if (video.site === "YouTube") {
    return {
      url: `https://www.youtube.com/watch?v=${video.key}`,
      embedUrl: `https://www.youtube.com/embed/${video.key}?autoplay=1&rel=0`,
    };
  }

  if (video.site === "Vimeo") {
    return {
      url: `https://vimeo.com/${video.key}`,
      embedUrl: `https://player.vimeo.com/video/${video.key}?autoplay=1`,
    };
  }

  return { url: null, embedUrl: null };
}

export async function getMediaVideos(type: MediaType, id: number): Promise<MediaVideo[]> {
  const endpoint = type === "tv" ? `/tv/${id}/videos` : `/movie/${id}/videos`;
  const data = await tmdbFetch<{ results: TMDBVideoResult[] }>(endpoint, { language: "en-US" }, 3600);

  return data.results.map((video) => ({
    id: video.id,
    key: video.key,
    name: video.name,
    site: video.site,
    type: video.type,
    official: video.official,
    publishedAt: video.published_at,
    ...toVideoUrl(video),
  }));
}

export async function getMediaCredits(type: MediaType, id: number): Promise<MediaCredit[]> {
  const endpoint = type === "tv" ? `/tv/${id}/credits` : `/movie/${id}/credits`;
  const data = await tmdbFetch<{ cast: TMDBCastResult[] }>(endpoint, { language: "en-US" }, 3600);

  return data.cast.slice(0, 12).map((person) => ({
    id: person.id,
    name: person.name,
    character: person.character ?? "Cast",
    profilePath: person.profile_path,
  }));
}

export async function getMediaWatchLinks(type: MediaType, id: number): Promise<MediaWatchLink[]> {
  const endpoint = type === "tv" ? `/tv/${id}/watch/providers` : `/movie/${id}/watch/providers`;
  const data = await tmdbFetch<{ results: Record<string, TMDBWatchProviderRegion> }>(endpoint, undefined, 3600);
  const regions = ["EG", "US", "GB"];

  return regions
    .map((region) => {
      const regionData = data.results?.[region];
      if (!regionData?.link) {
        return null;
      }

      return {
        region,
        label: `Open streaming options (${region})`,
        url: regionData.link,
      };
    })
    .filter((link): link is MediaWatchLink => Boolean(link));
}

export function pickPreferredVideo(videos: MediaVideo[]) {
  const score = (video: MediaVideo) => {
    let total = 0;

    if (video.site === "YouTube") total += 5;
    if (video.official) total += 4;
    if (video.type === "Trailer") total += 3;
    if (video.type === "Teaser") total += 2;
    if (video.embedUrl) total += 1;

    return total;
  };

  return [...videos].sort((a, b) => score(b) - score(a))[0] ?? null;
}

export function formatVote(voteAverage: number) {
  return voteAverage.toFixed(1);
}

export function formatReleaseYear(releaseDate: string | null) {
  return releaseDate ? new Date(releaseDate).getFullYear().toString() : "TBA";
}

export function formatRuntime(runtime?: number | null) {
  if (!runtime) {
    return null;
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (!hours) {
    return `${minutes}m`;
  }

  if (!minutes) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

export function getLanguageLabel(language: string) {
  if (language.startsWith("ar")) return "Arabic";
  if (language.startsWith("en")) return "English";
  return language.toUpperCase();
}

export async function getGenreMap() {
  const [movieGenres, tvGenres] = await Promise.all([getMovieGenres(), getTvGenres()]);
  return new Map([...movieGenres, ...tvGenres].map((genre) => [genre.id, genre.name]));
}

export async function getHomeSections(): Promise<HomeSection[]> {
  const [trending, nowPlaying, topMovies, topSeries, arabicMovies, plays, documentaries] = await Promise.all([
    getTrendingMedia(),
    getNowPlayingMovies(),
    getTopRatedMovies(),
    getTopRatedSeries(),
    getArabicMovies(),
    getCuratedPlays(),
    getDocumentaries(),
  ]);

  return [
    { id: "trending", title: "Trending This Week", description: "The conversation-driving releases everyone is watching right now.", href: "/trending", items: trending.slice(0, 12) },
    { id: "now-playing", title: "Now Playing", description: "Fresh theatrical energy with blockbuster momentum and premium visuals.", href: "/new-releases", items: nowPlaying.slice(0, 12) },
    { id: "top-movies", title: "Top Rated Movies", description: "Critically loved films with staying power.", href: "/top-rated", items: topMovies.slice(0, 12) },
    { id: "top-series", title: "Prestige Series", description: "Highly rated television worlds worth getting lost in.", href: "/series", items: topSeries.slice(0, 12) },
    { id: "arabic", title: "Arabic Spotlight", description: "A dedicated showcase for Arabic cinema and television.", href: "/movies", items: arabicMovies.slice(0, 12) },
    { id: "plays", title: "Theatrical Plays", description: "Stage-inspired viewing with a dramatic, curated angle.", href: "/plays", items: plays },
    { id: "documentaries", title: "Documentaries", description: "Fact-driven stories with cinematic weight.", href: "/movies", items: documentaries.slice(0, 12) },
  ];
}
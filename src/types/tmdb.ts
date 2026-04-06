export type MediaType = "movie" | "tv" | "play";

export type MediaItem = {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  mediaType: MediaType;
  originalLanguage: string;
  popularity: number;
  adult: boolean;
  genres?: string[];
  runtime?: number | null;
  status?: string;
  tagline?: string;
  homepage?: string;
};

export type MediaVideo = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  publishedAt?: string;
  url: string | null;
  embedUrl: string | null;
};

export type MediaCredit = {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
};

export type MediaWatchLink = {
  region: string;
  label: string;
  url: string;
};

export type TMDBListResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type TMDBGenre = {
  id: number;
  name: string;
};

export type TMDBMovieResult = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string | null;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  original_language: string;
  popularity: number;
  adult: boolean;
};

export type TMDBTVResult = {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string | null;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  original_language: string;
  popularity: number;
  adult: boolean;
};

export type TMDBMovieDetails = TMDBMovieResult & {
  genres?: TMDBGenre[];
  runtime?: number | null;
  status?: string;
  tagline?: string;
  homepage?: string;
};

export type TMDBTVDetails = TMDBTVResult & {
  genres?: TMDBGenre[];
  episode_run_time?: number[];
  status?: string;
  tagline?: string;
  homepage?: string;
};

export type TMDBVideoResult = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at?: string;
};

export type TMDBCastResult = {
  id: number;
  name: string;
  character?: string;
  profile_path: string | null;
};

export type TMDBWatchProviderRegion = {
  link?: string;
};

export type HomeSection = {
  id: string;
  title: string;
  description: string;
  href?: string;
  items: MediaItem[];
};
export type WatchlistStatus = "plan_to_watch" | "watching" | "completed";

export type AppUserProfile = {
  userId: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: string;
  bio: string;
  favoriteGenres: string[];
};

export type RatingDocument = {
  userId: string;
  contentId: number;
  contentType: "movie" | "tv" | "play";
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export type ReviewDocument = {
  reviewId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  contentId: number;
  contentType: "movie" | "tv" | "play";
  contentTitle: string;
  rating: number;
  reviewText: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
};

export type WatchlistDocument = {
  userId: string;
  contentId: number;
  contentType: "movie" | "tv" | "play";
  contentTitle: string;
  posterPath: string;
  status: WatchlistStatus;
  addedAt: string;
};

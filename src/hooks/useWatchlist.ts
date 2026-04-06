"use client";

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import { db } from "@/lib/firebase";
import type { MediaType } from "@/types/tmdb";
import type { WatchlistDocument, WatchlistStatus } from "@/types/user";

type UseWatchlistOptions = {
  userId?: string | null;
  contentId?: number;
  contentType?: MediaType;
  contentTitle?: string;
  posterPath?: string | null;
};

export function useWatchlist(options: UseWatchlistOptions) {
  const { userId, contentId, contentType, contentTitle, posterPath } = options;
  const [entry, setEntry] = useState<WatchlistDocument | null>(null);
  const [loading, setLoading] = useState(Boolean(userId && contentId));

  const docId = useMemo(() => {
    if (!userId || !contentId || !contentType) {
      return null;
    }

    return `${userId}_${contentType}_${contentId}`;
  }, [contentId, contentType, userId]);

  useEffect(() => {
    if (!docId) {
      setEntry(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "watchlist", docId), (snapshot: any) => {
      setEntry(snapshot.exists() ? (snapshot.data() as WatchlistDocument) : null);
      setLoading(false);
    });

    return unsubscribe;
  }, [docId]);

  async function save(status: WatchlistStatus) {
    if (!userId || !contentId || !contentType || !contentTitle) {
      return;
    }

    await setDoc(doc(db, "watchlist", `${userId}_${contentType}_${contentId}`), {
      userId,
      contentId,
      contentType,
      contentTitle,
      posterPath: posterPath ?? "",
      status,
      addedAt: new Date().toISOString(),
    } satisfies WatchlistDocument);
  }

  return { entry, loading, save, isSaved: Boolean(entry) };
}


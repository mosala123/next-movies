"use client";

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import { db } from "@/lib/firebase";
import type { MediaType } from "@/types/tmdb";
import type { RatingDocument } from "@/types/user";

type UseRatingsOptions = {
  userId?: string | null;
  contentId?: number;
  contentType?: MediaType;
};

export function useRatings(options: UseRatingsOptions) {
  const { userId, contentId, contentType } = options;
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(Boolean(userId && contentId));

  const docId = useMemo(() => {
    if (!userId || !contentId || !contentType) {
      return null;
    }

    return `${userId}_${contentType}_${contentId}`;
  }, [contentId, contentType, userId]);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      setRating(0);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "ratings", docId), (snapshot: any) => {
      setRating(snapshot.exists() ? (snapshot.data() as RatingDocument).rating : 0);
      setLoading(false);
    });

    return unsubscribe;
  }, [docId]);

  async function submit(nextRating: number) {
    if (!userId || !contentId || !contentType) {
      return;
    }

    const payload: RatingDocument = {
      userId,
      contentId,
      contentType,
      rating: nextRating,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "ratings", `${userId}_${contentType}_${contentId}`), payload);
  }

  return { rating, loading, submit };
}


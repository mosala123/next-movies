"use client";

import { create } from "zustand";

import type { MediaItem } from "@/types/tmdb";
import type { WatchlistStatus } from "@/types/user";

type WatchlistStoreItem = {
  item: MediaItem;
  status: WatchlistStatus;
};

type WatchlistStore = {
  items: WatchlistStoreItem[];
  add: (item: MediaItem, status?: WatchlistStatus) => void;
  remove: (contentId: number) => void;
  updateStatus: (contentId: number, status: WatchlistStatus) => void;
};

export const useWatchlistStore = create<WatchlistStore>((set) => ({
  items: [],
  add: (item, status = "plan_to_watch") =>
    set((state) => ({
      items: state.items.some((entry) => entry.item.id === item.id) ? state.items : [...state.items, { item, status }],
    })),
  remove: (contentId) =>
    set((state) => ({
      items: state.items.filter((entry) => entry.item.id !== contentId),
    })),
  updateStatus: (contentId, status) =>
    set((state) => ({
      items: state.items.map((entry) => (entry.item.id === contentId ? { ...entry, status } : entry)),
    })),
}));

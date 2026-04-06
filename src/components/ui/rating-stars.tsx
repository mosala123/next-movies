"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type RatingStarsProps = {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
};

export function RatingStars({ value, onChange, size = 18 }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${value} out of 10`}>
      {Array.from({ length: 10 }, (_, index) => {
        const nextValue = index + 1;

        return (
          <button key={nextValue} type="button" onClick={() => onChange?.(nextValue)} className="transition hover:scale-110" aria-label={`Rate ${nextValue}`}>
            <Star className={cn("text-white/30", nextValue <= value && "fill-[#ffd700] text-[#ffd700]")} style={{ width: size, height: size }} />
          </button>
        );
      })}
    </div>
  );
}

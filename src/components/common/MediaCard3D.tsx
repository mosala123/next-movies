"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, Play } from "lucide-react";

import { formatReleaseYear, formatVote, getLanguageLabel, getTmdbImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/types/tmdb";

type MediaCard3DProps = {
  item: MediaItem;
  genreMap?: Map<number, string>;
  priority?: boolean;
  className?: string;
  index?: number;
};

export function MediaCard3D({ item, genreMap, priority = false, className, index = 0 }: MediaCard3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  
  // 3D Tilt values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const posterUrl = getTmdbImageUrl(item.posterPath);
  const backdropUrl = getTmdbImageUrl(item.backdropPath, "backdrop");
  const genreName = item.genreIds.map((genreId) => genreMap?.get(genreId)).find(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className={cn("relative", className)}
    >
      <Link
        ref={ref}
        href={`/${item.mediaType}/${item.id}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
          transform: "perspective(1000px)",
        }}
        className="relative block overflow-hidden rounded-2xl bg-card/80 shadow-2xl shadow-black/20 transition-all duration-300"
      >
        {/* 3D Inner Card */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative aspect-[2/3] overflow-hidden"
        >
          {/* Poster Image */}
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={item.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              className="object-cover transition duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-background text-sm text-muted-foreground">
              No Poster
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

          {/* Top Badges */}
          <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
            <span className="rounded-full border border-white/15 bg-black/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/80">
              {getLanguageLabel(item.originalLanguage)}
            </span>
            <span className="flex items-center gap-0.5 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-accent">
              <Star className="h-3 w-3 fill-current" />
              {formatVote(item.voteAverage)}
            </span>
          </div>

          {/* Play Button Overlay (on hover) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg"
            >
              <Play className="h-6 w-6 fill-current text-white" />
            </motion.div>
          </motion.div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="line-clamp-1 text-sm font-semibold text-white sm:text-base">
              {item.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-white/70">
              <span>{formatReleaseYear(item.releaseDate)}</span>
              {genreName && (
                <>
                  <span>•</span>
                  <span className="line-clamp-1">{genreName}</span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Glow Effect on Hover */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300"
        animate={{ opacity: isHovered ? 1 : 0 }}
        style={{
          background: "radial-gradient(circle at center, rgba(229,9,20,0.3), transparent 70%)",
        }}
      />
    </motion.div>
  );
}
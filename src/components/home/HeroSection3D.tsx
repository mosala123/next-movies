"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Play, Info, Sparkles, ChevronLeft, ChevronRight, Star, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatReleaseYear, formatVote, getTmdbImageUrl } from "@/lib/tmdb";
import type { MediaItem } from "@/types/tmdb";
import { cn } from "@/lib/utils";

type HeroSection3DProps = {
  items: MediaItem[];
  autoPlayInterval?: number;
};

export function HeroSection3D({ items, autoPlayInterval = 6000 }: HeroSection3DProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const currentItem = items[currentIndex];
  const backdropUrl = getTmdbImageUrl(currentItem?.backdropPath, "backdrop") || getTmdbImageUrl(currentItem?.posterPath, "backdrop");
  const posterUrl = getTmdbImageUrl(currentItem?.posterPath);

  // Auto play carousel
  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length, autoPlayInterval]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  if (!currentItem) return null;

  return (
    <section ref={containerRef} className="relative h-[85vh] min-h-[600px] w-full overflow-hidden lg:h-[90vh]">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: parallaxY, scale }}
      >
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt={currentItem.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </motion.div>

      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute left-1/3 top-1/2 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="container relative z-10 flex h-full flex-col justify-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl space-y-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "auto" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary backdrop-blur-sm"
          >
            <Sparkles className="h-3 w-3" />
            Featured {currentItem.mediaType === "movie" ? "Movie" : "Series"}
          </motion.div>

          {/* Title with 3D effect */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl font-bold tracking-tight text-white drop-shadow-2xl sm:text-6xl lg:text-7xl xl:text-8xl"
            style={{ textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
          >
            {currentItem.title}
          </motion.h1>

          {/* Tagline */}
          {currentItem.tagline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg italic text-white/80 sm:text-xl"
            >
              {currentItem.tagline}
            </motion.p>
          )}

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-3 text-sm text-white/80"
          >
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              {formatReleaseYear(currentItem.releaseDate)}
            </span>
            <span className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Star className="h-4 w-4 fill-accent text-accent" />
              {formatVote(currentItem.voteAverage)} / 10
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 capitalize backdrop-blur-sm">
              {currentItem.mediaType}
            </span>
          </motion.div>

          {/* Overview */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="max-w-2xl text-base leading-relaxed text-white/70 line-clamp-3 sm:text-lg"
          >
            {currentItem.overview}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              asChild
              size="lg"
              className="gap-2 rounded-full bg-primary px-8 text-base hover:scale-105 hover:bg-primary/90"
            >
              <Link href={`/${currentItem.mediaType}/${currentItem.id}`}>
                <Play className="h-5 w-5 fill-current" />
                Watch Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2 rounded-full border-white/20 bg-white/10 px-8 text-base text-white backdrop-blur-sm hover:scale-105 hover:bg-white/20"
            >
              <Link href={`/${currentItem.mediaType}/${currentItem.id}`}>
                <Info className="h-5 w-5" />
                More Info
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating 3D Poster */}
      <motion.div
        className="absolute bottom-10 right-5 z-10 hidden w-48 overflow-hidden rounded-2xl shadow-2xl xl:block xl:right-10 xl:w-64"
        initial={{ x: 100, opacity: 0, rotateY: 15 }}
        animate={{ x: 0, opacity: 1, rotateY: 0 }}
        transition={{ type: "spring", delay: 0.5, stiffness: 80 }}
        style={{ transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.05, rotateY: 5 }}
      >
        <div className="relative aspect-[2/3]">
          {posterUrl && (
            <Image
              src={posterUrl}
              alt={currentItem.title}
              fill
              className="object-cover"
              sizes="256px"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </motion.div>

      {/* Carousel Controls */}
      {items.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(index);
              setTimeout(() => setIsAutoPlaying(true), 5000);
            }}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              currentIndex === index ? "w-8 bg-primary" : "w-1.5 bg-white/50 hover:bg-white/80"
            )}
          />
        ))}
      </div>

      {/* Mute Button for Auto-playing Trailer (optional) */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-6 right-6 z-20 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </section>
  );
}

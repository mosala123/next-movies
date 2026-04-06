"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { MediaCard3D } from "@/components/common/MediaCard3D";
import { SectionHeading } from "@/components/common/section-heading";
import type { MediaItem } from "@/types/tmdb";
import { cn } from "@/lib/utils";

type ContentRow3DProps = {
  title: string;
  description?: string;
  items: MediaItem[];
  href?: string;
  genreMap?: Map<number, string>;
  autoplay?: boolean;
  autoplaySpeed?: number;
};

export function ContentRow3D({
  title,
  description,
  items,
  href,
  genreMap,
  autoplay = false,
  autoplaySpeed = 3000,
}: ContentRow3DProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoplay);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -400 : 400;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Auto scroll effect
  useEffect(() => {
    if (!autoplay || !isAutoPlaying || items.length === 0) return;

    autoPlayRef.current = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, autoplaySpeed);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoplay, isAutoPlaying, autoplaySpeed, items.length]);

  // Pause auto play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(autoplay);

  if (!items.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SectionHeading title={title} description={description} href={href} />

      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white opacity-0 transition-all backdrop-blur-sm group-hover:opacity-100",
            !showLeftArrow && "hidden"
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="hide-scrollbar flex gap-4 overflow-x-auto pb-6 scroll-smooth"
          style={{ scrollbarWidth: "thin" }}
        >
          {items.map((item, index) => (
            <div key={`${item.mediaType}-${item.id}`} className="min-w-[180px] max-w-[200px] flex-shrink-0 sm:min-w-[200px] md:min-w-[220px]">
              <MediaCard3D item={item} genreMap={genreMap} priority={index < 4} index={index} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className={cn(
            "absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white opacity-0 transition-all backdrop-blur-sm group-hover:opacity-100",
            !showRightArrow && "hidden"
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(229, 9, 20, 0.5) transparent;
        }
        .hide-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .hide-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .hide-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(229, 9, 20, 0.5);
          border-radius: 10px;
        }
        .hide-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(229, 9, 20, 0.8);
        }
      `}</style>
    </motion.section>
  );
}
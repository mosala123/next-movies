export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[rgba(8,10,14,0.88)]">
      <div className="container grid gap-6 py-10 text-sm text-muted-foreground md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div className="space-y-2">
          <p className="font-display text-2xl tracking-[0.16em] text-white">CINEMA</p>
          <p className="max-w-xl leading-6">
            Live TMDB discovery with a cinematic, motion-rich interface built for movies, series, plays, and deeper visual storytelling.
          </p>
        </div>
        <div className="space-y-2 md:text-right">
          <p>Next.js 14, TypeScript, Tailwind CSS, Framer Motion, TMDB.</p>
          <p>Animated cards, richer detail pages, and browse flows that now fail gracefully.</p>
        </div>
      </div>
    </footer>
  );
}

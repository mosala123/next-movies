import Link from "next/link";

const links = [
  { href: "/movies", label: "Movies" },
  { href: "/series", label: "Series" },
  { href: "/plays", label: "Plays" },
  { href: "/trending", label: "Trending" },
  { href: "/top-rated", label: "Top Rated" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/profile", label: "Profile" },
];

export function Sidebar() {
  return (
    <aside className="surface-panel hidden w-64 shrink-0 p-4 xl:block">
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-2xl px-4 py-3 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-white">
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

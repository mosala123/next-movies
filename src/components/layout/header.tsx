"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Clapperboard, Menu, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const searchableRoutes = new Set(["/movies", "/series", "/plays", "/trending", "/top-rated", "/new-releases"]);

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const activeSearchRoute = pathname && searchableRoutes.has(pathname) ? pathname : "/trending";

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    const trimmed = query.trim();

    if (trimmed) {
      params.set("q", trimmed);
    }

    router.push(params.size ? `${activeSearchRoute}?${params.toString()}` : activeSearchRoute);
    setMobileOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }

    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[rgba(6,8,12,0.84)] backdrop-blur-2xl">
      <div className="container">
        <div className="flex min-h-[4.75rem] items-center gap-3 py-3 lg:min-h-[5.25rem] lg:gap-5">
          <Link href="/" className="inline-flex shrink-0 items-center gap-3 font-display text-2xl tracking-[0.18em] text-white sm:text-3xl">
            <span className="rounded-full border border-white/10 bg-white/5 p-2 text-primary shadow-lg shadow-primary/20">
              <Clapperboard className="h-5 w-5" />
            </span>
            CINEMA
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-2 lg:flex">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  isActive(item.href)
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
                )}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="hidden min-w-0 flex-1 items-center justify-end gap-2 md:flex lg:max-w-sm lg:flex-none">
            <div className="relative w-full lg:w-[18rem] xl:w-[22rem]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search this page"
                className="h-11 rounded-full border-white/10 bg-white/5 pl-11 pr-4"
                aria-label="Search titles"
              />
            </div>
            <Button type="submit" className="rounded-full px-4" aria-label="Submit search">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="ml-auto flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>


        </div>

        {mobileOpen ? (
          <div className="border-t border-white/10 py-4 md:hidden">
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search titles"
                  className="rounded-full border-white/10 bg-white/5 pl-11 pr-4"
                  aria-label="Search titles"
                />
              </div>
              <Button type="submit" className="w-full rounded-full">Search</Button>
            </form>

            <nav className="mt-4 grid gap-2">
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-sm font-medium transition",
                    isActive(item.href)
                      ? "border-primary/50 bg-primary/15 text-white"
                      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white",
                  )}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>


          </div>
        ) : null}
      </div>
    </header>
  );
}
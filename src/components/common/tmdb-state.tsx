import Link from "next/link";

import { Button } from "@/components/ui/button";

type TmdbStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
};

export function TmdbState({ title, message, actionLabel = "Back Home", actionHref = "/" }: TmdbStateProps) {
  return (
    <main className="container py-16 lg:py-20">
      <section className="surface-panel overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
        <div className="max-w-2xl space-y-5">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-primary">TMDB Status</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="text-base leading-7 text-muted-foreground">{message}</p>
          <Button asChild className="rounded-full px-6">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

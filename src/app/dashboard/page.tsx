"use client";

import Link from "next/link";

import { UserCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  return (
    <main className="container py-16 lg:py-20">
      <section className="surface-panel px-6 py-8 sm:px-8 sm:py-10">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-primary">User Dashboard</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">{loading ? "Loading your profile..." : user ? `Welcome, ${user.displayName ?? user.email}` : "Authentication required"}</h1>
          <p className="text-base leading-7 text-muted-foreground">
            This dashboard is ready for the next phase where we connect watchlist analytics, ratings, reviews, and personalized recommendations from Firestore.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full px-6">
              <Link href="/movies">Browse movies</Link>
            </Button>
            {!user ? (
              <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                <Link href="/auth/login">
                  <UserCircle2 className="mr-2 h-4 w-4" />
                  Sign in
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

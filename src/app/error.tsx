"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <p className="text-sm font-medium text-destructive">Something went wrong</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Unexpected application error</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {error.message || "An unknown error occurred. Please try again."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </main>
  );
}

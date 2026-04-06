"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/firebase/client";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);

        if (name.trim()) {
          await updateProfile(credential.user, { displayName: name.trim() });
        }

        toast.success("Account created successfully.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="surface-panel mx-auto w-full max-w-xl px-6 py-8 sm:px-8 sm:py-10">
      <p className="text-sm font-medium uppercase tracking-[0.35em] text-primary">{isSignup ? "Create account" : "Login"}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">{isSignup ? "Join Movie Next" : "Welcome back"}</h1>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        {isSignup ? "Create your profile to save favorites and continue building your watchlist." : "Sign in to continue to your dashboard and personalized movie space."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {isSignup ? (
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" autoComplete="name" />
        ) : null}
        <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" type="email" autoComplete="email" required />
        <Input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" autoComplete={isSignup ? "new-password" : "current-password"} required />

        <Button type="submit" className="w-full rounded-full" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSignup ? "Create account" : "Login"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-white/65">
        {isSignup ? "Already have an account?" : "Need an account?"}{" "}
        <Link href={isSignup ? "/auth/login" : "/auth/signup"} className="text-primary hover:text-primary/80">
          {isSignup ? "Login" : "Sign up"}
        </Link>
      </p>
    </section>
  );
}
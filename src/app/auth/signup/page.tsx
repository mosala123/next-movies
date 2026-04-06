import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignupPage() {
  return (
    <main className="container flex min-h-[calc(100vh-11rem)] items-center py-12 lg:py-16">
      <AuthForm mode="signup" />
    </main>
  );
}

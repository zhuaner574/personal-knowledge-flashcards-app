"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    const result =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <Card className="mx-auto mt-12 w-full max-w-md p-6">
      <h1 className="mb-1 text-xl font-semibold">
        {mode === "signup" ? "Create account" : "Welcome back"}
      </h1>
      <p className="mb-5 text-sm text-[var(--text-secondary)]">
        {mode === "signup"
          ? "Sign up with email and password."
          : "Log in to continue your daily review."}
      </p>

      <form onSubmit={onSubmit} className="space-y-3">
        <Input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          required
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-[#c02020]">{error}</p>}
        <Button type="submit" fullWidth disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "signup"
              ? "Sign up"
              : "Log in"}
        </Button>
      </form>
      <p className="mt-4 text-sm text-[var(--text-secondary)]">
        {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
        <Link
          href={mode === "signup" ? "/login" : "/signup"}
          className="underline"
        >
          {mode === "signup" ? "Log in" : "Sign up"}
        </Link>
      </p>
    </Card>
  );
}

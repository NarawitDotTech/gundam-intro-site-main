"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AlertIcon, HomeIcon, LockIcon, SpinnerIcon } from "@/components/icons";

type LoginGateProps = {
  isLoading: boolean;
  authError: string;
  onUnlock: (code: string) => void;
  onCodeChange: () => void;
};

/** Centered access-code form shown before the dashboard unlocks. */
export function LoginGate({ isLoading, authError, onUnlock, onCodeChange }: LoginGateProps) {
  const [code, setCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUnlock(code.trim());
  };

  return (
    <div className="flex min-h-svh items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl border border-white/10 bg-ink-900/75 p-8 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-400/25 bg-accent-400/10 text-accent-300">
            <LockIcon className="h-6 w-6" />
          </div>

          <h1 className="mt-6 text-center text-2xl font-black tracking-tight text-zinc-50">
            Admin Access
          </h1>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Enter your access code to manage site projects.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="admin-code"
                className="mb-2 block font-mono text-[11px] tracking-[0.22em] text-zinc-500 uppercase"
              >
                Access code
              </label>
              <input
                ref={inputRef}
                id="admin-code"
                type="password"
                autoComplete="current-password"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  onCodeChange();
                }}
                placeholder="••••••"
                className={`w-full rounded-xl border bg-ink-950/80 px-4 py-3 text-center text-lg tracking-[0.4em] text-zinc-100 outline-none transition-all placeholder:text-zinc-700 focus:ring-2 ${
                  authError
                    ? "border-rose-400/50 focus:border-rose-400/70 focus:ring-rose-400/15"
                    : "border-white/10 focus:border-accent-400/60 focus:ring-accent-400/15"
                }`}
              />
            </div>

            {authError ? (
              <p
                key={authError}
                className="flex items-center justify-center gap-1.5 text-sm text-rose-300 animate-shake"
                role="alert"
              >
                <AlertIcon className="h-4 w-4 shrink-0" />
                {authError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading || code.trim().length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-400 px-5 py-3 text-sm font-bold text-ink-950 transition-all hover:bg-accent-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon className="h-4 w-4" />
                  Verifying…
                </>
              ) : (
                "Unlock console"
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-accent-300"
          >
            <HomeIcon className="h-3.5 w-3.5" />
            Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}

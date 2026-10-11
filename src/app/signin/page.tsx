
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

type SocialProvider = "google" | "github";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] =
    useState<SocialProvider | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        setError(
          result.error.message ||
            "Sign In করা যায়নি। Email ও Password পরীক্ষা করুন।",
        );
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("Sign In ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(provider: SocialProvider) {
    setError("");
    setSocialLoading(provider);

    try {
      const result = await signIn.social({
        provider,
        callbackURL: "/",
        errorCallbackURL: "/signin",
      });

      if (result.error) {
        setError(
          result.error.message ||
            `${provider === "google" ? "Google" : "GitHub"} Login শুরু করা যায়নি।`,
        );
        setSocialLoading(null);
      }
    } catch {
      setError(
        `${provider === "google" ? "Google" : "GitHub"} Login ব্যর্থ হয়েছে। Configuration পরীক্ষা করুন।`,
      );
      setSocialLoading(null);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl sm:p-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-green-700 transition hover:text-green-900"
        >
          <span aria-hidden="true">←</span>
          Back to Bazar Dor
        </Link>

        <div className="mt-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl">
            🛒
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back!
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Sign in to your Bazar Dor account to explore market prices.
          </p>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={() => handleSocialSignIn("google")}
          disabled={loading || socialLoading !== null}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3.5 font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {socialLoading === "google" ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-green-700" />
          ) : (
            <span className="text-xl font-bold text-blue-600">G</span>
          )}
          {socialLoading === "google"
            ? "Connecting to Google..."
            : "Continue with Google"}
        </button>

        {/* GitHub Login */}
        <button
          type="button"
          onClick={() => handleSocialSignIn("github")}
          disabled={loading || socialLoading !== null}
          className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl bg-gray-900 px-4 py-3.5 font-semibold text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {socialLoading === "github" ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-500 border-t-white" />
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
            >
              <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.08c-3.1.68-3.76-1.31-3.76-1.31-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.72 2.06 3.4 1.57.1-.73.39-1.23.7-1.52-2.47-.28-5.07-1.24-5.07-5.51 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.96.72.78 1.15 1.77 1.15 2.99 0 4.28-2.6 5.22-5.08 5.5.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
            </svg>
          )}
          {socialLoading === "github"
            ? "Connecting to GitHub..."
            : "Continue with GitHub"}
        </button>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">
            OR SIGN IN WITH EMAIL
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || socialLoading !== null}
            className="w-full rounded-xl bg-green-700 px-4 py-3.5 font-semibold text-white shadow-md transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">NEW TO BAZAR DOR?</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-green-700 underline-offset-4 hover:underline"
          >
            Create Account
          </Link>
        </p>

        <p className="mt-8 text-center text-xs leading-5 text-gray-400">
          Bazar Dor — Know Today&apos;s Market Price.
        </p>
      </div>
    </main>
  );
}

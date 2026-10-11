 "use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const normalizedEmail = email.trim();

    if (!trimmedName) {
      setError("আপনার নাম লিখুন।");
      toast.error("নাম দেওয়া হয়নি", {
        description: "আপনার নাম লিখে আবার চেষ্টা করুন।",
      });
      return;
    }

    if (password.length < 8) {
      setError("Password কমপক্ষে ৮ অক্ষরের হতে হবে।");
      toast.error("Password সঠিক নয়", {
        description: "কমপক্ষে ৮ অক্ষরের Password দিন।",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.email({
        name: trimmedName,
        email: normalizedEmail,
        password,
      });

      if (result.error) {
        const message =
          result.error.message || "Account তৈরি করা যায়নি।";

        setError(message);
        toast.error("Signup ব্যর্থ হয়েছে", {
          description: message,
        });
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি সফল হয়েছে!", {
        description: "Bazar Dor-এ আপনাকে স্বাগতম।",
      });

      router.push("/");
      router.refresh();
    } catch {
      const message =
        "Signup ব্যর্থ হয়েছে। তথ্য ও Internet connection পরীক্ষা করুন।";

      setError(message);
      toast.error("Signup ব্যর্থ হয়েছে", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-green-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-md rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:p-8">
        <Link
          href="/"
          className="inline-flex min-h-10 items-center text-sm font-medium text-green-700 hover:underline"
        >
          ← Bazar Dor-এ ফিরে যান
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold text-green-700">
            BAZAR DOR
          </p>

          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            নতুন অ্যাকাউন্ট
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Bazar Dor ব্যবহার করতে আপনার অ্যাকাউন্ট তৈরি করুন।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              আপনার নাম
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-12 w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="আপনার নাম"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email address
            </label>

            <input
              id="signup-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-12 w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="signup-password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-12 w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="কমপক্ষে ৮ অক্ষর"
              disabled={loading}
            />

            <p className="mt-1.5 text-xs text-gray-500">
              Password কমপক্ষে ৮ অক্ষরের হতে হবে।
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-12 w-full items-center justify-center rounded-lg bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm leading-6 text-gray-600">
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/signin"
            className="font-semibold text-green-700 hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>
      </div>
    </main>
  );
}
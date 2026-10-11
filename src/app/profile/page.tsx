
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  async function handleSignOut() {
    setError("");
    setSigningOut(true);

    try {
      await signOut();
      router.replace("/signin");
      router.refresh();
    } catch {
      setError("Sign Out করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setSigningOut(false);
    }
  }

  if (isPending || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Profile Loading...</p>
      </main>
    );
  }

  const avatarLetter = (
    session.user.name ||
    session.user.email ||
    "U"
  )
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm font-medium text-green-700 hover:underline"
        >
          ← Back to Bazar Dor
        </Link>

        <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-green-800 px-6 py-8 text-white sm:px-8">
            <p className="text-sm text-green-100">BAZAR DOR ACCOUNT</p>

            <h1 className="mt-2 text-3xl font-bold">My Profile</h1>

            <p className="mt-2 text-sm text-green-100">
              আপনার Account Information পরিচালনা করুন।
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-7 sm:flex-row">
              {session.user.image ? (
                
                
                <img
                  src={session.user.image}
                  alt="Profile avatar"
                  className="h-24 w-24 rounded-full border-4 border-green-100 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-800">
                  {avatarLetter}
                </div>
              )}

              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-900">
                  {session.user.name || "Bazar Dor User"}
                </h2>

                <p className="mt-1 break-all text-sm text-gray-600">
                  {session.user.email}
                </p>

                <p className="mt-2 text-xs text-green-700">
                  Account Active
                </p>
              </div>
            </div>

            <div className="mt-7">
              <h2 className="text-lg font-bold text-gray-900">
                Profile Information
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="mb-2 text-sm font-semibold text-gray-700">
                    Full Name
                  </p>

                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800">
                    {session.user.name || "নাম দেওয়া হয়নি"}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-gray-700">
                    Email Address
                  </p>

                  <div className="break-all rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-600">
                    {session.user.email}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <div className="mt-7 space-y-4">
              <Link
                href="/profile/update"
                className="block w-full rounded-xl bg-green-700 px-4 py-3 text-center font-semibold text-white transition hover:bg-green-800"
              >
                Update Information
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
              >
                {signingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

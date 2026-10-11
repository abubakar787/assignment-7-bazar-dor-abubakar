
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#f0f5f0] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-[#e0e9e0] bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mb-5 text-7xl" aria-hidden="true">
          🛒
        </div>

        <p className="mb-2 text-sm font-semibold tracking-widest text-emerald-700">
          ERROR 404
        </p>

        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
          পেজটি খুঁজে পাওয়া যায়নি!
        </h1>

        <p className="mx-auto mb-8 max-w-sm leading-7 text-gray-600">
          দুঃখিত! আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যায়নি।
          বাজারদর দেখতে হোম পেজে ফিরে যান।
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >           ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}

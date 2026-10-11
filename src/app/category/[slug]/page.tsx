 
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchProducts, type ApiProduct } from "@/lib/api";

const categoryInfo: Record<string, { name: string; emoji: string }> = {
  chal: { name: "চাল", emoji: "🍚" },
  dal: { name: "ডাল", emoji: "🫘" },
  tel: { name: "তেল", emoji: "🫗" },
  sobji: { name: "সবজি", emoji: "🥬" },
  mach: { name: "মাছ", emoji: "🐟" },
  mangsho: { name: "মাংস", emoji: "🍗" },
  "dim-dui": { name: "ডিম-দুধ", emoji: "🥚" },
  mosla: { name: "মসলা", emoji: "🌶️" },
};

function CategoryContent() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sort, setSort] = useState("default");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError(false);

        const data = await fetchProducts();

        if (active) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Category products load error:", err);

        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const category = categoryInfo[slug];

  const categoryProducts = useMemo(() => {
    const filtered = products.filter(
      (product) => product.category === slug
    );

    if (sort === "asc") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }

    if (sort === "desc") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, slug, sort]);

  return (
    <main className="min-h-screen bg-green-50 text-gray-800">
      <header className="border-b border-green-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5">
          <Link href="/" className="text-xl font-extrabold text-green-700">
            🛒 বাজারদর
          </Link>

          <Link
            href="/"
            className="rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-200"
          >
            ← হোম পেজ
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10">
        {!category ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mb-3 text-5xl">🔎</div>
            <h1 className="text-2xl font-bold">ক্যাটাগরি পাওয়া যায়নি</h1>
            <p className="mt-3 text-gray-500">
              আপনি যে ক্যাটাগরিটি খুঁজছেন, সেটি সঠিক নয়।
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold text-green-700">
                  বাজারদর ক্যাটাগরি
                </p>
                <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                  {category.emoji} {category.name}
                </h1>
                <p className="mt-2 text-gray-500">
                  এই ক্যাটাগরির পণ্যের বর্তমান বাজারদর দেখুন।
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="sort" className="text-sm font-semibold">
                  পণ্যের দাম সাজান
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-500"
                >
                  <option value="default">ডিফল্ট</option>
                  <option value="asc">দাম: কম থেকে বেশি</option>
                  <option value="desc">দাম: বেশি থেকে কম</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-2xl bg-white p-6 shadow-sm"
                  >
                    <div className="mb-4 h-14 w-14 rounded-xl bg-gray-200" />
                    <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
                    <div className="h-7 w-1/2 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-white p-8 text-center">
                <p className="font-semibold text-red-600">
                  পণ্যের তথ্য লোড করা যায়নি।
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white"
                >
                  আবার চেষ্টা করুন
                </button>
              </div>
            ) : categoryProducts.length === 0 ? (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <div className="text-5xl">🛍️</div>
                <h2 className="mt-4 text-xl font-bold">
                  কোনো পণ্য পাওয়া যায়নি
                </h2>
                <p className="mt-2 text-gray-500">
                  এই ক্যাটাগরিতে বর্তমানে কোনো পণ্যের তথ্য নেই।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${encodeURIComponent(
                      product.slug || String(product.id)
                    )}`}
                    className="group rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-3xl">
                        {product.emoji}
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          product.change > 0
                            ? "bg-red-50 text-red-600"
                            : product.change < 0
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.change > 0 ? "+" : ""}
                        {product.change}%
                      </span>
                    </div>

                    <h2 className="mt-5 text-lg font-bold group-hover:text-green-700">
                      {product.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {product.unit}
                    </p>

                    <p className="mt-4 text-2xl font-extrabold text-green-700">
                      ৳{product.price.toLocaleString("bn-BD")}
                    </p>

                    <p className="mt-4 border-t border-gray-100 pt-3 text-sm font-semibold text-green-700">
                      বিস্তারিত দেখুন →
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function CategoryLoading() {
  return (
    <main className="min-h-screen bg-green-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-2xl bg-white shadow-sm"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryContent />
    </Suspense>
  );
}

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchProducts, type ApiProduct } from "@/lib/api";

const categoryInfo: Record<string, { name: string; emoji: string }> = {
  chal: { name: "চাল", emoji: "🍚" },
  dal: { name: "ডাল", emoji: "🫘" },
  tel: { name: "তেল", emoji: "🫙" },
  sobji: { name: "সবজি", emoji: "🥬" },
  mach: { name: "মাছ", emoji: "🐟" },
  mangsho: { name: "মাংস", emoji: "🍗" },
  "dim-dui": { name: "ডিম-দুধ", emoji: "🥚" },
  mosla: { name: "মসলা", emoji: "🌶️" },
};

const bn = (value: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);

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
    <main className="min-h-screen bg-[#f0f5f0] text-[#202a22]">
      <header className="border-b border-[#e1e9e1] bg-[#fbfdfb]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo-icon.png"
              alt="বাজার দর লোগো"
              className="h-9 w-9 object-contain sm:h-10 sm:w-10"
            />
            <span className="text-base font-bold sm:text-lg">বাজার দর</span>
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-[#e0e9e0] px-3 py-2 text-sm font-semibold text-[#087b3e] transition hover:bg-[#f0f5f0] sm:px-4"
          >
            ← হোম পেজ
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {!category ? (
          <div className="rounded-3xl border border-[#e0e9e0] bg-white p-8 text-center sm:p-12">
            <div className="mb-3 text-5xl">🔎</div>
            <h1 className="text-2xl font-bold">ক্যাটাগরি পাওয়া যায়নি</h1>
            <p className="mt-3 text-gray-500">
              আপনি যে ক্যাটাগরিটি খুঁজছেন, সেটি সঠিক নয়।
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-[#078b45] px-6 py-3 font-semibold text-white transition hover:bg-[#06773b]"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold text-[#087b3e]">
                  বাজারদর ক্যাটাগরি
                </p>
                <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                  {category.emoji} {category.name}
                </h1>
                <p className="mt-2 text-sm text-gray-500">
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
                  className="rounded-xl border border-[#e0e9e0] bg-white px-4 py-3 text-sm outline-none focus:border-[#078b45] focus:ring-4 focus:ring-green-100"
                >
                  <option value="default">ডিফল্ট</option>
                  <option value="asc">দাম: কম থেকে বেশি</option>
                  <option value="desc">দাম: বেশি থেকে কম</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-2xl border border-[#e0e9e0] bg-white p-5"
                  >
                    <div className="mb-4 h-12 w-12 rounded-xl bg-[#f0f5f0]" />
                    <div className="mb-3 h-5 w-3/4 rounded bg-[#f0f5f0]" />
                    <div className="h-7 w-1/2 rounded bg-[#f0f5f0]" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-[#e0e9e0] bg-white p-8 text-center">
                <p className="font-semibold text-red-600">
                  পণ্যের তথ্য লোড করা যায়নি।
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-lg bg-[#078b45] px-5 py-3 font-semibold text-white transition hover:bg-[#06773b]"
                >
                  আবার চেষ্টা করুন
                </button>
              </div>
            ) : categoryProducts.length === 0 ? (
              <div className="rounded-2xl border border-[#e0e9e0] bg-white p-8 text-center">
                <div className="text-5xl">🛍️</div>
                <h2 className="mt-4 text-xl font-bold">
                  কোনো পণ্য পাওয়া যায়নি
                </h2>
                <p className="mt-2 text-gray-500">
                  এই ক্যাটাগরিতে বর্তমানে কোনো পণ্যের তথ্য নেই।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {categoryProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${encodeURIComponent(
                      product.slug || String(product.id)
                    )}`}
                    className="group min-w-0 rounded-2xl border border-[#e0e9e0] bg-[#fbfdfb] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#b8d9c0] hover:shadow-md sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f5f0] text-2xl">
                        {product.emoji}
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${
                          product.change > 0
                            ? "bg-red-50 text-red-600"
                            : product.change < 0
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.change > 0
                          ? `▲ ${bn(product.change)}%`
                          : product.change < 0
                            ? `▼ ${bn(Math.abs(product.change))}%`
                            : "— ০.০%"}
                      </span>
                    </div>

                    <h2 className="mt-4 truncate text-base font-semibold text-[#253127] group-hover:text-[#087b3e]">
                      {product.name}
                    </h2>

                    <p className="mt-0.5 text-xs text-gray-500">
                      {product.unit}
                    </p>

                    <p className="mt-3 text-lg font-bold text-[#243127]">
                      {bn(product.price)} টাকা
                    </p>

                    <p className="mt-3 border-t border-[#e8efe8] pt-3 text-xs font-semibold text-[#087b3e]">
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
    <main className="min-h-screen bg-[#f0f5f0] p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="h-8 w-48 animate-pulse rounded bg-[#e0e9e0]" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-2xl border border-[#e0e9e0] bg-white"
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

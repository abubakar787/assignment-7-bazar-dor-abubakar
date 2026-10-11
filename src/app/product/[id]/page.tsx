"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { fetchProducts, type ApiProduct } from "@/lib/api";

const bn = (value: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/signin");
      return;
    }

    let cancelled = false;

    async function loadProduct() {
      try {
        const products = await fetchProducts();

        const found = products.find(
          (item) =>
            item.slug === params.id ||
            String(item.id) === params.id
        );

        if (!cancelled) setProduct(found ?? null);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("পণ্যের তথ্য লোড করা যায়নি।");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [isPending, session, router, params.id]);

 if (isPending) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-green-50">
      <p>Session যাচাই হচ্ছে...</p>
    </main>
  );
}

if (!session) {
  return null;
}

  if (loading) {
    return (
      <main className="p-10 text-center">
        পণ্যের তথ্য লোড হচ্ছে...
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="p-10 text-center">
        <h1 className="text-xl font-bold">
          {error || "পণ্য পাওয়া যায়নি"}
        </h1>
        <Link href="/" className="mt-4 inline-block text-green-700">
          হোমপেজে ফিরুন
        </Link>
      </main>
    );
  }

  const markets = product.marketPrices.filter(
    (market) => market.min > 0 && market.max > 0
  );

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-4 py-10 text-gray-800">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-sm sm:p-10">
        <Link href="/" className="text-sm font-semibold text-green-800">
          ← হোমপেজে ফিরে যান
        </Link>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-green-50 text-5xl">
            {product.emoji}
          </div>

          <div>
            <p className="text-sm text-green-700">
              {product.categoryName}
            </p>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-sm text-gray-500">{product.unit}</p>
          </div>
        </div>

        <section className="mt-8 rounded-2xl bg-green-50 p-5">
          <p className="text-sm text-gray-600">আজকের দাম</p>
          <p className="mt-1 text-3xl font-bold text-green-800">
            {bn(product.price)} টাকা
          </p>
          <p
            className={
              product.change > 0
                ? "mt-2 text-sm text-red-600"
                : product.change < 0
                  ? "mt-2 text-sm text-green-700"
                  : "mt-2 text-sm text-gray-500"
            }
          >
            {product.change > 0
              ? "▲ দাম বেড়েছে "
              : product.change < 0
                ? "▼ দাম কমেছে "
                : "দামের পরিবর্তন নেই "}
            {bn(Math.abs(product.change))}%
          </p>
        </section>

        <h2 className="mt-8 text-lg font-bold">বাজারদরের সারাংশ</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
            <p className="mt-2 text-xl font-bold">
              {bn(
                markets.length
                  ? Math.min(...markets.map((market) => market.min))
                  : product.price
              )} টাকা
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>
            <p className="mt-2 text-xl font-bold">
              {bn(
                markets.length
                  ? Math.max(...markets.map((market) => market.max))
                  : product.price
              )} টাকা
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">আজকের দাম</p>
            <p className="mt-2 text-xl font-bold">
              {bn(product.price)} টাকা
            </p>
          </div>
        </div>

        <h2 className="mt-8 text-lg font-bold">বিভিন্ন বাজারের দাম</h2>

        {markets.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">
            বাজারভিত্তিক তথ্য পাওয়া যায়নি।
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-green-50">
                <tr>
                  <th className="p-3">বাজার</th>
                  <th className="p-3">বিভাগ</th>
                  <th className="p-3">সর্বনিম্ন</th>
                  <th className="p-3">সর্বোচ্চ</th>
                </tr>
              </thead>

              <tbody>
                {markets.map((market, index) => (
                  <tr
                    key={`${market.market}-${market.division}-${index}`}
                    className="border-t"
                  >
                    <td className="p-3">{market.market}</td>
                    <td className="p-3">{market.division}</td>
                    <td className="p-3">{bn(market.min)} টাকা</td>
                    <td className="p-3">{bn(market.max)} টাকা</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 text-xs leading-5 text-gray-500">
          প্রদর্শিত দাম API থেকে পাওয়া তথ্যের ভিত্তিতে দেখানো হয়েছে।
          সর্বশেষ আপডেটের সময় API প্রদানকারীর ওপর নির্ভরশীল।
        </p>
      </div>
    </main>
  );
}

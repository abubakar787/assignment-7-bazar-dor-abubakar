 
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchProducts } from "@/lib/api";
import { signOut, useSession } from "@/lib/auth-client";

type Product = {
  id: number;
  slug?: string;
  emoji: string;
  name: string;
  unit: string;
  price: number;
  change: number;
  category?: string;
};

const sampleProducts: Product[] = [
  { id: 1, emoji: "🍚", name: "স্বর্ণমাছি চাল", unit: "প্রতি কেজি", price: 148, change: 2.1, category: "চাল" },
  { id: 2, emoji: "🍚", name: "মিনিকেট চাল", unit: "প্রতি কেজি", price: 119, change: -1.2, category: "চাল" },
  { id: 3, emoji: "🍚", name: "নাজিরশাইল চাল", unit: "প্রতি কেজি", price: 98, change: 0, category: "চাল" },
  { id: 4, emoji: "🍚", name: "বাসমতি চাল", unit: "প্রতি কেজি", price: 360, change: 0.5, category: "চাল" },
  { id: 5, emoji: "🫘", name: "মসুর ডাল", unit: "প্রতি কেজি", price: 142, change: 1.5, category: "ডাল" },
  { id: 6, emoji: "🫘", name: "মুগ ডাল", unit: "প্রতি কেজি", price: 135, change: 0, category: "ডাল" },
  { id: 7, emoji: "🫘", name: "ছোলা", unit: "প্রতি কেজি", price: 110, change: -1.8, category: "ডাল" },
  { id: 8, emoji: "🫙", name: "সয়াবিন তেল", unit: "প্রতি লিটার", price: 191, change: 1.5, category: "তেল" },
  { id: 9, emoji: "🫙", name: "পাম তেল", unit: "প্রতি লিটার", price: 166, change: -2.3, category: "তেল" },
  { id: 10, emoji: "🥔", name: "আলু", unit: "প্রতি কেজি", price: 30, change: -2.5, category: "সবজি" },
  { id: 11, emoji: "🧅", name: "পেঁয়াজ", unit: "প্রতি কেজি", price: 58, change: 5.2, category: "সবজি" },
  { id: 12, emoji: "🍆", name: "বেগুন", unit: "প্রতি কেজি", price: 44, change: 4.8, category: "সবজি" },
  { id: 13, emoji: "🌶️", name: "কাঁচামরিচ", unit: "প্রতি কেজি", price: 92, change: -4.8, category: "সবজি" },
  { id: 14, emoji: "🧄", name: "রসুন", unit: "প্রতি কেজি", price: 125, change: -2.5, category: "সবজি" },
  { id: 15, emoji: "🥚", name: "ডিম", unit: "প্রতি ডজন", price: 158, change: 1.2, category: "ডিম-দুধ" },
  { id: 16, emoji: "🐟", name: "রুই মাছ", unit: "প্রতি কেজি", price: 360, change: 4, category: "মাছ" },
  { id: 17, emoji: "🐟", name: "ইলিশ মাছ", unit: "প্রতি কেজি", price: 1850, change: 0.8, category: "মাছ" },
  { id: 18, emoji: "🍗", name: "ব্রয়লার মুরগি", unit: "প্রতি কেজি", price: 225, change: -3, category: "মাংস" },
  { id: 19, emoji: "🥩", name: "গরুর মাংস", unit: "প্রতি কেজি", price: 750, change: 1.2, category: "মাংস" },
  { id: 20, emoji: "🥛", name: "দুধ", unit: "প্রতি লিটার", price: 102, change: 0, category: "ডিম-দুধ" },
  { id: 21, emoji: "🫚", name: "আদা", unit: "প্রতি কেজি", price: 85, change: 2, category: "সবজি" },
  { id: 22, emoji: "🥒", name: "শসা", unit: "প্রতি কেজি", price: 45, change: -1, category: "সবজি" },
  { id: 23, emoji: "🍅", name: "টমেটো", unit: "প্রতি কেজি", price: 65, change: 0.7, category: "সবজি" },
  { id: 24, emoji: "🥬", name: "পালং শাক", unit: "প্রতি আঁটি", price: 25, change: -1.5, category: "সবজি" },
];

const categories = ["সব", "চাল", "ডাল", "তেল", "সবজি", "মাছ", "মাংস", "ডিম-দুধ", "মসলা"];

const categorySlugs: Record<string, string> = {
  চাল: "chal",
  ডাল: "dal",
  তেল: "tel",
  সবজি: "sobji",
  মাছ: "mach",
  মাংস: "mangsho",
  "ডিম-দুধ": "dim-dui",
  মসলা: "mosla",
};

const bn = (value: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);

function getEmoji(name: string): string {
  if (/চাল|rice/i.test(name)) return "🍚";
  if (/ডাল|lentil/i.test(name)) return "🫘";
  if (/তেল|oil/i.test(name)) return "🫙";
  if (/মাছ|fish/i.test(name)) return "🐟";
  if (/মুরগি|chicken/i.test(name)) return "🍗";
  if (/মাংস|গরু|beef|meat/i.test(name)) return "🥩";
  if (/ডিম|egg/i.test(name)) return "🥚";
  if (/দুধ|milk/i.test(name)) return "🥛";
  if (/আলু|potato/i.test(name)) return "🥔";
  if (/পেঁয়াজ|পেঁয়াজ|onion/i.test(name)) return "🧅";
  if (/মরিচ|chilli|chili/i.test(name)) return "🌶️";
  if (/রসুন|garlic/i.test(name)) return "🧄";
  if (/বেগুন|eggplant/i.test(name)) return "🍆";
  if (/টমেটো|tomato/i.test(name)) return "🍅";
  if (/শাক|spinach/i.test(name)) return "🥬";
  if (/শসা|cucumber/i.test(name)) return "🥒";
  return "🛒";
}

function getCategory(name: string, original = ""): string {
  const text = `${name} ${original}`.toLowerCase();

  if (/চাল|rice/.test(text)) return "চাল";
  if (/ডাল|lentil|pulse/.test(text)) return "ডাল";
  if (/তেল|oil/.test(text)) return "তেল";
  if (/মাছ|fish/.test(text)) return "মাছ";
  if (/মাংস|মুরগি|গরু|meat|chicken|beef/.test(text)) return "মাংস";
  if (/ডিম|দুধ|egg|milk/.test(text)) return "ডিম-দুধ";
  if (/মসলা|গুঁড়া|গুড়া|রসুন|আদা|ধনেপাতা|spice/.test(text)) return "মসলা";
  if (/আলু|পেঁয়াজ|পেঁয়াজ|বেগুন|মরিচ|রসুন|আদা|শসা|টমেটো|শাক|vegetable/.test(text)) return "সবজি";

  return original || "অন্যান্য";
}

function PriceTicker({ items }: { items: Product[] }) {
  const tickerItems = [...items, ...items];

  return (
    <div
      className="overflow-hidden border-y border-[#e1e9e1] bg-white py-2 sm:py-3"
      aria-label="বাজারদরের পরিবর্তন"
    >
      <div className="price-marquee flex w-max items-center gap-5 sm:gap-7">
        {tickerItems.map((product, index) => (
          <span
            key={`${product.id}-${index}`}
            className="flex shrink-0 items-center gap-2 text-xs text-[#37443a] sm:text-sm"
          >
            <span>{product.emoji}</span>
            <span>{product.name}</span>
            <span className="font-semibold">{bn(product.price)} টাকা</span>
            <span
              className={
                product.change > 0
                  ? "font-semibold text-red-600"
                  : product.change < 0
                    ? "font-semibold text-green-700"
                    : "text-gray-500"
              }
            >
              {product.change > 0
                ? `▲ ${bn(product.change)}%`
                : product.change < 0
                  ? `▼ ${bn(Math.abs(product.change))}%`
                  : "— ০.০%"}
            </span>
            <span className="ml-2 text-[#d8e1d8]">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (product: Product) => void;
}) {
  const badge =
    product.change > 0
      ? "bg-red-50 text-red-600"
      : product.change < 0
        ? "bg-green-50 text-green-700"
        : "bg-gray-100 text-gray-600";

  const changeText =
    product.change > 0
      ? `▲ ${bn(product.change)}%`
      : product.change < 0
        ? `▼ ${bn(Math.abs(product.change))}%`
        : "— ০.০%";

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={() => onSelect(product)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(product);
        }
      }}
      className="group min-w-0 cursor-pointer rounded-xl border border-[#e0e9e0] bg-[#fbfdfb] p-3 transition duration-200 hover:-translate-y-0.5 hover:border-[#b8d9c0] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 sm:p-4"
      aria-label={`${product.name} এর বিস্তারিত দেখুন`}
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-xl sm:h-11 sm:w-11 sm:text-2xl">
          {product.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-[#253127] sm:text-base">
            {product.name}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">{product.unit}</p>
        </div>
      </div>

      <div className="mt-3 flex min-w-0 items-end justify-between gap-1.5 sm:mt-4 sm:gap-2">
        <div className="min-w-0">
          <p className="text-[11px] text-gray-500 sm:text-xs">আজকের দাম</p>
          <p className="mt-0.5 text-sm font-bold text-[#243127] sm:text-lg">
            {bn(product.price)} টাকা
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-1.5 py-1 text-[9px] font-semibold sm:px-2 sm:text-xs ${badge}`}>
          {changeText}
        </span>
      </div>
    </article>
  );
}

function ProductSection({
  title,
  icon,
  items,
  onSelect,
}: {
  title: string;
  icon: string;
  items: Product[];
  onSelect: (product: Product) => void;
}) {
  return (
    <section className="mt-7 sm:mt-9">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-bold sm:mb-4 sm:text-xl">
        <span className={icon === "▲" ? "text-red-600" : "text-green-600"}>
          {icon}
        </span>
        {title}
      </h2>

      {items.length === 0 ? (
        <p className="rounded-xl border border-[#e0e9e0] bg-white p-4 text-sm text-gray-500">
          আপাতত কোনো তথ্য নেই।
        </p>
      ) : (
        <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();

  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [signOutError, setSignOutError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const data = await fetchProducts();

        if (!active) return;

        if (!data.length) {
          setApiError("API থেকে পণ্যের তালিকা পাওয়া যায়নি। নমুনা পণ্য দেখানো হচ্ছে।");
          return;
        }

        const normalized: Product[] = data.map((item, index) => {
          const name = item.name || `পণ্য ${index + 1}`;

          return {
            id: Number(item.id) || index + 1,
            slug: item.slug,
            name,
            emoji: item.emoji || getEmoji(name),
            unit: item.unit || "প্রতি কেজি",
            price: Number.isFinite(Number(item.price)) ? Number(item.price) : 0,
            change: Number.isFinite(Number(item.change)) ? Number(item.change) : 0,
            category: getCategory(name, item.category || ""),
          };
        });

        setProducts(normalized);
        setApiError("");
      } catch (error) {
        console.error("Product API error:", error);

        if (active) {
          setApiError("API সংযোগ করা যায়নি। আপাতত নমুনা পণ্য দেখানো হচ্ছে।");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const rising = useMemo(
    () =>
      [...products]
        .filter((product) => product.change > 0)
        .sort((a, b) => b.change - a.change)
        .slice(0, 6),
    [products],
  );

  const falling = useMemo(
    () =>
      [...products]
        .filter((product) => product.change < 0)
        .sort((a, b) => a.change - b.change)
        .slice(0, 6),
    [products],
  );

  function openProduct(product: Product) {
    router.push(
      `/product/${encodeURIComponent(product.slug || String(product.id))}`,
    );
  }

  function openCategory(category: string) {
    if (category === "সব") {
      router.push("/");
      return;
    }

    const slug = categorySlugs[category];

    if (slug) {
      router.push(`/category/${slug}`);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    setSignOutError("");

    try {
      await signOut();
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign Out failed:", error);
      setSignOutError("Sign Out করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setSigningOut(false);
    }
  }

  const avatarLetter = (
    session?.user?.name ||
    session?.user?.email ||
    "U"
  )
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f0f5f0] text-[#202a22]">
      <header className="sticky top-0 z-20 border-b border-[#e1e9e1] bg-[#fbfdfb]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2">
            <img
              src="/logo-icon.png"
              alt="বাজার দর লোগো"
              className="h-9 w-9 object-contain sm:h-10 sm:w-10"
            />
            <span className="min-w-0">
              <span className="block text-base font-bold leading-tight sm:text-lg">
                বাজার দর
              </span>
              <span className="mt-1 block text-[9px] text-gray-500 sm:text-[10px]">
                প্রতিদিনের বাজারদর
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {sessionPending ? (
              <div className="h-9 w-16 animate-pulse rounded-lg bg-green-50 sm:h-10 sm:w-24" />
            ) : session?.user ? (
              <>
                <Link
                  href="/profile"
                  aria-label="My Profile"
                  className="flex min-w-0 items-center gap-1.5 rounded-xl px-1.5 py-1.5 transition hover:bg-green-50 sm:gap-2 sm:px-2"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile avatar"
                      className="h-8 w-8 shrink-0 rounded-full border border-green-200 object-cover sm:h-9 sm:w-9"
                    />
                  ) : (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800 sm:h-9 sm:w-9">
                      {avatarLetter}
                    </span>
                  )}

                  <span className="hidden max-w-28 truncate text-sm font-semibold text-gray-800 md:block">
                    {session.user.name || "My Profile"}
                  </span>
                </Link>
  
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="whitespace-nowrap rounded-lg border border-red-200 px-2 py-2 text-[11px] font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60 sm:px-3 sm:text-sm"
                >
                  {signingOut ? "Signing out..." : "Sign Out"}
                </button>
              </>
              
            ) : (
              <>
                <Link
                  href="/signin"
                  className="whitespace-nowrap rounded-lg px-2 py-2 text-xs font-medium hover:bg-green-50 sm:px-3 sm:text-sm"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className="whitespace-nowrap rounded-lg bg-[#078b45] px-2.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#06773b] sm:px-4 sm:text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {signOutError && (
          <p
            role="alert"
            className="mx-auto max-w-6xl px-4 pb-2 text-sm text-red-700 sm:px-6"
          >
            {signOutError}
          </p>
        )}

        <nav
          aria-label="পণ্যের ক্যাটাগরি"
          className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-1 gap-y-0.5 px-2 pb-2 sm:gap-1 sm:px-6 sm:pb-3"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => openCategory(category)}
              className="rounded-full px-2 py-1.5 text-[11px] font-medium text-gray-600 transition hover:bg-green-50 hover:text-green-800 sm:px-3 sm:text-xs"
            >
              {category}
            </button>
          ))}
        </nav>

        <PriceTicker items={products} />
      </header>

      <div className="mx-auto max-w-6xl px-3 pb-8 sm:px-6 sm:pb-10">
        <section className="mt-4 grid min-w-0 items-center gap-3 overflow-hidden rounded-3xl border border-[#e0e9e0] bg-[#fbfdfb] px-4 py-5 sm:mt-6 sm:gap-5 sm:px-9 sm:py-9 md:grid-cols-[1.3fr_0.7fr]">
          <div className="min-w-0">
            <span className="inline-block rounded-full bg-[#e0f2e5] px-3 py-1 text-xs font-medium text-[#087b3e]">
              প্রতিদিনের বাজারদর
            </span>

            <h1 className="mt-3 max-w-xl text-2xl font-bold leading-snug sm:mt-4 sm:text-4xl">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              চাল, ডাল, তেল, সবজি, মাছ, ডিম ও মাংসের দাম — বাজারের
              প্রয়োজনীয় তথ্য, দাম বাড়া-কমার পরিবর্তন এক জায়গায়।
            </p>

            <a
              href="#সব-পণ্য"
              className="mt-4 inline-flex items-center rounded-lg bg-[#078b45] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#06773b] sm:mt-5 sm:px-5 sm:py-3"
            >
              সব পণ্য দেখুন →
            </a>
          </div>

          <div className="flex items-center justify-center p-1 sm:p-2">
            <img
              src="/bazar-hero.png"
              alt="বাজারের রঙিন ফলের ঝুড়ি"
              className="h-auto w-full max-w-[180px] object-contain sm:max-w-[300px]"
            />
          </div>
        </section>

        {apiError && (
          <p
            role="status"
            className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            {apiError}
          </p>
        )}

        {loading && (
          <div
            role="status"
            aria-label="পণ্য লোড হচ্ছে"
            className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-xl border border-[#e0e9e0] bg-white"
              />
            ))}
          </div>
        )}

        {!loading && (
          <>
            <ProductSection
              title="আজ দাম বেড়েছে"
              icon="▲"
              items={rising}
              onSelect={openProduct}
            />

            <ProductSection
              title="আজ দাম কমেছে"
              icon="▼"
              items={falling}
              onSelect={openProduct}
            />
          </>
        )}

        <section id="সব-পণ্য" className="mt-8 scroll-mt-44 sm:mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">সব পণ্য</h2>
              <p className="mt-1 text-sm text-gray-500">
                নিত্যপ্রয়োজনীয় পণ্যের বাজারদর
              </p>
            </div>

            <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-600">
              মোট {bn(products.length)}টি পণ্য
            </span>
          </div>

          {!loading && products.length === 0 && (
            <div className="mt-5 rounded-xl border border-[#e0e9e0] bg-white p-8 text-center">
              <p className="font-semibold">কোনো পণ্য পাওয়া যায়নি।</p>
            </div>
          )}

          <div className="mt-4 grid min-w-0 grid-cols-2 gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={openProduct}
              />
            ))}
          </div>
        </section>

        <footer className="mt-10 flex flex-col gap-2 border-t border-[#dce5dc] py-5 text-xs leading-5 text-gray-500 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <p>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
          <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
        </footer>
      </div>
    </main>
  );
}

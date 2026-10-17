const API_BASE = "/api/bazardor";

const UNIT_LABELS: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  liter: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

export type ApiProduct = {
  id: number;
  slug: string;
  emoji: string;
  name: string;
  unit: string;
  price: number;
  change: number;
  category: string;
  categoryName: string;
  marketPrices: {
    market: string;
    division: string;
    min: number;
    max: number;
  }[];
};

type RawMarket = {
  market?: string;
  division?: string;
  min?: number;
  max?: number;
};

type RawProduct = {
  id?: number;
  slug?: string;
  nameBn?: string;
  name?: string;
  image?: string;
  category?: string;
  categoryNameBn?: string;
  unit?: string;
  today?: number;
  change?: {
    pct?: number;
  };
  markets?: RawMarket[];
};

export async function fetchProducts(): Promise<ApiProduct[]> {
  const response = await fetch(`${API_BASE}/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Products API error: ${response.status}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("API response is not a product list");
  }

  return (data as RawProduct[]).map((item, index) => ({
    id: item.id ?? index + 1,
    slug: item.slug ?? String(item.id ?? index + 1),
    emoji: item.image ?? "🛒",
    name: item.nameBn ?? item.name ?? `পণ্য ${index + 1}`,
    unit:
      (item.unit ? UNIT_LABELS[item.unit] : undefined) ??
      item.unit ??
      "প্রতি কেজি",
    price: item.today ?? 0,
    change: item.change?.pct ?? 0,
    category: item.category ?? "",
    categoryName: item.categoryNameBn ?? item.category ?? "",
    marketPrices: (item.markets ?? []).map((market: RawMarket) => ({
      market: market.market ?? "স্থানীয় বাজার",
      division: market.division ?? "",
      min: market.min ?? 0,
      max: market.max ?? 0,
    })),
  }));
}

export async function fetchCategories(): Promise<unknown[]> {
  const response = await fetch(`${API_BASE}/categories`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Categories API error: ${response.status}`);
  }

  const data: unknown = await response.json();
  return Array.isArray(data) ? data : [];
}
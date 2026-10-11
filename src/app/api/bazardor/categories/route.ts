
const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/categories";

export async function GET() {
  try {
    const response = await fetch(API_URL, {
      cache: "no-store",
    });

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ??
          "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Categories API error:", error);

    return Response.json(
      { error: "Categories API request failed" },
      { status: 502 },
    );
  }
}

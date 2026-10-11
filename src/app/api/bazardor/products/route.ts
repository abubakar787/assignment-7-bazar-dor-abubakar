

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/products";

export async function GET() {
  try {
    const response = await fetch(API_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
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
    console.error("Backup API error:", error);

    return Response.json(
      {
        error: "Backup API request failed",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 502 },
    );
  }
}

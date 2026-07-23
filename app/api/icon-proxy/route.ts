import { type NextRequest } from "next/server";

/* Same-origin proxy for app icon images so the canvas color sampler can read
   their pixels — the icon CDNs don't send CORS headers. */
const ALLOWED_HOSTS = new Set([
  "stuff.thingsofbrand.com",
  "files.msg91.com",
]);

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return new Response("Missing url", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.has(parsed.hostname)) {
    return new Response("Host not allowed", { status: 403 });
  }

  const upstream = await fetch(parsed, { cache: "force-cache" });
  if (!upstream.ok) {
    return new Response("Upstream error", { status: 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}

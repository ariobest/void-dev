import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();
const SUPABASE_URL = "https://cqtwmxojwwyeasstuhgb.supabase.co";

app.get("/api/", (c) => c.json({ name: "Void Development API", ok: true }));

app.get("/api/scripts/load", async (c) => {
  const slug = (c.req.query("script") || "").trim();
  const key = (c.req.query("key") || "").trim();
  if (!/^[a-z0-9-]{1,80}$/.test(slug) || (key && !/^(VOID|ARIO)-[A-Z0-9]{2}-[A-Z0-9]{3}-[A-Z0-9]{4}$/.test(key))) {
    return c.json({ protected: true, error: "Invalid script slug or key.", code: "INVALID_REQUEST" }, 400, {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
  }
  try {
    const upstreamUrl = new URL(SUPABASE_URL + "/functions/v1/script-api");
    upstreamUrl.searchParams.set("action", key ? "load" : "load-public");
    upstreamUrl.searchParams.set("script", slug);
    if (key) upstreamUrl.searchParams.set("key", key);
    const upstream = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers: { "Accept": "text/plain, application/json" },
    });
    const body = await upstream.text();
    const contentType = upstream.headers.get("Content-Type") || (upstream.ok ? "text/plain; charset=utf-8" : "application/json; charset=utf-8");
    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store, max-age=0",
        "Pragma": "no-cache",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch {
    return c.json({ protected: true, error: "Void Development script service is temporarily unavailable.", code: "UPSTREAM_UNAVAILABLE" }, 502, {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
  }
});

export default app;

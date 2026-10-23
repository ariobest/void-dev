import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();
const SUPABASE_URL = "https://cqtwmxojwwyeasstuhgb.supabase.co";

const browserProtectionPage = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#050505">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>Protected Script · Void Development</title>
<style>
:root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:#050505;color:#f7f7f7}
body{min-height:100vh;display:grid;place-items:center;overflow:hidden;padding:22px;background:radial-gradient(ellipse 48% 42% at 50% 40%,rgba(255,255,255,.13),transparent 75%),#050505}
.card{width:min(620px,100%);padding:clamp(36px,7vw,72px) 24px;text-align:center;border:1px solid rgba(255,255,255,.15);border-radius:28px;background:linear-gradient(145deg,rgba(255,255,255,.065),rgba(255,255,255,.012));box-shadow:0 30px 100px #000b,0 0 65px #ffffff0c,inset 0 1px #ffffff12;backdrop-filter:blur(18px);animation:rise .35s ease-out both}
.mark{width:74px;height:74px;margin:0 auto 28px;display:grid;place-items:center;border:1px solid #ffffff55;border-radius:22px;background:#ffffff08;box-shadow:0 0 35px #ffffff12}
svg{width:42px;height:42px;filter:drop-shadow(0 0 8px #ffffff55)}
h1{margin:0;font-size:clamp(27px,5vw,46px);line-height:1.12;letter-spacing:-.05em;font-weight:850;text-wrap:balance}
h1 span{display:block;margin-top:9px;color:#fff}
@keyframes rise{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
@media(prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
</head>
<body>
<main class="card">
<div class="mark" role="img" aria-label="Void Development shield"><svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 5 53 13v16c0 14-8.7 24.1-21 30C19.7 53.1 11 43 11 29V13L32 5Z" stroke="white" stroke-width="2.8" stroke-linejoin="round"/><path d="m22 32 7 7 14-15" stroke="white" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
<h1>THIS SCRIPT IS PROTECTED <span>BY VOID DEVELOPMENT</span></h1>
</main>
</body>
</html>`;

const protectionHeaders = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

app.get("/api/", (c) => c.json({ name: "Void Development API", ok: true }));

app.get("/__void_protected_7f3d9a2c", () => new Response(browserProtectionPage, {
  status: 200,
  headers: protectionHeaders,
}));

// URL-only loader: browser navigation receives the branded card;
// script clients (Accept: */*) receive the published Lua source.
app.get("/load/:slug", async (c) => {
  const slug = (c.req.param("slug") || "").trim();
  const accept = (c.req.header("Accept") || "").toLowerCase();
  const fetchMode = (c.req.header("Sec-Fetch-Mode") || "").toLowerCase();
  const fetchDest = (c.req.header("Sec-Fetch-Dest") || "").toLowerCase();
  const browserNavigation = accept.includes("text/html") ||
    (fetchMode === "navigate" && (fetchDest === "document" || fetchDest === "iframe"));

  if (browserNavigation) {
    return new Response(browserProtectionPage, {
      status: 200,
      headers: { ...protectionHeaders, "Vary": "Accept" },
    });
  }

  if (!/^[a-z0-9-]{1,80}$/.test(slug)) {
    return c.json({ error: "Invalid script slug.", code: "INVALID_REQUEST" }, 400, {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
  }

  try {
    const upstreamUrl = new URL(SUPABASE_URL + "/functions/v1/script-api");
    upstreamUrl.searchParams.set("action", "load-public");
    upstreamUrl.searchParams.set("script", slug);
    const upstream = await fetch(upstreamUrl.toString(), {
      headers: { "Accept": "text/plain, application/json" },
    });

    // Stream the upstream body directly instead of buffering it in the Worker first.
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ||
          (upstream.ok ? "text/plain; charset=utf-8" : "application/json; charset=utf-8"),
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
        "Vary": "Accept",
      },
    });
  } catch {
    return c.json({ error: "Void Development script service is temporarily unavailable.", code: "UPSTREAM_UNAVAILABLE" }, 502);
  }
});

// Existing key-based API retained for older releases.
app.get("/api/scripts/load", async (c) => {
  const slug = (c.req.query("script") || "").trim();
  const key = (c.req.query("key") || "").trim();
  const accept = (c.req.header("Accept") || "").toLowerCase();
  const fetchMode = (c.req.header("Sec-Fetch-Mode") || "").toLowerCase();
  const fetchDest = (c.req.header("Sec-Fetch-Dest") || "").toLowerCase();
  const browserNavigation = accept.includes("text/html") ||
    (fetchMode === "navigate" && (fetchDest === "document" || fetchDest === "iframe"));

  if (browserNavigation) {
    return new Response(browserProtectionPage, {
      status: 200,
      headers: { ...protectionHeaders, "Vary": "Accept" },
    });
  }

  if (!/^[a-z0-9-]{1,80}$/.test(slug)) {
    return c.json({ protected: true, error: "Invalid script slug.", code: "INVALID_REQUEST" }, 400, {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
  }
  if (!key) {
    return c.json({ protected: true, error: "Access key required. Get access through Void Development.", code: "KEY_REQUIRED" }, 401, {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "X-Content-Type-Options": "nosniff",
    });
  }
  if (!/^(VOID|ARIO)-[A-Z0-9]{2}-[A-Z0-9]{3}-[A-Z0-9]{4}$/.test(key)) {
    return c.json({ protected: true, error: "Invalid access key format.", code: "INVALID_KEY_FORMAT" }, 400, {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
  }

  try {
    const upstreamUrl = new URL(SUPABASE_URL + "/functions/v1/script-api");
    upstreamUrl.searchParams.set("action", "load");
    upstreamUrl.searchParams.set("script", slug);
    upstreamUrl.searchParams.set("key", key);
    const upstream = await fetch(upstreamUrl.toString(), {
      headers: { "Accept": "text/plain, application/json" },
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ||
          (upstream.ok ? "text/plain; charset=utf-8" : "application/json; charset=utf-8"),
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
        "Vary": "Accept",
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

import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();
const SUPABASE_URL = "https://cqtwmxojwwyeasstuhgb.supabase.co";

const browserProtectionPage = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#070707">
<meta name="robots" content="noindex,nofollow,noarchive">
<meta name="description" content="This script is protected by Void Development.">
<title>Protected Script · Void Development</title>
<style>
:root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased}
*{box-sizing:border-box}
html{min-height:100%;background:#070707}
body{margin:0;min-height:100vh;min-height:100svh;display:grid;place-items:center;overflow-x:hidden;padding:28px 18px;color:#f7f7f7;background:radial-gradient(ellipse 54% 42% at 50% 32%,rgba(255,255,255,.12),transparent 72%),radial-gradient(ellipse 40% 40% at 4% 100%,rgba(255,255,255,.045),transparent 72%),#070707}
body:before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.18;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:46px 46px;mask-image:linear-gradient(to bottom,#000,transparent 88%)}
body:after{content:"";position:fixed;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 30%,rgba(0,0,0,.58) 100%)}
.shell{position:relative;z-index:1;width:min(100%,620px);animation:arrive .7s cubic-bezier(.2,.8,.2,1) both}
.topline{display:flex;align-items:center;justify-content:center;gap:9px;margin:0 auto 18px;color:#a6a6a6;font-size:10px;font-weight:750;letter-spacing:.2em;text-transform:uppercase}
.live-dot{width:7px;height:7px;flex:none;border-radius:50%;background:#e8e8e8;box-shadow:0 0 12px #fff8;animation:pulse 2.2s ease-in-out infinite}
.card{position:relative;isolation:isolate;overflow:hidden;padding:clamp(30px,7vw,62px) clamp(22px,6vw,54px) 28px;text-align:center;border:1px solid rgba(255,255,255,.15);border-radius:30px;background:linear-gradient(145deg,rgba(255,255,255,.085),rgba(255,255,255,.025) 45%,rgba(255,255,255,.012));box-shadow:0 32px 100px rgba(0,0,0,.64),0 0 80px rgba(255,255,255,.045),inset 0 1px 0 rgba(255,255,255,.12);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px)}
.card:before{content:"";position:absolute;z-index:-1;left:12%;right:12%;top:-95px;height:170px;border-radius:50%;background:rgba(255,255,255,.12);filter:blur(65px);pointer-events:none}
.card:after{content:"";position:absolute;left:14%;right:14%;top:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent);opacity:.55}
.mark{position:relative;width:clamp(90px,20vw,118px);aspect-ratio:1;margin:0 auto 28px;display:grid;place-items:center}
.mark:before{content:"";position:absolute;inset:2px;border-radius:32px;background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.015));border:1px solid rgba(255,255,255,.16);box-shadow:inset 0 1px rgba(255,255,255,.1),0 0 42px rgba(255,255,255,.05);transform:rotate(-5deg)}
.mark img{position:relative;display:block;width:82%;height:82%;object-fit:contain;filter:drop-shadow(0 0 22px rgba(255,255,255,.2));animation:float 5s ease-in-out infinite}
.eyebrow{display:inline-flex;align-items:center;gap:8px;margin:0 auto 19px;padding:8px 12px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.045);color:#d8d8d8;font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase}
.shield{width:13px;height:13px;display:inline-block}
h1{max-width:490px;margin:0 auto;color:#fff;font-size:clamp(30px,6.2vw,48px);font-weight:850;line-height:1.04;letter-spacing:-.065em;text-wrap:balance}
h1 span{display:block;margin-top:10px;color:rgba(255,255,255,.64);font-size:.72em;letter-spacing:-.045em}
.description{max-width:390px;margin:22px auto 0;color:#a7a7a7;font-size:14px;line-height:1.75;text-wrap:pretty}
.divider{height:1px;margin:28px 0 20px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.13),transparent)}
.status{display:flex;align-items:center;justify-content:center;gap:9px;color:#d7d7d7;font-size:11px;font-weight:650;letter-spacing:.035em}
.status-icon{width:23px;height:23px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.13);border-radius:8px;background:rgba(255,255,255,.055);color:#fff}
.status-icon svg{width:12px;height:12px}
.actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:26px}
.btn{min-height:44px;display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:0 17px;border:1px solid rgba(255,255,255,.16);border-radius:13px;color:#f6f6f6;text-decoration:none;font-size:12px;font-weight:750;transition:transform .2s ease,border-color .2s ease,background .2s ease}
.btn.primary{border-color:#f5f5f5;background:#f5f5f5;color:#090909;box-shadow:0 5px 22px rgba(255,255,255,.08)}
.btn.secondary{background:rgba(255,255,255,.035)}
.btn:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.5)}
.btn.primary:hover{background:#fff}
.btn svg{width:14px;height:14px}
.footer{display:flex;align-items:center;justify-content:center;gap:7px;margin:21px 0 0;color:#696969;font-size:10px;letter-spacing:.11em;text-transform:uppercase}
.footer-mark{color:#d6d6d6;font-weight:900}
@keyframes arrive{from{opacity:0;transform:translateY(16px) scale(.985);filter:blur(5px)}to{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes pulse{0%,100%{opacity:.65;box-shadow:0 0 7px #fff5}50%{opacity:1;box-shadow:0 0 14px #fff9}}
@media(hover:none){.btn:hover{transform:none}}
@media(max-width:420px){body{padding:18px 12px}.card{border-radius:24px}.description{font-size:13px}.actions{flex-direction:column}.btn{width:100%}.divider{margin:23px 0 17px}}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
</style>
</head>
<body>
<main class="shell">
<div class="topline"><span class="live-dot"></span> VOID DEVELOPMENT <span aria-hidden="true">/</span> SCRIPT SECURITY</div>
<section class="card" aria-labelledby="page-title">
<div class="mark"><img src="https://cqtwmxojwwyeasstuhgb.supabase.co/storage/v1/object/public/void-files/1792744606438-void-logo-icon.png" alt="Void Development logo"></div>
<div class="eyebrow"><svg class="shield" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 19 6v5c0 4.7-2.9 8-7 10-4.1-2-7-5.3-7-10V6l7-3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg> Protected access</div>
<h1 id="page-title">THIS SCRIPT IS PROTECTED<span>BY VOID DEVELOPMENT</span></h1>
<p class="description">This script is delivered through our protected loader. Its source isn't displayed on this page. If you were looking for the script itself, use the official loader provided by its creator.</p>
<div class="divider"></div>
<div class="status"><span class="status-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="5" y="10" width="14" height="11" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M12 14v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span> Protected endpoint <span aria-hidden="true">·</span> Source hidden in browser</div>
<div class="actions"><a class="btn primary" href="https://arioscripts.cyou/" rel="noopener"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 5 7 7-7 7M21 12H3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> Visit Void Development</a><a class="btn secondary" href="https://arioscripts.cyou/" rel="noopener">Explore releases</a></div>
</section>
<div class="footer"><span class="footer-mark">V/</span> Built for creators. Protected by Void.</div>
</main>
</body>
</html>`

const protectionHeaders = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

app.get("/api/", (c) => c.json({ name: "Void Development API", ok: true }));

app.get("/api/media/:slug", async (c) => {
  const slug = (c.req.param("slug") || "").trim();
  if (!/^[a-z0-9-]{3,100}$/.test(slug)) return c.json({ error: "Invalid file link." }, 400);
  try {
    const url = new URL(SUPABASE_URL + "/functions/v1/script-api");
    url.searchParams.set("action", "media-public");
    url.searchParams.set("slug", slug);
    const upstream = await fetch(url.toString(), { headers: { "Accept": "application/json" } });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") || "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch {
    return c.json({ error: "Void Media is temporarily unavailable." }, 502);
  }
});

app.get("/media/:slug/:mode", async (c) => {
  const slug = (c.req.param("slug") || "").trim();
  const mode = c.req.param("mode");
  if (!/^[a-z0-9-]{3,100}$/.test(slug) || (mode !== "download" && mode !== "view")) {
    return c.json({ error: "Invalid media link." }, 400);
  }
  try {
    const url = new URL(SUPABASE_URL + "/functions/v1/script-api");
    url.searchParams.set("action", "media-file");
    url.searchParams.set("slug", slug);
    url.searchParams.set("mode", mode);
    const upstream = await fetch(url.toString(), { headers: { "Accept": "*/*" } });
    const headers = new Headers();
    for (const key of ["Content-Type", "Content-Disposition", "Content-Length", "Cache-Control", "X-Content-Type-Options", "Accept-Ranges"]) {
      const value = upstream.headers.get(key);
      if (value) headers.set(key, value);
    }
    headers.set("Cache-Control", "private, no-store, max-age=0");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "no-referrer");
    return new Response(upstream.body, { status: upstream.status, headers });
  } catch {
    return c.json({ error: "Void Media is temporarily unavailable." }, 502);
  }
});


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

// Private, unpublished draft loader. The slug contains a random suffix generated by the admin UI.
app.get("/protected-load/:slug", async (c) => {
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
    return c.json({ error: "Invalid protected loader identifier.", code: "INVALID_REQUEST" }, 400, {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
  }
  try {
    const upstreamUrl = new URL(SUPABASE_URL + "/functions/v1/script-api");
    upstreamUrl.searchParams.set("action", "load-protected");
    upstreamUrl.searchParams.set("script", slug);
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

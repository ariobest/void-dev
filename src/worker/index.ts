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
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23060606'/%3E%3Cpath d='M32 7 51 14v15c0 13-8 22-19 28C21 51 13 42 13 29V14z' fill='none' stroke='white' stroke-width='3'/%3E%3Cpath d='m23 32 6 6 13-14' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">
<style>
:root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:#050505;color:#f7f7f7}
body{min-height:100vh;display:grid;place-items:center;overflow:hidden;padding:26px;background:radial-gradient(ellipse 42% 36% at 50% 37%,rgba(255,255,255,.12),rgba(255,255,255,.035) 38%,transparent 75%),radial-gradient(ellipse at 50% 110%,rgba(255,255,255,.045),transparent 55%),#050505}
body:before{content:"";position:fixed;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 20%,rgba(255,255,255,.018) 50%,transparent 80%);mask-image:radial-gradient(ellipse at center,#000,transparent 82%)}
.wrap{position:relative;width:min(720px,100%);text-align:center;padding:clamp(28px,6vw,64px) clamp(18px,5vw,48px);border:1px solid rgba(255,255,255,.12);border-radius:28px;background:linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.012) 42%,rgba(0,0,0,.4));box-shadow:0 35px 120px rgba(0,0,0,.72),0 0 70px rgba(255,255,255,.045),inset 0 1px rgba(255,255,255,.07);backdrop-filter:blur(18px);animation:rise .8s cubic-bezier(.2,.75,.2,1) both}
.mark{width:86px;height:86px;margin:0 auto 30px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.48);border-radius:25px;background:radial-gradient(circle at 50% 30%,rgba(255,255,255,.17),rgba(255,255,255,.025) 66%);box-shadow:0 0 18px rgba(255,255,255,.13),0 0 55px rgba(255,255,255,.08),inset 0 0 25px rgba(255,255,255,.06);animation:glow 3s ease-in-out infinite}
.mark svg{width:46px;height:46px;filter:drop-shadow(0 0 9px rgba(255,255,255,.4))}
.eyebrow{display:inline-flex;align-items:center;gap:9px;margin-bottom:20px;padding:8px 12px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.035);font:700 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.2em;text-transform:uppercase;color:#d9d9d9}
.dot{width:6px;height:6px;border-radius:50%;background:#fff;box-shadow:0 0 12px #fff}
h1{margin:0 auto;max-width:620px;font-size:clamp(28px,5.4vw,52px);line-height:1.1;letter-spacing:-.055em;font-weight:850;text-wrap:balance;text-shadow:0 0 26px rgba(255,255,255,.18)}
h1 span{display:block;color:#fff}
.rule{width:76px;height:1px;margin:28px auto;background:linear-gradient(90deg,transparent,#fff,transparent);box-shadow:0 0 12px rgba(255,255,255,.7)}
.sub{max-width:470px;margin:0 auto;color:#b7b7bd;font-size:clamp(13px,2vw,16px);line-height:1.8;letter-spacing:.015em;text-wrap:balance}
.sub strong{color:#fff;font-weight:750}
.status{display:flex;justify-content:center;align-items:center;gap:9px;margin-top:32px;color:#85858d;font:10px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase}
.status svg{width:14px;height:14px;opacity:.85}
footer{margin-top:28px;color:#57575e;font-size:10px;letter-spacing:.12em;text-transform:uppercase}
@keyframes glow{0%,100%{box-shadow:0 0 18px rgba(255,255,255,.11),0 0 42px rgba(255,255,255,.045),inset 0 0 25px rgba(255,255,255,.04)}50%{box-shadow:0 0 26px rgba(255,255,255,.2),0 0 72px rgba(255,255,255,.09),inset 0 0 30px rgba(255,255,255,.09)}}
@keyframes rise{from{opacity:0;transform:translateY(14px) scale(.99);filter:blur(8px)}to{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important}}
</style>
</head>
<body>
<main class="wrap">
  <div class="mark" role="img" aria-label="Void Development security shield">
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 5 53 13v16c0 14-8.7 24.1-21 30C19.7 53.1 11 43 11 29V13L32 5Z" stroke="white" stroke-width="2.8" stroke-linejoin="round"/><path d="m22 32 7 7 14-15" stroke="white" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="30" r="24" stroke="white" stroke-opacity=".16"/></svg>
  </div>
  <div class="eyebrow"><span class="dot"></span> Void security protocol</div>
  <h1>THIS SCRIPT IS PROTECTED <span>BY VOID DEVELOPMENT</span></h1>
  <div class="rule"></div>
  <p class="sub"><strong>OUR ADVANCED PROTECTOR</strong> blocks source display in a web browser. The protected loader is intended to be requested by its supported script client.</p>
  <div class="status"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 20 6v6c0 5-3.2 8-8 10-4.8-2-8-5-8-10V6l8-3Z" stroke="currentColor" stroke-width="1.6"/><path d="m8 12 2.5 2.5L16 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg> Browser source view restricted</div>
  <footer>VOID DEVELOPMENT · SCRIPT PROTECTION</footer>
</main>
</body>
</html>`;

app.get("/api/", (c) => c.json({ name: "Void Development API", ok: true }));

// Dedicated, intentionally non-obvious browser protection page URL.
// This route is handled before the SPA asset fallback, so it must not resolve to the homepage.
app.get("/__void_protected_7f3d9a2c", (c) => new Response(browserProtectionPage, {
  status: 200,
  headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Pragma": "no-cache",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
  },
}));

app.get("/api/scripts/load", async (c) => {
  const slug = (c.req.query("script") || "").trim();
  const key = (c.req.query("key") || "").trim();

  // A normal browser navigation receives a branded protection screen, never the Lua body.
  // Roblox HttpGet requests typically use */* rather than text/html and continue to the loader API.
  const accept = (c.req.header("Accept") || "").toLowerCase();
  const fetchMode = (c.req.header("Sec-Fetch-Mode") || "").toLowerCase();
  const fetchDest = (c.req.header("Sec-Fetch-Dest") || "").toLowerCase();
  const browserNavigation =
    accept.includes("text/html") ||
    (fetchMode === "navigate" && (fetchDest === "document" || fetchDest === "iframe"));

  if (browserNavigation) {
    return new Response(browserProtectionPage, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
        "Vary": "Accept",
      },
    });
  }

  if (!/^[a-z0-9-]{1,80}$/.test(slug)) {
    return c.json({ protected: true, error: "Invalid script slug.", code: "INVALID_REQUEST" }, 400, {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
  }

  // Protected releases must never fall back to public loading. A missing key is denied.
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
      method: "GET",
      headers: { "Accept": "text/plain, application/json" },
    });
    const body = await upstream.text();
    const contentType = upstream.headers.get("Content-Type") || (upstream.ok ? "text/plain; charset=utf-8" : "application/json; charset=utf-8");
    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
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

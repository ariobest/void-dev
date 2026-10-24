(() => {
  const SUPABASE_URL = "https://cqtwmxojwwyeasstuhgb.supabase.co";
  const SUPABASE_KEY = "sb_publishable_qBPb1ltQbHNZ-fO3PFmDeg_IQj0QfNB";
  const STYLE_ID = "void-admin-enhancements-style";
  const OVERVIEW_ID = "void-overview-command-center";
  const DELETE_ATTR = "data-void-delete-ready";

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .void-enhanced-card{position:relative;overflow:hidden;border-color:rgba(255,255,255,.14)!important;box-shadow:0 18px 55px rgba(0,0,0,.24),inset 0 1px rgba(255,255,255,.07)!important;transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease}
    .void-enhanced-card:hover{transform:translateY(-3px);border-color:rgba(255,255,255,.28)!important;box-shadow:0 24px 70px rgba(0,0,0,.34),0 0 0 1px rgba(255,255,255,.04) inset!important}
    .void-enhanced-card:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(125deg,rgba(255,255,255,.055),transparent 38%,rgba(255,255,255,.018));mix-blend-mode:screen}
    .void-status-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:7px;background:#fff;box-shadow:0 0 12px rgba(255,255,255,.8);vertical-align:middle}
    .void-admin-delete{margin-left:8px!important;border-color:rgba(255,255,255,.12)!important;color:#bdbdbd!important}
    .void-admin-delete:hover{color:#fff!important;border-color:rgba(255,255,255,.3)!important;background:rgba(255,255,255,.07)!important}
    #${OVERVIEW_ID}{margin-bottom:16px}
    #${OVERVIEW_ID} .void-overview-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:16px}
    #${OVERVIEW_ID} .void-overview-stat{padding:18px;border:1px solid rgba(255,255,255,.11);border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.065),rgba(255,255,255,.018));box-shadow:inset 0 1px rgba(255,255,255,.05)}
    #${OVERVIEW_ID} .void-overview-stat strong{display:block;font-size:28px;letter-spacing:-.04em;margin:5px 0}
    #${OVERVIEW_ID} .void-overview-stat span{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#929292}
    #${OVERVIEW_ID} .void-overview-bottom{display:grid;grid-template-columns:1.2fr .8fr;gap:12px;margin-top:12px}
    #${OVERVIEW_ID} .void-overview-list{padding:16px;border:1px solid rgba(255,255,255,.1);border-radius:18px;background:rgba(255,255,255,.025)}
    #${OVERVIEW_ID} .void-overview-list strong{display:block;margin-bottom:8px}
    #${OVERVIEW_ID} .void-overview-list p{margin:6px 0;color:#9b9b9b;font-size:13px}
    @media(max-width:900px){#${OVERVIEW_ID} .void-overview-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#${OVERVIEW_ID} .void-overview-bottom{grid-template-columns:1fr}}
    @media(max-width:520px){#${OVERVIEW_ID} .void-overview-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  function sessionToken() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || "";
        if (!key.startsWith("sb-")) continue;
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const value = JSON.parse(raw);
        if (value && typeof value.access_token === "string") return value.access_token;
      }
    } catch (_) {}
    return "";
  }

  async function rest(path, options = {}) {
    const token = sessionToken();
    const headers = Object.assign({ apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, options.headers || {});
    return fetch(SUPABASE_URL + path, Object.assign({}, options, { headers }));
  }

  async function adminAnalytics() {
    const token = sessionToken();
    if (!token) return null;
    const response = await fetch(SUPABASE_URL + "/functions/v1/script-api", {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "admin-analytics" })
    });
    if (!response.ok) return null;
    return response.json();
  }

  function textOf(el) { return (el?.textContent || "").replace(/\s+/g, " ").trim(); }
  function isAdminOpen() { return [...document.querySelectorAll("button")].some(b => textOf(b) === "Admin panel" && b.className.includes("active")) || !!document.querySelector(".admin-layout"); }
  function activeAdminTab() {
    const side = document.querySelectorAll(".admin-sidebar button");
    for (const button of side) if (button.className.includes("admin-side-active")) return textOf(button);
    return "";
  }

  function removeApiNav() {
    document.querySelectorAll("button,a").forEach((el) => {
      const text = textOf(el).toLowerCase();
      if (text === "api & endpoints" || text === "api & endpoint" || text === "api and endpoints") el.remove();
    });
  }

  function improveCards() {
    document.querySelectorAll(".script-card").forEach((card) => {
      if (card.classList.contains("void-enhanced-card")) return;
      card.classList.add("void-enhanced-card");
      const badge = card.querySelector(".status-badge");
      if (badge && !badge.querySelector(".void-status-dot")) {
        const dot = document.createElement("span");
        dot.className = "void-status-dot";
        badge.prepend(dot);
      }
    });
  }

  async function deleteScriptBySlug(slug, button) {
    if (!slug) return;
    const ok = window.confirm(`Delete “${slug}”? This removes the script record from the library. This cannot be undone.`);
    if (!ok) return;
    button.disabled = true;
    button.textContent = "Deleting…";
    try {
      const lookup = await rest(`/rest/v1/scripts?select=id,slug&slug=eq.${encodeURIComponent(slug)}&limit=1`);
      if (!lookup.ok) throw new Error(`Could not find script (${lookup.status}).`);
      const rows = await lookup.json();
      if (!rows.length) throw new Error("Script was not found.");
      const response = await rest(`/rest/v1/scripts?id=eq.${encodeURIComponent(rows[0].id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || `Delete failed (${response.status}).`);
      }
      button.closest(".admin-script-row")?.remove();
      window.dispatchEvent(new CustomEvent("void-script-deleted", { detail: { slug } }));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Delete failed. Make sure your admin session is still active.");
      button.disabled = false;
      button.textContent = "Delete";
    }
  }

  function addDeleteButtons() {
    if (activeAdminTab() !== "Releases") return;
    document.querySelectorAll(".admin-script-row").forEach((row) => {
      if (row.getAttribute(DELETE_ATTR)) return;
      row.setAttribute(DELETE_ATTR, "1");
      const meta = row.querySelector(".admin-script-name small");
      const slug = (textOf(meta).split("·")[0] || "").trim();
      if (!slug) return;
      const edit = [...row.querySelectorAll("button")].find((b) => textOf(b) === "Edit");
      if (!edit) return;
      const del = document.createElement("button");
      del.type = "button";
      del.className = "button button-ghost button-small void-admin-delete";
      del.textContent = "Delete";
      del.addEventListener("click", () => void deleteScriptBySlug(slug, del));
      edit.insertAdjacentElement("afterend", del);
    });
  }

  function setOverviewHTML(data, scriptStats) {
    const users = Number(data?.totalUsers || 0);
    const events = Number(data?.events || 0);
    const visitors = Number(data?.uniqueVisitors || 0);
    const today = Number(data?.todayViews || 0);
    const published = Number(scriptStats?.published || 0);
    const drafts = Number(scriptStats?.drafts || 0);
    const totalViews = Number(scriptStats?.views || 0);
    const panel = document.getElementById(OVERVIEW_ID);
    if (!panel) return;
    panel.innerHTML = `
      <div class="panel-heading"><div><span class="section-kicker">COMMAND CENTER</span><h2>Overview</h2><p class="muted">Live health snapshot for users, scripts, traffic and releases.</p></div><span class="eyebrow-pill">LIVE</span></div>
      <div class="void-overview-grid">
        <div class="void-overview-stat"><span>Users</span><strong>${users}</strong><small class="muted">Registered accounts</small></div>
        <div class="void-overview-stat"><span>Published</span><strong>${published}</strong><small class="muted">Public scripts</small></div>
        <div class="void-overview-stat"><span>Drafts</span><strong>${drafts}</strong><small class="muted">Hidden releases</small></div>
        <div class="void-overview-stat"><span>Views today</span><strong>${today}</strong><small class="muted">${visitors} unique visitors</small></div>
      </div>
      <div class="void-overview-bottom">
        <div class="void-overview-list"><strong>Platform activity</strong><p>${events.toLocaleString()} tracked events in the current analytics window.</p><p>${totalViews.toLocaleString()} total script views across loaded releases.</p></div>
        <div class="void-overview-list"><strong>Admin shortcuts</strong><p>Releases → edit or delete scripts</p><p>Users → roles and bans</p><p>Analytics → detailed traffic</p></div>
      </div>`;
  }

  async function ensureOverview() {
    if (!isAdminOpen() || activeAdminTab() !== "Overview") {
      document.getElementById(OVERVIEW_ID)?.remove();
      return;
    }
    const content = document.querySelector(".admin-content");
    if (!content) return;
    let panel = document.getElementById(OVERVIEW_ID);
    if (!panel) {
      panel = document.createElement("section");
      panel.id = OVERVIEW_ID;
      panel.className = "panel";
      content.prepend(panel);
      panel.innerHTML = `<div class="panel-heading"><div><span class="section-kicker">COMMAND CENTER</span><h2>Overview</h2><p class="muted">Loading live admin metrics…</p></div></div>`;
      try {
        const [analytics, scriptsResponse] = await Promise.all([
          adminAnalytics(),
          rest("/rest/v1/scripts?select=id,status,release_status,view_count&limit=500")
        ]);
        let scriptStats = { published: 0, drafts: 0, views: 0 };
        if (scriptsResponse.ok) {
          const scripts = await scriptsResponse.json();
          scriptStats = scripts.reduce((acc, s) => {
            if (s.status === "published") acc.published++;
            else acc.drafts++;
            acc.views += Number(s.view_count || 0);
            return acc;
          }, scriptStats);
        }
        setOverviewHTML(analytics, scriptStats);
      } catch (_) {
        panel.innerHTML = `<div class="panel-heading"><div><span class="section-kicker">COMMAND CENTER</span><h2>Overview</h2><p class="muted">Metrics are temporarily unavailable. Use the Analytics and Users tabs for a full refresh.</p></div></div>`;
      }
    }
  }

  function refresh() {
    removeApiNav();
    improveCards();
    addDeleteButtons();
    void ensureOverview();
  }

  const observer = new MutationObserver(() => {
    window.clearTimeout(refresh._timer);
    refresh._timer = window.setTimeout(refresh, 80);
  });
  refresh._timer = 0;
  window.addEventListener("void-script-deleted", () => window.setTimeout(refresh, 150));
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(refresh, 250);
  window.setInterval(refresh, 1500);
})();

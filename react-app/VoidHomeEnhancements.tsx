import { useEffect, useState } from "react";

export default function VoidHomeEnhancements() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
      if (event.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText('loadstring(game:HttpGet("https://voiddev.bond/load/SLUG"))()');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const visible = query.trim().length === 0 || "scripts releases editor themes profile settings".includes(query.toLowerCase());

  return <>
    <section className="void-home-hero" aria-label="Void Development">
      <div className="void-home-orbit orbit-a" />
      <div className="void-home-orbit orbit-b" />
      <div className="void-home-hero-grid" />
      <div className="void-home-hero-inner">
        <div className="void-home-eyebrow"><span /> VOID DEVELOPMENT <span className="void-live-dot" /> LIVE</div>
        <h1>Build. Share. <em>Execute.</em></h1>
        <p>A faster home for scripts, releases, developers and protected loadstrings.</p>
        <div className="void-home-actions">
          <button className="void-home-primary" onClick={() => setPaletteOpen(true)}>Open command center <kbd>Ctrl K</kbd></button>
          <button className="void-home-secondary" onClick={copy}>Copy loadstring</button>
        </div>
        <div className="void-home-stats">
          <div><strong>ONLINE</strong><span>Scripts online</span></div>
          <div><strong>FAST</strong><span>Edge delivery</span></div>
          <div><strong>PRIVATE</strong><span>Protected source</span></div>
        </div>
      </div>
    </section>

    <section className="void-home-feature-strip" aria-label="Platform highlights">
      <article><span className="void-feature-icon">✦</span><div><b>Trending scripts</b><small>Discover what is moving now.</small></div></article>
      <article><span className="void-feature-icon">↻</span><div><b>Recently updated</b><small>Fresh releases without the clutter.</small></div></article>
      <article><span className="void-feature-icon">▣</span><div><b>Developer dashboard</b><small>Releases, usage and script control.</small></div></article>
      <article><span className="void-feature-icon">⌁</span><div><b>Live activity</b><small>See the platform stay active.</small></div></article>
    </section>

    {copied && <div className="void-copy-toast">Loadstring copied <b>✓</b></div>}

    {paletteOpen && <div className="void-command-backdrop" onMouseDown={() => setPaletteOpen(false)}>
      <div className="void-command" onMouseDown={(event) => event.stopPropagation()}>
        <div className="void-command-search"><span>⌕</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Void..."/><kbd>ESC</kbd></div>
        <div className="void-command-body">
          {visible ? <>
            <div className="void-command-label">QUICK ACTIONS</div>
            {['Scripts','Releases','Script editor','Themes','Profile','Settings'].map((item) => <button key={item} onClick={() => setPaletteOpen(false)}><span>{item}</span><kbd>↵</kbd></button>)}
          </> : <div className="void-command-empty">No matching command.</div>}
        </div>
      </div>
    </div>}
  </>;
}

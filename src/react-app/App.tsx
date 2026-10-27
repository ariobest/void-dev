import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ChangeEvent, type FormEvent } from "react";
import { createClient, type Session, type User } from "@supabase/supabase-js";
import { scriptApiUrl, supabase, supabasePublicKey } from "./lib/supabase";
import "./App.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";
import "./VoidHomeEnhancements.css";

const keySystemLuaSdk = "-- Void Development Key SDK (ModuleScript)\n-- Server-side only: place in ServerScriptService and call from a server Script.\nlocal HttpService = game:GetService(\"HttpService\")\n\nlocal KeySDK = {}\nKeySDK.Endpoint = \"https://cqtwmxojwwyeasstuhgb.supabase.co/functions/v1/script-api\"\nKeySDK.PublicKey = \"sb_publishable_qBPb1ltQbHNZ-fO3PFmDeg_IQj0QfNB\"\n\nfunction KeySDK.Validate(key, scriptSlug)\n    assert(type(key) == \"string\" and key ~= \"\", \"key is required\")\n    assert(type(scriptSlug) == \"string\" and scriptSlug ~= \"\", \"scriptSlug is required\")\n    local response = HttpService:RequestAsync({\n        Url = KeySDK.Endpoint,\n        Method = \"POST\",\n        Headers = {\n            [\"Content-Type\"] = \"application/json\",\n            [\"apikey\"] = KeySDK.PublicKey,\n        },\n        Body = HttpService:JSONEncode({\n            action = \"validate\",\n            key = key,\n            script = scriptSlug,\n        }),\n    })\n    if not response.Success then\n        return false, \"API_HTTP_\" .. tostring(response.StatusCode)\n    end\n    local ok, data = pcall(function() return HttpService:JSONDecode(response.Body) end)\n    if not ok or type(data) ~= \"table\" then\n        return false, \"INVALID_API_RESPONSE\"\n    end\n    if data.valid == true then\n        return true, data\n    end\n    return false, data.error or data.code or \"INVALID_KEY\"\nend\n\nreturn KeySDK";
const keySystemLuaExample = "-- Example server Script (not a LocalScript)\nlocal Players = game:GetService(\"Players\")\nlocal KeySDK = require(game.ServerScriptService:WaitForChild(\"KeySDK\"))\nlocal SCRIPT_SLUG = \"your-published-script-slug\"\n\n-- Call this from your server-side key-entry flow after receiving the player's key.\nlocal function checkPlayerKey(player, enteredKey)\n    local valid, result = KeySDK.Validate(enteredKey, SCRIPT_SLUG)\n    if not valid then\n        warn((\"Key rejected for %s: %s\"):format(player.Name, tostring(result)))\n        return false\n    end\n    print((\"Key accepted for %s\"):format(player.Name))\n    return true\nend\n\n-- Replace this example with your own secure key-entry UI/RemoteFunction flow.\n-- Never trust a client-only validation result for protected server actions.";

const logo = "https://cqtwmxojwwyeasstuhgb.supabase.co/storage/v1/object/public/void-files/1792744606438-void-logo-icon.png";
const themes = [
  ["spotlight","Spotlight","#f5f5f5"],["royal-blue","Royal Blue","#638cff"],["neon-rose","Neon Rose","#ff70bd"],["violet","Violet","#b58aff"],["emerald","Emerald","#62e6ad"],
  ["ice-blue","Ice Blue","#75d7ff"],["arctic","Arctic Cyan","#39f0e8"],["midnight","Midnight Blue","#4f78d8"],["ocean","Deep Ocean","#228bd6"],["sapphire","Sapphire","#4263eb"],
  ["amethyst","Amethyst","#a78bfa"],["ultraviolet","Ultraviolet","#8b5cf6"],["orchid","Orchid","#d78cff"],["magenta","Electric Magenta","#e879f9"],["hot-pink","Hot Pink","#ff4da6"],
  ["crimson","Crimson","#ff5a68"],["ruby","Ruby Red","#e83e5a"],["ember","Ember Orange","#ff8a4c"],["sunset","Sunset","#f59e68"],["amber","Amber Glow","#f5c451"],
  ["lemon","Lemon Neon","#d9f66f"],["lime","Lime Green","#a3e635"],["matrix","Matrix Green","#43e68d"],["forest","Forest Green","#4fb477"],["mint","Mint Frost","#86efc5"],
  ["silver","Silver Chrome","#c7ccd6"],["graphite","Graphite","#9ca3af"],["slate","Slate Gray","#94a3b8"],["lavender","Soft Lavender","#c4b5fd"],["cotton-candy","Cotton Candy","#f9a8d4"],
  ["coral","Coral Reef","#fb7185"],["peach","Peach Mist","#fdba9a"],["plasma","Plasma","#a3a3ff"],["laser","Laser Blue","#4cc9f0"],["mono","Monochrome","#e5e7eb"]
] as const;

type ScriptRecord = {
  id: string; name: string; slug: string; category?: string; description?: string; content?: string | null;
  status?: string; release_status?: string; banner_url?: string | null; showcase_url?: string | null;
  view_count?: number; created_at?: string; updated_at?: string; is_featured?: boolean; link?: string | null;
};
type Profile = { username: string; display_name: string; bio: string; avatar_url: string; role: string; banned: boolean };
type CookiePrefs = { necessary: true; analytics: boolean; personalization: boolean; decidedAt: string };
type Analytics = { periodDays: number; totalUsers: number; events: number; uniqueVisitors: number; todayViews: number; todayVisitors: number; byEvent: Record<string, number>; limited?: boolean };
type ExecutionStats = { totalExecutions:number; uniqueUsernames:number; limited?:boolean; query:string; robloxUser?:{id:number;name:string;displayName:string}|null; users:Array<{username:string;total:number;byScript:Record<string,number>;lastExecutedAt:string|null}>; byScript:Record<string,number> };
type MediaFileRecord = { id:string; slug:string; title:string; description:string; original_name:string; mime_type:string; size_bytes:number; download_count:number; created_at:string; updated_at?:string; storage_path?:string };
type ChatAttachment = { name:string; type:string; size:number; data:string };
type ChatMessage = { role:"user"|"assistant"; content:string; attachments?:ChatAttachment[]; imageUrl?:string };
type AdminUser = { id: string; email: string; created_at: string; last_sign_in_at: string | null; email_confirmed_at: string | null; banned_until: string | null; profile: (Partial<Profile> & { verified?: boolean }) | null; roles: string[] };

const emptyProfile: Profile = { username: "", display_name: "", bio: "", avatar_url: "", role: "user", banned: false };
const badgeIconChoices = [["shield","Shield"],["star","Star"],["crown","Crown"],["code","Code"],["check","Verified"],["bolt","Bolt"],["gem","Gem"],["flame","Flame"],["users","Community"],["terminal","Terminal"],["lock","Lock"],["award","Award"]] as const;
const featureChoices = [["save_scripts","Save scripts"],["view_releases","View releases"],["create_scripts","Create scripts"],["protect_scripts","Protect scripts"],["manage_keys","Manage keys"],["view_analytics","View analytics"],["manage_users","Manage users"],["moderate_users","Moderate users"],["manage_badges","Manage badges"],["manage_api","View API & endpoints"],["upload_media","Upload media"],["edit_roadmap","Edit roadmap"]] as const;
const navItems = [
  ["Home","home"],["Scripts","scripts"],["Saved scripts","saved"],["Releases","release"],["Script editor","editor"],
  ["Themes","palette"],["Key system","keys"],["Key history","history"],
  ["Roadmap","roadmap"],["Notifications","bell"],["Activity log","activity"],
  ["Changelog","clock"],["Help center","help"],["Profile","profile"],["Sessions","lock"],["Settings","settings"],["Admin panel","admin"]
] as const;

function BadgeGlyph({name,size=22,strokeWidth=1.7}:{name:string;size?:number;strokeWidth?:number}) {
  const paths:Record<string,React.ReactNode> = {
    shield:<><path d="M12 3 19 6v5c0 4.5-2.8 7.8-7 10-4.2-2.2-7-5.5-7-10V6l7-3Z"/><path d="m9 12 2 2 4-4"/></>,
    star:<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/>,
    crown:<><path d="m3 7 5 4 4-7 4 7 5-4-2 12H5L3 7Z"/><path d="M5 16h14"/></>,
    code:<><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></>,
    check:<><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>,
    bolt:<path d="M13 2 5 13h6l-1 9 9-12h-6l0-8Z"/>,
    gem:<><path d="m6 3-4 6 10 13L22 9l-4-6H6Z"/><path d="m2 9 20 0M6 3l6 19 6-19"/></>,
    flame:<path d="M12 22c4 0 7-3 7-7 0-3-2-5-4-7 0 3-1 4-2 5 0-5-3-8-5-10 1 5-3 7-3 12 0 4 3 7 7 7Z"/>,
    users:<><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2H3ZM16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v2"/></>,
    terminal:<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/></>,
    lock:<><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></>,
    award:<><circle cx="12" cy="8" r="5"/><path d="m8 12-2 9 6-3 6 3-2-9"/></>
  };
  return <svg className="badge-glyph" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]||paths.shield}</svg>;
}

function DiscordLogo() { return <svg className="discord-logo" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M19.73 5.12A18.4 18.4 0 0 0 15.2 3.7l-.56 1.14a16.7 16.7 0 0 0-5.28 0L8.8 3.7a18.4 18.4 0 0 0-4.53 1.42C1.4 9.36.62 13.5 1.01 17.58a18.5 18.5 0 0 0 5.56 2.82l1.2-1.96a12 12 0 0 1-1.9-.92l.46-.36c3.67 1.7 7.65 1.7 11.28 0l.47.36a12 12 0 0 1-1.91.92l1.2 1.96a18.5 18.5 0 0 0 5.56-2.82c.46-4.73-.79-8.83-3.2-12.46ZM8.82 14.9c-1.1 0-2-.99-2-2.2s.88-2.2 2-2.2 2.02 1 2 2.2c0 1.21-.88 2.2-2 2.2Zm6.36 0c-1.1 0-2-.99-2-2.2s.88-2.2 2-2.2 2.02 1 2 2.2c0 1.21-.88 2.2-2 2.2Z"/></svg>; }

function Icon({ name }: { name: string }) {
  const paths:Record<string,React.ReactNode>={
    home:<><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/></>,
    scripts:<><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/></>,
    editor:<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m8 9-3 3 3 3M13 15h4"/></>,
    roadmap:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></>,
    keys:<><circle cx="8" cy="15" r="4"/><path d="m11 12 8-8 2 2-2 2 2 2-3 3-2-2-3 3"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="m19 15 2 2-2 3-3-1-2 2h-3l-1-3-3-1-2-3 2-2V9l3-2 3 1 2-2h3l1 3 3 1z"/></>,
    admin:<><path d="M12 3 20 7v5c0 5-3.5 7.8-8 9-4.5-1.2-8-4-8-9V7z"/><path d="m9 12 2 2 4-4"/></>,
    profile:<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    saved:<><path d="M6 3h12v18l-6-4-6 4z"/></>,
    bell:<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    shield:<><path d="M12 3 20 6v5c0 5-3.5 7.8-8 10-4.5-2.2-8-5-8-10V6z"/><path d="m9 12 2 2 4-4"/></>,
    menu:<path d="M4 6h16M4 12h16M4 18h16"/>,
    search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    arrow:<><path d="M7 17 17 7M7 7h10v10"/></>,
    check:<path d="m5 12 4 4L19 6"/>,
    lock:<><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    palette:<><path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.5-3.3 2 2 0 0 1 1.5-3h1A5 5 0 0 0 22 10C21 6 17 3 12 3Z"/><path d="M7 10h.1M10 7h.1M15 7.5h.1"/></>,
    upload:<><path d="M12 16V4M7 9l5-5 5 5"/><path d="M5 14v6h14v-6"/></>,
    release:<><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/></>,
    history:<><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></>,
    chart:<><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    api:<><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></>,
    activity:<path d="M3 12h4l3-8 4 16 3-8h4"/>,
    users:<><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2zM16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v1"/></>,
    clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    media:<><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/></>,
    discord:<><path d="M19.7 5.1A18 18 0 0 0 15.2 3.7l-.6 1.1a16 16 0 0 0-5.2 0l-.6-1.1a18 18 0 0 0-4.5 1.4C1.4 9.3.7 13.5 1 17.6a18 18 0 0 0 5.6 2.8l1.2-2a12 12 0 0 1-1.9-.9l.5-.4c3.7 1.7 7.6 1.7 11.3 0l.4.4a12 12 0 0 1-1.9.9l1.2 2a18 18 0 0 0 5.6-2.8c.4-4.7-.8-8.8-3.3-12.5Z"/><circle cx="8.8" cy="12.7" r="1"/><circle cx="15.2" cy="12.7" r="1"/></>,
    help:<><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 1 1 4.4 1.9c-1.2 1-1.9 1.4-1.9 3M12 17h.01"/></>,
    close:<path d="m6 6 12 12M18 6 6 18"/>,
    "mail-check":<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6m-7 8 2 2 4-4"/></>,
    archive:<><rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v11h14V9M10 13h4"/></>,
    file:<><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/></>,
    image:<><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/></>,
    video:<><rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3z"/></>,
    "file-text":<><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/></>,
    database:<><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></>,
    calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h2M14 14h2"/></>,
    download:<><path d="M12 3v12m-5-5 5 5 5-5"/><path d="M5 17v4h14v-4"/></>,
    copy:<><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></>,
    "external-link":<><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
    edit:<><path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z"/></>,
    trash:<><path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 10v7M14 10v7"/></>,
    refresh:<><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9A7 7 0 0 1 18 6M4 12l2 6a7 7 0 0 0 12.5-3"/></>,
    "upload-cloud":<><path d="M12 16V8m-4 4 4-4 4 4"/><path d="M20 16.5A4.5 4.5 0 0 0 18 8h-1A6 6 0 0 0 5 10a4 4 0 0 0 0 8h2"/></>,
    "cloud-upload":<><path d="M12 16V8m-4 4 4-4 4 4"/><path d="M20 16.5A4.5 4.5 0 0 0 18 8h-1A6 6 0 0 0 5 10a4 4 0 0 0 0 8h2"/></>,
    "shield-check":<><path d="M12 3 20 6v5c0 5-3.5 7.8-8 10-4.5-2.2-8-5-8-10V6z"/><path d="m8 12 2.5 2.5L16 9"/></>,
    "shield-alert":<><path d="M12 3 20 6v5c0 5-3.5 7.8-8 10-4.5-2.2-8-5-8-10V6z"/><path d="M12 8v5m0 3h.01"/></>,
    "file-check":<><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5m-9 6 2 2 4-4"/></>,
    "folder-open":<><path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v2H7l-4 9z"/><path d="M3 19h14l4-9H7z"/></>,
    logout:<><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></>
  };
  return <svg className="icon icon-svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || <circle cx="12" cy="12" r="8" />}</svg>;
}

function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  const entry = document.cookie.split("; ").find((part) => part.startsWith(name + "="));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : "";
}
function writeCookie(name: string, value: string, days = 365) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = name + "=" + encodeURIComponent(value) + "; Max-Age=" + String(days * 86400) + "; Path=/; SameSite=Lax" + secure;
}
function getSessionId() {
  const key = "void_analytics_session";
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = Array.from(crypto.getRandomValues(new Uint8Array(16)), (v) => v.toString(16).padStart(2,"0")).join("");
    window.localStorage.setItem(key, id);
  }
  return id;
}
function getKeyClientId() {
  const storageKey = "void_key_client_id";
  let id = window.localStorage.getItem(storageKey);
  if (!id || !/^[a-f0-9]{48}$/i.test(id)) {
    id = Array.from(crypto.getRandomValues(new Uint8Array(24)), (v) => v.toString(16).padStart(2,"0")).join("");
    window.localStorage.setItem(storageKey, id);
  }
  return id;
}
function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80);
}
function youtubeEmbedUrl(value?: string | null) {
  if (!value) return "";
  try {
    const url = new URL(value); let id = "";
    if (url.hostname.includes("youtu.be")) id = url.pathname.split("/").filter(Boolean)[0] || "";
    else if (url.hostname.includes("youtube.com")) id = url.searchParams.get("v") || url.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1] || "";
    return /^[a-zA-Z0-9_-]{6,20}$/.test(id) ? "https://www.youtube-nocookie.com/embed/" + id : "";
  } catch { return ""; }
}
function formatMediaSize(bytes:number) {
  if(!Number.isFinite(bytes)||bytes<0)return "Unknown size";
  if(bytes<1024)return bytes+" B";
  const units=["KB","MB","GB","TB"];let size=bytes/1024,index=0;
  while(size>=1024&&index<units.length-1){size/=1024;index++;}
  return size.toLocaleString(undefined,{maximumFractionDigits:1})+" "+units[index];
}

function messageOf(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object") {
    const detail = error as { message?: unknown; details?: unknown; code?: unknown };
    if (typeof detail.message === "string" && detail.message.trim()) return detail.message;
    if (typeof detail.details === "string" && detail.details.trim()) return detail.details;
    if (typeof detail.code === "string" && detail.code === "23505") return "That script slug is already in use. Choose a different slug or edit the existing protected script.";
  }
  return "Something went wrong. Please try again.";
}

function App() {
  const [themeId,setThemeId] = useState(() => { try { return localStorage.getItem("void-theme") || "spotlight"; } catch { return "spotlight"; } });
  const [accent,setAccent] = useState(() => { try { return localStorage.getItem("void-accent") || "#f5f5f5"; } catch { return "#f5f5f5"; } });
  const isDedicatedProtector = typeof window !== "undefined" && window.location.pathname.replace(/\/+$/, "") === "/admin/protected";
  const isDedicatedFiles = typeof window !== "undefined" && window.location.pathname.replace(/\/+$/, "") === "/admin/files";
  const isDedicatedChatGPT = typeof window !== "undefined" && ["/admin/chatgpt","/admin/claude"].includes(window.location.pathname.replace(/\/+$/, ""));
  const publicMediaMatch = typeof window !== "undefined" ? window.location.pathname.match(/^\/media\/([a-z0-9-]{3,100})\/?$/) : null;
  const isPublicMediaPage = Boolean(publicMediaMatch);
  const publicMediaSlug = publicMediaMatch?.[1] || "";
  const isBrowserProtectionUrl = typeof window !== "undefined" && /^\/(?:protected-load|load)\/[^/]+\/?$/.test(window.location.pathname);
  const [active,setActive] = useState(() => isDedicatedProtector ? "Admin panel" : "Home");
  const [adminTab,setAdminTab] = useState(() => isDedicatedProtector ? "Add scripts" : "Overview");
  const [navOpen,setNavOpen] = useState(false);
  const [session,setSession] = useState<Session|null>(null);
  const [user,setUser] = useState<User|null>(null);
  const [profile,setProfile] = useState<Profile>(emptyProfile);
  const [isAdmin,setIsAdmin] = useState(false);
  const [authMode,setAuthMode] = useState<"login"|"signup">("login");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [displayName,setDisplayName] = useState("");
  const [authBusy,setAuthBusy] = useState(false);
  const [authMessage,setAuthMessage] = useState("");
  const [otpPending,setOtpPending] = useState(false);
  const [otpType,setOtpType] = useState<"email"|"signup">("email");
  const [otpCode,setOtpCode] = useState("");
  const [otpCooldown,setOtpCooldown] = useState(0);
  const [otpResending,setOtpResending] = useState(false);
  const [showPassword,setShowPassword] = useState(false);
  const [search,setSearch] = useState("");
  const [scripts,setScripts] = useState<ScriptRecord[]>([]);
  const [scriptsBusy,setScriptsBusy] = useState(false);
  const [scriptError,setScriptError] = useState("");
  const [saved,setSaved] = useState<string[]>([]);
  const [selectedScript,setSelectedScript] = useState<ScriptRecord|null>(null);
  const [roadmap,setRoadmap] = useState<Array<{id:string;title:string;game_name:string;notes:string;progress:number;status:string;is_public:boolean;sort_order:number}>>([]);
  const [roadmapDraft,setRoadmapDraft] = useState({title:"",game_name:"All games",notes:"",progress:0,status:"planned",is_public:true,sort_order:90});
  const [roadmapBusy,setRoadmapBusy] = useState(false);
  const [roadmapNotice,setRoadmapNotice] = useState("");
  const [editorCode,setEditorCode] = useState("-- Void Development Lua editor\n-- Write or paste your Lua code here.\n\nprint(\"Welcome to Void Development\")");
  const [editorName,setEditorName] = useState("Untitled.lua");
  const [notice,setNotice] = useState("");
  const [voidTipOpen,setVoidTipOpen] = useState(false);
  const [voidTipIndex,setVoidTipIndex] = useState(0);
  const [keyValue,setKeyValue] = useState("");
  const [keyResult,setKeyResult] = useState("");
  const [keyRecords,setKeyRecords] = useState<Array<Record<string,unknown>>>([]);
  const [keyCountdown,setKeyCountdown] = useState(0);
  const [keyGenerating,setKeyGenerating] = useState(false);
  const [generatedKey,setGeneratedKey] = useState("");
  const [keyGenerationError,setKeyGenerationError] = useState("");
  const [personalKeys,setPersonalKeys] = useState<Array<{key:string;script:string;expires_at:string;created_at:string}>>(() => {
    try { const stored=JSON.parse(localStorage.getItem("void_personal_keys")||"[]"); return Array.isArray(stored)?stored:[]; } catch { return []; }
  });
  const [adminKeyCount,setAdminKeyCount] = useState(1);
  const [adminKeyExpiryDays,setAdminKeyExpiryDays] = useState("30");
  const [adminKeyMaxUses,setAdminKeyMaxUses] = useState("");
  const [adminKeyLabel,setAdminKeyLabel] = useState("Void Development key");
  const [adminKeyPrefix,setAdminKeyPrefix] = useState(() => { try { return localStorage.getItem("void-key-prefix") || "VOID"; } catch { return "VOID"; } });
  const [keySettingsSection,setKeySettingsSection] = useState("Flow Theme");
  const [keyThemeSearch,setKeyThemeSearch] = useState("");
  const [keyTheme,setKeyTheme] = useState<Record<string, any>>(() => { try { return JSON.parse(localStorage.getItem("void-key-flow-theme") || "null") || {scheme:"Ocean Blue",accent:"#3b82f6",gradientStart:"#020617",gradientMiddle:"#172554",gradientEnd:"#172554",card:"#0f172a",cardBorder:"#334155",text:"#f8fafc",muted:"#94a3b8",button:"#3b82f6",buttonText:"#ffffff",progress:"#60a5fa",success:"#22c55e",warning:"#f59e0b",error:"#ef4444",gradientType:"Linear",direction:"↘",strength:100,backgroundStyle:"Aurora",backgroundImage:"",buttonStyle:"Glow",buttonRadius:14,cardRadius:22,layoutStyle:"Glass",pageTitle:"Verify a global access key.",pageSubtitle:"The connected API decides whether a key is active, expired, revoked, or out of uses.",verifyLabel:"Verify key",generatorTitle:"Generate a personal key",generatorSubtitle:"Generation uses the server-side waiting period and stores your recent keys locally on this device.",showGlow:true,showGrid:false,showBranding:true,headingSize:32,cardBlur:18}; } catch { return {scheme:"Ocean Blue",accent:"#3b82f6",gradientStart:"#020617",gradientMiddle:"#172554",gradientEnd:"#172554",card:"#0f172a",cardBorder:"#334155",text:"#f8fafc",muted:"#94a3b8",button:"#3b82f6",buttonText:"#ffffff",progress:"#60a5fa",success:"#22c55e",warning:"#f59e0b",error:"#ef4444",gradientType:"Linear",direction:"↘",strength:100,backgroundStyle:"Aurora",backgroundImage:"",buttonStyle:"Glow",buttonRadius:14,cardRadius:22,layoutStyle:"Glass",pageTitle:"Verify a global access key.",pageSubtitle:"The connected API decides whether a key is active, expired, revoked, or out of uses.",verifyLabel:"Verify key",generatorTitle:"Generate a personal key",generatorSubtitle:"Generation uses the server-side waiting period and stores your recent keys locally on this device.",showGlow:true,showGrid:false,showBranding:true,headingSize:32,cardBlur:18}; } });
  const [keyThemeUndo,setKeyThemeUndo] = useState<Array<Record<string,unknown>>>([]);
  const [keyThemeRedo,setKeyThemeRedo] = useState<Array<Record<string,unknown>>>([]);
  const [discordVerification,setDiscordVerification] = useState(() => { try { return localStorage.getItem("void-key-discord-verification") === "true"; } catch { return false; } });
  const [keyVerificationMode,setKeyVerificationMode] = useState("Email + Discord");
  const [keyAccountSecurity,setKeyAccountSecurity] = useState(true);
  const [keySubscription,setKeySubscription] = useState("All providers (default)");
  const [keyThemeNotice,setKeyThemeNotice] = useState("");
  const [generatedAdminKeys,setGeneratedAdminKeys] = useState<Array<{key:string;expires_at:string|null;script:string;label:string}>>([]);
  const [adminKeyBusy,setAdminKeyBusy] = useState(false);
  const [releaseName,setReleaseName] = useState("");
  const [releaseSlug,setReleaseSlug] = useState("");
  const [releaseDescription,setReleaseDescription] = useState("");
  const [releaseCategory,setReleaseCategory] = useState("Utility");
  const [releaseBanner,setReleaseBanner] = useState("");
  const [releaseVideo,setReleaseVideo] = useState("");
  const [releaseSource,setReleaseSource] = useState("");
  const [releaseStatus,setReleaseStatus] = useState("active");
  const [releaseVisibility,setReleaseVisibility] = useState("published");
  const [releaseNotice,setReleaseNotice] = useState("");
  const [editingScriptId,setEditingScriptId] = useState("");
  const [generatedProtectedLoader,setGeneratedProtectedLoader] = useState("");
  const [deletingScriptId,setDeletingScriptId] = useState("");

  const [users,setUsers] = useState<AdminUser[]>([]);
  const [badgeName,setBadgeName] = useState("Founding Creator");
  const [badgeRole,setBadgeRole] = useState("user");
  const [badgeIcon,setBadgeIcon] = useState("shield");
  const [badgeColor,setBadgeColor] = useState("#f5f5f5");
  const [badgeStrokeWidth,setBadgeStrokeWidth] = useState(1.7);
  const [dbBadges,setDbBadges] = useState<Array<{id:string;name:string;role:string;icon:string;color:string;strokeWidth:number}>>([]);
  const [selectedUserBadgeIds,setSelectedUserBadgeIds] = useState<string[]>([]);
  const [userBadgeNotice,setUserBadgeNotice] = useState("");
  const [userBadgeBusy,setUserBadgeBusy] = useState(false);
  const [badgeFeatures,setBadgeFeatures] = useState<string[]>(["save_scripts","view_releases"]);
  const [customBadges,setCustomBadges] = useState<Array<{name:string;role:string;icon:string;color:string;strokeWidth:number;features:string[]}>>(()=>{try{const v=JSON.parse(localStorage.getItem("void-role-badges")||"[]");return Array.isArray(v)?v:[]}catch{return[]}});
  const [userSearch,setUserSearch] = useState("");
  const [selectedAdminUserId,setSelectedAdminUserId] = useState("");
  const [adminEditEmail,setAdminEditEmail] = useState("");
  const [adminEditUsername,setAdminEditUsername] = useState("");
  const [adminEditDisplayName,setAdminEditDisplayName] = useState("");
  const [adminEditBio,setAdminEditBio] = useState("");
  const [adminEditAvatar,setAdminEditAvatar] = useState("");
  const [adminEditRole,setAdminEditRole] = useState("user");
  const [adminEditBanned,setAdminEditBanned] = useState(false);
  const [adminEditVerified,setAdminEditVerified] = useState(false);
  const [adminEditBusy,setAdminEditBusy] = useState(false);
  const [adminEditNotice,setAdminEditNotice] = useState("");
  const [analytics,setAnalytics] = useState<Analytics|null>(null);
  const [analyticsError,setAnalyticsError] = useState("");
  const [executionStats,setExecutionStats] = useState<ExecutionStats|null>(null);
  const [executionSearch,setExecutionSearch] = useState("");
  const [executionBusy,setExecutionBusy] = useState(false);
  const [executionError,setExecutionError] = useState("");
  const [mediaAssets,setMediaAssets] = useState<Array<{name:string;url:string;created_at?:string;size?:number;contentType?:string}>>([]);
  const [mediaBusy,setMediaBusy] = useState(false);
  const [mediaNotice,setMediaNotice] = useState("");
  const [managedMediaFiles,setManagedMediaFiles] = useState<MediaFileRecord[]>([]);
  const [managedMediaBusy,setManagedMediaBusy] = useState(false);
  const [managedMediaSaving,setManagedMediaSaving] = useState(false);
  const [managedMediaNotice,setManagedMediaNotice] = useState("");
  const [managedMediaSearch,setManagedMediaSearch] = useState("");
  const [managedMediaTitle,setManagedMediaTitle] = useState("");
  const [managedMediaDescription,setManagedMediaDescription] = useState("");
  const [managedMediaEditingId,setManagedMediaEditingId] = useState("");
  const [managedMediaSelectedFile,setManagedMediaSelectedFile] = useState<File|null>(null);
  const [chatgptMessages,setChatGPTMessages] = useState<ChatMessage[]>([]);
  const [chatgptInput,setChatGPTInput] = useState("");
  const [chatgptAttachments,setChatGPTAttachments] = useState<ChatAttachment[]>([]);
  const [chatgptImageMode,setChatGPTImageMode] = useState(false);
  const [chatgptGeneratingImage,setChatGPTGeneratingImage] = useState(false);
  const chatgptFileInputRef = useRef<HTMLInputElement|null>(null);
  const [chatgptBusy,setChatGPTBusy] = useState(false);
  const [chatgptNotice,setChatGPTNotice] = useState("");
  const [chatgptMobileMenu,setChatGPTMobileMenu] = useState(false);
  const [publicMediaFile,setPublicMediaFile] = useState<MediaFileRecord|null>(null);
  const [publicMediaBusy,setPublicMediaBusy] = useState(false);
  const [publicMediaError,setPublicMediaError] = useState("");
  const [endpointStatus,setEndpointStatus] = useState("Checking endpoint…");
  const [apiSample] = useState("POST /functions/v1/script-api\nContent-Type: application/json\nAuthorization: Bearer YOUR_USER_ACCESS_TOKEN\n\n{\n  \"action\": \"validate\",\n  \"script\": \"your-script-slug\",\n  \"key\": \"VOID-XX-XXX-XXXX\"\n}");
  const [auditRows,setAuditRows] = useState<Array<Record<string,unknown>>>([]);
  const [reducedMotion,setReducedMotion] = useState(() => { try { return localStorage.getItem("void-motion") === "true"; } catch { return false; } });
  const [spotlight,setSpotlight] = useState(() => { try { return localStorage.getItem("void-spotlight") !== "false"; } catch { return true; } });
  const [notifications,setNotifications] = useState(true);
  const [layout,setLayout] = useState(() => { try { return localStorage.getItem("void-layout") || "Comfortable"; } catch { return "Comfortable"; } });
  const [profileName,setProfileName] = useState("");
  const [profileBio,setProfileBio] = useState("");
  const [avatarUrl,setAvatarUrl] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [sessionNotice,setSessionNotice] = useState("");
  const [cookiePrefs,setCookiePrefs] = useState<CookiePrefs|null>(() => {
    const savedCookie = readCookie("void_cookie_consent");
    if (!savedCookie) return null;
    try { return JSON.parse(savedCookie) as CookiePrefs; } catch { return null; }
  });
  const [cookieCustomize,setCookieCustomize] = useState(false);
  const [cookieAnalytics,setCookieAnalytics] = useState(() => cookiePrefs?.analytics ?? false);
  const [cookiePersonalization,setCookiePersonalization] = useState(() => cookiePrefs?.personalization ?? true);
  const [cookieNotice,setCookieNotice] = useState("");

  useEffect(() => {
    const isEditable = (target: EventTarget | null) => target instanceof HTMLElement && Boolean(target.closest('input, textarea, select, [contenteditable="true"], .source-textarea, .code-editor'));
    const blockSelectAll = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a" && !isEditable(event.target)) event.preventDefault();
    };
    const blockContextMenu = (event: MouseEvent) => {
      if (!isEditable(event.target)) event.preventDefault();
    };
    document.addEventListener("keydown", blockSelectAll, true);
    document.addEventListener("contextmenu", blockContextMenu, true);
    return () => {
      document.removeEventListener("keydown", blockSelectAll, true);
      document.removeEventListener("contextmenu", blockContextMenu, true);
    };
  }, []);

  const setPage = (page:string) => { setActive(page); setNavOpen(false); setNotice(""); };
  const apiCall = useCallback(async <T,>(action:string,body?:Record<string,unknown>):Promise<T> => {
    const token = session?.access_token;
    const response = await fetch(scriptApiUrl,{method:"POST",headers:{"Content-Type":"application/json","apikey":supabasePublicKey,...(token?{Authorization:"Bearer "+token}:{})},body:JSON.stringify({action,...(body||{})})});
    const data = await response.json().catch(()=>({error:"The API returned an invalid response."}));
    if (!response.ok) throw new Error(typeof data.error==="string"?data.error:"Request failed ("+response.status+").");
    return data as T;
  },[session]);

  const refreshProfile = useCallback(async (activeUser:User|null) => {
    if (!activeUser) { setProfile(emptyProfile); setProfileName(""); setProfileBio(""); setAvatarUrl(""); setIsAdmin(false); return; }
    setEmail(activeUser.email||"");
    const [{data:profileData},{data:roleData}] = await Promise.all([
      supabase.from("ario_profiles").select("username,display_name,bio,avatar_url,role,banned").eq("id",activeUser.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id",activeUser.id).eq("role","admin").maybeSingle()
    ]);
    const p = {...emptyProfile,...(profileData||{})} as Profile;
    setProfile(p); setProfileName(p.display_name||p.username||activeUser.email?.split("@")[0]||"Member"); setProfileBio(p.bio||""); setAvatarUrl(p.avatar_url||""); setIsAdmin(Boolean(roleData));
  },[]);

  const refreshScripts = useCallback(async () => {
    setScriptsBusy(true); setScriptError("");
    try {
      if (user && isAdmin) {
        const {data,error} = await supabase.from("scripts").select("id,name,slug,category,description,content,status,release_status,banner_url,showcase_url,view_count,created_at,updated_at").order("updated_at",{ascending:false}).limit(250);
        if (error) throw error;
        setScripts((data||[]) as ScriptRecord[]);
      } else {
        const {data,error} = await supabase.from("published_script_metadata").select("id,name,slug,category,description,link,is_featured,view_count,created_at,updated_at,release_status,banner_url,showcase_url").order("is_featured",{ascending:false}).order("updated_at",{ascending:false}).limit(100);
        if (error) throw error;
        setScripts((data||[]).map((s:Record<string,unknown>)=>({...s,status:"published",content:null})) as ScriptRecord[]);
      }
    } catch (error) { setScriptError(messageOf(error)); }
    finally { setScriptsBusy(false); }
  },[user,isAdmin]);

  const refreshRoadmap = useCallback(async () => {
    let query = supabase.from("void_roadmap_items").select("id,title,game_name,notes,progress,status,is_public,sort_order").order("sort_order",{ascending:true}).limit(100);
    if (!isAdmin) query = query.eq("is_public",true);
    const {data,error} = await query;
    if (!error && data) setRoadmap(data as typeof roadmap);
  },[isAdmin]);

  const trackEvent = useCallback(async (eventName:"page_view"|"script_view"|"release_view"|"key_validate",path:string) => {
    if (!cookiePrefs?.analytics) return;
    try { await apiCall("track-site",{event_name:eventName,path,session_id:getSessionId()}); } catch { /* Analytics must never block the workspace. */ }
  },[apiCall,cookiePrefs]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({data}) => {
      if (!mounted) return;
      setSession(data.session); setUser(data.session?.user||null);
      void refreshProfile(data.session?.user||null);
    });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_event,nextSession) => {
      setSession(nextSession); setUser(nextSession?.user||null);
      window.setTimeout(() => { void refreshProfile(nextSession?.user||null); },0);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  },[refreshProfile]);

  useEffect(() => {
    if (!isPublicMediaPage || !publicMediaSlug) return;
    let cancelled = false;
    setPublicMediaBusy(true); setPublicMediaError(""); setPublicMediaFile(null);
    fetch("/api/media/"+encodeURIComponent(publicMediaSlug), {headers:{"Accept":"application/json"}})
      .then(async response => { const data=await response.json().catch(()=>({error:"Could not read file details."})); if(!response.ok) throw new Error(typeof data.error==="string"?data.error:"File not found."); return data as {file:MediaFileRecord}; })
      .then(data => { if(!cancelled) setPublicMediaFile(data.file); })
      .catch(error => { if(!cancelled) setPublicMediaError(messageOf(error)); })
      .finally(() => { if(!cancelled) setPublicMediaBusy(false); });
    return () => { cancelled=true; };
  },[isPublicMediaPage,publicMediaSlug]);

  useEffect(() => {
    if (!isDedicatedFiles || !user || !isAdmin) return;
    let cancelled = false;
    setManagedMediaBusy(true); setManagedMediaNotice("");
    apiCall<{files:MediaFileRecord[]}>("media-list")
      .then(data => { if(!cancelled) setManagedMediaFiles(data.files||[]); })
      .catch(error => { if(!cancelled) setManagedMediaNotice(messageOf(error)); })
      .finally(() => { if(!cancelled) setManagedMediaBusy(false); });
    return () => { cancelled=true; };
  },[isDedicatedFiles,user?.id,isAdmin,apiCall]);

  useEffect(() => { void refreshScripts(); },[refreshScripts]);
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("script");
    if (!slug || !scripts.length) return;
    const match = scripts.find(item=>item.slug===slug);
    if (match) { setSelectedScript(match); setActive("Scripts"); }
  },[scripts]);
  useEffect(() => {
    if(otpCooldown<=0)return;
    const timer=window.setInterval(()=>setOtpCooldown(value=>Math.max(0,value-1)),1000);
    return ()=>window.clearInterval(timer);
  },[otpCooldown>0]);
  useEffect(() => { void refreshRoadmap(); },[refreshRoadmap]);
  useEffect(() => { if (active==="Home"||active==="Scripts"||active==="Releases") void trackEvent(active==="Scripts"?"script_view":active==="Releases"?"release_view":"page_view","/"+slugify(active)); },[active,trackEvent]);
  useEffect(() => {
    if (active !== "Home" || isDedicatedProtector) { setVoidTipOpen(false); return; }
    try { if (sessionStorage.getItem("void-welcome-pulse-seen") === "1") return; } catch {}
    const timer = window.setTimeout(() => {
      setVoidTipOpen(true);
      try { sessionStorage.setItem("void-welcome-pulse-seen","1"); } catch {}
    }, 9000);
    return () => window.clearTimeout(timer);
  },[active,isDedicatedProtector]);
  useEffect(() => { if(active==="Admin panel"&&isAdmin&&adminTab==="Overview") void loadExecutionStats(""); },[active,isAdmin,adminTab]);
  useEffect(() => {
    let mounted=true;
    fetch(scriptApiUrl+"?action=health",{headers:{apikey:supabasePublicKey}}).then(async r=>{const d=await r.json();if(mounted)setEndpointStatus(r.ok&&d.ok?"Online · API v"+d.version:"Unhealthy · "+(d.error||r.status));}).catch(()=>{if(mounted)setEndpointStatus("Offline · could not reach API");});
    return ()=>{mounted=false;};
  },[]);

  const filteredScripts = useMemo(() => scripts.filter(s => (s.name+" "+s.slug+" "+(s.category||"")+" "+(s.description||"")).toLowerCase().includes(search.toLowerCase())),[scripts,search]);
  const publicLibraryScripts = filteredScripts.filter(s => s.status === "published" && s.release_status !== "working_on");
  const visibleScripts = active==="Saved scripts" ? publicLibraryScripts.filter(s=>saved.includes(s.slug)) : publicLibraryScripts;
  const themeStyle = {"--accent":accent} as CSSProperties & {"--accent":string};
  const dedicatedAuthorized = isDedicatedProtector && Boolean(user && isAdmin);
  const userEmail = user?.email||"";
  const adminTabs = ["Overview","Script Protector","Releases","Key system","Add scripts","Media library","ChatGPT AI","Users","Analytics","Roles & badges","API & endpoints","Roadmap","Audit logs"];

  async function handleAuth(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setAuthBusy(true); setAuthMessage("");
    try {
      if(otpPending) {
        if(otpCode.length!==6||!/^[0-9]{6}$/.test(otpCode)){setAuthMessage("Enter the complete 6-digit code from your email.");return;}
        const {data,error}=await supabase.auth.verifyOtp({email:email.trim(),token:otpCode,type:otpType});
        if(error)throw error;
        if(!data.session||!data.user)throw new Error("Supabase verified the code but did not return a sign-in session. Please request a new code and try again.");
        setSession(data.session);setUser(data.user);void refreshProfile(data.user);
        setOtpPending(false);setOtpCode("");setOtpCooldown(0);
      } else if (authMode==="signup") {
        const {data,error} = await supabase.auth.signUp({email:email.trim(),password,options:{data:{display_name:displayName.trim()||email.split("@")[0]}}});
        if (error) throw error;
        if (!data.session) {
          setOtpPending(true);setOtpType("signup");setOtpCode("");setOtpCooldown(60);
          setAuthMessage("A 6-digit verification code has been sent to your email. Check your inbox and spam folder.");
          return;
        }
        setAuthMessage("Account created successfully.");
      } else {
        // Verify the password in a non-persistent client so no app session is opened before the code step.
        const verifier=createClient(scriptApiUrl.split("/functions/v1/script-api")[0],supabasePublicKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
        const {error}=await verifier.auth.signInWithPassword({email:email.trim(),password});
        if(error)throw error;
        await verifier.auth.signOut({scope:"local"});
        const {error:otpError}=await supabase.auth.signInWithOtp({email:email.trim(),options:{shouldCreateUser:false}});
        if(otpError)throw otpError;
        setOtpPending(true);setOtpType("email");setOtpCode("");setOtpCooldown(60);
        setAuthMessage("A 6-digit sign-in code has been sent to your email. Check your inbox and spam folder.");
        return;
      }
      setPage(isDedicatedProtector ? "Admin panel" : "Home");
      if (isDedicatedProtector) setAdminTab("Add scripts");
    } catch (error) { setAuthMessage(messageOf(error)); }
    finally { setAuthBusy(false); }
  }

  async function resendLoginCode() {
    if(otpCooldown>0||otpResending)return;
    setOtpResending(true);setAuthMessage("");
    try {
      if(otpType==="signup") {
        const {error}=await supabase.auth.resend({type:"signup",email:email.trim()});
        if(error)throw error;
      } else {
        const {error}=await supabase.auth.signInWithOtp({email:email.trim(),options:{shouldCreateUser:false}});
        if(error)throw error;
      }
      setOtpCooldown(60);setAuthMessage("A new 6-digit code has been requested. Check your inbox.");
    } catch(error) {setAuthMessage(messageOf(error));}
    finally {setOtpResending(false);}
  }

  async function signInGoogle() {
    setAuthBusy(true); setAuthMessage("");
    const {error} = await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin+window.location.pathname}});
    if (error) { setAuthMessage(error.message); setAuthBusy(false); }
  }

  async function signOut(global=false) {
    const {error} = await supabase.auth.signOut({scope:global?"global":"local"});
    setSessionNotice(error?error.message:(global?"Signed out from all sessions supported by the provider.":"Signed out."));
    if (!error) { setPage("Home"); setIsAdmin(false); }
  }

  async function saveProfile(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setNotice("");
    if (!user) { setNotice("Sign in to save your profile."); return; }
    const username = (profile.username||user.email?.split("@")[0]||"member").trim().slice(0,32);
    const {error} = await supabase.from("ario_profiles").upsert({id:user.id,username,display_name:profileName.trim().slice(0,60),bio:profileBio.trim().slice(0,280),avatar_url:avatarUrl.trim().slice(0,500),updated_at:new Date().toISOString()},{onConflict:"id"});
    if (error) { setNotice("Profile save failed: "+error.message); return; }
    setProfile(p=>({...p,username,display_name:profileName,bio:profileBio,avatar_url:avatarUrl})); setNotice("Profile saved to Supabase.");
  }

  async function changePassword(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSessionNotice("");
    if (newPassword.length<8) { setSessionNotice("Use at least 8 characters for the new password."); return; }
    const {error} = await supabase.auth.updateUser({password:newPassword});
    setSessionNotice(error?error.message:"Password updated successfully."); if(!error)setNewPassword("");
  }

  async function verifyKeyValue(key:string,slug:string) {
    setKeyResult(""); void trackEvent("key_validate","/key-system");
    try {
      const result=await apiCall<{valid:boolean;error?:string;code?:string;script?:{name:string;slug:string};expires_at?:string|null;max_uses?:number|null;use_count?:number;remaining_uses?:number|null}>("validate",{key:key.trim(),script:(slug.trim()||scripts.find(s=>s.status==="published")?.slug||"")});
      if(result.valid) {
        const usage=result.max_uses===null||result.max_uses===undefined?"Unlimited uses · used "+String(result.use_count||0)+" time(s)":String(result.remaining_uses??0)+" uses remaining";
        setKeyResult("VALID · ACTIVE · NOT EXPIRED · GLOBAL ACCESS · "+usage+(result.expires_at?" · Expires "+new Date(result.expires_at).toLocaleString():" · No expiry"));
      } else {
        const reason=result.code==="KEY_EXPIRED"?"EXPIRED":result.code==="KEY_REVOKED"?"REVOKED":result.code==="KEY_LIMIT_REACHED"?"TAKEN · USAGE LIMIT REACHED":result.code==="KEY_NOT_FOUND"?"INVALID · KEY NOT FOUND":"NOT VALID";
        setKeyResult(reason+" · "+(result.error||"Verification failed."));
      }
    } catch(error) { setKeyResult(messageOf(error)); }
  }
  async function validateKey(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const defaultSlug=scripts.find(s=>s.status==="published")?.slug||"";
    await verifyKeyValue(keyValue,defaultSlug);
  }

  async function startKeyGeneration(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(!scripts.some(s=>s.status==="published")) { setKeyGenerationError("No published scripts are available yet. Please try again later."); return; }
    setKeyGenerating(true); setGeneratedKey(""); setKeyGenerationError(""); setKeyCountdown(20);
    try {
      const client_id=getKeyClientId();
      const started=await apiCall<{token:string;script:string;client_id:string;wait_seconds:number}>("start-key",{client_id});
      const waitSeconds=Math.max(20,Number(started.wait_seconds)||20);
      const readyAt=Date.now()+waitSeconds*1000;
      await new Promise<void>(resolve=>{
        const tick=()=>{const left=Math.max(0,Math.ceil((readyAt-Date.now())/1000));setKeyCountdown(left);if(left===0){window.clearInterval(timer);resolve();}};
        const timer=window.setInterval(tick,200);
        tick();
      });
      const claimed=await apiCall<{ok:boolean;key:string;expires_at:string;script:string}>("claim-key",{token:started.token,script:started.script,client_id});
      setGeneratedKey(claimed.key);
      const entry={key:claimed.key,script:claimed.script,expires_at:claimed.expires_at,created_at:new Date().toISOString()};
      const updated=[entry,...personalKeys.filter(item=>item.key!==claimed.key)].slice(0,100);
      setPersonalKeys(updated);
      try { localStorage.setItem("void_personal_keys",JSON.stringify(updated)); } catch { /* Keep the key visible for this session if storage is unavailable. */ }
    } catch(error) { setKeyGenerationError(messageOf(error)); }
    finally { setKeyGenerating(false); setKeyCountdown(0); }
  }

  async function loadKeys() {
    try { const result=await apiCall<{keys:Array<Record<string,unknown>>}>("list-keys"); setKeyRecords(result.keys||[]); }
    catch(error) { setNotice(messageOf(error)); }
  }
  async function createKey(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setNotice("");
    if(!user||!isAdmin) { setNotice("Administrator access required."); return; }
    if(!scripts.some(s=>s.status==="published")) { setNotice("Publish at least one script before generating global keys."); return; }
    const quantity=Math.max(1,Math.min(100,Math.floor(Number(adminKeyCount)||1)));
    setAdminKeyBusy(true);
    const created:Array<{key:string;expires_at:string|null;script:string;label:string}>=[];
    try {
      for(let i=0;i<quantity;i++) {
        const result=await apiCall<{key:string;record:{expires_at:string|null}}>("create-key",{
          label:adminKeyLabel.trim().slice(0,80)||"Global access key",
          key_prefix:adminKeyPrefix.trim().toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,12)||"VOID",
          expires_in_days:adminKeyExpiryDays.trim()===""?null:Number(adminKeyExpiryDays),
          max_uses:adminKeyMaxUses.trim()===""?null:Number(adminKeyMaxUses)
        });
        created.push({key:result.key,expires_at:result.record?.expires_at??null,script:"All games / scripts",label:adminKeyLabel.trim()||"Global access key"});
      }
      setNotice("Generated "+created.length+" key"+(created.length===1?"":"s")+".");
    } catch(error) {
      setNotice("Generated "+created.length+" of "+quantity+" keys. "+messageOf(error));
    } finally {
      setGeneratedAdminKeys(current=>[...created,...current].slice(0,200));
      setAdminKeyBusy(false);
      await loadKeys();
    }
  }

  function scriptShareUrl(slug:string) { return window.location.origin+"/?script="+encodeURIComponent(slug); }
  function publicLoadstring(slug:string) { const encoded=encodeURIComponent(slug); return 'loadstring(game:HttpGet("https://voiddev.bond/load/'+encoded+'"))()'; }
  async function shareScript(slug:string) {
    const url=scriptShareUrl(slug);
    try { await navigator.clipboard.writeText(url); setNotice("Share link copied: "+url); }
    catch { window.prompt("Copy this script share link",url); }
  }

  async function deleteRelease(target:ScriptRecord) {
    if(!user||!isAdmin){setNotice("Administrator sign-in is required.");return;}
    if(!window.confirm("Permanently delete \""+target.name+"\"? This also removes its keys and event history. This cannot be undone."))return;
    setDeletingScriptId(target.id);setNotice("");
    try {
      await apiCall("admin-delete-script",{script_id:target.id});
      if(editingScriptId===target.id){setEditingScriptId("");setReleaseName("");setReleaseSlug("");setReleaseDescription("");setReleaseSource("");setReleaseBanner("");setReleaseVideo("");}
      await refreshScripts();setReleaseNotice("Deleted \""+target.name+"\".");setNotice("Script deleted.");
    } catch(error){setNotice(messageOf(error));}
    finally{setDeletingScriptId("");}
  }

  async function saveRelease(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setReleaseNotice("");
    if(!user||!isAdmin) { setReleaseNotice("Administrator sign-in is required."); return; }
    if(!releaseName.trim()||!releaseSlug.trim()) { setReleaseNotice("Add a script name and slug."); return; }
    if(!releaseSource.trim()) { setReleaseNotice("Upload a Lua file or paste your source first."); return; }
    if(new TextEncoder().encode(releaseSource).length>10000*1024) { setReleaseNotice("Lua source is too large. Maximum size is 10,000 KB (about 10 MB)."); return; }
    const now = new Date().toISOString();
    const baseSlug = slugify(releaseSlug || releaseName);
    // Give protected scripts a unique slug while letting the administrator choose their publication status.
    const protectionMode = isDedicatedProtector || adminTab === "Script Protector";
    const protectedSlug = protectionMode && !editingScriptId ? baseSlug+"-"+Array.from(crypto.getRandomValues(new Uint8Array(4)),v=>v.toString(16).padStart(2,"0")).join("").slice(0,6) : baseSlug;
    const effectiveVisibility = releaseVisibility;
    const record = {name:releaseName.trim().slice(0,120),slug:protectedSlug,category:releaseCategory.trim().slice(0,80)||"Utility",description:releaseDescription.trim().slice(0,2000)||"Void Development script release",content:releaseSource,status:effectiveVisibility,banner_url:releaseBanner.trim()||null,showcase_url:releaseVideo.trim()||null,release_status:releaseStatus,owner_id:user.id,updated_at:now,...((!editingScriptId||scripts.find(s=>s.id===editingScriptId)?.status!=="published")&&effectiveVisibility==="published"?{created_at:now}:{})};
    try {
      if(editingScriptId) {
        const {error}=await supabase.from("scripts").update(record).eq("id",editingScriptId);
        if(error)throw error;
      } else {
        const {error}=await supabase.from("scripts").insert(record);
        if(error)throw error;
      }
      if(protectionMode){setGeneratedProtectedLoader(publicLoadstring(protectedSlug));}
      setReleaseNotice(protectionMode ? (effectiveVisibility==="published"?"Protected script saved and published. Its loadstring uses the separate Supabase server.":"Protected script saved as a draft. Its loadstring uses the separate Supabase server.") : effectiveVisibility==="published"?"Script saved and published to the public library.":"Script saved as a draft; it is hidden from the public library.");
      setEditingScriptId(""); setReleaseName(""); setReleaseSlug(""); setReleaseDescription(""); setReleaseCategory("Utility"); setReleaseBanner(""); setReleaseVideo(""); setReleaseSource(""); setReleaseStatus("active"); setReleaseVisibility("published");
      await refreshScripts(); setAdminTab(protectionMode ? "Script Protector" : editingScriptId ? "Releases" : "Add scripts"); setActive("Admin panel");
    } catch(error) {
      const dbError = error && typeof error === "object" ? error as { code?: unknown; message?: unknown } : null;
      if (dbError?.code === "23505" || (typeof dbError?.message === "string" && /duplicate key|unique constraint/i.test(dbError.message))) {
        setReleaseNotice("That slug is already used by another script. Choose a different slug.");
      } else {
        setReleaseNotice("Could not save script: "+messageOf(error));
      }
    }
  }

  function editRelease(script:ScriptRecord) {
    setEditingScriptId(script.id);setReleaseName(script.name);setReleaseSlug(script.slug);setReleaseDescription(script.description||"");setReleaseCategory(script.category||"Utility");setReleaseBanner(script.banner_url||"");setReleaseVideo(script.showcase_url||"");setReleaseSource(script.content||"");setReleaseStatus(["active","patched","not_working"].includes(script.release_status||"")?script.release_status!:"active");setReleaseVisibility(script.status==="published"?"published":"draft");setAdminTab("Releases");setActive("Admin panel");setNotice("");
  }

  async function uploadLuaFile(e:ChangeEvent<HTMLInputElement>) {
    const file=e.target.files?.[0]; if(!file)return;
    if(!file.name.toLowerCase().endsWith(".lua")&&!file.name.toLowerCase().endsWith(".txt")) {setReleaseNotice("Choose a .lua or .txt source file.");return;}
    if(file.size>10000*1024) {e.target.value="";setReleaseNotice("File is too large. Maximum size is 10,000 KB (about 10 MB).");return;}
    const source=await file.text();setReleaseSource(source);setReleaseName(old=>old||file.name.replace(/\.(lua|txt)$/i,""));setReleaseSlug(old=>old||slugify(file.name.replace(/\.(lua|txt)$/i,"")));setReleaseNotice("Loaded "+file.name+" into the editor. Save it to store the source in Supabase.");
  }


  async function loadAdminUsers() {
    setNotice("");
    try { const result=await apiCall<{users:AdminUser[]}>("admin-users");setUsers(result.users||[]); }
    catch(error) { setNotice(messageOf(error)); }
  }
  function selectAdminUser(target:AdminUser) {
    setSelectedAdminUserId(target.id);void loadAssignedBadges(target.id);setAdminEditEmail(target.email||"");setAdminEditUsername(target.profile?.username||"");setAdminEditDisplayName(target.profile?.display_name||"");setAdminEditBio(target.profile?.bio||"");setAdminEditAvatar(target.profile?.avatar_url||"");setAdminEditRole(target.roles.includes("admin")?"admin":target.roles.includes("moderator")?"moderator":"user");setAdminEditBanned(Boolean(target.banned_until));setAdminEditVerified(Boolean(target.profile?.verified));setAdminEditNotice("");
  }
  async function loadAssignedBadges(userId:string) {
    setUserBadgeNotice("");
    const {data,error}=await supabase.from("user_badges").select("badge_id").eq("user_id",userId);
    if(error){setUserBadgeNotice("Could not load assigned badges: "+messageOf(error));return;}
    setSelectedUserBadgeIds((data||[]).map((row:{badge_id:string})=>row.badge_id));
  }
  async function saveAssignedBadges() {
    if(!user||!isAdmin||!selectedAdminUserId)return;
    setUserBadgeBusy(true);setUserBadgeNotice("");
    try {
      const {error:delError}=await supabase.from("user_badges").delete().eq("user_id",selectedAdminUserId);
      if(delError)throw delError;
      if(selectedUserBadgeIds.length){
        const {error:insertError}=await supabase.from("user_badges").insert(selectedUserBadgeIds.map(badge_id=>({user_id:selectedAdminUserId,badge_id,awarded_by:user.id})));
        if(insertError)throw insertError;
      }
      setUserBadgeNotice("Assigned badges saved for this user.");
    } catch(error) {setUserBadgeNotice("Could not assign badges: "+messageOf(error));}
    finally {setUserBadgeBusy(false);}
  }
  async function saveAdminUser(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();const target=users.find(item=>item.id===selectedAdminUserId);if(!target)return;setAdminEditBusy(true);setAdminEditNotice("");
    try {
      await apiCall("admin-update-user",{user_id:target.id,email:adminEditEmail.trim(),username:adminEditUsername.trim(),display_name:adminEditDisplayName.trim(),bio:adminEditBio.trim(),avatar_url:adminEditAvatar.trim(),role:adminEditRole,banned:adminEditBanned,verified:adminEditVerified});
      await loadAdminUsers();setAdminEditNotice("User details saved successfully.");
    } catch(error) { setAdminEditNotice(messageOf(error)); }
    finally { setAdminEditBusy(false); }
  }
  async function loadAnalytics() {
    setAnalyticsError("");
    try { const data=await apiCall<Analytics>("admin-analytics");setAnalytics(data); }
    catch(error) { setAnalyticsError(messageOf(error)); }
  }

  async function loadExecutionStats(username=executionSearch) {
    if(!user||!isAdmin)return;
    setExecutionBusy(true);setExecutionError("");
    try { const data=await apiCall<ExecutionStats>("admin-execution-stats",{username:username.trim()});setExecutionStats(data); }
    catch(error) { setExecutionError(messageOf(error)); }
    finally { setExecutionBusy(false); }
  }
  async function loadRoleBadges() {
    if(!user||!isAdmin)return;
    const [{data:badges,error:badgeError},{data:grants,error:grantError}]=await Promise.all([
      supabase.from("badges").select("id,name,description,icon_key,role_key").order("created_at",{ascending:false}).limit(100),
      supabase.from("void_role_feature_grants").select("role_key,feature_key,enabled")
    ]);
    if(badgeError||grantError){setNotice("Could not load saved role configuration: "+messageOf(badgeError||grantError));return;}
    const loaded=(badges||[]).map((b:Record<string,unknown>)=>{const description=String(b.description||"");const color=description.match(/Color (#[0-9a-f]{6})/i)?.[1]||"#f5f5f5";const strokeWidth=Number(description.match(/Stroke ([0-9.]+)/i)?.[1]||1.7);const features=(grants||[]).filter((g:Record<string,unknown>)=>g.role_key===b.role_key&&g.enabled===true).map((g:Record<string,unknown>)=>String(g.feature_key));return {id:String(b.id||""),name:String(b.name||"Badge"),role:String(b.role_key||"user"),icon:badgeIconChoices.some(([key])=>key===String(b.icon_key))?String(b.icon_key):"shield",color,strokeWidth,features};});
    setDbBadges(loaded.map(({id,name,role,icon,color,strokeWidth})=>({id,name,role,icon,color,strokeWidth})));
    setCustomBadges(loaded);try{localStorage.setItem("void-role-badges",JSON.stringify(loaded));}catch{}
  }
  async function saveRoleBadge(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();if(!user||!isAdmin){setNotice("Administrator access required.");return;}
    const item={name:badgeName.trim().slice(0,50)||"Custom badge",role:badgeRole,icon:badgeIcon,color:badgeColor,strokeWidth:badgeStrokeWidth,features:badgeFeatures};
    try {
      const {error:badgeError}=await supabase.from("badges").upsert({name:item.name,description:"Void Development role badge · Color "+item.color+" · Stroke "+item.strokeWidth,icon_key:item.icon,role_key:item.role,updated_at:new Date().toISOString()},{onConflict:"name"});if(badgeError)throw badgeError;
      const grants=featureChoices.map(([feature_key])=>({role_key:item.role,feature_key,enabled:item.features.includes(feature_key),updated_by:user.id,updated_at:new Date().toISOString()}));
      const {error:grantError}=await supabase.from("void_role_feature_grants").upsert(grants,{onConflict:"role_key,feature_key"});if(grantError)throw grantError;
      const next=[...customBadges.filter(x=>!(x.name===item.name&&x.role===item.role)),item].slice(-100);setCustomBadges(next);try{localStorage.setItem("void-role-badges",JSON.stringify(next));}catch{}
      setNotice("Badge saved to Supabase and feature grants updated for the "+item.role+" role.");
    } catch(error) {setNotice("Could not save role badge and grants: "+messageOf(error));}
  }

  async function saveManagedMedia(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(!user||!isAdmin){setManagedMediaNotice("Administrator access required.");return;}
    const title=managedMediaTitle.trim();
    if(!title){setManagedMediaNotice("Give this file a title.");return;}
    if(!managedMediaEditingId&&!managedMediaSelectedFile){setManagedMediaNotice("Choose a file to upload first.");return;}
    if(managedMediaSelectedFile&&managedMediaSelectedFile.size>100*1024*1024){setManagedMediaNotice("Files must be 100 MB or smaller.");return;}
    setManagedMediaSaving(true);setManagedMediaNotice("");
    let uploadedPath="";
    const existing=managedMediaFiles.find(file=>file.id===managedMediaEditingId);
    try {
      if(managedMediaSelectedFile){
        const safeName=managedMediaSelectedFile.name.replace(/[^a-zA-Z0-9._-]+/g,"-").replace(/^-+|-+$/g,"").slice(-150)||"download.bin";
        uploadedPath="files/"+crypto.randomUUID()+"-"+safeName;
        const {error}=await supabase.storage.from("void-media").upload(uploadedPath,managedMediaSelectedFile,{cacheControl:"3600",contentType:managedMediaSelectedFile.type||"application/octet-stream",upsert:false});
        if(error)throw error;
      }
      if(managedMediaEditingId&&existing){
        const payload:Record<string,unknown>={id:managedMediaEditingId,title,description:managedMediaDescription.trim()};
        if(managedMediaSelectedFile){payload.storage_path=uploadedPath;payload.original_name=managedMediaSelectedFile.name;payload.mime_type=managedMediaSelectedFile.type||"application/octet-stream";payload.size_bytes=managedMediaSelectedFile.size;}
        const result=await apiCall<{file:MediaFileRecord}>("media-update",payload);
        if(uploadedPath&&existing.storage_path) await supabase.storage.from("void-media").remove([existing.storage_path]);
        setManagedMediaFiles(current=>current.map(file=>file.id===managedMediaEditingId?result.file:file));
        setManagedMediaNotice("File updated. Your share link stays the same.");
      } else {
        const slugBase=slugify(title).slice(0,70)||"void-file";
        const slug=slugBase+"-"+Array.from(crypto.getRandomValues(new Uint8Array(8)),v=>v.toString(16).padStart(2,"0")).join("").slice(0,12);
        const file=managedMediaSelectedFile!;
        const result=await apiCall<{file:MediaFileRecord}>("media-create",{slug,title,description:managedMediaDescription.trim(),original_name:file.name,mime_type:file.type||"application/octet-stream",size_bytes:file.size,storage_path:uploadedPath});
        setManagedMediaFiles(current=>[result.file,...current]);
        setManagedMediaNotice("Upload complete. Your custom-domain share link is ready.");
      }
      setManagedMediaTitle("");setManagedMediaDescription("");setManagedMediaEditingId("");setManagedMediaSelectedFile(null);
    } catch(error) {
      if(uploadedPath) await supabase.storage.from("void-media").remove([uploadedPath]).catch(()=>undefined);
      setManagedMediaNotice("Could not save file: "+messageOf(error));
    } finally {setManagedMediaSaving(false);}
  }

  function editManagedMedia(file:MediaFileRecord) {
    setManagedMediaEditingId(file.id);setManagedMediaTitle(file.title);setManagedMediaDescription(file.description||"");setManagedMediaSelectedFile(null);setManagedMediaNotice("");
    window.scrollTo({top:0,behavior:"smooth"});
  }

  async function deleteManagedMedia(file:MediaFileRecord) {
    if(!user||!isAdmin){setManagedMediaNotice("Administrator access required.");return;}
    if(!window.confirm('Delete "'+file.title+'"? Anyone using its share link will no longer be able to open it.'))return;
    setManagedMediaSaving(true);setManagedMediaNotice("");
    try {
      await apiCall("media-delete",{id:file.id});
      setManagedMediaFiles(current=>current.filter(item=>item.id!==file.id));
      if(managedMediaEditingId===file.id){setManagedMediaEditingId("");setManagedMediaTitle("");setManagedMediaDescription("");setManagedMediaSelectedFile(null);}
      setManagedMediaNotice("File deleted and its share link disabled.");
    } catch(error) {setManagedMediaNotice("Could not delete file: "+messageOf(error));}
    finally {setManagedMediaSaving(false);}
  }

  async function copyManagedMediaLink(file:MediaFileRecord) {
    const url=window.location.origin+"/media/"+file.slug;
    try {await navigator.clipboard.writeText(url);setManagedMediaNotice("Share link copied: "+url);}
    catch {setManagedMediaNotice("Copy this share link: "+url);}
  }

  async function loadMedia() {
    if(!user||!isAdmin) { setMediaNotice("Administrator access required."); return; }
    setMediaBusy(true); setMediaNotice("");
    try {
      const {data,error}=await supabase.storage.from("void-files").list(user.id,{limit:100,sortBy:{column:"created_at",order:"desc"}});
      if(error) throw error;
      const assets=(data||[]).filter(item=>item.name&&!item.id?.startsWith("folder")).map(item=>{
        const path=user.id+"/"+item.name;
        const {data:publicData}=supabase.storage.from("void-files").getPublicUrl(path);
        return {name:item.name,url:publicData.publicUrl,created_at:item.created_at||undefined,size:item.metadata?.size,contentType:item.metadata?.mimetype};
      });
      setMediaAssets(assets);
    } catch(error) { setMediaNotice("Could not load media: "+messageOf(error)); }
    finally { setMediaBusy(false); }
  }

  async function uploadMediaFile(e:ChangeEvent<HTMLInputElement>) {
    const file=e.target.files?.[0];if(!file) return;
    e.target.value="";
    if(!user||!isAdmin) { setMediaNotice("Administrator access required."); return; }
    if(!file.type.startsWith("image/")&&!file.type.startsWith("video/")) { setMediaNotice("Choose an image or video file."); return; }
    if(file.size>100*1024*1024) { setMediaNotice("Files must be 100 MB or smaller. If Supabase has a lower bucket limit, its limit also applies."); return; }
    const safeName=file.name.replace(/[^a-zA-Z0-9._-]+/g,"-").replace(/^-+|-+$/g,"").slice(-120)||"media-file";
    const path=user.id+"/"+Date.now()+"-"+safeName;
    setMediaBusy(true); setMediaNotice("Uploading "+file.name+"…");
    try {
      const {error}=await supabase.storage.from("void-files").upload(path,file,{cacheControl:"3600",contentType:file.type,upsert:false});
      if(error) throw error;
      const {data}=supabase.storage.from("void-files").getPublicUrl(path);
      setMediaNotice("Upload complete. Your direct public link is ready.");
      setMediaAssets(current=>[{name:path.split("/").pop()||file.name,url:data.publicUrl,created_at:new Date().toISOString(),size:file.size,contentType:file.type},...current].slice(0,100));
    } catch(error) { setMediaNotice("Upload failed: "+messageOf(error)); }
    finally { setMediaBusy(false); }
  }
  async function loadAudit() {
    const {data,error}=await supabase.from("void_audit_logs").select("id,actor_id,action,target_type,target_id,metadata,created_at").order("created_at",{ascending:false}).limit(100);
    if(error) {setNotice(error.message);return;} setAuditRows((data||[]) as Array<Record<string,unknown>>);
  }
  async function revokeKey(id:string) {
    try { await apiCall("revoke-key",{id}); await loadKeys();setNotice("Key revoked.");}
    catch(error) {setNotice(messageOf(error));}
  }

  async function readChatAttachments(files:FileList|null) {
    if(!files)return;
    const picked=Array.from(files);
    if(chatgptAttachments.length+picked.length>4){setChatGPTNotice("Attach up to 4 files per message.");return;}
    for(const file of picked){
      if(file.size>5*1024*1024){setChatGPTNotice(file.name+" is over the 5 MB limit.");continue;}
      const isImage=file.type.startsWith("image/");
      if(isImage&&!["image/png","image/jpeg","image/webp","image/gif"].includes(file.type)){setChatGPTNotice("Use PNG, JPG, WEBP, or GIF images.");continue;}
      try{
        const data=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>typeof reader.result==="string"?resolve(reader.result):reject(new Error("Could not read file."));reader.onerror=()=>reject(new Error("Could not read "+file.name));reader.readAsDataURL(file);});
        setChatGPTAttachments(current=>current.length<4?[...current,{name:file.name,type:file.type||"application/octet-stream",size:file.size,data}]:current);
      }catch(error){setChatGPTNotice(messageOf(error));}
    }
    if(chatgptFileInputRef.current)chatgptFileInputRef.current.value="";
  }

  async function sendChatGPTMessage(e?:FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    const content=chatgptInput.trim();
    if((!content&&!chatgptAttachments.length)||chatgptBusy)return;
    if(!user||!isAdmin){setChatGPTNotice("Administrator access required.");return;}
    if(chatgptImageMode){
      if(!content){setChatGPTNotice("Describe the image you want to create.");return;}
      setChatGPTBusy(true);setChatGPTGeneratingImage(true);setChatGPTNotice("");
      const prompt=content;
      setChatGPTMessages(current=>[...current,{role:"user" as const,content:prompt}].slice(-20));
      setChatGPTInput("");setChatGPTImageMode(false);
      try{
        const data=await apiCall<{image:string;model?:string}>("openai-image",{prompt});
        if(!data?.image)throw new Error("Image generation returned no image. Please retry.");
        setChatGPTMessages(current=>[...current,{role:"assistant" as const,content:"Created image for: "+prompt,imageUrl:data.image}].slice(-40));
      }catch(error){setChatGPTNotice(messageOf(error));}
      finally{setChatGPTBusy(false);setChatGPTGeneratingImage(false);}
      return;
    }
    const currentAttachments=chatgptAttachments;
    const next:ChatMessage[]=[...chatgptMessages,{role:"user" as const,content:content||"Please review the attached file(s).",attachments:currentAttachments}].slice(-20);
    setChatGPTMessages(next);setChatGPTInput("");setChatGPTAttachments([]);setChatGPTNotice("");setChatGPTBusy(true);
    try{
      const messages=next.map((message,index)=>({role:message.role,content:message.content,...(index===next.length-1&&message.role==="user"&&message.attachments?.length?{attachments:message.attachments}:{})}));
      const data=await apiCall<{reply:string}>("openai-chat",{messages});
      if(!data||typeof data.reply!=="string"||!data.reply.trim())throw new Error("ChatGPT returned an empty response. Please retry.");
      setChatGPTMessages(current=>[...current,{role:"assistant" as const,content:data.reply}].slice(-40));
    }catch(error){setChatGPTNotice(messageOf(error));}
    finally{setChatGPTBusy(false);}
  }

  function clearChatGPTChat() {
    if(chatgptBusy)return;
    setChatGPTMessages([]);setChatGPTAttachments([]);setChatGPTNotice("");
  }
  function chooseCookies(analyticsAllowed:boolean,personalizationAllowed:boolean) {
    const prefs:CookiePrefs={necessary:true,analytics:analyticsAllowed,personalization:personalizationAllowed,decidedAt:new Date().toISOString()};
    writeCookie("void_cookie_consent",JSON.stringify(prefs));setCookiePrefs(prefs);setCookieNotice("Your cookie preferences have been saved.");setCookieCustomize(false);
  }

  const isAuthPage=active==="Sign in"||active==="Sign up";
  const pageTitle:Record<string,string>={"Scripts":"Explore the script library.","Saved scripts":"Your saved collection.","Releases":"Latest releases.","Script editor":"Your code workspace.","Themes":"Your look, your rules.","Add scripts":"Manage source, banners, showcases, and release status.","Key system":"Access verification.","Key history":"Key activity.","Roadmap":"What we’re building.","Notifications":"Updates from Void Development.","Analytics":"Real traffic, not demo numbers.","API & endpoints":"Verify the services powering your workspace.","Activity log":"Your recent workspace activity.","Community":"The creator space.","Changelog":"Product updates.","Help center":"Guides and support.","Profile":"Make your profile yours.","Sessions":"Account security.","Settings":"Workspace preferences.","Admin panel":"Manage users, releases, keys, and protection."};

  if (isPublicMediaPage) return (
    <div className="app theme-spotlight void-media-public">
      <div className="void-media-public-glow"/>
      <header className="void-media-public-top"><a href="/" className="void-media-brand"><img src={logo} alt=""/><span>VOID DEVELOPMENT<small>MEDIA</small></span></a><span className="void-media-secure"><Icon name="shield"/> PUBLIC SHARE LINK</span></header>
      <main className="void-media-public-main">
        {publicMediaBusy?<section className="void-media-public-card void-media-loading"><span className="void-media-spinner"/><h1>Loading your file…</h1><p>Getting the file details securely.</p></section>:publicMediaError||!publicMediaFile?<section className="void-media-public-card void-media-not-found"><span className="void-media-big-icon"><Icon name="file"/></span><span className="section-kicker">VOID MEDIA · FILE NOT FOUND</span><h1>This link is unavailable.</h1><p>{publicMediaError||"The file may have been removed or the share link may be incorrect."}</p><a className="void-media-button void-media-button-light" href="/">Back to Void Development <Icon name="arrow"/></a></section>:<>
          <div className="void-media-public-breadcrumb"><a href="/">Void Development</a><span>/</span><span>Media share</span></div>
          <section className="void-media-public-card">
            <div className="void-media-file-hero">
              <div className="void-media-file-icon"><Icon name={publicMediaFile.mime_type.startsWith("image/")?"image":publicMediaFile.mime_type.startsWith("video/")?"video":publicMediaFile.mime_type==="application/pdf"?"file-text":publicMediaFile.original_name.toLowerCase().endsWith(".zip")?"archive":"file"}/></div>
              <div className="void-media-file-heading"><span className="section-kicker">VOID MEDIA · SHARED FILE</span><h1>{publicMediaFile.title}</h1><p>{publicMediaFile.description||"A file shared through Void Development Media."}</p><div className="void-media-file-tags"><span><Icon name="file"/> {publicMediaFile.original_name}</span><span><Icon name="database"/> {formatMediaSize(publicMediaFile.size_bytes)}</span><span><Icon name="calendar"/> {new Date(publicMediaFile.created_at).toLocaleDateString()}</span></div></div>
              <div className="void-media-download-panel"><span className="void-media-available"><i/> FILE AVAILABLE</span><strong>{formatMediaSize(publicMediaFile.size_bytes)}</strong><small>{publicMediaFile.download_count.toLocaleString()} downloads</small><a className="void-media-button void-media-button-light" href={"/media/"+publicMediaFile.slug+"/download"}><Icon name="download"/> Download file</a><button className="void-media-button void-media-button-dark" onClick={()=>{void navigator.clipboard.writeText(window.location.href).catch(()=>undefined);}}> <Icon name="copy"/> Copy share link</button></div>
            </div>
            {publicMediaFile.mime_type.startsWith("image/")?<div className="void-media-preview"><div className="void-media-preview-head"><span>FILE PREVIEW</span><span>IMAGE</span></div><img src={"/media/"+publicMediaFile.slug+"/view"} alt={publicMediaFile.title}/></div>:publicMediaFile.mime_type.startsWith("video/")?<div className="void-media-preview"><div className="void-media-preview-head"><span>FILE PREVIEW</span><span>VIDEO</span></div><video src={"/media/"+publicMediaFile.slug+"/view"} controls playsInline/></div>:publicMediaFile.mime_type.startsWith("audio/")?<div className="void-media-preview"><div className="void-media-preview-head"><span>FILE PREVIEW</span><span>AUDIO</span></div><audio src={"/media/"+publicMediaFile.slug+"/view"} controls/></div>:publicMediaFile.mime_type==="application/pdf"?<div className="void-media-preview void-media-pdf"><div className="void-media-preview-head"><span>FILE PREVIEW</span><span>PDF DOCUMENT</span></div><iframe src={"/media/"+publicMediaFile.slug+"/view"} title={publicMediaFile.title+" preview"}/></div>:<div className="void-media-archive-note"><span className="void-media-big-icon"><Icon name={publicMediaFile.original_name.toLowerCase().endsWith(".zip")?"archive":"file"}/></span><div><strong>{publicMediaFile.original_name.toLowerCase().endsWith(".zip")?"ZIP archive ready to download":"Your file is ready"}</strong><p>This file is hosted by Void Media. Download it to open or inspect its contents on your device.</p></div><a className="void-media-button void-media-button-light" href={"/media/"+publicMediaFile.slug+"/download"}><Icon name="download"/> Download</a></div>}
            <footer className="void-media-public-footer"><span><img src={logo} alt=""/> Shared with Void Media</span><span>Secure link · {formatMediaSize(publicMediaFile.size_bytes)}</span></footer>
          </section>
        </>}
      </main>
      <footer className="void-media-site-footer">VOID DEVELOPMENT <span>·</span> FILE SHARING, SIMPLIFIED</footer>
    </div>
  );

  if (isDedicatedFiles) return (
    <div className="app theme-spotlight dedicated-files">
      <div className="void-files-ambient void-files-ambient-one"/><div className="void-files-ambient void-files-ambient-two"/>
      <header className="void-files-header"><a className="void-files-brand" href="/"><img src={logo} alt="Void Development"/><span><strong>VOID MEDIA</strong><small>ADMINISTRATOR WORKSPACE</small></span></a><div className="void-files-header-right"><span className="void-files-status"><i/> PRIVATE ADMIN AREA</span>{user&&<button className="void-files-signout" onClick={()=>void signOut()}>Sign out <Icon name="logout"/></button>}</div></header>
      {!user?<main className="void-files-auth-wrap"><div className="void-files-auth-copy"><span className="section-kicker">VOID MEDIA · CONTROL CENTER</span><h1>Your files.<br/><span>Your domain.</span></h1><p>Upload, organize and share files through your own Void Development links. This workspace is reserved for verified administrators.</p><div className="void-files-auth-feature"><Icon name="shield-check"/><span><strong>Admin verified</strong><small>Protected by your existing Supabase account.</small></span></div></div><form className="void-files-auth-card" onSubmit={handleAuth}><span className="section-kicker">{otpPending?"SECOND STEP · EMAIL VERIFICATION":"ADMINISTRATOR SIGN IN"}</span><div className="void-files-auth-emblem"><Icon name={otpPending?"mail-check":"lock"}/></div><h2>{otpPending?"Check your inbox":"Welcome back"}</h2><p>{otpPending?"Enter the 6-digit code sent to your email.":"Sign in with your existing Void Development account to continue."}</p>{otpPending?<><label className="form-label">6-DIGIT CODE<input inputMode="numeric" autoComplete="one-time-code" value={otpCode} maxLength={6} required onChange={e=>setOtpCode(e.target.value.replace(/[^0-9]/g,"").slice(0,6))} placeholder="000000"/></label><button className="button button-light auth-submit" disabled={authBusy||otpCode.length!==6}>{authBusy?"Verifying…":"Verify code"} <Icon name="arrow"/></button><button className="void-files-text-button" type="button" disabled={otpCooldown>0||otpResending} onClick={()=>void resendLoginCode()}>{otpResending?"Sending…":otpCooldown>0?"Resend in "+otpCooldown+"s":"Resend code"}</button></>:<><label className="form-label">EMAIL ADDRESS<input type="email" autoComplete="email" value={email} required onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com"/></label><label className="form-label">PASSWORD<input type="password" autoComplete="current-password" minLength={8} value={password} required onChange={e=>setPassword(e.target.value)} placeholder="Your account password"/></label><button className="button button-light auth-submit" disabled={authBusy}>{authBusy?"Signing in…":"Continue securely"} <Icon name="arrow"/></button><button type="button" className="button button-ghost auth-submit" disabled={authBusy} onClick={()=>void signInGoogle()}>Continue with Google</button></>}{authMessage&&<p className="inline-notice">{authMessage}</p>}<p className="void-files-auth-footnote">Only accounts with the server-side admin role can access files and upload controls.</p></form></main>:!isAdmin?<main className="void-files-denied"><span className="void-files-denied-icon"><Icon name="shield-alert"/></span><span className="section-kicker">ACCESS RESTRICTED</span><h1>Administrator access required.</h1><p>This account is signed in, but it does not have the required admin role.</p><button className="button button-light" onClick={()=>void signOut()}>Sign out <Icon name="logout"/></button><a href="/">Return to website</a></main>:<main className="void-files-workspace">
        <section className="void-files-welcome"><div><span className="section-kicker">FILE HOSTING · CONTROL PANEL</span><h1>Your media, on <span>Void.</span></h1><p>Upload a file once, then share a clean link on your own domain. Edit details, replace uploads, and manage access from one place.</p></div><div className="void-files-stats"><div><span>FILES HOSTED</span><strong>{managedMediaFiles.length}</strong></div><div><span>TOTAL DOWNLOADS</span><strong>{managedMediaFiles.reduce((sum,file)=>sum+(Number(file.download_count)||0),0).toLocaleString()}</strong></div></div></section>
        <section className="void-files-layout">
          <form className="void-files-editor panel" onSubmit={saveManagedMedia}>
            <div className="void-files-section-heading"><div><span className="section-kicker">{managedMediaEditingId?"EDIT FILE DETAILS":"UPLOAD NEW FILE"}</span><h2>{managedMediaEditingId?"Update your file":"Add to your library"}</h2></div><span className="void-files-editor-icon"><Icon name={managedMediaEditingId?"edit":"upload-cloud"}/></span></div>
            <label className="form-label">DISPLAY NAME<input required maxLength={160} value={managedMediaTitle} onChange={e=>setManagedMediaTitle(e.target.value)} placeholder="e.g. Void UI Pack"/></label>
            <label className="form-label">DESCRIPTION <span className="void-files-optional">OPTIONAL</span><textarea rows={3} maxLength={2000} value={managedMediaDescription} onChange={e=>setManagedMediaDescription(e.target.value)} placeholder="Tell people what this file contains…"/></label>
            <label className={"void-files-dropzone"+(managedMediaSelectedFile?" has-file":"")}><input type="file" onChange={e=>setManagedMediaSelectedFile(e.target.files?.[0]||null)}/><span className="void-files-drop-icon"><Icon name={managedMediaSelectedFile?"file-check":"cloud-upload"}/></span><strong>{managedMediaSelectedFile?managedMediaSelectedFile.name:managedMediaEditingId?"Choose a replacement file (optional)":"Choose a file to upload"}</strong><small>{managedMediaSelectedFile?formatMediaSize(managedMediaSelectedFile.size)+" · ready to upload":"ZIP, images, video, PDF, text and more · up to 100 MB"}</small><span className="void-files-browse">Browse files <Icon name="arrow-up-right"/></span></label>
            <div className="void-files-upload-note"><Icon name="shield-check"/><span><strong>Private storage, public share links</strong><small>Files stay private in storage. Visitors can only access the shared file through your website URL.</small></span></div>
            {managedMediaNotice&&<p className="inline-notice void-files-notice">{managedMediaNotice}</p>}
            <button className="button button-light void-files-submit" disabled={managedMediaSaving||managedMediaBusy}>{managedMediaSaving?<><span className="void-media-spinner"/> Saving file…</>:<><Icon name={managedMediaEditingId?"check":"upload-cloud"}/>{managedMediaEditingId?"Save changes":"Upload & create share link"}</>}</button>
            {managedMediaEditingId&&<button type="button" className="button button-ghost void-files-cancel" onClick={()=>{setManagedMediaEditingId("");setManagedMediaTitle("");setManagedMediaDescription("");setManagedMediaSelectedFile(null);setManagedMediaNotice("");}}>Cancel editing</button>}
          </form>
          <section className="void-files-library panel">
            <div className="void-files-section-heading"><div><span className="section-kicker">YOUR FILES</span><h2>Media library <span className="void-files-count">{managedMediaFiles.length}</span></h2></div><button className="button button-ghost button-small" onClick={()=>{setManagedMediaBusy(true);apiCall<{files:MediaFileRecord[]}>("media-list").then(data=>setManagedMediaFiles(data.files||[])).catch(error=>setManagedMediaNotice(messageOf(error))).finally(()=>setManagedMediaBusy(false));}}><Icon name="refresh"/> Refresh</button></div>
            <div className="void-files-search"><Icon name="search"/><input value={managedMediaSearch} onChange={e=>setManagedMediaSearch(e.target.value)} placeholder="Search files by name…"/><span>{managedMediaFiles.filter(file=>(file.title+" "+file.original_name+" "+file.slug).toLowerCase().includes(managedMediaSearch.toLowerCase())).length} results</span></div>
            {managedMediaBusy?<div className="void-files-empty"><span className="void-media-spinner"/><p>Loading your library…</p></div>:managedMediaFiles.filter(file=>(file.title+" "+file.original_name+" "+file.slug).toLowerCase().includes(managedMediaSearch.toLowerCase())).length===0?<div className="void-files-empty"><span className="void-files-empty-icon"><Icon name="folder-open"/></span><strong>{managedMediaSearch?"No matching files":"Your library is empty"}</strong><p>{managedMediaSearch?"Try another search term.":"Upload your first file to create a shareable page on your domain."}</p></div>:<div className="void-files-list">{managedMediaFiles.filter(file=>(file.title+" "+file.original_name+" "+file.slug).toLowerCase().includes(managedMediaSearch.toLowerCase())).map(file=><article className="void-files-item" key={file.id}><span className="void-files-item-icon"><Icon name={file.mime_type.startsWith("image/")?"image":file.mime_type.startsWith("video/")?"video":file.mime_type==="application/pdf"?"file-text":file.original_name.toLowerCase().endsWith(".zip")?"archive":"file"}/></span><div className="void-files-item-main"><strong>{file.title}</strong><small>{file.original_name} · {formatMediaSize(file.size_bytes)}</small><div className="void-files-item-link"><span>{window.location.origin}/media/{file.slug}</span><button type="button" title="Copy share link" onClick={()=>void copyManagedMediaLink(file)}><Icon name="copy"/></button></div><div className="void-files-item-meta"><span><Icon name="download"/> {file.download_count.toLocaleString()} downloads</span><span><Icon name="calendar"/> {new Date(file.created_at).toLocaleDateString()}</span></div></div><div className="void-files-item-actions"><a className="void-files-icon-action" href={"/media/"+file.slug} target="_blank" rel="noreferrer" title="Open share page"><Icon name="external-link"/></a><a className="void-files-icon-action" href={"/media/"+file.slug+"/download"} title="Download"><Icon name="download"/></a><button className="void-files-icon-action" type="button" onClick={()=>editManagedMedia(file)} title="Edit file"><Icon name="edit"/></button><button className="void-files-icon-action danger" type="button" onClick={()=>void deleteManagedMedia(file)} disabled={managedMediaSaving} title="Delete file"><Icon name="trash"/></button></div></article>)}</div>}
          </section>
        </section>
        <footer className="void-files-footer"><span>VOID MEDIA <i/> FILE MANAGEMENT</span><span>Logged in as {user.email||"administrator"}</span></footer>
      </main>}
    </div>
  );

  if (isDedicatedChatGPT) return (
    <div className="chatgpt-page">
      <aside className={"chatgpt-sidebar"+(chatgptMobileMenu?" chatgpt-sidebar-open":"")}>
        <a className="chatgpt-brand" href="/"><img src={logo} alt="Void Development"/><span><strong>VOID DEVELOPMENT</strong><small>ADMIN AI WORKSPACE</small></span></a>
        <button className="chatgpt-new-chat" onClick={clearChatGPTChat} disabled={chatgptBusy}><Icon name="plus"/> New conversation</button>
        <div className="chatgpt-sidebar-section"><span>WORKSPACE</span><a href="/admin/files"><Icon name="folder"/> Media library</a><a href="/"><Icon name="layout-dashboard"/> Main dashboard</a></div>
        <div className="chatgpt-sidebar-bottom"><span className="chatgpt-side-avatar"><img src="https://voiddev.bond/media/nox-b6f0ea09c01b/view" alt="ChatGPT OC" onError={e=>{e.currentTarget.style.display="none";}}/><Icon name="sparkles"/></span><span><strong>ChatGPT</strong><small>OpenAI · Admin assistant</small></span><span className="chatgpt-online-dot"/></div>
      </aside>
      {chatgptMobileMenu&&<button className="chatgpt-mobile-scrim" aria-label="Close menu" onClick={()=>setChatGPTMobileMenu(false)}/>}
      <main className="chatgpt-main">
        <header className="chatgpt-topbar"><button className="chatgpt-mobile-menu" onClick={()=>setChatGPTMobileMenu(v=>!v)} aria-label="Toggle menu"><Icon name="menu"/></button><div className="chatgpt-topbar-title"><span className="chatgpt-top-avatar"><img src="https://voiddev.bond/media/nox-b6f0ea09c01b/view" alt="ChatGPT" onError={e=>{e.currentTarget.style.display="none";}}/><Icon name="sparkles"/></span><div><strong>ChatGPT</strong><small>OPENAI · VOID DEVELOPMENT ASSISTANT</small></div><img className="chatgpt-logo-mark" src="https://cdn.simpleicons.org/openai/ffffff" alt="OpenAI logo"/><span className="chatgpt-model-badge">CHATGPT GPT</span></div><div className="chatgpt-top-actions"><span className="chatgpt-admin-pill"><Icon name="shield-check"/> ADMIN ONLY</span><button className="chatgpt-top-icon" title="New conversation" onClick={clearChatGPTChat} disabled={chatgptBusy}><Icon name="plus"/></button><button className="chatgpt-top-icon" title="Back to admin dashboard" onClick={()=>window.location.assign("/")}><Icon name="arrow-up-right"/></button></div></header>
        {!user?<div className="chatgpt-auth-state"><span className="chatgpt-hero-emblem"><Icon name="lock"/></span><span className="section-kicker">PRIVATE ADMIN ASSISTANT</span><h1>Sign in to meet ChatGPT.</h1><p>Use your existing Void Development account. Only administrators can use this assistant.</p><form className="chatgpt-auth-form" onSubmit={handleAuth}>{otpPending?<><label>6-DIGIT EMAIL CODE<input inputMode="numeric" autoComplete="one-time-code" value={otpCode} maxLength={6} required onChange={e=>setOtpCode(e.target.value.replace(/[^0-9]/g,"").slice(0,6))} placeholder="000000"/></label><button className="chatgpt-send-button" disabled={authBusy||otpCode.length!==6}>{authBusy?"Verifying…":"Verify code"} <Icon name="arrow"/></button><button type="button" className="chatgpt-inline-button" disabled={otpCooldown>0||otpResending} onClick={()=>void resendLoginCode()}>{otpResending?"Sending…":otpCooldown>0?"Resend in "+otpCooldown+"s":"Resend code"}</button></>:<><label>EMAIL ADDRESS<input type="email" autoComplete="email" value={email} required onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com"/></label><label>PASSWORD<input type="password" autoComplete="current-password" value={password} required onChange={e=>setPassword(e.target.value)} placeholder="Your account password"/></label><button className="chatgpt-send-button" disabled={authBusy}>{authBusy?"Signing in…":"Continue securely"} <Icon name="arrow"/></button></>}{authMessage&&<p className="chatgpt-error">{authMessage}</p>}</form></div>:!isAdmin?<div className="chatgpt-auth-state"><span className="chatgpt-hero-emblem"><Icon name="shield-alert"/></span><span className="section-kicker">ACCESS RESTRICTED</span><h1>This space is admin-only.</h1><p>Your current account does not have the administrator role required to use ChatGPT.</p><button className="chatgpt-send-button" onClick={()=>void signOut()}>Sign out <Icon name="logout"/></button><a className="chatgpt-inline-button" href="/">Return to website</a></div>:<>
          <section className={"chatgpt-conversation"+(chatgptMessages.length?" has-messages":"")}>
            {chatgptMessages.length===0?<div className="chatgpt-welcome"><div className="chatgpt-orbit"><span/><span/><span/><div className="chatgpt-welcome-avatar"><img src="https://voiddev.bond/media/nox-b6f0ea09c01b/view" alt="ChatGPT OC" onError={e=>{e.currentTarget.style.display="none";}}/><Icon name="sparkles"/></div></div><span className="section-kicker">YOUR PRIVATE AI WORKSPACE</span><h1>How can I help<br/><span>with Void today?</span></h1><p>I’m ChatGPT, your AI assistant for website operations, coding, debugging, Supabase, Cloudflare, and release planning.</p><div className="chatgpt-suggestions"><button onClick={()=>setChatGPTInput("Review the Void Development architecture and suggest the next improvements.")}><Icon name="layers"/> Review my website architecture <Icon name="arrow-up-right"/></button><button onClick={()=>setChatGPTInput("Help me debug a problem in my Void Development website. Ask me for the exact error and relevant code.")}><Icon name="bug"/> Help debug an issue <Icon name="arrow-up-right"/></button><button onClick={()=>setChatGPTInput("Help me design a new feature for the Void Development admin panel. Suggest a safe implementation plan.")}><Icon name="wand-sparkles"/> Plan an admin feature <Icon name="arrow-up-right"/></button></div></div>:<div className="chatgpt-message-list">{chatgptMessages.map((message,index)=><article key={index} className={"chatgpt-message chatgpt-message-"+message.role}><span className="chatgpt-message-avatar">{message.role==="assistant"?<img src="https://voiddev.bond/media/nox-b6f0ea09c01b/view" alt="" onError={e=>{e.currentTarget.style.display="none";}}/>:<span>{(profileName||userEmail||"A").slice(0,1).toUpperCase()}</span>}</span><div className="chatgpt-message-body"><div className="chatgpt-message-name">{message.role==="assistant"?"ChatGPT":"You"} <small>{message.role==="assistant"?"AI ASSISTANT":"ADMINISTRATOR"}</small></div><div className="chatgpt-message-text">{message.content.split(/\n/).map((line,lineIndex)=><span key={lineIndex}>{line||" "}{lineIndex<message.content.split(/\n/).length-1&&<br/>}</span>)}</div>{message.attachments&&message.attachments.length>0&&<div className="chatgpt-attachment-list">{(message.attachments||[]).map((file,i)=><div className="chatgpt-attachment-chip" key={i}>{file.type.startsWith("image/")?<img src={file.data} alt={file.name}/>:<Icon name="file-text"/>}<span>{file.name}<small>{formatMediaSize(file.size)}</small></span></div>)}</div>}{message.imageUrl&&<a className="chatgpt-generated-image" href={message.imageUrl} download="void-generated-image.png"><img src={message.imageUrl} alt={message.content}/><span><Icon name="download"/> Save image</span></a>}{message.role==="assistant"&&!message.imageUrl&&<button className="chatgpt-copy-answer" onClick={()=>void navigator.clipboard.writeText(message.content).catch(()=>undefined)}><Icon name="copy"/> Copy response</button>}</div></article>)}{chatgptBusy&&<article className="chatgpt-message chatgpt-message-assistant"><span className="chatgpt-message-avatar"><img src="https://voiddev.bond/media/nox-b6f0ea09c01b/view" alt=""/></span><div className="chatgpt-message-body"><div className="chatgpt-message-name">ChatGPT <small>THINKING</small></div><div className="chatgpt-thinking"><i/><i/><i/></div></div></article>}<div id="openai-chat-end"/></div>}
          </section>
          <div className="chatgpt-composer-wrap"><div className="chatgpt-composer-shell">{chatgptAttachments.length>0&&<div className="chatgpt-pending-attachments">{chatgptAttachments.map((file,index)=><div className="chatgpt-attachment-chip" key={index}>{file.type.startsWith("image/")?<img src={file.data} alt={file.name}/>:<Icon name="file-text"/>}<span>{file.name}<small>{formatMediaSize(file.size)}</small></span><button type="button" onClick={()=>setChatGPTAttachments(current=>current.filter((_,i)=>i!==index))} aria-label={"Remove "+file.name}><Icon name="close"/></button></div>)}</div>}{chatgptImageMode&&<div className="chatgpt-mode-notice"><Icon name="image"/> Image creation mode — describe the image you want.</div>}<form onSubmit={sendChatGPTMessage}><input ref={chatgptFileInputRef} type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif,.pdf,.txt,.md,.csv,.json,.js,.ts,.tsx,.jsx,.html,.css,.lua,.log,.xml" className="chatgpt-hidden-file-input" onChange={e=>void readChatAttachments(e.target.files)}/><button type="button" className={"chatgpt-tool-button"+(chatgptAttachments.length?" chatgpt-tool-active":"")} title="Attach files or images" aria-label="Attach files or images" onClick={()=>chatgptFileInputRef.current?.click()} disabled={chatgptBusy}><Icon name="plus"/></button><button type="button" className={"chatgpt-tool-button"+(chatgptImageMode?" chatgpt-tool-active":"")} title="Create an image" aria-label="Create an image" onClick={()=>{setChatGPTImageMode(v=>!v);setChatGPTAttachments([]);setChatGPTNotice("");}} disabled={chatgptBusy}><Icon name="image"/></button><textarea value={chatgptInput} onChange={e=>setChatGPTInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();void sendChatGPTMessage();}}} rows={1} maxLength={8000} placeholder={chatgptImageMode?"Describe an image to generate…":"Message ChatGPT or attach files…"} disabled={chatgptBusy}/><button type="submit" className="chatgpt-submit" disabled={chatgptBusy||(!chatgptInput.trim()&&!chatgptAttachments.length)} aria-label={chatgptImageMode?"Generate image":"Send message"}><Icon name={chatgptGeneratingImage?"loader-circle":chatgptImageMode?"image":"arrow-up"}/></button></form><div className="chatgpt-composer-foot"><span><Icon name="shield-check"/> Private to administrators</span><span>Attach files/images · Create images · Enter to send</span></div></div>{chatgptNotice&&<div className="chatgpt-notice"><Icon name="alert-circle"/><span>{chatgptNotice}</span><button onClick={()=>setChatGPTNotice("")} aria-label="Dismiss error"><Icon name="close"/></button></div>}<p className="chatgpt-disclaimer">ChatGPT can make mistakes. Review code and important changes before using them. Chat currently provides guidance; it does not execute admin actions.</p></div>
        </>}
      </main>
    </div>
  );

  if (isBrowserProtectionUrl) return (
    <div style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:"24px",boxSizing:"border-box",background:"radial-gradient(ellipse 48% 42% at 50% 40%,rgba(255,255,255,.13),transparent 75%),#050505",color:"#f7f7f7",fontFamily:'Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
      <style>{`@keyframes void-protected-rise{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}@media(prefers-reduced-motion:reduce){.void-protected-card{animation:none!important}}`}</style>
      <main className="void-protected-card" style={{width:"min(620px,100%)",padding:"clamp(36px,7vw,72px) 24px",textAlign:"center",border:"1px solid rgba(255,255,255,.15)",borderRadius:"28px",background:"linear-gradient(145deg,rgba(255,255,255,.065),rgba(255,255,255,.012))",boxShadow:"0 30px 100px #000b,0 0 65px #ffffff0c,inset 0 1px #ffffff12",backdropFilter:"blur(18px)",animation:"void-protected-rise .35s ease-out both"}}>
        <img src={logo} alt="Void Development logo" style={{display:"block",width:"100px",height:"100px",objectFit:"contain",margin:"0 auto 30px",filter:"drop-shadow(0 0 18px #ffffff26)"}}/>
        <div style={{display:"inline-flex",alignItems:"center",gap:"8px",marginBottom:"22px",padding:"8px 12px",border:"1px solid #ffffff24",borderRadius:"999px",background:"#ffffff08",color:"#e5e5e5",fontSize:"11px",fontWeight:750,letterSpacing:".16em",textTransform:"uppercase"}}><span style={{width:"7px",height:"7px",borderRadius:"50%",background:"#fff",boxShadow:"0 0 12px #fff",display:"inline-block"}}/> Protected access</div>
        <h1 style={{margin:0,fontSize:"clamp(27px,5vw,46px)",lineHeight:1.12,letterSpacing:"-.05em",fontWeight:850}}>THIS SCRIPT IS PROTECTED<span style={{display:"block",marginTop:"9px",color:"#fff"}}>USING VOID DEVELOPMENT</span></h1>
        <p style={{maxWidth:"450px",margin:"22px auto 0",color:"#b7b7b7",fontSize:"15px",lineHeight:1.8}}>This script is delivered through Void Development's protected loader. Its source is not displayed on this browser page.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"10px",maxWidth:"470px",margin:"28px auto 0",textAlign:"left"}}>
          <div style={{padding:"15px",border:"1px solid #ffffff14",borderRadius:"16px",background:"#ffffff05"}}><div style={{fontSize:"11px",letterSpacing:".12em",textTransform:"uppercase",color:"#888",marginBottom:"7px"}}>Delivery</div><div style={{fontSize:"14px",fontWeight:700}}>Protected loader</div></div>
          <div style={{padding:"15px",border:"1px solid #ffffff14",borderRadius:"16px",background:"#ffffff05"}}><div style={{fontSize:"11px",letterSpacing:".12em",textTransform:"uppercase",color:"#888",marginBottom:"7px"}}>Access</div><div style={{fontSize:"14px",fontWeight:700}}>Authorized clients only</div></div>
        </div>
        <p style={{margin:"24px 0 0",fontSize:"12px",lineHeight:1.7,color:"#777"}}>If you expected a script loader, open this URL through the supported in-game loader instead of a regular browser. Never share private loader URLs publicly.</p>
        <div style={{marginTop:"25px",paddingTop:"17px",borderTop:"1px solid #ffffff12",fontSize:"10px",letterSpacing:".2em",fontWeight:700,color:"#666"}}>VOID DEVELOPMENT <span style={{color:"#aaa"}}>·</span> SCRIPT PROTECTION</div>
      </main>
    </div>
  );

  return (
    <div className={"app theme-"+themeId+(reducedMotion?" reduce-motion":"")+(spotlight?" spotlight-on":"")+(isDedicatedProtector?" dedicated-protector":"")+(dedicatedAuthorized?" dedicated-authorized":"")} style={themeStyle}>
      <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
      {isAdmin&&active==="Admin panel"&&!isDedicatedProtector&&!isDedicatedFiles&&!isDedicatedChatGPT&&<button className="chatgpt-floating-trigger" onClick={()=>window.location.assign("/admin/chatgpt")} aria-label="Open ChatGPT AI assistant"><span className="chatgpt-floating-avatar"><img src="https://cdn.simpleicons.org/openai/ffffff" alt="ChatGPT logo" onError={e=>{e.currentTarget.style.display="none";}}/></span><span><strong>Ask ChatGPT</strong><small>Void AI assistant</small></span><Icon name="arrow-up-right"/></button>}
      {!isDedicatedProtector&&<header className="topbar">
        <button className="brand" onClick={()=>setPage("Home")} aria-label="Void Development home"><img src={logo} alt="Void Development logo"/><span className="brand-word">Void Development<span className="brand-dot">.</span></span></button>
        <div className="topbar-right"><span className="system-status"><i/> {endpointStatus.startsWith("Online")?"API online":"Workspace"}</span><button className="icon-button notification-button" onClick={()=>setPage("Notifications")} aria-label="Notifications"><Icon name="bell"/><span className="notification-dot"/></button>{user?<button className="profile-chip" onClick={()=>setPage("Profile")}><span className="avatar">{(profileName||userEmail||"V").slice(0,1).toUpperCase()}</span><span>{profileName||userEmail}</span></button>:<button className="button button-light top-login" onClick={()=>{setAuthMode("login");setPage("Sign in");}}>Sign in <Icon name="arrow"/></button>}<button className="community-button" onClick={()=>window.location.assign("https://discord.gg/A2teePgta2")} aria-label="Join Community Discord"><DiscordLogo/><span>Community</span></button><button className={"menu-trigger"+(navOpen?" menu-active":"")} onClick={()=>setNavOpen(v=>!v)} aria-expanded={navOpen}><Icon name="menu"/> <span>Navigate</span></button></div>
      </header>}

      {!isDedicatedProtector&&navOpen&&<><button className="nav-scrim" aria-label="Close navigation" onClick={()=>setNavOpen(false)}/><aside className="nav-drawer"><div className="drawer-heading"><span>VOID DEVELOPMENT · NAVIGATION</span><button className="icon-button" onClick={()=>setNavOpen(false)}><Icon name="close"/></button></div><div className="drawer-links">{navItems.filter(([label])=>!["Script protector","Lua uploads"].includes(label)&&(label!=="Admin panel"||isAdmin)).map(([label,icon])=><button key={label} className={"drawer-link"+(active===label?" selected":"")+(label==="Key system"?" key-system-nav":"")} onClick={()=>setPage(label)}><Icon name={icon}/><span>{label}</span>{label==="Themes"&&<span className="drawer-count">35</span>}{label==="Admin panel"&&<span className="admin-label">ADMIN</span>}</button>)}</div><div className="drawer-bottom"><div className="drawer-user"><span className="avatar">{user?(profileName||userEmail||"V").slice(0,1).toUpperCase():"V"}</span><div><strong>{user?profileName||userEmail:"Guest session"}</strong><small>{user?(isAdmin?"Administrator":"Authenticated member"):"Sign in to sync your workspace"}</small></div></div>{user?<button className="drawer-link" onClick={()=>void signOut()}><Icon name="lock"/> Sign out</button>:<button className="drawer-link" onClick={()=>{setAuthMode("login");setPage("Sign in");}}><Icon name="profile"/> Sign in / Sign up</button>}</div></aside></>}

      <main className={"main-shell"+(isDedicatedProtector?" main-shell-dedicated":"")}>
        {isDedicatedProtector&&(!user||!isAdmin)&&active!=="Sign in"&&<section className="dedicated-access-wall panel"><img src={logo} alt="Void Development logo"/><span className="section-kicker">RESTRICTED ADMIN WORKSPACE</span><h1>{user?"Administrator access required":"Sign in to continue"}</h1><p>{user?"This dashboard is limited to accounts with the server-verified admin role. Your account does not have that permission.":"The protected-script dashboard is private. Sign in with your Void Development administrator account to continue."}</p>{user?<button className="button button-ghost" onClick={()=>void signOut()}>Sign out</button>:<button className="button button-light" onClick={()=>{setAuthMode("login");setPage("Sign in");}}>Administrator sign in <Icon name="arrow"/></button>}</section>}
        {active==="Home"&&<section className="hero"><div className="eyebrow"><span className="eyebrow-line"/> SCRIPT MANAGEMENT PLATFORM <span className="eyebrow-pill">VOID DEVELOPMENT</span></div><h1 className="hero-title">Build. Protect. Release.<br/><span className="gradient-title">Your next move starts here.</span></h1><p className="hero-subtitle">A polished workspace for your Lua releases, key verification, and creator tools.<br className="desktop-break"/> One place to manage the entire release flow.</p><div className="hero-actions"><button className="button button-light" onClick={()=>setPage("Scripts")}>Explore Scripts <Icon name="arrow"/></button></div><div className="hero-meta"><span><i className="live-pulse"/> {endpointStatus.toUpperCase()}</span><span className="meta-separator">/</span><span>35 DARK THEMES</span><span className="meta-separator">/</span><span>RESPONSIVE WORKSPACE</span></div></section>}
        {! ["Home","Admin panel"].includes(active)&&!isAuthPage&&<section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> VOID DEVELOPMENT WORKSPACE</div><h1>{pageTitle[active]||active}</h1><p>{active==="Add scripts"?"Manage Lua source, release artwork, showcase videos, and status.":active==="Analytics"?"Numbers come from recorded, consented visits in your database.":active==="Profile"?"Your public profile details and preferences.":"Connected to your existing Void Development workspace."}</p></div><button className="button button-ghost" onClick={()=>setPage("Home")}>← Home</button></section>}

        {(active==="Home"||active==="Scripts"||active==="Saved scripts"||active==="Releases")&&<><section className="stats-grid"><div className="stat-card"><div className="stat-top"><span>PUBLISHED SCRIPTS</span><span className="stat-icon"><Icon name="scripts"/></span></div><strong>{scripts.filter(s=>s.status==="published"&&s.release_status!=="working_on").length.toString().padStart(2,"0")}</strong><small>From the connected script library</small></div><div className="stat-card"><div className="stat-top"><span>YOUR SAVED</span><span className="stat-icon"><Icon name="saved"/></span></div><strong>{saved.length.toString().padStart(2,"0")}</strong><small>Saved in this browser</small></div><div className="stat-card"><div className="stat-top"><span>ROADMAP</span><span className="stat-icon"><Icon name="roadmap"/></span></div><strong>{roadmap.filter(r=>r.progress===100).length}/{roadmap.length}</strong><small>Public milestones</small></div><div className="stat-card"><div className="stat-top"><span>AUTH STATUS</span><span className="stat-icon"><Icon name="shield"/></span></div><strong className="stat-live">{user?"CONNECTED":"GUEST"}</strong><small>{user?userEmail:"Sign in to sync your account"}</small></div></section>
          <section className="section-block"><div className="section-heading"><div><span className="section-kicker">VOID LIBRARY</span><h2>{active==="Saved scripts"?"Saved scripts":active==="Releases"?"Latest releases":active==="Scripts"?"Published scripts":"Featured scripts"}</h2></div><div className="section-tools"><label className="search-box"><Icon name="search"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search scripts..."/></label>{active==="Home"&&<button className="text-button" onClick={()=>setPage("Scripts")}>View all <Icon name="arrow"/></button>}</div></div>
            {scriptsBusy?<div className="empty-state">Loading scripts from Supabase…</div>:scriptError?<div className="empty-state">Could not load scripts: {scriptError}<button className="text-button" onClick={()=>void refreshScripts()}>Retry</button></div>:<div className="script-grid">{visibleScripts.filter(s=>active!=="Home"||s.is_featured||true).map(script=><article className="script-card script-card-premium" key={script.id}><div className="script-card-art" style={script.banner_url?{backgroundImage:`linear-gradient(180deg,rgba(4,4,4,.08),rgba(4,4,4,.94)),url("${script.banner_url}")`}:undefined}><span className="script-card-watermark">V</span><span className="script-card-brand">VOID DEVELOPMENT</span><span className={"script-card-status release-state-"+(script.release_status||"working")}>{script.release_status==="patched"?"Patched":script.release_status==="not_working"?"Not working":"Working"}</span></div><div className="script-card-inner"><div className="script-card-top"><span className="script-symbol"><Icon name="code"/></span></div><h3>{script.name}</h3><p>{script.description||"A Void Development release."}</p><div className="script-game"><span>SLUG / CATEGORY</span><strong>{script.slug} · {script.category||"Utility"}</strong></div><div className="script-game"><span>RELEASED</span><strong>{script.created_at||script.updated_at?new Date(script.created_at||script.updated_at||"").toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"}):"Date unavailable"}</strong></div><div className="script-game"><span>LUA CODE</span><strong>{script.content?"Source preview available":"Source protected by Void Development"}</strong></div>{youtubeEmbedUrl(script.showcase_url)&&<div style={{marginTop:14,overflow:"hidden",borderRadius:14,border:"1px solid #ffffff18",aspectRatio:"16/9",background:"#080808"}}><iframe src={youtubeEmbedUrl(script.showcase_url)} title={script.name+" YouTube showcase"} style={{width:"100%",height:"100%",border:0,display:"block"}} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div>}{script.showcase_url&&<a className="video-link" href={script.showcase_url} target="_blank" rel="noreferrer">▶ Open YouTube showcase <Icon name="arrow"/></a>}<div className="loader-showcase" style={{marginTop:16}}><div className="loader-output"><div className="loader-output-heading"><span><i className="loader-live-dot"/> SCRIPT LOADSTRING</span><button type="button" className="button button-small button-light" onClick={()=>void navigator.clipboard.writeText(publicLoadstring(script.slug)).then(()=>setNotice("Loadstring copied."),()=>setNotice("Copy the loadstring manually."))}><Icon name="copy"/> Copy loadstring</button></div><code className="loader-code">{publicLoadstring(script.slug)}</code></div></div><div className="script-card-footer"><span className="updated">{script.view_count||0} views</span><div className="script-actions"><button className="icon-button" onClick={()=>void shareScript(script.slug)} aria-label="Copy script share link" title="Copy share link"><Icon name="arrow"/></button><button className={saved.includes(script.slug)?"icon-button is-saved":"icon-button"} onClick={()=>setSaved(old=>old.includes(script.slug)?old.filter(s=>s!==script.slug):[...old,script.slug])} aria-label="Save script"><Icon name="saved"/></button><button className="button button-small" onClick={()=>setSelectedScript(script)}>View details <Icon name="arrow"/></button></div></div></div></article>)}{visibleScripts.length===0&&<div className="empty-state">No scripts found. Published releases will appear here after an administrator publishes them.</div>}</div>}</section>
          {active==="Home"&&<section className="lower-grid"><div className="panel roadmap-preview"><div className="panel-heading"><div><span className="section-kicker">IN DEVELOPMENT</span><h2>Roadmap preview</h2></div><button className="icon-button" onClick={()=>setPage("Roadmap")} aria-label="View roadmap"><Icon name="arrow"/></button></div>{roadmap.slice(0,4).map(item=><div className="roadmap-row" key={item.id}><div className="roadmap-label"><strong>{item.title}</strong><span>{item.progress}%</span></div><div className="progress-track"><div style={{width:item.progress+"%"}}/></div></div>)}<button className="text-button roadmap-link" onClick={()=>setPage("Roadmap")}>Open roadmap <Icon name="arrow"/></button></div><div className="panel quick-panel"><span className="section-kicker">QUICK ACTIONS</span><h2>Pick up where you left off.</h2><p>Jump into protection, release management, or workspace personalization.</p>{[["Script protector","Protect a release and generate a loader","shield"],["Themes","Choose from 35 dark themes","palette"],["Profile","Customize your public profile","profile"]].map(([page,desc,icon])=><button className="quick-action" key={page} onClick={()=>{if(page==="Script protector"){setActive("Admin panel");setAdminTab("Script Protector");}else setPage(page);}}><span className="quick-icon"><Icon name={icon}/></span><span><strong>{page}</strong><small>{desc}</small></span><Icon name="arrow"/></button>)}</div></section>}</>}

        {active==="Themes"&&<section className="panel theme-gallery"><div className="panel-heading"><div><span className="section-kicker">35 COLORWAYS</span><h2>Choose your workspace theme</h2><p className="muted">Every theme keeps the interface dark and uses its color as a subtle accent.</p></div><span className="eyebrow-pill">{themes.length} THEMES</span></div><div className="theme-options theme-gallery-grid">{themes.map(t=><button key={t[0]} className={themeId===t[0]?"theme-option theme-selected":"theme-option"} onClick={()=>{setThemeId(t[0]);setAccent(t[2]);}}><span className="theme-swatch" style={{background:t[2],boxShadow:"0 0 16px "+t[2]+"33"}}/><span>{t[1]}</span>{themeId===t[0]&&<Icon name="check"/>}</button>)}</div><label className="setting-row"><span><strong>Custom accent</strong><small>Pick any color for the active theme</small></span><input type="color" value={accent} onChange={e=>setAccent(e.target.value)}/></label><button className="button button-light" onClick={()=>{try{localStorage.setItem("void-theme",themeId);localStorage.setItem("void-accent",accent);setNotice("Theme saved on this device.");}catch{setNotice("Could not save this theme on the device.");}}}>Save theme</button>{notice&&<p className="inline-notice">{notice}</p>}</section>}

        {active==="Script editor"&&<section className="editor-panel panel"><div className="editor-toolbar"><div className="editor-file"><span className="file-dot"/><input value={editorName} onChange={e=>setEditorName(e.target.value)} aria-label="File name"/></div><div className="editor-buttons"><span className="language-badge">LUA</span><button className="button button-ghost button-small" onClick={()=>setEditorCode("")}>Clear</button><button className="button button-light button-small" onClick={()=>{void navigator.clipboard.writeText(editorCode).then(()=>setNotice("Code copied."),()=>setNotice("Select the text and copy it manually."));}}>Copy code ↗</button></div></div><textarea className="code-editor" spellCheck={false} value={editorCode} onChange={e=>setEditorCode(e.target.value)} aria-label="Lua code editor"/><div className="editor-footer"><span><i className="live-pulse"/> Editor ready · {editorCode.split("\n").length} lines</span><span>Lua · UTF-8</span></div>{notice&&<p className="inline-notice">{notice}</p>}<div className="editor-note"><Icon name="shield"/><p><strong>Protected release workflow</strong><br/>Source saved here stays in your editor until you upload it. To publish source for a Roblox client loader, remember that client-executed code can be inspected by the client that receives it.</p></div></section>}

        {active==="Admin panel"&&<section className="admin-layout"><aside className="admin-sidebar panel"><div className="admin-brand"><span className="admin-mark"><Icon name="admin"/></span><div><strong>VOID CONTROL</strong><small>ADMINISTRATION</small></div></div><span className="section-kicker">MANAGEMENT</span>{adminTabs.map((tab)=><button key={tab} className={adminTab===tab?"admin-side-active":""} onClick={()=>{if(tab==="ChatGPT AI"){window.location.assign("/admin/chatgpt");return;}setAdminTab(tab);setNotice("");if(tab==="Overview"){void loadAdminUsers();void loadAnalytics();void loadAudit();void refreshScripts();void loadExecutionStats(executionSearch);}if(tab==="Roles & badges")void loadRoleBadges();if(tab==="Users"){void loadAdminUsers();void loadRoleBadges();}if(tab==="Analytics")void loadAnalytics();if(tab==="Media library")void loadMedia();if(tab==="Key system")void loadKeys();if(tab==="Audit logs")void loadAudit();if(tab==="Releases"||tab==="Add scripts"||tab==="Script Protector")void refreshScripts();}}><Icon name={tab==="Overview"?"home":tab==="Script Protector"?"shield":tab==="Releases"?"release":tab==="Key system"?"keys":tab==="Add scripts"?"upload":tab==="Media library"?"media":tab==="Users"?"users":tab==="Analytics"?"chart":tab==="API & endpoints"?"api":tab==="Roles & badges"?"shield":tab==="Roadmap"?"roadmap":tab==="ChatGPT AI"?"sparkles":"activity"}/>{tab}</button>)}<div className="admin-warning"><Icon name="shield"/><p>Server-verified admin role required for all privileged actions.</p></div></aside><div className="admin-content">
          {isAdmin&&active==="Admin panel"&&(adminTab==="Add scripts"||adminTab==="Script Protector")&&<section className="panel settings-panel"><span className="section-kicker">{adminTab==="Script Protector"?"PROTECTED SCRIPT WORKSPACE · ADMIN":"SCRIPT LIBRARY · ADMIN"}</span><h2>{adminTab==="Script Protector"?"Protect a script":editingScriptId?"Edit script":"Add a script"}</h2><p className="muted">{adminTab==="Script Protector"?"Upload or paste Lua source and generate a clean loadstring served through your Void Development website. Choose whether the script is published or kept as a draft.":"Add the Lua source and release details here. Published scripts appear in the public library; drafts stay hidden."}</p><form className="release-form" onSubmit={saveRelease}><label className="form-label">SCRIPT NAME<input required value={releaseName} onChange={e=>{setReleaseName(e.target.value);if(!releaseSlug)setReleaseSlug(slugify(e.target.value));}} placeholder="My script"/></label><label className="form-label">SCRIPT SLUG<input required value={releaseSlug} onChange={e=>setReleaseSlug(slugify(e.target.value))} placeholder="my-script"/></label><div className="two-fields"><label className="form-label">CATEGORY<input value={releaseCategory} onChange={e=>setReleaseCategory(e.target.value)} placeholder="Utility / MM2 / Other"/></label><label className="form-label">RELEASE STATUS<select value={releaseStatus} onChange={e=>setReleaseStatus(e.target.value)}><option value="active">Working</option><option value="patched">Patched</option><option value="not_working">Not working</option></select></label></div><label className="form-label">DESCRIPTION<textarea rows={3} value={releaseDescription} onChange={e=>setReleaseDescription(e.target.value)} maxLength={2000} placeholder="What does this script do?"/></label><label className="form-label">BANNER IMAGE URL<input type="url" value={releaseBanner} onChange={e=>setReleaseBanner(e.target.value)} placeholder="https://…"/></label><label className="form-label">YOUTUBE SHOWCASE URL<input type="url" value={releaseVideo} onChange={e=>setReleaseVideo(e.target.value)} placeholder="https://youtube.com/watch?v=…"/></label><label className="form-label">LUA SOURCE FILE<input type="file" accept=".lua,.txt,text/plain" onChange={e=>void uploadLuaFile(e)}/></label><label className="form-label">LUA CODE<textarea className="source-textarea" value={releaseSource} onChange={e=>setReleaseSource(e.target.value)} rows={10} maxLength={10240000} placeholder="Paste Lua source here…"/><small className="muted">Maximum source/file size: 10,000 KB (about 10 MB).</small></label><label className="form-label">PUBLICATION<select value={releaseVisibility} onChange={e=>setReleaseVisibility(e.target.value)}><option value="published">Published — show in library</option><option value="draft">Draft — keep hidden</option></select></label>{(isDedicatedProtector||adminTab==="Script Protector")&&<p className="inline-notice"><Icon name="shield"/> The generated loadstring uses your Void Development website. Choose Published to enable loading, or Draft to keep it hidden.</p>}<div className="button-row"><button className="button button-light" type="submit" disabled={!user||!isAdmin}>{(isDedicatedProtector||adminTab==="Script Protector")?releaseVisibility==="published"?"Protect & publish":"Protect & save draft":editingScriptId?"Save changes":releaseVisibility==="published"?"Add & publish script":"Save draft"} <Icon name="check"/></button><button className="button button-ghost" type="button" onClick={()=>{setEditingScriptId("");setReleaseName("");setReleaseSlug("");setReleaseDescription("");setReleaseCategory("Utility");setReleaseBanner("");setReleaseVideo("");setReleaseSource("");setReleaseStatus("active");setReleaseVisibility(isDedicatedProtector||adminTab==="Script Protector"?"draft":"published");setReleaseNotice("");}}>Clear form</button></div>{!isAdmin&&<p className="muted">Sign in with an administrator account to manage scripts.</p>}{releaseNotice&&<p className="inline-notice">{releaseNotice}</p>}{adminTab==="Script Protector"&&generatedProtectedLoader&&<div className="loader-showcase loader-showcase-admin"><div className="loader-output"><div className="loader-output-heading"><span><i className="loader-live-dot"/> GENERATED LOADSTRING</span></div><code className="loader-code">{generatedProtectedLoader}</code><div className="button-row"><button type="button" className="button button-light" onClick={()=>void navigator.clipboard.writeText(generatedProtectedLoader).then(()=>setNotice("Protected loadstring copied."),()=>setNotice("Copy the loadstring manually."))}><Icon name="copy"/> Copy loadstring</button><button type="button" className="button button-ghost" onClick={()=>setGeneratedProtectedLoader("")}>Clear result</button></div><small className="muted">The script must be published to load.</small></div></div>}</form></section>}
          {adminTab==="Overview"&&<div className="admin-overview-stack"><section className="admin-overview-hero panel"><span className="section-kicker">VOID CONTROL CENTER</span><h2>Everything at a glance.</h2><p className="muted">A live overview of releases, users, site traffic, protected drafts, and administrative activity.</p><div className="button-row"><button className="button button-light" onClick={()=>{void loadAdminUsers();void loadAnalytics();void loadAudit();void refreshScripts();void loadExecutionStats(executionSearch);}}>Refresh dashboard ↻</button><button className="button button-ghost" onClick={()=>setAdminTab("Script Protector")}>Protect a script <Icon name="shield"/></button></div></section><div className="admin-overview-stats"><button className="stat-card" onClick={()=>setAdminTab("Releases")}><span className="section-kicker">ALL SCRIPTS</span><strong>{scripts.length}</strong><small>Open release manager ↗</small></button><button className="stat-card" onClick={()=>setAdminTab("Script Protector")}><span className="section-kicker">DRAFTS / PROTECTED</span><strong>{scripts.filter(x=>x.status!=="published").length}</strong><small>Unreleased records</small></button><button className="stat-card" onClick={()=>{void loadAdminUsers();setAdminTab("Users");}}><span className="section-kicker">USERS</span><strong>{users.length}</strong><small>Accounts loaded</small></button><button className="stat-card" onClick={()=>{void loadAnalytics();setAdminTab("Analytics");}}><span className="section-kicker">VISITORS</span><strong>{analytics?.uniqueVisitors??"—"}</strong><small>{analytics?analytics.periodDays+" day window":"Load analytics"}</small></button></div><section className="panel admin-table-panel void-execution-panel"><div className="panel-heading"><div><span className="section-kicker">VOID LOADER ANALYTICS</span><h2>Script executions</h2><p className="muted">Reported loader runs by Roblox username and script.</p></div><button className="button button-ghost button-small" onClick={()=>void loadExecutionStats(executionSearch)} disabled={executionBusy}>{executionBusy?"Loading…":"Refresh"}</button></div><div className="void-execution-stats"><div><small>TOTAL REPORTED RUNS</small><strong>{executionStats?executionStats.totalExecutions.toLocaleString():"—"}</strong></div><div><small>UNIQUE USERNAMES</small><strong>{executionStats?executionStats.uniqueUsernames.toLocaleString():"—"}</strong></div></div><form className="void-execution-search" onSubmit={e=>{e.preventDefault();void loadExecutionStats(executionSearch);}}><label className="form-label">SEARCH ROBLOX USERNAME<input value={executionSearch} maxLength={32} onChange={e=>setExecutionSearch(e.target.value)} placeholder="Search part or all of a username"/></label><button className="button button-light" type="submit" disabled={executionBusy}>{executionBusy?"Searching…":"Search username"}</button><button className="button button-ghost" type="button" disabled={executionBusy} onClick={()=>{setExecutionSearch("");void loadExecutionStats("");}}>Clear</button></form>{executionStats?.query&&executionStats.robloxUser&&<div className="void-roblox-lookup"><span className="void-roblox-avatar"><Icon name="user-check"/></span><div><strong>{executionStats.robloxUser.displayName}</strong><small>@{executionStats.robloxUser.name} · Roblox ID {executionStats.robloxUser.id}</small></div><span className="void-roblox-verified">Account found</span></div>}{executionStats?.query&&!executionStats.robloxUser&&/^[A-Za-z0-9_]{3,20}$/.test(executionStats.query)&&<p className="muted">No exact Roblox account match for “{executionStats.query}”. Any execution records shown below are historical username reports, not verified Roblox identities.</p>}{executionError&&<p className="form-message">{executionError}</p>}{executionStats?.limited&&<p className="muted">Showing a recent sample of up to 10,000 execution records.</p>}{executionStats?.query&&executionStats.users.length>0&&<p className="muted">Found {executionStats.users.length} matching username{executionStats.users.length===1?"":"s"} for “{executionStats.query}”.</p>}{executionStats&&executionStats.users.length>0?<div className="void-execution-users">{executionStats.users.map(item=><article className="void-execution-user" key={item.username.toLowerCase()}><div><strong>{item.username}</strong><small>{item.lastExecutedAt?"Last run "+new Date(item.lastExecutedAt).toLocaleString():"No timestamp"}</small><div className="void-execution-breakdown">{Object.entries(item.byScript).sort((a,b)=>b[1]-a[1]).map(([slug,count])=><span key={slug}>{slug} <b>{count.toLocaleString()}</b></span>)}</div></div><strong className="void-execution-count">{item.total.toLocaleString()} <small>runs</small></strong></article>)}</div>:executionStats&&!executionBusy?<p className="muted">{executionStats.query?"No matching Roblox username has been reported yet.":"No executions have been reported yet. New runs appear after players use the updated loader."}</p>:!executionStats?<p className="muted">Load execution statistics to see reported loader runs and search usernames.</p>:null}<p className="void-execution-disclaimer">These counts are reported by the loader and are not tamper-proof. Usernames can be spoofed by modified clients; this is useful for basic analytics, not proof of identity.</p></section><div className="admin-overview-columns"><section className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">RECENT RELEASES</span><h2>Script inventory</h2></div><button className="text-button" onClick={()=>setAdminTab("Releases")}>View all ↗</button></div>{scripts.slice(0,5).map(x=><div className="admin-script-row" key={x.id}><span className="script-symbol">{"</>"}</span><div className="admin-script-name"><strong>{x.name}</strong><small>{x.slug} · {x.status||"unknown"}</small></div><button className="button button-ghost button-small" onClick={()=>editRelease(x)}>Edit &amp; update</button></div>)}{scripts.length===0&&<p className="muted">No scripts loaded yet. Refresh or create one in Script Protector.</p>}</section><section className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">SYSTEM HEALTH</span><h2>Services & activity</h2></div><button className="text-button" onClick={()=>setAdminTab("API & endpoints")}>Endpoints ↗</button></div><div className="security-list"><p>Script API<b>{endpointStatus}</b></p><p>Admin session<b>{userEmail||"No email"}</b></p><p>Analytics events<b>{analytics?.events??"Not loaded"}</b></p><p>Audit events<b>{auditRows.length}</b></p></div><button className="button button-ghost button-small" onClick={()=>{void loadAudit();setAdminTab("Audit logs");}}>Open audit log</button></section></div></div>}{adminTab==="API & endpoints"&&<section className="panel api-panel"><span className="section-kicker">ADMIN · API & ENDPOINTS</span><h2>Connected services</h2><p className="muted">API and endpoint details are available only inside the administrator panel.</p><div className="endpoint-card"><span className="live-dot"/><strong>{endpointStatus}</strong><small>{scriptApiUrl}</small></div><label className="form-label">API SAMPLE<textarea className="code-editor api-sample" readOnly value={apiSample}/></label><div className="security-list"><p>Public loader<b>/load/:slug</b></p><p>Protected loader<b>/protected-load/:slug</b></p><p>Key validation<b>Supabase script-api</b></p></div></section>}{adminTab==="Releases"&&<div className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">PUBLISHING</span><h2>Script releases</h2></div><button className="button button-light button-small" onClick={()=>{setEditingScriptId("");setReleaseName("");setReleaseSlug("");setReleaseDescription("");setReleaseSource("");setReleaseBanner("");setReleaseVideo("");setReleaseStatus("active");setReleaseVisibility("published");setAdminTab("Add scripts");}}>New release +</button></div>{editingScriptId&&<form className="release-form release-inline-editor" onSubmit={saveRelease}><div className="panel-heading"><div><span className="section-kicker">EDIT RELEASE</span><h3>{releaseName||"Script release"}</h3></div><button type="button" className="button button-ghost button-small" onClick={()=>{setEditingScriptId("");setReleaseNotice("");}}>Cancel</button></div>{releaseNotice&&<p className="form-message">{releaseNotice}</p>}<label className="form-label">SCRIPT NAME<input required value={releaseName} onChange={e=>setReleaseName(e.target.value)}/></label><div className="two-fields"><label className="form-label">SLUG<input required value={releaseSlug} onChange={e=>setReleaseSlug(slugify(e.target.value))}/></label><label className="form-label">CATEGORY<input value={releaseCategory} onChange={e=>setReleaseCategory(e.target.value)}/></label></div><label className="form-label">DESCRIPTION<textarea rows={3} value={releaseDescription} onChange={e=>setReleaseDescription(e.target.value)} maxLength={2000}/></label><div className="two-fields"><label className="form-label">BANNER IMAGE URL<input type="url" value={releaseBanner} onChange={e=>setReleaseBanner(e.target.value)} placeholder="https://…"/></label><label className="form-label">YOUTUBE SHOWCASE URL<input type="url" value={releaseVideo} onChange={e=>setReleaseVideo(e.target.value)} placeholder="https://youtube.com/watch?v=…"/></label></div>{releaseBanner&&<div className="release-edit-preview"><img src={releaseBanner} alt="Banner preview" onError={e=>{e.currentTarget.style.opacity=".25";}}/></div>}{youtubeEmbedUrl(releaseVideo)&&<div className="release-edit-video"><iframe src={youtubeEmbedUrl(releaseVideo)} title="YouTube showcase preview" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/></div>}<div className="two-fields"><label className="form-label">RELEASE STATUS<select value={releaseStatus} onChange={e=>setReleaseStatus(e.target.value)}><option value="active">Working</option><option value="patched">Patched</option><option value="not_working">Not working</option></select></label><label className="form-label">PUBLICATION<select value={releaseVisibility} onChange={e=>setReleaseVisibility(e.target.value)}><option value="published">Published</option><option value="draft">Draft</option></select></label></div><label className="form-label">UPLOAD UPDATED LUA FILE<input type="file" accept=".lua,.txt,text/plain" onChange={e=>void uploadLuaFile(e)}/><small className="muted">Choose a .lua or .txt file to replace the current source, then save release changes. Maximum size: 10 MB.</small></label><label className="form-label">LUA SOURCE<textarea className="source-textarea" rows={7} value={releaseSource} onChange={e=>setReleaseSource(e.target.value)} maxLength={10240000}/><small className="muted">You can upload a file above or edit/paste the source here.</small></label><div className="release-share-preview"><span><small>PUBLIC SHARE LINK</small><strong>{scriptShareUrl(releaseSlug||releaseName)}</strong></span><button type="button" className="button button-ghost button-small" onClick={()=>void shareScript(releaseSlug||releaseName)}>Copy link</button></div><button className="button button-light" type="submit" disabled={!user||!isAdmin}>Save release changes</button></form>}{scripts.map(s=><div className="admin-script-row" key={s.id}>{s.banner_url?<img className="admin-banner-thumb" src={s.banner_url} alt=""/>:<span className="script-symbol">{"</>"}</span>}<div className="admin-script-name"><strong>{s.name}</strong><small>{s.slug} · {s.status||"published"}</small></div><div className="release-row-actions"><button className="button button-ghost button-small" onClick={()=>void shareScript(s.slug)}>Share link</button><button className="button button-ghost button-small" onClick={()=>editRelease(s)}>Edit &amp; update</button><button className="button button-danger button-small" disabled={deletingScriptId===s.id} onClick={()=>void deleteRelease(s)}>{deletingScriptId===s.id?"Deleting…":"Delete"}</button></div></div>)}{scripts.length===0&&<p className="muted">No script records found.</p>}</div>}{adminTab==="Key system"&&<><div className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">KEY CONTROL</span><h2>Generate keys</h2><p className="muted">Generate 1–100 keys per batch. Blank expiry or usage limit means unlimited.</p></div><button className="button button-ghost button-small" onClick={()=>void loadKeys()}>Refresh keys</button></div>
<section className="key-settings-console" style={{"--flow-accent":keyTheme.accent,"--flow-card":keyTheme.card,"--flow-border":keyTheme.cardBorder,"--flow-text":keyTheme.text,"--flow-muted":keyTheme.muted,"--flow-button":keyTheme.button,"--flow-button-text":keyTheme.buttonText,"--flow-start":keyTheme.gradientStart,"--flow-mid":keyTheme.gradientMiddle,"--flow-end":keyTheme.gradientEnd,"--flow-progress":keyTheme.progress} as CSSProperties}>
  <div className="key-settings-heading"><div><span className="section-kicker">KEY SYSTEM SETTINGS</span><h2>Make the flow yours.</h2><p>Key prefixes, verification, account protection and a complete live theme editor for the homepage key flow.</p></div><span className="key-settings-live"><i/> LIVE SETTINGS</span></div>
  <div className="key-settings-nav">{["General","Verification","Theme","Account Security","Subscription","Flow Theme"].map(section=><button type="button" key={section} className={keySettingsSection===section?"active":""} onClick={()=>setKeySettingsSection(section)}>{section}</button>)}</div>
  {keySettingsSection==="General"&&<div className="key-settings-section"><div className="key-settings-section-title"><div><h3>Key prefixes</h3><p>Set the readable prefix used when issuing new keys.</p></div></div><label className="form-label">KEY PREFIX<input value={adminKeyPrefix} maxLength={12} onChange={e=>{const value=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,12);setAdminKeyPrefix(value);try{localStorage.setItem("void-key-prefix",value)}catch{}}} placeholder="VOID"/></label><div className="key-prefix-preview"><span>PREVIEW</span><code>{(adminKeyPrefix||"VOID")}-A7K9-X2PQ-8M4N</code></div><p className="muted">The prefix is included in the create-key API request. Existing keys are not changed.</p><div className="key-settings-grid"><label className="form-label">Default key label<input value={adminKeyLabel} maxLength={80} onChange={e=>setAdminKeyLabel(e.target.value)}/></label><label className="form-label">Default subscription<select value={keySubscription} onChange={e=>{setKeySubscription(e.target.value);try{localStorage.setItem("void-key-subscription",e.target.value)}catch{}}}><option>All providers (default)</option><option>Premium providers</option><option>Custom provider</option></select></label></div></div>}
  {keySettingsSection==="Verification"&&<div className="key-settings-section"><div className="key-settings-section-title"><div><h3>Verification flow</h3><p>Choose the intended verification steps for your key flow.</p></div></div><label className="form-label">VERIFICATION METHOD<select value={keyVerificationMode} onChange={e=>{setKeyVerificationMode(e.target.value);try{localStorage.setItem("void-key-verification-mode",e.target.value)}catch{}}}><option>Email + Discord</option><option>Email only</option><option>Discord only</option><option>Key only</option></select></label><div className="key-setting-toggle"><span><strong>Discord verification</strong><small>Require a Discord verification step in the user flow.</small></span><input type="checkbox" checked={discordVerification} onChange={e=>{setDiscordVerification(e.target.checked);try{localStorage.setItem("void-key-discord-verification",String(e.target.checked))}catch{}}}/></div><p className="muted">This controls the saved UI preference; a working Discord OAuth/bot verification endpoint must also be configured before it can enforce verification.</p></div>}
  {keySettingsSection==="Account Security"&&<div className="key-settings-section"><div className="key-settings-section-title"><div><h3>Account security</h3><p>Configure security expectations shown around the key flow.</p></div></div><div className="key-setting-toggle"><span><strong>Show security-first messaging</strong><small>Explain that key validation is performed by the connected server API.</small></span><input type="checkbox" checked={keyAccountSecurity} onChange={e=>{setKeyAccountSecurity(e.target.checked);try{localStorage.setItem("void-key-account-security",String(e.target.checked))}catch{}}}/></div><div className="key-settings-info"><Icon name="shield-check"/> Server-side validation remains authoritative. Theme settings never replace backend key checks.</div></div>}
  {keySettingsSection==="Subscription"&&<div className="key-settings-section"><div className="key-settings-section-title"><div><h3>Provider settings</h3><p>Choose which provider preset these appearance settings target.</p></div></div><label className="form-label">APPLIES TO<select value={keySubscription} onChange={e=>{setKeySubscription(e.target.value);try{localStorage.setItem("void-key-subscription",e.target.value)}catch{}}}><option>All providers (default)</option><option>Premium providers</option><option>Custom provider</option></select></label><p className="muted">Used by all providers without their own settings.</p></div>}
  {keySettingsSection==="Theme"&&<div className="key-settings-section"><div className="key-settings-section-title"><div><h3>Flow appearance</h3><p>Choose a preset, then fine-tune colors in Flow Theme.</p></div></div><div className="key-preset-grid">{[["Ocean Blue","#3b82f6","#020617","#172554"],["Royal Purple","#8b5cf6","#0b0617","#32105e"],["Forest Green","#22c55e","#03140c","#123c29"],["Sunset Orange","#f97316","#1b0803","#5a2110"],["Ruby Red","#ef4444","#170407","#5a1020"],["Cyber Cyan","#06b6d4","#031317","#0b3944"],["Cherry Pink","#ec4899","#180611","#55123a"],["Golden Amber","#f59e0b","#171004","#4c3009"],["Aqua Teal","#14b8a6","#031412","#10443e"],["Rose Gold","#fb7185","#17090d","#4b202b"],["Deep Indigo","#6366f1","#050617","#1e1b4b"],["Custom",keyTheme.accent,keyTheme.gradientStart,keyTheme.gradientEnd]].map(([name,color,start,end])=><button type="button" key={name} className={keyTheme.scheme===name?"selected":""} onClick={()=>{const next={...keyTheme,scheme:name,accent:color,gradientStart:start,gradientMiddle:end,gradientEnd:end,button:color};setKeyTheme(next);setKeyThemeUndo(old=>[...old,keyTheme].slice(-30));setKeyThemeRedo([]);try{localStorage.setItem("void-key-flow-theme",JSON.stringify(next))}catch{}}}><i style={{background:color}}/><span>{name}</span><small>{color}</small></button>)}</div></div>}
  {keySettingsSection==="Flow Theme"&&<div className="key-flow-editor"><div className="key-flow-toolbar"><div><h3>Flow Theme</h3><p>Customize how your key system looks to users.</p></div><div><button type="button" className="button button-ghost button-small" onClick={()=>{setKeyThemeUndo(old=>[...old,keyTheme].slice(-30));setKeyThemeRedo(old=>[...old,keyTheme].slice(-30));const prev=keyThemeUndo[keyThemeUndo.length-1];if(prev)setKeyTheme(prev as typeof keyTheme)}}>↶ Undo</button><button type="button" className="button button-ghost button-small" onClick={()=>{setKeyThemeRedo(old=>[...old,keyTheme].slice(-30));const next=keyThemeRedo[keyThemeRedo.length-1];if(next)setKeyTheme(next as typeof keyTheme)}}>↷ Redo</button><button type="button" className="button button-ghost button-small" onClick={()=>{const next={...keyTheme,accent:"#3b82f6",gradientStart:"#020617",gradientMiddle:"#172554",gradientEnd:"#172554",card:"#0f172a",cardBorder:"#334155",text:"#f8fafc",muted:"#94a3b8",button:"#3b82f6",buttonText:"#ffffff",progress:"#60a5fa",success:"#22c55e",warning:"#f59e0b",error:"#ef4444",gradientType:"Linear",direction:"↘",strength:100,backgroundStyle:"Aurora",backgroundImage:"",buttonStyle:"Glow",buttonRadius:14,cardRadius:22,layoutStyle:"Glass",pageTitle:"Verify a global access key.",pageSubtitle:"The connected API decides whether a key is active, expired, revoked, or out of uses.",verifyLabel:"Verify key",generatorTitle:"Generate a personal key",generatorSubtitle:"Generation uses the server-side waiting period and stores your recent keys locally on this device.",showGlow:true,showGrid:false,showBranding:true,headingSize:32,cardBlur:18};setKeyTheme(next);try{localStorage.setItem("void-key-flow-theme",JSON.stringify(next))}catch{}}}>Reset</button></div></div><div className="key-flow-layout"><div className="key-flow-controls"><label className="form-label">Search theme settings<input value={keyThemeSearch} onChange={e=>setKeyThemeSearch(e.target.value)} placeholder="Search theme settings…"/></label><div className="key-flow-category-list">{["Blocks","Colors","Background","Effects","Card","Content","Colors & Gradient"].filter(x=>x.toLowerCase().includes(keyThemeSearch.toLowerCase())).map(x=><button type="button" key={x} onClick={()=>document.getElementById("key-flow-section-"+(x==="Colors & Gradient"?"colors":x.toLowerCase()))?.scrollIntoView({behavior:"smooth",block:"start"})}>{x}<span>↘</span></button>)}</div><h4 id="key-flow-section-colors" className="key-flow-section-anchor">Colors &amp; Gradient</h4><p className="muted">Color scheme, accent, and gradient direction</p><label className="form-label">Color Scheme<select value={keyTheme.scheme} onChange={e=>setKeyTheme({...keyTheme,scheme:e.target.value})}>{["Ocean Blue","Royal Purple","Forest Green","Sunset Orange","Ruby Red","Cyber Cyan","Cherry Pink","Golden Amber","Aqua Teal","Rose Gold","Deep Indigo","Custom"].map(x=><option key={x}>{x}</option>)}</select></label><div className="key-theme-color-grid">{[["Accent Color","accent"],["Gradient start","gradientStart"],["Gradient middle","gradientMiddle"],["Gradient end","gradientEnd"],["Card","card"],["Card border","cardBorder"],["Text","text"],["Muted text","muted"],["Button","button"],["Button text","buttonText"],["Progress","progress"],["Success","success"],["Warning","warning"],["Error","error"]].map(([label,key])=><label className="form-label key-color-field" key={key}>{label}<span><input type="color" value={String(keyTheme[key]||"#000000")} onChange={e=>{const next={...keyTheme,[key]:e.target.value};setKeyTheme(next);try{localStorage.setItem("void-key-flow-theme",JSON.stringify(next))}catch{}}}/><code>{String(keyTheme[key]||"")}</code></span></label>)}</div><label className="form-label">Gradient type<select value={keyTheme.gradientType} onChange={e=>setKeyTheme({...keyTheme,gradientType:e.target.value})}><option>Linear</option><option>Radial</option><option>Spotlight</option></select></label><label className="form-label">Gradient direction<select value={keyTheme.direction} onChange={e=>setKeyTheme({...keyTheme,direction:e.target.value})}>{["↘","→","↓","↗","↑"].map(x=><option key={x}>{x}</option>)}</select></label><label className="form-label">Gradient strength · {keyTheme.strength}%<input type="range" min="0" max="100" value={keyTheme.strength} onChange={e=>setKeyTheme({...keyTheme,strength:Number(e.target.value)})}/></label>
<h4 id="key-flow-section-background" className="key-flow-section-anchor">Background &amp; effects</h4><label className="form-label">Background style<select value={keyTheme.backgroundStyle||"Aurora"} onChange={e=>setKeyTheme({...keyTheme,backgroundStyle:e.target.value})}>{["Gradient","Aurora","Spotlight","Radial","Solid","Grid","Glass","Image"].map(x=><option key={x}>{x}</option>)}</select></label>
{keyTheme.backgroundStyle==="Image"&&<label className="form-label">Background image URL<input value={keyTheme.backgroundImage||""} onChange={e=>setKeyTheme({...keyTheme,backgroundImage:e.target.value})} placeholder="https://example.com/background.jpg"/></label>}
<h4 id="key-flow-section-blocks" className="key-flow-section-anchor">Blocks &amp; layout</h4><div id="key-flow-section-card" className="key-flow-card-anchor"></div><div className="key-theme-option-grid"><label className="form-label">Button style<select value={keyTheme.buttonStyle||"Glow"} onChange={e=>setKeyTheme({...keyTheme,buttonStyle:e.target.value})}>{["Solid","Gradient","Glow","Glass","Outline","Pill","Minimal"].map(x=><option key={x}>{x}</option>)}</select></label><label className="form-label">Layout<select value={keyTheme.layoutStyle||"Glass"} onChange={e=>setKeyTheme({...keyTheme,layoutStyle:e.target.value})}>{["Glass","Solid card","Minimal","Bordered"].map(x=><option key={x}>{x}</option>)}</select></label><label className="form-label">Button radius · {keyTheme.buttonRadius??14}px<input type="range" min="0" max="36" value={keyTheme.buttonRadius??14} onChange={e=>setKeyTheme({...keyTheme,buttonRadius:Number(e.target.value)})}/></label><label className="form-label">Card radius · {keyTheme.cardRadius??22}px<input type="range" min="0" max="40" value={keyTheme.cardRadius??22} onChange={e=>setKeyTheme({...keyTheme,cardRadius:Number(e.target.value)})}/></label><label className="form-label">Heading size · {keyTheme.headingSize??32}px<input type="range" min="20" max="48" value={keyTheme.headingSize??32} onChange={e=>setKeyTheme({...keyTheme,headingSize:Number(e.target.value)})}/></label><label className="form-label">Card blur · {keyTheme.cardBlur??18}px<input type="range" min="0" max="30" value={keyTheme.cardBlur??18} onChange={e=>setKeyTheme({...keyTheme,cardBlur:Number(e.target.value)})}/></label></div>
<h4 id="key-flow-section-content" className="key-flow-section-anchor">Content &amp; labels</h4><label className="form-label">Page heading<input value={keyTheme.pageTitle||"Verify a global access key."} onChange={e=>setKeyTheme({...keyTheme,pageTitle:e.target.value})}/></label><label className="form-label">Page description<textarea value={keyTheme.pageSubtitle||""} onChange={e=>setKeyTheme({...keyTheme,pageSubtitle:e.target.value})}/></label><label className="form-label">Verify button text<input value={keyTheme.verifyLabel||"Verify key"} onChange={e=>setKeyTheme({...keyTheme,verifyLabel:e.target.value})}/></label><label className="form-label">Personal key card title<input value={keyTheme.generatorTitle||"Generate a personal key"} onChange={e=>setKeyTheme({...keyTheme,generatorTitle:e.target.value})}/></label><label className="form-label">Personal key card description<textarea value={keyTheme.generatorSubtitle||""} onChange={e=>setKeyTheme({...keyTheme,generatorSubtitle:e.target.value})}/></label>
<h4 id="key-flow-section-effects" className="key-flow-section-anchor">Effects</h4><div className="key-setting-toggle"><span><strong>Glow effects</strong><small>Add subtle accent glows to cards and buttons.</small></span><input type="checkbox" checked={keyTheme.showGlow!==false} onChange={e=>setKeyTheme({...keyTheme,showGlow:e.target.checked})}/></div><div className="key-setting-toggle"><span><strong>Background grid</strong><small>Overlay a low-contrast technical grid.</small></span><input type="checkbox" checked={!!keyTheme.showGrid} onChange={e=>setKeyTheme({...keyTheme,showGrid:e.target.checked})}/></div><div className="key-setting-toggle"><span><strong>Void branding</strong><small>Show the small brand kicker on the cards.</small></span><input type="checkbox" checked={keyTheme.showBranding!==false} onChange={e=>setKeyTheme({...keyTheme,showBranding:e.target.checked})}/></div>
<button type="button" className="button button-light" onClick={()=>{try{localStorage.setItem("void-key-flow-theme",JSON.stringify(keyTheme));localStorage.setItem("void-key-prefix",adminKeyPrefix)}catch{}setKeyThemeNotice("Theme settings saved. The homepage key flow will use this appearance on this device.");setTimeout(()=>setKeyThemeNotice(""),3500)}}>Save theme settings</button>{keyThemeNotice&&<p className="inline-notice">{keyThemeNotice}</p>}</div><div className="key-flow-preview-wrap"><span className="section-kicker">LIVE PREVIEW</span><div className="key-flow-preview" style={{background:keyTheme.backgroundStyle==="Solid"?keyTheme.gradientStart:keyTheme.backgroundStyle==="Image"&&keyTheme.backgroundImage?'linear-gradient(120deg,rgba(2,6,23,.72),rgba(2,6,23,.4)),url("'+keyTheme.backgroundImage.replace(/"/g,"")+'")':keyTheme.backgroundStyle==="Spotlight"||keyTheme.gradientType==="Spotlight"?`radial-gradient(ellipse at top left, ${keyTheme.gradientMiddle}, ${keyTheme.gradientStart} 72%)`:keyTheme.backgroundStyle==="Radial"||keyTheme.gradientType==="Radial"?`radial-gradient(circle at 30% 15%, ${keyTheme.gradientMiddle}, ${keyTheme.gradientStart} 80%)`:keyTheme.backgroundStyle==="Grid"?`linear-gradient(135deg, ${keyTheme.gradientStart}, ${keyTheme.gradientEnd})`:`linear-gradient(135deg, ${keyTheme.gradientStart}, ${keyTheme.gradientMiddle}, ${keyTheme.gradientEnd})`,borderColor:keyTheme.cardBorder,color:keyTheme.text,opacity:0.5+Number(keyTheme.strength)/200}}><div className="key-flow-preview-card" style={{background:keyTheme.card,borderColor:keyTheme.cardBorder}}><span className="section-kicker">VOID ACCESS</span><h3>Unlock your script.</h3><p style={{color:keyTheme.muted}}>Enter your key to verify access.</p><div className="key-flow-preview-input">VOID-XXXX-XXXX</div><button type="button" className={"key-preview-button key-preview-button-"+String(keyTheme.buttonStyle||"Glow").toLowerCase()} style={{background:keyTheme.buttonStyle==="Outline"?"transparent":keyTheme.buttonStyle==="Glass"?"rgba(255,255,255,.08)":keyTheme.buttonStyle==="Gradient"?"linear-gradient(110deg,"+keyTheme.button+","+keyTheme.accent+")":keyTheme.button,color:keyTheme.buttonStyle==="Outline"?keyTheme.button:keyTheme.buttonText,border:keyTheme.buttonStyle==="Outline"?"1px solid "+keyTheme.button:"1px solid transparent",borderRadius:(keyTheme.buttonStyle==="Pill"?999:keyTheme.buttonRadius??14)+"px",boxShadow:keyTheme.showGlow===false?"none":"0 0 24px "+keyTheme.button+"44"}}>{keyTheme.verifyLabel||"Verify key"}</button><div className="key-flow-preview-progress"><i style={{background:keyTheme.progress}}/></div><small style={{color:keyTheme.muted}}>Updates instantly · safe sample data</small></div></div><p className="muted">Theme applies to all your sessions. Public pages use saved theme settings on this device.</p></div></div></div>}
</section>
<form className="release-form" onSubmit={createKey}><div className="form-label"><span>KEY SCOPE</span><p className="muted">Global access · works with every published game/script. No game selection needed.</p></div><div className="two-fields"><label className="form-label">NUMBER OF KEYS<input type="number" min={1} max={100} step={1} required value={adminKeyCount} onChange={e=>setAdminKeyCount(Number(e.target.value))}/></label><label className="form-label">EXPIRY IN DAYS<input type="number" min={1} max={3650} value={adminKeyExpiryDays} onChange={e=>setAdminKeyExpiryDays(e.target.value)} placeholder="Blank = never expires"/></label></div><div className="two-fields"><label className="form-label">MAX USES PER KEY<input type="number" min={1} max={1000000} value={adminKeyMaxUses} onChange={e=>setAdminKeyMaxUses(e.target.value)} placeholder="Blank = unlimited"/></label><label className="form-label">KEY LABEL<input value={adminKeyLabel} maxLength={80} onChange={e=>setAdminKeyLabel(e.target.value)} placeholder="Key label"/></label></div><button className="button button-light" disabled={adminKeyBusy||!isAdmin}>{adminKeyBusy?"Generating keys…":"Generate "+Math.max(1,Math.min(100,adminKeyCount||1))+" key"+(adminKeyCount===1?"":"s")}</button></form>{generatedAdminKeys.length>0&&<div className="created-key admin-created-keys"><div className="panel-heading"><strong>New keys · copy them now</strong><button type="button" className="button button-ghost button-small" onClick={()=>void navigator.clipboard.writeText(generatedAdminKeys.map(k=>k.key).join("\n")).then(()=>setNotice("All generated keys copied."),()=>setNotice("Select and copy the keys manually."))}>Copy all</button></div>{generatedAdminKeys.map((k)=><div className="generated-key-row" key={k.key}><div><code>{k.key}</code><small>{k.script} · {k.expires_at?"Expires "+new Date(k.expires_at).toLocaleString():"No expiry"} · {k.label}</small></div><button type="button" className="button button-ghost button-small" onClick={()=>void navigator.clipboard.writeText(k.key)}>Copy</button></div>)}</div>}{notice&&<p className="inline-notice">{notice}</p>}</div><div className="panel admin-table-panel"><div className="panel-heading"><h2>Issued keys</h2><button className="button button-ghost button-small" onClick={()=>void loadKeys()}>Refresh</button></div>{keyRecords.length===0?<p className="muted">No keys loaded.</p>:<div className="admin-key-list">{keyRecords.map((row,index)=><div className="admin-key-row" key={String(row.id||row.key||index)}><div><code>{String(row.key||"—")}</code><small>{String(row.script||"Global")} · {row.expires_at?"Expires "+new Date(String(row.expires_at)).toLocaleString():"No expiry"} · {row.revoked_at?"REVOKED":"ACTIVE"}</small></div>{Boolean(row.id)&&<button className="button button-ghost button-small" onClick={()=>void revokeKey(String(row.id))}>Revoke</button>}</div>)}</div>}</div></>}
          {adminTab==="Key system"&&<div className="panel admin-table-panel key-sdk-panel"><div className="panel-heading"><div><span className="section-kicker">DEVELOPER INTEGRATION</span><h2>Lua SDK &amp; examples</h2><p className="muted">Copy each block separately. Enable HTTP Requests in your Roblox experience settings and keep validation on the server.</p></div></div><div className="key-sdk-card"><div className="key-sdk-card-head"><div><span className="section-kicker">01 · MODULESCRIPT</span><h3>Void Key SDK</h3><p className="muted">Reusable validator for server scripts.</p></div><button type="button" className="button button-ghost button-small" onClick={()=>void navigator.clipboard.writeText(keySystemLuaSdk).then(()=>setNotice("Lua SDK copied."),()=>setNotice("Clipboard unavailable. Copy the code manually."))}><Icon name="copy"/> Copy SDK</button></div><pre className="key-sdk-code"><code>{keySystemLuaSdk}</code></pre></div><div className="key-sdk-card"><div className="key-sdk-card-head"><div><span className="section-kicker">02 · SERVER SCRIPT</span><h3>Validation example</h3><p className="muted">Shows how to call the SDK from a server-side key flow.</p></div><button type="button" className="button button-ghost button-small" onClick={()=>void navigator.clipboard.writeText(keySystemLuaExample).then(()=>setNotice("Lua example copied."),()=>setNotice("Clipboard unavailable. Copy the code manually."))}><Icon name="copy"/> Copy example</button></div><pre className="key-sdk-code"><code>{keySystemLuaExample}</code></pre></div><p className="muted key-sdk-footnote">Security note: do not place secret service-role keys in Roblox. This SDK uses the public API key; verify that your deployed Edge Function permits this request and enforces key status, expiry, and usage limits server-side. Roblox HTTP requests must be enabled.</p>{notice&&<p className="inline-notice">{notice}</p>}</div>}
          {adminTab==="Media library"&&<section className="panel settings-panel"><div className="panel-heading"><div><span className="section-kicker">MEDIA</span><h2>Media library</h2><p className="muted">Upload images and videos to the connected public storage bucket.</p></div><button className="button button-ghost button-small" onClick={()=>void loadMedia()}>Refresh</button></div><label className="button button-light media-upload-label">Upload media<input type="file" accept="image/*,video/*" onChange={e=>void uploadMediaFile(e)} hidden/></label>{mediaBusy&&<p className="muted">Working…</p>}{mediaNotice&&<p className="inline-notice">{mediaNotice}</p>}<div className="media-grid">{mediaAssets.map(asset=><article className="media-card" key={asset.url}>{asset.contentType?.startsWith("video/")?<video src={asset.url} controls/>:<img src={asset.url} alt={asset.name}/>}<div><strong>{asset.name}</strong><small>{asset.size?Math.round(asset.size/1024)+" KB":"Size unavailable"}</small><button className="text-button" onClick={()=>void navigator.clipboard.writeText(asset.url).then(()=>setNotice("Media URL copied."),()=>setNotice("Copy the media URL manually."))}>Copy URL</button></div></article>)}</div>{mediaAssets.length===0&&!mediaBusy&&!mediaNotice&&<p className="muted">No media files loaded yet. Refresh the library or upload an image/video to start.</p>}</section>}
          {adminTab==="Users"&&<section className="panel admin-table-panel users-admin-panel"><div className="panel-heading"><div><span className="section-kicker">USER MANAGEMENT</span><h2>Choose a user to manage</h2><p className="muted">Select an account to edit its profile, email, role, verification, and access status.</p></div><div className="users-toolbar"><label className="search-box"><Icon name="search"/><input value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="Search email or username..."/></label><button className="button button-ghost button-small" onClick={()=>void loadAdminUsers()}>Refresh</button></div></div>{notice&&<p className="inline-notice">{notice}</p>}<div className="users-admin-layout"><div className="users-picker"><div className="users-picker-heading"><strong>Accounts</strong><span className="eyebrow-pill">{users.filter(target=>(target.email+" "+(target.profile?.username||"")+" "+(target.profile?.display_name||"")).toLowerCase().includes(userSearch.toLowerCase())).length}</span></div>{users.filter(target=>(target.email+" "+(target.profile?.username||"")+" "+(target.profile?.display_name||"")).toLowerCase().includes(userSearch.toLowerCase())).map(target=><button type="button" className={"user-picker-item"+(selectedAdminUserId===target.id?" user-picker-selected":"")} key={target.id} onClick={()=>selectAdminUser(target)}><span className="user-picker-avatar">{(target.profile?.display_name||target.profile?.username||target.email||"U").slice(0,1).toUpperCase()}</span><span className="user-picker-copy"><strong className="user-picker-name">{target.profile?.display_name||target.profile?.username||target.email||"Unknown user"}{(()=>{const role=target.roles.includes("admin")?"admin":target.roles.includes("moderator")?"moderator":target.profile?.role||"user";const badge=customBadges.find(item=>item.role===role);const verified=!badge&&Boolean(target.profile?.verified);return badge||verified?<span className="profile-role-badge" title={badge?.name||(verified?"Verified account":"Account badge")} aria-label={badge?.name||(verified?"Verified account":"Account badge")} style={{color:badge?.color||"#f5f5f5",borderColor:badge?.color||"#f5f5f5"}}><BadgeGlyph name={badge?.icon||"check"} size={14} strokeWidth={badge?.strokeWidth||1.7}/></span>:null;})()}</strong><small>{target.email}</small><small>{target.roles.join(", ")||"user"}{target.banned_until?" · Banned":""}</small></span><Icon name="arrow"/></button>)}{users.length===0&&<p className="muted users-empty">No accounts returned. Refresh this panel to query the administrator user list.</p>}</div><div className="users-editor">{(()=>{const target=users.find(item=>item.id===selectedAdminUserId);return target?<><div className="users-editor-title"><div><span className="section-kicker">SELECTED ACCOUNT</span><h3 className="users-editor-profile-name">{target.profile?.display_name||target.profile?.username||target.email}{(()=>{const role=target.roles.includes("admin")?"admin":target.roles.includes("moderator")?"moderator":target.profile?.role||"user";const badge=customBadges.find(item=>item.role===role);const verified=!badge&&Boolean(target.profile?.verified);return badge||verified?<span className="profile-role-badge" title={badge?.name||(verified?"Verified account":"Account badge")} aria-label={badge?.name||(verified?"Verified account":"Account badge")} style={{color:badge?.color||"#f5f5f5",borderColor:badge?.color||"#f5f5f5"}}><BadgeGlyph name={badge?.icon||"check"} size={14} strokeWidth={badge?.strokeWidth||1.7}/></span>:null;})()}{selectedUserBadgeIds.map(id=>{const assigned=dbBadges.find(item=>item.id===id);return assigned?<span key={id} className="profile-role-badge" title={assigned.name} aria-label={assigned.name} style={{color:assigned.color,borderColor:assigned.color}}><BadgeGlyph name={assigned.icon} size={14} strokeWidth={assigned.strokeWidth}/></span>:null;})}</h3><p className="muted">{target.id}</p></div><span className={"status-badge"+(target.banned_until?" muted":"")}>{target.banned_until?"Banned":"Active"}</span></div><div className="user-account-meta"><span><small>Joined</small><strong>{target.created_at?new Date(target.created_at).toLocaleDateString():"Unknown"}</strong></span><span><small>Last sign in</small><strong>{target.last_sign_in_at?new Date(target.last_sign_in_at).toLocaleString():"Never"}</strong></span><span><small>Email</small><strong>{target.email_confirmed_at?"Verified":"Unverified"}</strong></span></div><form className="release-form user-edit-form" onSubmit={saveAdminUser}><div className="form-grid-two"><label className="form-label">EMAIL<input type="email" required maxLength={254} value={adminEditEmail} onChange={e=>setAdminEditEmail(e.target.value)} /></label><label className="form-label">USERNAME<input maxLength={32} value={adminEditUsername} onChange={e=>setAdminEditUsername(e.target.value)} placeholder="username"/></label></div><label className="form-label">DISPLAY NAME<input maxLength={80} value={adminEditDisplayName} onChange={e=>setAdminEditDisplayName(e.target.value)} placeholder="Display name"/></label><label className="form-label">BIO<textarea rows={3} maxLength={1000} value={adminEditBio} onChange={e=>setAdminEditBio(e.target.value)} placeholder="User bio"/></label><label className="form-label">AVATAR IMAGE URL<input type="url" maxLength={1000} value={adminEditAvatar} onChange={e=>setAdminEditAvatar(e.target.value)} placeholder="https://…"/></label>{adminEditAvatar&&<div className="user-avatar-preview"><img src={adminEditAvatar} alt="User avatar preview" onError={e=>{e.currentTarget.style.display="none";}}/><span>Avatar preview</span></div>}<div className="form-grid-two"><label className="form-label">ACCOUNT ROLE<select value={adminEditRole} onChange={e=>setAdminEditRole(e.target.value)}><option value="user">User</option><option value="moderator">Moderator</option><option value="admin">Admin</option></select></label><label className="form-label">ACCOUNT STATUS<select value={adminEditBanned?"banned":"active"} onChange={e=>setAdminEditBanned(e.target.value==="banned")}><option value="active">Active</option><option value="banned">Banned</option></select></label></div><label className="setting-row"><span><strong>Verified account</strong><small>Show this account as verified where supported.</small></span><input type="checkbox" checked={adminEditVerified} onChange={e=>setAdminEditVerified(e.target.checked)}/></label><div className="button-row"><button className="button button-light" type="submit" disabled={adminEditBusy}>{adminEditBusy?"Saving…":"Save all user changes"} <Icon name="check"/></button><button className="button button-ghost" type="button" onClick={()=>selectAdminUser(target)}>Reset changes</button></div>{adminEditNotice&&<p className="inline-notice">{adminEditNotice}</p>}<p className="muted user-edit-note">Email changes are applied through Supabase Auth. Admin access changes are checked server-side; you cannot change your own administrator role or ban yourself from this panel.</p></form><section className="assigned-badges-panel"><div><span className="section-kicker">PROFILE BADGES</span><h3>Assign badges to this user</h3><p className="muted">These icon-only badges are attached to this individual account.</p></div><div className="assigned-badges-options">{dbBadges.map(badge=><label className="assigned-badge-option" key={badge.id}><input type="checkbox" checked={selectedUserBadgeIds.includes(badge.id)} onChange={e=>setSelectedUserBadgeIds(old=>e.target.checked?[...old,badge.id]:old.filter(id=>id!==badge.id))}/><span className="profile-role-badge" style={{color:badge.color,borderColor:badge.color}}><BadgeGlyph name={badge.icon} size={14} strokeWidth={badge.strokeWidth}/></span><span>{badge.name}<small>{badge.role}</small></span></label>)}</div><div className="button-row"><button className="button button-light button-small" type="button" onClick={()=>void saveAssignedBadges()} disabled={userBadgeBusy}>{userBadgeBusy?"Saving…":"Save user badges"}</button><button className="button button-ghost button-small" type="button" onClick={()=>void loadAssignedBadges(selectedAdminUserId)}>Refresh</button></div>{userBadgeNotice&&<p className="inline-notice">{userBadgeNotice}</p>}</section></>:<div className="users-no-selection"><span className="users-no-selection-icon"><Icon name="users"/></span><h3>Select an account</h3><p className="muted">Choose a user from the list to edit their details and permissions.</p></div>})()}</div></div></section>}
          {adminTab==="Analytics"&&<section className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">ANALYTICS</span><h2>Traffic overview</h2></div><button className="button button-ghost button-small" onClick={()=>void loadAnalytics()}>Refresh</button></div>{analyticsError&&<p className="inline-notice">{analyticsError}</p>}{analytics?<div className="analytics-grid"><div className="stat-card"><span className="section-kicker">USERS</span><strong>{analytics.totalUsers}</strong><small>Window: {analytics.periodDays} days</small></div><div className="stat-card"><span className="section-kicker">EVENTS</span><strong>{analytics.events}</strong><small>Recorded events</small></div><div className="stat-card"><span className="section-kicker">VISITORS</span><strong>{analytics.uniqueVisitors}</strong><small>Unique sessions</small></div><div className="stat-card"><span className="section-kicker">TODAY</span><strong>{analytics.todayViews}</strong><small>{analytics.todayVisitors} visitors</small></div></div>:<p className="muted">Load analytics to view consented traffic.</p>}</section>}
          {adminTab==="Roles & badges"&&<section className="panel settings-panel"><span className="section-kicker">ROLE & BADGE STUDIO</span><h2>Custom badges and feature sets</h2><p className="muted">Choose from 200 icon glyphs, set a color, and select capabilities for each role. Badges and grants save to Supabase; an individual feature is enforced only where the corresponding API/page checks that grant.</p><form className="release-form" onSubmit={saveRoleBadge}><label className="form-label">BADGE NAME<input value={badgeName} onChange={e=>setBadgeName(e.target.value)} maxLength={50} required/></label><div className="two-fields"><label className="form-label">ROLE<select value={badgeRole} onChange={e=>setBadgeRole(e.target.value)}><option value="user">User</option><option value="moderator">Moderator</option><option value="admin">Admin</option></select></label><label className="form-label">BADGE COLOR<input type="color" value={badgeColor} onChange={e=>setBadgeColor(e.target.value)}/></label></div><label className="form-label">OUTLINED ICON<select className="badge-icon-select" value={badgeIcon} onChange={e=>setBadgeIcon(e.target.value)}>{badgeIconChoices.map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label><label className="form-label">ICON STROKE WIDTH · {badgeStrokeWidth.toFixed(1)}<input type="range" min="0.8" max="3.5" step="0.1" value={badgeStrokeWidth} onChange={e=>setBadgeStrokeWidth(Number(e.target.value))}/></label><div className="badge-preview" style={{borderColor:badgeColor,color:badgeColor}}><span><BadgeGlyph name={badgeIcon} size={24} strokeWidth={badgeStrokeWidth}/></span><strong>{badgeName||"Custom badge"}</strong><small>{badgeRole.toUpperCase()}</small></div><span className="section-kicker">FEATURE SET</span><div className="badge-feature-grid">{featureChoices.map(([id,label])=><label className="setting-row" key={id}><span><strong>{label}</strong><small>{id.replace(/_/g," ")}</small></span><input type="checkbox" checked={badgeFeatures.includes(id)} onChange={e=>setBadgeFeatures(old=>e.target.checked?[...old,id]:old.filter(x=>x!==id))}/></label>)}</div><button className="button button-light" type="submit">Save badge & feature set</button></form><div className="custom-badge-list"><div className="panel-heading"><h2>Saved badge definitions</h2><span className="eyebrow-pill">{customBadges.length} SAVED</span></div>{customBadges.map((item,i)=><article className="custom-badge-row" key={item.role+item.name+i}><span className="custom-badge-icon" style={{color:item.color,borderColor:item.color}}><BadgeGlyph name={item.icon} size={22} strokeWidth={item.strokeWidth||1.7}/></span><div><strong>{item.name}</strong><small>{item.role} · {item.features.length} selected features</small></div><button className="button button-ghost button-small" onClick={()=>{setBadgeName(item.name);setBadgeRole(item.role);setBadgeIcon(item.icon);setBadgeColor(item.color);setBadgeFeatures(item.features);}}>Edit</button><button className="button button-ghost button-small" onClick={()=>{const next=customBadges.filter((_,idx)=>idx!==i);setCustomBadges(next);try{localStorage.setItem("void-role-badges",JSON.stringify(next));}catch{}}}>Delete</button></article>)}{customBadges.length===0&&<p className="muted">No custom badge definitions yet. Create one above.</p>}</div></section>}{adminTab==="Roadmap"&&<section className="panel settings-panel roadmap-admin-panel"><div className="panel-heading"><div><span className="section-kicker">ROADMAP CONTROL</span><h2>Edit the entire roadmap</h2></div><button className="button button-ghost button-small" onClick={()=>void refreshRoadmap()}>Refresh</button></div><p className="muted">Edit titles, game labels, notes, progress, status, visibility, and order. Public items appear on the roadmap page; hidden items stay in the admin editor.</p>{roadmapNotice&&<p className="form-message">{roadmapNotice}</p>}<form className="release-form roadmap-create-form" onSubmit={async e=>{e.preventDefault();setRoadmapBusy(true);setRoadmapNotice("");try{const {data,error}=await supabase.from("void_roadmap_items").insert({title:roadmapDraft.title.trim(),game_name:roadmapDraft.game_name.trim()||"All games",notes:roadmapDraft.notes.trim(),progress:Math.max(0,Math.min(100,Number(roadmapDraft.progress)||0)),status:roadmapDraft.status,is_public:roadmapDraft.is_public,sort_order:Number(roadmapDraft.sort_order)||0}).select("id,title,game_name,notes,progress,status,is_public,sort_order").single();if(error)throw error;setRoadmap(items=>[...items,data as typeof items[number]].sort((a,b)=>a.sort_order-b.sort_order));setRoadmapDraft({title:"",game_name:"All games",notes:"",progress:0,status:"planned",is_public:true,sort_order:roadmap.length*10+10});setRoadmapNotice("Milestone added.");}catch(error){setRoadmapNotice("Could not add milestone: "+messageOf(error));}finally{setRoadmapBusy(false);}}}><h3>Add a milestone</h3><label className="form-label">TITLE<input required value={roadmapDraft.title} onChange={e=>setRoadmapDraft(v=>({...v,title:e.target.value}))} placeholder="Milestone title"/></label><div className="form-grid-two"><label className="form-label">GAME / AREA<input value={roadmapDraft.game_name} onChange={e=>setRoadmapDraft(v=>({...v,game_name:e.target.value}))} placeholder="All games"/></label><label className="form-label">SORT ORDER<input type="number" value={roadmapDraft.sort_order} onChange={e=>setRoadmapDraft(v=>({...v,sort_order:Number(e.target.value)}))}/></label></div><label className="form-label">NOTES<textarea rows={3} value={roadmapDraft.notes} onChange={e=>setRoadmapDraft(v=>({...v,notes:e.target.value}))} placeholder="What is planned for this milestone?"/></label><div className="form-grid-two"><label className="form-label">PROGRESS · {roadmapDraft.progress}%<input type="range" min="0" max="100" value={roadmapDraft.progress} onChange={e=>setRoadmapDraft(v=>({...v,progress:Number(e.target.value)}))}/></label><label className="form-label">STATUS<select value={roadmapDraft.status} onChange={e=>setRoadmapDraft(v=>({...v,status:e.target.value}))}><option value="planned">Planned</option><option value="working">In progress</option></select></label></div><label className="setting-row"><span>Show on public roadmap</span><input type="checkbox" checked={roadmapDraft.is_public} onChange={e=>setRoadmapDraft(v=>({...v,is_public:e.target.checked}))}/></label><button className="button button-light" disabled={roadmapBusy}>{roadmapBusy?"Adding…":"Add milestone"}</button></form><div className="roadmap-admin-list">{roadmap.map(item=><article className="roadmap-admin-item" key={item.id}><div className="panel-heading"><div><span className="section-kicker">MILESTONE · ORDER {item.sort_order}</span><h3>{item.title}</h3></div><span className={"status-badge"+(item.is_public?"":" muted")}>{item.is_public?"Public":"Hidden"}</span></div><form className="release-form" onSubmit={async e=>{e.preventDefault();setRoadmapBusy(true);setRoadmapNotice("");try{const patch={title:item.title.trim(),game_name:item.game_name.trim()||"All games",notes:item.notes.trim(),progress:Math.max(0,Math.min(100,Number(item.progress)||0)),status:item.status,is_public:item.is_public,sort_order:Number(item.sort_order)||0};const {error}=await supabase.from("void_roadmap_items").update(patch).eq("id",item.id);if(error)throw error;setRoadmapNotice("Saved “"+patch.title+"”.");void refreshRoadmap();}catch(error){setRoadmapNotice("Could not save milestone: "+messageOf(error));}finally{setRoadmapBusy(false);}}}><label className="form-label">TITLE<input required value={item.title} onChange={e=>setRoadmap(rows=>rows.map(row=>row.id===item.id?{...row,title:e.target.value}:row))}/></label><div className="form-grid-two"><label className="form-label">GAME / AREA<input value={item.game_name} onChange={e=>setRoadmap(rows=>rows.map(row=>row.id===item.id?{...row,game_name:e.target.value}:row))}/></label><label className="form-label">SORT ORDER<input type="number" value={item.sort_order} onChange={e=>setRoadmap(rows=>rows.map(row=>row.id===item.id?{...row,sort_order:Number(e.target.value)}:row))}/></label></div><label className="form-label">NOTES<textarea rows={3} value={item.notes} onChange={e=>setRoadmap(rows=>rows.map(row=>row.id===item.id?{...row,notes:e.target.value}:row))}/></label><div className="form-grid-two"><label className="form-label">PROGRESS · {item.progress}%<input type="range" min="0" max="100" value={item.progress} onChange={e=>setRoadmap(rows=>rows.map(row=>row.id===item.id?{...row,progress:Number(e.target.value)}:row))}/></label><label className="form-label">STATUS<select value={item.status} onChange={e=>setRoadmap(rows=>rows.map(row=>row.id===item.id?{...row,status:e.target.value}:row))}><option value="planned">Planned</option><option value="working">In progress</option></select></label></div><label className="setting-row"><span>Show on public roadmap</span><input type="checkbox" checked={item.is_public} onChange={e=>setRoadmap(rows=>rows.map(row=>row.id===item.id?{...row,is_public:e.target.checked}:row))}/></label><div className="button-row"><button className="button button-light button-small" disabled={roadmapBusy}>Save changes</button><button type="button" className="button button-ghost button-small" disabled={roadmapBusy} onClick={async()=>{if(!window.confirm("Delete this roadmap milestone permanently?"))return;setRoadmapBusy(true);setRoadmapNotice("");try{const {error}=await supabase.from("void_roadmap_items").delete().eq("id",item.id);if(error)throw error;setRoadmap(rows=>rows.filter(row=>row.id!==item.id));setRoadmapNotice("Milestone deleted.");}catch(error){setRoadmapNotice("Could not delete milestone: "+messageOf(error));}finally{setRoadmapBusy(false);}}}>Delete</button></div></form></article>)}{roadmap.length===0&&<p className="muted">No milestones yet. Add one above.</p>}</div></section>}
          {adminTab==="Audit logs"&&<section className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">AUDIT</span><h2>Recent admin activity</h2></div><button className="button button-ghost button-small" onClick={()=>void loadAudit()}>Refresh</button></div>{auditRows.length===0?<p className="muted">No audit events returned yet. Refresh this panel or perform an admin action to create activity.</p>:<div className="audit-list">{auditRows.map((row,index)=><div className="audit-row" key={String(row.id||index)}><div><strong>{String(row.action||"Action")}</strong><small>{String(row.target_type||"")} · {String(row.target_id||"")}</small></div><span>{row.created_at?new Date(String(row.created_at)).toLocaleString():""}</span></div>)}</div>}</section>}
        </div></section>}

        {active==="Roadmap"&&<section className="panel roadmap-page"><span className="section-kicker">ROADMAP</span><h2>What we’re building</h2><p className="muted">Public milestones pulled from the connected Void Development roadmap.</p><div className="roadmap-page-list">{roadmap.map(item=><article className="roadmap-item" key={item.id}><div className="roadmap-label"><strong>{item.title}</strong><span>{item.progress}%</span></div><div className="progress-track"><div style={{width:item.progress+"%"}}/></div><p>{item.game_name} · {item.status}</p><small>{item.notes}</small></article>)}{roadmap.length===0&&<p className="muted">No public roadmap items are available yet.</p>}</div></section>}
        {active==="Notifications"&&<section className="panel"><span className="section-kicker">NOTIFICATIONS</span><h2>Workspace updates</h2><div className="notice-row"><span className="notice-icon"><Icon name="check"/></span><div><strong>Authentication is connected</strong><p>Sign-in and registration are handled by Supabase Auth.</p></div></div><div className="notice-row"><span className="notice-icon"><Icon name="shield"/></span><div><strong>Protected releases stay unpublished</strong><p>Protected drafts are excluded from the public script library.</p></div></div></section>}
        
        {active==="Activity log"&&<section className="panel"><span className="section-kicker">ACCOUNT ACTIVITY</span><h2>Recent activity</h2><div className="security-list"><p>Script library loaded<b>{scripts.length} entries</b></p><p>Authentication<b>{user?"Signed in":"Guest"}</b></p><p>API health<b>{endpointStatus}</b></p><p>Cookie analytics consent<b>{cookiePrefs?.analytics?"Enabled":"Not enabled"}</b></p></div><p className="muted">Administrative actions are recorded in the protected audit log.</p></section>}
        {active==="Community"&&<section className="panel"><span className="section-kicker">CREATOR SPACE</span><h2>Community resources</h2><p className="muted">Share releases, add YouTube showcases, and keep update notes clear for users.</p><div className="quick-action-list">{[["Browse releases","Scripts"],["Release roadmap","Roadmap"],["Read changelog","Changelog"],["Join Discord","Discord"]].map(([label,page])=><button className="quick-action" key={label} onClick={()=>{if(page==="Discord"){window.location.assign("https://discord.gg/A2teePgta2");return;}setPage(page);}}><span><strong>{label}</strong></span><Icon name="arrow"/></button>)}</div></section>}
        {active==="Changelog"&&<section className="panel"><span className="section-kicker">CHANGELOG</span><h2>Void Development updates</h2><div className="notice-row"><span className="notice-icon"><Icon name="check"/></span><div><strong>Connected auth and release data</strong><p>Login, registration, profile editing, published scripts, and admin-only release management use Supabase.</p><small>Current release</small></div></div><div className="notice-row"><span className="notice-icon"><Icon name="palette"/></span><div><strong>35 dark themes</strong><p>More accent palettes and custom accent color selection.</p><small>Current release</small></div></div><div className="notice-row"><span className="notice-icon"><Icon name="shield"/></span><div><strong>Key verification and script loader</strong><p>Existing key API remains the source of truth for validation.</p><small>Current release</small></div></div></section>}
        {active==="Help center"&&<section className="panel"><span className="section-kicker">HELP CENTER</span><h2>Quick help</h2>{[["How do I add a script?","Sign in with an account that has the admin role, open Admin panel → Add scripts, add the Lua source and release details, then choose Published or Draft."],["How does protection work?","Public cards do not expose the source field. A generated loader calls this site's /api/scripts/load proxy, which forwards the key to your Supabase script API."],["Why can't I see admin tools?","Admin controls require an authenticated user with the admin role in public.user_roles. A profile label alone does not grant access."],["Why does analytics need consent?","Site analytics events are recorded only after you opt into analytics cookies. Essential authentication remains separate."]].map(([q,a])=><details className="help-item" key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>}

        {active==="Profile"&&<section className="panel settings-panel"><span className="section-kicker">PROFILE</span><h2>Your profile</h2><p className="muted">Update the public details stored for your account.</p>{user?<form className="release-form" onSubmit={saveProfile}><label className="form-label">DISPLAY NAME<input value={profileName} onChange={e=>setProfileName(e.target.value)} placeholder="Your name"/></label><label className="form-label">BIO<textarea value={profileBio} onChange={e=>setProfileBio(e.target.value)} maxLength={280} rows={5} placeholder="Tell people what you build…"/></label><label className="form-label">AVATAR URL<input value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} placeholder="https://…"/></label><button className="button button-light" type="submit">Save profile <Icon name="check"/></button>{notice&&<p className="inline-notice">{notice}</p>}</form>:<p className="muted">Sign in to edit your profile.</p>}</section>}
        {active==="Sessions"&&<section className="panel settings-panel"><span className="section-kicker">ACCOUNT SECURITY</span><h2>Sessions & password</h2><p className="muted">Supabase Auth controls your active session. You can sign out locally or from all sessions supported by the provider.</p>{user?<><div className="security-list"><p>Signed in as<b>{userEmail}</b></p><p>Admin role<b>{isAdmin?"Active":"Standard member"}</b></p></div><form className="release-form" onSubmit={changePassword}><label className="form-label">NEW PASSWORD<input type="password" minLength={8} value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="At least 8 characters"/></label><button className="button button-light" type="submit">Update password</button></form><div className="button-row"><button className="button button-ghost" onClick={()=>void signOut()}>Sign out</button><button className="button button-ghost" onClick={()=>void signOut(true)}>Sign out everywhere</button></div>{sessionNotice&&<p className="inline-notice">{sessionNotice}</p>}</>:<p className="muted">No authenticated session is active.</p>}</section>}
        {active==="Settings"&&<section className="panel settings-panel"><span className="section-kicker">WORKSPACE SETTINGS</span><h2>Preferences</h2><div className="setting-row"><span><strong>Reduced motion</strong><small>Minimize interface animations.</small></span><input type="checkbox" checked={reducedMotion} onChange={e=>{setReducedMotion(e.target.checked);try{localStorage.setItem("void-motion",String(e.target.checked));}catch{}}}/></div><div className="setting-row"><span><strong>Spotlight effects</strong><small>Keep the ambient workspace glow enabled.</small></span><input type="checkbox" checked={spotlight} onChange={e=>{setSpotlight(e.target.checked);try{localStorage.setItem("void-spotlight",String(e.target.checked));}catch{}}}/></div><div className="setting-row"><span><strong>Notifications</strong><small>Show workspace notification indicators.</small></span><input type="checkbox" checked={notifications} onChange={e=>setNotifications(e.target.checked)}/></div><div className="setting-row"><span><strong>Layout</strong><small>Choose how much space cards and panels use.</small></span><select value={layout} onChange={e=>{setLayout(e.target.value);try{localStorage.setItem("void-layout",e.target.value);}catch{}}}><option>Comfortable</option><option>Compact</option></select></div><button className="button button-light" onClick={()=>setCookieCustomize(true)}>Privacy choices</button></section>}
        {active==="Key system"&&<section className={"key-layout key-flow-"+String(keyTheme.layoutStyle||"Glass").toLowerCase().replace(/\\s+/g,"-")} style={{"--flow-accent":keyTheme.accent,"--flow-card":keyTheme.card,"--flow-border":keyTheme.cardBorder,"--flow-text":keyTheme.text,"--flow-muted":keyTheme.muted,"--flow-button":keyTheme.button,"--flow-button-text":keyTheme.buttonText,"--flow-start":keyTheme.gradientStart,"--flow-mid":keyTheme.gradientMiddle,"--flow-end":keyTheme.gradientEnd,"--flow-progress":keyTheme.progress,"--flow-radius":(keyTheme.cardRadius??22)+"px","--flow-button-radius":(keyTheme.buttonRadius??14)+"px","--flow-blur":(keyTheme.cardBlur??18)+"px","--flow-heading-size":(keyTheme.headingSize??32)+"px","--flow-glow":keyTheme.showGlow===false?"0":"1","--flow-grid":keyTheme.showGrid?"1":"0",background:keyTheme.backgroundStyle==="Solid"?keyTheme.gradientStart:keyTheme.backgroundStyle==="Image"&&keyTheme.backgroundImage?'linear-gradient(120deg,rgba(2,6,23,.76),rgba(2,6,23,.58)),url("'+keyTheme.backgroundImage.replace(/"/g,"")+'")':keyTheme.backgroundStyle==="Spotlight"? "radial-gradient(ellipse at top left,"+keyTheme.gradientMiddle+","+keyTheme.gradientStart+" 75%)":keyTheme.backgroundStyle==="Radial"? "radial-gradient(circle at 30% 15%,"+keyTheme.gradientMiddle+","+keyTheme.gradientStart+" 80%)":keyTheme.backgroundStyle==="Grid"? "linear-gradient(135deg,"+keyTheme.gradientStart+","+keyTheme.gradientEnd+")": "linear-gradient(135deg,"+keyTheme.gradientStart+","+keyTheme.gradientMiddle+","+keyTheme.gradientEnd+")",backgroundSize:keyTheme.backgroundStyle==="Image"?"cover":"auto",backgroundPosition:"center",backgroundRepeat:"no-repeat",padding:"clamp(12px,2.5vw,24px)",borderRadius:(keyTheme.cardRadius??22)+"px"} as CSSProperties}><div className={"panel key-hero key-button-"+String(keyTheme.buttonStyle||"Glow").toLowerCase()} style={{background:keyTheme.backgroundStyle==="Solid"?keyTheme.gradientStart:keyTheme.backgroundStyle==="Image"&&keyTheme.backgroundImage?'linear-gradient(120deg,rgba(2,6,23,.78),rgba(2,6,23,.45)),url("'+keyTheme.backgroundImage.replace(/"/g,"")+'")':keyTheme.backgroundStyle==="Spotlight"?"radial-gradient(ellipse at top left,"+keyTheme.gradientMiddle+","+keyTheme.gradientStart+" 75%)":keyTheme.backgroundStyle==="Radial"?"radial-gradient(circle at 30% 15%,"+keyTheme.gradientMiddle+","+keyTheme.gradientStart+" 80%)":keyTheme.backgroundStyle==="Grid"?"linear-gradient(135deg,"+keyTheme.gradientStart+","+keyTheme.gradientEnd+")": "linear-gradient(135deg,"+keyTheme.gradientStart+","+keyTheme.gradientMiddle+","+keyTheme.gradientEnd+")",backgroundSize:keyTheme.backgroundStyle==="Image"?"cover":"auto",backgroundPosition:"center",backdropFilter:"blur("+(keyTheme.cardBlur??18)+"px)",borderRadius:(keyTheme.cardRadius??22)+"px",boxShadow:keyTheme.showGlow===false?"none":"0 18px 60px "+keyTheme.accent+"22"}}>{keyTheme.showBranding!==false&&<span className="section-kicker">KEY SYSTEM</span>}<h2 style={{fontSize:(keyTheme.headingSize??32)+"px"}}>{keyTheme.pageTitle||"Verify a global access key."}</h2><p className="muted">{keyTheme.pageSubtitle||"The connected API decides whether a key is active, expired, revoked, or out of uses."}</p><form onSubmit={validateKey} className="key-form"><label className="form-label">ACCESS KEY<input value={keyValue} onChange={e=>setKeyValue(e.target.value)} placeholder={(adminKeyPrefix||"VOID")+"-XX-XXX-XXXX"}/></label><button className="button button-light" type="submit" style={{borderRadius:(keyTheme.buttonStyle==="Pill"?999:(keyTheme.buttonRadius??14))+"px",background:keyTheme.buttonStyle==="Outline"?"transparent":keyTheme.buttonStyle==="Glass"?"rgba(255,255,255,.08)":keyTheme.buttonStyle==="Gradient"?"linear-gradient(110deg,"+keyTheme.button+","+keyTheme.accent+")":keyTheme.button,color:keyTheme.buttonStyle==="Outline"?keyTheme.button:keyTheme.buttonText,border:keyTheme.buttonStyle==="Outline"?"1px solid "+keyTheme.button:"1px solid transparent",boxShadow:keyTheme.showGlow===false?"none":"0 0 24px "+keyTheme.button+"44"}}>{keyTheme.verifyLabel||"Verify key"} <Icon name="check"/></button></form>{keyResult&&<div className="key-result">{keyResult}</div>}</div><div className={"panel key-generator key-button-"+String(keyTheme.buttonStyle||"Glow").toLowerCase()} style={{background:keyTheme.backgroundStyle==="Solid"?keyTheme.gradientStart:"linear-gradient(135deg,"+keyTheme.gradientStart+","+keyTheme.gradientMiddle+")",borderRadius:(keyTheme.cardRadius??22)+"px",backdropFilter:"blur("+(keyTheme.cardBlur??18)+"px)",boxShadow:keyTheme.showGlow===false?"none":"0 18px 60px "+keyTheme.accent+"18"}}>{keyTheme.showBranding!==false&&<span className="section-kicker">PERSONAL KEY</span>}<h2 style={{fontSize:(keyTheme.headingSize??32)+"px"}}>{keyTheme.generatorTitle||"Generate a personal key"}</h2><p className="muted">{keyTheme.generatorSubtitle||"Generation uses the server-side waiting period and stores your recent keys locally on this device."}</p><form onSubmit={startKeyGeneration}><button className="button button-light" style={{borderRadius:(keyTheme.buttonRadius??14)+"px",background:keyTheme.buttonStyle==="Outline"?"transparent":keyTheme.buttonStyle==="Glass"?"rgba(255,255,255,.08)":keyTheme.buttonStyle==="Gradient"?"linear-gradient(110deg,"+keyTheme.button+","+keyTheme.accent+")":keyTheme.button,color:keyTheme.buttonStyle==="Outline"?keyTheme.button:keyTheme.buttonText,border:keyTheme.buttonStyle==="Outline"?"1px solid "+keyTheme.button:"1px solid transparent",boxShadow:keyTheme.showGlow===false?"none":"0 0 24px "+keyTheme.button+"44"}} disabled={keyGenerating||!scripts.some(s=>s.status==="published")}>{keyGenerating?"Generating…":"Generate key"}</button></form>{keyCountdown>0&&<div className="key-countdown"><strong>{keyCountdown}s</strong><small>Waiting for the server window…</small></div>}{generatedKey&&<div className="created-key"><code>{generatedKey}</code><button className="button button-ghost" onClick={()=>void navigator.clipboard.writeText(generatedKey).then(()=>setNotice("Key copied."),()=>setNotice("Copy the key manually."))}>Copy</button></div>}{keyGenerationError&&<p className="inline-notice">{keyGenerationError}</p>}</div></section>}
        {active==="Key history"&&<section className="panel"><span className="section-kicker">KEY HISTORY</span><h2>Your recent generated keys</h2>{personalKeys.length===0?<p className="muted">No locally stored keys yet.</p>:<div className="history-list">{personalKeys.map(item=><div className="history-row" key={item.key}><div><code>{item.key}</code><small>{item.script} · Created {new Date(item.created_at).toLocaleString()}</small></div><span>{new Date(item.expires_at).toLocaleString()}</span></div>)}</div>}</section>}

        {isAuthPage&&<section className="auth-wrap"><div className="auth-aside"><img src={logo} alt="Void Development"/><span className="section-kicker">WELCOME TO VOID DEVELOPMENT</span><h2>Your workspace.<br/><span className="gradient-title">Your next move.</span></h2><p>Sign in to save your profile, manage your releases, and access the tools allowed for your account.</p><div className="auth-trust"><Icon name="shield"/> Real Supabase authentication · protected roles</div></div><form className={"panel auth-card"+(otpPending?" auth-card-otp":"")} onSubmit={handleAuth}><span className="section-kicker">{otpPending?"SECOND STEP · EMAIL VERIFICATION":authMode==="login"?"WELCOME BACK":"CREATE YOUR ACCOUNT"}</span><div className="auth-emblem"><Icon name={otpPending?"mail-check":"shield"}/></div><h2>{otpPending?"Check your inbox":authMode==="login"?"Sign in":"Create account"}</h2><p className="muted">{otpPending?"Enter the 6-digit security code sent to "+email.trim()+".":authMode==="login"?"Continue to your Void Development workspace.":"Create your own account to save preferences and scripts."}</p>{otpPending?<><div className="otp-security-note"><span className="otp-mail-icon">✉</span><span><strong>Verification code sent</strong><small>Check your inbox and spam folder.</small></span><span className="otp-live-dot"/></div><label className="form-label otp-label">EMAIL VERIFICATION CODE<div className="otp-code-control" onClick={e=>{const input=e.currentTarget.querySelector("input");input?.focus();}}><div className="otp-digit-row" aria-hidden="true">{Array.from({length:6},(_,index)=><span className={"otp-digit"+(otpCode[index]?" otp-digit-filled":"")} key={index}>{otpCode[index]||<span className="otp-digit-placeholder">·</span>}</span>)}</div><input className="otp-code-input" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={otpCode} required onChange={e=>setOtpCode(e.target.value.replace(/[^0-9]/g,"").slice(0,6))} aria-label="6-digit email verification code"/></div><small className="otp-field-hint">Enter the 6 numbers from your email. This is a verification code, not your password.</small></label><button className="button button-light auth-submit" type="submit" disabled={authBusy||otpCode.length!==6}>{authBusy?"Verifying code…":"Verify & sign in"} <Icon name="arrow"/></button><div className="otp-resend-row"><span>{otpCooldown>0?("Resend available in 00:"+String(otpCooldown).padStart(2,"0")):"Didn't get the email?"}</span><button type="button" className="otp-resend-button" disabled={authBusy||otpResending||otpCooldown>0} onClick={()=>void resendLoginCode()}>{otpResending?"Sending…":otpCooldown>0?"Resend code":"Resend code ↗"}</button></div><button type="button" className="otp-back-button" onClick={()=>{setOtpPending(false);setOtpType("email");setOtpCode("");setOtpCooldown(0);setPassword("");setAuthMessage("");}}>← Back to password</button></>:<>{authMode==="signup"&&<label className="form-label">DISPLAY NAME<input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Your name"/></label>}<label className="form-label">EMAIL ADDRESS<input type="email" autoComplete="email" value={email} required onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label className="form-label">PASSWORD<div className="password-input"><input type={showPassword?"text":"password"} autoComplete={authMode==="login"?"current-password":"new-password"} minLength={8} value={password} required onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters"/><button type="button" onClick={()=>setShowPassword(v=>!v)}>{showPassword?"Hide":"Show"}</button></div></label><button className="button button-light auth-submit" type="submit" disabled={authBusy}>{authBusy?"Please wait…":authMode==="login"?"Continue securely":"Create account"} <Icon name="arrow"/></button><button className="button button-ghost auth-submit" type="button" disabled={authBusy} onClick={()=>void signInGoogle()}>Continue with Google</button></>}{authMessage&&<p className="inline-notice">{authMessage}</p>}{!otpPending&&<p className="auth-switch">{authMode==="login"?"New to Void Development?":"Already have an account?"} <button type="button" onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setAuthMessage("");setOtpPending(false);setOtpType("email");}}>{authMode==="login"?"Create an account":"Sign in"}</button></p>}<p className="auth-disclaimer">Your credentials are handled by Supabase Auth. Never share your password or verification code.</p></form></section>}

        {notice&&<div className="panel inline-notice">{notice}</div>}

      {!isDedicatedProtector&&<footer className="footer"><div className="footer-brand"><img src={logo} alt=""/><span>Void Development<span className="brand-dot">.</span></span></div><span>BUILT FOR THE NEXT MOVE.</span><button onClick={()=>setPage("Settings")}>Workspace settings ↗</button><button onClick={()=>{setCookieCustomize(true);setCookieNotice("");}}>Cookies</button></footer>}
      </main>


      {selectedScript&&<div className="script-detail-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setSelectedScript(null);}}>
        <section className="script-detail-modal" role="dialog" aria-modal="true" aria-labelledby="script-detail-title">
          <button className="script-detail-close icon-button" onClick={()=>setSelectedScript(null)} aria-label="Close script details"><Icon name="close"/></button>
          <div className="script-detail-hero">
            {selectedScript.banner_url?<img src={selectedScript.banner_url} alt={selectedScript.name+" banner"}/>:<div className="script-detail-banner-fallback"><img src={logo} alt="Void Development"/><span>VOID DEVELOPMENT RELEASE</span></div>}
            <div className="script-detail-hero-shade"/>
            <div className="script-detail-hero-copy"><span className="script-detail-kicker"><i/> VERIFIED RELEASE · VOID LIBRARY</span><h2 id="script-detail-title">{selectedScript.name}</h2><p>{selectedScript.description||"A protected release from Void Development."}</p></div>
          </div>
          <div className="script-detail-body">
            <div className="script-detail-meta"><span>SLUG</span><strong>{selectedScript.slug}</strong></div>
            <div className="script-detail-meta"><span>CATEGORY</span><strong>{selectedScript.category||"Utility"}</strong></div>
            <div className="script-detail-meta"><span>VIEWS</span><strong>{selectedScript.view_count||0}</strong></div>
            <div className="script-detail-meta"><span>RELEASE STATUS</span><strong>{selectedScript.release_status==="patched"?"Patched":selectedScript.release_status==="not_working"?"Not working":"Working"}</strong></div>
            <div className="script-detail-meta"><span>RELEASED</span><strong>{selectedScript.created_at||selectedScript.updated_at?new Date(selectedScript.created_at||selectedScript.updated_at||"").toLocaleDateString():"Date unavailable"}</strong></div>
            <div className="loader-output" style={{marginTop:14}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginBottom:10}}><strong>Script loadstring</strong><button type="button" className="button button-small button-light" onClick={()=>void navigator.clipboard.writeText(publicLoadstring(selectedScript.slug)).then(()=>setNotice("Loadstring copied."),()=>setNotice("Copy the loadstring manually."))}>Copy loadstring</button></div><code style={{display:"block",whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{publicLoadstring(selectedScript.slug)}</code></div>
            <div className="script-detail-actions"><button className="button button-light" onClick={()=>setSelectedScript(null)}>Done</button>{selectedScript.showcase_url&&<a className="button button-ghost" href={selectedScript.showcase_url} target="_blank" rel="noreferrer">Watch showcase ↗</a>}</div>
          </div>
        </section>
      </div>}

      {voidTipOpen&&active==="Home"&&!cookieCustomize&&cookiePrefs!==null&&<aside className="void-pulse-popup" role="dialog" aria-label="Void quick tip"><div className="void-pulse-top"><span className="void-pulse-signal"><i/> VOID SIGNAL</span><button type="button" className="icon-button" onClick={()=>setVoidTipOpen(false)} aria-label="Close quick tip"><Icon name="close"/></button></div><div className="void-pulse-mark"><Icon name={voidTipIndex===0?"scripts":voidTipIndex===1?"keys":"palette"}/></div><span className="section-kicker">QUICK DISCOVERY · 0{voidTipIndex+1}</span><h3>{["Find your next release","One key, verified server-side","Make the workspace yours"][voidTipIndex]}</h3><p>{["Browse published scripts and open a card to see release status, details, and showcase links.","The key system checks keys through the connected API. Keep validation on the server for protected actions.","Choose a dark theme and tune the look of your Void workspace from the Themes tab."][voidTipIndex]}</p><div className="void-pulse-actions"><button type="button" className="button button-light" onClick={()=>{setVoidTipOpen(false);setPage(["Scripts","Key system","Themes"][voidTipIndex]);}}>Explore <Icon name="arrow"/></button><button type="button" className="button button-ghost" onClick={()=>setVoidTipIndex(i=>(i+1)%3)}>Next tip <Icon name="refresh"/></button></div><div className="void-pulse-dots"><i className={voidTipIndex===0?"active":""}/><i className={voidTipIndex===1?"active":""}/><i className={voidTipIndex===2?"active":""}/></div></aside>}
      {cookiePrefs===null&&<div className="cookie-backdrop"><section className="cookie-card" role="dialog" aria-modal="true" aria-labelledby="cookie-title"><div className="cookie-brand"><span className="cookie-icon"><Icon name="shield"/></span><span className="section-kicker">YOUR PRIVACY MATTERS</span></div><h2 id="cookie-title">Your data. Your call.</h2><p>Void Development uses essential storage to keep sign-in and security features working. Optional analytics help us understand visits and improve the workspace. We only record analytics after you opt in.</p><div className="cookie-choice"><span><strong>Essential</strong><small>Authentication and security · always on</small></span><span className="cookie-required">REQUIRED</span></div>{cookieCustomize&&<><label className="setting-row"><span><strong>Analytics cookies</strong><small>Allow anonymous visit counts and page events</small></span><input type="checkbox" checked={cookieAnalytics} onChange={e=>setCookieAnalytics(e.target.checked)}/></label><label className="setting-row"><span><strong>Personalization</strong><small>Remember theme and workspace preferences</small></span><input type="checkbox" checked={cookiePersonalization} onChange={e=>setCookiePersonalization(e.target.checked)}/></label></>}<button className="button button-light cookie-main" onClick={()=>chooseCookies(true,true)}>Accept all cookies <Icon name="arrow"/></button><div className="cookie-actions"><button className="button button-ghost" onClick={()=>chooseCookies(false,true)}>Essential only</button><button className="text-button" onClick={()=>cookieCustomize?chooseCookies(cookieAnalytics,cookiePersonalization):(setCookieCustomize(true),setCookieNotice(""))}>{cookieCustomize?"Save choices":"Customize"}</button></div><small className="cookie-footnote">You can change your choices anytime in Settings → Privacy choices.</small></section></div>}
      {cookiePrefs!==null&&cookieCustomize&&<div className="cookie-backdrop"><section className="cookie-card cookie-card-compact" role="dialog" aria-modal="true"><button className="cookie-close icon-button" onClick={()=>setCookieCustomize(false)} aria-label="Close cookie settings"><Icon name="close"/></button><span className="section-kicker">COOKIE PREFERENCES</span><h2>Privacy settings</h2><div className="cookie-choice"><span><strong>Essential</strong><small>Authentication and security</small></span><span className="cookie-required">REQUIRED</span></div><label className="setting-row"><span><strong>Analytics</strong><small>Anonymous page views and visits</small></span><input type="checkbox" checked={cookieAnalytics} onChange={e=>setCookieAnalytics(e.target.checked)}/></label><label className="setting-row"><span><strong>Personalization</strong><small>Remember theme choices</small></span><input type="checkbox" checked={cookiePersonalization} onChange={e=>setCookiePersonalization(e.target.checked)}/></label><button className="button button-light cookie-main" onClick={()=>chooseCookies(cookieAnalytics,cookiePersonalization)}>Save preferences</button>{cookieNotice&&<p className="inline-notice">{cookieNotice}</p>}</section></div>}
    </div>
  );
}

export default App;

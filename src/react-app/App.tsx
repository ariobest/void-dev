import { useCallback, useEffect, useMemo, useState, type CSSProperties, type ChangeEvent, type FormEvent } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { scriptApiUrl, supabase, supabasePublicKey } from "./lib/supabase";
import "./App.css";

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
type AdminUser = { id: string; email: string; created_at: string; last_sign_in_at: string | null; email_confirmed_at: string | null; banned_until: string | null; profile: Partial<Profile> | null; roles: string[] };

const emptyProfile: Profile = { username: "", display_name: "", bio: "", avatar_url: "", role: "user", banned: false };
const navItems = [
  ["Home","home"],["Scripts","scripts"],["Saved scripts","saved"],["Releases","release"],["Script editor","editor"],
  ["Themes","palette"],["Key system","keys"],["Key history","history"],
  ["Roadmap","roadmap"],["Notifications","bell"],["API & endpoints","api"],["Activity log","activity"],
  ["Community","users"],["Changelog","clock"],["Help center","help"],["Profile","profile"],["Sessions","lock"],["Settings","settings"],["Admin panel","admin"]
] as const;

function Icon({ name }: { name: string }) {
  const icons: Record<string,string> = {home:"⌂",scripts:"▤",editor:"⌘",roadmap:"◷",keys:"⌁",settings:"⚙",admin:"◈",profile:"◎",saved:"☆",bell:"♧",shield:"⬡",menu:"☰",search:"⌕",arrow:"↗",check:"✓",lock:"▣",palette:"◉",upload:"↑",release:"✦",history:"↺",chart:"▥",api:"⌘",activity:"⌁",users:"♙",clock:"◷",media:"▧",help:"?",close:"×"};
  return <span className="icon" aria-hidden="true">{icons[name] || "•"}</span>;
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
function messageOf(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function App() {
  const [themeId,setThemeId] = useState(() => { try { return localStorage.getItem("void-theme") || "spotlight"; } catch { return "spotlight"; } });
  const [accent,setAccent] = useState(() => { try { return localStorage.getItem("void-accent") || "#f5f5f5"; } catch { return "#f5f5f5"; } });
  const [active,setActive] = useState("Home");
  const [adminTab,setAdminTab] = useState("Overview");
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
  const [showPassword,setShowPassword] = useState(false);
  const [search,setSearch] = useState("");
  const [scripts,setScripts] = useState<ScriptRecord[]>([]);
  const [scriptsBusy,setScriptsBusy] = useState(false);
  const [scriptError,setScriptError] = useState("");
  const [saved,setSaved] = useState<string[]>([]);
  const [roadmap,setRoadmap] = useState<Array<{id:string;title:string;game_name:string;notes:string;progress:number;status:string}>>([]);
  const [editorCode,setEditorCode] = useState("-- Void Development Lua editor\n-- Write or paste your Lua code here.\n\nprint(\"Welcome to Void Development\")");
  const [editorName,setEditorName] = useState("Untitled.lua");
  const [notice,setNotice] = useState("");
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
  const [generatedAdminKeys,setGeneratedAdminKeys] = useState<Array<{key:string;expires_at:string|null;script:string;label:string}>>([]);
  const [adminKeyBusy,setAdminKeyBusy] = useState(false);
  const [releaseName,setReleaseName] = useState("");
  const [releaseSlug,setReleaseSlug] = useState("");
  const [releaseDescription,setReleaseDescription] = useState("");
  const [releaseCategory,setReleaseCategory] = useState("Utility");
  const [releaseBanner,setReleaseBanner] = useState("");
  const [releaseVideo,setReleaseVideo] = useState("");
  const [releaseSource,setReleaseSource] = useState("");
  const [releaseStatus,setReleaseStatus] = useState("draft");
  const [releaseNotice,setReleaseNotice] = useState("");
  const [editingScriptId,setEditingScriptId] = useState("");
  const [protectorSlug,setProtectorSlug] = useState("");
  const [loaderCode,setLoaderCode] = useState("");
  const [users,setUsers] = useState<AdminUser[]>([]);
  const [userSearch,setUserSearch] = useState("");
  const [analytics,setAnalytics] = useState<Analytics|null>(null);
  const [analyticsError,setAnalyticsError] = useState("");
  const [mediaAssets,setMediaAssets] = useState<Array<{name:string;url:string;created_at?:string;size?:number;contentType?:string}>>([]);
  const [mediaBusy,setMediaBusy] = useState(false);
  const [mediaNotice,setMediaNotice] = useState("");
  const [endpointStatus,setEndpointStatus] = useState("Checking endpoint…");
  const [apiSample,setApiSample] = useState("POST /functions/v1/script-api\nContent-Type: application/json\nAuthorization: Bearer YOUR_USER_ACCESS_TOKEN\n\n{\n  \"action\": \"validate\",\n  \"script\": \"your-script-slug\",\n  \"key\": \"VOID-XX-XXX-XXXX\"\n}");
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
    const {data,error} = await supabase.from("void_roadmap_items").select("id,title,game_name,notes,progress,status").eq("is_public",true).order("sort_order",{ascending:true}).limit(100);
    if (!error && data) setRoadmap(data as typeof roadmap);
  },[]);

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
    return () => { mounted=false; subscription.unsubscribe(); };
  },[refreshProfile]);

  useEffect(() => { void refreshScripts(); },[refreshScripts]);
  useEffect(() => { void refreshRoadmap(); },[refreshRoadmap]);
  useEffect(() => { if (active==="Home"||active==="Scripts"||active==="Releases") void trackEvent(active==="Scripts"?"script_view":active==="Releases"?"release_view":"page_view","/"+slugify(active)); },[active,trackEvent]);
  useEffect(() => {
    let mounted=true;
    fetch(scriptApiUrl+"?action=health",{headers:{apikey:supabasePublicKey}}).then(async r=>{const d=await r.json();if(mounted)setEndpointStatus(r.ok&&d.ok?"Online · API v"+d.version:"Unhealthy · "+(d.error||r.status));}).catch(()=>{if(mounted)setEndpointStatus("Offline · could not reach API");});
    return ()=>{mounted=false;};
  },[]);

  const filteredScripts = useMemo(() => scripts.filter(s => (s.name+" "+s.slug+" "+(s.category||"")+" "+(s.description||"")).toLowerCase().includes(search.toLowerCase())),[scripts,search]);
  const visibleScripts = active==="Saved scripts" ? filteredScripts.filter(s=>saved.includes(s.slug)) : filteredScripts;
  const themeStyle = {"--accent":accent} as CSSProperties & {"--accent":string};
  const userEmail = user?.email||"";
  const adminTabs = ["Overview","Releases","Key system","Script protector","Lua uploads","Media library","Users","Analytics","Roadmap","Audit logs"];

  async function handleAuth(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setAuthBusy(true); setAuthMessage("");
    try {
      if (authMode==="signup") {
        const {data,error} = await supabase.auth.signUp({email:email.trim(),password,options:{data:{display_name:displayName.trim()||email.split("@")[0]}}});
        if (error) throw error;
        if (!data.session) { setAuthMessage("Account created. Check your email to confirm the address, then sign in."); return; }
        setAuthMessage("Account created successfully.");
      } else {
        const {error} = await supabase.auth.signInWithPassword({email:email.trim(),password});
        if (error) throw error;
      }
      setPage("Home");
    } catch (error) { setAuthMessage(messageOf(error)); }
    finally { setAuthBusy(false); }
  }

  async function signInGoogle() {
    setAuthBusy(true); setAuthMessage("");
    const {error} = await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}});
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

  async function saveRelease(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setReleaseNotice("");
    if(!user||!isAdmin) { setReleaseNotice("Administrator sign-in is required."); return; }
    if(!releaseName.trim()||!releaseSlug.trim()) { setReleaseNotice("Add a script name and slug."); return; }
    if(new TextEncoder().encode(releaseSource).length>10000*1024) { setReleaseNotice("Lua source is too large. Maximum size is 10,000 KB (about 10 MB)."); return; }
    const record={name:releaseName.trim().slice(0,120),slug:slugify(releaseSlug||releaseName),category:releaseCategory.trim().slice(0,80)||"Utility",description:releaseDescription.trim().slice(0,2000),content:releaseSource,status:releaseStatus,banner_url:releaseBanner.trim()||null,showcase_url:releaseVideo.trim()||null,release_status:releaseStatus==="published"?"active":"working_on",owner_id:user.id,updated_at:new Date().toISOString()};
    try {
      const query=editingScriptId?supabase.from("scripts").update(record).eq("id",editingScriptId):supabase.from("scripts").insert(record);
      const {error}=await query;
      if(error)throw error;
      setReleaseNotice("Script saved to the database."); setEditingScriptId(""); setReleaseName("");setReleaseSlug("");setReleaseDescription("");setReleaseBanner("");setReleaseVideo("");setReleaseSource("");setReleaseStatus("draft");
      await refreshScripts(); setAdminTab("Releases"); setActive("Admin");
    } catch(error) { setReleaseNotice("Save failed: "+messageOf(error)); }
  }

  function editRelease(script:ScriptRecord) {
    setEditingScriptId(script.id);setReleaseName(script.name);setReleaseSlug(script.slug);setReleaseDescription(script.description||"");setReleaseCategory(script.category||"Utility");setReleaseBanner(script.banner_url||"");setReleaseVideo(script.showcase_url||"");setReleaseSource(script.content||"");setReleaseStatus(script.status||"draft");setAdminTab("Lua uploads");setActive("Admin");setNotice("");
  }

  async function uploadLuaFile(e:ChangeEvent<HTMLInputElement>) {
    const file=e.target.files?.[0]; if(!file)return;
    if(!file.name.toLowerCase().endsWith(".lua")&&!file.name.toLowerCase().endsWith(".txt")) {setReleaseNotice("Choose a .lua or .txt source file.");return;}
    if(file.size>10000*1024) {e.target.value="";setReleaseNotice("File is too large. Maximum size is 10,000 KB (about 10 MB).");return;}
    const source=await file.text();setReleaseSource(source);setReleaseName(old=>old||file.name.replace(/\.(lua|txt)$/i,""));setReleaseSlug(old=>old||slugify(file.name.replace(/\.(lua|txt)$/i,"")));setReleaseNotice("Loaded "+file.name+" into the editor. Save it to store the source in Supabase.");
  }

  async function prepareLoader(script?:ScriptRecord) {
    const slug=script?.slug||protectorSlug;
    if(!slug) {setNotice("Choose a saved script slug first.");return;}
    const url=window.location.origin+"/api/scripts/load?script="+encodeURIComponent(slug)+"&key=YOUR_VOID_KEY";
    const loader="-- Protected by Void Development\n-- Replace YOUR_VOID_KEY with a valid key.\nloadstring(game:HttpGet("+JSON.stringify(url)+"))()";
    setLoaderCode(loader);setProtectorSlug(slug);setNotice("Loader generated for this website domain. The Worker proxy must be deployed for this URL to work.");
  }

  async function loadAdminUsers() {
    setNotice("");
    try { const result=await apiCall<{users:AdminUser[]}>("admin-users");setUsers(result.users||[]); }
    catch(error) { setNotice(messageOf(error)); }
  }
  async function updateAdminUser(target:AdminUser,changes:{role?:string;banned?:boolean}) {
    setNotice("");
    try { await apiCall("admin-update-user",{user_id:target.id,...changes});await loadAdminUsers();setNotice("User updated."); }
    catch(error) { setNotice(messageOf(error)); }
  }
  async function loadAnalytics() {
    setAnalyticsError("");
    try { const data=await apiCall<Analytics>("admin-analytics");setAnalytics(data); }
    catch(error) { setAnalyticsError(messageOf(error)); }
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
    const file=e.target.files?.[0]; if(!file) return;
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
    try { await apiCall("revoke-key",{id}); await loadKeys();setNotice("Key revoked."); }
    catch(error) {setNotice(messageOf(error));}
  }

  function chooseCookies(analyticsAllowed:boolean,personalizationAllowed:boolean) {
    const prefs:CookiePrefs={necessary:true,analytics:analyticsAllowed,personalization:personalizationAllowed,decidedAt:new Date().toISOString()};
    writeCookie("void_cookie_consent",JSON.stringify(prefs));setCookiePrefs(prefs);setCookieNotice("Your cookie preferences have been saved.");setCookieCustomize(false);
  }

  const isAuthPage=active==="Sign in"||active==="Sign up";
  const pageTitle:Record<string,string>={"Scripts":"Explore the script library.","Saved scripts":"Your saved collection.","Releases":"Latest releases.","Script editor":"Your code workspace.","Themes":"Your look, your rules.","Script protector":"Publish without exposing source on public pages.","Lua uploads":"Release management.","Key system":"Access verification.","Key history":"Key activity.","Roadmap":"What we’re building.","Notifications":"Updates from Void Development.","Analytics":"Real traffic, not demo numbers.","API & endpoints":"Verify the services powering your workspace.","Activity log":"Your recent workspace activity.","Community":"The creator space.","Changelog":"Product updates.","Help center":"Guides and support.","Profile":"Make your profile yours.","Sessions":"Account security.","Settings":"Workspace preferences.","Admin panel":"Manage users, releases, keys, and protection."};

  return (
    <div className={"app theme-"+themeId+(reducedMotion?" reduce-motion":"")+(spotlight?" spotlight-on":"")} style={themeStyle}>
      <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
      <header className="topbar">
        <button className="brand" onClick={()=>setPage("Home")} aria-label="Void Development home"><img src={logo} alt="Void Development logo"/><span className="brand-word">Void Development<span className="brand-dot">.</span></span></button>
        <div className="topbar-right"><span className="system-status"><i/> {endpointStatus.startsWith("Online")?"API online":"Workspace"}</span><button className="icon-button notification-button" onClick={()=>setPage("Notifications")} aria-label="Notifications"><Icon name="bell"/><span className="notification-dot"/></button>{user?<button className="profile-chip" onClick={()=>setPage("Profile")}><span className="avatar">{(profileName||userEmail||"V").slice(0,1).toUpperCase()}</span><span>{profileName||userEmail}</span></button>:<button className="button button-light top-login" onClick={()=>{setAuthMode("login");setPage("Sign in");}}>Sign in <Icon name="arrow"/></button>}<button className={"menu-trigger"+(navOpen?" menu-active":"")} onClick={()=>setNavOpen(v=>!v)} aria-expanded={navOpen}><Icon name="menu"/> <span>Navigate</span></button></div>
      </header>

      {navOpen&&<><button className="nav-scrim" aria-label="Close navigation" onClick={()=>setNavOpen(false)}/><aside className="nav-drawer"><div className="drawer-heading"><span>VOID DEVELOPMENT · NAVIGATION</span><button className="icon-button" onClick={()=>setNavOpen(false)}><Icon name="close"/></button></div><div className="drawer-links">{navItems.filter(([label])=>!["Script protector","Lua uploads"].includes(label)&&(label!=="Admin panel"||isAdmin)).map(([label,icon])=><button key={label} className={active===label?"drawer-link selected":"drawer-link"} onClick={()=>setPage(label)}><Icon name={icon}/><span>{label}</span>{label==="Themes"&&<span className="drawer-count">35</span>}{label==="Admin panel"&&<span className="admin-label">ADMIN</span>}</button>)}</div><div className="drawer-bottom"><div className="drawer-user"><span className="avatar">{user?(profileName||userEmail||"V").slice(0,1).toUpperCase():"V"}</span><div><strong>{user?profileName||userEmail:"Guest session"}</strong><small>{user?(isAdmin?"Administrator":"Authenticated member"):"Sign in to sync your workspace"}</small></div></div>{user?<button className="drawer-link" onClick={()=>void signOut()}><Icon name="lock"/> Sign out</button>:<button className="drawer-link" onClick={()=>{setAuthMode("login");setPage("Sign in");}}><Icon name="profile"/> Sign in / Sign up</button>}</div></aside></>}

      <main className="main-shell">
        {active==="Home"&&<section className="hero"><div className="eyebrow"><span className="eyebrow-line"/> SCRIPT MANAGEMENT PLATFORM <span className="eyebrow-pill">VOID DEVELOPMENT</span></div><h1 className="hero-title">Build. Protect. Release.<br/><span className="gradient-title">Your next move starts here.</span></h1><p className="hero-subtitle">A polished workspace for your Lua releases, key verification, and creator tools.<br className="desktop-break"/> One place to manage the entire release flow.</p><div className="hero-actions"><button className="button button-light" onClick={()=>setPage("Scripts")}>Explore Scripts <Icon name="arrow"/></button></div><div className="hero-meta"><span><i className="live-pulse"/> {endpointStatus.toUpperCase()}</span><span className="meta-separator">/</span><span>35 DARK THEMES</span><span className="meta-separator">/</span><span>RESPONSIVE WORKSPACE</span></div></section>}
        {!["Home","Admin panel"].includes(active)&&!isAuthPage&&<section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> VOID DEVELOPMENT WORKSPACE</div><h1>{pageTitle[active]||active}</h1><p>{active==="Script protector"?"Keep source out of public-facing script cards and generate your site-specific loader.":active==="Analytics"?"Numbers come from recorded, consented visits in your database.":active==="Profile"?"Your public profile details and preferences.":"Connected to your existing Void Development workspace."}</p></div><button className="button button-ghost" onClick={()=>setPage("Home")}>← Home</button></section>}

        {(active==="Home"||active==="Scripts"||active==="Saved scripts"||active==="Releases")&&<><section className="stats-grid"><div className="stat-card"><div className="stat-top"><span>PUBLISHED SCRIPTS</span><span className="stat-icon"><Icon name="scripts"/></span></div><strong>{scripts.filter(s=>s.status==="published").length.toString().padStart(2,"0")}</strong><small>From the connected script library</small></div><div className="stat-card"><div className="stat-top"><span>YOUR SAVED</span><span className="stat-icon"><Icon name="saved"/></span></div><strong>{saved.length.toString().padStart(2,"0")}</strong><small>Saved in this browser</small></div><div className="stat-card"><div className="stat-top"><span>ROADMAP</span><span className="stat-icon"><Icon name="roadmap"/></span></div><strong>{roadmap.filter(r=>r.progress===100).length}/{roadmap.length}</strong><small>Public milestones</small></div><div className="stat-card"><div className="stat-top"><span>AUTH STATUS</span><span className="stat-icon"><Icon name="shield"/></span></div><strong className="stat-live">{user?"CONNECTED":"GUEST"}</strong><small>{user?userEmail:"Sign in to sync your account"}</small></div></section>
          <section className="section-block"><div className="section-heading"><div><span className="section-kicker">VOID LIBRARY</span><h2>{active==="Saved scripts"?"Saved scripts":active==="Releases"?"Latest releases":active==="Scripts"?"Published scripts":"Featured scripts"}</h2></div><div className="section-tools"><label className="search-box"><Icon name="search"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search scripts..."/></label>{active==="Home"&&<button className="text-button" onClick={()=>setPage("Scripts")}>View all <Icon name="arrow"/></button>}</div></div>
            {scriptsBusy?<div className="empty-state">Loading scripts from Supabase…</div>:scriptError?<div className="empty-state">Could not load scripts: {scriptError}<button className="text-button" onClick={()=>void refreshScripts()}>Retry</button></div>:<div className="script-grid">{visibleScripts.filter(s=>active!=="Home"||s.is_featured||true).map(script=><article className="script-card" key={script.id}>{script.banner_url&&<img className="release-banner" src={script.banner_url} alt={script.name+" banner"} loading="lazy"/>}<div className="script-card-top"><span className="script-symbol">{"</>"}</span><span className={"status status-"+(script.status||"published").replace(/ /g,"-")}><i/>{script.status||"published"}</span></div><h3>{script.name}</h3><p>{script.description||"A Void Development release."}</p><div className="script-game"><span>SLUG / CATEGORY</span><strong>{script.slug} · {script.category||"Utility"}</strong></div>{script.showcase_url&&<a className="video-link" href={script.showcase_url} target="_blank" rel="noreferrer">▶ Watch showcase <Icon name="arrow"/></a>}<div className="protected-card"><Icon name="shield"/><strong>THIS SCRIPT IS PROTECTED BY VOID DEVELOPMENT</strong><small>Source is not shown in the public library.</small></div><div className="script-card-footer"><span className="updated">{script.view_count||0} views</span><div className="script-actions"><button className={saved.includes(script.slug)?"icon-button is-saved":"icon-button"} onClick={()=>setSaved(old=>old.includes(script.slug)?old.filter(s=>s!==script.slug):[...old,script.slug])} aria-label="Save script"><Icon name="saved"/></button><button className="button button-small" onClick={()=>{setProtectorSlug(script.slug);setPage("Key system");}}>Get access <Icon name="arrow"/></button></div></div></article>)}{visibleScripts.length===0&&<div className="empty-state">No scripts found. Published releases will appear here after an administrator publishes them.</div>}</div>}</section>
          {active==="Home"&&<section className="lower-grid"><div className="panel roadmap-preview"><div className="panel-heading"><div><span className="section-kicker">IN DEVELOPMENT</span><h2>Roadmap preview</h2></div><button className="icon-button" onClick={()=>setPage("Roadmap")} aria-label="View roadmap"><Icon name="arrow"/></button></div>{roadmap.slice(0,4).map(item=><div className="roadmap-row" key={item.id}><div className="roadmap-label"><strong>{item.title}</strong><span>{item.progress}%</span></div><div className="progress-track"><div style={{width:item.progress+"%"}}/></div></div>)}<button className="text-button roadmap-link" onClick={()=>setPage("Roadmap")}>Open roadmap <Icon name="arrow"/></button></div><div className="panel quick-panel"><span className="section-kicker">QUICK ACTIONS</span><h2>Pick up where you left off.</h2><p>Jump into protection, release management, or workspace personalization.</p>{[["Script protector","Protect a release and generate a loader","shield"],["Themes","Choose from 35 dark themes","palette"],["Profile","Customize your public profile","profile"]].map(([page,desc,icon])=><button className="quick-action" key={page} onClick={()=>setPage(page)}><span className="quick-icon"><Icon name={icon}/></span><span><strong>{page}</strong><small>{desc}</small></span><Icon name="arrow"/></button>)}</div></section>}</>}

        {active==="Themes"&&<section className="panel theme-gallery"><div className="panel-heading"><div><span className="section-kicker">35 COLORWAYS</span><h2>Choose your workspace theme</h2><p className="muted">Every theme keeps the interface dark and uses its color as a subtle accent.</p></div><span className="eyebrow-pill">{themes.length} THEMES</span></div><div className="theme-options theme-gallery-grid">{themes.map(t=><button key={t[0]} className={themeId===t[0]?"theme-option theme-selected":"theme-option"} onClick={()=>{setThemeId(t[0]);setAccent(t[2]);}}><span className="theme-swatch" style={{background:t[2],boxShadow:"0 0 16px "+t[2]+"33"}}/><span>{t[1]}</span>{themeId===t[0]&&<Icon name="check"/>}</button>)}</div><label className="setting-row"><span><strong>Custom accent</strong><small>Pick any color for the active theme</small></span><input type="color" value={accent} onChange={e=>setAccent(e.target.value)}/></label><button className="button button-light" onClick={()=>{try{localStorage.setItem("void-theme",themeId);localStorage.setItem("void-accent",accent);setNotice("Theme saved on this device.");}catch{setNotice("Could not save this theme on the device.");}}}>Save theme</button>{notice&&<p className="inline-notice">{notice}</p>}</section>}

        {active==="Script editor"&&<section className="editor-panel panel"><div className="editor-toolbar"><div className="editor-file"><span className="file-dot"/><input value={editorName} onChange={e=>setEditorName(e.target.value)} aria-label="File name"/></div><div className="editor-buttons"><span className="language-badge">LUA</span><button className="button button-ghost button-small" onClick={()=>setEditorCode("")}>Clear</button><button className="button button-light button-small" onClick={()=>{void navigator.clipboard.writeText(editorCode).then(()=>setNotice("Code copied."),()=>setNotice("Select the text and copy it manually."));}}>Copy code ↗</button></div></div><textarea className="code-editor" spellCheck={false} value={editorCode} onChange={e=>setEditorCode(e.target.value)} aria-label="Lua code editor"/><div className="editor-footer"><span><i className="live-pulse"/> Editor ready · {editorCode.split("\n").length} lines</span><span>Lua · UTF-8</span></div>{notice&&<p className="inline-notice">{notice}</p>}<div className="editor-note"><Icon name="shield"/><p><strong>Protected release workflow</strong><br/>Source saved here stays in your editor until you upload it. To publish source for a Roblox client loader, remember that client-executed code can be inspected by the client that receives it.</p></div></section>}

        
        {active==="Admin panel"&&<section className="admin-layout"><aside className="admin-sidebar panel"><div className="admin-brand"><span className="admin-mark"><Icon name="admin"/></span><div><strong>VOID CONTROL</strong><small>ADMINISTRATION</small></div></div><span className="section-kicker">MANAGEMENT</span>{adminTabs.map((tab)=><button key={tab} className={adminTab===tab?"admin-side-active":""} onClick={()=>{setAdminTab(tab);setNotice("");if(tab==="Users")void loadAdminUsers();if(tab==="Analytics")void loadAnalytics();if(tab==="Media library")void loadMedia();if(tab==="Key system")void loadKeys();if(tab==="Audit logs")void loadAudit();if(tab==="Releases")void refreshScripts();}}><Icon name={tab==="Overview"?"home":tab==="Releases"?"release":tab==="Key system"?"keys":tab==="Script protector"?"shield":tab==="Lua uploads"?"upload":tab==="Media library"?"media":tab==="Users"?"users":tab==="Analytics"?"chart":tab==="Endpoint verification"?"api":tab==="Roadmap"?"roadmap":"activity"}/>{tab}</button>)}<div className="admin-warning"><Icon name="shield"/><p>Server-verified admin role required for all privileged actions.</p></div></aside><div className="admin-content">
          {isAdmin&&active==="Admin panel"&&adminTab==="Script protector"&&<section className="protector-grid"><div className="panel settings-panel"><span className="section-kicker">SOURCE UPLOAD</span><h2>{editingScriptId?"Edit release source":"Protect a Lua release"}</h2><p className="muted">Upload a .lua file or paste source, then save it to your connected script database. Only admins can publish releases.</p><form className="release-form" onSubmit={saveRelease}><label className="form-label">SCRIPT NAME<input required value={releaseName} onChange={e=>{setReleaseName(e.target.value);if(!releaseSlug)setReleaseSlug(slugify(e.target.value));}} placeholder="My script release"/></label><label className="form-label">PUBLIC SLUG<input required value={releaseSlug} onChange={e=>setReleaseSlug(slugify(e.target.value))} placeholder="my-script-release"/></label><label className="form-label">DESCRIPTION<textarea value={releaseDescription} onChange={e=>setReleaseDescription(e.target.value)} rows={3} placeholder="What does this release do?"/></label><label className="form-label">LUA SOURCE FILE<input type="file" accept=".lua,.txt,text/plain" onChange={e=>void uploadLuaFile(e)}/></label><label className="form-label">SOURCE CODE<textarea className="source-textarea" value={releaseSource} onChange={e=>setReleaseSource(e.target.value)} rows={10} maxLength={10240000} placeholder="Paste Lua source here (max 10,000 KB)…"/><small className="muted">Maximum source/file size: 10,000 KB (about 10 MB).</small></label><div className="two-fields"><label className="form-label">CATEGORY<select value={releaseCategory} onChange={e=>setReleaseCategory(e.target.value)}><option>Utility</option><option>Interface</option><option>Loader</option><option>Library</option><option>Other</option></select></label><label className="form-label">STATUS<select value={releaseStatus} onChange={e=>setReleaseStatus(e.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="hidden">Hidden</option></select></label></div><label className="form-label">BANNER IMAGE URL<input type="url" value={releaseBanner} onChange={e=>setReleaseBanner(e.target.value)} placeholder="https://…"/></label><label className="form-label">YOUTUBE SHOWCASE URL<input type="url" value={releaseVideo} onChange={e=>setReleaseVideo(e.target.value)} placeholder="https://youtube.com/watch?v=…"/></label><button className="button button-light" type="submit" disabled={!user||!isAdmin}>{editingScriptId?"Save release":"Save release to Supabase"} <Icon name="arrow"/></button>{!isAdmin&&<p className="muted">Sign in with an account that has the admin role to upload and publish scripts.</p>}{releaseNotice&&<p className="inline-notice">{releaseNotice}</p>}</form></div><div className="panel settings-panel"><span className="section-kicker">LOADER GENERATOR</span><h2>Website-specific loadstring</h2><p className="muted">Select a saved script to generate a loader using this website's current domain and your existing key-verification API.</p><label className="form-label">SCRIPT SLUG<select value={protectorSlug} onChange={e=>setProtectorSlug(e.target.value)}><option value="">Choose a script…</option>{scripts.map(s=><option key={s.id} value={s.slug}>{s.name} · {s.slug}</option>)}</select></label><button className="button button-light" onClick={()=>void prepareLoader()}>Generate loader</button><textarea className="loader-output" readOnly value={loaderCode} placeholder="Your website-specific loadstring appears here…"/><button className="button button-ghost" disabled={!loaderCode} onClick={()=>void navigator.clipboard.writeText(loaderCode).then(()=>setNotice("Loader copied."),()=>setNotice("Copy the loader text manually."))}>Copy loadstring</button><div className="protected-card protected-card-large"><Icon name="shield"/><strong>THIS SCRIPT IS PROTECTED BY VOID DEVELOPMENT</strong><small>Public cards do not display Lua source.</small></div><p className="muted">Technical note: a valid key allows the Roblox client to receive source code for execution. No client-side loader can make that source impossible for its recipient to inspect.</p>{notice&&<p className="inline-notice">{notice}</p>}</div></section>}

          {adminTab==="Overview"&&<><div className="admin-overview-grid"><div className="stat-card"><span className="section-kicker">SCRIPTS</span><strong>{scripts.length}</strong><small>Connected database</small></div><div className="stat-card"><span className="section-kicker">ADMIN ROLE</span><strong>{isAdmin?"ACTIVE":"DENIED"}</strong><small>Verified through user_roles</small></div><div className="stat-card"><span className="section-kicker">API STATUS</span><strong className="stat-live">{endpointStatus.startsWith("Online")?"ONLINE":"CHECK"}</strong><small>Live health check</small></div></div><div className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">ADMIN SHORTCUTS</span><h2>Control room</h2></div></div>{[["Releases","Publish scripts, banners, and YouTube showcases."],["Key system","Create, inspect, and revoke keys."],["Lua uploads","Upload source and generate site-specific loaders."],["Users","Review registered emails and manage account access."],["Analytics","View consented real traffic events."],["Endpoint verification","Check the health endpoint and copy API samples."]].map(([tab,desc])=><button className="quick-action" key={tab} onClick={()=>{setAdminTab(tab);if(tab==="Users")void loadAdminUsers();if(tab==="Analytics")void loadAnalytics();if(tab==="Media library")void loadMedia();if(tab==="Key system")void loadKeys();}}><span><strong>{tab}</strong><small>{desc}</small></span><Icon name="arrow"/></button>)}</div></>}
          {adminTab==="Releases"&&<div className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">PUBLISHING</span><h2>Script releases</h2></div><button className="button button-light button-small" onClick={()=>{setEditingScriptId("");setReleaseName("");setReleaseSlug("");setReleaseDescription("");setReleaseSource("");setReleaseBanner("");setReleaseVideo("");setAdminTab("Lua uploads");}}>New release +</button></div>{scripts.map(s=><div className="admin-script-row" key={s.id}>{s.banner_url?<img className="admin-banner-thumb" src={s.banner_url} alt=""/>:<span className="script-symbol">{"</>"}</span>}<div className="admin-script-name"><strong>{s.name}</strong><small>{s.slug} · {s.status||"published"}</small></div><button className="button button-ghost button-small" onClick={()=>editRelease(s)}>Edit</button></div>)}{scripts.length===0&&<p className="muted">No script records found.</p>}</div>}
          {adminTab==="Key system"&&<><div className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">KEY CONTROL</span><h2>Generate keys</h2><p className="muted">Generate 1–100 keys per batch. Blank expiry or usage limit means unlimited.</p></div><button className="button button-ghost button-small" onClick={()=>void loadKeys()}>Refresh keys</button></div><form className="release-form" onSubmit={createKey}><div className="form-label"><span>KEY SCOPE</span><p className="muted">Global access · works with every published game/script. No game selection needed.</p></div><div className="two-fields"><label className="form-label">NUMBER OF KEYS<input type="number" min={1} max={100} step={1} required value={adminKeyCount} onChange={e=>setAdminKeyCount(Number(e.target.value))}/></label><label className="form-label">EXPIRY IN DAYS<input type="number" min={1} max={3650} value={adminKeyExpiryDays} onChange={e=>setAdminKeyExpiryDays(e.target.value)} placeholder="Blank = never expires"/></label></div><div className="two-fields"><label className="form-label">MAX USES PER KEY<input type="number" min={1} max={1000000} value={adminKeyMaxUses} onChange={e=>setAdminKeyMaxUses(e.target.value)} placeholder="Blank = unlimited"/></label><label className="form-label">KEY LABEL<input value={adminKeyLabel} maxLength={80} onChange={e=>setAdminKeyLabel(e.target.value)} placeholder="Key label"/></label></div><button className="button button-light" disabled={adminKeyBusy||!isAdmin}>{adminKeyBusy?"Generating keys…":"Generate "+Math.max(1,Math.min(100,adminKeyCount||1))+" key"+(adminKeyCount===1?"":"s")}</button></form>{generatedAdminKeys.length>0&&<div className="created-key admin-created-keys"><div className="panel-heading"><strong>New keys · copy them now</strong><button type="button" className="button button-ghost button-small" onClick={()=>void navigator.clipboard.writeText(generatedAdminKeys.map(k=>k.key).join("\n")).then(()=>setNotice("All generated keys copied."),()=>setNotice("Select and copy the keys manually."))}>Copy all</button></div>{generatedAdminKeys.map((k)=><div className="generated-key-row" key={k.key}><div><code>{k.key}</code><small>{k.script} · {k.expires_at?"Expires "+new Date(k.expires_at).toLocaleString():"No expiry"} · {k.label}</small></div><button type="button" className="button button-ghost button-small" onClick={()=>void navigator.clipboard.writeText(k.key)}>Copy</button></div>)}</div>}{notice&&<p className="inline-notice">{notice}</p>}</div><div className="panel admin-table-panel"><div className="panel-heading"><h2>Issued keys</h2><button className="button button-ghost button-small" onClick={()=>void loadKeys()}>Refresh</button></div>{keyRecords.map((k,i)=><div className="admin-script-row" key={String(k.id||i)}><div className="admin-script-name"><strong>{String(k.key_prefix||"Key")} · {String(k.label||"Access key")}</strong><small>{"All games / scripts"} · {String(k.use_count||0)} / {k.max_uses===null||k.max_uses===undefined?"∞":String(k.max_uses)} uses · {k.expires_at?new Date(String(k.expires_at)).toLocaleDateString():"No expiry"}</small></div>{k.revoked_at?<span className="status">Revoked</span>:k.expires_at&&Date.parse(String(k.expires_at))<=Date.now()?<span className="status">Expired</span>:k.max_uses!==null&&k.max_uses!==undefined&&Number(k.use_count)>=Number(k.max_uses)?<span className="status">Used up</span>:<button className="button button-ghost button-small" onClick={()=>void revokeKey(String(k.id))}>Revoke</button>}</div>)}{keyRecords.length===0&&<p className="muted">Press Refresh keys to load current records.</p>}</div></>}
          {adminTab==="Script protector"&&<div className="panel admin-table-panel"><span className="section-kicker">PROTECTION WORKFLOW</span><h2>Protected loader</h2><p className="muted">Choose a saved script, then generate a loadstring that uses the current website origin. The Worker proxy must be active for the generated URL to resolve.</p><label className="form-label">SCRIPT<select value={protectorSlug} onChange={e=>setProtectorSlug(e.target.value)}><option value="">Choose script</option>{scripts.map(s=><option key={s.id} value={s.slug}>{s.name}</option>)}</select></label><button className="button button-light" onClick={()=>void prepareLoader()}>Generate website loader</button><textarea className="loader-output" value={loaderCode} readOnly placeholder="Generated loader…"/><button className="button button-ghost" disabled={!loaderCode} onClick={()=>void navigator.clipboard.writeText(loaderCode)}>Copy loader</button><div className="protected-card protected-card-large"><Icon name="shield"/><strong>THIS SCRIPT IS PROTECTED BY VOID DEVELOPMENT</strong><small>Client-executed source is not cryptographically hidden from its recipient.</small></div></div>}
          {adminTab==="Lua uploads"&&<div className="panel admin-table-panel"><span className="section-kicker">RELEASE WORKFLOW</span><h2>Lua uploads and script publishing</h2><p className="muted">Use the full release form in Script protector, which includes source, banner, and YouTube showcase.</p><button className="button button-light" onClick={()=>setAdminTab("Script protector")}>Open Script Protector <Icon name="arrow"/></button></div>}
          {adminTab==="Users"&&<div className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">AUTH USERS</span><h2>Registered users</h2><p className="muted">Email addresses are only shown to verified admins. Results are capped at 200 users.</p></div><button className="button button-light button-small" onClick={()=>void loadAdminUsers()}>Refresh</button></div><label className="search-box"><Icon name="search"/><input value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="Search email…"/></label>{users.filter(u=>u.email.toLowerCase().includes(userSearch.toLowerCase())).map(u=><div className="admin-user-row" key={u.id}><div className="avatar">{(u.email||"U").slice(0,1).toUpperCase()}</div><div className="admin-script-name"><strong>{u.email||"No email"}</strong><small>Joined {new Date(u.created_at).toLocaleDateString()} · {u.last_sign_in_at?"Last sign-in "+new Date(u.last_sign_in_at).toLocaleDateString():"Never signed in"} · {u.email_confirmed_at?"Email confirmed":"Email unconfirmed"}</small></div><select value={u.roles.includes("admin")?"admin":u.roles.includes("moderator")?"moderator":"user"} onChange={e=>void updateAdminUser(u,{role:e.target.value})}><option value="user">User</option><option value="moderator">Moderator</option><option value="admin">Admin</option></select><button className="button button-ghost button-small" onClick={()=>void updateAdminUser(u,{banned:!u.banned_until&&!u.profile?.banned})}>{u.banned_until||u.profile?.banned?"Unban":"Ban"}</button></div>)}{users.length===0&&<p className="muted">Load users to see registered accounts.</p>}</div>}
          {adminTab==="Media library"&&<div className="panel admin-table-panel media-library-panel"><div className="panel-heading"><div><span className="section-kicker">SUPABASE STORAGE</span><h2>Media library</h2><p className="muted">Upload images and videos to the existing public void-files bucket. Each upload gets a direct URL you can copy into a banner, avatar, or showcase field.</p></div><button type="button" className="button button-ghost button-small" onClick={()=>void loadMedia()} disabled={mediaBusy}>Refresh</button></div><label className="media-upload-drop"><span className="media-upload-icon"><Icon name="upload"/></span><strong>{mediaBusy?"Working…":"Upload an image or video"}</strong><small>PNG, JPG, GIF, WebP, MP4, WebM, and other image/video formats · up to 100 MB (subject to bucket limits)</small><input type="file" accept="image/*,video/*" onChange={e=>void uploadMediaFile(e)} disabled={mediaBusy||!isAdmin}/></label>{mediaNotice&&<p className="inline-notice">{mediaNotice}</p>}{mediaAssets.length>0?<div className="media-assets-grid">{mediaAssets.map(asset=><article className="media-asset-card" key={asset.url}>{asset.contentType?.startsWith("video/")||/\.(mp4|webm|mov|m4v)$/i.test(asset.name)?<video src={asset.url} controls preload="metadata"/>:<img src={asset.url} alt={asset.name} loading="lazy"/>}<div className="media-asset-info"><strong title={asset.name}>{asset.name.split("/").pop()}</strong><small>{asset.size?((asset.size/1024/1024).toFixed(2)+" MB"):"Stored in Supabase"}{asset.created_at?" · "+new Date(asset.created_at).toLocaleDateString():""}</small><input className="media-direct-url" readOnly value={asset.url} onFocus={e=>e.currentTarget.select()} aria-label={"Direct URL for "+asset.name}/><div className="media-asset-actions"><button type="button" className="button button-light button-small" onClick={()=>void navigator.clipboard.writeText(asset.url).then(()=>setMediaNotice("Direct URL copied."),()=>setMediaNotice("Select the URL and copy it manually."))}>Copy direct link</button><a className="button button-ghost button-small" href={asset.url} target="_blank" rel="noreferrer">Open</a></div></div></article>)}</div>:<div className="empty-state">{mediaBusy?"Loading media…":"No uploaded media yet. Upload your first image or video above."}</div>}</div>}
          {adminTab==="Analytics"&&<div className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">CONSENTED VISITS</span><h2>Site analytics</h2></div><button className="button button-light button-small" onClick={()=>void loadAnalytics()}>Refresh</button></div>{analytics?<div className="stats-grid analytics-grid"><div className="stat-card"><span className="section-kicker">REGISTERED USERS</span><strong>{analytics.totalUsers}</strong></div><div className="stat-card"><span className="section-kicker">EVENTS</span><strong>{analytics.events}</strong></div><div className="stat-card"><span className="section-kicker">VISITORS</span><strong>{analytics.uniqueVisitors}</strong></div><div className="stat-card"><span className="section-kicker">TODAY VIEWS</span><strong>{analytics.todayViews}</strong></div><div className="stat-card"><span className="section-kicker">TODAY VISITORS</span><strong>{analytics.todayVisitors}</strong></div></div>:<p className="muted">{analyticsError||"Load analytics to see real database-backed totals."}</p>}<button className="button button-ghost" onClick={()=>void loadAnalytics()}>Load analytics</button></div>}
          {adminTab==="Endpoint verification"&&<div className="panel admin-table-panel"><span className="section-kicker">API HEALTH</span><h2>Endpoint verification</h2><div className="endpoint-pill"><i className={endpointStatus.startsWith("Online")?"":"endpoint-down"}/>{endpointStatus}</div><p className="muted">{scriptApiUrl}?action=health</p><button className="button button-light" onClick={()=>fetch(scriptApiUrl+"?action=health",{headers:{apikey:supabasePublicKey}}).then(async r=>{const d=await r.json();setEndpointStatus(r.ok&&d.ok?"Online · API v"+d.version:"Unhealthy");}).catch(()=>setEndpointStatus("Offline"))}>Run health check</button><textarea className="loader-output" value={apiSample} onChange={e=>setApiSample(e.target.value)}/><button className="button button-ghost" onClick={()=>void navigator.clipboard.writeText(apiSample)}>Copy endpoint sample</button></div>}
          {adminTab==="Roadmap"&&<div className="panel admin-table-panel"><span className="section-kicker">ROADMAP</span><h2>Milestones</h2>{roadmap.map(r=><div className="roadmap-row" key={r.id}><div className="roadmap-label"><strong>{r.title}</strong><span>{r.progress}% · {r.status}</span></div><div className="progress-track"><div style={{width:r.progress+"%"}}/></div></div>)}<p className="muted">The current database has admin-only insert/update policies for roadmap items. This UI reads existing public milestones; editor controls can be added without changing existing records.</p></div>}
          {adminTab==="Audit logs"&&<div className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">AUDIT TRAIL</span><h2>Administrative actions</h2></div><button className="button button-light button-small" onClick={()=>void loadAudit()}>Refresh logs</button></div>{auditRows.map((row,i)=><div className="admin-script-row" key={String(row.id||i)}><div className="admin-script-name"><strong>{String(row.action||"Action")}</strong><small>{String(row.target_type||"target")} · {String(row.target_id||"—")} · {new Date(String(row.created_at)).toLocaleString()}</small></div></div>)}{auditRows.length===0&&<p className="muted">Load audit logs to view recorded administrator actions.</p>}</div>}
        </div></section>}
        {active==="Key system"&&<section className="key-panel panel"><div className="key-illustration"><div className="key-orbit">⌁</div><span className="section-kicker">LIVE KEY VERIFICATION</span><h2>Verify a Void key.</h2><p>Requests are checked by your deployed Supabase Edge Function and existing script-key database. Invalid keys never receive script source.</p><div className="endpoint-pill"><i/> {endpointStatus}</div></div><div className="key-form"><section className="key-generation-card"><div className="panel-heading"><div><span className="section-kicker">VOID KEY GENERATOR</span><h3>Claim your key</h3><p className="muted">Wait 20 seconds while your key emerges from the Void. Visitor keys last 24 hours and the daily claim limit remains in place.</p></div></div><div className="void-key-chamber"><div className={"void-core"+(keyGenerating?" void-core-active":"")}><span>VOID</span></div>{keyGenerating&&<div className="void-countdown"><strong>{keyCountdown}</strong><span>SECONDS REMAINING</span><div className="void-progress"><i style={{width:((20-keyCountdown)/20*100)+"%"}}/></div><small>Manifesting your access key…</small></div>}</div><form className="release-form" onSubmit={startKeyGeneration}><div className="form-label"><span>KEY SCOPE</span><p className="muted">One key works across every published game/script. No selection needed.</p></div><button className="button button-light" type="submit" disabled={keyGenerating||!scripts.some(s=>s.status==="published")}>{keyGenerating?"The Void is generating…":"Generate my key · 20 seconds"} <Icon name="arrow"/></button></form>{keyGenerationError&&<p className="inline-notice">{keyGenerationError}</p>}{generatedKey&&<div className="created-key void-key-reveal"><span className="section-kicker">KEY ACQUIRED</span><code className="key-code-box">{generatedKey}</code><div className="key-action-row"><button type="button" className="button button-light" onClick={()=>void navigator.clipboard.writeText(generatedKey).then(()=>setNotice("Key copied."),()=>setNotice("Select and copy the key manually."))}>Copy key</button><button type="button" className="button button-ghost" onClick={()=>{setKeyValue(generatedKey);void verifyKeyValue(generatedKey,personalKeys.find(item=>item.key===generatedKey)?.script||"");}}>Verify key</button></div><small>Expires {new Date(personalKeys.find(k=>k.key===generatedKey)?.expires_at||Date.now()+86400000).toLocaleString()}</small></div>}</section><section className="key-verify-card"><span className="section-kicker">LIVE KEY VERIFICATION</span><h3>Verify a key</h3><form onSubmit={validateKey}><label className="form-label">ACCESS KEY<input required value={keyValue} onChange={e=>setKeyValue(e.target.value)} placeholder="VOID-XX-XXX-XXXX"/></label><button className="button button-light" type="submit">Verify key <Icon name="arrow"/></button></form>{keyResult&&<p className={keyResult.startsWith("VALID")?"success-notice":"inline-notice"}>{keyResult}</p>}</section><div className="key-history personal-key-history"><div className="panel-heading"><h3><Icon name="lock"/> Your keys</h3><span className="eyebrow-pill">{personalKeys.length}</span></div>{personalKeys.length?personalKeys.map((k)=><div className="history-row personal-key-row" key={k.key}><div><code>{k.key}</code><small>{"All games / scripts"} · {Date.parse(k.expires_at)<=Date.now()?"Expired":"Expires "+new Date(k.expires_at).toLocaleString()}</small></div><div className="key-action-row"><span className={Date.parse(k.expires_at)<=Date.now()?"key-status-expired":"key-status-active"}>{Date.parse(k.expires_at)<=Date.now()?"Expired":"Active"}</span><button type="button" className="button button-ghost button-small" onClick={()=>void navigator.clipboard.writeText(k.key)}>Copy</button><button type="button" className="button button-ghost button-small" onClick={()=>{setKeyValue(k.key);void verifyKeyValue(k.key,k.script);}}>Verify</button></div></div>):<div className="history-row"><span>No keys claimed in this browser yet.</span></div>}</div>{isAdmin&&<div className="key-history"><div className="panel-heading"><h3>Recent admin key records</h3><button className="text-button" onClick={()=>{setPage("Admin panel");setAdminTab("Key system");void loadKeys();}}>Open admin panel</button></div>{keyRecords.slice(0,8).map((k,i)=><div className="history-row" key={String(k.id||i)}><span>{String(k.key_prefix||"Key")} · {String(k.label||"Access key")}</span><small>{k.revoked_at?"Revoked":String(k.use_count||0)+" uses"}</small></div>)}</div>}</div></section>}

        {active==="Key history"&&<section className="panel"><div className="panel-heading"><div><span className="section-kicker">ACCESS EVENTS</span><h2>Key history</h2></div><button className="button button-ghost button-small" onClick={()=>{setPage("Admin panel");setAdminTab("Key system");}}>Manage keys</button></div><p className="muted">For privacy, individual key values are never stored in plain text. Administrators can view key prefixes, expiry, usage, and revocation state.</p>{notice&&<p className="inline-notice">{notice}</p>}</section>}

        {active==="Roadmap"&&<section className="panel roadmap-page"><div className="panel-heading"><div><span className="section-kicker">PUBLIC ROADMAP</span><h2>Loader games and progress</h2><p className="muted">Items below are read from the existing roadmap table.</p></div></div>{roadmap.length?roadmap.map((item,i)=><div className="roadmap-item" key={item.id}><div className="roadmap-item-top"><div><span className="roadmap-number">{String(i+1).padStart(2,"0")}</span><strong>{item.title}</strong></div><span className="roadmap-status">{item.status}</span></div><p className="muted">{item.game_name} {item.notes?"· "+item.notes:""}</p><div className="roadmap-edit"><div className="progress-track"><div style={{width:item.progress+"%"}}/></div><strong>{item.progress}%</strong></div></div>):<div className="empty-state">No public roadmap items have been added yet. Add milestones in Admin panel → Roadmap.</div>}</section>}


        {active==="API & endpoints"&&<section className="settings-grid"><div className="panel settings-panel"><span className="section-kicker">ENDPOINT HEALTH</span><h2>Script API</h2><div className="endpoint-pill"><i className={endpointStatus.startsWith("Online")?"":"endpoint-down"}/>{endpointStatus}</div><p className="muted">Health endpoint: {scriptApiUrl}?action=health</p><button className="button button-light" onClick={()=>fetch(scriptApiUrl+"?action=health",{headers:{apikey:supabasePublicKey}}).then(async r=>{const d=await r.json();setEndpointStatus(r.ok&&d.ok?"Online · API v"+d.version:"Unhealthy · "+(d.error||r.status));}).catch(()=>setEndpointStatus("Offline · could not reach API"))}>Verify endpoint</button><div className="security-list"><p>Key validation <b>POST action: validate</b></p><p>Protected source loader <b>GET action: load</b></p><p>Admin actions <b>JWT + admin role</b></p><p>Analytics <b>Cookie opt-in required</b></p></div></div><div className="panel settings-panel"><span className="section-kicker">COPYABLE SAMPLE</span><h2>Endpoint request sample</h2><textarea className="loader-output api-sample" value={apiSample} onChange={e=>setApiSample(e.target.value)}/><button className="button button-ghost" onClick={()=>void navigator.clipboard.writeText(apiSample).then(()=>setNotice("API sample copied."),()=>setNotice("Select and copy the sample manually."))}>Copy sample</button>{notice&&<p className="inline-notice">{notice}</p>}</div></section>}

        {active==="Profile"&&<section className="panel profile-panel"><div className="profile-large">{avatarUrl?<img className="avatar avatar-large avatar-image" src={avatarUrl} alt="Profile avatar"/>:<span className="avatar avatar-large">{(profileName||"V").slice(0,1).toUpperCase()}</span>}<div><span className="section-kicker">YOUR ACCOUNT</span><h2>{profileName||"Void member"}</h2><p className="muted">{userEmail||"Sign in to connect your profile"}</p></div></div>{user?<form onSubmit={saveProfile}><label className="form-label">DISPLAY NAME<input value={profileName} maxLength={60} onChange={e=>setProfileName(e.target.value)} placeholder="Your display name"/></label><label className="form-label">BIO<textarea rows={3} maxLength={280} value={profileBio} onChange={e=>setProfileBio(e.target.value)} placeholder="A little about you…"/></label><label className="form-label">AVATAR IMAGE URL<input type="url" value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} placeholder="https://…"/></label><button className="button button-light" type="submit">Save profile</button></form>:<div className="empty-state">Sign in to customize and save your profile. <button className="button button-light" onClick={()=>{setAuthMode("login");setPage("Sign in");}}>Sign in</button></div>}{notice&&<p className="inline-notice">{notice}</p>}</section>}

        {active==="Sessions"&&<section className="settings-grid"><div className="panel settings-panel"><span className="section-kicker">SESSION SECURITY</span><h2>Current session</h2><div className="session-card"><Icon name="shield"/><div><strong>{user?"Authenticated Supabase session":"Guest session"}</strong><p>{userEmail||"No user is signed in."}<br/>{session?.expires_at?"Session expires "+new Date(session.expires_at*1000).toLocaleString():"No authenticated token is active."}</p></div><span className="status status-live"><i/>{user?"Active":"Guest"}</span></div><button className="button button-ghost full-button" onClick={()=>void signOut(false)} disabled={!user}>Sign out this session</button><button className="button button-ghost full-button" onClick={()=>void signOut(true)} disabled={!user}>Sign out all sessions</button>{sessionNotice&&<p className="inline-notice">{sessionNotice}</p>}</div><div className="panel settings-panel"><span className="section-kicker">PASSWORD</span><h2>Update password</h2><form onSubmit={changePassword}><label className="form-label">NEW PASSWORD<input type="password" value={newPassword} minLength={8} onChange={e=>setNewPassword(e.target.value)} placeholder="At least 8 characters" required/></label><button className="button button-light" disabled={!user}>Update password</button></form><p className="muted">Password changes are handled by Supabase Auth.</p></div></section>}

        {active==="Settings"&&<section className="settings-grid"><div className="panel settings-panel"><span className="section-kicker">PREFERENCES</span><h2>Workspace settings</h2><label className="setting-row"><span><strong>Spotlight glow</strong><small>Ambient light behind the interface</small></span><input type="checkbox" checked={spotlight} onChange={e=>setSpotlight(e.target.checked)}/></label><label className="setting-row"><span><strong>Reduced motion</strong><small>Reduce animations and movement</small></span><input type="checkbox" checked={reducedMotion} onChange={e=>setReducedMotion(e.target.checked)}/></label><label className="setting-row"><span><strong>Release notifications</strong><small>Show workspace update notices</small></span><input type="checkbox" checked={notifications} onChange={e=>setNotifications(e.target.checked)}/></label><label className="setting-row"><span><strong>Dashboard density</strong><small>Choose preferred spacing</small></span><select value={layout} onChange={e=>setLayout(e.target.value)}><option>Comfortable</option><option>Compact</option><option>Spacious</option></select></label><button className="button button-light" onClick={()=>{localStorage.setItem("void-theme",themeId);localStorage.setItem("void-accent",accent);localStorage.setItem("void-motion",String(reducedMotion));localStorage.setItem("void-spotlight",String(spotlight));localStorage.setItem("void-layout",layout);setNotice("Settings saved on this device.");}}>Save preferences</button>{notice&&<p className="inline-notice">{notice}</p>}</div><div className="panel settings-panel"><span className="section-kicker">COOKIE CONTROLS</span><h2>Privacy choices</h2><p className="muted">Change your cookie preferences at any time. Analytics are only sent after opt-in.</p><button className="button button-ghost full-button" onClick={()=>{setCookieCustomize(true);setCookieNotice("");}}>Manage cookie preferences</button><button className="button button-ghost full-button" onClick={()=>setPage("Themes")}>Browse 35 themes</button></div></section>}

        {active==="Notifications"&&<section className="panel notifications-panel"><div className="panel-heading"><div><span className="section-kicker">ACTIVITY FEED</span><h2>Latest updates</h2></div><button className="text-button" onClick={()=>setNotifications(!notifications)}>{notifications?"Mute notices":"Enable notices"}</button></div>{notifications?<><div className="notice-row"><span className="notice-icon"><Icon name="scripts"/></span><div><strong>VOID DEVELOPMENT workspace refreshed</strong><p>The script library is connected to the published metadata table.</p><small>Workspace · Current session</small></div><span className="notice-unread"/></div><div className="notice-row"><span className="notice-icon"><Icon name="shield"/></span><div><strong>Script protection</strong><p>Public cards show a protected notice; access is verified by the key API.</p><small>Security · Current session</small></div></div><div className="notice-row"><span className="notice-icon"><Icon name="palette"/></span><div><strong>35 themes available</strong><p>Choose an accent and save your workspace look.</p><small>Appearance · Current session</small></div></div></>:<div className="empty-state">Notifications are muted.</div>}</section>}

        {active==="Activity log"&&<section className="panel"><span className="section-kicker">ACCOUNT ACTIVITY</span><h2>Recent activity</h2><div className="security-list"><p>Script library loaded<b>{scripts.length} entries</b></p><p>Authentication<b>{user?"Signed in":"Guest"}</b></p><p>API health<b>{endpointStatus}</b></p><p>Cookie analytics consent<b>{cookiePrefs?.analytics?"Enabled":"Not enabled"}</b></p></div><p className="muted">Administrative actions are recorded in the protected audit log.</p></section>}

        {active==="Community"&&<section className="panel"><span className="section-kicker">CREATOR SPACE</span><h2>Community resources</h2><p className="muted">Share releases, add YouTube showcases, and keep update notes clear for users.</p><div className="quick-action-list">{[["Browse releases","Scripts"],["Release roadmap","Roadmap"],["Read changelog","Changelog"],["Get support","Help center"]].map(([label,page])=><button className="quick-action" key={label} onClick={()=>setPage(page)}><span><strong>{label}</strong></span><Icon name="arrow"/></button>)}</div></section>}

        {active==="Changelog"&&<section className="panel"><span className="section-kicker">CHANGELOG</span><h2>Void Development updates</h2><div className="notice-row"><span className="notice-icon"><Icon name="check"/></span><div><strong>Connected auth and release data</strong><p>Login, registration, profile editing, published scripts, and admin-only release management use Supabase.</p><small>Current release</small></div></div><div className="notice-row"><span className="notice-icon"><Icon name="palette"/></span><div><strong>35 dark themes</strong><p>More accent palettes and custom accent color selection.</p><small>Current release</small></div></div><div className="notice-row"><span className="notice-icon"><Icon name="shield"/></span><div><strong>Key verification and script loader</strong><p>Existing key API remains the source of truth for validation.</p><small>Current release</small></div></div></section>}

        {active==="Help center"&&<section className="panel"><span className="section-kicker">HELP CENTER</span><h2>Quick help</h2>{[["How do I release a script?","Sign in with an account that has the admin role, open Admin panel → Lua uploads, add the source and metadata, then publish."],["How does protection work?","Public cards do not expose the source field. A generated loader calls this site's /api/scripts/load proxy, which forwards the key to your Supabase script API."],["Why can't I see admin tools?","Admin controls require an authenticated user with the admin role in public.user_roles. A profile label alone does not grant access."],["Why does analytics need consent?","Site analytics events are recorded only after you opt into analytics cookies. Essential authentication remains separate."]].map(([q,a])=><details className="help-item" key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>}

        {isAuthPage&&<section className="auth-wrap"><div className="auth-aside"><img src={logo} alt="Void Development"/><span className="section-kicker">WELCOME TO VOID DEVELOPMENT</span><h2>Your workspace.<br/><span className="gradient-title">Your next move.</span></h2><p>Sign in to save your profile, manage your releases, and access the tools allowed for your account.</p><div className="auth-trust"><Icon name="shield"/> Real Supabase authentication · protected roles</div></div><form className="panel auth-card" onSubmit={handleAuth}><span className="section-kicker">{authMode==="login"?"WELCOME BACK":"CREATE YOUR ACCOUNT"}</span><h2>{authMode==="login"?"Sign in":"Create account"}</h2><p className="muted">{authMode==="login"?"Continue to your Void Development workspace.":"Create your own account to save preferences and scripts."}</p>{authMode==="signup"&&<label className="form-label">DISPLAY NAME<input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Your name"/></label>}<label className="form-label">EMAIL ADDRESS<input type="email" autoComplete="email" value={email} required onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label className="form-label">PASSWORD<div className="password-input"><input type={showPassword?"text":"password"} autoComplete={authMode==="login"?"current-password":"new-password"} minLength={8} value={password} required onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters"/><button type="button" onClick={()=>setShowPassword(v=>!v)}>{showPassword?"Hide":"Show"}</button></div></label><button className="button button-light auth-submit" type="submit" disabled={authBusy}>{authBusy?"Please wait…":authMode==="login"?"Sign in securely":"Create account"} <Icon name="arrow"/></button><button className="button button-ghost auth-submit" type="button" disabled={authBusy} onClick={()=>void signInGoogle()}>Continue with Google</button>{authMessage&&<p className="inline-notice">{authMessage}</p>}<p className="auth-switch">{authMode==="login"?"New to Void Development?":"Already have an account?"} <button type="button" onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setAuthMessage("");}}>{authMode==="login"?"Create an account":"Sign in"}</button></p><p className="auth-disclaimer">Your credentials are handled by Supabase Auth. Do not share your password with anyone.</p></form></section>}

          {notice&&<div className="panel inline-notice">{notice}</div>}

        <footer className="footer"><div className="footer-brand"><img src={logo} alt=""/><span>Void Development<span className="brand-dot">.</span></span></div><span>BUILT FOR THE NEXT MOVE.</span><button onClick={()=>setPage("Settings")}>Workspace settings ↗</button><button onClick={()=>{setCookieCustomize(true);setCookieNotice("");}}>Cookies</button></footer>
      </main>

      {cookiePrefs===null&&<div className="cookie-backdrop"><section className="cookie-card" role="dialog" aria-modal="true" aria-labelledby="cookie-title"><div className="cookie-brand"><span className="cookie-icon"><Icon name="shield"/></span><span className="section-kicker">YOUR PRIVACY MATTERS</span></div><h2 id="cookie-title">Your data. Your call.</h2><p>Void Development uses essential storage to keep sign-in and security features working. Optional analytics help us understand visits and improve the workspace. We only record analytics after you opt in.</p><div className="cookie-choice"><span><strong>Essential</strong><small>Authentication and security · always on</small></span><span className="cookie-required">REQUIRED</span></div>{cookieCustomize&&<><label className="setting-row"><span><strong>Analytics cookies</strong><small>Allow anonymous visit counts and page events</small></span><input type="checkbox" checked={cookieAnalytics} onChange={e=>setCookieAnalytics(e.target.checked)}/></label><label className="setting-row"><span><strong>Personalization</strong><small>Remember theme and workspace preferences</small></span><input type="checkbox" checked={cookiePersonalization} onChange={e=>setCookiePersonalization(e.target.checked)}/></label></>}<button className="button button-light cookie-main" onClick={()=>chooseCookies(true,true)}>Accept all cookies <Icon name="arrow"/></button><div className="cookie-actions"><button className="button button-ghost" onClick={()=>chooseCookies(false,true)}>Essential only</button><button className="text-button" onClick={()=>cookieCustomize?chooseCookies(cookieAnalytics,cookiePersonalization):(setCookieCustomize(true),setCookieNotice(""))}>{cookieCustomize?"Save choices":"Customize"}</button></div><small className="cookie-footnote">You can change your choices anytime in Settings → Privacy choices.</small></section></div>}
      {cookiePrefs!==null&&cookieCustomize&&<div className="cookie-backdrop"><section className="cookie-card cookie-card-compact" role="dialog" aria-modal="true"><button className="cookie-close icon-button" onClick={()=>setCookieCustomize(false)} aria-label="Close cookie settings"><Icon name="close"/></button><span className="section-kicker">COOKIE PREFERENCES</span><h2>Privacy settings</h2><div className="cookie-choice"><span><strong>Essential</strong><small>Authentication and security</small></span><span className="cookie-required">REQUIRED</span></div><label className="setting-row"><span><strong>Analytics</strong><small>Anonymous page views and visits</small></span><input type="checkbox" checked={cookieAnalytics} onChange={e=>setCookieAnalytics(e.target.checked)}/></label><label className="setting-row"><span><strong>Personalization</strong><small>Remember theme choices</small></span><input type="checkbox" checked={cookiePersonalization} onChange={e=>setCookiePersonalization(e.target.checked)}/></label><button className="button button-light cookie-main" onClick={()=>chooseCookies(cookieAnalytics,cookiePersonalization)}>Save preferences</button>{cookieNotice&&<p className="inline-notice">{cookieNotice}</p>}</section></div>}
    </div>
  );
}

export default App;

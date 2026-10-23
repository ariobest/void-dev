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
  const adminTabs = ["Overview","Releases","Key system","Script protector","Lua uploads","Media library","Users","Analytics","Endpoint verification","Roadmap","Audit logs"];

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
    if(!user) { setKeyGenerationError("You must be signed in to generate a key."); return; }
    if(!scripts.some(s=>s.status==="published")) { setKeyGenerationError("No published scripts are available yet. Please try again later."); return; }
    setKeyGenerating(true); setGeneratedKey(""); setKeyGenerationError(""); setKeyCountdown(20);
    try {
      const started=await apiCall<{token:string;script:string;wait_seconds:number}>("start-key",{});
      const waitSeconds=Math.max(20,Number(started.wait_seconds)||20);
      const readyAt=Date.now()+waitSeconds*1000;
      await new Promise<void>(resolve=>{
        const tick=()=>{const left=Math.max(0,Math.ceil((readyAt-Date.now())/1000));setKeyCountdown(left);if(left===0){window.clearInterval(timer);resolve();}};
        const timer=window.setInterval(tick,200);
        tick();
      });
      const claimed=await apiCall<{ok:boolean;key:string;expires_at:string;script:string}>("claim-key",{token:started.token,script:started.script});
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
      setGeneratedAdminKeys(created);
      await loadKeys();
    } catch(error) { setNotice(messageOf(error)); }
    finally { setAdminKeyBusy(false); }
  }

  async function revokeKey(key:string) {
    try { await apiCall("revoke-key",{key}); setNotice("Key revoked."); await loadKeys(); }
    catch(error) { setNotice(messageOf(error)); }
  }

  async function loadAdminUsers() {
    try { const result=await apiCall<{users:AdminUser[]}>("list-users"); setUsers(result.users||[]); }
    catch(error) { setNotice(messageOf(error)); }
  }

  async function updateUserRole(id:string,role:string) {
    try { await apiCall("set-user-role",{user_id:id,role}); setNotice("User role updated."); await loadAdminUsers(); }
    catch(error) { setNotice(messageOf(error)); }
  }

  async function toggleUserBan(id:string,banned:boolean) {
    try { await apiCall("set-user-ban",{user_id:id,banned}); setNotice(banned?"User banned.":"User unbanned."); await loadAdminUsers(); }
    catch(error) { setNotice(messageOf(error)); }
  }

  async function loadAnalytics() {
    setAnalyticsError("");
    try { const result=await apiCall<Analytics>("admin-analytics",{days:30}); setAnalytics(result); }
    catch(error) { setAnalyticsError(messageOf(error)); }
  }

  async function loadMedia() {
    if(!user||!isAdmin) return;
    setMediaBusy(true); setMediaNotice("");
    try {
      const {data,error}=await supabase.storage.from("void-files").list(user.id,{limit:200,sortBy:{column:"created_at",order:"desc"}});
      if(error) throw error;
      const files=(data||[]).filter(item=>item.name && !item.name.endsWith("/"));
      setMediaAssets(files.map(item=>{const path=user.id+"/"+item.name;const {data:publicData}=supabase.storage.from("void-files").getPublicUrl(path);return {name:item.name,url:publicData.publicUrl,created_at:item.created_at||undefined,size:item.metadata?.size,contentType:item.metadata?.mimetype};}));
    } catch(error) { setMediaNotice(messageOf(error)); }
    finally { setMediaBusy(false); }
  }

  async function uploadMedia(e:ChangeEvent<HTMLInputElement>) {
    const file=e.target.files?.[0]; e.target.value="";
    if(!file||!user||!isAdmin) return;
    if(file.size>100*1024*1024) { setMediaNotice("Maximum upload size is 100 MB."); return; }
    setMediaBusy(true); setMediaNotice("");
    try {
      const safeName=file.name.replace(/[^a-zA-Z0-9._-]+/g,"-");
      const path=user.id+"/"+Date.now()+"-"+safeName;
      const {error}=await supabase.storage.from("void-files").upload(path,file,{contentType:file.type||undefined,upsert:false});
      if(error) throw error;
      setMediaNotice("Upload complete."); await loadMedia();
    } catch(error) { setMediaNotice(messageOf(error)); }
    finally { setMediaBusy(false); }
  }

  async function saveRelease(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setReleaseNotice("");
    if(!user||!isAdmin) { setReleaseNotice("Administrator access required."); return; }
    const slug=slugify(releaseSlug||releaseName); if(!releaseName.trim()||!slug) { setReleaseNotice("Name and a valid slug are required."); return; }
    try {
      const payload={name:releaseName.trim().slice(0,100),slug,description:releaseDescription.trim().slice(0,2000),category:releaseCategory.trim().slice(0,60),banner_url:releaseBanner.trim().slice(0,1000)||null,showcase_url:releaseVideo.trim().slice(0,1000)||null,content:releaseSource,release_status:releaseStatus,status:releaseStatus};
      if(editingScriptId) {
        const {error}=await supabase.from("scripts").update({...payload,updated_at:new Date().toISOString()}).eq("id",editingScriptId); if(error) throw error;
        setReleaseNotice("Release updated.");
      } else {
        const {error}=await supabase.from("scripts").insert(payload); if(error) throw error;
        setReleaseNotice("Release created.");
      }
      setEditingScriptId(""); setReleaseName(""); setReleaseSlug(""); setReleaseDescription(""); setReleaseBanner(""); setReleaseVideo(""); setReleaseSource(""); await refreshScripts();
    } catch(error) { setReleaseNotice(messageOf(error)); }
  }

  async function deleteRelease(id:string) {
    if(!confirm("Delete this release? This removes the script record but does not delete uploaded media.")) return;
    try { const {error}=await supabase.from("scripts").delete().eq("id",id); if(error) throw error; setNotice("Release deleted."); await refreshScripts(); }
    catch(error) { setNotice(messageOf(error)); }
  }

  async function saveProtector(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setNotice("");
    if(!user||!isAdmin) { setNotice("Administrator access required."); return; }
    const slug=protectorSlug.trim(); const content=loaderCode.trim();
    if(!slug||!content) { setNotice("Choose a published script and provide protector code."); return; }
    try { const {error}=await supabase.from("scripts").update({protector_code:content,updated_at:new Date().toISOString()}).eq("slug",slug); if(error) throw error; setNotice("Protector code saved."); }
    catch(error) { setNotice(messageOf(error)); }
  }

  async function loadAudit() {
    try { const result=await apiCall<{rows:Array<Record<string,unknown>>}>("audit-log",{limit:100}); setAuditRows(result.rows||[]); }
    catch(error) { setNotice(messageOf(error)); }
  }

  async function saveSettings() {
    localStorage.setItem("void-theme",themeId); localStorage.setItem("void-accent",accent); localStorage.setItem("void-motion",String(reducedMotion)); localStorage.setItem("void-spotlight",String(spotlight)); localStorage.setItem("void-layout",layout);
    setNotice("Settings saved on this device.");
  }

  function copyText(value:string) {
    navigator.clipboard.writeText(value).then(()=>setNotice("Copied to clipboard.")).catch(()=>setNotice("Copy failed. Select and copy manually."));
  }

  useEffect(() => {
    if(!isAdmin||active!=="Admin panel") return;
    if(adminTab==="Key system") void loadKeys();
    if(adminTab==="Users") void loadAdminUsers();
    if(adminTab==="Analytics") void loadAnalytics();
    if(adminTab==="Media library") void loadMedia();
    if(adminTab==="Audit logs") void loadAudit();
  },[active,adminTab,isAdmin]);

  useEffect(() => { document.documentElement.style.setProperty("--accent",accent); },[accent]);

  function renderAdmin() {
    if(!isAdmin) return <div className="panel"><h2>Admin access required</h2><p>Only users with the administrator role can open this panel.</p></div>;
    return <div className="admin-shell"><aside className="admin-nav"><div className="admin-nav-title">ADMIN PANEL</div>{adminTabs.map(tab=><button key={tab} className={adminTab===tab?"active":""} onClick={()=>setAdminTab(tab)}>{tab}</button>)}</aside><section className="admin-content">
      {adminTab==="Overview"&&<div className="panel-grid"><div className="panel"><span className="eyebrow">ADMIN</span><h2>Control center</h2><p>Manage releases, keys, users, media, analytics, endpoint checks, and audit logs from one protected workspace.</p></div><div className="panel"><span className="eyebrow">ENDPOINT</span><h2>{endpointStatus}</h2><p>Server-side verification is handled by the Supabase Edge Function.</p></div></div>}
      {adminTab==="Key system"&&<div className="panel"><span className="eyebrow">KEY SYSTEM</span><h2>Global key generator</h2><p>Generate keys for all published games/scripts. No game selection is required.</p><form onSubmit={createKey} className="form-grid"><label>Quantity<input type="number" min="1" max="100" value={adminKeyCount} onChange={e=>setAdminKeyCount(Number(e.target.value))}/></label><label>Expiry days<input value={adminKeyExpiryDays} onChange={e=>setAdminKeyExpiryDays(e.target.value)} placeholder="30 or blank for no expiry"/></label><label>Max uses<input value={adminKeyMaxUses} onChange={e=>setAdminKeyMaxUses(e.target.value)} placeholder="Blank = unlimited"/></label><label>Label<input value={adminKeyLabel} onChange={e=>setAdminKeyLabel(e.target.value)}/></label><div className="form-note">KEY SCOPE — Global access · works with every published game/script. No game selection needed.</div><button className="primary" disabled={adminKeyBusy}>{adminKeyBusy?"Generating…":"Generate keys"}</button></form>{generatedAdminKeys.length>0&&<div className="key-list">{generatedAdminKeys.map(item=><div className="key-row" key={item.key}><code>{item.key}</code><span>{item.script}</span><button onClick={()=>copyText(item.key)}>Copy</button></div>)}</div>}<div className="key-list">{keyRecords.map((item,index)=><div className="key-row" key={String(item.key||index)}><code>{String(item.key||"")}</code><span>{String(item.script||"All games / scripts")}</span><button onClick={()=>revokeKey(String(item.key||""))}>Revoke</button></div>)}</div></div>}
      {adminTab==="Media library"&&<div className="panel"><span className="eyebrow">MEDIA LIBRARY</span><h2>Upload images and videos</h2><p>Admin-only media storage. Uploaded files get public direct links.</p><label className="upload-box">{mediaBusy?"Uploading…":"Choose image/video"}<input type="file" accept="image/*,video/*" onChange={uploadMedia} disabled={mediaBusy}/></label>{mediaNotice&&<div className="form-note">{mediaNotice}</div>}<div className="media-grid">{mediaAssets.length===0?<div className="empty-state">No uploaded media yet. Upload your first image or video above.</div>:mediaAssets.map(item=><div className="media-card" key={item.url}><div className="media-preview">{item.contentType?.startsWith("video/")?<video src={item.url} controls/>:<img src={item.url} alt={item.name}/>}</div><strong>{item.name}</strong><input value={item.url} readOnly onFocus={e=>e.currentTarget.select()}/><div className="media-actions"><button onClick={()=>copyText(item.url)}>Copy link</button><a href={item.url} target="_blank" rel="noreferrer">Open</a></div></div>)}</div></div>}
      {adminTab!=="Overview"&&adminTab!=="Key system"&&adminTab!=="Media library"&&<div className="panel"><span className="eyebrow">{adminTab.toUpperCase()}</span><h2>{adminTab}</h2><p>Existing administration tools remain available here.</p></div>}
    </section></div>;
  }

  const page = active==="Admin panel" ? renderAdmin() : <div className="workspace"><main className="main-content">{active==="Key system"?<section className="panel"><span className="eyebrow">KEY SYSTEM</span><h1>Global access keys</h1><p>One key works across every published game/script. You must be signed in to generate a key. Generation is enforced server-side using your network IP, not a browser identifier.</p>{!user&&<div className="form-note">Sign in to generate a key.</div>}<form onSubmit={startKeyGeneration}><button className="primary" disabled={!user||keyGenerating}>{keyGenerating?(keyCountdown>0?"Preparing key… "+keyCountdown+"s":"Claiming…"):"Generate key"}</button></form>{keyGenerationError&&<div className="error-note">{keyGenerationError}</div>}{generatedKey&&<div className="generated-key"><code>{generatedKey}</code><button onClick={()=>copyText(generatedKey)}>Copy</button></div>}<form onSubmit={validateKey} className="verify-form"><input value={keyValue} onChange={e=>setKeyValue(e.target.value)} placeholder="Enter a key to verify"/><button>Verify</button></form>{keyResult&&<div className="form-note">{keyResult}</div>}</section>:<section className="panel"><h1>{active}</h1><p>Void Development workspace.</p></section>}</main></div>;

  return <div className={"app theme-"+themeId+(reducedMotion?" reduced-motion":"")} style={themeStyle}>{page}</div>;
}

export default App;

import { useCallback, useEffect, useMemo, useState, type CSSProperties, type ChangeEvent, type FormEvent } from "react";
import { createClient, type Session, type User } from "@supabase/supabase-js";
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
  const [active,setActive] = useState(() => isDedicatedProtector ? "Admin panel" : "Home");
  const [adminTab,setAdminTab] = useState(() => isDedicatedProtector ? "Script protector" : "Overview");
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
  useEffect(() => {
    if(otpCooldown<=0)return;
    const timer=window.setInterval(()=>setOtpCooldown(value=>Math.max(0,value-1)),1000);
    return ()=>window.clearInterval(timer);
  },[otpCooldown>0]);
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
  const dedicatedAuthorized = isDedicatedProtector && Boolean(user && isAdmin);
  const userEmail = user?.email||"";
  const adminTabs = ["Overview","Releases","Key system","Script protector","Lua uploads","Media library","Users","Analytics","Roadmap","Audit logs"];

  async function handleAuth(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setAuthBusy(true); setAuthMessage("");
    try {
      if(authMode==="login"&&otpPending) {
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
      if (isDedicatedProtector) setAdminTab("Script protector");
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
    e.preventDefault(); setReleaseNotice(""); setLoaderCode("");
    if(!user||!isAdmin) { setReleaseNotice("Administrator sign-in is required."); return; }
    if(!releaseName.trim()||!releaseSlug.trim()) { setReleaseNotice("Add a script name and slug."); return; }
    if(!releaseSource.trim()) { setReleaseNotice("Upload a Lua file or paste your source first."); return; }
    if(new TextEncoder().encode(releaseSource).length>10000*1024) { setReleaseNotice("Lua source is too large. Maximum size is 10,000 KB (about 10 MB)."); return; }
    const baseSlug=slugify(releaseSlug||releaseName);
    // New protected drafts use a random suffix as an unlisted loader identifier.
    const protectedSlug=editingScriptId?baseSlug:(baseSlug+"-"+crypto.randomUUID().replace(/-/g,"").slice(0,12));
    const record={name:releaseName.trim().slice(0,120),slug:protectedSlug,category:releaseCategory.trim().slice(0,80)||"Utility",description:releaseDescription.trim().slice(0,2000)||"Protected script (unpublished)",content:releaseSource,status:"draft",banner_url:releaseBanner.trim()||null,showcase_url:releaseVideo.trim()||null,release_status:"working_on",owner_id:user.id,updated_at:new Date().toISOString()};
    try {
      if(editingScriptId) {
        const {error}=await supabase.from("scripts").update(record).eq("id",editingScriptId);
        if(error)throw error;
      } else {
        const {data:existingDraft,error:lookupError}=await supabase.from("scripts").select("id").eq("slug",protectedSlug).eq("owner_id",user.id).eq("status","draft").maybeSingle();
        if(lookupError)throw lookupError;
        const saveQuery=existingDraft
          ? supabase.from("scripts").update(record).eq("id",existingDraft.id)
          : supabase.from("scripts").insert(record);
        const {error}=await saveQuery;
        if(error)throw error;
      }
      const url=window.location.origin+"/protected-load/"+encodeURIComponent(protectedSlug);
      setLoaderCode("-- Protected by Void Development\nloadstring(game:HttpGet("+JSON.stringify(url)+"))()");
      setProtectorSlug(protectedSlug);
      setReleaseNotice("Saved as an unpublished draft. It will not appear in the public script library. Keep the private loader URL secret.");
      setEditingScriptId(""); setReleaseName(""); setReleaseSlug(""); setReleaseDescription(""); setReleaseBanner(""); setReleaseVideo(""); setReleaseSource("");
      await refreshScripts(); setAdminTab("Script protector"); setActive("Admin panel");
    } catch(error) {
      const dbError = error && typeof error === "object" ? error as { code?: unknown; message?: unknown } : null;
      if (dbError?.code === "23505" || (typeof dbError?.message === "string" && /duplicate key|unique constraint/i.test(dbError.message))) {
        setReleaseNotice("That slug is already used by another script. Choose a different slug.");
      } else {
        setReleaseNotice("Protection failed: "+messageOf(error));
      }
    }
  }

  function editRelease(script:ScriptRecord) {
    setEditingScriptId(script.id);setReleaseName(script.name);setReleaseSlug(script.slug);setReleaseDescription(script.description||"");setReleaseCategory(script.category||"Utility");setReleaseBanner(script.banner_url||"");setReleaseVideo(script.showcase_url||"");setReleaseSource(script.content||"");setAdminTab("Script protector");setActive("Admin panel");setNotice("");
  }

  async function uploadLuaFile(e:ChangeEvent<HTMLInputElement>) {
    const file=e.target.files?.[0]; if(!file)return;
    if(!file.name.toLowerCase().endsWith(".lua")&&!file.name.toLowerCase().endsWith(".txt")) {setReleaseNotice("Choose a .lua or .txt source file.");return;}
    if(file.size>10000*1024) {e.target.value="";setReleaseNotice("File is too large. Maximum size is 10,000 KB (about 10 MB).");return;}
    const source=await file.text();setReleaseSource(source);setReleaseName(old=>old||file.name.replace(/\.(lua|txt)$/i,""));setReleaseSlug(old=>old||slugify(file.name.replace(/\.(lua|txt)$/i,"")));setReleaseNotice("Loaded "+file.name+" into the editor. Save it to store the source in Supabase.");
  }

  async function prepareLoader(script?:ScriptRecord) {
    const slug=script?.slug||protectorSlug;
    if(!slug) {setNotice("Protect a script first, or enter its saved slug.");return;}
    const url=window.location.origin+"/api/scripts/load?script="+encodeURIComponent(slug);
    const loader="-- Protected by Void Development\nloadstring(game:HttpGet("+JSON.stringify(url)+"))()";
    setLoaderCode(loader);setProtectorSlug(slug);setNotice("Keyless loader generated. Anyone with this URL can run the script.");
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

  function chooseCookies(analyticsAllowed:boolean,personalizationAllowed:boolean) {
    const prefs:CookiePrefs={necessary:true,analytics:analyticsAllowed,personalization:personalizationAllowed,decidedAt:new Date().toISOString()};
    writeCookie("void_cookie_consent",JSON.stringify(prefs));setCookiePrefs(prefs);setCookieNotice("Your cookie preferences have been saved.");setCookieCustomize(false);
  }

  const isAuthPage=active==="Sign in"||active==="Sign up";
  const pageTitle:Record<string,string>={"Scripts":"Explore the script library.","Saved scripts":"Your saved collection.","Releases":"Latest releases.","Script editor":"Your code workspace.","Themes":"Your look, your rules.","Script protector":"Publish without exposing source on public pages.","Lua uploads":"Release management.","Key system":"Access verification.","Key history":"Key activity.","Roadmap":"What we’re building.","Notifications":"Updates from Void Development.","Analytics":"Real traffic, not demo numbers.","API & endpoints":"Verify the services powering your workspace.","Activity log":"Your recent workspace activity.","Community":"The creator space.","Changelog":"Product updates.","Help center":"Guides and support.","Profile":"Make your profile yours.","Sessions":"Account security.","Settings":"Workspace preferences.","Admin panel":"Manage users, releases, keys, and protection."};

  return (
    <div className={"app theme-"+themeId+(reducedMotion?" reduce-motion":"")+(spotlight?" spotlight-on":"")+(isDedicatedProtector?" dedicated-protector":"")+(dedicatedAuthorized?" dedicated-authorized":"")} style={themeStyle}>
      <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
      {!isDedicatedProtector&&<header className="topbar">
        <button className="brand" onClick={()=>setPage("Home")} aria-label="Void Development home"><img src={logo} alt="Void Development logo"/><span className="brand-word">Void Development<span className="brand-dot">.</span></span></button>
        <div className="topbar-right"><span className="system-status"><i/> {endpointStatus.startsWith("Online")?"API online":"Workspace"}</span><button className="icon-button notification-button" onClick={()=>setPage("Notifications")} aria-label="Notifications"><Icon name="bell"/><span className="notification-dot"/></button>{user?<button className="profile-chip" onClick={()=>setPage("Profile")}><span className="avatar">{(profileName||userEmail||"V").slice(0,1).toUpperCase()}</span><span>{profileName||userEmail}</span></button>:<button className="button button-light top-login" onClick={()=>{setAuthMode("login");setPage("Sign in");}}>Sign in <Icon name="arrow"/></button>}<button className={"menu-trigger"+(navOpen?" menu-active":"")} onClick={()=>setNavOpen(v=>!v)} aria-expanded={navOpen}><Icon name="menu"/> <span>Navigate</span></button></div>
      </header>}

      {!isDedicatedProtector&&navOpen&&<><button className="nav-scrim" aria-label="Close navigation" onClick={()=>setNavOpen(false)}/><aside className="nav-drawer"><div className="drawer-heading"><span>VOID DEVELOPMENT · NAVIGATION</span><button className="icon-button" onClick={()=>setNavOpen(false)}><Icon name="close"/></button></div><div className="drawer-links">{navItems.filter(([label])=>!["Script protector","Lua uploads"].includes(label)&&(label!=="Admin panel"||isAdmin)).map(([label,icon])=><button key={label} className={active===label?"drawer-link selected":"drawer-link"} onClick={()=>setPage(label)}><Icon name={icon}/><span>{label}</span>{label==="Themes"&&<span className="drawer-count">35</span>}{label==="Admin panel"&&<span className="admin-label">ADMIN</span>}</button>)}</div><div className="drawer-bottom"><div className="drawer-user"><span className="avatar">{user?(profileName||userEmail||"V").slice(0,1).toUpperCase():"V"}</span><div><strong>{user?profileName||userEmail:"Guest session"}</strong><small>{user?(isAdmin?"Administrator":"Authenticated member"):"Sign in to sync your workspace"}</small></div></div>{user?<button className="drawer-link" onClick={()=>void signOut()}><Icon name="lock"/> Sign out</button>:<button className="drawer-link" onClick={()=>{setAuthMode("login");setPage("Sign in");}}><Icon name="profile"/> Sign in / Sign up</button>}</div></aside></>}

      <main className={"main-shell"+(isDedicatedProtector?" main-shell-dedicated":"")}>
        {isDedicatedProtector&&(!user||!isAdmin)&&active!=="Sign in"&&<section className="dedicated-access-wall panel"><img src={logo} alt="Void Development logo"/><span className="section-kicker">RESTRICTED ADMIN WORKSPACE</span><h1>{user?"Administrator access required":"Sign in to continue"}</h1><p>{user?"This dashboard is limited to accounts with the server-verified admin role. Your account does not have that permission.":"The protected-script dashboard is private. Sign in with your Void Development administrator account to continue."}</p>{user?<button className="button button-ghost" onClick={()=>void signOut()}>Sign out</button>:<button className="button button-light" onClick={()=>{setAuthMode("login");setPage("Sign in");}}>Administrator sign in <Icon name="arrow"/></button>}</section>}
        {active==="Home"&&<section className="hero"><div className="eyebrow"><span className="eyebrow-line"/> SCRIPT MANAGEMENT PLATFORM <span className="eyebrow-pill">VOID DEVELOPMENT</span></div><h1 className="hero-title">Build. Protect. Release.<br/><span className="gradient-title">Your next move starts here.</span></h1><p className="hero-subtitle">A polished workspace for your Lua releases, key verification, and creator tools.<br className="desktop-break"/> One place to manage the entire release flow.</p><div className="hero-actions"><button className="button button-light" onClick={()=>setPage("Scripts")}>Explore Scripts <Icon name="arrow"/></button></div><div className="hero-meta"><span><i className="live-pulse"/> {endpointStatus.toUpperCase()}</span><span className="meta-separator">/</span><span>35 DARK THEMES</span><span className="meta-separator">/</span><span>RESPONSIVE WORKSPACE</span></div></section>}
        {! ["Home","Admin panel"].includes(active)&&!isAuthPage&&<section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> VOID DEVELOPMENT WORKSPACE</div><h1>{pageTitle[active]||active}</h1><p>{active==="Script protector"?"Keep source out of public-facing script cards and generate your site-specific loader.":active==="Analytics"?"Numbers come from recorded, consented visits in your database.":active==="Profile"?"Your public profile details and preferences.":"Connected to your existing Void Development workspace."}</p></div><button className="button button-ghost" onClick={()=>setPage("Home")}>← Home</button></section>}

        {(active==="Home"||active==="Scripts"||active==="Saved scripts"||active==="Releases")&&<><section className="stats-grid"><div className="stat-card"><div className="stat-top"><span>PUBLISHED SCRIPTS</span><span className="stat-icon"><Icon name="scripts"/></span></div><strong>{scripts.filter(s=>s.status==="published").length.toString().padStart(2,"0")}</strong><small>From the connected script library</small></div><div className="stat-card"><div className="stat-top"><span>YOUR SAVED</span><span className="stat-icon"><Icon name="saved"/></span></div><strong>{saved.length.toString().padStart(2,"0")}</strong><small>Saved in this browser</small></div><div className="stat-card"><div className="stat-top"><span>ROADMAP</span><span className="stat-icon"><Icon name="roadmap"/></span></div><strong>{roadmap.filter(r=>r.progress===100).length}/{roadmap.length}</strong><small>Public milestones</small></div><div className="stat-card"><div className="stat-top"><span>AUTH STATUS</span><span className="stat-icon"><Icon name="shield"/></span></div><strong className="stat-live">{user?"CONNECTED":"GUEST"}</strong><small>{user?userEmail:"Sign in to sync your account"}</small></div></section>
          <section className="section-block"><div className="section-heading"><div><span className="section-kicker">VOID LIBRARY</span><h2>{active==="Saved scripts"?"Saved scripts":active==="Releases"?"Latest releases":active==="Scripts"?"Published scripts":"Featured scripts"}</h2></div><div className="section-tools"><label className="search-box"><Icon name="search"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search scripts..."/></label>{active==="Home"&&<button className="text-button" onClick={()=>setPage("Scripts")}>View all <Icon name="arrow"/></button>}</div></div>
            {scriptsBusy?<div className="empty-state">Loading scripts from Supabase…</div>:scriptError?<div className="empty-state">Could not load scripts: {scriptError}<button className="text-button" onClick={()=>void refreshScripts()}>Retry</button></div>:<div className="script-grid">{visibleScripts.filter(s=>active!=="Home"||s.is_featured||true).map(script=><article className="script-card" key={script.id}>{script.banner_url&&<img className="release-banner" src={script.banner_url} alt={script.name+" banner"} loading="lazy"/>}<div className="script-card-top"><span className="script-symbol">{"</>"}</span><span className={"status status-"+(script.status||"published").replace(/ /g,"-")}><i/>{script.status||"published"}</span></div><h3>{script.name}</h3><p>{script.description||"A Void Development release."}</p><div className="script-game"><span>SLUG / CATEGORY</span><strong>{script.slug} · {script.category||"Utility"}</strong></div>{script.showcase_url&&<a className="video-link" href={script.showcase_url} target="_blank" rel="noreferrer">▶ Watch showcase <Icon name="arrow"/></a>}<div className="protected-card"><Icon name="shield"/><strong>THIS SCRIPT IS PROTECTED BY VOID DEVELOPMENT</strong><small>Source is not shown in the public library.</small></div><div className="script-card-footer"><span className="updated">{script.view_count||0} views</span><div className="script-actions"><button className={saved.includes(script.slug)?"icon-button is-saved":"icon-button"} onClick={()=>setSaved(old=>old.includes(script.slug)?old.filter(s=>s!==script.slug):[...old,script.slug])} aria-label="Save script"><Icon name="saved"/></button><button className="button button-small" onClick={()=>setSelectedScript(script)}>View details <Icon name="arrow"/></button></div></div></article>)}{visibleScripts.length===0&&<div className="empty-state">No scripts found. Published releases will appear here after an administrator publishes them.</div>}</div>}</section>
          {active==="Home"&&<section className="lower-grid"><div className="panel roadmap-preview"><div className="panel-heading"><div><span className="section-kicker">IN DEVELOPMENT</span><h2>Roadmap preview</h2></div><button className="icon-button" onClick={()=>setPage("Roadmap")} aria-label="View roadmap"><Icon name="arrow"/></button></div>{roadmap.slice(0,4).map(item=><div className="roadmap-row" key={item.id}><div className="roadmap-label"><strong>{item.title}</strong><span>{item.progress}%</span></div><div className="progress-track"><div style={{width:item.progress+"%"}}/></div></div>)}<button className="text-button roadmap-link" onClick={()=>setPage("Roadmap")}>Open roadmap <Icon name="arrow"/></button></div><div className="panel quick-panel"><span className="section-kicker">QUICK ACTIONS</span><h2>Pick up where you left off.</h2><p>Jump into protection, release management, or workspace personalization.</p>{[["Script protector","Protect a release and generate a loader","shield"],["Themes","Choose from 35 dark themes","palette"],["Profile","Customize your public profile","profile"]].map(([page,desc,icon])=><button className="quick-action" key={page} onClick={()=>setPage(page)}><span className="quick-icon"><Icon name={icon}/></span><span><strong>{page}</strong><small>{desc}</small></span><Icon name="arrow"/></button>)}</div></section>}</>}

        {active==="Themes"&&<section className="panel theme-gallery"><div className="panel-heading"><div><span className="section-kicker">35 COLORWAYS</span><h2>Choose your workspace theme</h2><p className="muted">Every theme keeps the interface dark and uses its color as a subtle accent.</p></div><span className="eyebrow-pill">{themes.length} THEMES</span></div><div className="theme-options theme-gallery-grid">{themes.map(t=><button key={t[0]} className={themeId===t[0]?"theme-option theme-selected":"theme-option"} onClick={()=>{setThemeId(t[0]);setAccent(t[2]);}}><span className="theme-swatch" style={{background:t[2],boxShadow:"0 0 16px "+t[2]+"33"}}/><span>{t[1]}</span>{themeId===t[0]&&<Icon name="check"/>}</button>)}</div><label className="setting-row"><span><strong>Custom accent</strong><small>Pick any color for the active theme</small></span><input type="color" value={accent} onChange={e=>setAccent(e.target.value)}/></label><button className="button button-light" onClick={()=>{try{localStorage.setItem("void-theme",themeId);localStorage.setItem("void-accent",accent);setNotice("Theme saved on this device.");}catch{setNotice("Could not save this theme on the device.");}}}>Save theme</button>{notice&&<p className="inline-notice">{notice}</p>}</section>}

        {active==="Script editor"&&<section className="editor-panel panel"><div className="editor-toolbar"><div className="editor-file"><span className="file-dot"/><input value={editorName} onChange={e=>setEditorName(e.target.value)} aria-label="File name"/></div><div className="editor-buttons"><span className="language-badge">LUA</span><button className="button button-ghost button-small" onClick={()=>setEditorCode("")}>Clear</button><button className="button button-light button-small" onClick={()=>{void navigator.clipboard.writeText(editorCode).then(()=>setNotice("Code copied."),()=>setNotice("Select the text and copy it manually."));}}>Copy code ↗</button></div></div><textarea className="code-editor" spellCheck={false} value={editorCode} onChange={e=>setEditorCode(e.target.value)} aria-label="Lua code editor"/><div className="editor-footer"><span><i className="live-pulse"/> Editor ready · {editorCode.split("\n").length} lines</span><span>Lua · UTF-8</span></div>{notice&&<p className="inline-notice">{notice}</p>}<div className="editor-note"><Icon name="shield"/><p><strong>Protected release workflow</strong><br/>Source saved here stays in your editor until you upload it. To publish source for a Roblox client loader, remember that client-executed code can be inspected by the client that receives it.</p></div></section>}

        {active==="Admin panel"&&<section className="admin-layout"><aside className="admin-sidebar panel"><div className="admin-brand"><span className="admin-mark"><Icon name="admin"/></span><div><strong>VOID CONTROL</strong><small>ADMINISTRATION</small></div></div><span className="section-kicker">MANAGEMENT</span>{adminTabs.map((tab)=><button key={tab} className={adminTab===tab?"admin-side-active":""} onClick={()=>{setAdminTab(tab);setNotice("");if(tab==="Users")void loadAdminUsers();if(tab==="Analytics")void loadAnalytics();if(tab==="Media library")void loadMedia();if(tab==="Key system")void loadKeys();if(tab==="Audit logs")void loadAudit();if(tab==="Releases"||tab==="Script protector")void refreshScripts();}}><Icon name={tab==="Overview"?"home":tab==="Releases"?"release":tab==="Key system"?"keys":tab==="Script protector"?"shield":tab==="Lua uploads"?"upload":tab==="Media library"?"media":tab==="Users"?"users":tab==="Analytics"?"chart":tab==="Endpoint verification"?"api":tab==="Roadmap"?"roadmap":"activity"}/>{tab}</button>)}<div className="admin-warning"><Icon name="shield"/><p>Server-verified admin role required for all privileged actions.</p></div></aside><div className="admin-content">
          {isAdmin&&active==="Admin panel"&&adminTab==="Script protector"&&<section className="protector-grid"><div className="panel settings-panel"><span className="section-kicker">SCRIPT PROTECTOR</span><h2>Protect a Lua script</h2><p className="muted">Upload or paste source and protect it directly. It is saved as unpublished and does not require a release, banner, or key.</p><form className="release-form" onSubmit={saveRelease}><label className="form-label">SCRIPT NAME<input required value={releaseName} onChange={e=>{setReleaseName(e.target.value);if(!releaseSlug)setReleaseSlug(slugify(e.target.value));}} placeholder="My script"/></label><label className="form-label">SCRIPT SLUG<input required value={releaseSlug} onChange={e=>setReleaseSlug(slugify(e.target.value))} placeholder="my-script"/></label><label className="form-label">LUA SOURCE FILE<input type="file" accept=".lua,.txt,text/plain" onChange={e=>void uploadLuaFile(e)}/></label><label className="form-label">SOURCE CODE<textarea className="source-textarea" value={releaseSource} onChange={e=>setReleaseSource(e.target.value)} rows={10} maxLength={10240000} placeholder="Paste Lua source here (max 10,000 KB)…"/><small className="muted">Maximum source/file size: 10,000 KB (about 10 MB).</small></label><button className="button button-light" type="submit" disabled={!user||!isAdmin}>Protect Script <Icon name="shield"/></button>{!isAdmin&&<p className="muted">Sign in with an administrator account to protect scripts.</p>}{releaseNotice&&<p className="inline-notice">{releaseNotice}</p>}</form></div><div className="panel settings-panel"><span className="section-kicker">GENERATED LOADER</span><h2>Protected loader</h2><p className="muted">The script stays a draft and is excluded from the public library. Keep the generated URL private.</p><label className="form-label">SAVED SCRIPT SLUG<input value={protectorSlug} onChange={e=>setProtectorSlug(slugify(e.target.value))} placeholder="my-script"/></label><button className="button button-light" type="button" onClick={()=>void prepareLoader()}>Generate loadstring</button><textarea className="loader-output" readOnly value={loaderCode} placeholder="Protect a script to generate the loadstring…"/><button className="button button-ghost" disabled={!loaderCode} onClick={()=>void navigator.clipboard.writeText(loaderCode).then(()=>setNotice("Loadstring copied."),()=>setNotice("Copy the loadstring manually."))}>Copy loadstring</button><div className="protected-card protected-card-large"><Icon name="shield"/><strong>THIS SCRIPT IS PROTECTED BY VOID DEVELOPMENT</strong><small>Client-executed source can still be inspected by the client that receives it.</small></div>{notice&&<p className="inline-notice">{notice}</p>}</div></section>}

          {isAdmin&&active==="Admin panel"&&adminTab==="Script protector"&&<details className="recent-protects-dropdown"><summary><span><Icon name="history"/> Recent protects</span><span className="recent-protects-count">{scripts.filter(s=>s.status==="draft"||s.release_status==="working_on").length}</span></summary><div className="recent-protects-list">{scripts.filter(s=>s.status==="draft"||s.release_status==="working_on").sort((a,b)=>new Date(b.updated_at||b.created_at||0).getTime()-new Date(a.updated_at||a.created_at||0).getTime()).slice(0,10).map(script=><button type="button" className="recent-protect-row" key={script.id} onClick={()=>editRelease(script)}><span className="recent-protect-icon"><Icon name="shield"/></span><span className="recent-protect-info"><strong>{script.name}</strong><small>{script.slug} · {script.updated_at?new Date(script.updated_at).toLocaleString():script.created_at?new Date(script.created_at).toLocaleString():"Date unavailable"}</small></span><span className="recent-protect-edit">Edit ↗</span></button>)}{scripts.filter(s=>s.status==="draft"||s.release_status==="working_on").length===0&&<p className="muted recent-protect-empty">No protected drafts yet. Protect your first Lua script above.</p>}</div></details>}

          {adminTab==="Overview"&&<><div className="admin-overview-grid"><div className="stat-card"><span className="section-kicker">SCRIPTS</span><strong>{scripts.length}</strong><small>Connected database</small></div><div className="stat-card"><span className="section-kicker">ADMIN ROLE</span><strong>{isAdmin?"ACTIVE":"DENIED"}</strong><small>Verified through user_roles</small></div><div className="stat-card"><span className="section-kicker">API STATUS</span><strong className="stat-live">{endpointStatus.startsWith("Online")?"ONLINE":"CHECK"}</strong><small>Live health check</small></div></div><div className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">ADMIN SHORTCUTS</span><h2>Control room</h2></div></div>{[["Releases","Publish scripts, banners, and YouTube showcases."],["Key system","Create, inspect, and revoke keys."],["Lua uploads","Upload source and generate site-specific loaders."],["Users","Review registered emails and manage account access."],["Analytics","View consented real traffic events."],["Endpoint verification","Check the health endpoint and copy API samples."]].map(([tab,desc])=><button className="quick-action" key={tab} onClick={()=>{setAdminTab(tab);if(tab==="Users")void loadAdminUsers();if(tab==="Analytics")void loadAnalytics();if(tab==="Media library")void loadMedia();if(tab==="Key system")void loadKeys();}}><span><strong>{tab}</strong><small>{desc}</small></span><Icon name="arrow"/></button>)}</div></>}
          {adminTab==="Releases"&&<div className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">PUBLISHING</span><h2>Script releases</h2></div><button className="button button-light button-small" onClick={()=>{setEditingScriptId("");setReleaseName("");setReleaseSlug("");setReleaseDescription("");setReleaseSource("");setReleaseBanner("");setReleaseVideo("");setAdminTab("Script protector");}}>New release +</button></div>{scripts.map(s=><div className="admin-script-row" key={s.id}>{s.banner_url?<img className="admin-banner-thumb" src={s.banner_url} alt=""/>:<span className="script-symbol">{"</>"}</span>}<div className="admin-script-name"><strong>{s.name}</strong><small>{s.slug} · {s.status||"published"}</small></div><button className="button button-ghost button-small" onClick={()=>editRelease(s)}>Edit</button></div>)}{scripts.length===0&&<p className="muted">No script records found.</p>}</div>}
          {adminTab==="Key system"&&<><div className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">KEY CONTROL</span><h2>Generate keys</h2><p className="muted">Generate 1–100 keys per batch. Blank expiry or usage limit means unlimited.</p></div><button className="button button-ghost button-small" onClick={()=>void loadKeys()}>Refresh keys</button></div><form className="release-form" onSubmit={createKey}><div className="form-label"><span>KEY SCOPE</span><p className="muted">Global access · works with every published game/script. No game selection needed.</p></div><div className="two-fields"><label className="form-label">NUMBER OF KEYS<input type="number" min={1} max={100} step={1} required value={adminKeyCount} onChange={e=>setAdminKeyCount(Number(e.target.value))}/></label><label className="form-label">EXPIRY IN DAYS<input type="number" min={1} max={3650} value={adminKeyExpiryDays} onChange={e=>setAdminKeyExpiryDays(e.target.value)} placeholder="Blank = never expires"/></label></div><div className="two-fields"><label className="form-label">MAX USES PER KEY<input type="number" min={1} max={1000000} value={adminKeyMaxUses} onChange={e=>setAdminKeyMaxUses(e.target.value)} placeholder="Blank = unlimited"/></label><label className="form-label">KEY LABEL<input value={adminKeyLabel} maxLength={80} onChange={e=>setAdminKeyLabel(e.target.value)} placeholder="Key label"/></label></div><button className="button button-light" disabled={adminKeyBusy||!isAdmin}>{adminKeyBusy?"Generating keys…":"Generate "+Math.max(1,Math.min(100,adminKeyCount||1))+" key"+(adminKeyCount===1?"":"s")}</button></form>{generatedAdminKeys.length>0&&<div className="created-key admin-created-keys"><div className="panel-heading"><strong>New keys · copy them now</strong><button type="button" className="button button-ghost button-small" onClick={()=>void navigator.clipboard.writeText(generatedAdminKeys.map(k=>k.key).join("\n")).then(()=>setNotice("All generated keys copied."),()=>setNotice("Select and copy the keys manually."))}>Copy all</button></div>{generatedAdminKeys.map((k)=><div className="generated-key-row" key={k.key}><div><code>{k.key}</code><small>{k.script} · {k.expires_at?"Expires "+new Date(k.expires_at).toLocaleString():"No expiry"} · {k.label}</small></div><button type="button" className="button button-ghost button-small" onClick={()=>void navigator.clipboard.writeText(k.key)}>Copy</button></div>)}</div>}{notice&&<p className="inline-notice">{notice}</p>}</div><div className="panel admin-table-panel"><div className="panel-heading"><h2>Issued keys</h2><button className="button button-ghost button-small" onClick={()=>void loadKeys()}>Refresh</button></div>{keyRecords.length===0?<p className="muted">No keys loaded.</p>:<div className="admin-key-list">{keyRecords.map((row,index)=><div className="admin-key-row" key={String(row.id||row.key||index)}><div><code>{String(row.key||"—")}</code><small>{String(row.script||"Global")} · {row.expires_at?"Expires "+new Date(String(row.expires_at)).toLocaleString():"No expiry"} · {row.revoked_at?"REVOKED":"ACTIVE"}</small></div>{Boolean(row.id)&&<button className="button button-ghost button-small" onClick={()=>void revokeKey(String(row.id))}>Revoke</button>}</div>)}</div>}</div></>}
          {adminTab==="Lua uploads"&&<section className="panel settings-panel"><span className="section-kicker">SOURCE WORKFLOW</span><h2>Lua uploads</h2><p className="muted">Use the Script protector to keep source unpublished while generating the private loader.</p><button className="button button-light" onClick={()=>setAdminTab("Script protector")}>Open Script protector <Icon name="arrow"/></button></section>}
          {adminTab==="Media library"&&<section className="panel settings-panel"><div className="panel-heading"><div><span className="section-kicker">MEDIA</span><h2>Media library</h2><p className="muted">Upload images and videos to the connected public storage bucket.</p></div><button className="button button-ghost button-small" onClick={()=>void loadMedia()}>Refresh</button></div><label className="button button-light media-upload-label">Upload media<input type="file" accept="image/*,video/*" onChange={e=>void uploadMediaFile(e)} hidden/></label>{mediaBusy&&<p className="muted">Working…</p>}{mediaNotice&&<p className="inline-notice">{mediaNotice}</p>}<div className="media-grid">{mediaAssets.map(asset=><article className="media-card" key={asset.url}>{asset.contentType?.startsWith("video/")?<video src={asset.url} controls/>:<img src={asset.url} alt={asset.name}/>}<div><strong>{asset.name}</strong><small>{asset.size?Math.round(asset.size/1024)+" KB":"Size unavailable"}</small><button className="text-button" onClick={()=>void navigator.clipboard.writeText(asset.url).then(()=>setNotice("Media URL copied."),()=>setNotice("Copy the media URL manually."))}>Copy URL</button></div></article>)}</div></section>}
          {adminTab==="Users"&&<section className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">USER MANAGEMENT</span><h2>Accounts</h2></div><label className="search-box"><Icon name="search"/><input value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="Search email or username..."/></label></div>{users.filter(target=>(target.email+" "+(target.profile?.username||"")+" "+(target.profile?.display_name||"")).toLowerCase().includes(userSearch.toLowerCase())).map(target=><div className="admin-user-row" key={target.id}><div><strong>{target.profile?.display_name||target.profile?.username||target.email}</strong><small>{target.email} · {target.roles.join(", ")||"user"}</small></div><div className="admin-user-actions"><button className="button button-ghost button-small" onClick={()=>void updateAdminUser(target,{role:target.roles.includes("admin")?"user":"admin"})}>{target.roles.includes("admin")?"Remove admin":"Make admin"}</button><button className="button button-ghost button-small" onClick={()=>void updateAdminUser(target,{banned:!target.banned_until})}>{target.banned_until?"Unban":"Ban"}</button></div></div>)}{users.length===0&&<p className="muted">Load users to review accounts.</p>}</section>}
          {adminTab==="Analytics"&&<section className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">ANALYTICS</span><h2>Traffic overview</h2></div><button className="button button-ghost button-small" onClick={()=>void loadAnalytics()}>Refresh</button></div>{analyticsError&&<p className="inline-notice">{analyticsError}</p>}{analytics?<div className="analytics-grid"><div className="stat-card"><span className="section-kicker">USERS</span><strong>{analytics.totalUsers}</strong><small>Window: {analytics.periodDays} days</small></div><div className="stat-card"><span className="section-kicker">EVENTS</span><strong>{analytics.events}</strong><small>Recorded events</small></div><div className="stat-card"><span className="section-kicker">VISITORS</span><strong>{analytics.uniqueVisitors}</strong><small>Unique sessions</small></div><div className="stat-card"><span className="section-kicker">TODAY</span><strong>{analytics.todayViews}</strong><small>{analytics.todayVisitors} visitors</small></div></div>:<p className="muted">Load analytics to view consented traffic.</p>}</section>}
          {adminTab==="Roadmap"&&<section className="panel settings-panel"><span className="section-kicker">ROADMAP</span><h2>Public roadmap</h2><p className="muted">The public roadmap is managed in the connected database. This dashboard reads the published milestones.</p>{roadmap.map(item=><div className="roadmap-row" key={item.id}><div className="roadmap-label"><strong>{item.title}</strong><span>{item.progress}% · {item.status}</span></div><div className="progress-track"><div style={{width:item.progress+"%"}}/></div><small className="muted">{item.game_name} · {item.notes}</small></div>)}</section>}
          {adminTab==="Audit logs"&&<section className="panel admin-table-panel"><div className="panel-heading"><div><span className="section-kicker">AUDIT</span><h2>Recent admin activity</h2></div><button className="button button-ghost button-small" onClick={()=>void loadAudit()}>Refresh</button></div>{auditRows.length===0?<p className="muted">Load the audit log to view recent events.</p>:<div className="audit-list">{auditRows.map((row,index)=><div className="audit-row" key={String(row.id||index)}><div><strong>{String(row.action||"Action")}</strong><small>{String(row.target_type||"")} · {String(row.target_id||"")}</small></div><span>{row.created_at?new Date(String(row.created_at)).toLocaleString():""}</span></div>)}</div>}</section>}
        </div></section>}

        {active==="Roadmap"&&<section className="panel roadmap-page"><span className="section-kicker">ROADMAP</span><h2>What we’re building</h2><p className="muted">Public milestones pulled from the connected Void Development roadmap.</p><div className="roadmap-page-list">{roadmap.map(item=><article className="roadmap-item" key={item.id}><div className="roadmap-label"><strong>{item.title}</strong><span>{item.progress}%</span></div><div className="progress-track"><div style={{width:item.progress+"%"}}/></div><p>{item.game_name} · {item.status}</p><small>{item.notes}</small></article>)}{roadmap.length===0&&<p className="muted">No public roadmap items are available yet.</p>}</div></section>}
        {active==="Notifications"&&<section className="panel"><span className="section-kicker">NOTIFICATIONS</span><h2>Workspace updates</h2><div className="notice-row"><span className="notice-icon"><Icon name="check"/></span><div><strong>Authentication is connected</strong><p>Sign-in and registration are handled by Supabase Auth.</p></div></div><div className="notice-row"><span className="notice-icon"><Icon name="shield"/></span><div><strong>Protected releases stay unpublished</strong><p>Protected drafts are excluded from the public script library.</p></div></div></section>}
        {active==="API & endpoints"&&<section className="panel api-panel"><span className="section-kicker">API & ENDPOINTS</span><h2>Connected services</h2><p className="muted">The workspace uses the configured Supabase Edge Function as its API source of truth.</p><div className="endpoint-card"><span className="live-dot"/><strong>{endpointStatus}</strong><small>{scriptApiUrl}</small></div><label className="form-label">API SAMPLE<textarea className="code-editor api-sample" readOnly value={apiSample}/></label></section>}
        {active==="Activity log"&&<section className="panel"><span className="section-kicker">ACCOUNT ACTIVITY</span><h2>Recent activity</h2><div className="security-list"><p>Script library loaded<b>{scripts.length} entries</b></p><p>Authentication<b>{user?"Signed in":"Guest"}</b></p><p>API health<b>{endpointStatus}</b></p><p>Cookie analytics consent<b>{cookiePrefs?.analytics?"Enabled":"Not enabled"}</b></p></div><p className="muted">Administrative actions are recorded in the protected audit log.</p></section>}
        {active==="Community"&&<section className="panel"><span className="section-kicker">CREATOR SPACE</span><h2>Community resources</h2><p className="muted">Share releases, add YouTube showcases, and keep update notes clear for users.</p><div className="quick-action-list">{[["Browse releases","Scripts"],["Release roadmap","Roadmap"],["Read changelog","Changelog"],["Get support","Help center"]].map(([label,page])=><button className="quick-action" key={label} onClick={()=>setPage(page)}><span><strong>{label}</strong></span><Icon name="arrow"/></button>)}</div></section>}
        {active==="Changelog"&&<section className="panel"><span className="section-kicker">CHANGELOG</span><h2>Void Development updates</h2><div className="notice-row"><span className="notice-icon"><Icon name="check"/></span><div><strong>Connected auth and release data</strong><p>Login, registration, profile editing, published scripts, and admin-only release management use Supabase.</p><small>Current release</small></div></div><div className="notice-row"><span className="notice-icon"><Icon name="palette"/></span><div><strong>35 dark themes</strong><p>More accent palettes and custom accent color selection.</p><small>Current release</small></div></div><div className="notice-row"><span className="notice-icon"><Icon name="shield"/></span><div><strong>Key verification and script loader</strong><p>Existing key API remains the source of truth for validation.</p><small>Current release</small></div></div></section>}
        {active==="Help center"&&<section className="panel"><span className="section-kicker">HELP CENTER</span><h2>Quick help</h2>{[["How do I release a script?","Sign in with an account that has the admin role, open Admin panel → Lua uploads, add the source and metadata, then publish."],["How does protection work?","Public cards do not expose the source field. A generated loader calls this site's /api/scripts/load proxy, which forwards the key to your Supabase script API."],["Why can't I see admin tools?","Admin controls require an authenticated user with the admin role in public.user_roles. A profile label alone does not grant access."],["Why does analytics need consent?","Site analytics events are recorded only after you opt into analytics cookies. Essential authentication remains separate."]].map(([q,a])=><details className="help-item" key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>}

        {active==="Profile"&&<section className="panel settings-panel"><span className="section-kicker">PROFILE</span><h2>Your profile</h2><p className="muted">Update the public details stored for your account.</p>{user?<form className="release-form" onSubmit={saveProfile}><label className="form-label">DISPLAY NAME<input value={profileName} onChange={e=>setProfileName(e.target.value)} placeholder="Your name"/></label><label className="form-label">BIO<textarea value={profileBio} onChange={e=>setProfileBio(e.target.value)} maxLength={280} rows={5} placeholder="Tell people what you build…"/></label><label className="form-label">AVATAR URL<input value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} placeholder="https://…"/></label><button className="button button-light" type="submit">Save profile <Icon name="check"/></button>{notice&&<p className="inline-notice">{notice}</p>}</form>:<p className="muted">Sign in to edit your profile.</p>}</section>}
        {active==="Sessions"&&<section className="panel settings-panel"><span className="section-kicker">ACCOUNT SECURITY</span><h2>Sessions & password</h2><p className="muted">Supabase Auth controls your active session. You can sign out locally or from all sessions supported by the provider.</p>{user?<><div className="security-list"><p>Signed in as<b>{userEmail}</b></p><p>Admin role<b>{isAdmin?"Active":"Standard member"}</b></p></div><form className="release-form" onSubmit={changePassword}><label className="form-label">NEW PASSWORD<input type="password" minLength={8} value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="At least 8 characters"/></label><button className="button button-light" type="submit">Update password</button></form><div className="button-row"><button className="button button-ghost" onClick={()=>void signOut()}>Sign out</button><button className="button button-ghost" onClick={()=>void signOut(true)}>Sign out everywhere</button></div>{sessionNotice&&<p className="inline-notice">{sessionNotice}</p>}</>:<p className="muted">No authenticated session is active.</p>}</section>}
        {active==="Settings"&&<section className="panel settings-panel"><span className="section-kicker">WORKSPACE SETTINGS</span><h2>Preferences</h2><div className="setting-row"><span><strong>Reduced motion</strong><small>Minimize interface animations.</small></span><input type="checkbox" checked={reducedMotion} onChange={e=>{setReducedMotion(e.target.checked);try{localStorage.setItem("void-motion",String(e.target.checked));}catch{}}}/></div><div className="setting-row"><span><strong>Spotlight effects</strong><small>Keep the ambient workspace glow enabled.</small></span><input type="checkbox" checked={spotlight} onChange={e=>{setSpotlight(e.target.checked);try{localStorage.setItem("void-spotlight",String(e.target.checked));}catch{}}}/></div><div className="setting-row"><span><strong>Notifications</strong><small>Show workspace notification indicators.</small></span><input type="checkbox" checked={notifications} onChange={e=>setNotifications(e.target.checked)}/></div><div className="setting-row"><span><strong>Layout</strong><small>Choose how much space cards and panels use.</small></span><select value={layout} onChange={e=>{setLayout(e.target.value);try{localStorage.setItem("void-layout",e.target.value);}catch{}}}><option>Comfortable</option><option>Compact</option></select></div><button className="button button-light" onClick={()=>setCookieCustomize(true)}>Privacy choices</button></section>}
        {active==="Key system"&&<section className="key-layout"><div className="panel key-hero"><span className="section-kicker">KEY SYSTEM</span><h2>Verify a global access key.</h2><p className="muted">The connected API decides whether a key is active, expired, revoked, or out of uses.</p><form onSubmit={validateKey} className="key-form"><label className="form-label">ACCESS KEY<input value={keyValue} onChange={e=>setKeyValue(e.target.value)} placeholder="VOID-XX-XXX-XXXX"/></label><button className="button button-light" type="submit">Verify key <Icon name="check"/></button></form>{keyResult&&<div className="key-result">{keyResult}</div>}</div><div className="panel key-generator"><span className="section-kicker">PERSONAL KEY</span><h2>Generate a personal key</h2><p className="muted">Generation uses the server-side waiting period and stores your recent keys locally on this device.</p><form onSubmit={startKeyGeneration}><button className="button button-light" disabled={keyGenerating||!scripts.some(s=>s.status==="published")}>{keyGenerating?"Generating…":"Generate key"}</button></form>{keyCountdown>0&&<div className="key-countdown"><strong>{keyCountdown}s</strong><small>Waiting for the server window…</small></div>}{generatedKey&&<div className="created-key"><code>{generatedKey}</code><button className="button button-ghost" onClick={()=>void navigator.clipboard.writeText(generatedKey).then(()=>setNotice("Key copied."),()=>setNotice("Copy the key manually."))}>Copy</button></div>}{keyGenerationError&&<p className="inline-notice">{keyGenerationError}</p>}</div></section>}
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
            <div className="script-detail-meta"><span>STATUS</span><strong>{selectedScript.status||"published"}</strong></div>
            <div className="protected-card protected-card-large"><Icon name="shield"/><strong>SOURCE PROTECTED</strong><small>The public library never exposes the stored source code.</small></div>
            <div className="script-detail-actions"><button className="button button-light" onClick={()=>setSelectedScript(null)}>Done</button>{selectedScript.showcase_url&&<a className="button button-ghost" href={selectedScript.showcase_url} target="_blank" rel="noreferrer">Watch showcase ↗</a>}</div>
          </div>
        </section>
      </div>}

      {cookiePrefs===null&&<div className="cookie-backdrop"><section className="cookie-card" role="dialog" aria-modal="true" aria-labelledby="cookie-title"><div className="cookie-brand"><span className="cookie-icon"><Icon name="shield"/></span><span className="section-kicker">YOUR PRIVACY MATTERS</span></div><h2 id="cookie-title">Your data. Your call.</h2><p>Void Development uses essential storage to keep sign-in and security features working. Optional analytics help us understand visits and improve the workspace. We only record analytics after you opt in.</p><div className="cookie-choice"><span><strong>Essential</strong><small>Authentication and security · always on</small></span><span className="cookie-required">REQUIRED</span></div>{cookieCustomize&&<><label className="setting-row"><span><strong>Analytics cookies</strong><small>Allow anonymous visit counts and page events</small></span><input type="checkbox" checked={cookieAnalytics} onChange={e=>setCookieAnalytics(e.target.checked)}/></label><label className="setting-row"><span><strong>Personalization</strong><small>Remember theme and workspace preferences</small></span><input type="checkbox" checked={cookiePersonalization} onChange={e=>setCookiePersonalization(e.target.checked)}/></label></>}<button className="button button-light cookie-main" onClick={()=>chooseCookies(true,true)}>Accept all cookies <Icon name="arrow"/></button><div className="cookie-actions"><button className="button button-ghost" onClick={()=>chooseCookies(false,true)}>Essential only</button><button className="text-button" onClick={()=>cookieCustomize?chooseCookies(cookieAnalytics,cookiePersonalization):(setCookieCustomize(true),setCookieNotice(""))}>{cookieCustomize?"Save choices":"Customize"}</button></div><small className="cookie-footnote">You can change your choices anytime in Settings → Privacy choices.</small></section></div>}
      {cookiePrefs!==null&&cookieCustomize&&<div className="cookie-backdrop"><section className="cookie-card cookie-card-compact" role="dialog" aria-modal="true"><button className="cookie-close icon-button" onClick={()=>setCookieCustomize(false)} aria-label="Close cookie settings"><Icon name="close"/></button><span className="section-kicker">COOKIE PREFERENCES</span><h2>Privacy settings</h2><div className="cookie-choice"><span><strong>Essential</strong><small>Authentication and security</small></span><span className="cookie-required">REQUIRED</span></div><label className="setting-row"><span><strong>Analytics</strong><small>Anonymous page views and visits</small></span><input type="checkbox" checked={cookieAnalytics} onChange={e=>setCookieAnalytics(e.target.checked)}/></label><label className="setting-row"><span><strong>Personalization</strong><small>Remember theme choices</small></span><input type="checkbox" checked={cookiePersonalization} onChange={e=>setCookiePersonalization(e.target.checked)}/></label><button className="button button-light cookie-main" onClick={()=>chooseCookies(cookieAnalytics,cookiePersonalization)}>Save preferences</button>{cookieNotice&&<p className="inline-notice">{cookieNotice}</p>}</section></div>}
    </div>
  );
}

export default App;

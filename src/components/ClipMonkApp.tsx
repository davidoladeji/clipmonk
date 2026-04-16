"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Play, Pause, SkipForward, SkipBack, Scissors, Upload, Link,
  Zap, Eye, TrendingUp, Calendar, BarChart3, Settings, LogOut,
  ChevronRight, ChevronLeft, ChevronDown, Star, Check, X, Plus,
  Video, Film, Type, Languages, Sparkles, Target, Clock, Send,
  Globe, Instagram, Music2, Layers, Wand2, Download,
  Copy, Share2, Trash2, GripVertical, Volume2, VolumeX,
  Sun, Moon, Monitor, Smartphone, ArrowRight, ArrowLeft,
  Home, FolderOpen, Bell, Search, User, Menu, Maximize2,
  LayoutDashboard, FileVideo, CalendarDays, PieChart, BookOpen,
  Heart, MessageCircle, Repeat2, ExternalLink, Filter, SlidersHorizontal,
  AlertCircle, CheckCircle2, RefreshCw, Mic, Subtitles, Move,
  Palette, Image, Hash, AtSign, MapPin, Users, Rss,
  Shield, CreditCard, LifeBuoy, FileText, Folder, Cloud,
  Linkedin, Facebook, Twitter, PenTool, Bot, Cpu, Database,
  Lock, Unlock, Tag, Bookmark, Archive, UploadCloud, Link2,
  ImagePlus, Type as TypeIcon, Newspaper, BarChart2, Activity,
  GitBranch
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   CLIPMONK — Open Source AI Video Clipping & Social Media Platform
   ═══════════════════════════════════════════════════════════════ */

const C = {
  bg: "#06060b",
  bgCard: "#0e0e16",
  bgEl: "#14141f",
  bgGlass: "rgba(14,14,22,0.6)",
  teal: "#00e5c7",
  tealDk: "#00b89e",
  amber: "#ff6b35",
  amberLt: "#ff8f5e",
  lav: "#8b7cf6",
  lavLt: "#a99cfa",
  txt: "#e8e6f0",
  txtM: "#7a7694",
  txtD: "#4a4660",
  bdr: "#1e1c2e",
  bdrL: "#2a2840",
  ok: "#34d399",
  warn: "#fbbf24",
  err: "#f87171",
  pink: "#f472b6",
};

/* ── Global Styles ── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:${C.bg};color:${C.txt};font-family:'Plus Jakarta Sans',sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.bdrL};border-radius:3px}
    @keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-5%,-10%)}50%{transform:translate(-15%,5%)}90%{transform:translate(-10%,10%)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
    @keyframes pulse-glow{0%,100%{opacity:.4}50%{opacity:.8}}
    @keyframes slide-up{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slide-in-r{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
    @keyframes spin-slow{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes cursor-blink{0%,100%{opacity:1}50%{opacity:0}}
    .grain{position:fixed;top:-50%;left:-50%;right:-50%;bottom:-50%;width:200%;height:200%;background:transparent url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E") repeat;animation:grain 8s steps(10) infinite;pointer-events:none;z-index:9999;opacity:.5}
    .glass{background:rgba(14,14,22,0.6);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.05)}
    .glass-lt{background:rgba(255,255,255,0.03);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.06)}
    .glow-t{box-shadow:0 0 40px ${C.teal}26,0 0 80px ${C.teal}0d}
    .tg{background:linear-gradient(135deg,${C.teal},${C.lav});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .ag{background:linear-gradient(135deg,${C.amber},${C.amberLt});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .lift{transition:transform .3s,box-shadow .3s}.lift:hover{transform:translateY(-4px);box-shadow:0 20px 40px rgba(0,0,0,.3)}
    .bp{background:linear-gradient(135deg,${C.teal},${C.tealDk});color:${C.bg};font-weight:600;border:none;border-radius:12px;padding:12px 28px;font-size:15px;cursor:pointer;transition:all .3s;font-family:'Plus Jakarta Sans',sans-serif;letter-spacing:-.01em}
    .bp:hover{box-shadow:0 0 30px ${C.teal}4d;transform:translateY(-2px)}
    .bs{background:transparent;color:${C.txt};font-weight:500;border:1px solid ${C.bdrL};border-radius:12px;padding:12px 28px;font-size:15px;cursor:pointer;transition:all .3s;font-family:'Plus Jakarta Sans',sans-serif}
    .bs:hover{border-color:${C.teal};color:${C.teal}}
    .ba{background:linear-gradient(135deg,${C.amber},#e55a2b);color:#fff;font-weight:600;border:none;border-radius:12px;padding:12px 28px;font-size:15px;cursor:pointer;transition:all .3s;font-family:'Plus Jakarta Sans',sans-serif}
    .ba:hover{box-shadow:0 0 30px ${C.amber}4d;transform:translateY(-2px)}
    .sy{font-family:'Syne',sans-serif}
    input,textarea,select{font-family:'Plus Jakarta Sans',sans-serif;background:${C.bgCard};border:1px solid ${C.bdr};color:${C.txt};border-radius:10px;padding:12px 16px;font-size:14px;outline:none;transition:border-color .3s;width:100%}
    input:focus,textarea:focus,select:focus{border-color:${C.teal}}
    input::placeholder,textarea::placeholder{color:${C.txtD}}
  `}</style>
);

/* ── Shared Components ── */
const Badge = ({ children, color = C.teal, style = {} }: { children: React.ReactNode; color?: string; style?: React.CSSProperties }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: ".03em", background: `${color}15`, color, border: `1px solid ${color}30`, ...style }}>{children}</span>
);

const SectionTitle = ({ badge, title, sub, align = "center" }: { badge?: React.ReactNode; title: React.ReactNode; sub?: string; align?: string }) => (
  <div style={{ textAlign: align as any, marginBottom: 60, maxWidth: 700, margin: align === "center" ? "0 auto 60px" : "0 0 60px" }}>
    {badge && <Badge style={{ marginBottom: 16 }}>{badge}</Badge>}
    <h2 className="sy" style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.1, marginTop: badge ? 16 : 0, marginBottom: 16 }}>{title}</h2>
    {sub && <p style={{ fontSize: 17, color: C.txtM, lineHeight: 1.6, maxWidth: 560, margin: align === "center" ? "0 auto" : "0" }}>{sub}</p>}
  </div>
);

const StatCard = ({ icon: Icon, value, label, color = C.teal }: { icon: any; value: string; label: string; color?: string }) => (
  <div className="glass lift" style={{ padding: 28, borderRadius: 16, display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={20} color={color} /></div>
    <div className="sy" style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-.03em" }}>{value}</div>
    <div style={{ fontSize: 14, color: C.txtM }}>{label}</div>
  </div>
);

const VMeter = ({ score }: { score: number }) => {
  const c = score >= 80 ? C.teal : score >= 60 ? C.warn : C.amber;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: C.bgCard }}><div style={{ width: `${score}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg,${c},${c}aa)`, transition: "width 1s" }} /></div>
      <span style={{ fontSize: 13, fontWeight: 700, color: c, minWidth: 35 }}>{score}%</span>
    </div>
  );
};

const PIcon = ({ p, size = 20 }: { p: string; size?: number }) => {
  const icons: Record<string, React.ReactNode> = { youtube: <Play size={size} />, tiktok: <Music2 size={size} />, instagram: <Instagram size={size} />, twitter: <Twitter size={size} />, facebook: <Facebook size={size} />, linkedin: <Linkedin size={size} />, pinterest: <Bookmark size={size} /> };
  const cols: Record<string, string> = { youtube: "#ff0000", tiktok: "#00f2ea", instagram: "#e4405f", twitter: "#1da1f2", facebook: "#1877f2", linkedin: "#0a66c2", pinterest: "#e60023" };
  return <span style={{ color: cols[p] || C.txtM }}>{icons[p] || <Globe size={size} />}</span>;
};

const Toggle = ({ on, onToggle, color = C.teal }: { on: boolean; onToggle: () => void; color?: string }) => (
  <div onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: on ? color : C.bdrL, cursor: "pointer", position: "relative", transition: "background .3s", flexShrink: 0 }}>
    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 23 : 3, transition: "left .3s" }} />
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════════════ */

const LandingNav = ({ go }: { go: (v: string) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all .3s", ...(scrolled ? { background: "rgba(6,6,11,0.85)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.bdr}` } : {}) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${C.teal},${C.lav})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Scissors size={18} color={C.bg} strokeWidth={2.5} /></div>
        <span className="sy" style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.03em" }}>clip<span style={{ color: C.teal }}>monk</span></span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {["Features", "How it Works", "Pricing", "API Docs"].map(i => (
          <a key={i} href="#" style={{ color: C.txtM, textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color .2s" }} onMouseEnter={e => (e.target as any).style.color = C.txt} onMouseLeave={e => (e.target as any).style.color = C.txtM}>{i}</a>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="bs" style={{ padding: "10px 20px", fontSize: 14 }} onClick={() => go("dashboard")}>Sign In</button>
        <button className="bp" style={{ padding: "10px 20px", fontSize: 14 }} onClick={() => go("dashboard")}>Get Started Free</button>
      </div>
    </nav>
  );
};

const Hero = ({ go }: { go: (v: string) => void }) => {
  const [url, setUrl] = useState("");
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 40px 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle,${C.teal}08,transparent 70%)`, top: -100, right: -200, animation: "float 8s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle,${C.lav}06,transparent 70%)`, bottom: -100, left: -150, animation: "float 10s ease-in-out infinite 1s" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle,${C.amber}05,transparent 70%)`, top: "30%", left: "50%", transform: "translateX(-50%)", animation: "pulse-glow 6s ease-in-out infinite" }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 900 }}>
        <Badge color={C.amber} style={{ marginBottom: 24 }}><Zap size={12} /> Open Source & Free Forever</Badge>
        <h1 className="sy" style={{ fontSize: "clamp(40px,6vw,76px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-.04em", marginBottom: 24, animation: "slide-up .8s ease-out" }}>
          Clip, caption, and<br /><span className="tg">publish everywhere</span>
        </h1>
        <p style={{ fontSize: 19, color: C.txtM, lineHeight: 1.7, maxWidth: 600, margin: "0 auto 40px", animation: "slide-up .8s ease-out .1s both" }}>
          AI-powered engine that finds viral moments in your videos, adds captions &amp; face tracking, then schedules posts to every social platform — all from one dashboard.
        </p>
        <div style={{ display: "flex", gap: 0, maxWidth: 620, margin: "0 auto 24px", animation: "slide-up .8s ease-out .2s both", borderRadius: 16, overflow: "hidden", border: `1px solid ${C.bdrL}`, background: C.bgCard }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px", color: C.txtD }}><Link size={18} /></div>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste a YouTube URL to get started..." style={{ flex: 1, background: "transparent", border: "none", padding: "16px 0", borderRadius: 0 }} />
          <button className="bp" style={{ borderRadius: 0, padding: "16px 32px", display: "flex", alignItems: "center", gap: 8 }} onClick={() => go("dashboard")}><Scissors size={16} /> Clip It</button>
        </div>
        <p style={{ fontSize: 13, color: C.txtD, animation: "slide-up .8s ease-out .3s both" }}>No credit card required. Works with YouTube, Twitch, and video uploads.</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 48, animation: "slide-up .8s ease-out .4s both" }}>
          <div style={{ display: "flex" }}>
            {[C.teal, C.amber, C.lav, C.ok, C.pink].map((c, i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: `${c}30`, border: `2px solid ${C.bg}`, marginLeft: i > 0 ? -10 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}><User size={14} color={c} /></div>
            ))}
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>12,400+ creators</div>
            <div style={{ fontSize: 12, color: C.txtM }}>shipped 2M+ clips this month</div>
          </div>
          <div style={{ width: 1, height: 36, background: C.bdr }} />
          <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(i => <Star key={i} size={16} fill={C.amber} color={C.amber} />)}</div>
          <span style={{ fontSize: 14, color: C.txtM }}>4.9/5</span>
        </div>
      </div>

      {/* Preview mockup */}
      <div style={{ marginTop: 80, maxWidth: 1000, width: "100%", borderRadius: 20, overflow: "hidden", border: `1px solid ${C.bdr}`, background: C.bgCard, animation: "slide-up 1s ease-out .5s both" }}>
        <div style={{ height: 44, background: C.bgEl, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", borderBottom: `1px solid ${C.bdr}` }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          <div style={{ flex: 1, textAlign: "center", fontSize: 12, color: C.txtD }}>app.clipmonk.dev</div>
        </div>
        <div style={{ height: 440, background: `linear-gradient(180deg,${C.bgCard},${C.bg})`, display: "flex", alignItems: "center", justifyContent: "center", gap: 24, padding: 40 }}>
          <div style={{ flex: "0 0 240px", height: 360, borderRadius: 16, background: `linear-gradient(135deg,${C.bgEl},${C.bgCard})`, border: `1px solid ${C.bdr}`, overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", justifyContent: "space-between", zIndex: 2 }}>
              <Badge color={C.err} style={{ fontSize: 10 }}>LIVE PREVIEW</Badge>
              <Badge color={C.teal} style={{ fontSize: 10 }}>9:16</Badge>
            </div>
            <div style={{ width: "100%", height: "100%", background: `linear-gradient(180deg,${C.lav}15,${C.teal}10)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg,${C.teal}30,${C.lav}30)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Play size={32} color={C.teal} fill={C.teal} /></div>
            </div>
            <div style={{ position: "absolute", bottom: 60, left: 16, right: 16, textAlign: "center" }}>
              <span style={{ display: "inline-block", background: "rgba(0,0,0,.7)", borderRadius: 8, padding: "8px 16px", fontSize: 14, fontWeight: 700 }}><span style={{ color: C.amber }}>This is</span> the moment</span>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            {[{ t: "The viral confession moment", s: 94, time: "2:34 — 3:12" }, { t: "Unexpected plot twist reaction", s: 87, time: "7:45 — 8:30" }, { t: "Audience goes completely wild", s: 82, time: "12:10 — 12:55" }, { t: "The emotional closing speech", s: 76, time: "18:20 — 19:45" }].map((clip, i) => (
              <div key={i} className="glass-lt lift" style={{ padding: 16, borderRadius: 12, display: "flex", alignItems: "center", gap: 16, cursor: "pointer", animation: `slide-in-r .5s ease-out ${.6 + i * .1}s both` }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${C.teal}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Film size={18} color={C.teal} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{clip.t}</div>
                  <div style={{ fontSize: 12, color: C.txtD }}>{clip.time}</div>
                </div>
                <div style={{ width: 80 }}><VMeter score={clip.s} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const feats = [
    { icon: Wand2, t: "AI Auto-Curation", d: "AI watches your entire video, scores every moment for virality, and suggests the best clips.", c: C.teal },
    { icon: Move, t: "Smart Face Tracking", d: "Detects and centers faces when converting to vertical format. No awkward crops.", c: C.amber },
    { icon: Subtitles, t: "Auto Captioning", d: "Speech-to-text captions in 30+ languages with customizable styles and word highlighting.", c: C.lav },
    { icon: Languages, t: "Caption Translation", d: "Translate captions to any language while preserving the original audio track.", c: C.teal },
    { icon: Target, t: "Hook & CTA Generator", d: "AI generates scroll-stopping hooks and CTAs that boost retention.", c: C.amber },
    { icon: CalendarDays, t: "Smart Scheduling", d: "AI picks the best times and auto-posts to TikTok, YouTube, Instagram, Facebook, LinkedIn, and more.", c: C.lav },
    { icon: Users, t: "Team Workspaces", d: "Invite your team, assign roles, manage permissions, and collaborate on content.", c: C.teal },
    { icon: Bot, t: "Multi-AI Engine", d: "Powered by OpenAI, Claude, Gemini, and more. Generate captions, descriptions, and hashtags.", c: C.amber },
    { icon: BarChart2, t: "Cross-Platform Analytics", d: "Unified dashboard tracking views, engagement, and growth across every platform.", c: C.lav },
    { icon: Rss, t: "RSS Automation", d: "Connect RSS feeds and auto-clip + schedule content from new posts.", c: C.teal },
    { icon: Cloud, t: "Cloud Storage", d: "Integrate Google Drive, Dropbox, OneDrive, and S3 for media management.", c: C.amber },
    { icon: Shield, t: "Open Source (MIT)", d: "Self-host on your infrastructure. Full control over your data and workflows.", c: C.lav },
  ];
  return (
    <section style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
      <SectionTitle badge={<><Sparkles size={12} /> Features</>} title={<>Everything you need to<br /><span className="tg">create & publish</span></>} sub="From raw footage to published clips across every platform. AI-powered clipping meets full social media management." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {feats.map((f, i) => (
          <div key={i} className="glass lift" style={{ padding: 28, borderRadius: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle,${f.c}08,transparent)` }} />
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.c}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><f.icon size={22} color={f.c} /></div>
            <h3 className="sy" style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, letterSpacing: "-.02em" }}>{f.t}</h3>
            <p style={{ fontSize: 13, color: C.txtM, lineHeight: 1.7 }}>{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { n: "01", t: "Import", d: "Paste any YouTube, Twitch, or video link. Or upload directly.", icon: Link, c: C.teal },
    { n: "02", t: "AI Analyzes", d: "Scores every second for virality, humor, and engagement. Generates clips.", icon: Zap, c: C.amber },
    { n: "03", t: "Customize", d: "Pick clips, add captions, face tracking, hooks. Edit like a pro.", icon: SlidersHorizontal, c: C.lav },
    { n: "04", t: "Publish Everywhere", d: "Schedule and auto-post to 7+ platforms. Track analytics in real-time.", icon: Send, c: C.teal },
  ];
  return (
    <section style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
      <SectionTitle badge={<><BookOpen size={12} /> How it Works</>} title={<>Long-form to<br /><span className="ag">viral clips in 4 steps</span></>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, position: "relative" }}>
        <div style={{ position: "absolute", top: 52, left: "12.5%", right: "12.5%", height: 1, background: `linear-gradient(90deg,${C.teal}40,${C.amber}40,${C.lav}40,${C.teal}40)` }} />
        {steps.map((s, i) => (
          <div key={i} style={{ textAlign: "center", position: "relative" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.bgCard, border: `2px solid ${s.c}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", position: "relative", zIndex: 1 }}><s.icon size={24} color={s.c} /></div>
            <div className="sy" style={{ fontSize: 12, fontWeight: 800, color: s.c, letterSpacing: ".1em", marginBottom: 8 }}>{s.n}</div>
            <h3 className="sy" style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, letterSpacing: "-.02em" }}>{s.t}</h3>
            <p style={{ fontSize: 13, color: C.txtM, lineHeight: 1.6 }}>{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Platforms = () => (
  <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
    <SectionTitle badge={<><Globe size={12} /> Platforms</>} title={<>Manage <span className="tg">7+ social networks</span> from one dashboard</>} sub="Connect all your accounts. Schedule, publish, and track performance — no more juggling apps." />
    <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
      {[
        { n: "YouTube", p: "youtube" }, { n: "TikTok", p: "tiktok" }, { n: "Instagram", p: "instagram" },
        { n: "Facebook", p: "facebook" }, { n: "LinkedIn", p: "linkedin" }, { n: "X / Twitter", p: "twitter" }, { n: "Pinterest", p: "pinterest" },
      ].map((plt, i) => (
        <div key={i} className="glass lift" style={{ padding: "24px 32px", borderRadius: 16, display: "flex", alignItems: "center", gap: 12, minWidth: 160 }}>
          <PIcon p={plt.p} size={24} />
          <span style={{ fontSize: 15, fontWeight: 600 }}>{plt.n}</span>
        </div>
      ))}
    </div>
  </section>
);

const Pricing = () => {
  const [yr, setYr] = useState(true);
  const plans = [
    { n: "Starter", p: 0, pd: "Free forever", d: "Basic clipping for solo creators", f: ["5 clips/month", "720p export", "Basic captions", "1 platform", "Community support"], cta: "Start Free", hl: false },
    { n: "Pro", p: yr ? 19 : 29, pd: yr ? "/mo billed yearly" : "/month", d: "For serious creators & managers", f: ["Unlimited clips", "1080p export", "AI captions + translation", "3 platforms", "Face tracking", "Team workspace (3 seats)", "AI content generation", "Priority support"], cta: "Go Pro", hl: true, badge: "Most Popular" },
    { n: "Business", p: yr ? 49 : 79, pd: yr ? "/mo billed yearly" : "/month", d: "For agencies and teams", f: ["Everything in Pro", "10 team seats", "4K export", "All 7+ platforms", "API access", "RSS automation", "Cloud storage integrations", "Custom branding", "Channel automation", "Advanced analytics"], cta: "Start Trial", hl: false },
  ];
  return (
    <section style={{ padding: "100px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <SectionTitle badge={<><Star size={12} /> Pricing</>} title={<>Simple, transparent <span className="tg">pricing</span></>} sub="Start free, upgrade when you need more." />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 48 }}>
        <span style={{ fontSize: 14, color: !yr ? C.txt : C.txtM }}>Monthly</span>
        <Toggle on={yr} onToggle={() => setYr(!yr)} />
        <span style={{ fontSize: 14, color: yr ? C.txt : C.txtM }}>Yearly <Badge color={C.ok} style={{ fontSize: 10 }}>Save 34%</Badge></span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "stretch" }}>
        {plans.map((pl, i) => (
          <div key={i} className={pl.hl ? "glow-t" : ""} style={{ padding: 36, borderRadius: 20, background: pl.hl ? C.bgEl : C.bgCard, border: `1px solid ${pl.hl ? C.teal + "40" : C.bdr}`, position: "relative", display: "flex", flexDirection: "column" }}>
            {pl.badge && <Badge color={C.teal} style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)" }}>{pl.badge}</Badge>}
            <h3 className="sy" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{pl.n}</h3>
            <p style={{ fontSize: 13, color: C.txtM, marginBottom: 20 }}>{pl.d}</p>
            <div style={{ marginBottom: 24 }}><span className="sy" style={{ fontSize: 48, fontWeight: 800 }}>${pl.p}</span><span style={{ fontSize: 14, color: C.txtM }}>{pl.pd}</span></div>
            <button className={pl.hl ? "bp" : "bs"} style={{ width: "100%", marginBottom: 28 }}>{pl.cta}</button>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
              {pl.f.map((f, j) => (<div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}><Check size={16} color={C.teal} /><span style={{ fontSize: 14, color: C.txtM }}>{f}</span></div>))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Testimonials = () => {
  const ts = [
    { n: "Sarah Chen", r: "YouTube Creator · 2M subs", t: "ClipMonk turned my 45-minute podcast into 12 viral clips. One hit 2M views on TikTok. The scheduling to all platforms is a game-changer.", a: C.teal },
    { n: "Marcus Rivera", r: "Content Agency · 30 clients", t: "We manage 30+ creator accounts. ClipMonk's team workspaces and bulk scheduling save us 40 hours a week. Way better than juggling 5 tools.", a: C.amber },
    { n: "Aisha Patel", r: "Twitch Streamer · 500K", t: "Face tracking is unreal. Caption translation helped me reach a global audience. And the AI content generation for descriptions and hashtags? Chef's kiss.", a: C.lav },
  ];
  return (
    <section style={{ padding: "100px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <SectionTitle badge={<><Heart size={12} /> Testimonials</>} title={<>Loved by <span className="tg">creators</span></>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {ts.map((t, i) => (
          <div key={i} className="glass lift" style={{ padding: 32, borderRadius: 20 }}>
            <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>{[1,2,3,4,5].map(s => <Star key={s} size={14} fill={C.amber} color={C.amber} />)}</div>
            <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>"{t.t}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${t.a}20`, display: "flex", alignItems: "center", justifyContent: "center" }}><User size={18} color={t.a} /></div>
              <div><div style={{ fontSize: 14, fontWeight: 600 }}>{t.n}</div><div style={{ fontSize: 12, color: C.txtM }}>{t.r}</div></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const CTA = ({ go }: { go: (v: string) => void }) => (
  <section style={{ padding: "100px 40px", textAlign: "center" }}>
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 80, borderRadius: 24, background: `linear-gradient(135deg,${C.bgEl},${C.bgCard})`, border: `1px solid ${C.bdr}`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 50%,${C.teal}08,transparent 60%),radial-gradient(ellipse at 70% 50%,${C.amber}06,transparent 60%)` }} />
      <div style={{ position: "relative" }}>
        <h2 className="sy" style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-.03em", marginBottom: 16 }}>Ready to go <span className="tg">viral</span>?</h2>
        <p style={{ fontSize: 17, color: C.txtM, marginBottom: 32 }}>Join 12,000+ creators growing their audience with AI-powered clips.</p>
        <button className="bp" style={{ padding: "16px 40px", fontSize: 16 }} onClick={() => go("dashboard")}>Get Started Free <ArrowRight size={18} style={{ marginLeft: 8 }} /></button>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer style={{ padding: "60px 40px 40px", borderTop: `1px solid ${C.bdr}`, maxWidth: 1200, margin: "0 auto" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 48 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${C.teal},${C.lav})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Scissors size={14} color={C.bg} strokeWidth={2.5} /></div>
          <span className="sy" style={{ fontSize: 18, fontWeight: 800 }}>clip<span style={{ color: C.teal }}>monk</span></span>
        </div>
        <p style={{ fontSize: 13, color: C.txtD, maxWidth: 280, lineHeight: 1.6 }}>Open source AI video clipping and social media management platform.</p>
      </div>
      {[
        { t: "Product", l: ["Features", "Pricing", "API", "Changelog", "Self-Host"] },
        { t: "Resources", l: ["Docs", "Blog", "Community", "Support", "GitHub"] },
        { t: "Legal", l: ["Privacy", "Terms", "License (MIT)"] },
      ].map((col, i) => (
        <div key={i}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{col.t}</div>
          {col.l.map(l => <a key={l} href="#" style={{ display: "block", fontSize: 13, color: C.txtM, textDecoration: "none", marginBottom: 10, transition: "color .2s" }} onMouseEnter={e => (e.target as any).style.color = C.teal} onMouseLeave={e => (e.target as any).style.color = C.txtM}>{l}</a>)}
        </div>
      ))}
    </div>
    <div style={{ paddingTop: 24, borderTop: `1px solid ${C.bdr}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 12, color: C.txtD }}>2026 ClipMonk. Open Source under MIT License.</span>
      <div style={{ display: "flex", gap: 16 }}><a href="https://github.com/davidoladeji/clipmonk" target="_blank" rel="noreferrer"><GitBranch size={16} color={C.txtD} style={{ cursor: "pointer" }} /></a></div>
    </div>
  </footer>
);

const Landing = ({ go }: { go: (v: string) => void }) => (<div><LandingNav go={go} /><Hero go={go} /><Features /><HowItWorks /><Platforms /><Pricing /><Testimonials /><CTA go={go} /><Footer /></div>);

/* ═══════════════════════════════════════════════════════════════
   APP SHELL — Sidebar + Views
   ═══════════════════════════════════════════════════════════════ */

const Sidebar = ({ view, setView }: { view: string; setView: (v: string) => void }) => {
  const items = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "projects", icon: FolderOpen, label: "Projects" },
    { id: "editor", icon: FileVideo, label: "Clip Editor" },
    { id: "accounts", icon: Globe, label: "Accounts" },
    { id: "compose", icon: PenTool, label: "Compose" },
    { id: "scheduler", icon: CalendarDays, label: "Scheduler" },
    { id: "ai", icon: Bot, label: "AI Studio" },
    { id: "analytics", icon: PieChart, label: "Analytics" },
    { id: "files", icon: Folder, label: "Files" },
    { id: "team", icon: Users, label: "Team" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];
  return (
    <div style={{ width: 220, height: "100vh", background: C.bgCard, borderRight: `1px solid ${C.bdr}`, display: "flex", flexDirection: "column", padding: "20px 10px", position: "fixed", left: 0, top: 0, overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 24 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${C.teal},${C.lav})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Scissors size={13} color={C.bg} strokeWidth={2.5} /></div>
        <span className="sy" style={{ fontSize: 17, fontWeight: 800 }}>clip<span style={{ color: C.teal }}>monk</span></span>
      </div>
      <button className="bp" style={{ width: "100%", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 14px", fontSize: 13, borderRadius: 10 }} onClick={() => setView("new-project")}><Plus size={14} /> New Project</button>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {items.map(it => (
          <button key={it.id} onClick={() => setView(it.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9, border: "none", background: view === it.id ? `${C.teal}10` : "transparent", color: view === it.id ? C.teal : C.txtM, fontSize: 13, fontWeight: view === it.id ? 600 : 400, cursor: "pointer", transition: "all .2s", fontFamily: "'Plus Jakarta Sans',sans-serif", width: "100%", textAlign: "left" }}>
            <it.icon size={16} />{it.label}
          </button>
        ))}
      </div>
      <div style={{ padding: 14, borderRadius: 10, background: `${C.teal}08`, border: `1px solid ${C.teal}15`, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.teal, marginBottom: 4 }}>Pro Plan</div>
        <div style={{ fontSize: 10, color: C.txtM, marginBottom: 6 }}>42 of 100 clips</div>
        <div style={{ height: 4, borderRadius: 2, background: C.bgEl }}><div style={{ width: "42%", height: "100%", borderRadius: 2, background: C.teal }} /></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px", borderTop: `1px solid ${C.bdr}`, paddingTop: 12 }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${C.amber}20`, display: "flex", alignItems: "center", justifyContent: "center" }}><User size={13} color={C.amber} /></div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>David</div><div style={{ fontSize: 10, color: C.txtD }}>Pro Plan</div></div>
      </div>
    </div>
  );
};

const TopBar = ({ title, sub }: { title: string; sub?: string }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
    <div>
      <h1 className="sy" style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.03em" }}>{title}</h1>
      {sub && <p style={{ fontSize: 13, color: C.txtM, marginTop: 4 }}>{sub}</p>}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 9, background: C.bgCard, border: `1px solid ${C.bdr}` }}>
        <Search size={14} color={C.txtD} /><span style={{ fontSize: 12, color: C.txtD }}>Search...</span><span style={{ fontSize: 9, padding: "2px 5px", borderRadius: 4, background: C.bgEl, color: C.txtD }}>⌘K</span>
      </div>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: C.bgCard, border: `1px solid ${C.bdr}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}><Bell size={15} color={C.txtM} /><div style={{ width: 7, height: 7, borderRadius: "50%", background: C.amber, position: "absolute", top: 7, right: 7 }} /></div>
    </div>
  </div>
);

/* ── Dashboard ── */
const DashboardView = ({ sv }: { sv: (v: string) => void }) => {
  const projects = [
    { t: "MrBeast Survival Challenge", clips: 8, views: "2.4M", status: "published", date: "2h ago", p: "youtube" },
    { t: "Tech Review Compilation", clips: 5, views: "890K", status: "scheduled", date: "5h ago", p: "tiktok" },
    { t: "Cooking Stream Highlights", clips: 12, views: "1.2M", status: "draft", date: "1d ago", p: "instagram" },
    { t: "Gaming Tournament Finals", clips: 6, views: "456K", status: "processing", date: "1d ago", p: "youtube" },
  ];
  const stC: Record<string, string> = { published: C.ok, scheduled: C.warn, draft: C.txtM, processing: C.lav };
  return (
    <div>
      <TopBar title="Dashboard" sub="Welcome back, David. Here's what's happening." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        <StatCard icon={Film} value="247" label="Total Clips" color={C.teal} />
        <StatCard icon={Eye} value="12.4M" label="Total Views" color={C.amber} />
        <StatCard icon={TrendingUp} value="+34%" label="Growth (30d)" color={C.ok} />
        <StatCard icon={Globe} value="18" label="Connected Accounts" color={C.lav} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
        {[
          { icon: Link, t: "Paste YouTube URL", d: "Auto-detect viral moments", c: C.teal, a: "new-project" },
          { icon: PenTool, t: "Compose Post", d: "Write & publish to all platforms", c: C.amber, a: "compose" },
          { icon: Bot, t: "AI Generate", d: "Let AI create content for you", c: C.lav, a: "ai" },
        ].map((a, i) => (
          <div key={i} className="glass lift" style={{ padding: 20, borderRadius: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }} onClick={() => sv(a.a)}>
            <div style={{ width: 44, height: 44, borderRadius: 11, background: `${a.c}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><a.icon size={18} color={a.c} /></div>
            <div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{a.t}</div><div style={{ fontSize: 11, color: C.txtM }}>{a.d}</div></div>
            <ChevronRight size={16} color={C.txtD} style={{ marginLeft: "auto" }} />
          </div>
        ))}
      </div>
      <div className="glass" style={{ borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.bdr}` }}>
          <h3 className="sy" style={{ fontSize: 16, fontWeight: 700 }}>Recent Projects</h3>
          <button className="bs" style={{ padding: "5px 12px", fontSize: 11 }} onClick={() => sv("projects")}>View All</button>
        </div>
        {projects.map((p, i) => (
          <div key={i} style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, borderBottom: i < projects.length - 1 ? `1px solid ${C.bdr}` : "none", cursor: "pointer", transition: "background .2s" }} onClick={() => sv("editor")} onMouseEnter={e => (e.currentTarget.style.background = `${C.teal}05`)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: C.bgEl, display: "flex", alignItems: "center", justifyContent: "center" }}><PIcon p={p.p} size={16} /></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{p.t}</div><div style={{ fontSize: 11, color: C.txtD }}>{p.clips} clips · {p.date}</div></div>
            <div style={{ textAlign: "right", marginRight: 14 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{p.views}</div><div style={{ fontSize: 10, color: C.txtD }}>views</div></div>
            <Badge color={stC[p.status]} style={{ fontSize: 10 }}>{p.status === "processing" && <RefreshCw size={9} style={{ animation: "spin-slow 2s linear infinite" }} />}{p.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Accounts View (Social Media Management from Stackpost) ── */
const AccountsView = () => {
  const accounts = [
    { platform: "youtube", name: "ClipMonk Demo", handle: "@clipmonk-demo", followers: "124K", status: "active", posts: 47 },
    { platform: "tiktok", name: "ClipMonk", handle: "@clipmonk_demo", followers: "89K", status: "active", posts: 132 },
    { platform: "instagram", name: "ClipMonk", handle: "@clipmonk.demo", followers: "56K", status: "active", posts: 78 },
    { platform: "facebook", name: "ClipMonk Page", handle: "clipmonk", followers: "34K", status: "active", posts: 23 },
    { platform: "linkedin", name: "ClipMonk", handle: "clipmonk-inc", followers: "12K", status: "active", posts: 15 },
    { platform: "twitter", name: "ClipMonk", handle: "@clipmonk_", followers: "28K", status: "reconnect", posts: 45 },
    { platform: "pinterest", name: "ClipMonk Boards", handle: "clipmonk", followers: "8K", status: "active", posts: 34 },
  ];
  return (
    <div>
      <TopBar title="Connected Accounts" sub="Manage all your social media accounts in one place." />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["All (7)", "Active (6)", "Needs Reconnect (1)"].map((f, i) => <button key={i} className="bs" style={{ padding: "6px 12px", fontSize: 11, ...(i === 0 ? { background: `${C.teal}10`, borderColor: `${C.teal}40`, color: C.teal } : {}) }}>{f}</button>)}
        </div>
        <button className="bp" style={{ padding: "8px 16px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><Plus size={13} /> Connect Account</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {accounts.map((a, i) => (
          <div key={i} className="glass lift" style={{ padding: 20, borderRadius: 14, display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: C.bgEl, display: "flex", alignItems: "center", justifyContent: "center" }}><PIcon p={a.platform} size={22} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{a.name}</span>
                <Badge color={a.status === "active" ? C.ok : C.warn} style={{ fontSize: 9 }}>{a.status === "active" ? "Connected" : "Reconnect"}</Badge>
              </div>
              <div style={{ fontSize: 12, color: C.txtD }}>{a.handle}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{a.followers}</div>
              <div style={{ fontSize: 10, color: C.txtD }}>followers</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{a.posts}</div>
              <div style={{ fontSize: 10, color: C.txtD }}>posts</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Compose View (Post Composer from Stackpost) ── */
const ComposeView = () => {
  const [text, setText] = useState("");
  const [selPlatforms, setSelPlatforms] = useState(["youtube", "tiktok", "instagram"]);
  return (
    <div>
      <TopBar title="Compose Post" sub="Create and publish content across all your platforms." />
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div className="glass" style={{ padding: 24, borderRadius: 14, marginBottom: 16 }}>
            <h4 className="sy" style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Select Platforms</h4>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["youtube", "tiktok", "instagram", "facebook", "linkedin", "twitter", "pinterest"].map(p => (
                <div key={p} onClick={() => setSelPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])} style={{ padding: "8px 14px", borderRadius: 9, border: `1px solid ${selPlatforms.includes(p) ? C.teal + "50" : C.bdr}`, background: selPlatforms.includes(p) ? `${C.teal}10` : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all .2s" }}>
                  <PIcon p={p} size={14} /><span style={{ fontSize: 12, textTransform: "capitalize" }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass" style={{ padding: 24, borderRadius: 14, marginBottom: 16 }}>
            <textarea rows={6} value={text} onChange={e => setText(e.target.value)} placeholder="What's on your mind? Write your post here..." style={{ resize: "vertical", fontSize: 15, lineHeight: 1.6 }} />
            <div style={{ display: "flex", gap: 8, marginTop: 12, borderTop: `1px solid ${C.bdr}`, paddingTop: 12 }}>
              {[{ icon: ImagePlus, label: "Media" }, { icon: Hash, label: "Hashtags" }, { icon: AtSign, label: "Mention" }, { icon: MapPin, label: "Location" }, { icon: Link2, label: "Link" }].map((b, i) => (
                <button key={i} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", borderRadius: 7, border: `1px solid ${C.bdr}`, background: "transparent", color: C.txtM, fontSize: 11, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}><b.icon size={13} />{b.label}</button>
              ))}
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 11, color: C.txtD, alignSelf: "center" }}>{text.length}/2200</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="bs" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13 }}><Archive size={14} /> Save Draft</button>
            <button className="bs" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13 }}><CalendarDays size={14} /> Schedule</button>
            <button className="bp" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13 }}><Send size={14} /> Publish Now</button>
          </div>
        </div>
        <div style={{ width: 320 }}>
          <div className="glass" style={{ padding: 20, borderRadius: 14, marginBottom: 14 }}>
            <h4 className="sy" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}><Wand2 size={14} color={C.lav} style={{ marginRight: 6 }} />AI Assistant</h4>
            {["Generate caption", "Add hashtags", "Translate to Spanish", "Make it more engaging", "Shorten text"].map((s, i) => (
              <button key={i} style={{ display: "block", width: "100%", padding: "8px 12px", marginBottom: 6, borderRadius: 8, border: `1px solid ${C.bdr}`, background: C.bgCard, color: C.txtM, fontSize: 12, cursor: "pointer", textAlign: "left", fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "all .2s" }} onMouseEnter={e => { (e.target as any).style.borderColor = C.lav; (e.target as any).style.color = C.lav; }} onMouseLeave={e => { (e.target as any).style.borderColor = C.bdr; (e.target as any).style.color = C.txtM; }}>{s}</button>
            ))}
          </div>
          <div className="glass" style={{ padding: 20, borderRadius: 14 }}>
            <h4 className="sy" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Preview</h4>
            <div style={{ padding: 16, borderRadius: 10, background: C.bgEl, minHeight: 120 }}>
              {text ? <p style={{ fontSize: 13, lineHeight: 1.6 }}>{text}</p> : <p style={{ fontSize: 12, color: C.txtD, textAlign: "center", paddingTop: 30 }}>Start typing to see preview</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── AI Studio (Multi-AI from Stackpost) ── */
const AIStudioView = () => {
  const [provider, setProvider] = useState("openai");
  const [prompt, setPrompt] = useState("");
  const providers = [
    { id: "openai", name: "OpenAI GPT-4o", icon: Cpu, c: C.teal },
    { id: "claude", name: "Claude Sonnet", icon: Bot, c: C.amber },
    { id: "gemini", name: "Gemini Pro", icon: Sparkles, c: C.lav },
  ];
  const templates = [
    { t: "Viral Hook Generator", d: "Create scroll-stopping hooks for short-form content", cat: "Hooks" },
    { t: "Caption Writer", d: "Generate engaging captions with hashtags for any platform", cat: "Captions" },
    { t: "Video Description", d: "SEO-optimized descriptions for YouTube and TikTok", cat: "SEO" },
    { t: "Content Calendar", d: "Plan a week of content ideas for your niche", cat: "Planning" },
    { t: "Trend Analyzer", d: "Identify trending topics in your niche right now", cat: "Research" },
    { t: "Ad Copy Writer", d: "High-converting ad copy for paid social campaigns", cat: "Ads" },
  ];
  return (
    <div>
      <TopBar title="AI Studio" sub="Generate content with multiple AI providers." />
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div className="glass" style={{ padding: 20, borderRadius: 14, marginBottom: 16 }}>
            <h4 className="sy" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>AI Provider</h4>
            <div style={{ display: "flex", gap: 8 }}>
              {providers.map(p => (
                <div key={p.id} onClick={() => setProvider(p.id)} style={{ flex: 1, padding: 14, borderRadius: 10, border: `1px solid ${provider === p.id ? p.c + "50" : C.bdr}`, background: provider === p.id ? `${p.c}08` : C.bgCard, cursor: "pointer", textAlign: "center", transition: "all .2s" }}>
                  <p.icon size={20} color={p.c} style={{ marginBottom: 6 }} />
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{p.name}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass" style={{ padding: 20, borderRadius: 14, marginBottom: 16 }}>
            <h4 className="sy" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Prompt</h4>
            <textarea rows={4} value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe what you want to generate..." style={{ resize: "vertical" }} />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <select style={{ width: "auto" }}><option>Friendly tone</option><option>Professional</option><option>Creative</option><option>Casual</option></select>
              <select style={{ width: "auto" }}><option>English</option><option>Spanish</option><option>Portuguese</option><option>French</option></select>
              <div style={{ flex: 1 }} />
              <button className="bp" style={{ padding: "10px 20px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><Zap size={14} /> Generate</button>
            </div>
          </div>
          <div className="glass" style={{ padding: 20, borderRadius: 14 }}>
            <h4 className="sy" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Output</h4>
            <div style={{ padding: 16, borderRadius: 10, background: C.bgEl, minHeight: 150, fontSize: 13, color: C.txtD, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span>Generated content will appear here...</span>
            </div>
          </div>
        </div>
        <div style={{ width: 320 }}>
          <div className="glass" style={{ padding: 20, borderRadius: 14 }}>
            <h4 className="sy" style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Templates</h4>
            {templates.map((t, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 9, background: C.bgCard, border: `1px solid ${C.bdr}`, marginBottom: 8, cursor: "pointer", transition: "all .2s" }} onMouseEnter={e => (e.currentTarget.style.borderColor = C.teal + "40")} onMouseLeave={e => (e.currentTarget.style.borderColor = C.bdr)}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{t.t}</span>
                  <Badge style={{ fontSize: 9 }}>{t.cat}</Badge>
                </div>
                <div style={{ fontSize: 11, color: C.txtD }}>{t.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Files View (from Stackpost) ── */
const FilesView = () => {
  const files = [
    { name: "hook_title_v3.png", type: "image", size: "2.4 MB", date: "2h ago" },
    { name: "viral_clip_001.mp4", type: "video", size: "45 MB", date: "5h ago" },
    { name: "thumbnail_template.psd", type: "file", size: "12 MB", date: "1d ago" },
    { name: "captions_EN.srt", type: "file", size: "4 KB", date: "1d ago" },
    { name: "brand_watermark.png", type: "image", size: "180 KB", date: "3d ago" },
    { name: "background_music.mp3", type: "audio", size: "8.2 MB", date: "3d ago" },
  ];
  const iconMap: Record<string, any> = { image: Image, video: Video, file: FileText, audio: Music2 };
  const colorMap: Record<string, string> = { image: C.pink, video: C.teal, file: C.txtM, audio: C.lav };
  return (
    <div>
      <TopBar title="Files" sub="Manage your media library across local and cloud storage." />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["All Files", "Images", "Videos", "Audio"].map((f, i) => <button key={i} className="bs" style={{ padding: "6px 12px", fontSize: 11, ...(i === 0 ? { background: `${C.teal}10`, borderColor: `${C.teal}40`, color: C.teal } : {}) }}>{f}</button>)}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="bs" style={{ padding: "8px 14px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><Cloud size={14} /> Cloud Storage</button>
          <button className="bp" style={{ padding: "8px 14px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><UploadCloud size={14} /> Upload</button>
        </div>
      </div>
      <div className="glass" style={{ borderRadius: 14, overflow: "hidden" }}>
        {files.map((f, i) => {
          const Icon = iconMap[f.type] || FileText;
          return (
            <div key={i} style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, borderBottom: i < files.length - 1 ? `1px solid ${C.bdr}` : "none", cursor: "pointer", transition: "background .2s" }} onMouseEnter={e => (e.currentTarget.style.background = `${C.teal}05`)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${colorMap[f.type]}12`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={18} color={colorMap[f.type]} /></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{f.name}</div><div style={{ fontSize: 11, color: C.txtD }}>{f.size} · {f.date}</div></div>
              <div style={{ display: "flex", gap: 8 }}>
                <Download size={14} color={C.txtD} style={{ cursor: "pointer" }} />
                <Copy size={14} color={C.txtD} style={{ cursor: "pointer" }} />
                <Trash2 size={14} color={C.txtD} style={{ cursor: "pointer" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ── Team View (from Stackpost) ── */
const TeamView = () => {
  const members = [
    { name: "David Oladeji", role: "Owner", email: "david@clipmonk.dev", status: "active", color: C.amber },
    { name: "Sarah Chen", role: "Editor", email: "sarah@team.com", status: "active", color: C.teal },
    { name: "Marcus Rivera", role: "Publisher", email: "marcus@team.com", status: "active", color: C.lav },
    { name: "Aisha Patel", role: "Viewer", email: "aisha@team.com", status: "pending", color: C.pink },
  ];
  const roles = [
    { r: "Owner", d: "Full access to everything", perms: ["Clip", "Edit", "Publish", "Manage Team", "Billing", "Settings"] },
    { r: "Editor", d: "Create and edit clips", perms: ["Clip", "Edit", "Publish"] },
    { r: "Publisher", d: "Schedule and publish only", perms: ["Publish"] },
    { r: "Viewer", d: "View analytics only", perms: ["View Analytics"] },
  ];
  return (
    <div>
      <TopBar title="Team" sub="Manage your workspace and team members." />
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div className="glass" style={{ padding: 20, borderRadius: 14, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h4 className="sy" style={{ fontSize: 15, fontWeight: 700 }}>Members ({members.length})</h4>
              <button className="bp" style={{ padding: "8px 14px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}><Plus size={13} /> Invite Member</button>
            </div>
            {members.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < members.length - 1 ? `1px solid ${C.bdr}` : "none" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${m.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}><User size={16} color={m.color} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: C.txtD }}>{m.email}</div>
                </div>
                <Badge color={m.status === "active" ? C.ok : C.warn} style={{ fontSize: 10 }}>{m.status}</Badge>
                <select defaultValue={m.role} style={{ width: "auto", fontSize: 12, padding: "6px 10px" }}>
                  <option>Owner</option><option>Editor</option><option>Publisher</option><option>Viewer</option>
                </select>
              </div>
            ))}
          </div>
        </div>
        <div style={{ width: 320 }}>
          <div className="glass" style={{ padding: 20, borderRadius: 14 }}>
            <h4 className="sy" style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Role Permissions</h4>
            {roles.map((r, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 9, background: C.bgCard, marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{r.r}</div>
                <div style={{ fontSize: 11, color: C.txtD, marginBottom: 6 }}>{r.d}</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{r.perms.map((p, j) => <Badge key={j} style={{ fontSize: 9 }}>{p}</Badge>)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Settings View ── */
const SettingsView = () => (
  <div>
    <TopBar title="Settings" sub="Configure your workspace, billing, and integrations." />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
      {[
        { icon: User, t: "Profile", d: "Edit your name, avatar, timezone", c: C.teal },
        { icon: CreditCard, t: "Billing", d: "Manage subscription and payment methods", c: C.amber },
        { icon: Shield, t: "Security", d: "Two-factor auth and password", c: C.lav },
        { icon: Globe, t: "Integrations", d: "API keys and webhook configuration", c: C.teal },
        { icon: Bell, t: "Notifications", d: "Email and push notification preferences", c: C.amber },
        { icon: Palette, t: "Appearance", d: "Theme, branding, and watermark settings", c: C.lav },
        { icon: Database, t: "Storage", d: "Connect cloud storage providers", c: C.teal },
        { icon: Link2, t: "URL Shortener", d: "Configure Bitly, TinyURL, or Rebrandly", c: C.amber },
        { icon: LifeBuoy, t: "Support", d: "Contact us or browse the knowledge base", c: C.lav },
      ].map((s, i) => (
        <div key={i} className="glass lift" style={{ padding: 24, borderRadius: 14, cursor: "pointer" }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: `${s.c}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}><s.icon size={20} color={s.c} /></div>
          <h4 className="sy" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{s.t}</h4>
          <p style={{ fontSize: 12, color: C.txtM }}>{s.d}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Clip Editor (simplified from previous build) ── */
const EditorView = ({ sv }: { sv: (v: string) => void }) => {
  const [sel, setSel] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ct, setCt] = useState(0);
  const [tab, setTab] = useState("captions");
  const [ft, setFt] = useState(true);
  const [hook, setHook] = useState(true);
  const clips = [
    { t: "The jaw-dropping reveal", s: "2:34", e: "3:12", dur: "0:38", sc: 94 },
    { t: "Audience reaction moment", s: "7:45", e: "8:30", dur: "0:45", sc: 87 },
    { t: "The heated debate", s: "12:10", e: "12:55", dur: "0:45", sc: 82 },
    { t: "Emotional closing speech", s: "18:20", e: "19:05", dur: "0:45", sc: 76 },
  ];
  useEffect(() => { if (playing) { const i = setInterval(() => setCt(t => t >= 100 ? 0 : t + 1), 300); return () => clearInterval(i); } }, [playing]);

  return (
    <div>
      <TopBar title={`Editing: ${clips[sel].t}`} sub="Customize your clip with captions, face tracking, and hooks." />
      <div style={{ display: "flex", gap: 16, height: "calc(100vh - 150px)" }}>
        {/* Clip list */}
        <div style={{ width: 230, flexShrink: 0, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><h3 className="sy" style={{ fontSize: 14, fontWeight: 700 }}>AI Clips ({clips.length})</h3></div>
          {clips.map((c, i) => (
            <div key={i} onClick={() => { setSel(i); setCt(0); }} className="lift" style={{ padding: 12, borderRadius: 10, marginBottom: 6, background: sel === i ? `${C.teal}10` : C.bgCard, border: `1px solid ${sel === i ? C.teal + "30" : C.bdr}`, cursor: "pointer", transition: "all .2s" }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{c.t}</div>
              <div style={{ fontSize: 10, color: C.txtD, marginBottom: 6 }}>{c.s} — {c.e} · {c.dur}</div>
              <VMeter score={c.sc} />
            </div>
          ))}
        </div>
        {/* Preview */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: C.bgCard, borderRadius: 14, border: `1px solid ${C.bdr}`, position: "relative", overflow: "hidden" }}>
            <div style={{ width: 240, height: 426, borderRadius: 24, border: `3px solid ${C.bdrL}`, overflow: "hidden", position: "relative", background: `linear-gradient(180deg,${C.bgEl},${C.lav}08,${C.teal}05)` }}>
              {ft && <div style={{ position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)", width: 80, height: 80, borderRadius: "50%", border: `2px solid ${C.teal}60`, zIndex: 3, animation: "pulse-glow 2s ease-in-out infinite" }}><div style={{ position: "absolute", top: -7, right: -7, background: C.teal, borderRadius: 3, padding: "1px 5px", fontSize: 7, fontWeight: 700, color: C.bg }}>TRACKING</div></div>}
              {hook && <div style={{ position: "absolute", top: 190, left: 10, right: 10, zIndex: 4 }}><div style={{ background: `linear-gradient(135deg,${C.amber},#e55a2b)`, borderRadius: 8, padding: "8px 12px", textAlign: "center", fontWeight: 800, fontSize: 13, fontFamily: "'Syne',sans-serif", color: "#fff" }}>YOU WON'T BELIEVE THIS...</div></div>}
              <div style={{ position: "absolute", bottom: 50, left: 10, right: 10, textAlign: "center", zIndex: 4 }}><span style={{ display: "inline-block", background: "rgba(0,0,0,.75)", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 700 }}><span style={{ color: C.amber }}>You won't believe</span> what happened</span></div>
              <div onClick={() => setPlaying(!playing)} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2 }}>
                {!playing && <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(0,0,0,.5)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center" }}><Play size={20} color="#fff" fill="#fff" /></div>}
              </div>
            </div>
          </div>
          {/* Timeline */}
          <div style={{ marginTop: 12, padding: 12, background: C.bgCard, borderRadius: 10, border: `1px solid ${C.bdr}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <button onClick={() => setPlaying(!playing)} style={{ width: 28, height: 28, borderRadius: 7, background: C.teal, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{playing ? <Pause size={12} color={C.bg} /> : <Play size={12} color={C.bg} fill={C.bg} />}</button>
              <span style={{ fontSize: 11, fontFamily: "monospace", color: C.txtM }}>00:{String(Math.floor(ct * .38)).padStart(2, "0")} / 00:38</span>
            </div>
            <div style={{ height: 32, borderRadius: 5, background: C.bgEl, position: "relative", display: "flex", alignItems: "center", gap: 1, padding: "0 3px", cursor: "pointer" }} onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setCt(((e.clientX - r.left) / r.width) * 100); }}>
              {Array.from({ length: 70 }).map((_, i) => (<div key={i} style={{ width: 2.5, borderRadius: 1, background: i / 70 * 100 <= ct ? C.teal : `${C.txtD}40`, height: `${Math.random() * 60 + 20}%`, transition: "background .1s" }} />))}
              <div style={{ position: "absolute", left: `${ct}%`, top: 0, bottom: 0, width: 2, background: C.amber, zIndex: 2 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: C.amber, position: "absolute", top: -2, left: -2.5 }} /></div>
            </div>
          </div>
        </div>
        {/* Controls */}
        <div style={{ width: 270, flexShrink: 0, overflowY: "auto" }}>
          <div style={{ display: "flex", gap: 2, marginBottom: 12, background: C.bgCard, borderRadius: 8, padding: 2 }}>
            {[{ id: "captions", icon: Subtitles, l: "Captions" }, { id: "style", icon: Palette, l: "Style" }, { id: "hooks", icon: Target, l: "Hooks" }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "7px 3px", borderRadius: 6, border: "none", background: tab === t.id ? C.bgEl : "transparent", color: tab === t.id ? C.txt : C.txtM, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 3, fontFamily: "'Plus Jakarta Sans',sans-serif" }}><t.icon size={11} />{t.l}</button>
            ))}
          </div>
          {tab === "captions" && (
            <div className="glass" style={{ padding: 16, borderRadius: 12 }}>
              <h4 className="sy" style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Caption Style</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>
                {["Bold", "Karaoke", "Typewriter", "Minimal"].map(s => <div key={s} style={{ padding: 10, borderRadius: 8, border: `1px solid ${s === "Bold" ? C.teal + "50" : C.bdr}`, background: s === "Bold" ? `${C.teal}08` : C.bgCard, cursor: "pointer", textAlign: "center", fontSize: 12, fontWeight: 600 }}>{s}</div>)}
              </div>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 11, color: C.txtM, display: "block", marginBottom: 4 }}>Language</label><select><option>English</option><option>Spanish</option><option>Portuguese</option><option>French</option><option>Hindi</option><option>Japanese</option><option>Korean</option></select></div>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 11, color: C.txtM, display: "block", marginBottom: 4 }}>Highlight Color</label><div style={{ display: "flex", gap: 6 }}>{[C.amber, C.teal, C.lav, C.pink, C.warn, "#fff"].map(c => <div key={c} style={{ width: 24, height: 24, borderRadius: 6, background: c, cursor: "pointer", border: `2px solid ${C.bdr}` }} />)}</div></div>
            </div>
          )}
          {tab === "style" && (
            <div className="glass" style={{ padding: 16, borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, padding: 12, borderRadius: 8, background: C.bgCard }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Move size={14} color={C.teal} /><div><div style={{ fontSize: 12, fontWeight: 600 }}>Face Tracking</div><div style={{ fontSize: 10, color: C.txtD }}>Auto-center faces</div></div></div>
                <Toggle on={ft} onToggle={() => setFt(!ft)} />
              </div>
              <label style={{ fontSize: 11, color: C.txtM, display: "block", marginBottom: 4 }}>Background Blur</label>
              <input type="range" min="0" max="100" defaultValue="30" style={{ width: "100%", accentColor: C.teal, background: "transparent", border: "none", padding: 0, marginBottom: 12 }} />
              <label style={{ fontSize: 11, color: C.txtM, display: "block", marginBottom: 4 }}>Zoom Level</label>
              <input type="range" min="100" max="200" defaultValue="120" style={{ width: "100%", accentColor: C.amber, background: "transparent", border: "none", padding: 0 }} />
            </div>
          )}
          {tab === "hooks" && (
            <div className="glass" style={{ padding: 16, borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, padding: 12, borderRadius: 8, background: C.bgCard }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Target size={14} color={C.amber} /><div><div style={{ fontSize: 12, fontWeight: 600 }}>Hook Title</div></div></div>
                <Toggle on={hook} onToggle={() => setHook(!hook)} color={C.amber} />
              </div>
              {["YOU WON'T BELIEVE THIS...", "WAIT FOR IT... 🤯", "THIS CHANGES EVERYTHING", "THE MOMENT THAT BROKE THE INTERNET"].map((h, i) => (
                <div key={i} style={{ padding: 10, borderRadius: 7, background: i === 0 ? `${C.amber}10` : C.bgCard, border: `1px solid ${i === 0 ? C.amber + "30" : C.bdr}`, marginBottom: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", justifyContent: "space-between" }}>{h}{i === 0 && <Check size={12} color={C.amber} />}</div>
              ))}
            </div>
          )}
          <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
            <button className="bp" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, padding: "10px 8px" }}><Download size={13} /> Export</button>
            <button className="ba" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, padding: "10px 8px" }} onClick={() => sv("scheduler")}><Send size={13} /> Schedule</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Scheduler (from previous + Stackpost calendar) ── */
const SchedulerView = () => {
  const [selDay, setSelDay] = useState(16);
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const posts = [
    { day: 16, time: "9:00 AM", t: "The jaw-dropping reveal", ps: ["youtube", "tiktok"], st: "ready" },
    { day: 16, time: "2:00 PM", t: "Audience reaction moment", ps: ["instagram"], st: "ready" },
    { day: 18, time: "10:00 AM", t: "The heated debate", ps: ["youtube", "tiktok", "instagram"], st: "scheduled" },
    { day: 20, time: "6:00 PM", t: "AI Generated: Trending topics post", ps: ["facebook", "linkedin"], st: "scheduled" },
    { day: 22, time: "11:00 AM", t: "Behind the scenes chaos", ps: ["youtube", "instagram"], st: "draft" },
  ];
  const dayPosts = posts.filter(p => p.day === selDay);
  const daysWithPosts = [...new Set(posts.map(p => p.day))];
  return (
    <div>
      <TopBar title="Schedule & Post" sub="Plan your content calendar across all platforms." />
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div className="glass" style={{ padding: 20, borderRadius: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <button style={{ background: "none", border: "none", color: C.txtM, cursor: "pointer" }}><ChevronLeft size={18} /></button>
              <h3 className="sy" style={{ fontSize: 16, fontWeight: 700 }}>April 2026</h3>
              <button style={{ background: "none", border: "none", color: C.txtM, cursor: "pointer" }}><ChevronRight size={18} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 6 }}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: C.txtD, padding: "6px 0" }}>{d}</div>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
              {[null, null].map((_, i) => <div key={`e-${i}`} />)}
              {days.map(day => {
                const has = daysWithPosts.includes(day);
                const isSel = day === selDay;
                const isToday = day === 16;
                return (
                  <div key={day} onClick={() => setSelDay(day)} style={{ aspectRatio: "1", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: isSel ? `${C.teal}15` : "transparent", border: `1px solid ${isSel ? C.teal + "40" : isToday ? C.amber + "30" : "transparent"}`, transition: "all .2s" }}>
                    <span style={{ fontSize: 13, fontWeight: isToday ? 700 : 400, color: isSel ? C.teal : isToday ? C.amber : C.txt }}>{day}</span>
                    {has && <div style={{ display: "flex", gap: 2, marginTop: 3 }}>{posts.filter(p => p.day === day).map((_, i) => <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: C.teal }} />)}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{ width: 360 }}>
          <div className="glass" style={{ padding: 20, borderRadius: 14, marginBottom: 14 }}>
            <h3 className="sy" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>April {selDay}, 2026</h3>
            <p style={{ fontSize: 12, color: C.txtM, marginBottom: 16 }}>{dayPosts.length} post{dayPosts.length !== 1 ? "s" : ""} scheduled</p>
            {dayPosts.length > 0 ? dayPosts.map((p, i) => (
              <div key={i} style={{ padding: 14, borderRadius: 10, background: C.bgCard, border: `1px solid ${C.bdr}`, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><Badge color={C.teal} style={{ fontSize: 9 }}>{p.time}</Badge><Badge color={p.st === "ready" ? C.ok : C.warn} style={{ fontSize: 9 }}>{p.st}</Badge></div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{p.t}</div>
                <div style={{ display: "flex", gap: 6 }}>{p.ps.map(plt => <PIcon key={plt} p={plt} size={14} />)}</div>
              </div>
            )) : <div style={{ padding: 30, textAlign: "center", color: C.txtD }}><CalendarDays size={28} style={{ marginBottom: 8, opacity: .3 }} /><div style={{ fontSize: 13 }}>No posts scheduled</div></div>}
            <button className="bp" style={{ width: "100%", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12 }}><Plus size={13} /> Schedule New Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Analytics ── */
const AnalyticsView = () => {
  const [tr, setTr] = useState("30d");
  const chart = [{ l: "Mon", v: 78 }, { l: "Tue", v: 92 }, { l: "Wed", v: 65 }, { l: "Thu", v: 88 }, { l: "Fri", v: 100 }, { l: "Sat", v: 72 }, { l: "Sun", v: 85 }];
  const plats = [
    { p: "youtube", views: "5.2M", growth: "+42%", eng: "8.3%", subs: "+12.4K" },
    { p: "tiktok", views: "4.8M", growth: "+67%", eng: "12.1%", subs: "+28.7K" },
    { p: "instagram", views: "2.4M", growth: "+23%", eng: "6.7%", subs: "+8.2K" },
    { p: "facebook", views: "1.1M", growth: "+18%", eng: "4.2%", subs: "+5.1K" },
    { p: "linkedin", views: "320K", growth: "+31%", eng: "3.8%", subs: "+2.4K" },
  ];
  return (
    <div>
      <TopBar title="Analytics" sub="Track performance across all platforms." />
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: C.bgCard, borderRadius: 8, padding: 2, width: "fit-content" }}>
        {["7d", "30d", "90d", "All"].map(t => <button key={t} onClick={() => setTr(t)} style={{ padding: "7px 14px", borderRadius: 6, border: "none", background: tr === t ? C.bgEl : "transparent", color: tr === t ? C.txt : C.txtM, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{t}</button>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard icon={Eye} value="12.4M" label="Total Views" color={C.teal} />
        <StatCard icon={Heart} value="389K" label="Total Likes" color={C.err} />
        <StatCard icon={Share2} value="95K" label="Total Shares" color={C.amber} />
        <StatCard icon={TrendingUp} value="49.2K" label="New Followers" color={C.ok} />
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div className="glass" style={{ padding: 20, borderRadius: 14, marginBottom: 16 }}>
            <h3 className="sy" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Views This Week</h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160 }}>
              {chart.map((d, i) => (<div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}><span style={{ fontSize: 10, color: C.txtM }}>{Math.round(d.v * 124)}K</span><div style={{ width: "100%", height: `${d.v}%`, borderRadius: 6, background: `linear-gradient(180deg,${C.teal},${C.teal}60)`, minHeight: 6 }} /><span style={{ fontSize: 10, color: C.txtD }}>{d.l}</span></div>))}
            </div>
          </div>
          <div className="glass" style={{ padding: 20, borderRadius: 14 }}>
            <h3 className="sy" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Platform Breakdown</h3>
            {plats.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < plats.length - 1 ? `1px solid ${C.bdr}` : "none" }}>
                <PIcon p={p.p} size={20} />
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{p.p}</div><div style={{ fontSize: 11, color: C.txtD }}>{p.views} views</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 13, fontWeight: 600, color: C.ok }}>{p.growth}</div><div style={{ fontSize: 9, color: C.txtD }}>Growth</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 13, fontWeight: 600 }}>{p.eng}</div><div style={{ fontSize: 9, color: C.txtD }}>Engagement</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 13, fontWeight: 600, color: C.teal }}>{p.subs}</div><div style={{ fontSize: 9, color: C.txtD }}>Followers</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ width: 320 }}>
          <div className="glass" style={{ padding: 20, borderRadius: 14, marginBottom: 14 }}>
            <h3 className="sy" style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Top Clips</h3>
            {[{ t: "The jaw-dropping reveal", v: "2.4M", l: "180K", p: "tiktok" }, { t: "Audience reaction", v: "1.8M", l: "142K", p: "youtube" }, { t: "The heated debate", v: "890K", l: "67K", p: "instagram" }].map((c, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 10, background: C.bgCard, marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><span className="sy" style={{ fontSize: 18, fontWeight: 800, color: i === 0 ? C.amber : C.txtD, width: 24 }}>#{i + 1}</span><span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>{c.t}</span><PIcon p={c.p} size={12} /></div>
                <div style={{ display: "flex", gap: 12, paddingLeft: 32 }}><div style={{ display: "flex", alignItems: "center", gap: 3 }}><Eye size={10} color={C.txtD} /><span style={{ fontSize: 11, color: C.txtM }}>{c.v}</span></div><div style={{ display: "flex", alignItems: "center", gap: 3 }}><Heart size={10} color={C.txtD} /><span style={{ fontSize: 11, color: C.txtM }}>{c.l}</span></div></div>
              </div>
            ))}
          </div>
          <div className="glass" style={{ padding: 16, borderRadius: 14 }}>
            <h4 className="sy" style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}><Zap size={12} color={C.amber} style={{ marginRight: 4 }} />Best Posting Times</h4>
            {[{ d: "Tuesday", t: "9:00 AM", s: 94 }, { d: "Friday", t: "6:00 PM", s: 91 }, { d: "Sunday", t: "11:00 AM", s: 87 }].map((t, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? `1px solid ${C.bdr}` : "none" }}>
                <div><div style={{ fontSize: 12, fontWeight: 600 }}>{t.d}</div><div style={{ fontSize: 10, color: C.txtD }}>{t.t}</div></div>
                <div style={{ width: 70 }}><VMeter score={t.s} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── New Project (video import flow) ── */
const NewProjectView = ({ sv }: { sv: (v: string) => void }) => {
  const [url, setUrl] = useState("");
  const [proc, setProc] = useState(false);
  const [prog, setProg] = useState(0);
  const [step, setStep] = useState(0);
  const steps = ["Downloading video...", "Transcribing audio...", "Analyzing for viral moments...", "Generating clips..."];
  const go = () => { if (!url && !proc) { setProc(true); } else if (url) { setProc(true); } setProg(0); setStep(0); const iv = setInterval(() => { setProg(p => { if (p >= 100) { clearInterval(iv); setTimeout(() => sv("editor"), 500); return 100; } if (p > 75) setStep(3); else if (p > 50) setStep(2); else if (p > 25) setStep(1); return p + 2; }); }, 100); };
  return (
    <div>
      <TopBar title="New Project" sub="Paste a URL or upload a video to start clipping." />
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {!proc ? (<>
          <div className="glass" style={{ padding: 28, borderRadius: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><Link size={18} color={C.teal} /><h3 className="sy" style={{ fontSize: 16, fontWeight: 700 }}>Paste Video URL</h3></div>
            <div style={{ display: "flex", gap: 10 }}><input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." style={{ flex: 1 }} /><button className="bp" onClick={go} style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}><Zap size={14} /> Analyze</button></div>
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>{["YouTube", "Twitch", "Vimeo", "Direct URL"].map(p => <Badge key={p} style={{ fontSize: 10, cursor: "pointer" }}>{p}</Badge>)}</div>
          </div>
          <div className="glass" style={{ padding: 40, borderRadius: 16, textAlign: "center", border: `2px dashed ${C.bdrL}`, cursor: "pointer", marginBottom: 20 }} onClick={go}>
            <Upload size={36} color={C.txtD} style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Drop your video here or click to browse</div>
            <div style={{ fontSize: 12, color: C.txtD }}>MP4, MOV, WebM, MKV up to 2GB</div>
          </div>
          <div className="glass" style={{ padding: 20, borderRadius: 16 }}>
            <h3 className="sy" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Clip Settings</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={{ fontSize: 11, color: C.txtM, display: "block", marginBottom: 4 }}>Aspect Ratio</label><select><option>9:16 (Shorts/TikTok/Reels)</option><option>1:1 (Square)</option><option>16:9 (Landscape)</option></select></div>
              <div><label style={{ fontSize: 11, color: C.txtM, display: "block", marginBottom: 4 }}>Duration</label><select><option>30-60 seconds</option><option>15-30 seconds</option><option>60-90 seconds</option></select></div>
              <div><label style={{ fontSize: 11, color: C.txtM, display: "block", marginBottom: 4 }}>Captions</label><select><option>English</option><option>Auto-detect</option><option>Spanish</option></select></div>
              <div><label style={{ fontSize: 11, color: C.txtM, display: "block", marginBottom: 4 }}># of Clips</label><select><option>Auto (AI decides)</option><option>Up to 5</option><option>Up to 10</option></select></div>
            </div>
          </div>
        </>) : (
          <div className="glass" style={{ padding: 50, borderRadius: 16, textAlign: "center" }}>
            <div style={{ width: 90, height: 90, margin: "0 auto 28px", position: "relative" }}>
              <div style={{ width: 90, height: 90, borderRadius: "50%", border: `3px solid ${C.bdr}`, borderTopColor: C.teal, animation: "spin-slow 1s linear infinite", position: "absolute" }} />
              <div style={{ width: 60, height: 60, borderRadius: "50%", border: `3px solid ${C.bdr}`, borderTopColor: C.amber, animation: "spin-slow 1.5s linear infinite reverse", position: "absolute", top: 15, left: 15 }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><span className="sy" style={{ fontSize: 18, fontWeight: 800 }}>{Math.round(prog)}%</span></div>
            </div>
            <h3 className="sy" style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Analyzing Your Video</h3>
            <p style={{ fontSize: 13, color: C.teal, marginBottom: 20 }}>{steps[step]}</p>
            <div style={{ height: 5, borderRadius: 3, background: C.bgEl, overflow: "hidden", maxWidth: 380, margin: "0 auto" }}><div style={{ width: `${prog}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg,${C.teal},${C.lav})`, transition: "width .3s" }} /></div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Projects ── */
const ProjectsView = ({ sv }: { sv: (v: string) => void }) => {
  const projs = [
    { t: "MrBeast Survival Challenge", clips: 8, views: "2.4M", date: "Apr 14", c: C.teal, st: "published" },
    { t: "Tech Review Compilation", clips: 5, views: "890K", date: "Apr 12", c: C.amber, st: "scheduled" },
    { t: "Cooking Stream Highlights", clips: 12, views: "1.2M", date: "Apr 10", c: C.lav, st: "draft" },
    { t: "Gaming Tournament Finals", clips: 6, views: "456K", date: "Apr 8", c: C.ok, st: "processing" },
    { t: "Podcast Episode #47", clips: 4, views: "234K", date: "Apr 5", c: C.err, st: "published" },
    { t: "Travel Vlog Berlin", clips: 9, views: "1.7M", date: "Apr 2", c: C.pink, st: "published" },
  ];
  const stC: Record<string, string> = { published: C.ok, scheduled: C.warn, draft: C.txtM, processing: C.lav };
  return (
    <div>
      <TopBar title="Projects" sub="All your video clipping projects." />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 6 }}>{["All", "Published", "Scheduled", "Drafts"].map((f, i) => <button key={f} className="bs" style={{ padding: "5px 12px", fontSize: 11, ...(i === 0 ? { background: `${C.teal}10`, borderColor: `${C.teal}40`, color: C.teal } : {}) }}>{f}</button>)}</div>
        <button className="bp" style={{ padding: "7px 14px", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }} onClick={() => sv("new-project")}><Plus size={13} /> New</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {projs.map((p, i) => (
          <div key={i} className="glass lift" style={{ borderRadius: 14, overflow: "hidden", cursor: "pointer" }} onClick={() => sv("editor")}>
            <div style={{ height: 140, background: `linear-gradient(135deg,${p.c}15,${p.c}08)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <Film size={36} color={`${p.c}60`} /><Badge color={stC[p.st]} style={{ position: "absolute", top: 10, right: 10, fontSize: 9 }}>{p.st}</Badge>
            </div>
            <div style={{ padding: 16 }}><h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{p.t}</h4><div style={{ fontSize: 11, color: C.txtD, marginBottom: 10 }}>{p.date}</div><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 11, color: C.txtM }}><Scissors size={10} /> {p.clips} clips</span><span style={{ fontSize: 11, color: C.txtM }}><Eye size={10} /> {p.views}</span></div></div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   APP SHELL
   ═══════════════════════════════════════════════════════════════ */

const AppShell = () => {
  const [view, setView] = useState("dashboard");
  const rv = () => {
    switch (view) {
      case "dashboard": return <DashboardView sv={setView} />;
      case "new-project": return <NewProjectView sv={setView} />;
      case "editor": return <EditorView sv={setView} />;
      case "accounts": return <AccountsView />;
      case "compose": return <ComposeView />;
      case "ai": return <AIStudioView />;
      case "scheduler": return <SchedulerView />;
      case "analytics": return <AnalyticsView />;
      case "files": return <FilesView />;
      case "team": return <TeamView />;
      case "settings": return <SettingsView />;
      case "projects": return <ProjectsView sv={setView} />;
      default: return <DashboardView sv={setView} />;
    }
  };
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar view={view} setView={setView} />
      <div style={{ flex: 1, marginLeft: 220, padding: 28, maxHeight: "100vh", overflowY: "auto" }}>{rv()}</div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════ */

export default function ClipMonkApp() {
  const [page, setPage] = useState("landing");
  return (
    <>
      <Styles />
      <div className="grain" />
      {page === "landing" ? <Landing go={setPage} /> : <AppShell />}
    </>
  );
}

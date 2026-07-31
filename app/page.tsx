"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Heart,
  Home,
  LockKeyhole,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Sparkles,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Screen =
  | "welcome"
  | "privacy"
  | "bodyScan"
  | "profile"
  | "garmentScan"
  | "result"
  | "compare"
  | "closet";
type Size = "S" | "M" | "L";

const fitData: Record<
  Size,
  {
    title: string;
    subtitle: string;
    confidence: number;
    note: string;
    areas: { label: string; value: string; tone: "good" | "watch" }[];
  }
> = {
  S: {
    title: "Close fit, two watchouts",
    subtitle: "Better at the waist",
    confidence: 76,
    note: "The waist is sharper, but the shoulders and chest may restrict movement.",
    areas: [
      { label: "Shoulders", value: "Too snug", tone: "watch" },
      { label: "Chest", value: "Fitted", tone: "watch" },
      { label: "Sleeves", value: "Perfect", tone: "good" },
      { label: "Waist", value: "Tailored", tone: "good" },
    ],
  },
  M: {
    title: "Good fit, with one watchout",
    subtitle: "Best overall fit",
    confidence: 92,
    note: "Size S would fit closer at the waist but may feel tight at the shoulders.",
    areas: [
      { label: "Shoulders", value: "Perfect", tone: "good" },
      { label: "Chest", value: "Comfortable", tone: "good" },
      { label: "Sleeves", value: "1.2 in long", tone: "watch" },
      { label: "Waist", value: "Relaxed", tone: "good" },
    ],
  },
  L: {
    title: "Roomy through the body",
    subtitle: "Too loose overall",
    confidence: 68,
    note: "The extra room changes the jacket’s intended structure through the chest and waist.",
    areas: [
      { label: "Shoulders", value: "Slightly wide", tone: "watch" },
      { label: "Chest", value: "Loose", tone: "watch" },
      { label: "Sleeves", value: "2 in long", tone: "watch" },
      { label: "Waist", value: "Very relaxed", tone: "good" },
    ],
  },
};

const scanSteps = ["Scanning proportions", "Mapping fit preferences", "Creating Fit Check"];
const preferences = [
  "Relaxed around waist",
  "Fitted at shoulders",
  "Full-length trousers",
  "Avoid tight sleeves",
];

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <ScanLine size={15} strokeWidth={2.4} />
      </span>
      <span>FIT CHECK</span>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="icon-button" onClick={onClick} aria-label="Go back">
      <ArrowLeft size={19} />
    </button>
  );
}

function PhoneHeader({
  back,
  step,
}: {
  back?: () => void;
  step?: string;
}) {
  return (
    <header className="phone-header">
      {back ? <BackButton onClick={back} /> : <Brand />}
      {step && <span className="eyebrow">{step}</span>}
      {back && <span className="header-spacer" />}
    </header>
  );
}

function GarmentImage({ size = "M", mapped = false }: { size?: Size; mapped?: boolean }) {
  const scale = size === "S" ? 0.91 : size === "L" ? 1.08 : 1;
  return (
    <motion.div
      className={`garment-visual ${mapped ? "mapped" : ""}`}
      animate={{ scale }}
      transition={{ type: "spring", stiffness: 210, damping: 22 }}
    >
      <img src="/linen-jacket.png" alt="Structured natural linen jacket" />
      {mapped && (
        <>
          <span className="map-zone shoulders" />
          <span className="map-zone sleeve" />
          <span className="map-zone waist" />
          <span className="map-dot dot-one" />
          <span className="map-dot dot-two" />
        </>
      )}
    </motion.div>
  );
}

function BottomNav({
  current,
  onNavigate,
}: {
  current: Screen;
  onNavigate: (screen: Screen) => void;
}) {
  const items = [
    { label: "Fit Check", icon: WalletCards, screen: "profile" as Screen },
    { label: "Scan", icon: ScanLine, screen: "garmentScan" as Screen, primary: true },
    { label: "Closet", icon: Shirt, screen: "closet" as Screen },
    { label: "Profile", icon: UserRound, screen: "profile" as Screen },
  ];
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map((item) => {
        const active =
          current === item.screen ||
          (item.label === "Scan" && ["garmentScan", "result", "compare"].includes(current));
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            className={`${active ? "active" : ""} ${item.primary ? "scan-nav" : ""}`}
            onClick={() => onNavigate(item.screen)}
          >
            <span><Icon size={item.primary ? 22 : 20} /></span>
            <small>{item.label}</small>
          </button>
        );
      })}
    </nav>
  );
}

function Welcome({ onNext, onDemo }: { onNext: () => void; onDemo: () => void }) {
  return (
    <motion.section className="screen welcome-screen" {...screenMotion}>
      <div className="welcome-top"><Brand /><span className="private-badge"><LockKeyhole size={12} /> Private by design</span></div>
      <div className="label-orbit" aria-label="Sizes S, M, 6, 8, and 28 become one personal Fit Check">
        {["S", "M", "6", "8", "28"].map((label, index) => (
          <motion.span
            key={label}
            className={`size-label label-${index + 1}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + index * 0.09, type: "spring" }}
          >
            {label}
          </motion.span>
        ))}
        <motion.div className="pass-token" animate={{ rotate: [0, 2, 0] }} transition={{ duration: 4, repeat: Infinity }}>
          <div className="token-top"><Brand /><ShieldCheck size={20} /></div>
          <div className="body-glyph"><span /><i /><b /></div>
          <div><small>PERSONAL FIT PROFILE</small><strong>ONE FIT, EVERY BRAND</strong></div>
        </motion.div>
      </div>
      <div className="welcome-copy">
        <span className="eyebrow accent">ONE PROFILE · EVERY BRAND</span>
        <h1>Your size changes.<br />Your body doesn’t.</h1>
        <p>Create one private Fit Check and use it across every brand.</p>
        <div className="peer-proof"><span><UserRound size={13} /></span> Fit signals from people built like you—never their bodies.</div>
      </div>
      <div className="action-stack">
        <button className="button primary" onClick={onNext}>Create my Fit Check <ArrowRight size={18} /></button>
        <button className="button text-button" onClick={onDemo}>Try demo <Sparkles size={15} /></button>
      </div>
    </motion.section>
  );
}

function Privacy({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const points = [
    ["Stored privately", "Your body profile stays encrypted on this device.", LockKeyhole],
    ["Matched without exposure", "Compare fit signals, never bodies or measurements.", ScanLine],
    ["Revoke access anytime", "You stay in control of every connection.", RotateCcw],
  ] as const;
  return (
    <motion.section className="screen" {...screenMotion}>
      <PhoneHeader back={onBack} step="01 / 03" />
      <div className="privacy-hero">
        <div className="privacy-orb"><ShieldCheck size={42} /><span /></div>
        <span className="eyebrow accent">PRIVATE BY DEFAULT</span>
        <h2>Your measurements<br />stay with you.</h2>
        <p>Stores only receive the result they need. Anonymous fit matching finds people built like you without revealing anyone’s body.</p>
      </div>
      <div className="privacy-points">
        {points.map(([title, copy, Icon]) => (
          <div className="privacy-row" key={title}>
            <span className="point-icon"><Icon size={18} /></span>
            <div><strong>{title}</strong><p>{copy}</p></div>
            <Check size={16} className="point-check" />
          </div>
        ))}
      </div>
      <button className="button primary bottom-action" onClick={onNext}>Continue <ArrowRight size={18} /></button>
    </motion.section>
  );
}

function BodyScan({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (phase >= 4) return;
    const timer = window.setTimeout(() => setPhase((p) => p + 1), phase === 0 ? 850 : 1050);
    return () => window.clearTimeout(timer);
  }, [phase]);
  const ready = phase >= 4;
  return (
    <motion.section className="screen scan-screen" {...screenMotion}>
      <PhoneHeader back={onBack} step="02 / 03" />
      <div className="scan-copy">
        <span className="eyebrow accent">{ready ? "SCAN COMPLETE" : "BODY SCAN"}</span>
        <h2>{ready ? "Your Fit Check is ready" : "Let’s map how clothes fit you."}</h2>
        <p>{ready ? "Your private fit profile was created on this device." : "Move naturally. This is about proportion and preference—not a number."}</p>
      </div>
      <div className={`scan-stage ${ready ? "complete" : ""}`}>
        <div className="scan-corners"><i /><i /><i /><i /></div>
        <div className="scan-figure">
          <span className="figure-head" />
          <span className="figure-body" />
          <span className="figure-leg left" />
          <span className="figure-leg right" />
        </div>
        {!ready && <motion.div className="scan-line" animate={{ top: ["14%", "83%", "14%"] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }} />}
        {ready && <motion.div className="ready-check" initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={28} /></motion.div>}
        <div className="scan-progress">
          {scanSteps.map((step, index) => (
            <div className={phase > index ? "done" : phase === index + 1 ? "active" : ""} key={step}>
              <span>{phase > index + 1 || ready ? <Check size={12} /> : index + 1}</span>{step}
            </div>
          ))}
        </div>
      </div>
      <div className="instruction-row">
        <span>6 ft away</span><span>Turn slowly</span><span>Fitted clothing</span>
      </div>
      <button className="button primary bottom-action" disabled={!ready} onClick={onDone}>
        View my Fit Check <ArrowRight size={18} />
      </button>
    </motion.section>
  );
}

function Profile({ onScan }: { onScan: () => void }) {
  const [selected, setSelected] = useState(preferences);
  const toggle = (item: string) =>
    setSelected((current) => current.includes(item) ? current.filter((x) => x !== item) : [...current, item]);
  return (
    <motion.section className="screen content-screen" {...screenMotion}>
      <div className="profile-header"><Brand /><button className="avatar" aria-label="Profile">A</button></div>
      <div className="profile-intro">
        <span className="eyebrow accent">YOUR FIT CHECK</span>
        <h2>Made for how<br />you like to dress.</h2>
      </div>
      <div className="profile-card">
        <div className="mini-body"><span /><i /><b /></div>
        <div className="profile-card-copy"><small>PRIVATE FIT PROFILE</small><strong>Balanced · Relaxed</strong><p>18 anonymous body-similarity matches</p></div>
        <span className="live-pill"><i /> ACTIVE</span>
      </div>
      <div className="section-heading"><div><span className="eyebrow">FIT PREFERENCES</span><p>Tap to adjust</p></div></div>
      <div className="chip-grid">
        {preferences.map((item) => (
          <button key={item} className={selected.includes(item) ? "selected" : ""} onClick={() => toggle(item)}>
            {selected.includes(item) && <Check size={14} />}{item}
          </button>
        ))}
      </div>
      <div className="share-card">
        <span><ShieldCheck size={20} /></span>
        <div><strong>Only fit results are shared</strong><p>Your measurements never leave this device.</p></div>
        <ChevronRight size={18} />
      </div>
      <button className="button primary" onClick={onScan}><ScanLine size={18} /> Scan a garment</button>
    </motion.section>
  );
}

function GarmentScan({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const timer = useRef<number | null>(null);
  const start = () => {
    if (complete) return;
    const started = Date.now();
    timer.current = window.setInterval(() => {
      const next = Math.min(100, ((Date.now() - started) / 1300) * 100);
      setProgress(next);
      if (next >= 100) {
        if (timer.current) window.clearInterval(timer.current);
        setComplete(true);
        window.setTimeout(onComplete, 850);
      }
    }, 30);
  };
  const stop = () => {
    if (timer.current) window.clearInterval(timer.current);
    if (!complete) setProgress(0);
  };
  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);
  return (
    <motion.section className={`screen garment-scan-screen ${complete ? "success" : ""}`} {...screenMotion}>
      <PhoneHeader step="IN STORE" />
      <div className="scan-copy centered">
        <span className="eyebrow accent">GARMENT TAP</span>
        <h2>{complete ? "Garment received" : "Bring the tag close."}</h2>
        <p>{complete ? "Comparing the jacket with your private Fit Check…" : "Press and hold below to simulate an NFC garment tap."}</p>
      </div>
      <div className="nfc-stage">
        <motion.div className="physical-tag" animate={complete ? { x: 25, y: 8, rotate: 4, scale: 0.82, opacity: 0 } : { y: [0, -6, 0] }} transition={{ duration: 1.8, repeat: complete ? 0 : Infinity }}>
          <span>NORTH<br />STUDIO</span><b>M</b><small>STRUCTURED LINEN</small>
        </motion.div>
        <div className="nfc-waves"><i /><i /><i /></div>
        <div className="phone-frame">
          <div className="phone-island" />
          <AnimatePresence mode="wait">
            {complete ? (
              <motion.div key="garment" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} className="phone-garment">
                <GarmentImage />
                <strong>Structured Linen Jacket</strong><small>North Studio · Size M</small>
              </motion.div>
            ) : (
              <motion.div key="ready" className="phone-ready" exit={{ opacity: 0 }}><ScanLine size={38} /><span>Ready to receive</span></motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <button
        className={`hold-button ${progress > 0 ? "holding" : ""}`}
        style={{ "--hold": `${progress}%` } as React.CSSProperties}
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") start(); }}
        onKeyUp={stop}
      >
        <span><ScanLine size={20} /></span>{complete ? "Tap complete" : "Press & hold to tap garment"}
      </button>
      <small className="hold-hint">Keep holding until the ring completes</small>
    </motion.section>
  );
}

function FitResult({
  size,
  onSize,
  onCompare,
  onSave,
}: {
  size: Size;
  onSize: (size: Size) => void;
  onCompare: () => void;
  onSave: () => void;
}) {
  const data = fitData[size];
  const [added, setAdded] = useState(false);
  return (
    <motion.section className="screen result-screen" {...screenMotion}>
      <PhoneHeader step="FIT RESULT" />
      <div className="result-head">
        <div><span className="eyebrow accent">NORTH STUDIO</span><h2>{data.title}</h2></div>
        <div className="confidence"><strong>{data.confidence}%</strong><small>CONFIDENCE</small></div>
      </div>
      <div className="result-visual">
        <div className="garment-backdrop"><span className="body-outline" /><GarmentImage size={size} mapped /></div>
        <div className="size-switcher">
          {(["S", "M", "L"] as Size[]).map((item) => (
            <button className={size === item ? "active" : ""} onClick={() => onSize(item)} key={item}>{item}</button>
          ))}
        </div>
        <span className="product-caption">Structured Linen Jacket · Size {size}</span>
      </div>
      <div className="recommendation">
        <span><Check size={15} /></span><div><small>RECOMMENDED</small><strong>Size M</strong></div>
      </div>
      <div className="peer-result">
        <div className="peer-avatars"><span>A</span><span>N</span><span>J</span></div>
        <div><small>PRIVATE FIT CIRCLE</small><strong>3 people built like you kept size {size}</strong><p>Anonymous match · no measurements shared</p></div>
        <ShieldCheck size={18} />
      </div>
      <div className="fit-areas">
        {data.areas.map((area) => (
          <div key={area.label}><span>{area.label}</span><strong className={area.tone}>{area.value}</strong></div>
        ))}
      </div>
      <p className="size-insight">{data.note}</p>
      <div className="result-actions">
        <button className="button secondary" onClick={onCompare}>Compare sizes</button>
        <button className="button icon-action" onClick={onSave} aria-label="Save this fit"><Heart size={19} /></button>
        <button className="button primary cart-button" onClick={() => setAdded(true)}>
          {added ? <><Check size={18} /> Added</> : <><ShoppingBag size={18} /> Add to cart</>}
        </button>
      </div>
    </motion.section>
  );
}

function Compare({ selected, onSelect, onBack }: { selected: Size; onSelect: (size: Size) => void; onBack: () => void }) {
  const summaries = {
    S: ["Better at waist", "Tight at shoulders"],
    M: ["Best overall fit", "Balanced everywhere"],
    L: ["Roomy silhouette", "Loose through body"],
  };
  return (
    <motion.section className="screen content-screen compare-screen" {...screenMotion}>
      <PhoneHeader back={onBack} step="COMPARE FIT" />
      <div className="compare-head"><span className="eyebrow accent">STRUCTURED LINEN JACKET</span><h2>Three sizes.<br />One clear choice.</h2><p>See how each size changes the silhouette—not your body.</p></div>
      <div className="compare-cards">
        {(["S", "M", "L"] as Size[]).map((size) => (
          <button key={size} className={`${selected === size ? "selected" : ""} ${size === "M" ? "recommended" : ""}`} onClick={() => onSelect(size)}>
            {size === "M" && <span className="recommend-tab">BEST FIT</span>}
            <div className="compare-visual"><GarmentImage size={size} /></div>
            <div className="compare-label"><strong>{size}</strong><span>{fitData[size].confidence}%</span></div>
            <p>{summaries[size][0]}</p><small>{summaries[size][1]}</small>
            <i>{selected === size && <Check size={14} />}</i>
          </button>
        ))}
      </div>
      <div className="comparison-summary">
        <div className="summary-score"><strong>{fitData[selected].confidence}</strong><span>%<br /><small>FIT MATCH</small></span></div>
        <div><small>SIZE {selected} · {selected === "M" ? "3 PEER MATCHES" : "1 PEER MATCH"}</small><strong>{fitData[selected].subtitle}</strong><p>{fitData[selected].note}</p></div>
      </div>
      <button className="button primary" onClick={onBack}>Choose size {selected} <ArrowRight size={18} /></button>
    </motion.section>
  );
}

function Closet({ onOpen }: { onOpen: () => void }) {
  const items = [
    ["Linen Jacket", "North Studio", "Best fit", "best"],
    ["Wide-leg Trousers", "Atelier West", "Needs hemming", "watch"],
    ["Rib Knit Top", "Morrow", "Tight at arms", "watch"],
    ["Running Shoes", "Vela", "Size up", "neutral"],
  ];
  return (
    <motion.section className="screen content-screen closet-screen" {...screenMotion}>
      <div className="profile-header"><Brand /><button className="icon-button"><Heart size={18} /></button></div>
      <div className="closet-head"><span className="eyebrow accent">SAVED CLOSET</span><h2>Your fits,<br />remembered.</h2><p>Four pieces scanned across three brands.</p></div>
      <div className="closet-list">
        {items.map(([name, brand, fit, tone], index) => (
          <button key={name} onClick={index === 0 ? onOpen : undefined}>
            <div className={`closet-thumb thumb-${index}`}>{index === 0 ? <img src="/linen-jacket.png" alt="" /> : <Shirt size={26} />}</div>
            <div><small>{brand}</small><strong>{name}</strong><span className={tone}>{fit}</span></div>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>
      <div className="closet-note"><Sparkles size={18} /><p>Your Fit Check gets more useful as you save what works.</p></div>
    </motion.section>
  );
}

const screenMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.32, ease: "easeOut" as const },
};

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [size, setSize] = useState<Size>("M");
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const state = window.localStorage.getItem("fit-check-demo");
    if (state) {
      try {
        const parsed = JSON.parse(state);
        setScreen(parsed.screen ?? "welcome");
        setSize(parsed.size ?? "M");
        setSaved(Boolean(parsed.saved));
      } catch {}
    }
  }, []);
  useEffect(() => {
    window.localStorage.setItem("fit-check-demo", JSON.stringify({ screen, size, saved }));
  }, [screen, size, saved]);
  const navigate = (next: Screen) => {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };
  const saveFit = () => {
    setSaved(true);
    showToast("Saved to your closet");
  };
  const demo = () => {
    setSize("M");
    navigate("garmentScan");
  };
  const showNav = ["profile", "garmentScan", "result", "compare", "closet"].includes(screen);

  return (
    <main className="app-shell">
      <div className="desktop-context" aria-hidden="true">
        <span className="eyebrow">FIT CHECK / PROTOTYPE 01</span>
        <h3>Tap the tag.<br />Know the fit.</h3>
        <p>A private fit profile for every brand.</p>
        <div className="context-line"><span /> Powered by your body, not a size chart.</div>
      </div>
      <div className="phone-shell">
        <AnimatePresence mode="wait">
          {screen === "welcome" && <Welcome key="welcome" onNext={() => navigate("privacy")} onDemo={demo} />}
          {screen === "privacy" && <Privacy key="privacy" onBack={() => navigate("welcome")} onNext={() => navigate("bodyScan")} />}
          {screen === "bodyScan" && <BodyScan key="bodyScan" onBack={() => navigate("privacy")} onDone={() => navigate("profile")} />}
          {screen === "profile" && <Profile key="profile" onScan={() => navigate("garmentScan")} />}
          {screen === "garmentScan" && <GarmentScan key="garmentScan" onComplete={() => navigate("result")} />}
          {screen === "result" && <FitResult key="result" size={size} onSize={setSize} onCompare={() => navigate("compare")} onSave={saveFit} />}
          {screen === "compare" && <Compare key="compare" selected={size} onSelect={setSize} onBack={() => navigate("result")} />}
          {screen === "closet" && <Closet key="closet" onOpen={() => navigate("result")} />}
        </AnimatePresence>
        {showNav && <BottomNav current={screen} onNavigate={navigate} />}
        <AnimatePresence>
          {toast && <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Check size={16} />{toast}</motion.div>}
        </AnimatePresence>
      </div>
      <button className="reset-demo" onClick={() => { window.localStorage.removeItem("fit-check-demo"); setSaved(false); setSize("M"); navigate("welcome"); }}><RotateCcw size={14} /> Restart demo</button>
    </main>
  );
}

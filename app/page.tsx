"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  LockKeyhole,
  ScanLine,
  Shirt,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Tab = "fit" | "scan" | "closet" | "profile";

const screenMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.28, ease: "easeOut" as const },
};

function LedgerBar({ label }: { label: string }) {
  return (
    <header className="ledger-bar">
      <span>{label}</span>
      <i />
    </header>
  );
}

function PassCard({ onTap }: { onTap: () => void }) {
  return (
    <button className="pass-card" onClick={onTap} aria-label="Tap your Fit Pass">
      <span className="pass-weave" aria-hidden="true" />
      <span className="pass-top">
        <b>FIT PASS</b>
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M3 9a6 6 0 0 1 12 0M6 9a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="9" cy="9" r="1.1" fill="currentColor" />
        </svg>
      </span>
      <span className="pass-mid">NO NAME · NO NUMBERS · NO PHOTO</span>
      <span className="pass-bottom">
        <small>HOLDER</small>
        <strong>One body, kept private</strong>
      </span>
    </button>
  );
}

function Blazer({ annotate = false }: { annotate?: boolean }) {
  return (
    <svg className="blazer" viewBox="0 0 260 300" fill="none" aria-label="Line drawing of an unstructured blazer">
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path className="draw d1" d="M96 38 L130 52 L164 38 L196 56 L206 118 L196 124 L190 96 L192 262 L130 272 L68 262 L70 96 L64 124 L54 118 L64 56 Z" />
        <path className="draw d2" d="M130 52 L112 84 L128 210 M130 52 L148 84 L132 210" />
        <path className="draw d3" d="M64 56 L38 150 L54 232 L74 228 L70 150" />
        <path className="draw d3" d="M196 56 L222 150 L206 232 L186 228 L190 150" />
        <path className="draw d4" d="M84 200 L112 202 M148 202 L176 200" />
        <circle className="pop p1" cx="130" cy="170" r="2.4" fill="currentColor" stroke="none" />
        <circle className="pop p2" cx="130" cy="192" r="2.4" fill="currentColor" stroke="none" />
      </g>
      {annotate && (
        <g fontFamily="'IBM Plex Mono', monospace" fontSize="9" letterSpacing=".06em">
          <g className="chalk c1">
            <path d="M96 38 C120 26, 140 26, 164 38" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" />
            <line x1="130" y1="24" x2="130" y2="8" stroke="currentColor" strokeWidth=".8" strokeDasharray="2 3" />
            <text x="136" y="14" fill="currentColor">SHOULDER · TRUE</text>
          </g>
          <g className="chalk warning c2">
            <path d="M70 240 C100 252, 160 252, 190 240" stroke="currentColor" strokeWidth="1.1" strokeDasharray="3 4" />
            <line x1="190" y1="244" x2="216" y2="254" stroke="currentColor" strokeWidth=".8" strokeDasharray="2 3" />
            <text x="152" y="290" fill="currentColor">HIP · −1.2 IN</text>
          </g>
          <g className="chalk warning c3">
            <line x1="54" y1="232" x2="54" y2="252" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="46" y1="252" x2="62" y2="252" stroke="currentColor" strokeWidth="1" />
            <text x="10" y="268" fill="currentColor">SLEEVE +1.5</text>
          </g>
        </g>
      )}
    </svg>
  );
}

function Figure({ delay }: { delay: number }) {
  return (
    <motion.svg
      className="peer-figure"
      viewBox="0 0 60 110"
      fill="none"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <circle cx="30" cy="16" r="9" />
        <path d="M30 25 C18 34,16 52,20 70 M30 25 C42 34,44 52,40 70 M20 70 L22 102 M40 70 L38 102 M20 40 L8 58 M40 40 L52 58" />
      </g>
      <g className="figure-check">
        <circle cx="48" cy="12" r="8" />
        <path d="M44 12 L47 15 L52 8.5" />
      </g>
    </motion.svg>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button className="ledger-cta" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

function PassHome({ onScan }: { onScan: () => void }) {
  return (
    <motion.section className="screen home-page with-nav" {...screenMotion}>
      <LedgerBar label="FIT CHECK" />
      <div className="home-intro">
        <span className="home-kicker"><i /> YOUR PRIVATE FIT PROFILE IS ACTIVE</span>
        <h1 className="tailor-voice">Know the fit.<br />Skip the guess.</h1>
        <p>One private profile translates every brand into a verdict you can trust.</p>
      </div>

      <button className="recent-fit" aria-label="Open latest fit check">
        <span className="recent-art"><Shirt size={34} strokeWidth={1.35} /></span>
        <span className="recent-copy">
          <small>LAST FIT CHECK · NORTH STUDIO</small>
          <strong>Unstructured blazer</strong>
          <em><Check size={12} /> Best fit — M, altered</em>
        </span>
        <ChevronRight size={18} />
      </button>

      <div className="shop-picks">
        <div className="shop-picks-head">
          <span>FROM YOUR SHOPS</span>
          <small>PRIVATE FIT PICKS</small>
        </div>
        <div className="shop-pick-grid">
          <button>
            <small>EVERLANE</small>
            <strong>Wool blazer</strong>
            <span><i>92%</i> FIT MATCH · M</span>
          </button>
          <button>
            <small>COS</small>
            <strong>Barrel trousers</strong>
            <span><i>88%</i> FIT MATCH · S</span>
          </button>
        </div>
      </div>

      <div className="home-action">
        <p><ScanLine size={15} /> READY FOR A NEW GARMENT</p>
        <PrimaryButton onClick={onScan}>Start a Fit Check</PrimaryButton>
      </div>
    </motion.section>
  );
}

function ScanFlow({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [shareOn, setShareOn] = useState(true);
  const [shared, setShared] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    if (step !== 1) return;
    const timer = window.setTimeout(() => setStep(2), reduced.current ? 500 : 2400);
    return () => window.clearTimeout(timer);
  }, [step]);

  const restart = () => {
    setShared(false);
    setShareOn(true);
    setStep(0);
  };

  return (
    <motion.section className="screen scan-flow" {...screenMotion}>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="pass" className="ledger-pane" {...screenMotion}>
            <LedgerBar label="FIT PASS" />
            <h1 className="tailor-voice">Sizes lie.<br />Your pass doesn&apos;t.</h1>
            <PassCard onTap={() => setStep(1)} />
            <p className="tap-hint">TAP YOUR PASS TO A GARMENT</p>
            <PrimaryButton onClick={() => setStep(1)}>Tap a garment</PrimaryButton>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="reading" className="ledger-pane reading-pane" {...screenMotion}>
            <LedgerBar label="READING GARMENT" />
            <div className="garment-art reading"><Blazer /></div>
            <p className="mono-detail">UNSTRUCTURED BLAZER · WOOL 96%</p>
            <p className="tailor-small">Held against a body it never sees.</p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="verdict" className="ledger-pane" {...screenMotion}>
            <LedgerBar label="THE VERDICT" />
            <div className="garment-art verdict-art"><Blazer annotate /></div>
            <div className="verdict-copy">
              <p>Fits your shoulders.</p>
              <p>Tight at the hips.</p>
              <p>Sleeves run 1.5 in long.</p>
              <strong>Best size — M, altered at the waist.</strong>
            </div>
            <PrimaryButton onClick={() => setStep(3)}>Who else has worn this?</PrimaryButton>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="vouch" className="ledger-pane" {...screenMotion}>
            <LedgerBar label="THE VOUCH" />
            <h1 className="tailor-voice vouch-title">Three bodies like yours have worn this.</h1>
            <div className="figures">
              <Figure delay={0.15} />
              <Figure delay={0.34} />
              <Figure delay={0.53} />
            </div>
            <p className="agree-line"><Check size={14} /> TRUE TO SIZE · 3 OF 3 AGREE</p>
            <p className="privacy-line">No measurements were shared.<br />Not yours. Not theirs.</p>
            <PrimaryButton onClick={() => setStep(4)}>Decide what the store learns</PrimaryButton>
          </motion.div>
        )}

        {step === 4 && !shared && (
          <motion.div key="terms" className="ledger-pane" {...screenMotion}>
            <LedgerBar label="YOUR TERMS" />
            <h1 className="tailor-voice terms-title">The store learns one word.</h1>
            <div className="privacy-rows">
              <div className="privacy-row">
                <span>
                  <strong>Fits / does not fit</strong>
                  <small>A SINGLE ANSWER. NOTHING MORE.</small>
                </span>
                <button
                  className={`privacy-toggle ${shareOn ? "on" : ""}`}
                  onClick={() => setShareOn((value) => !value)}
                  role="switch"
                  aria-checked={shareOn}
                  aria-label="Share only the fit verdict"
                >
                  <i />
                </button>
              </div>
              <div className="privacy-row">
                <span>
                  <strong>Everything else</strong>
                  <small className="locked-copy">NEVER LEAVES YOUR PASS</small>
                </span>
                <LockKeyhole size={22} />
              </div>
            </div>
            <PrimaryButton disabled={!shareOn} onClick={() => setShared(true)}>
              {shareOn ? "Share the verdict" : "Sharing is off"}
            </PrimaryButton>
            <p className="tap-hint final-hint">YOUR BODY IS NOT FOR SALE.</p>
          </motion.div>
        )}

        {step === 4 && shared && (
          <motion.div key="shared" className="ledger-pane shared-pane" {...screenMotion}>
            <LedgerBar label="DONE" />
            <div className="verdict-stamp">
              <span>FITS</span>
              <small>M · ALTERED</small>
            </div>
            <p className="shared-title">The verdict was shared.</p>
            <p className="privacy-line">Nothing else was.</p>
            <PrimaryButton onClick={restart}>Tap another garment</PrimaryButton>
            <button className="quiet-exit" onClick={onDone}>Return to Fit Check</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function Closet() {
  const items = [
    { name: "Unstructured blazer", brand: "North Studio", fit: "M · altered", status: "Best fit" },
    { name: "Wide-leg trousers", brand: "Atelier West", fit: "S · hemmed", status: "Good fit" },
    { name: "Rib-knit top", brand: "Morrow", fit: "M", status: "Size up" },
  ];
  return (
    <motion.section className="screen simple-page with-nav" {...screenMotion}>
      <LedgerBar label="THE CLOSET" />
      <h1 className="tailor-voice">Fits worth<br />remembering.</h1>
      <div className="closet-list-clean">
        {items.map((item, index) => (
          <button key={item.name}>
            <span className="closet-index">0{index + 1}</span>
            <span>
              <small>{item.brand}</small>
              <strong>{item.name}</strong>
              <em>{item.fit}</em>
            </span>
            <span className={`fit-status ${index < 2 ? "good" : ""}`}>{item.status}</span>
            <ChevronRight size={17} />
          </button>
        ))}
      </div>
      <p className="page-note">Only verdicts are saved here.<br />Measurements stay on your pass.</p>
    </motion.section>
  );
}

function Profile() {
  return (
    <motion.section className="screen simple-page with-nav" {...screenMotion}>
      <LedgerBar label="YOUR PASS" />
      <h1 className="tailor-voice">One body,<br />kept private.</h1>
      <div className="profile-pass">
        <span className="profile-monogram">A</span>
        <span>
          <small>PRIVATE FIT PROFILE</small>
          <strong>Balanced · relaxed</strong>
        </span>
        <span className="active-mark"><i /> ACTIVE</span>
      </div>
      <div className="profile-facts">
        <div><span>18</span><small>ANONYMOUS<br />BODY MATCHES</small></div>
        <div><span>03</span><small>GARMENTS<br />REMEMBERED</small></div>
      </div>
      <div className="profile-rule">
        <LockKeyhole size={19} />
        <span><strong>Your measurements never leave this device.</strong><small>Stores receive only the verdict you approve.</small></span>
      </div>
    </motion.section>
  );
}

function BottomNav({ current, onNavigate }: { current: Tab; onNavigate: (tab: Tab) => void }) {
  const items = [
    { label: "Fit Check", icon: WalletCards, tab: "fit" as Tab },
    { label: "Scan", icon: ScanLine, tab: "scan" as Tab, primary: true },
    { label: "Closet", icon: Shirt, tab: "closet" as Tab },
    { label: "Profile", icon: UserRound, tab: "profile" as Tab },
  ];
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map(({ label, icon: Icon, tab, primary }) => (
        <button
          key={tab}
          className={`${current === tab ? "active" : ""} ${primary ? "scan-tab" : ""}`}
          onClick={() => onNavigate(tab)}
          aria-current={current === tab ? "page" : undefined}
        >
          <span><Icon size={primary ? 21 : 19} strokeWidth={1.8} /></span>
          <small>{label}</small>
        </button>
      ))}
    </nav>
  );
}

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("fit");

  useEffect(() => {
    const saved = window.localStorage.getItem("fit-check-tab") as Tab | null;
    if (saved && ["fit", "closet", "profile"].includes(saved)) setTab(saved);
  }, []);

  const navigate = (next: Tab) => {
    setTab(next);
    if (next !== "scan") window.localStorage.setItem("fit-check-tab", next);
  };

  return (
    <main className="app-shell">
      <aside className="desktop-context" aria-hidden="true">
        <span>FIT CHECK · PRIVATE FIT</span>
        <h2>A verdict.<br />Not your body.</h2>
        <p>Anonymous fit trust for people built like you.</p>
      </aside>
      <div className="phone-shell">
        <span className="phone-notch" aria-hidden="true" />
        <AnimatePresence mode="wait">
          {tab === "fit" && <PassHome key="fit" onScan={() => navigate("scan")} />}
          {tab === "scan" && <ScanFlow key="scan" onDone={() => navigate("fit")} />}
          {tab === "closet" && <Closet key="closet" />}
          {tab === "profile" && <Profile key="profile" />}
        </AnimatePresence>
        {tab !== "scan" && <BottomNav current={tab} onNavigate={navigate} />}
        <span className="phone-home" aria-hidden="true" />
      </div>
    </main>
  );
}

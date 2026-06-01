import { useState, useEffect, useRef, createContext, useContext } from "react";

const LangCtx = createContext();
const useLang = () => useContext(LangCtx);

const C = {
  sun: "#F2C744", terra: "#C4402F", cream: "#FFF8ED", esp: "#2C1810",
  brown: "#6B4226", latte: "#D4A574", sage: "#8B9E7E", gold: "#D4A03C", parch: "#F5ECD7",
};

const tx = {
  hero: { tag: { de: "Portugiesische Kaffeekultur in Chemnitz", en: "Portuguese Coffee Culture in Chemnitz" }, s1: { de: "Benannt nach Miguels Großmutter.", en: "Named after Miguel's grandmother." }, s2: { de: "Gebraut mit Liebe auf dem Sonnenberg.", en: "Brewed with love in Sonnenberg." }, cta: { de: "Entdecken", en: "Discover" } },
  nav: { story: { de: "Geschichte", en: "Story" }, menu: { de: "Speisekarte", en: "Menu" }, hours: { de: "Zeiten", en: "Hours" }, cart: { de: "Kaffeemobil", en: "Cart" }, ws: { de: "Workshops", en: "Workshops" } },
  story: {
    lab: { de: "Unsere Geschichte", en: "Our Story" },
    q: { de: "\"Caniço\" ist der Mädchenname von Miguels Großmutter — eine Hommage an die portugiesischen Wurzeln seiner Familie.", en: "\"Caniço\" is the maiden name of Miguel's grandmother — a homage to the Portuguese roots of his family." },
    p1: { de: "Jahre lang stand das Geschäft in der Zietenstraße 42 leer. 14 Jahre Stille auf dem Sonnenberg. Bis Miguel und Gini kamen — mit einer Espressomaschine, einem Traum und dem Namen einer portugiesischen Großmutter.", en: "years the shop at Zietenstraße 42 stood empty. 14 years of silence in Sonnenberg. Until Miguel and Gini arrived — with an espresso machine, a dream, and a Portuguese grandmother's name." },
    p2: { de: "Was als mobiler Kaffee-Wagen auf Festivals begann, ist nun ein Ort geworden: Ein Wohnzimmer für den Sonnenberg. Ein Platz, wo man eigentlich nur kurz auf einen Kaffee vorbei wollte — und dann den ganzen Nachmittag bleibt.", en: "What began as a mobile coffee cart at festivals has become a place: A living room for Sonnenberg. A spot where you only meant to pop in for a coffee — and ended up staying the entire afternoon." },
    p3: { de: "Specialty Coffee auf Berliner Niveau. Hausgemachte Focaccia. Und immer ein offenes Ohr.", en: "Specialty coffee at Berlin level. Homemade focaccia. And always a listening ear." },
    r1: { de: "Kaffeehandwerk & Gründer", en: "Coffee Craft & Founder" }, r2: { de: "Mitgründerin & Herz des Hauses", en: "Co-Founder & Heart of the House" },
  },
  mq: { de: "SPECIALTY COFFEE · FOCACCIA · KUCHEN · BRUNCH · WORKSHOPS · KAFFEEMOBIL · HUNDE WILLKOMMEN · VEGAN · ", en: "SPECIALTY COFFEE · FOCACCIA · CAKES · BRUNCH · WORKSHOPS · COFFEE CART · DOGS WELCOME · VEGAN · " },
  menu: {
    lab: { de: "Speisekarte", en: "Menu" }, t: { de: "Von der Bohne bis zum Teller", en: "From Bean to Plate" },
    sub: { de: "Kleine Karte, große Liebe.", en: "Small menu, big love." },
    ck: { de: "KAFFEE", en: "COFFEE" }, fk: { de: "ESSEN", en: "FOOD" },
    dog: { de: "Hunde willkommen", en: "Dogs welcome" },
    c: {
      de: [
        { n: "Espresso Doppio", d: "Miguels Favorit — kräftig, rein, portugiesische Seele", i: "☕" },
        { n: "Cappuccino", d: "Samtiger Milchschaum, perfekt extrahiert", i: "☕" },
        { n: "Latte Macchiato", d: "Geschichtet, cremig, der Sonnenberg-Klassiker", i: "🥛" },
        { n: "Iced Latte", d: "Kalt gebrüht für warme Tage", i: "🧊" },
      ],
      en: [
        { n: "Double Espresso", d: "Miguel's favorite — bold, pure, Portuguese soul", i: "☕" },
        { n: "Cappuccino", d: "Velvety milk foam, perfectly extracted", i: "☕" },
        { n: "Latte Macchiato", d: "Layered, creamy, the Sonnenberg classic", i: "🥛" },
        { n: "Iced Latte", d: "Cold brewed for warm days", i: "🧊" },
      ],
    },
    f: {
      de: [
        { n: "Hausgemachte Focaccia", d: "Miguels Empfehlung: mit doppeltem Espresso", i: "🫓", v: true },
        { n: "Kuchen & Gebäck", d: "Täglich frisch — auch vegan", i: "🍰", v: true },
        { n: "Wochenend-Brunch", d: "Sa & So — wechselndes Angebot", i: "🍳" },
      ],
      en: [
        { n: "Homemade Focaccia", d: "Miguel's pick: paired with a double espresso", i: "🫓", v: true },
        { n: "Cakes & Pastries", d: "Fresh daily — vegan options available", i: "🍰", v: true },
        { n: "Weekend Brunch", d: "Sat & Sun — rotating selection", i: "🍳" },
      ],
    },
  },
  hrs: {
    lab: { de: "Besucht uns", en: "Visit Us" }, t: { de: "Öffnungszeiten & Anfahrt", en: "Hours & Location" },
    hl: { de: "Öffnungszeiten", en: "Opening Hours" }, cl: { de: "Ruhetag", en: "Closed" },
    d: { de: ["Montag", "Di – Fr", "Samstag", "Sonntag"], en: ["Monday", "Tue – Fri", "Saturday", "Sunday"] },
    note: { de: "Zeiten können variieren — folgt uns auf Instagram!", en: "Hours may vary — follow us on Instagram!" },
    map: { de: "Google Maps öffnen", en: "Open in Google Maps" },
  },
  cart: {
    lab: { de: "Mobiles Kaffeemobil", en: "Mobile Coffee Cart" },
    t: { de: "Caniço kommt zu euch", en: "Caniço comes to you" },
    d: { de: "Hochzeit, Firmenfeier, Festival — unser Kaffee-Wagen bringt Specialty Coffee zu eurem Event.", en: "Wedding, corporate event, festival — our coffee cart brings specialty coffee to your event." },
    cta: { de: "Anfrage via Instagram", en: "Inquire via Instagram" },
  },
  ws: {
    lab: { de: "Workshops", en: "Workshops" },
    t: { de: "Barista-Kurse für Kaffeeliebhaber", en: "Barista Courses for Coffee Lovers" },
    d: { de: "Miguel teilt sein Wissen: Extraktion, Latte Art, Bohnenauswahl.", en: "Miguel shares his knowledge: Extraction, latte art, bean selection." },
    items: { de: [{ t: "Espresso Basics", d: "Mahlen, Tampen, Extrahieren" }, { t: "Latte Art", d: "Herzen, Blätter & mehr" }, { t: "Bohnen & Röstung", d: "Herkunft & Profil" }], en: [{ t: "Espresso Basics", d: "Grinding, Tamping, Extracting" }, { t: "Latte Art", d: "Hearts, Leaves & more" }, { t: "Beans & Roasting", d: "Origin & Profile" }] },
    cta: { de: "Workshop anfragen", en: "Request a workshop" },
  },
  ig: { t: { de: "Folgt unserer Reise", en: "Follow Our Journey" }, d: { de: "Baustellentagebuch, Teamtage und der ganz normale Wahnsinn.", en: "Construction diary, team days, and the beautiful chaos." } },
  bot: { g: { de: "Hallo! Wie kann ich helfen? ☕", en: "Hello! How can I help? ☕" }, ph: { de: "Nachricht schreiben...", en: "Type a message..." } },
};

function useReveal(th = 0.12) {
  const r = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => { const el = r.current; if (!el) return; const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); io.unobserve(el); } }, { threshold: th }); io.observe(el); return () => io.disconnect(); }, []);
  return [r, v];
}

const Wave = ({ color = C.cream, flip }) => (
  <svg viewBox="0 0 1440 70" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 50, transform: flip ? "rotate(180deg)" : "none" }}>
    <path d={`M0,35 C360,70 720,0 1080,35 C1260,52 1380,18 1440,35 L1440,70 L0,70Z`} fill={color} />
  </svg>
);

const LangToggle = ({ dark }) => {
  const { lang, setLang } = useLang();
  return (
    <button onClick={() => setLang(l => l === "de" ? "en" : "de")} style={{
      display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20,
      border: `1.5px solid ${dark ? C.sun + "40" : C.esp + "20"}`,
      background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
      cursor: "pointer", fontSize: 11, fontFamily: "'Outfit',sans-serif",
      letterSpacing: 1.5, color: dark ? C.sun : C.esp, transition: "all 0.3s",
    }}>
      <span style={{ opacity: lang === "de" ? 1 : 0.35 }}>DE</span>
      <span style={{ width: 1, height: 10, background: dark ? C.sun + "30" : C.esp + "20" }} />
      <span style={{ opacity: lang === "en" ? 1 : 0.35 }}>EN</span>
    </button>
  );
};

/* ═══ NAVBAR ═══ */
function Navbar() {
  const { lang } = useLang();
  const [sc, setSc] = useState(false);
  const [op, setOp] = useState(false);
  useEffect(() => { const h = () => setSc(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const lnk = [["story", tx.nav.story], ["menu", tx.nav.menu], ["hours", tx.nav.hours], ["cart", tx.nav.cart], ["workshops", tx.nav.ws]];
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: sc ? "rgba(44,24,16,0.94)" : "transparent", backdropFilter: sc ? "blur(14px)" : "none", transition: "all 0.5s", padding: sc ? "10px 0" : "16px 0", borderBottom: sc ? "1px solid rgba(242,199,68,0.1)" : "none" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#hero" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: sc ? 22 : 26, fontWeight: 700, color: C.sun, letterSpacing: 1.5 }}>Caniço</span>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 9, color: C.cream + "60", letterSpacing: 4, textTransform: "uppercase" }}>café</span>
        </a>
        <div style={{ display: "flex", gap: 22, alignItems: "center" }} className="dk-n">
          {lnk.map(([id, t]) => <a key={id} href={"#" + id} style={{ color: C.cream + "70", textDecoration: "none", fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", transition: "color 0.3s" }} onMouseEnter={e => e.target.style.color = C.sun} onMouseLeave={e => e.target.style.color = C.cream + "70"}>{t[lang]}</a>)}
          <LangToggle dark />
        </div>
        <div className="mb-n" style={{ display: "none", alignItems: "center", gap: 10 }}>
          <LangToggle dark />
          <button onClick={() => setOp(!op)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 20, height: 2, background: C.sun, marginBottom: i < 2 ? 4 : 0, transition: "all 0.3s", ...(op && i === 0 ? { transform: "rotate(45deg) translate(4px,4px)" } : {}), ...(op && i === 1 ? { opacity: 0 } : {}), ...(op && i === 2 ? { transform: "rotate(-45deg) translate(4px,-4px)" } : {}) }} />)}
          </button>
        </div>
      </div>
      {op && <div style={{ background: "rgba(44,24,16,0.97)", padding: "14px 20px" }}>
        {lnk.map(([id, t]) => <a key={id} href={"#" + id} onClick={() => setOp(false)} style={{ display: "block", color: C.cream, textDecoration: "none", fontFamily: "'Outfit',sans-serif", fontSize: 14, letterSpacing: 2, padding: "10px 0", borderBottom: "1px solid " + C.sun + "10" }}>{t[lang]}</a>)}
      </div>}
      <style>{`@media(max-width:768px){.dk-n{display:none!important}.mb-n{display:flex!important}}`}</style>
    </nav>
  );
}

/* ═══ HERO ═══ */
function Hero() {
  const { lang } = useLang();
  const [ld, setLd] = useState(false);
  useEffect(() => { setTimeout(() => setLd(true), 300); }, []);
  return (
    <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: `linear-gradient(165deg, ${C.esp} 0%, #1a0e08 55%, #2a1508 100%)` }}>
      {/* Azulejo bg */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.035, backgroundSize: "70px 70px", backgroundImage: `repeating-conic-gradient(${C.terra}15 0% 25%, transparent 0% 50%)` }} />
      {/* Glow */}
      <div style={{ position: "absolute", top: "25%", left: "50%", transform: "translate(-50%,-50%)", width: "130vw", height: "130vh", background: `radial-gradient(ellipse,${C.sun}0d 0%,transparent 55%)` }} />
      {/* Floating beans */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{ position: "absolute", width: 8 + i * 3, height: 12 + i * 4, borderRadius: "50%", background: C.terra + (10 + i * 5).toString(16), top: (10 + i * 14) + "%", left: (6 + i * 15) + "%", animation: `fb ${3.5 + i * 0.6}s ease-in-out infinite ${i * 0.3}s` }} />
      ))}
      {/* ☕ FLOATING ESPRESSO CUP */}
      <div className="hcup" style={{ position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)", width: "clamp(130px,18vw,210px)", animation: "cupFloat 5s ease-in-out infinite", opacity: ld ? 0.85 : 0, transition: "opacity 1.5s 1s", filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.5))" }}>
        {/* Steam */}
        <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", width: 60, height: 60 }}>
          {[0, 1, 2, 3].map(i => <div key={i} style={{ position: "absolute", width: 5 + i * 2, height: 5 + i * 2, borderRadius: "50%", background: C.cream + "18", left: 10 + i * 10, bottom: 0, animation: `stm ${2.2 + i * 0.4}s ease-out infinite ${i * 0.35}s` }} />)}
        </div>
        <svg viewBox="0 0 120 130" fill="none">
          <ellipse cx="58" cy="120" rx="48" ry="8" fill="#E0D5C8" />
          <ellipse cx="58" cy="118" rx="44" ry="7" fill="#EDE4D8" />
          <path d="M18 50 L23 108 C23 114 93 114 93 108 L98 50Z" fill="#E8DDD0" />
          <path d="M18 50 L23 108 C23 114 93 114 93 108 L98 50Z" fill="url(#cg1)" />
          <defs><linearGradient id="cg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f5ece0" /><stop offset="100%" stopColor="#d4c4b0" /></linearGradient></defs>
          <ellipse cx="58" cy="52" rx="38" ry="12" fill="#3A2010" />
          <ellipse cx="58" cy="50" rx="36" ry="10" fill="#8B5E3C" opacity="0.85" />
          <ellipse cx="58" cy="49" rx="20" ry="5" fill="#C8956A" opacity="0.4" />
          <ellipse cx="58" cy="47" rx="40" ry="13" fill="none" stroke="#F5ECD7" strokeWidth="2.5" />
          <path d="M98 62 C116 62 119 90 98 94" fill="none" stroke="#E8DDD0" strokeWidth="7" strokeLinecap="round" />
          <path d="M98 66 C112 66 114 86 98 90" fill="none" stroke="#EDE4D8" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: 680 }}>
        <div style={{ width: 48, height: 1.5, background: C.sun, margin: "0 auto 26px", opacity: ld ? 1 : 0, transition: "all 1s 0.3s", transform: ld ? "scaleX(1)" : "scaleX(0)" }} />
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11.5, letterSpacing: 6, textTransform: "uppercase", color: C.sun, marginBottom: 24, opacity: ld ? 1 : 0, transition: "all 1s 0.5s", transform: ld ? "none" : "translateY(18px)" }}>{tx.hero.tag[lang]}</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "clamp(58px,12vw,130px)", lineHeight: 0.9, color: C.cream, margin: "0 0 6px", opacity: ld ? 1 : 0, transition: "all 1.2s 0.7s", transform: ld ? "none" : "translateY(25px)", textShadow: `0 4px 50px ${C.sun}15` }}>Caniço</h1>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "clamp(20px,3.5vw,30px)", color: C.latte, marginBottom: 34, opacity: ld ? 1 : 0, transition: "all 1s 1s" }}>café</p>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "clamp(13px,1.8vw,15px)", color: C.cream + "55", lineHeight: 2, maxWidth: 420, margin: "0 auto 40px", opacity: ld ? 1 : 0, transition: "all 1s 1.2s" }}>{tx.hero.s1[lang]}<br />{tx.hero.s2[lang]}</p>
        <a href="#story" className="hbtn" style={{ display: "inline-block", padding: "15px 50px", background: "transparent", border: `1.5px solid ${C.sun}`, color: C.sun, fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 5, textTransform: "uppercase", textDecoration: "none", transition: "all 0.4s", opacity: ld ? 1 : 0 }}>{tx.hero.cta[lang]}</a>
      </div>
      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", width: 1, height: 44, background: `linear-gradient(${C.sun},transparent)`, animation: "sp 2s ease-in-out infinite" }} />
      <style>{`
        @keyframes fb{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-16px) rotate(10deg)}}
        @keyframes cupFloat{0%,100%{transform:translateY(-50%)}50%{transform:translateY(calc(-50% - 12px))}}
        @keyframes stm{0%{transform:translateY(0) scale(1);opacity:.35}100%{transform:translateY(-45px) scale(2.8);opacity:0}}
        @keyframes sp{0%,100%{opacity:.2}50%{opacity:.7}}
        .hbtn:hover{background:${C.sun}!important;color:${C.esp}!important;transform:translateY(-2px);box-shadow:0 8px 30px ${C.sun}30}
        @media(max-width:768px){.hcup{display:none!important}}
      `}</style>
    </section>
  );
}

/* ═══ MARQUEE ═══ */
function Marquee() {
  const { lang } = useLang();
  const t = tx.mq[lang];
  return (
    <div style={{ background: C.sun, overflow: "hidden", padding: "13px 0", position: "relative", zIndex: 10 }}>
      <div style={{ display: "flex", animation: "mqs 18s linear infinite", width: "max-content" }}>
        {[0, 1, 2, 3].map(i => <span key={i} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 4, color: C.esp, whiteSpace: "nowrap", paddingRight: 12, fontWeight: 600 }}>{t}</span>)}
      </div>
      <style>{`@keyframes mqs{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

/* ═══ STORY ═══ */
function Story() {
  const { lang } = useLang();
  const [r1, v1] = useReveal();
  const [r2, v2] = useReveal();
  return (
    <section id="story" style={{ background: C.cream }}>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "80px 24px 84px", textAlign: "center" }}>
        <p ref={r1} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: C.terra, marginBottom: 26, opacity: v1 ? 1 : 0, transition: "all 0.8s", transform: v1 ? "none" : "translateY(16px)" }}>{tx.story.lab[lang]}</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(23px,4.5vw,40px)", fontWeight: 400, lineHeight: 1.5, color: C.esp, margin: "0 0 34px", fontStyle: "italic", opacity: v1 ? 1 : 0, transition: "all 1s 0.2s", transform: v1 ? "none" : "translateY(16px)" }}>{tx.story.q[lang]}</h2>
        <div style={{ width: 56, height: 2.5, background: C.sun, margin: "0 auto 44px", borderRadius: 2 }} />
        <div ref={r2} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 36, textAlign: "left", opacity: v2 ? 1 : 0, transition: "all 1s", transform: v2 ? "none" : "translateY(24px)" }}>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, lineHeight: 1.95, color: C.brown }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, float: "left", lineHeight: 1, marginRight: 10, color: C.terra, fontWeight: 700 }}>14</span>
            {tx.story.p1[lang]}
          </p>
          <div>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, lineHeight: 1.95, color: C.brown }}>{tx.story.p2[lang]}</p>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, lineHeight: 1.95, color: C.brown, marginTop: 14, fontWeight: 500 }}>{tx.story.p3[lang]}</p>
          </div>
        </div>
        {/* Founders */}
        <div style={{ marginTop: 56, display: "flex", justifyContent: "center", gap: 52, flexWrap: "wrap" }}>
          {[{ name: "Miguel Grincho", role: tx.story.r1[lang], e: "☕" }, { name: "Virginia Hunger", role: tx.story.r2[lang], e: "🌻" }].map((f, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ width: 84, height: 84, borderRadius: "50%", background: `linear-gradient(135deg,${C.sun}22,${C.terra}14)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 34, border: `2px solid ${C.sun}28`, boxShadow: `0 8px 28px ${C.sun}0d` }}>{f.e}</div>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, color: C.esp, fontWeight: 600, marginBottom: 4 }}>{f.name}</p>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10.5, color: C.latte, letterSpacing: 2.5, textTransform: "uppercase" }}>{f.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ MENU ═══ */
function MenuSec() {
  const { lang } = useLang();
  const [r, v] = useReveal();
  const Item = ({ item, delay }) => (
    <div className="mi" style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 18px", borderRadius: 12, background: C.cream + "06", border: `1px solid ${C.cream}0a`, transition: "all 0.35s", cursor: "default", opacity: v ? 1 : 0, transform: v ? "none" : "translateY(16px)", transitionDelay: delay + "s" }}>
      <span style={{ fontSize: 28, lineHeight: 1 }}>{item.i}</span>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: C.cream, margin: 0, fontWeight: 600 }}>{item.n}</p>
          {item.v && <span style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: C.sage, border: `1px solid ${C.sage}45`, padding: "2px 9px", borderRadius: 20, fontFamily: "'Outfit',sans-serif" }}>vegan</span>}
        </div>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: C.cream + "45", marginTop: 5, lineHeight: 1.6 }}>{item.d}</p>
      </div>
    </div>
  );
  return (
    <section id="menu" style={{ background: C.esp, position: "relative", overflow: "hidden" }}>
      <Wave color={C.cream} flip />
      <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundSize: "4px 4px", backgroundImage: `radial-gradient(${C.cream}20 1px,transparent 1px)` }} />
      <div ref={r} style={{ maxWidth: 880, margin: "0 auto", padding: "56px 24px 76px", position: "relative" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: C.sun, textAlign: "center", marginBottom: 10, opacity: v ? 1 : 0, transition: "all 0.8s" }}>{tx.menu.lab[lang]}</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(26px,5vw,42px)", color: C.cream, textAlign: "center", marginBottom: 6, fontWeight: 400, opacity: v ? 1 : 0, transition: "all 1s 0.1s" }}>{tx.menu.t[lang]}</h2>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: C.cream + "40", textAlign: "center", marginBottom: 50, opacity: v ? 1 : 0, transition: "all 0.8s 0.2s" }}>{tx.menu.sub[lang]}</p>
        {[[tx.menu.ck[lang], tx.menu.c[lang]], [tx.menu.fk[lang], tx.menu.f[lang]]].map(([cat, items], ci) => (
          <div key={ci} style={{ marginBottom: ci === 0 ? 40 : 0 }}>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 5, color: C.terra, marginBottom: 20, paddingBottom: 10, borderBottom: `1px solid ${C.terra}25` }}>{cat}</p>
            <div style={{ display: "grid", gap: 14 }}>
              {items.map((item, ii) => <Item key={ii} item={item} delay={0.1 + ii * 0.07} />)}
            </div>
          </div>
        ))}
        <div style={{ marginTop: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, padding: "11px 24px", borderRadius: 28, background: C.sun + "0c", border: `1px solid ${C.sun}18`, width: "fit-content", margin: "40px auto 0" }}>
          <span style={{ fontSize: 16 }}>🐕</span>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: C.latte, letterSpacing: 3, textTransform: "uppercase" }}>{tx.menu.dog[lang]}</span>
        </div>
      </div>
      <style>{`.mi:hover{background:${C.sun}12!important;border-color:${C.sun}20!important;transform:translateY(-2px)!important}`}</style>
    </section>
  );
}

/* ═══ HOURS ═══ */
function Hours() {
  const { lang } = useLang();
  const [r, v] = useReveal();
  const times = ["", "9:00 – 18:00", "9:00 – 18:00", "10:00 – 17:00"];
  return (
    <section id="hours" style={{ background: C.cream }}>
      <Wave color={C.esp} flip />
      <div ref={r} style={{ maxWidth: 960, margin: "0 auto", padding: "56px 24px 76px", opacity: v ? 1 : 0, transition: "all 1s", transform: v ? "none" : "translateY(24px)" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: C.terra, textAlign: "center", marginBottom: 10 }}>{tx.hrs.lab[lang]}</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(26px,5vw,40px)", color: C.esp, textAlign: "center", marginBottom: 44, fontWeight: 400 }}>{tx.hrs.t[lang]}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 28 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 32, boxShadow: "0 6px 40px rgba(44,24,16,0.05)", border: "1px solid rgba(44,24,16,0.04)" }}>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: C.sun, marginBottom: 22, fontWeight: 600 }}>{tx.hrs.hl[lang]}</p>
            {tx.hrs.d[lang].map((day, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 3 ? `1px solid ${C.parch}` : "none" }}>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: C.brown }}>{day}</span>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: i === 0 ? 400 : 600, color: i === 0 ? C.terra : C.esp, fontStyle: i === 0 ? "italic" : "normal" }}>{i === 0 ? tx.hrs.cl[lang] : times[i]}</span>
              </div>
            ))}
            <div style={{ marginTop: 18, padding: "12px 14px", borderRadius: 8, background: C.sun + "10", border: `1px dashed ${C.sun}30` }}>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: C.brown, margin: 0, lineHeight: 1.65 }}>⏰ {tx.hrs.note[lang]}</p>
            </div>
          </div>
          <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 6px 40px rgba(44,24,16,0.05)", border: "1px solid rgba(44,24,16,0.04)", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, minHeight: 180, background: `linear-gradient(135deg,${C.parch},${C.cream})`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundSize: "60px 60px", backgroundImage: `repeating-conic-gradient(${C.terra}12 0% 25%,transparent 0% 50%)` }} />
              <div style={{ textAlign: "center", position: "relative" }}>
                <div style={{ fontSize: 38, marginBottom: 10 }}>📍</div>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, color: C.esp, fontWeight: 600, marginBottom: 3 }}>Zietenstraße 42</p>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: C.brown }}>09130 Chemnitz · Sonnenberg</p>
              </div>
            </div>
            <div style={{ padding: "18px 20px" }}>
              <a href="https://maps.google.com/?q=Zietenstraße+42+09130+Chemnitz" target="_blank" rel="noopener noreferrer" className="mapbtn" style={{ display: "block", textAlign: "center", padding: 14, background: C.esp, color: C.sun, borderRadius: 8, textDecoration: "none", fontFamily: "'Outfit',sans-serif", fontSize: 11.5, letterSpacing: 3, textTransform: "uppercase", transition: "all 0.3s" }}>{tx.hrs.map[lang]} →</a>
            </div>
          </div>
        </div>
      </div>
      <style>{`.mapbtn:hover{background:${C.brown}!important}`}</style>
    </section>
  );
}

/* ═══ CART ═══ */
function Cart() {
  const { lang } = useLang();
  const [r, v] = useReveal();
  return (
    <section id="cart" style={{ background: `linear-gradient(135deg,${C.sun},${C.gold})`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -70, right: -70, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.09)" }} />
      <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
      <div ref={r} style={{ maxWidth: 660, margin: "0 auto", padding: "76px 24px", textAlign: "center", position: "relative", opacity: v ? 1 : 0, transition: "all 1s", transform: v ? "none" : "translateY(24px)" }}>
        <div style={{ fontSize: 52, marginBottom: 18 }}>🚐</div>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: C.esp, marginBottom: 10, opacity: 0.5 }}>{tx.cart.lab[lang]}</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(26px,5vw,38px)", color: C.esp, marginBottom: 14, fontWeight: 500 }}>{tx.cart.t[lang]}</h2>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: C.brown, lineHeight: 1.85, maxWidth: 480, margin: "0 auto 32px" }}>{tx.cart.d[lang]}</p>
        <a href="https://www.instagram.com/canico__cafe" target="_blank" rel="noopener noreferrer" className="cartbtn" style={{ display: "inline-block", padding: "15px 42px", background: C.esp, color: C.sun, borderRadius: 8, textDecoration: "none", fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", transition: "all 0.35s", boxShadow: `0 8px 28px rgba(44,24,16,0.2)` }}>{tx.cart.cta[lang]} →</a>
      </div>
      <style>{`.cartbtn:hover{transform:translateY(-3px);box-shadow:0 12px 36px rgba(44,24,16,0.3)!important}`}</style>
    </section>
  );
}

/* ═══ WORKSHOPS ═══ */
function WS() {
  const { lang } = useLang();
  const [r, v] = useReveal();
  const icons = ["🎯", "🎨", "🫘"];
  return (
    <section id="workshops" style={{ background: C.esp }}>
      <Wave color={C.sun} flip />
      <div ref={r} style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 76px", textAlign: "center", opacity: v ? 1 : 0, transition: "all 1s", transform: v ? "none" : "translateY(24px)" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: C.sun, marginBottom: 10 }}>{tx.ws.lab[lang]}</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(24px,5vw,38px)", color: C.cream, marginBottom: 14, fontWeight: 400 }}>{tx.ws.t[lang]}</h2>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14.5, color: C.cream + "50", lineHeight: 1.85, maxWidth: 520, margin: "0 auto 40px" }}>{tx.ws.d[lang]}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 18, marginBottom: 40 }}>
          {tx.ws.items[lang].map((w, i) => (
            <div key={i} className="wsc" style={{ padding: 28, borderRadius: 12, background: C.cream + "06", border: `1px solid ${C.cream}0c`, transition: "all 0.35s", cursor: "default" }}>
              <div style={{ fontSize: 34, marginBottom: 12 }}>{icons[i]}</div>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: C.cream, marginBottom: 5, fontWeight: 600 }}>{w.t}</p>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12.5, color: C.cream + "38" }}>{w.d}</p>
            </div>
          ))}
        </div>
        <a href="https://www.instagram.com/canico__cafe" target="_blank" rel="noopener noreferrer" className="wsbtn" style={{ display: "inline-block", padding: "14px 38px", background: "transparent", border: `1.5px solid ${C.sun}`, color: C.sun, borderRadius: 6, textDecoration: "none", fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", transition: "all 0.35s" }}>{tx.ws.cta[lang]} →</a>
      </div>
      <style>{`.wsc:hover{background:${C.sun}12!important;border-color:${C.sun}25!important;transform:translateY(-3px)} .wsbtn:hover{background:${C.sun}!important;color:${C.esp}!important}`}</style>
    </section>
  );
}

/* ═══ INSTAGRAM ═══ */
function IG() {
  const { lang } = useLang();
  const [r, v] = useReveal();
  return (
    <section style={{ background: C.cream }}>
      <Wave color={C.esp} flip />
      <div ref={r} style={{ maxWidth: 560, margin: "0 auto", padding: "56px 24px 76px", textAlign: "center", opacity: v ? 1 : 0, transition: "all 1s", transform: v ? "none" : "translateY(24px)" }}>
        <div className="igico" style={{ width: 80, height: 80, borderRadius: 20, margin: "0 auto 24px", background: "linear-gradient(135deg,#F77737,#C13584,#833AB4,#5851DB)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 36px rgba(193,53,132,0.22)", transition: "transform 0.3s", cursor: "pointer" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(23px,4vw,34px)", color: C.esp, marginBottom: 10, fontWeight: 400 }}>{tx.ig.t[lang]}</h2>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14.5, color: C.brown, lineHeight: 1.85, maxWidth: 440, margin: "0 auto 28px" }}>{tx.ig.d[lang]}</p>
        <a href="https://www.instagram.com/canico__cafe" target="_blank" rel="noopener noreferrer" className="igbtn" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 36px", background: C.esp, color: C.cream, borderRadius: 8, textDecoration: "none", fontFamily: "'Outfit',sans-serif", fontSize: 14.5, fontWeight: 500, transition: "all 0.35s", boxShadow: "0 6px 24px rgba(44,24,16,0.12)" }}>@canico__cafe</a>
      </div>
      <style>{`.igico:hover{transform:scale(1.06) rotate(-3deg)} .igbtn:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(44,24,16,0.2)!important}`}</style>
    </section>
  );
}

/* ═══ CREOBOT ═══ */
function Bot() {
  const { lang } = useLang();
  const [op, setOp] = useState(false);
  return (
    <>
      {op && (
        <div style={{ position: "fixed", bottom: 92, right: 20, width: 330, maxWidth: "calc(100vw - 40px)", background: "white", borderRadius: 18, boxShadow: "0 16px 56px rgba(44,24,16,0.18)", border: "1px solid rgba(44,24,16,0.06)", zIndex: 9999, overflow: "hidden", animation: "bsi .3s ease-out" }}>
          <div style={{ background: C.esp, padding: "16px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg,${C.sun},${C.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13.5, color: C.cream, margin: 0, fontWeight: 600 }}>CreoBot</p>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 9.5, color: C.cream + "50", margin: 0, letterSpacing: 1.5, textTransform: "uppercase" }}>Café Caniço Assistant</p>
            </div>
            <button onClick={() => setOp(false)} style={{ background: "none", border: "none", color: C.cream + "45", cursor: "pointer", fontSize: 20 }}>×</button>
          </div>
          <div style={{ padding: 18, minHeight: 140 }}>
            <div style={{ background: C.parch, borderRadius: "4px 13px 13px 13px", padding: "11px 14px", maxWidth: "82%" }}>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: C.esp, margin: 0, lineHeight: 1.6 }}>{tx.bot.g[lang]}</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 14 }}>
              {(lang === "de" ? ["Öffnungszeiten?", "Vegan?", "Kaffeemobil buchen"] : ["Opening hours?", "Vegan?", "Book coffee cart"]).map((q, i) => (
                <button key={i} className="qbtn" style={{ padding: "6px 12px", borderRadius: 18, border: `1px solid ${C.sun}45`, background: C.sun + "0c", fontFamily: "'Outfit',sans-serif", fontSize: 11.5, color: C.brown, cursor: "pointer", transition: "all 0.25s" }}>{q}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(44,24,16,0.05)", display: "flex", gap: 7 }}>
            <input placeholder={tx.bot.ph[lang]} style={{ flex: 1, border: "1px solid rgba(44,24,16,0.08)", borderRadius: 9, padding: "9px 12px", fontFamily: "'Outfit',sans-serif", fontSize: 12.5, outline: "none", background: C.parch }} />
            <button style={{ width: 38, height: 38, borderRadius: 9, background: C.sun, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.esp} strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </div>
        </div>
      )}
      <button onClick={() => setOp(o => !o)} className="fabtn" style={{ position: "fixed", bottom: 20, right: 20, width: 56, height: 56, borderRadius: 16, border: "none", cursor: "pointer", background: `linear-gradient(135deg,${C.sun},${C.gold})`, boxShadow: `0 6px 28px ${C.sun}40`, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", fontSize: 24 }}>
        {op ? "×" : "💬"}
      </button>
      {!op && <div style={{ position: "fixed", bottom: 20, right: 20, width: 56, height: 56, borderRadius: 16, border: `2px solid ${C.sun}`, zIndex: 9998, pointerEvents: "none", animation: "bp 2s ease-out infinite" }} />}
      <style>{`
        @keyframes bsi{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:none}}
        @keyframes bp{0%{transform:scale(1);opacity:.4}100%{transform:scale(1.5);opacity:0}}
        .fabtn:hover{transform:scale(1.07)!important;box-shadow:0 10px 36px ${C.sun}55!important}
        .qbtn:hover{background:${C.sun}22!important;border-color:${C.sun}!important}
      `}</style>
    </>
  );
}

/* ═══ FOOTER ═══ */
function Footer() {
  const { lang } = useLang();
  const lnk = [["story", tx.nav.story], ["menu", tx.nav.menu], ["hours", tx.nav.hours], ["cart", tx.nav.cart], ["workshops", tx.nav.ws]];
  return (
    <footer style={{ background: C.esp, padding: "48px 24px 32px", textAlign: "center", borderTop: `1px solid ${C.sun}0c` }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, color: C.sun, fontWeight: 700, marginBottom: 6 }}>Caniço</p>
      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12.5, color: C.cream + "35", marginBottom: 24, lineHeight: 1.8 }}>Zietenstraße 42 · 09130 Chemnitz · Sonnenberg</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginBottom: 28, flexWrap: "wrap" }}>
        {lnk.map(([id, t]) => <a key={id} href={"#" + id} className="flink" style={{ color: C.cream + "30", textDecoration: "none", fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 1.5, transition: "color 0.3s" }}>{t[lang]}</a>)}
      </div>
      <div style={{ width: 36, height: 1, background: C.sun + "15", margin: "0 auto 20px" }} />
      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10.5, color: C.cream + "18" }}>© 2026 Café Caniço · {lang === "de" ? "Mit ☕ und 💛 in Chemnitz" : "With ☕ and 💛 in Chemnitz"}</p>
      <style>{`.flink:hover{color:${C.sun}!important}`}</style>
    </footer>
  );
}

/* ═══ APP ═══ */
export default function App() {
  const [lang, setLang] = useState("de");
  return (
    <LangCtx.Provider value={{ lang, setLang }}>
      <div style={{ background: C.cream, minHeight: "100vh", overflowX: "hidden" }}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <Navbar />
        <Hero />
        <Marquee />
        <Story />
        <MenuSec />
        <Hours />
        <Cart />
        <WS />
        <IG />
        <Footer />
        <Bot />
      </div>
    </LangCtx.Provider>
  );
}

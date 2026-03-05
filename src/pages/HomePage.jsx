// src/pages/HomePage.jsx
// Landing page — matches wireframe layout exactly
// Design: Dark tactical safety theme with teal accent — matches existing dashboard palette

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── Carousel images: crowd/stampede/safety context ───────────────────────────
// Using Unsplash with crowd/festival/safety keywords
const CAROUSEL_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1400&q=80",
    caption: "Kumbh Mela — 45 crore pilgrims. One moment of separation.",
  },
  {
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80",
    caption: "Festivals bring joy. Crowds bring danger. Be prepared.",
  },
  {
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400&q=80",
    caption: "Every second counts when a loved one disappears in a crowd.",
  },
  {
    url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1400&q=80",
    caption: "Mass gatherings. Zero margin for error.",
  },
  {
    url: "https://images.unsplash.com/photo-1504276048855-f3d60e69632f?w=1400&q=80",
    caption: "Children and elders — the most vulnerable in any crowd.",
  },
];

// ── GPS Track feature bullets ────────────────────────────────────────────────
const GPS_FEATURES = [
  "Live GPS coordinates updated every 2 seconds via ESP32",
  "Real-time map with animated device marker on Leaflet",
  "Supports multiple devices simultaneously",
  "Works on Wi-Fi — ultra-low latency via Firebase WebSocket",
  "Field-tested accuracy: ±2.5m in open environments",
];

// ── Geofence feature bullets ─────────────────────────────────────────────────
const GEO_FEATURES = [
  "Draw a virtual safe boundary on any map",
  "Instant breach detection using Haversine algorithm",
  "Siren alert + browser push notification on exit",
  "Adjustable radius from 50m to 1km",
  "All logic runs client-side — zero server delay",
];

// ── Parent reviews ────────────────────────────────────────────────────────────
const REVIEWS = [
  {
    name: "Priya Sharma",
    location: "Nashik, MH",
    avatar: "PS",
    rating: 5,
    text: "We used this at the Nashik Kumbh Mela. My father-in-law wandered off and we found him within 4 minutes because of the alert. Absolutely life-saving device.",
  },
  {
    name: "Rajesh Gupta",
    location: "Prayagraj, UP",
    avatar: "RG",
    rating: 5,
    text: "The geofence alert woke me up at 2 AM when my child left the tent area. Without this tracker, I wouldn't have known until morning.",
  },
  {
    name: "Meera Iyer",
    location: "Chennai, TN",
    avatar: "MI",
    rating: 5,
    text: "Simple device, no screens, no buttons. My 78-year-old mother wears it and has no idea it's tracking her. Perfect for elders who can't use smartphones.",
  },
  {
    name: "Arjun Mehta",
    location: "Mumbai, MH",
    avatar: "AM",
    rating: 4,
    text: "Dashboard is incredibly intuitive. Set up the safe zone in 30 seconds. The live map updates smoothly — feels like professional GPS tracking software.",
  },
  {
    name: "Sunita Patil",
    location: "Pune, MH",
    avatar: "SP",
    rating: 5,
    text: "Took it to a crowded pilgrimage. My son's device showed up perfectly on the map the whole time. Peace of mind is priceless.",
  },
  {
    name: "Vikram Nair",
    location: "Kochi, KL",
    avatar: "VN",
    rating: 5,
    text: "The hardware is surprisingly compact — fits in a shirt pocket. Battery lasted all day. Excellent build quality for the price.",
  },
];

// ── Star component ─────────────────────────────────────────────────────────────
function Stars({ count }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= count ? "#f59e0b" : "#2a3a4a", fontSize: 14 }}>★</span>
      ))}
    </div>
  );
}

// ── Infinite carousel component ────────────────────────────────────────────────
function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = (idx) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 700);
  };

  const next = () => goTo((current + 1) % CAROUSEL_IMAGES.length);
  const prev = () => goTo((current - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 4500);
    return () => clearInterval(timerRef.current);
  }, [current]);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      borderRadius: 0,
    }}>
      {CAROUSEL_IMAGES.map((img, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${img.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.7s ease",
            zIndex: i === current ? 1 : 0,
          }}
        />
      ))}

      {/* Dark overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "linear-gradient(120deg, rgba(8,12,18,0.88) 40%, rgba(8,12,18,0.5) 100%)",
      }} />

      {/* Nav arrows */}
      {["prev", "next"].map((dir) => (
        <button
          key={dir}
          onClick={dir === "prev" ? prev : next}
          style={{
            position: "absolute",
            top: "50%",
            [dir === "prev" ? "left" : "right"]: 24,
            transform: "translateY(-50%)",
            zIndex: 10,
            background: "rgba(31,159,176,0.15)",
            border: "1px solid rgba(31,159,176,0.4)",
            color: "#2bc4d8",
            width: 44,
            height: 44,
            borderRadius: "50%",
            fontSize: 20,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
            backdropFilter: "blur(4px)",
          }}
        >
          {dir === "prev" ? "‹" : "›"}
        </button>
      ))}

      {/* Dots */}
      <div style={{
        position: "absolute",
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 10,
        zIndex: 10,
      }}>
        {CAROUSEL_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              borderRadius: 4,
              background: i === current ? "#1f9fb0" : "rgba(255,255,255,0.3)",
              border: "none",
              cursor: "pointer",
              transition: "width 0.3s, background 0.3s",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Reviews infinite scroll ────────────────────────────────────────────────────
function ReviewsScroll() {
  const doubled = [...REVIEWS, ...REVIEWS];
  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div style={{
        display: "flex",
        gap: 20,
        animation: "reviewsScroll 32s linear infinite",
        width: "max-content",
      }}>
        {doubled.map((r, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: 300,
              background: "rgba(17,25,39,0.9)",
              border: "1px solid #1e3a5f",
              borderRadius: 14,
              padding: "22px 20px",
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 40, height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1f9fb0, #0d4a56)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 13,
                fontFamily: "'Exo 2', sans-serif",
                flexShrink: 0,
              }}>
                {r.avatar}
              </div>
              <div>
                <div style={{ color: "#e2eaf4", fontWeight: 700, fontSize: 14, fontFamily: "'Exo 2', sans-serif" }}>{r.name}</div>
                <div style={{ color: "#4a6a88", fontSize: 12, fontFamily: "'Share Tech Mono', monospace" }}>{r.location}</div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <Stars count={r.rating} />
              </div>
            </div>
            <p style={{
              color: "#7a9ab8",
              fontSize: 13,
              lineHeight: 1.65,
              fontFamily: "'Exo 2', sans-serif",
              margin: 0,
            }}>
              "{r.text}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main HomePage ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const S = styles;

  return (
    <div style={S.page}>

      {/* ══ NAVBAR ═══════════════════════════════════════════════════════════ */}
      <nav style={{
        ...S.navbar,
        background: scrolled
          ? "rgba(8,12,18,0.97)"
          : "transparent",
        borderBottom: scrolled ? "1px solid #1e3a5f" : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.5)" : "none",
      }}>
        {/* Logo */}
        <div style={S.navLogo}>
          <div style={S.navLogoIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                fill="#1f9fb0" opacity="0.9"/>
              <circle cx="12" cy="9" r="2.5" fill="#fff"/>
              <path d="M3 21h18" stroke="#1f9fb0" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
            </svg>
          </div>
          <span style={S.navLogoText}>Fence<span style={{ color: "#1f9fb0" }}>Track</span></span>
        </div>

        {/* Nav links */}
        <div style={S.navLinks}>
          {["Track", "Order", "Help"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} style={S.navLink}>{item}</a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button style={S.btnNavOutline} onClick={() => navigate("/login")}>
            Log In
          </button>
          <button style={S.btnNavFill} onClick={() => navigate("/login")}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ══ HERO SECTION ═════════════════════════════════════════════════════ */}
      <section style={S.hero}>
        {/* Carousel fills entire hero */}
        <div style={{ position: "absolute", inset: 0 }}>
          <HeroCarousel />
        </div>

        {/* Hero content — left aligned over carousel */}
        <div style={S.heroContent}>
          <div style={S.heroBadge}>
            <span style={{ color: "#1f9fb0" }}>●</span>
            &nbsp;Live Tracking Active &nbsp;·&nbsp; Kumbh Mela Ready
          </div>

          <h1 style={S.heroHeadline}>
            When Crowds
            <br />
            <span style={S.heroAccent}>Swallow</span> Your
            <br />
            Loved Ones —
            <br />
            <span style={S.heroAccentGlow}>We Find Them.</span>
          </h1>

          <p style={S.heroSubtitle}>
            Real-time GPS wearable for children and elders.<br />
            Instant geofence alerts. Zero interaction required.
          </p>

          <div style={S.heroCtas}>
            <button style={S.btnHeroPrimary} onClick={() => navigate("/login")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white"/>
                <circle cx="12" cy="9" r="2.5" fill="#1f9fb0"/>
              </svg>
              Buy Device / Live Track
            </button>
            <button style={S.btnHeroSecondary}
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
              See How It Works ↓
            </button>
          </div>

          {/* Trust bar */}
          <div style={S.heroTrustBar}>
            {[
              ["45Cr+", "Kumbh Attendees"],
              ["<300ms", "Alert Speed"],
              ["±2.5m", "GPS Accuracy"],
              ["8–12hr", "Battery Life"],
            ].map(([val, label]) => (
              <div key={label} style={S.heroStat}>
                <span style={S.heroStatVal}>{val}</span>
                <span style={S.heroStatLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GPS TRACK SECTION ════════════════════════════════════════════════ */}
      <section id="how-it-works" style={S.section}>
        <div style={S.sectionInner}>

          {/* Left: text */}
          <div style={S.featureLeft}>
            <div style={S.sectionBadge}>📡 GPS Track</div>
            <h2 style={S.sectionHeading}>Real-Time Location.<br />Every 2 Seconds.</h2>
            <p style={S.sectionSub}>
              The ESP32-powered wearable reads GPS coordinates from the NEO-6M module and
              pushes them to Firebase Realtime Database. Your dashboard updates instantly
              via WebSocket — no refresh needed, no delay.
            </p>
            <ul style={S.featureList}>
              {GPS_FEATURES.map((f) => (
                <li key={f} style={S.featureItem}>
                  <span style={S.featureDot} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: device showcase placeholder */}
          <div style={S.featureRight}>
            <div style={S.deviceShowcase}>
              <div style={S.deviceMockMap}>
                {/* Animated map mock */}
                <div style={S.mockMapGrid} />
                {/* Safe zone circle */}
                <div style={S.mockCircle} />
                {/* Pulsing device dot */}
                <div style={S.mockDotWrap}>
                  <div style={S.mockDotRipple} />
                  <div style={S.mockDot} />
                </div>
                {/* Distance badge */}
                <div style={S.mockBadge}>
                  <span style={{ color: "#22c55e", fontWeight: 700 }}>✅</span>
                  &nbsp;187m · Inside Zone
                </div>
              </div>
              <div style={S.deviceInfo}>
                <div style={S.deviceInfoRow}>
                  <span style={{ color: "#4a6a88" }}>Device</span>
                  <code style={{ color: "#2bc4d8", fontSize: 12 }}>child_rahul_device</code>
                </div>
                <div style={S.deviceInfoRow}>
                  <span style={{ color: "#4a6a88" }}>Latitude</span>
                  <code style={{ color: "#e2eaf4", fontSize: 12 }}>20.016301</code>
                </div>
                <div style={S.deviceInfoRow}>
                  <span style={{ color: "#4a6a88" }}>Longitude</span>
                  <code style={{ color: "#e2eaf4", fontSize: 12 }}>73.786712</code>
                </div>
                <div style={S.deviceInfoRow}>
                  <span style={{ color: "#4a6a88" }}>Update</span>
                  <code style={{ color: "#f59e0b", fontSize: 12 }}>Every 2 sec</code>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══ GEOFENCE SECTION ═════════════════════════════════════════════════ */}
      <section style={{ ...S.section, background: "rgba(15,28,46,0.6)" }}>
        <div style={{ ...S.sectionInner, flexDirection: "row-reverse" }}>

          {/* Right: text */}
          <div style={S.featureLeft}>
            <div style={{ ...S.sectionBadge, background: "rgba(245,158,11,0.1)", color: "#f59e0b", borderColor: "rgba(245,158,11,0.3)" }}>
              🛡 Geofence (Safe Zone)
            </div>
            <h2 style={S.sectionHeading}>Draw a Boundary.<br />We Guard It.</h2>
            <p style={S.sectionSub}>
              Tap anywhere on the map to place a virtual safe zone. The moment your child
              or elder steps outside, your phone screams — siren, banner, push notification.
              All processing happens in the browser. Zero server round-trip.
            </p>
            <ul style={S.featureList}>
              {GEO_FEATURES.map((f) => (
                <li key={f} style={S.featureItem}>
                  <span style={{ ...S.featureDot, background: "#f59e0b" }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Left: animated geofence visualization */}
          <div style={S.featureRight}>
            <div style={S.geoShowcase}>
              {/* Animated concentric rings */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: i * 80 + 60,
                    height: i * 80 + 60,
                    borderRadius: "50%",
                    border: `1.5px solid rgba(31,159,176,${0.4 - i * 0.1})`,
                    animation: `geoRing ${2 + i * 0.5}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
              {/* Zone fill */}
              <div style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 140, height: 140,
                borderRadius: "50%",
                background: "rgba(31,159,176,0.08)",
                border: "2px dashed rgba(31,159,176,0.5)",
              }} />
              {/* Center pin */}
              <div style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%, -60%)",
                width: 20, height: 20,
                background: "#1f9fb0",
                borderRadius: "50% 50% 50% 0",
                transformOrigin: "center bottom",
                rotate: "-45deg",
              }} />
              {/* Alert badge */}
              <div style={{
                position: "absolute",
                bottom: 24, left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.5)",
                borderRadius: 8,
                padding: "6px 14px",
                color: "#ef4444",
                fontSize: 13,
                fontFamily: "'Exo 2', sans-serif",
                fontWeight: 700,
                whiteSpace: "nowrap",
                animation: "alertPulse 1.5s ease infinite",
              }}>
                🚨 BREACH DETECTED — 412m
              </div>
              {/* Info label */}
              <div style={{
                position: "absolute",
                top: 16, right: 16,
                background: "rgba(31,159,176,0.1)",
                border: "1px solid rgba(31,159,176,0.3)",
                borderRadius: 8,
                padding: "5px 12px",
                color: "#2bc4d8",
                fontSize: 12,
                fontFamily: "'Share Tech Mono', monospace",
              }}>
                Radius: 250m
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══ REVIEWS SECTION ══════════════════════════════════════════════════ */}
      <section style={S.reviewsSection}>
        <div style={S.reviewsHeader}>
          <div style={{ ...S.sectionBadge, marginBottom: 16 }}>💬 Parent Reviews</div>
          <h2 style={{ ...S.sectionHeading, textAlign: "center", marginBottom: 8 }}>
            Trusted by Families Across India
          </h2>
          <p style={{ ...S.sectionSub, textAlign: "center", maxWidth: 480, margin: "0 auto 40px" }}>
            From Kumbh Mela pilgrims to city parents — real stories, real safety.
          </p>
        </div>
        <ReviewsScroll />
      </section>

      {/* ══ CTA BANNER ════════════════════════════════════════════════════════ */}
      <section style={S.ctaBanner}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, rgba(31,159,176,0.15) 0%, transparent 70%)",
        }} />
        <h2 style={{ ...S.sectionHeading, textAlign: "center", fontSize: 34, marginBottom: 12, position: "relative" }}>
          Ready to Protect What Matters?
        </h2>
        <p style={{ ...S.sectionSub, textAlign: "center", marginBottom: 32, position: "relative" }}>
          Set up in under 5 minutes. No technical knowledge required.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", position: "relative" }}>
          <button style={S.btnHeroPrimary} onClick={() => navigate("/login")}>
            Start Tracking Free
          </button>
          <button style={S.btnHeroSecondary}>
            View Dashboard Demo
          </button>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════════════════ */}
      <footer style={S.footer}>
        <div style={S.footerInner}>

          {/* Brand */}
          <div style={S.footerBrand}>
            <div style={{ ...S.navLogo, marginBottom: 12 }}>
              <div style={S.navLogoIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#1f9fb0"/>
                  <circle cx="12" cy="9" r="2.5" fill="#fff"/>
                </svg>
              </div>
              <span style={{ ...S.navLogoText, fontSize: 18 }}>Fence<span style={{ color: "#1f9fb0" }}>Track</span></span>
            </div>
            <p style={{ color: "#4a6a88", fontSize: 13, lineHeight: 1.7, maxWidth: 260, fontFamily: "'Exo 2', sans-serif" }}>
              Smart GPS wearable for children and elders. Designed for India's mass gatherings — Kumbh Mela, pilgrimages, fairs.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              {["GitHub", "Twitter", "LinkedIn"].map((s) => (
                <a key={s} href="#" style={S.socialBtn}>{s[0]}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              heading: "Product",
              links: ["How It Works", "Live Tracking", "Geofence Alerts", "Device Specs", "Pricing"],
            },
            {
              heading: "Support",
              links: ["Documentation", "Setup Guide", "FAQ", "Contact Us", "Report Issue"],
            },
            {
              heading: "Company",
              links: ["About", "Blog", "Privacy Policy", "Terms of Service", "Research"],
            },
          ].map((col) => (
            <div key={col.heading}>
              <h4 style={S.footerColHead}>{col.heading}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((link) => (
                  <li key={link} style={{ marginBottom: 10 }}>
                    <a href="#" style={S.footerLink}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={S.footerBottom}>
          <span>© 2025 FenceTrack. Built for Kumbh Mela 2025.</span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ color: "#1f9fb0", fontSize: 12 }}>●</span>
            <span>All systems operational</span>
          </div>
        </div>
      </footer>

      {/* ══ GLOBAL KEYFRAMES ══════════════════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;800;900&family=Share+Tech+Mono&family=Bebas+Neue&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #080c12; overflow-x: hidden; }

        @keyframes reviewsScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        @keyframes geoRing {
          from { opacity: 0.3; transform: translate(-50%, -50%) scale(0.95); }
          to   { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); }
        }

        @keyframes alertPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          50%       { opacity: 0.85; box-shadow: 0 0 0 6px rgba(239,68,68,0); }
        }

        @keyframes dotRipple {
          0%   { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(3); opacity: 0; }
        }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes accentGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(31,159,176,0.5); }
          50%       { text-shadow: 0 0 40px rgba(31,159,176,0.9), 0 0 80px rgba(31,159,176,0.3); }
        }

        @keyframes mapGridMove {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }

        a { text-decoration: none; }
      `}</style>
    </div>
  );
}

// ── Styles object ─────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#080c12",
    fontFamily: "'Exo 2', sans-serif",
    color: "#e2eaf4",
    overflowX: "hidden",
  },

  // Navbar
  navbar: {
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    height: 68,
    transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
    backdropFilter: "blur(12px)",
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
  },
  navLogoIcon: {
    width: 36, height: 36,
    background: "rgba(31,159,176,0.12)",
    border: "1px solid rgba(31,159,176,0.3)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navLogoText: {
    fontSize: 20,
    fontWeight: 800,
    color: "#e2eaf4",
    letterSpacing: "0.04em",
    fontFamily: "'Exo 2', sans-serif",
  },
  navLinks: {
    display: "flex",
    gap: 36,
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  },
  navLink: {
    color: "#7a9ab8",
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    transition: "color 0.2s",
    cursor: "pointer",
  },
  btnNavOutline: {
    padding: "8px 20px",
    background: "transparent",
    border: "1px solid #1e3a5f",
    color: "#7a9ab8",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Exo 2', sans-serif",
    transition: "border-color 0.2s, color 0.2s",
  },
  btnNavFill: {
    padding: "8px 20px",
    background: "#1f9fb0",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Exo 2', sans-serif",
    transition: "background 0.2s",
  },

  // Hero
  hero: {
    position: "relative",
    height: "100vh",
    minHeight: 640,
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  },
  heroContent: {
    position: "relative",
    zIndex: 10,
    padding: "0 80px",
    maxWidth: 680,
    animation: "heroFadeUp 0.8s ease",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(31,159,176,0.1)",
    border: "1px solid rgba(31,159,176,0.3)",
    borderRadius: 20,
    padding: "5px 14px",
    fontSize: 12,
    fontWeight: 600,
    color: "#7a9ab8",
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: "0.05em",
    marginBottom: 24,
  },
  heroHeadline: {
    fontSize: "clamp(40px, 6vw, 72px)",
    fontWeight: 900,
    lineHeight: 1.05,
    letterSpacing: "-0.02em",
    color: "#e2eaf4",
    fontFamily: "'Exo 2', sans-serif",
    marginBottom: 24,
  },
  heroAccent: {
    color: "#ef4444",
    fontStyle: "italic",
  },
  heroAccentGlow: {
    color: "#1f9fb0",
    animation: "accentGlow 3s ease infinite",
    display: "inline-block",
  },
  heroSubtitle: {
    fontSize: 17,
    color: "#7a9ab8",
    lineHeight: 1.7,
    marginBottom: 36,
    fontWeight: 400,
  },
  heroCtas: {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
    marginBottom: 40,
  },
  btnHeroPrimary: {
    display: "inline-flex",
    alignItems: "center",
    padding: "13px 28px",
    background: "#1f9fb0",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Exo 2', sans-serif",
    transition: "background 0.2s, transform 0.1s",
    letterSpacing: "0.02em",
  },
  btnHeroSecondary: {
    display: "inline-flex",
    alignItems: "center",
    padding: "13px 28px",
    background: "rgba(255,255,255,0.06)",
    color: "#e2eaf4",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Exo 2', sans-serif",
    backdropFilter: "blur(6px)",
    transition: "background 0.2s",
  },
  heroTrustBar: {
    display: "flex",
    gap: 32,
    flexWrap: "wrap",
  },
  heroStat: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  heroStatVal: {
    fontSize: 22,
    fontWeight: 800,
    color: "#1f9fb0",
    fontFamily: "'Share Tech Mono', monospace",
  },
  heroStatLabel: {
    fontSize: 11,
    color: "#4a6a88",
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },

  // Sections
  section: {
    padding: "100px 80px",
    background: "transparent",
  },
  sectionInner: {
    display: "flex",
    gap: 60,
    alignItems: "center",
    maxWidth: 1200,
    margin: "0 auto",
  },
  sectionBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(31,159,176,0.1)",
    border: "1px solid rgba(31,159,176,0.3)",
    borderRadius: 20,
    padding: "5px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: "#1f9fb0",
    marginBottom: 20,
    fontFamily: "'Exo 2', sans-serif",
  },
  sectionHeading: {
    fontSize: 36,
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
    color: "#e2eaf4",
    marginBottom: 16,
    fontFamily: "'Exo 2', sans-serif",
  },
  sectionSub: {
    fontSize: 16,
    color: "#7a9ab8",
    lineHeight: 1.75,
    marginBottom: 28,
  },
  featureLeft: { flex: 1, minWidth: 320 },
  featureRight: { flex: 1, minWidth: 320 },
  featureList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  featureItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    color: "#7a9ab8",
    fontSize: 14,
    lineHeight: 1.6,
  },
  featureDot: {
    flexShrink: 0,
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#1f9fb0",
    marginTop: 6,
  },

  // Device showcase
  deviceShowcase: {
    background: "rgba(17,25,39,0.8)",
    border: "1px solid #1e3a5f",
    borderRadius: 18,
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  },
  deviceMockMap: {
    position: "relative",
    height: 280,
    background: "#0a1520",
    overflow: "hidden",
  },
  mockMapGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage: "linear-gradient(rgba(31,159,176,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(31,159,176,0.06) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    animation: "mapGridMove 8s linear infinite",
  },
  mockCircle: {
    position: "absolute",
    top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    width: 120, height: 120,
    borderRadius: "50%",
    border: "2px solid rgba(34,197,94,0.5)",
    background: "rgba(34,197,94,0.06)",
  },
  mockDotWrap: {
    position: "absolute",
    top: "50%", left: "45%",
    transform: "translate(-50%, -50%)",
  },
  mockDotRipple: {
    position: "absolute",
    top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    width: 24, height: 24,
    borderRadius: "50%",
    background: "rgba(31,159,176,0.3)",
    animation: "dotRipple 1.5s ease-out infinite",
  },
  mockDot: {
    position: "relative",
    width: 12, height: 12,
    borderRadius: "50%",
    background: "#1f9fb0",
    border: "2px solid #fff",
    boxShadow: "0 0 8px rgba(31,159,176,0.8)",
  },
  mockBadge: {
    position: "absolute",
    bottom: 14, left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(8,12,18,0.9)",
    border: "1px solid rgba(34,197,94,0.4)",
    borderRadius: 8,
    padding: "5px 14px",
    fontSize: 12,
    color: "#e2eaf4",
    fontFamily: "'Share Tech Mono', monospace",
    whiteSpace: "nowrap",
  },
  deviceInfo: {
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  deviceInfoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 13,
    fontFamily: "'Share Tech Mono', monospace",
    paddingBottom: 8,
    borderBottom: "1px solid rgba(30,58,95,0.5)",
  },

  // Geofence showcase
  geoShowcase: {
    position: "relative",
    height: 360,
    background: "rgba(11,26,48,0.8)",
    border: "1px solid #1e3a5f",
    borderRadius: 18,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // Reviews section
  reviewsSection: {
    padding: "80px 0",
    overflow: "hidden",
    background: "rgba(10,16,26,0.8)",
  },
  reviewsHeader: {
    textAlign: "center",
    padding: "0 80px",
    marginBottom: 40,
  },

  // CTA banner
  ctaBanner: {
    position: "relative",
    padding: "100px 80px",
    textAlign: "center",
    background: "rgba(15,28,46,0.5)",
    borderTop: "1px solid #1e3a5f",
    borderBottom: "1px solid #1e3a5f",
    overflow: "hidden",
  },

  // Footer
  footer: {
    background: "#060a10",
    padding: "60px 80px 0",
    borderTop: "1px solid #1e3a5f",
  },
  footerInner: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: 48,
    maxWidth: 1200,
    margin: "0 auto",
    paddingBottom: 48,
  },
  footerBrand: {
    display: "flex",
    flexDirection: "column",
  },
  footerColHead: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#4a6a88",
    marginBottom: 18,
    fontFamily: "'Share Tech Mono', monospace",
  },
  footerLink: {
    color: "#4a6a88",
    fontSize: 14,
    transition: "color 0.2s",
    fontFamily: "'Exo 2', sans-serif",
    cursor: "pointer",
  },
  footerBottom: {
    borderTop: "1px solid #1e3a5f",
    padding: "20px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#2a3a4a",
    fontSize: 13,
    fontFamily: "'Share Tech Mono', monospace",
    maxWidth: 1200,
    margin: "0 auto",
  },
  socialBtn: {
    width: 34, height: 34,
    background: "rgba(30,58,95,0.5)",
    border: "1px solid #1e3a5f",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#4a6a88",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    transition: "border-color 0.2s, color 0.2s",
    fontFamily: "'Exo 2', sans-serif",
    textDecoration: "none",
  },
};
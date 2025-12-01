// src/components/Header.jsx
import { animate, AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import pageBg from "../assets/background with white colour.png";
import boardImg from "../assets/board.png";
import close from "../assets/close.svg";
import EcoCard from "../assets/farmcard.png";
import Logo from "../assets/Logo.png";
import menu from "../assets/menu.svg";
import search from "../assets/search.png";
import SpacePreviewVideo from "../assets/space-priview.mp4";
import BlogPage from "../components/BlogPage";

/* small animation variants */
const navItemVariant = {
  rest: { y: 0, scale: 1, color: "rgb(107 114 128)" },
  hover: { y: -4, scale: 1.02, color: "rgb(0 0 0)", transition: { type: "spring", stiffness: 300, damping: 18 } },
};

const underlineVariant = { hidden: { width: 0 }, visible: { width: "100%", transition: { duration: 0.18 } } };

const dropdownVariant = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { when: "beforeChildren", staggerChildren: 0.06, duration: 0.18 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
};

const dropdownItem = { hidden: { opacity: 0, x: -6 }, visible: { opacity: 1, x: 0, transition: { duration: 0.18 } } };

/* ---------------------------
   Avatar (deterministic SVG)
   --------------------------- */
function Avatar({ avatarUrl, displayName, email, size = 32, className = "" }) {
  const nameSource = displayName || email || "U";
  const initials = nameSource
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
    const palette = [
      "#16A34A", "#059669", "#10B981", "#0EA5A4", "#06B6D4",
      "#3B82F6", "#6366F1", "#8B5CF6", "#A78BFA", "#EF4444",
      "#F97316", "#F59E0B", "#EAB308", "#84CC16", "#00B894"
    ];
    const idx = Math.abs(hash) % palette.length;
    return palette[idx];
  }

  function createSvgDataUrl(initialsStr, bgColor, textColor = "#ffffff", s = 128) {
    const fontSize = Math.round(s * 0.42);
    const rx = Math.round(s * 0.18);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
        <rect width="100%" height="100%" fill="${bgColor}" rx="${rx}" ry="${rx}" />
        <text x="50%" y="50%" dy="${Math.round(fontSize / 3)}" text-anchor="middle" font-family="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="${fontSize}" fill="${textColor}" font-weight="600">${initialsStr}</text>
      </svg>
    `.trim();
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  const bg = stringToColor(email || displayName || "default");
  const svgData = createSvgDataUrl(initials, bg, "#fff", Math.max(96, size * 3));

  const style = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
    borderRadius: "9999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    background: "transparent",
  };

  return (
    <div style={style} className={`relative ${className}`} aria-hidden={false}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName || email || "Profile"}
          style={{ width: size, height: size, objectFit: "cover", display: "block" }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = svgData;
          }}
        />
      ) : (
        <img src={svgData} alt="avatar" style={{ width: size, height: size, display: "block" }} />
      )}
    </div>
  );
}

/* -------------------------
   Floating Eco Card
   ------------------------- */
function FloatingEcoCard({ avatarUrl }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateZ = useTransform(x, [-200, 200], [-18, 18]);
  const rotateX = useTransform(y, [-200, 200], [14, -14]);
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef(null);
  const bobRef = useRef(null);

  useEffect(() => {
    const controls = animate(0, 1, {
      duration: 3.6,
      repeat: Infinity,
      ease: "easeInOut",
      onUpdate: (v) => {
        if (isDragging || isExpanded) return;
        const bobX = Math.sin(v * Math.PI * 2) * 6;
        const bobY = Math.cos(v * Math.PI * 2) * 3;
        x.set(bobX);
        y.set(bobY);
      },
    });
    bobRef.current = controls;
    return () => controls.stop();
  }, [isDragging, isExpanded, x, y]);

  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    animate(x, 0, { type: "spring", stiffness: 220, damping: 18 });
    animate(y, 0, { type: "spring", stiffness: 220, damping: 18 });
    animate(x, 10 * Math.sign(info.velocity.x || 1), { type: "spring", stiffness: 140, damping: 12 });
  };

  const handleDragStart = () => {
    setIsDragging(true);
    bobRef.current?.stop?.();
  };

  useEffect(() => {
    function onKey(e) {
      if (!cardRef.current) return;
      if (document.activeElement !== cardRef.current && !isExpanded) return;
      if (e.key === "ArrowLeft") animate(x, x.get() - 16, { type: "spring", stiffness: 220, damping: 18 });
      if (e.key === "ArrowRight") animate(x, x.get() + 16, { type: "spring", stiffness: 220, damping: 18 });
      if (e.key === "ArrowUp") animate(y, y.get() - 12, { type: "spring", stiffness: 220, damping: 18 });
      if (e.key === "ArrowDown") animate(y, y.get() + 12, { type: "spring", stiffness: 220, damping: 18 });
      if (e.key === "Escape" && isExpanded) setIsExpanded(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [x, y, isExpanded]);

  const handleClick = (e) => {
    if (isDragging) return;
    setIsExpanded((s) => !s);
  };

  useEffect(() => {
    if (isExpanded) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isExpanded]);

  const cardSize = 72;
  return (
    <>
      <motion.div
        ref={cardRef}
        className="z-50"
        style={{
          x,
          y,
          rotateZ,
          rotateX,
          transformOrigin: "50% 0%",
          touchAction: "none",
        }}
        drag={!isExpanded}
        dragMomentum
        dragConstraints={{ left: -220, right: 220, top: -120, bottom: 120 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.98 }}
        role="button"
        tabIndex={0}
        aria-label="Eco card; draggable; click to expand"
        onClick={handleClick}
      >
        <motion.img
          src={EcoCard}
          alt="Eco Card"
          className="block relative top-[94px] rounded-md select-none"
          style={{
            width: cardSize * (4 / 3),
            height: cardSize * 1.6,
            objectFit: "cover",
            borderRadius: 10,
            display: "block",
            userSelect: "none",
            cursor: isDragging ? "grabbing" : "pointer",
          }}
          draggable={false}
        />
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="eco-expanded-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            aria-modal="true"
            role="dialog"
            aria-label="Eco card preview"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div className="absolute inset-0 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} />

            <motion.div
              className="relative z-10 max-w-[92vw] sm:max-w-xl rounded-2xl bg-white shadow-2xl p-6 flex flex-col items-center"
              initial={{ scale: 0.92, y: 18, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 12, opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex justify-between items-start gap-4">
                <h3 className="text-lg font-semibold">Eco Card</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  aria-label="Close eco card preview"
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <div className="mt-3 w-full flex justify-center">
                <img
                  src={EcoCard}
                  alt="Eco Card large"
                  className="max-h-[60vh] w-auto rounded-lg object-contain"
                  style={{ userSelect: "none" }}
                  draggable={false}
                />
              </div>

              <div className="mt-5 w-full flex gap-3 justify-center">
                <a
                  href={EcoCard}
                  download="EcoCard.png"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-600 bg-white text-green-700 font-semibold hover:bg-green-50"
                  onClick={() => {
                    setTimeout(() => setIsExpanded(false), 150);
                  }}
                >
                  ⤓ Download PNG
                </a>

                <a
                  href={EcoCard}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700"
                >
                  Open
                </a>
              </div>

              <p className="mt-3 text-xs text-gray-500 text-center">PNG with transparent background. Right-click if you want "Save image as..."</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* Navigation subcomponent (COMMUNITY now has dropdown with Leaderboard) */
function Navigation({ onFeatureToggle, featuresOpen, featuresRef, onOpenBlog, handleGameNavigation }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

  // detect transition from not-signed-in -> signed-in and auto-open dropdown briefly
  const prevUserRef = useRef(currentUser);
  useEffect(() => {
    // if previously there was no user and now there's a user -> open dropdown
    if (!prevUserRef.current && currentUser) {
      setProfileDropdownOpen(true);
      // automatically close after 8s so it doesn't hang forever
      const t = setTimeout(() => setProfileDropdownOpen(false), 8000);
      return () => clearTimeout(t);
    }
    prevUserRef.current = currentUser;
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      setProfileDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      // close community dropdown if clicking outside
      if (!event.target.closest("#community-dropdown") && !event.target.closest("[data-community-toggle]")) {
        setCommunityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <ul className="nav-ul list-none flex flex-col sm:flex-row font-bruno text-gray-400 gap-12 items-center">
      {/* LEARN */}
      <li className="nav-li">
        <motion.button initial="rest" whileHover="hover" animate="rest" className="relative" aria-label="Learn button">
          <motion.a
            variants={{
              rest: { scale: 1, boxShadow: "0 6px 18px rgba(51,172,51,0.18)" },
              hover: { scale: 1.03, boxShadow: "0 12px 26px rgba(51,172,51,0.22)", transition: { type: "spring", stiffness: 280, damping: 18 } },
            }}
            className="inline-block px-5 py-2 rounded-full bg-gradient-to-br from-[#2FB23F] to-[#2DA23A] text-white font-semibold text-sm"
          >
            LEARN
          </motion.a>
        </motion.button>
      </li>

      {/* FEATURES (GAMES) */}
      <li className="nav-li relative cursor-pointer" ref={featuresRef} aria-haspopup="true" onClick={(e) => e.stopPropagation()}>
        <motion.div initial="rest" whileHover="hover" animate="rest" className="flex items-center gap-2">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onFeatureToggle();
            }}
            className="flex items-center gap-2 py-1 px-1"
            aria-expanded={featuresOpen}
            aria-controls="features-dropdown"
          >
            <motion.span variants={navItemVariant} className="nav-link select-none">
              GAMES
            </motion.span>

            <motion.svg
              animate={{ rotate: featuresOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-4 h-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ originX: "50%", originY: "50%" }}
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </motion.button>

          <motion.span className="absolute left-0 right-0 bottom-[-8px] h-[2px] bg-black rounded" initial="hidden" whileHover="visible" variants={underlineVariant} style={{ originX: 0 }} />
        </motion.div>

        {/* Dropdown */}
        <AnimatePresence>
          {featuresOpen && (
            <motion.div
              id="features-dropdown"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dropdownVariant}
              className="absolute top-full left-0 mt-3 w-56 sm:left-auto sm:-right-4 bg-white rounded-lg shadow-xl border border-gray-100 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <motion.ul className="py-2">
                  <motion.li variants={dropdownItem} className="px-4 py-2 hover:bg-gray-50 hover:text-black cursor-pointer relative" onMouseEnter={() => setHoveredItem("space")} onMouseLeave={() => setHoveredItem(null)}>
                    <button
                      onClick={() => {
                        handleGameNavigation("/quiz");
                      }}
                      className="block w-full text-left"
                    >
                      Space Battle {!useAuth().currentUser && "🔒"}
                    </button>
                  </motion.li>

                  <motion.li variants={dropdownItem} className="px-4 py-2 hover:text-black hover:bg-gray-50 cursor-pointer">
                    <button onClick={() => handleGameNavigation("/saviour")} className="block w-full text-left">
                      Water Saviour {!useAuth().currentUser && "🔒"}
                    </button>
                  </motion.li>

                  <motion.li variants={dropdownItem} className="px-4 py-2 hover:text-black hover:bg-gray-50 cursor-pointer">
                    <button onClick={() => handleGameNavigation("/game3")} className="block w-full text-left">
                      Game 3 {!useAuth().currentUser && "🔒"}
                    </button>
                  </motion.li>
                </motion.ul>

                {/* Preview panel (video) */}
                <AnimatePresence>
                  {hoveredItem === "space" && (
                    <motion.div
                      key="space-preview"
                      initial={{ opacity: 0, scale: 0.92, y: 14 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 14 }}
                      transition={{ duration: 0.36, ease: "easeOut" }}
                      className="absolute top-0 left-full ml-4 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 z-50"
                      onMouseEnter={() => setHoveredItem("space")}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="w-full max-h-[80vh] overflow-hidden flex justify-center items-center relative">
                        <motion.video
                          src={SpacePreviewVideo}
                          loop
                          muted
                          autoPlay
                          playsInline
                          preload="auto"
                          className="w-full h-auto object-cover rounded-lg video-snip"
                          animate={{ scale: [1, 1.04, 0.98, 1.02, 1], rotate: [0, 1.6, -1.2, 0.8, 0], x: [0, -3, 2, -1, 0], y: [0, -2, 1.5, -1, 0] }}
                          transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
                        />
                        <motion.div className="absolute inset-0 pointer-events-none snip-glitch" animate={{ opacity: [0, 0.18, 0.04, 0.14, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
                      </div>

                      <div className="mt-3 text-center text-sm font-semibold text-gray-700">🚀 Space Battle — Eco Warriors Knowledge Battle</div>

                      <style>{`
                        .video-snip { will-change: transform; backface-visibility: hidden; -webkit-backface-visibility: hidden; transform-origin: 50% 50%; }
                        .snip-glitch {
                          background:
                            linear-gradient(transparent 60%, rgba(255,255,255,0.02) 61% , rgba(255,255,255,0.02) 62%, transparent 63%),
                            linear-gradient(90deg, rgba(255,0,64,0.03), rgba(0,140,255,0.02));
                          mix-blend-mode: screen; pointer-events: none; opacity: 0; background-size: 100% 6px, 200% 100%; filter: blur(0.3px) saturate(1.05);
                        }
                      `}</style>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </li>

      {/* COMMUNITY (dropdown with Leaderboard) */}
      <li className="nav-li relative">
        <motion.div initial="rest" whileHover="hover" animate="rest" className="relative">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCommunityOpen((s) => !s);
              }}
              data-community-toggle
              className="flex items-center gap-2 py-1 px-1"
              aria-expanded={communityOpen}
              aria-controls="community-dropdown"
            >
              <motion.span variants={navItemVariant} className="nav-link select-none">COMMUNITY</motion.span>

              <motion.svg
                animate={{ rotate: communityOpen ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-4 h-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ originX: "50%", originY: "50%" }}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </button>

            <motion.span className="absolute left-0 right-0 bottom-[-8px] h-[2px] bg-black rounded" initial="hidden" whileHover="visible" variants={underlineVariant} style={{ originX: 0 }} />
          </div>

          <AnimatePresence>
            {communityOpen && (
              <motion.div
                id="community-dropdown"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariant}
                className="absolute top-full left-0 mt-3 w-44 sm:left-auto sm:-right-4 bg-white rounded-lg shadow-xl border border-gray-100 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.ul className="py-2">
                  <motion.li variants={dropdownItem} className="px-4 py-2 hover:bg-gray-50 hover:text-black cursor-pointer">
                 <Link to="/lead">
                 <button
                      onClick={() => {
                        setCommunityOpen(false);

                      }}
                      className="block w-full text-left"
                    >
                      Leaderboard
                    </button>
                 </Link>   
                  </motion.li>

                </motion.ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </li>

      {/* BLOG */}
      <li className="nav-li">
        <motion.div initial="rest" whileHover="hover" animate="rest" className="relative">
          <motion.button onClick={onOpenBlog} className="nav-link">
            <motion.span variants={navItemVariant}>BLOG</motion.span>
          </motion.button>
          <motion.span className="absolute left-0 right-0 bottom-[-8px] h-[2px] bg-black rounded" initial="hidden" whileHover="visible" variants={underlineVariant} style={{ originX: 0 }} />
        </motion.div>
      </li>

      {/* search */}
      <li className="nav-li cursor-pointer">
        <motion.img whileHover={{ scale: 1.04, y: -2 }} src={search} alt="search" className="w-[52px] relative bottom-2 h-[39.75px] hidden sm:flex" />
      </li>

      {/* Authentication Section */}
      {useAuth().currentUser ? (
        <li className="nav-li relative" ref={profileDropdownRef}>
          <motion.div initial="rest" whileHover="hover" animate="rest" className="flex items-center gap-3">
            {/* original behaviour: clicking avatar toggles dropdown */}
            <button onClick={() => setProfileDropdownOpen((s) => !s)} className="flex items-center gap-2 focus:outline-none">
              <Avatar avatarUrl={useAuth().userProfile?.avatarURL || useAuth().currentUser?.photoURL} displayName={useAuth().userProfile?.displayName || useAuth().userProfile?.username || useAuth().currentUser?.displayName} email={useAuth().currentUser?.email} size={32} />
              <span className="text-sm text-gray-700 hidden md:block">{useAuth().userProfile?.username || useAuth().currentUser?.displayName || useAuth().currentUser?.email}</span>
            </button>

            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} transition={{ duration: 0.2 }} className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-2 min-w-[150px] z-50">
                  <Link to="/profile1" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 text-sm">Sign Out</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </li>
      ) : (
        <>
          <li className="nav-li">
            <motion.div initial="rest" whileHover="hover" animate="rest" className="relative">
              <Link to="/log" className="inline-block px-4 py-2 rounded-full text-[#22C55E] font-semibold text-sm hover:text-[#16a34a] transition-colors">LOGIN</Link>
              <motion.span className="absolute left-0 right-0 bottom-[-8px] h-[2px] bg-black rounded" initial="hidden" whileHover="visible" variants={underlineVariant} style={{ originX: 0 }} />
            </motion.div>
          </li>

          <li className="nav-li">
            <motion.div initial="rest" whileHover="hover" animate="rest" className="relative">
              <Link to="/signup" className="inline-block px-4 py-2 rounded-full border-2 border-[#22C55E80] text-[#22C55E] font-semibold text-sm hover:bg-[#22C55E] hover:text-white transition-colors">SIGN UP</Link>
              <motion.span className="absolute left-0 right-0 bottom-[-8px] h-[2px] bg-black rounded" initial="hidden" whileHover="visible" variants={underlineVariant} style={{ originX: 0 }} />
            </motion.div>
          </li>
        </>
      )}
    </ul>
  );
}

/* --- Header component --- */
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const featuresRef = useRef(null);
  const mobileNavRef = useRef(null);
  const { currentUser, userProfile, logout } = useAuth();
  const [transitioning, setTransitioning] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false); // optional overlay if you want modal instead of route

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  useEffect(() => {
    function onDocClick(e) {
      if (featuresRef.current && featuresRef.current.contains(e.target)) return;
      if (mobileNavRef.current && mobileNavRef.current.contains(e.target)) return;
      setFeaturesOpen(false);
    }
    document.addEventListener("click", onDocClick);

    function onEsc(e) {
      if (e.key === "Escape") {
        setBlogOpen(false);
        setLeaderboardOpen(false);
      }
    }
    document.addEventListener("keydown", onEsc);

    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const handleGameNavigation = (gameRoute) => {
    if (!currentUser) {
      navigate("/signup");
      return;
    }
    setTransitioning(true);
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {}
    navigate(gameRoute);
    setTimeout(() => setTransitioning(false), 400);
  };

  function openBlog() {
    setBlogOpen(true);
  }

  function closeBlog() {
    setBlogOpen(false);
  }

  return (
    <>
      <AnimatePresence>{transitioning && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
          <motion.div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
          <p className="mt-3 text-green-600 font-medium">Loading…</p>
        </motion.div>
      )}</AnimatePresence>

      <div className="fixed inset-x-0 z-20 w-full text-black backdrop-blur-lg bg-white/90 border-b border-gray-200 shadow-sm py-5">
        <div className="mx-auto c-space max-w-7xl">
          <div className="flex items-center justify-between md:justify-evenly px-3 py-2 sm:py-0 gap-5">
            <img className="w-[139px] relative bottom-[2px] md:right-[170px] h-[29px]" src={Logo} alt="logo" />

            <button onClick={() => setIsOpen((s) => !s)} className="flex cursor-pointer text-neutral-400 hover:text-white focus:outline-none sm:hidden" aria-label="toggle menu">
              <img className="w-6 h-6" src={isOpen ? close : menu} alt="toggle" />
            </button>

            <nav className="hidden sm:flex">
              <Navigation
                onFeatureToggle={() => setFeaturesOpen((s) => !s)}
                featuresOpen={featuresOpen}
                featuresRef={featuresRef}
                onOpenBlog={openBlog}
                handleGameNavigation={handleGameNavigation}
              />
            </nav>
          </div>
        </div>

        {/* Floating Eco Card anchored to the header's bottom edge (only visible when signed-in) */}
        {currentUser && (
          <div aria-hidden={false} className="pointer-events-none sm:pointer-events-auto">
            <div style={{ position: "absolute", bottom: -18, right: 18, zIndex: 60 }}>
              <div style={{ pointerEvents: "auto" }}>
                <FloatingEcoCard avatarUrl={userProfile?.avatarURL || currentUser?.photoURL || EcoCard} />
              </div>
            </div>
          </div>
        )}

        {/* Mobile dropdown nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div ref={mobileNavRef} className="block overflow-hidden text-center sm:hidden" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.28, ease: "easeInOut" }}>
              <nav className="pb-5">
                <ul className="list-none flex flex-col gap-4 px-6">
                  <li><button className="w-full"><a className="block w-full text-left px-4 py-2 bg-[#33AC33] text-white rounded-md">LEARN</a></button></li>

                  <li>
                    <div className="flex items-center justify-between px-4 py-2 rounded-md cursor-pointer" onClick={() => setFeaturesOpen((s) => !s)}>
                      <span>GAMES</span>
                      <motion.span animate={{ rotate: featuresOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
                        <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </motion.span>
                    </div>

                    <AnimatePresence>
                      {featuresOpen && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.18 }} className="mt-2 bg-white rounded-md shadow-inner mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                          <ul className="py-2">
                            <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer"><button onClick={() => { setIsOpen(false); handleGameNavigation("/quiz"); }} className="block w-full text-left">Space Battle</button></li>
                            <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer"><button onClick={() => { setIsOpen(false); handleGameNavigation("/game2"); }} className="block w-full text-left">Water Saviour</button></li>
                            <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer"><button onClick={() => { setIsOpen(false); handleGameNavigation("/game3"); }} className="block w-full text-left">Game 3</button></li>
                         
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>

                  {/* MOBILE COMMUNITY -> navigate to leaderboard */}
                  <li>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/leaderboard");
                      }}
                      className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50"
                    >
                      COMMUNITY — Leaderboard
                    </button>
                  </li>

                  <li><button onClick={() => { openBlog(); setIsOpen(false); }} className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50">BLOG</button></li>

                  <li className="px-4 py-2"><img src={search} alt="search" className="inline-block w-8 h-8" /></li>

                  {/* Mobile Authentication Section */}
                  {currentUser ? (
                    <li className="px-4 py-2 border-t mt-2 pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar avatarUrl={userProfile?.avatarURL || currentUser?.photoURL} displayName={userProfile?.displayName || userProfile?.username || currentUser?.displayName} email={currentUser?.email} size={32} />
                        <span className="text-sm text-gray-700">{userProfile?.username || currentUser?.displayName || currentUser?.email}</span>
                      </div>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded-md bg-red-50 text-red-600 font-semibold">Sign Out</button>
                    </li>
                  ) : (
                    <>
                      <li className="px-4 py-2"><Link to="/log" onClick={() => setIsOpen(false)} className="block text-left px-4 py-2 rounded-md bg-[#ecfdf5] text-[#16a34a] font-semibold">LOGIN</Link></li>
                      <li className="px-4 py-2"><Link to="/signup" onClick={() => setIsOpen(false)} className="block text-left px-4 py-2 rounded-md bg-[#ecfdf5] text-[#16a34a] font-semibold">SIGN UP</Link></li>
                    </>
                  )}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Blog overlay */}
      <AnimatePresence>
        {blogOpen && (
          <motion.div key="blog-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black" onClick={() => closeBlog()} />
            <motion.div initial={{ y: 20, opacity: 0, scale: 0.995 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ duration: 0.28 }} className="relative z-50 w-full h-screen overflow-auto bg-white">
              <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-50">
                <div className="flex items-center gap-4"><img src={Logo} alt="logo" className="w-32" /><h3 className="text-lg font-semibold">Blog</h3></div>
                <div className="flex items-center gap-3"><button onClick={() => closeBlog()} className="px-3 py-1 rounded-md border flex items-center gap-2"><img src={close} alt="close" className="w-4 h-4" />Close</button></div>
              </div>
              <div className="p-6"><BlogPage /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OPTIONAL: Leaderboard overlay modal (if you want modal instead of route) */}
      <AnimatePresence>
        {leaderboardOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div className="absolute inset-0 bg-black/60" onClick={() => setLeaderboardOpen(false)} />
            <motion.div initial={{ scale: 0.96, y: 12, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.98, y: 12, opacity: 0 }} transition={{ duration: 0.18 }} className="relative z-50 max-w-[96vw] w-[420px]">
              {/* using your board image as frame and pageBg as background */}
              <div className="rounded-xl overflow-hidden" style={{ backgroundImage: `url(${pageBg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                <img src={boardImg} alt="leaderboard frame" style={{ width: "100%", display: "block" }} />
                {/* You might overlay list inside the frame in a real implementation */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

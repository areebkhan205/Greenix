// src/App.jsx
import { Route, Routes, useLocation } from "react-router-dom";
import "./index.css"; // ensure this imports the CSS with lenis fixes

import EntryPage from "./components/EntryPage";
import Footer from "./components/Footer";

import LogoLoop from "./components/LogoLoop";
import SignupPage from "./components/SignupPage";

import FAQ from "./components/Faq";

import NoPlasticImg from "./assets/no-plastic.png";
import EcoCarImg from "./assets/recycle-blue-2.png";
import RecycleBlueImg from "./assets/recycle-blue.png";
import SunImg from "./assets/recycle-pixel-green.png";
import SolarImg from "./assets/recycle-pixel-yellow.png";
import RecycleYellowImg from "./assets/recycle-yellow.png";
import SproutImg from "./assets/sprout.png";
import WaterImg from "./assets/water-drop.png";
import WindImg from "./assets/wind-turbine.png";
import EcoBot from "./components/EcoBot";
import FinalLayout from "./components/FinalLayout";
import HOMEPAGE from "./components/HOMEPAGE";
import Leaderboard from "./components/Leaderboard";
import Lenisscroll from "./components/Lenisscroll";


import SaviourEntry from "./components/SaviourEntry";
const ecoLogos = [
  { src: SunImg, title: "Solar", color: "#facc15" },
  { src: WaterImg, title: "Clean Water", color: "#0284c7" },
  { src: NoPlasticImg, title: "No Plastic", color: "#059669" },
  { src: RecycleBlueImg, title: "Recycling (Blue)", color: "#3b82f6" },
  { src: RecycleYellowImg, title: "Recycling (Yellow)", color: "#f59e0b" },
  { src: SproutImg, title: "Plant / Sprout", color: "#16a34a" },
  { src: WindImg, title: "Wind Power", color: "#3b82f6" },
  { src: SolarImg, title: "Solar Panel", color: "#facc15" },
  { src: EcoCarImg, title: "Electric Car", color: "#10b981" },
];

export default function App() {
  const location = useLocation();

  // ✅ hide header/footer on quiz, signup, and entry
  const hideLayout =
    location.pathname === "/quiz" ||
    location.pathname === "/signup" ||
    location.pathname === "/entry"||
    location.pathname === "/saviour"||
      location.pathname === "/eco";

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-green-50">
      

      <main className="flex-grow">
        <Lenisscroll />
        <Routes>
          <Route
            path="/"
            element={
              <>
              <HOMEPAGE/>
                <FinalLayout />
                <FAQ />
               

                {/* Eco LogoLoop — full width */}
                <section
                  id="logo-loop"
                  className="mt-8 w-screen relative left-1/2 right-1/2 -translate-x-1/2 bg-gradient-to-r from-green-700/5 via-white to-green-700/5 p-6 shadow-inner"
                  style={{ minHeight: 320, overflow: "hidden" }}
                >
                  <div className="absolute inset-0 pointer-events-none" aria-hidden />

                  <LogoLoop
                    logos={ecoLogos.map((it, i) => ({
                      ...it,
                      node: (
                        <span
                          key={`eco-${i}`}
                          className="flex items-center justify-center transition-transform duration-300 transform hover:scale-105"
                          title={it.title}
                          aria-label={it.title}
                          style={{
                            filter: "drop-shadow(0 6px 18px rgba(16,185,129,0.20))",
                            color: it.color,
                          }}
                        >
                          <img
                            src={it.src}
                            alt={it.title}
                            style={{
                              height: 92,
                              width: 92,
                              objectFit: "contain",
                              display: "block",
                            }}
                          />
                        </span>
                      ),
                    }))}
                    speed={60}
                    direction="left"
                    logoHeight={110}
                    gap={52}
                    pauseOnHover
                    scaleOnHover
                    fadeOut
                    fadeOutColor="#ffffff"
                    ariaLabel="Eco-friendly logos"
                  />
                </section>
              </>
            }
          />

          <Route path="/quiz" element={<EntryPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/eco" element={<EcoBot/>}/>          
         <Route
  path="/profile-setup"

/>

          <Route path="/main" element={<HOMEPAGE />} />
           <Route path="/lead" element={<Leaderboard/>} />
           <Route path="/saviour" element={<SaviourEntry/>} />
          <Route path="/entry" element={<EntryPage />} />

        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

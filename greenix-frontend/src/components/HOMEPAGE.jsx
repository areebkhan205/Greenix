import {
  ArrowRight,
  Check,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import "../font.css";
import "../theme.css";

export default function HomePage() {
  const videoRef = useRef(null);

  const [videoOpacity, setVideoOpacity] = useState(0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [showToast, setShowToast] = useState(false);

  const [toastMessage, setToastMessage] =
    useState("");

  const [activeThemeMode, setActiveThemeMode] =
    useState(0);

  useEffect(() => {
    let rafId;

    const monitorTimeline = () => {
      const video = videoRef.current;

      if (video && !isNaN(video.duration)) {
        const current = video.currentTime;
        const duration = video.duration;

        let targetOpacity = 1;

        if (current < 0.5) {
          targetOpacity = current / 0.5;
        } else if (current > duration - 0.5) {
          targetOpacity = Math.max(
            0,
            (duration - current) / 0.5
          );
        }

        setVideoOpacity(targetOpacity);
      }

      rafId = requestAnimationFrame(
        monitorTimeline
      );
    };

    rafId = requestAnimationFrame(
      monitorTimeline
    );

    return () => cancelAnimationFrame(rafId);
  }, []);

  const triggerToast = (message) => {
    setToastMessage(message);

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleBeginJourney = () => {
    triggerToast("Welcome to Greenix 🌱");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white selection:bg-black selection:text-white">

      {/* Background Video */}
      <div
        className="absolute inset-0 z-0"
        style={{
          opacity: videoOpacity,
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
      </div>

      {/* Navbar */}
      <header className="relative z-20 border-b border-black/5 bg-white/70 glassmorphic-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

          {/* Logo */}
          <div className="font-instrument text-3xl tracking-tight">
            Greenix
            <sup className="text-sm">®</sup>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-10 font-inter text-sm">

            <a href="#">Home</a>

            <a
              href="#"
              className="text-neutral-500 hover:text-black transition"
            >
              Games
            </a>

            <a
              href="#"
              className="text-neutral-500 hover:text-black transition"
            >
              Community
            </a>

            <a
              href="#"
              className="text-neutral-500 hover:text-black transition"
            >
              Contact
            </a>
          </nav>

          {/* Desktop CTA */}
          <button
            onClick={handleBeginJourney}
            className="hidden md:flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm text-white transition hover:scale-105"
          >
            Begin Journey

            <ArrowRight size={16} />
          </button>

          {/* Mobile Menu */}
          <button
            className="md:hidden"
            onClick={() =>
              setIsMobileMenuOpen(
                !isMobileMenuOpen
              )
            }
          >
            {isMobileMenuOpen ? (
              <X />
            ) : (
              <Menu />
            )}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col gap-4 bg-white/90 px-6 pb-6 glassmorphic-blur animate-fade-rise">

            <a href="#">Home</a>

            <a href="#">Games</a>

            <a href="#">Community</a>

            <a href="#">Contact</a>

            <button
              onClick={handleBeginJourney}
              className="mt-3 rounded-full bg-black py-3 text-white"
            >
              Begin Journey
            </button>
          </div>
        )}
      </header>

      {/* Hero */}
      <main className="relative z-10 flex min-h-[90vh] items-center justify-center px-6">

        <div className="mx-auto max-w-6xl text-center">

          {/* Tag */}
          <div className="animate-fade-rise mb-8 inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/[0.03] px-4 py-2 text-xs uppercase tracking-[0.2em] text-neutral-600">

            <Sparkles size={12} />

            {activeThemeMode === 0 &&
              "Eco Gamification"}

            {activeThemeMode === 1 &&
              "Seamless Sandbox"}

            {activeThemeMode === 2 &&
              "Global Ecosystems"}
          </div>

          {/* Heading */}
          <h1 className="animate-fade-rise font-instrument text-5xl leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">

            Beyond{" "}

            <span className="italic text-neutral-500">
              classrooms,
            </span>

            <br />

            we gamify the{" "}

            <span className="italic text-neutral-500">
              green earth.
            </span>
          </h1>

          {/* Description */}
          <p className="animate-fade-rise-delay mx-auto mt-8 max-w-2xl font-inter text-base leading-relaxed text-neutral-600 sm:text-lg">

            Interactive eco quests for brilliant
            minds and thoughtful souls. Learn
            sustainability, climate science,
            and environmental awareness
            through immersive gameplay.
          </p>

          {/* CTA */}
          <button
            onClick={handleBeginJourney}
            className="animate-fade-rise-delay-2 mt-12 inline-flex items-center gap-3 rounded-full bg-black px-10 py-5 font-inter text-white transition hover:scale-105"
          >
            Begin Journey

            <ArrowRight size={18} />
          </button>
        </div>
      </main>

      {/* Bottom Theme Selector */}
      <div className="absolute bottom-10 left-10 z-20 flex items-center gap-4 rounded-full border border-black/5 bg-white/70 px-4 py-2 glassmorphic-blur">

        {[0, 1, 2].map((item) => (
          <button
            key={item}
            onClick={() =>
              setActiveThemeMode(item)
            }
            className={`h-3 w-3 rounded-full transition ${
              activeThemeMode === item
                ? "scale-125 bg-black"
                : "bg-neutral-300"
            }`}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-10 right-10 z-20 hidden sm:block">

        <p className="font-inter text-[11px] uppercase tracking-[0.2em] text-neutral-500">

          EST. 2024 — GREENIX COLLECTIVE
        </p>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="animate-fade-rise fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black px-6 py-4 text-sm text-white shadow-2xl">

          <Check
            size={16}
            className="text-emerald-400"
          />

          {toastMessage}
        </div>
      )}
    </div>
  );
}
// src/components/Profile1.jsx

import { onAuthStateChanged } from "firebase/auth";
import { BarChart3, Home, MessageCircle, Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { auth } from "../../firebase/firebase";
import BoyLogo from "../assets/boylogo.png";
import GameCardBg from "../assets/gamecardd.png";
import TreeGrow from "./TreeGrow";

export default function Profile1({
  streakData = {},
  markToday = () => {},
  getStreakCount = () => 3,
  gameImageSrc = GameCardBg,
  logoSrc = BoyLogo,
}) {
  const [tooltip, setTooltip] = useState({
    show: false,
    content: "",
    left: 0,
    top: 0,
    fading: false,
  });

  const [user, setUser] = useState({ name: "Guest", avatar: "?" }); // default guest

  // 👇 Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || currentUser.email || "User",
          avatar: currentUser.displayName
            ? currentUser.displayName.charAt(0).toUpperCase()
            : currentUser.email?.charAt(0).toUpperCase() || "U",
        });
      } else {
        setUser({ name: "Guest", avatar: "?" });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      markToday();
    } catch (e) {}
  }, [markToday]);

  const months = useMemo(
    () => [
      "JANUARY",
      "FEBRUARY",
      "MARCH",
      "APRIL",
      "MAY",
      "JUNE",
      "JULY",
      "AUGUST",
      "SEPTEMBER",
      "OCTOBER",
      "NOVEMBER",
      "DECEMBER",
    ],
    []
  );

  const monthNames = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const yearNow = new Date().getFullYear();

  // Tooltip handlers
  const handleDotEnter = (e, day, monthIndex) => {
    const calRect = e.currentTarget
      .closest(".streak-calendar")
      ?.getBoundingClientRect();
    const dotRect = e.target.getBoundingClientRect();
    const left =
      dotRect.left - (calRect?.left ?? 0) + dotRect.width / 2;
    const top =
      dotRect.top - (calRect?.top ?? 0) - 8;
    setTooltip({
      show: true,
      fading: false,
      content: `${monthNames[monthIndex]} ${day}, ${yearNow}`,
      left,
      top,
    });
  };
  const handleDotLeave = () => {
    setTooltip((prev) => ({ ...prev, fading: true }));
    setTimeout(
      () =>
        setTooltip({
          show: false,
          content: "",
          left: 0,
          top: 0,
          fading: false,
        }),
      200
    );
  };

  const totalScore = useMemo(
    () => getStreakCount() * 10 + 41,
    [getStreakCount]
  );

  return (
    <div className="min-h-screen bg-[#e8f5e8] px-6 py-6">
      {/* Top header */}
      <header className="flex items-center justify-between mb-6">
        <div className="text-lg font-semibold text-gray-700">
          Profile Dashboard
        </div>
        <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow">
          <div className="text-sm font-medium text-gray-800">
            {user.name}
          </div>
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
            {user.avatar}
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full" />
        </div>
      </header>

      {/* Main content grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Sidebar */}
        <aside className="col-span-2">
          <div className="h-full bg-emerald-600 text-white rounded-2xl p-5 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center">
                ★
              </div>
              <div className="text-base font-semibold">{user.name}</div>
            </div>

            <input
              className="w-full rounded-lg py-2 px-3 bg-emerald-500/30 placeholder-white text-white text-sm"
              placeholder="Search"
            />

            <nav className="flex flex-col gap-3 text-sm">
              <button className="flex items-center gap-3 hover:text-white">
                <Home size={16} /> Home
              </button>
              <button className="flex items-center gap-3 hover:text-white">
                <BarChart3 size={16} /> Games
              </button>
              <button className="flex items-center gap-3 hover:text-white">
                <MessageCircle size={16} /> Eco Bot
              </button>
              <button className="flex items-center gap-3 hover:text-white">
                <Settings size={16} /> Setting
              </button>
            </nav>
          </div>
        </aside>

        {/* Center content */}
        <section className="col-span-7 flex flex-col gap-4">
          {/* Hero game card */}
          <div className="relative">
            <img
              src={gameImageSrc}
              alt="game card bg"
              className="block w-[781px] h-[229px] object-cover rounded-2xl"
              draggable={false}
              style={{ position: "relative", zIndex: 10 }}
            />

            {/* Logo overlay */}
            <img
              src={logoSrc}
              alt="logo"
              draggable={false}
              style={{
                position: "absolute",
                left: 250,
                top: -146,
                width: 586,
                height: "auto",
                zIndex: 50,
                pointerEvents: "none",
                filter:
                  "drop-shadow(0 10px 24px rgba(0,0,0,0.18))",
              }}
            />

            {/* Text inside card */}
            <div
              style={{
                position: "absolute",
                left: 16,
                top: 16,
                zIndex: 20,
              }}
            >
              <h3 className="text-xl font-bold text-gray-800">
                Exciting games
              </h3>
              <p className="text-sm text-gray-700">Play & Learn</p>
              <button className="mt-2 px-3 py-1 rounded-full bg-gray-900 text-white text-xs">
                Learn more
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div className="streak-calendar bg-green-100 rounded-xl p-4">
            <div className="mb-2 grid grid-cols-[100px_16px_repeat(31,1fr)] gap-1 items-center">
              <div />
              <div />
              {Array.from({ length: 31 }, (_, i) => (
                <div
                  key={i}
                  className="text-[9px] text-gray-500 text-center"
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              {months.map((m, mi) => {
                const daysInMonth = getDaysInMonth(mi, yearNow);
                return (
                  <div
                    key={mi}
                    className="grid grid-cols-[100px_16px_1fr] items-center gap-1"
                  >
                    <div className="text-[9px] font-semibold text-gray-700 text-right">
                      {m}
                    </div>
                    <div className="w-3 h-[2px] bg-gray-600 rounded" />
                    <div className="grid grid-cols-31 gap-[2px]">
                      {Array.from({ length: 31 }, (_, d) => {
                        const day = d + 1;
                        const valid = day <= daysInMonth;
                        const dateKey = `${yearNow}-${String(
                          mi + 1
                        ).padStart(2, "0")}-${String(day).padStart(
                          2,
                          "0"
                        )}`;
                        const active = valid && streakData[dateKey];
                        return (
                          <div
                            key={d}
                            className={`w-2 h-2 ${
                              !valid ? "opacity-0" : ""
                            }`}
                          >
                            <div
                              onMouseEnter={(e) =>
                                valid && handleDotEnter(e, day, mi)
                              }
                              onMouseLeave={handleDotLeave}
                              className={`w-2 h-2 rounded-full border border-black ${
                                active
                                  ? "bg-emerald-400 shadow"
                                  : "bg-gray-200"
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right column */}
        <aside className="col-span-3 flex flex-col gap-4">
          {/* Circular progress */}
          <div className="bg-green-100 rounded-xl p-5 flex justify-center">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e6f8ec"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#16a34a"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={Math.PI * 2 * 40}
                  strokeDashoffset={
                    Math.PI * 2 * 40 * (1 - Math.min(totalScore / 100, 1))
                  }
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-xs font-semibold">
                <span>Progress</span>
                <span className="text-base">
                  {Math.min(Math.round(totalScore), 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Score bar */}
          <div className="bg-green-100 rounded-xl p-4">
            <div className="text-sm font-semibold text-gray-800 mb-1">
              Total Score
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full text-white text-xs flex items-center justify-end pr-2"
                style={{
                  width: `${Math.min((totalScore / 1000) * 100, 100)}%`,
                }}
              >
                {totalScore}
              </div>
            </div>
          </div>

          {/* TreeGrow */}
          <div className="flex items-center justify-center">
            <TreeGrow />
          </div>
        </aside>
      </div>

      {/* Tooltip */}
      {tooltip.show && (
        <div
          style={{
            position: "absolute",
            left: tooltip.left,
            top: tooltip.top,
            transform: "translate(-50%, -100%)",
            zIndex: 60,
            transition: tooltip.fading ? "opacity 0.18s" : undefined,
            opacity: tooltip.fading ? 0 : 1,
          }}
          className="pointer-events-none bg-gray-900 text-white text-xs px-2 py-1 rounded"
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}

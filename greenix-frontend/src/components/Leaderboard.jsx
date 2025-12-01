import { useMemo } from "react";
import background from "../assets/background with white colour.png";
import board from "../assets/board.png";
import leftIllustration from "../assets/image.png";
import titleImg from "../assets/Rise and Shine!.png";

// Small helper to format large numbers (e.g. 1200 -> 1,200)
const formatScore = (n) => n.toLocaleString();

function Medal({ rank }) {
  if (rank === 1)
    return <span aria-hidden className="text-2xl leading-none">🥇</span>;
  if (rank === 2)
    return <span aria-hidden className="text-2xl leading-none">🥈</span>;
  if (rank === 3)
    return <span aria-hidden className="text-2xl leading-none">🥉</span>;
  return (
    <span className="text-sm font-semibold tabular-nums" aria-hidden>
      {rank}.
    </span>
  );
}

export default function Leaderboard({ playersProp = null, highlightName = "Areeb Khan" }) {
  const defaultPlayers = [
    { name: "Areeb Khan", score: 1850 },
    { name: "Rana", score: 1620 },
    { name: "Maya", score: 1480 },
    { name: "Dev", score: 1210 },
    { name: "Zara", score: 980 }, 
  ];

  const players = useMemo(() => {
    const list = (playersProp && playersProp.length ? playersProp : defaultPlayers).slice();
    list.sort((a, b) => b.score - a.score);
    return list;
  }, [playersProp]);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-start p-6"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main className="max-w-6xl w-full backdrop-blur-md rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-6 shadow-xl">
        {/* LEFT: Title + Illustration */}
        <section className="flex flex-col items-center justify-center p-4 text-center">
          <img src={titleImg} alt="Leaderboard title" className="mb-4 max-h-20 object-contain" />
          <img
            src={leftIllustration}
            alt="Illustration of eco-friendly actions"
            className="max-w-full max-h-[68vh] object-contain select-none"
            draggable={false}
          />
          <p className="mt-4 text-sm text-gray-700 max-w-sm">
            🌱 <span className="font-semibold">Eco Champions</span> rise by completing daily green actions. Collect points, climb the ranks, and inspire others to join the movement for a sustainable future.
          </p>
        </section>

        {/* RIGHT: Board + entries */}
        <aside className="flex items-center justify-center p-4">
          <div className="relative w-full max-w-[480px]">
            <img src={board} alt="Leaderboard board frame" className="w-full block pointer-events-none select-none" draggable={false} />

            <div className="absolute inset-0 flex flex-col items-center">
              <div className="mt-[110px] w-[86%] max-h-[66vh] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-green-500/40 scrollbar-track-transparent">
                {players.length === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-500 italic">No Eco Champions yet — be the first to start your journey!</div>
                ) : (
                  players.map((p, i) => {
                    const isTop = i < 3;
                    const isHighlighted = p.name === highlightName;

                    const rowBg = isTop
                      ? i === 0
                        ? "linear-gradient(90deg, rgba(255,215,0,0.12), rgba(255,255,255,0.04))"
                        : i === 1
                        ? "linear-gradient(90deg, rgba(192,192,192,0.10), rgba(255,255,255,0.03))"
                        : "linear-gradient(90deg, rgba(205,127,50,0.08), rgba(255,255,255,0.03))"
                      : "rgba(6,95,70,0.06)";

                    return (
                      <div
                        key={p.name}
                        className={`flex items-center justify-between px-4 py-2 rounded-xl shadow-sm transition-transform transform-gpu hover:-translate-y-0.5 ${isHighlighted ? "ring-2 ring-green-300" : ""}`}
                        style={{ background: rowBg }}
                        role="listitem"
                        aria-label={`${p.name}, ${p.score} points, rank ${i + 1}`}>

                        {/* LEFT: avatar + name + medal */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0">
                            <span className="font-semibold text-sm text-gray-900">{p.name.split(" ").map(s => s[0]).slice(0,2).join("")}</span>
                          </div>

                          {/* Make this container flexible and truncatable */}
                          <div className="min-w-0 flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-gray-900 truncate">{p.name}</div>
                              <div className="text-xs text-gray-500 truncate">Sustainability Hero</div>
                            </div>

                            {/* Medal should not shrink and stays to the right of the name */}
                            <div className="flex-shrink-0 ml-1" aria-hidden>
                              <Medal rank={i + 1} />
                            </div>
                          </div>
                        </div>

                        {/* RIGHT: score */}
                        <div className="text-right ml-4">
                          <div className="text-base font-bold text-gray-900 tabular-nums">{formatScore(p.score)}</div>
                          <div className="text-xs text-green-700 font-medium tracking-wide">POINTS</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-3 w-[86%] text-xs text-gray-600 text-right">
                Showing top {players.length} champions
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
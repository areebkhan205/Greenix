import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import ecoAvatar from "../assets/eco-avtar.gif";

// 🎖️ Import your badge images
import badge2 from "../assets/functions.png"; // Level 2
import badge1 from "../assets/hello-world.png"; // Level 1
import badge4 from "../assets/lists.png"; // Level 4
import badge3 from "../assets/loops.png"; // Level 3
import badge5 from "../assets/variables.png"; // Level 5

// Map levels to badges
const BADGES = {
  0: { img: badge1, title: "🌍 Beginner Explorer" },
  1: { img: badge2, title: "🐢 Eco Protector" },
  2: { img: badge3, title: "🔄 Green Recycler" },
  3: { img: badge4, title: "🛡️ Nature Guardian" },
  4: { img: badge5, title: "💎 Eco Champion" },
};

/* Questions grouped by Level */
const LEVELS = [
  [
    { q: "Which gas do plants release during photosynthesis?", a: "Oxygen" },
    { q: "The process of water turning into vapor is called?", a: "Evaporation" },
    { q: "Which soil is best for growing cotton?", a: "Black soil" },
    { q: "The main source of energy for Earth is?", a: "The Sun" },
    { q: "Which layer of atmosphere protects us from UV rays?", a: "Ozone layer" },
  ],
  [
    { q: "Which nutrient is called 'body-building food'?", a: "Proteins" },
    { q: "Which type of farming uses no chemicals?", a: "Organic farming" },
    { q: "The chipko movement is related to?", a: "Forest conservation" },
    { q: "Which device converts solar energy into electricity?", a: "Solar panel" },
    { q: "Water harvesting helps in?", a: "Recharging groundwater" },
  ],
  [
    { q: "Which gas is responsible for global warming?", a: "Carbon dioxide" },
    { q: "Deforestation leads to?", a: "Soil erosion" },
    { q: "Which of these is a fossil fuel?", a: "Coal" },
    { q: "Which vitamin is made in the skin in sunlight?", a: "Vitamin D" },
    { q: "Which renewable energy source is used in windmills?", a: "Wind energy" },
  ],
  [
    { q: "Which state in India gets the highest rainfall?", a: "Meghalaya" },
    { q: "Which part of the plant carries water?", a: "Xylem" },
    { q: "Which is the cleanest form of energy?", a: "Solar energy" },
    { q: "Greenhouse effect is caused by?", a: "Trapping of heat by gases" },
    { q: "The 'Project Tiger' was launched to protect?", a: "Tigers" },
  ],
  [
    { q: "Best way to reduce plastic waste?", a: "Use cloth/reusable bags" },
    { q: "Which item is e-waste?", a: "Old mobile phone" },
    { q: "Which transport has the least carbon footprint?", a: "Cycling" },
    { q: "Which irrigation saves water?", a: "Drip irrigation" },
    { q: "Which is an endangered species?", a: "Snow Leopard" },
  ],
];

/* Helpers */
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
function addOptions(q, bank) {
  const wrongs = shuffle(bank.filter((x) => x.a !== q.a).map((x) => x.a)).slice(0, 3);
  return { ...q, options: shuffle([q.a, ...wrongs]) };
}

/* Starting lives per level */
const START_LIVES = [3, 3, 2, 2, 1];

/* Chapters: group levels into chapters and attach chapter badges */
const CHAPTERS = [
  { title: "Basics", levels: [0, 1], badge: { img: badge1, title: "📘 Basics Master" } },
  { title: "Intermediate", levels: [2, 3], badge: { img: badge3, title: "📗 Intermediate Pro" } },
  { title: "Advanced", levels: [4], badge: { img: badge5, title: "📕 Advanced Expert" } },
];

const PROGRESS_KEY = "eco_progress"; // { chapterIndex, levelInChapter } saved as the next level to play

export default function QuizBox() {
  // load saved progress (if any) so user resumes where they left off
  const savedProgress = (() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (
        typeof parsed.chapterIndex === "number" &&
        typeof parsed.levelInChapter === "number"
      ) {
        // clamp within ranges
        const c = Math.min(Math.max(parsed.chapterIndex, 0), CHAPTERS.length - 1);
        const l = Math.min(Math.max(parsed.levelInChapter, 0), CHAPTERS[c].levels.length - 1);
        return { chapterIndex: c, levelInChapter: l };
      }
      return null;
    } catch {
      return null;
    }
  })();

  // chapter + level-in-chapter pointers (start at saved progress if exists)
  const [chapterIndex, setChapterIndex] = useState(savedProgress ? savedProgress.chapterIndex : 0);
  const [levelInChapter, setLevelInChapter] = useState(savedProgress ? savedProgress.levelInChapter : 0);
  // derived global level index for compatibility with existing UI/earned badges
  const level = CHAPTERS[chapterIndex].levels[levelInChapter];

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [chapterScore, setChapterScore] = useState(0);
  const [pick, setPick] = useState(null);
  const [done, setDone] = useState(false);
  const [levelCleared, setLevelCleared] = useState(false);
  const [review, setReview] = useState(false);

  const [lives, setLives] = useState(() => START_LIVES[level] ?? 3);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  // Timer per question
  const baseTime = 20;
  const timeForLevel = Math.max(8, baseTime - level * 3);
  const [timeLeft, setTimeLeft] = useState(timeForLevel);
  const timerRef = useRef(null);

  // Badge + earned badges
  const [showBadge, setShowBadge] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("eco_earned_badges") || "[]");
    } catch {
      return [];
    }
  });

  // Leaderboard (persisted)
  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("eco_leaderboard") || "[]");
    } catch {
      return [];
    }
  });

  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  // mute toggle (persisted)
  const [muted, setMuted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("eco_muted") || "false");
    } catch {
      return false;
    }
  });
  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
    localStorage.setItem("eco_muted", JSON.stringify(muted));
  }, [muted]);

  // bank, round, current question
  const bank = LEVELS[level];
  const ALL_QS = LEVELS.flat();
  const ROUND = useMemo(() => shuffle(bank).map((q) => addOptions(q, ALL_QS)), [level]);
  const current = ROUND[index];
  const total = ROUND.length;

  /* Helper: persist progress (next level to play after clearing) */
  const saveProgress = (cIndex, lInChapter) => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({ chapterIndex: cIndex, levelInChapter: lInChapter }));
    } catch (e) {
      // ignore
    }
  };

  /* WebAudio-based sounds */
  const playTone = (freq, duration = 0.12, type = "sine") => {
    if (mutedRef.current) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      setTimeout(() => {
        try {
          o.stop();
          ctx.close();
        } catch (e) {}
      }, duration * 1000 + 40);
    } catch (e) {
      // ignore
    }
  };
  const playCorrect = () => {
    playTone(880, 0.12, "sine");
    setTimeout(() => playTone(1100, 0.08, "sine"), 120);
  };
  const playWrong = () => {
    playTone(220, 0.16, "sawtooth");
  };
  const playTick = () => {
    playTone(600, 0.06, "square");
  };

  /* Timer logic */
  useEffect(() => {
    setTimeLeft(timeForLevel);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (!ROUND || ROUND.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPick((prev) => {
            if (!prev) return "__TIMEOUT__";
            return prev;
          });
          return 0;
        } else {
          const next = t - 1;
          if (next <= 5 && next > 0) {
            playTick();
          }
          return next;
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, level, timeForLevel, ROUND]);

  // update multiplier when streak changes; confetti on new x3
  useEffect(() => {
    if (streak >= 3) {
      if (multiplier !== 3) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
      setMultiplier(3);
    } else if (streak === 2) setMultiplier(2);
    else setMultiplier(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streak]);

  // persist earned badges & leaderboard
  useEffect(() => {
    try {
      localStorage.setItem("eco_earned_badges", JSON.stringify(earnedBadges));
    } catch (e) {}
  }, [earnedBadges]);

  useEffect(() => {
    try {
      localStorage.setItem("eco_leaderboard", JSON.stringify(leaderboard));
    } catch (e) {}
  }, [leaderboard]);

  /* Pick handling */
  const handlePick = (opt) => {
    if (pick) return;
    setPick(opt);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  /* Record answers for review (session) */
  const pushSessionAnswer = (qText, correctAns, userPick, wasCorrect) => {
    try {
      const prev = JSON.parse(sessionStorage.getItem("eco_session_answers") || "[]");
      prev.push({
        q: qText,
        correct: correctAns,
        pick: userPick,
        correctFlag: wasCorrect,
      });
      sessionStorage.setItem("eco_session_answers", JSON.stringify(prev));
    } catch (e) {
      // ignore
    }
  };

  /* Evaluate & Advance */
  const evaluateAndAdvance = () => {
    if (!current) return;

    let newScore = score;
    let newChapterScore = chapterScore;
    let newLives = lives;
    let newStreak = streak;
    const userPick = pick;

    const correct = userPick === current.a;

    if (correct) {
      const timeBonus = Math.round((timeLeft / timeForLevel) * 1); // 0 or 1
      const points = 1 * multiplier + timeBonus;
      newScore = score + points;
      newChapterScore = chapterScore + points;
      newStreak = streak + 1;
      playCorrect();
    } else {
      newLives = Math.max(0, lives - 1);
      newStreak = 0;
      playWrong();
    }

    pushSessionAnswer(current.q, current.a, userPick, correct);

    setScore(newScore);
    setChapterScore(newChapterScore);
    setLives(newLives);
    setStreak(newStreak);

    // show result and advance after tiny delay
    setTimeout(() => {
      if (index + 1 < total && newLives > 0) {
        setIndex((i) => i + 1);
        setPick(null);
      } else {
        // level ends
        setDone(true);
        const finalPct = Math.round((newScore / (total * 2)) * 100);
        if (finalPct >= 50 && newLives > 0) {
          setLevelCleared(true);

          // show level badge (avoid duplicate)
          if (BADGES[level]) {
            const badge = BADGES[level];
            setShowBadge(badge);
            setEarnedBadges((prev) => {
              const exists = prev.some((b) => b.title === badge.title);
              return exists ? prev : [...prev, badge];
            });
            setTimeout(() => setShowBadge(null), 3000);
          }

          // if this was the last level in the chapter, award the chapter badge too
          const chapter = CHAPTERS[chapterIndex];
          if (levelInChapter === chapter.levels.length - 1) {
            const cbadge = chapter.badge;
            setShowBadge(cbadge);
            setEarnedBadges((prev) => {
              const exists = prev.some((b) => b.title === cbadge.title);
              return exists ? prev : [...prev, cbadge];
            });
            setTimeout(() => setShowBadge(null), 3000);
          }

          // Save progress: compute next pointers (next level to play)
          let nextChapter = chapterIndex;
          let nextLevelInChap = levelInChapter;
          if (levelInChapter + 1 < chapter.levels.length) {
            nextLevelInChap = levelInChapter + 1;
          } else if (chapterIndex + 1 < CHAPTERS.length) {
            nextChapter = chapterIndex + 1;
            nextLevelInChap = 0;
          } else {
            // finished everything — remain at last (no further progress)
            nextChapter = chapterIndex;
            nextLevelInChap = levelInChapter;
          }
          // persist next level for continuation on next play
          saveProgress(nextChapter, nextLevelInChap);

          // show prompt to save score
          setShowNamePrompt(true);
        } else {
          setLevelCleared(false);
        }
      }
    }, 450);
  };

  /* Auto-evaluate when timeout occurs */
  useEffect(() => {
    if (!pick) return;
    if (pick === "__TIMEOUT__") {
      setTimeout(() => {
        evaluateAndAdvance();
      }, 800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pick]);

  /* Controls */
  const next = () => {
    if (!pick) return;
    evaluateAndAdvance();
  };

  const recordAndNext = () => {
    next();
  };

  const restart = ({ preserveLeaderboard = true, resetProgress = false } = {}) => {
    // if resetProgress true, remove saved progress
    if (resetProgress) {
      try {
        localStorage.removeItem(PROGRESS_KEY);
      } catch {}
    }

    // determine initial progress source
    const progress = (() => {
      try {
        if (resetProgress) return null;
        const raw = localStorage.getItem(PROGRESS_KEY);
        if (!raw) return null;
        const p = JSON.parse(raw);
        if (typeof p.chapterIndex === "number" && typeof p.levelInChapter === "number") {
          return p;
        }
        return null;
      } catch {
        return null;
      }
    })();

    const startChapter = progress ? progress.chapterIndex : 0;
    const startLevelInChap = progress ? progress.levelInChapter : 0;
    setChapterIndex(startChapter);
    setLevelInChapter(startLevelInChap);
    setIndex(0);
    setScore(0);
    setChapterScore(0);
    setPick(null);
    setDone(false);
    setLevelCleared(false);
    setReview(false);
    setShowBadge(null);
    setEarnedBadges((prev) => prev); // keep persisted badges
    setLives(START_LIVES[CHAPTERS[startChapter].levels[startLevelInChap]] ?? 3);
    setStreak(0);
    setMultiplier(1);
    if (!preserveLeaderboard) setLeaderboard([]);
    sessionStorage.setItem("eco_session_answers", JSON.stringify([]));
  };

  /* Move to next level in chapter, or next chapter (and save progress) */
  const nextLevel = () => {
    const chapter = CHAPTERS[chapterIndex];
    let newChapter = chapterIndex;
    let newLevelInChap = levelInChapter;

    if (levelInChapter + 1 < chapter.levels.length) {
      // next level inside same chapter
      newLevelInChap = levelInChapter + 1;
    } else if (chapterIndex + 1 < CHAPTERS.length) {
      // move to next chapter
      newChapter = chapterIndex + 1;
      newLevelInChap = 0;
    } else {
      // already at last chapter+level -> stays
      newChapter = chapterIndex;
      newLevelInChap = levelInChapter;
    }

    // apply new pointers
    setChapterIndex(newChapter);
    setLevelInChapter(newLevelInChap);

    // reset state for new level
    setIndex(0);
    setScore(0);
    setChapterScore(0);
    setPick(null);
    setDone(false);
    setLevelCleared(false);
    setReview(false);
    setLives(START_LIVES[CHAPTERS[newChapter].levels[newLevelInChap]] ?? 3);
    setStreak(0);
    setMultiplier(1);
    sessionStorage.setItem("eco_session_answers", JSON.stringify([]));

    // persist this as the current progress (so continuation resumes here)
    saveProgress(newChapter, newLevelInChap);
  };

  const pct = Math.round((score / (total * 2)) * 100);

  /* Missed Qs for review */
  const missed = useMemo(() => {
    try {
      const arr = JSON.parse(sessionStorage.getItem("eco_session_answers") || "[]");
      return arr.filter((r) => !r.correctFlag);
    } catch {
      return [];
    }
  }, [done]);

  // save leaderboard entry when user submits name
  const submitNameToLeaderboard = () => {
    const name = (playerName || "Player").slice(0, 24);
    const entry = {
      name,
      score,
      chapter: chapterIndex + 1,
      level: level + 1,
      date: new Date().toISOString(),
    };
    setLeaderboard((prev) => {
      const newBoard = [...prev, entry].sort((a, b) => b.score - a.score).slice(0, 5);
      return newBoard;
    });
    setShowNamePrompt(false);
    setPlayerName("");
  };

  // When component mounts, ensure session answers empty
  useEffect(() => {
    sessionStorage.setItem("eco_session_answers", JSON.stringify([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[700px] relative">
        <div className="bg-gradient-to-br from-green-400 via-blue-400 to-purple-500 p-[3px] rounded-3xl shadow-[10px_10px_0_#000] border-4 border-black relative overflow-hidden">
          <div className="rounded-[22px] bg-white p-6 md:p-8 relative">
            {/* Permanent Bouncing Avatar */}
            <motion.img
              src={ecoAvatar}
              alt="Eco Avatar"
              className="absolute bottom-1 right-6 w-20 h-20"
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />

            {/* 🎖️ Badge Popup */}
            <AnimatePresence>
              {showBadge && (
                <motion.div
                  key="badge-popup"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 z-50"
                >
                  <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000] text-center">
                    <img src={showBadge.img} alt={showBadge.title} className="w-24 mx-auto mb-4 pixelated" />
                    <h2 className="text-2xl font-extrabold text-green-600">{showBadge.title}</h2>
                    <p className="mt-2 font-semibold">Unlocked!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confetti overlay */}
            <AnimatePresence>
              {showConfetti && (
                <motion.div key="confetti" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-0 z-50">
                  <div className="absolute inset-0 overflow-hidden">
                    {Array.from({ length: 28 }).map((_, i) => {
                      const left = Math.random() * 100;
                      const delay = Math.random() * 0.6;
                      const dur = 1.4 + Math.random() * 0.8;
                      const size = 6 + Math.random() * 12;
                      const bg = ["#ffd166", "#06d6a0", "#118ab2", "#ef476f", "#8ecae6"][i % 5];
                      return (
                        <motion.div
                          key={i}
                          initial={{ y: -40, x: left + "%", opacity: 0 }}
                          animate={{ y: "110vh", opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay, duration: dur, ease: "linear" }}
                          style={{
                            left: `${left}%`,
                            width: size,
                            height: size * 0.6,
                            background: bg,
                            transform: `rotate(${Math.random() * 360}deg)`,
                            borderRadius: 2,
                            position: "absolute",
                          }}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold px-3 py-1 border-2 border-black rounded-full bg-yellow-200 shadow-[3px_3px_0_#000]">
                🌍 {CHAPTERS[chapterIndex].title} — Level {level + 1}/{LEVELS.length}
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <div className="text-xs font-bold px-2 py-1 border-2 border-black rounded-full bg-white shadow-[2px_2px_0_#000]">
                  ❤️ Lives: {lives}
                </div>
                <div className="text-xs font-bold px-2 py-1 border-2 border-black rounded-full bg-white shadow-[2px_2px_0_#000]">
                  🔥 Streak: {streak} (x{multiplier})
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs">Q</span>
                  <div className="w-[140px] h-2 bg-gray-200 border-2 border-black rounded overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                      animate={{ width: `${((index + 1) / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold">
                    {index + 1}/{total}
                  </span>
                </div>

                <motion.button
                  onClick={() => setMuted((m) => !m)}
                  whileHover={{ scale: 1.05 }}
                  className="ml-2 px-2 py-1 border-2 border-black rounded-full bg-white shadow-[2px_2px_0_#000]"
                  title={muted ? "Unmute" : "Mute"}
                >
                  {muted ? "🔇" : "🔊"}
                </motion.button>
              </div>
            </div>

            {/* Timer bar */}
            {!done && (
              <div className="mb-4 flex items-center justify-center gap-4">
                <div className="text-sm font-semibold">⏱ {timeLeft}s</div>
                <div className="w-48 h-2 bg-gray-200 border-2 border-black rounded overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-300 to-red-400"
                    animate={{ width: `${(timeLeft / timeForLevel) * 100}%` }}
                  />
                </div>
                <div className="text-sm font-semibold">Score: <span className="font-bold">{score}</span></div>
              </div>
            )}

            {/* Normal Flow */}
            {!done ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={current?.q || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
                    {current?.q || "Loading..."}
                  </h2>

                  <div className="grid gap-3">
                    {(current?.options || []).map((opt) => {
                      const picked = pick === opt;
                      const correct = opt === current.a;
                      let classes =
                        "w-full py-3 px-4 border-2 border-black rounded-xl text-lg font-bold shadow-[4px_4px_0_#000]";
                      if (pick) {
                        if (correct) classes += " bg-green-500 text-white";
                        else if (picked) classes += " bg-red-500 text-white";
                        else classes += " bg-gray-200";
                      } else {
                        classes += " bg-gradient-to-r from-sky-300 to-sky-400 hover:scale-105";
                      }

                      return (
                        <motion.button
                          key={opt}
                          onClick={() => handlePick(opt)}
                          whileHover={!pick ? { scale: 1.05 } : {}}
                          whileTap={!pick ? { scale: 0.95 } : {}}
                          className={classes}
                        >
                          {opt}
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <div className="font-semibold">
                      Points: <span className="font-bold">{score}</span>
                    </div>
                    <motion.button
                      onClick={recordAndNext}
                      disabled={!pick}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-2 rounded-full border-2 relative right-20 border-black font-bold shadow-[4px_4px_0_#000] ${
                        pick
                          ? "bg-gradient-to-r from-orange-300 to-red-400"
                          : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      {index === total - 1 ? "Finish 🚀" : "Next ➡️"}
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                {levelCleared ? (
                  <>
                    <h3 className="text-3xl font-extrabold text-green-600">
                      🎉 Level {level + 1} Cleared!
                    </h3>
                    <p className="mt-2 text-lg font-semibold">
                      You scored {score}/{total} ({pct}%)
                    </p>

                    <div className="mt-4">
                      <h4 className="font-bold mb-2">Leaderboard (Top 5)</h4>
                      <div className="grid gap-2">
                        {leaderboard.length === 0 ? (
                          <div className="text-sm">No scores yet — be the first!</div>
                        ) : (
                          leaderboard.map((e, i) => (
                            <div key={i} className="flex justify-between text-sm p-2 border-2 border-black rounded bg-gray-50">
                              <div># {i + 1} — {e.name || "Player"} (Lvl {e.level})</div>
                              <div>{e.score} pts</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    { (chapterIndex < CHAPTERS.length - 1 || levelInChapter < CHAPTERS[chapterIndex].levels.length - 1) ? (
                      <motion.button
                        onClick={nextLevel}
                        whileHover={{ scale: 1.05 }}
                        className="mt-6 bg-gradient-to-r from-blue-300 to-indigo-500 border-2 border-black px-6 py-2 rounded-lg font-bold shadow-[4px_4px_0_#000]"
                      >
                        🚀 Go to Next Level
                      </motion.button>
                    ) : (
                      <>
                        <p className="mt-4 font-bold">🏆 You finished all chapters! Eco Champion 🌍</p>
                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 justify-center">
                          {earnedBadges.map((b, i) => (
                            <div key={i} className="p-3 border-2 border-black rounded-xl shadow-[4px_4px_0px_#000] bg-gray-50">
                              <img src={b.img} alt={b.title} className="w-16 mx-auto pixelated" />
                              <p className="mt-2 font-semibold">{b.title}</p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    <div className="mt-4 flex gap-3 justify-center">
                      <motion.button
                        onClick={() => { setReview(true); }}
                        whileHover={{ scale: 1.03 }}
                        className="px-4 py-2 border-2 border-black rounded bg-white font-bold"
                      >
                        🔍 Review Missed
                      </motion.button>
                      <motion.button
                        onClick={restart}
                        whileHover={{ scale: 1.03 }}
                        className="px-4 py-2 border-2 border-black rounded bg-white font-bold"
                      >
                        🔄 Restart
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-3xl font-extrabold text-red-600">
                      💀 Level Failed
                    </h3>
                    <p className="mt-2 text-lg font-semibold">
                      Score: {score}/{total} ({pct}%)
                    </p>
                    <p className="mt-4 font-bold">
                      👉 Talk to my Eco Bot 🤖 to clear your doubts, then try again!
                    </p>
                    <div className="mt-4 flex gap-3 justify-center">
                      <motion.button
                        onClick={() => { setReview(true); }}
                        whileHover={{ scale: 1.03 }}
                        className="px-4 py-2 border-2 border-black rounded bg-white font-bold"
                      >
                        🔍 Review Missed
                      </motion.button>
                      <motion.button
                        onClick={restart}
                        whileHover={{ scale: 1.05 }}
                        className="mt-2 bg-gradient-to-r from-yellow-300 to-orange-400 border-2 border-black px-6 py-2 rounded-lg font-bold shadow-[4px_4px_0_#000]"
                      >
                        🔄 Restart Game
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Review Mode Overlay */}
            <AnimatePresence>
              {review && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 p-6"
                >
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="w-full max-w-2xl bg-white p-6 rounded-xl border-4 border-black shadow-[8px_8px_0_#000] overflow-auto max-h-[80vh]"
                  >
                    <h3 className="text-2xl font-bold mb-4">🔎 Review Missed Questions</h3>
                    {missed.length === 0 ? (
                      <div>No missed questions recorded this run.</div>
                    ) : (
                      <div className="grid gap-3">
                        {missed.map((m, i) => (
                          <div key={i} className="p-3 border-2 border-black rounded bg-gray-50">
                            <div className="font-bold">{m.q}</div>
                            <div className="mt-1">Your answer: <span className="font-semibold">{String(m.pick)}</span></div>
                            <div>Correct: <span className="font-semibold">{m.correct}</span></div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-6 flex justify-center gap-3">
                      <motion.button onClick={() => { setReview(false); }} whileHover={{ scale: 1.03 }} className="px-4 py-2 border-2 border-black rounded bg-white font-bold">Close</motion.button>
                      <motion.button onClick={() => { setReview(false); restart(); }} whileHover={{ scale: 1.03 }} className="px-4 py-2 border-2 border-black rounded bg-white font-bold">Restart Game</motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Name prompt modal for leaderboard */}
            <AnimatePresence>
              {showNamePrompt && (
                <motion.div
                  key="nameprompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
                >
                  <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-sm bg-white p-6 rounded-xl border-4 border-black shadow-[8px_8px_0_#000]">
                    <h3 className="text-xl font-bold mb-3">Save your score</h3>
                    <p className="text-sm mb-3">Enter your name to save {score} pts to the leaderboard.</p>
                    <input
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="w-full p-2 border-2 border-black rounded mb-3"
                      placeholder="Your name"
                    />
                    <div className="flex gap-3 justify-center">
                      <motion.button onClick={submitNameToLeaderboard} whileHover={{ scale: 1.03 }} className="px-4 py-2 border-2 border-black rounded bg-white font-bold">Save</motion.button>
                      <motion.button onClick={() => { setShowNamePrompt(false); setPlayerName(""); }} whileHover={{ scale: 1.03 }} className="px-4 py-2 border-2 border-black rounded bg-white font-bold">Skip</motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}

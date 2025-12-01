// src/components/BlogPage.jsx
import { AnimatePresence, motion } from "framer-motion";
import { Award as LucideAward } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import img13817912 from "../assets/13817912_5356402 copy.jpeg";
import imgChatGPT011845 from "../assets/ChatGPT Image Sep 6, 2025, 01_18_45 AM.png";
import imgChatGPT014701 from "../assets/ChatGPT Image Sep 6, 2025, 01_47_01 AM.png";
import imgGem6prz from "../assets/Gemini_Generated_Image_6prz0k6prz0k6prz.png";
import imgGemLjk from "../assets/Gemini_Generated_Image_ljk241ljk241ljk2.png";
import imgGemNtz from "../assets/Gemini_Generated_Image_ntzbq8ntzbq8ntzb.png";
import imgGemWj9 from "../assets/Gemini_Generated_Image_wj9ipqwj9ipqwj9i.png";
import imgGreenhouse from "../assets/greenhouse effect.jpg";
import imgTreesMatter from "../assets/trees matter carbon, cooling and you.png";

// Add your quiz video here. Place blogvideo.mp4 into src/assets/
import quizVideo from "../assets/blogvideo.mp4";

// NOTE: Removed any lenis / smooth-scroll library references from this component.

function MedalPopup({ open, onClose, medalType = "gold", title = "Well done!", subtitle = "" }) {
  const map = {
    gold: { Icon: LucideAward, tint: "#FFD54A", accent: "#FFB300" },
    silver: { Icon: LucideAward, tint: "#C0C0C0", accent: "#9FA6AD" },
    bronze: { Icon: LucideAward, tint: "#CD7F32", accent: "#B66A2B" },
  };
  const { Icon, tint, accent } = map[medalType] || map.gold;

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center" role="dialog" aria-modal="true">
          <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
          <div
            className="relative z-50 w-full max-w-sm p-6 rounded-3xl flex flex-col items-center bg-white/95 backdrop-blur-md shadow-2xl"
            style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.35)" }}
          >
            <div
              aria-hidden
              className="absolute -inset-6 rounded-3xl pointer-events-none"
              style={{
                background: `radial-gradient(400px 200px at 50% 30%, ${accent}22, transparent 35%)`,
                filter: "blur(22px)",
                zIndex: -1,
              }}
            />
            <div className="p-4 rounded-full bg-white/60 shadow-md">
              <Icon size={72} color={tint} strokeWidth={1.6} />
            </div>

            <div className="text-center mt-4">
              <h3 className="font-bold text-xl">{title}</h3>
              {subtitle && <div className="text-sm text-gray-600 mt-1">{subtitle}</div>}
            </div>

            <div className="mt-5 flex gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded-md bg-white border text-sm hover:shadow">
                Close
              </button>
              <button onClick={onClose} className="px-4 py-2 rounded-md bg-green-600 text-white text-sm">
                Continue
              </button>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-8 left-6 animate-float-slow">🎉</div>
            <div className="absolute top-2 right-6 animate-float-medium">✨</div>
            <div className="absolute bottom-8 left-20 animate-float-fast">🎊</div>
          </div>
        </div>
      )}
    </>
  );
}

const articlesSample = [
  // climate articles
  {
    id: "climate-1",
    title: "Why Trees Matter: Carbon, Cooling & You",
    excerpt: "Trees reduce temperature, store carbon and support biodiversity — quick overview.",
    readingMins: 6,
    tags: ["Climate"],
    image: imgTreesMatter,
    // <-- attach the quiz video to this one article (only)
    quizVideo: quizVideo,
    content: `
      <h2>Why trees matter</h2>
      <p>Trees are like natural air conditioners. They give shade and make the air around us cooler, which is very helpful in hot cities.</p>
      <p>They also take in carbon dioxide (a greenhouse gas) from the air and keep it stored in their wood, branches, and roots. This helps slow down climate change.</p>
      <p>Trees are homes for birds, insects, and animals, and their roots help absorb rainwater so there are fewer floods.</p>
      <p><strong>Remember for the quiz:</strong> Trees don’t heat cities — they cool them, store carbon, and provide shade.</p>
    `,
    quiz: {
      questions: [
        {
          question: "Which is a documented benefit of urban trees?",
          options: [
            { text: "Raise local temperatures", explanation: "Incorrect — trees usually cool local microclimates." },
            { text: "Store carbon and provide shade", explanation: "Correct — they sequester carbon and provide shade." },
            { text: "Increase soil compaction", explanation: "Incorrect — compaction generally comes from heavy machinery." },
          ],
          answerIndex: 1,
        },
      ],
    },
  },
  {
    id: "climate-2",
    title: "What is the Greenhouse Effect? (Simple)",
    excerpt: "An easy explanation for why greenhouse gases warm our world.",
    readingMins: 5,
    tags: ["Climate"],
    image: imgGreenhouse,
    content: `
      <h2>The greenhouse effect</h2>
      <p>The Earth is wrapped in a blanket of gases. Sunlight comes through and warms the Earth, and then some of the heat tries to escape back into space.</p>
      <p>But gases like carbon dioxide and methane trap some of this heat, like a greenhouse that keeps plants warm. This is called the greenhouse effect.</p>
      <p>A little greenhouse effect is good — without it, the Earth would be too cold. But burning coal, oil, and gas adds too much carbon dioxide, making the blanket thicker and the planet hotter.</p>
      <p><strong>Remember for the quiz:</strong> The most important human-made greenhouse gas is carbon dioxide (CO₂).</p>
    `,
    quiz: {
      questions: [
        {
          question: "Which gas is a major anthropogenic greenhouse gas?",
          options: [
            { text: "Carbon dioxide (CO₂)", explanation: "Correct — CO₂ is the largest contributor from fossil fuel burning." },
            { text: "Argon (Ar)", explanation: "Incorrect — argon is inert." },
            { text: "Helium (He)", explanation: "Incorrect — helium is not a greenhouse gas of concern." },
          ],
          answerIndex: 0,
        },
      ],
    },
  },
  {
    id: "climate-3",
    title: "Urban Heat Islands: Why Cities Get Hotter",
    excerpt: "How surfaces, design and vegetation change city temperatures.",
    readingMins: 5,
    tags: ["Climate"],
    image: img13817912,
    content: `
      <h2>Urban heat islands</h2>
      <p>Have you noticed that cities often feel hotter than villages or forests? That’s because roads, buildings, and dark roofs soak up heat from the sun.</p>
      <p>These areas don’t cool down easily at night, so cities stay warmer. This is called the “urban heat island” effect.</p>
      <p>Planting trees, using reflective (light-colored) roofs, and creating green spaces can help make cities cooler and healthier.</p>
      <p><strong>Remember for the quiz:</strong> Street trees and reflective roofs reduce urban heat, while dark asphalt makes it worse.</p>
    `,
    quiz: {
      questions: [
        {
          question: "Which intervention helps reduce urban heat?",
          options: [
            { text: "More dark asphalt", explanation: "Incorrect — dark materials absorb more heat." },
            { text: "Street trees and reflective roofs", explanation: "Correct — they reduce heat absorption and increase cooling." },
            { text: "Dense walls without ventilation", explanation: "Incorrect — reduces airflow." },
          ],
          answerIndex: 1,
        },
      ],
    },
  },

  // basics & action articles
  {
    id: "basics-1",
    title: "Biodiversity Basics: What It Means and Why It Matters",
    excerpt: "Intro to genes, species and ecosystems and the services they provide.",
    readingMins: 6,
    tags: ["Basics"],
    image: imgGemNtz,
    content: `
      <h2>Biodiversity basics</h2>
      <p>Biodiversity means the variety of life on Earth. It includes three levels: genes (differences within one species), species (different kinds of plants and animals), and ecosystems (forests, rivers, oceans).</p>
      <p>Each part of biodiversity is important. Bees pollinate plants, worms make soil healthy, and forests give us clean air and water.</p>
      <p><strong>Remember for the quiz:</strong> Biodiversity is not just animals — it includes genes, species, and ecosystems together.</p>
    `,
    quiz: {
      questions: [
        {
          question: "Biodiversity includes which levels?",
          options: [
            { text: "Only animals", explanation: "" },
            { text: "Genes, species and ecosystems", explanation: "" },
            { text: "Only climate variables", explanation: "" },
          ],
          answerIndex: 1,
        },
      ],
    },
  },
  {
    id: "basics-2",
    title: "Water Basics: From Source to Tap",
    excerpt: "Understand freshwater sources, treatment, and basic conservation.",
    readingMins: 5,
    tags: ["Basics"],
    image: imgChatGPT011845,
    content: `
      <h2>Water basics</h2>
      <p>We get our water from rivers, lakes, and underground sources called aquifers. Before it reaches our taps, the water is cleaned in treatment plants to remove dirt and germs.</p>
      <p>Water is precious, and wasting it means we also waste energy and harm the environment.</p>
      <p><strong>Remember for the quiz:</strong> Fixing leaks is one of the easiest and most effective ways to save water at home.</p>
    `,
    quiz: {
      questions: [
        {
          question: "What's an effective household water conservation step?",
          options: [
            { text: "Fix leaks promptly", explanation: "" },
            { text: "Leave taps running", explanation: "" },
          ],
          answerIndex: 0,
        },
      ],
    },
  },
  {
    id: "basics-3",
    title: "Pollination 101: Why Bees & Flowers Matter",
    excerpt: "How pollination works and why it supports food systems.",
    readingMins: 4,
    tags: ["Basics"],
    image: imgGemWj9,
    content: `
      <h2>Pollination essentials</h2>
      <p>Pollination is when pollen moves from one flower to another, allowing plants to grow fruits and seeds. Bees, butterflies, and even birds help this process.</p>
      <p>Without pollinators, many of the foods we eat — like apples, tomatoes, and nuts — wouldn’t grow well.</p>
      <p><strong>Remember for the quiz:</strong> Planting native flowers helps pollinators, while pesticides can harm them.</p>
    `,
    quiz: {
      questions: [
        {
          question: "Which action helps pollinators?",
          options: [
            { text: "Use broad-spectrum pesticides", explanation: "" },
            { text: "Plant native flowers", explanation: "" },
          ],
          answerIndex: 1,
        },
      ],
    },
  },
  {
    id: "action-1",
    title: "5 Everyday Actions That Help the Planet",
    excerpt: "Simple habits you can start this week to reduce footprint.",
    readingMins: 4,
    tags: ["Action"],
    image: imgGem6prz,
    content: `
      <h2>Small steps, big change</h2>
      <p>Even small habits can make a big difference for the planet. Carrying a reusable bottle instead of buying plastic, switching off lights when not needed, or walking short distances instead of using a car all reduce pollution and waste.</p>
      <p><strong>Remember for the quiz:</strong> Using reusable items reduces waste, while single-use plastic increases it.</p>
    `,
    quiz: {
      questions: [
        {
          question: "Which everyday action reduces waste?",
          options: [
            { text: "Use single-use plastic", explanation: "" },
            { text: "Carry reusable containers", explanation: "" },
          ],
          answerIndex: 1,
        },
      ],
    },
  },
  {
    id: "action-2",
    title: "Waste Less: Practical Recycling & Reuse Tips",
    excerpt: "How to recycle properly and prioritize reuse.",
    readingMins: 4,
    tags: ["Action"],
    image: imgGemLjk,
    content: `
      <h2>Reduce, reuse, recycle</h2>
      <p>The best way to manage waste is to reduce what we use in the first place. Next, reuse items as much as possible. Recycling comes last, but only works well when items are clean and sorted properly.</p>
      <p>Food scraps can be composted to make healthy soil instead of going to the trash.</p>
      <p><strong>Remember for the quiz:</strong> The order is Reduce → Reuse → Recycle.</p>
    `,
    quiz: {
      questions: [
        {
          question: "What's the most impactful waste hierarchy?",
          options: [
            { text: "Recycle → Reuse → Reduce", explanation: "" },
            { text: "Reduce → Reuse → Recycle", explanation: "" },
          ],
          answerIndex: 1,
        },
      ],
    },
  },
  {
    id: "action-3",
    title: "Community Action: How Local Projects Make a Difference",
    excerpt: "Small community efforts lead to larger environmental gains.",
    readingMins: 4,
    tags: ["Action"],
    image: imgChatGPT014701,
    content: `
      <h2>Community action</h2>
      <p>When people work together, they can make their neighborhoods greener and cleaner. Examples include tree planting, park cleanups, and creating community gardens.</p>
      <p>Working in a group also helps share ideas, energy, and resources so projects succeed.</p>
      <p><strong>Remember for the quiz:</strong> The best first step is to identify the issue and involve the right people, not working alone.</p>
    `,
    quiz: {
      questions: [
        {
          question: "Good first step for a local environmental project?",
          options: [
            { text: "Identify the issue and stakeholders", explanation: "" },
            { text: "Work alone", explanation: "" },
          ],
          answerIndex: 0,
        },
      ],
    },
  },
];

function Tag({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm border ${active ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-700 border-gray-200"} transition`}
    >
      {children}
    </button>
  );
}

function ArticleCard({ article, onOpen, bookmarked, onToggleBookmark }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -6 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg overflow-hidden border border-gray-100 cursor-pointer"
      onClick={() => onOpen(article)}
    >
      <div className="relative h-44 md:h-48 w-full bg-gray-50">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${article.image})` }}
        />
        <img src={article.image} alt={article.title} className="sr-only" />
      </div>

      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-lg md:text-xl leading-tight">{article.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{article.excerpt}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {article.tags.map((t) => (
                <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-gray-400">{article.readingMins} min</span>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(article.id);
                }}
                className="text-sm px-2 py-1 rounded-md border text-gray-600 hover:bg-gray-50"
                aria-pressed={bookmarked}
              >
                {bookmarked ? "Saved" : "Save"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(article);
                }}
                className="px-3 py-1 rounded-md bg-green-600 text-white font-medium hover:bg-green-700"
              >
                Read
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ---------- Quiz widget ---------- */
function QuizWidget({ quiz, onClose, onComplete }) {
  const questions = quiz?.questions || [];
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    setIndex(0);
    setPicked(null);
    setAnswers([]);
    setShowReview(false);
  }, [quiz]);

  function submit() {
    if (picked === null) return;
    const q = questions[index];
    const correct = picked === q.answerIndex;

    // update answers immediately and handle end-of-quiz result deterministically
    setAnswers((prev) => {
      const next = [...prev, { picked, correct }];
      // if this was the last question, show review and call onComplete with the correct final values
      if (index + 1 >= questions.length) {
        // compute score from next
        const finalScore = next.filter((a) => a.correct).length;
        setTimeout(() => {
          setShowReview(true);
          if (typeof onComplete === "function") {
            onComplete(finalScore, questions.length);
          }
        }, 80);
      } else {
        setIndex((i) => i + 1);
      }
      return next;
    });

    setPicked(null);
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setAnswers([]);
    setShowReview(false);
  }

  const score = answers.filter((a) => a.correct).length;

  // If there are no questions, show placeholder
  if (questions.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-bold mb-2">Quiz</h3>
        <div className="text-sm text-gray-600 mb-4">No quiz questions available.</div>
        <div className="flex items-center justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-3 py-1 rounded-md border">Close</button>
        </div>
      </div>
    );
  }

  if (showReview) {
    return (
      <div>
        <h3 className="text-lg font-bold mb-2">Quiz results</h3>
        <div className="text-sm text-gray-600 mb-4">You scored {score} / {questions.length}</div>
        <div className="space-y-3 max-h-[50vh] overflow-auto">
          {questions.map((q, i) => {
            const ans = answers[i] || {};
            const userPicked = ans.picked;
            const correctIdx = q.answerIndex;
            return (
              <div key={i} className="p-3 rounded-md border">
                <div className="font-semibold">Q{i + 1}. {q.question}</div>
                <div className="mt-2 space-y-1">
                  {q.options.map((opt, j) => {
                    const isUser = j === userPicked;
                    const isCorrect = j === correctIdx;
                    return (
                      <div key={j} className={`px-3 py-2 rounded-md border ${isCorrect ? 'bg-green-50 border-green-300' : isUser ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
                        <div className="flex items-center justify-between">
                          <div>{opt.text}</div>
                          <div className="text-xs text-gray-500">{isCorrect ? 'correct' : isUser ? 'your answer' : ''}</div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{opt.explanation}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-3 py-1 rounded-md border">Close</button>
          <button onClick={restart} className="px-4 py-2 rounded-md bg-green-600 text-white">Retry</button>
        </div>
      </div>
    );
  }

  const current = questions[index];
  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Quick quiz ({index + 1} / {questions.length})</h3>
      <div className="text-sm text-gray-600 mb-4">{current.question}</div>
      <div className="space-y-2">
        {current.options.map((o, i) => (
          <button key={i} onClick={() => setPicked(i)} className={`w-full text-left px-3 py-2 rounded-md border ${picked === i ? "border-green-500 bg-green-50" : "border-gray-200"}`}>
            {o.text}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 mt-4">
        <button onClick={onClose} className="px-3 py-1 rounded-md border">Close</button>
        <button onClick={submit} disabled={picked === null} className="px-4 py-2 rounded-md bg-green-600 text-white">
          {index + 1 < questions.length ? 'Submit & Next' : 'Submit & See Results'}
        </button>
      </div>
    </div>
  );
}

/* ---------- Reader modal (replacement) ---------- */
function ReaderModal({ article, onClose }) {
  const contentRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [medalOpen, setMedalOpen] = useState(false);
  const [medalData, setMedalData] = useState({ type: "gold", title: "Nice!", subtitle: "" });
  const touchStartYRef = useRef(null);

  // NEW: handleKey function attached to the scrollable content via onKeyDown
  function handleKey(e) {
    const el = contentRef.current;
    if (!el) return;
    const key = e.key;
    let delta = 0;
    let handled = false;

    if (key === "ArrowDown") {
      delta = 40; handled = true;
    } else if (key === "ArrowUp") {
      delta = -40; handled = true;
    } else if (key === "PageDown") {
      delta = el.clientHeight - 40; handled = true;
    } else if (key === "PageUp") {
      delta = -(el.clientHeight - 40); handled = true;
    } else if (key === " " || key === "Spacebar") {
      // if active element is an input or textarea, don't intercept
      const active = document.activeElement;
      const tag = active && active.tagName ? active.tagName.toLowerCase() : null;
      if (tag !== "input" && tag !== "textarea" && active?.isContentEditable !== true) {
        delta = el.clientHeight - 40;
        handled = true;
      }
    } else if (key === "Home") {
      handled = true;
      try { el.scrollTo({ top: 0, behavior: "smooth" }); } catch (err) { el.scrollTop = 0; }
    } else if (key === "End") {
      handled = true;
      try { el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); } catch (err) { el.scrollTop = el.scrollHeight; }
    }

    if (handled && delta !== 0) {
      try {
        el.scrollBy({ top: delta, behavior: "smooth" });
      } catch (err) {
        el.scrollTop = el.scrollTop + delta;
      }
      e.preventDefault();
      e.stopPropagation();
    } else if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  // Focus the content element when modal mounts so onKeyDown will receive keyboard events
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    el.tabIndex = el.tabIndex ?? 0;
    const focusT = setTimeout(() => {
      try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
    }, 50);
    return () => clearTimeout(focusT);
  }, [article]);

  // Lock body scroll while modal is mounted and restore previous values precisely
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    // compensate for scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    // prevent iOS rubber-band / page scrolling while modal open
    const preventTouchMove = (ev) => ev.preventDefault();
    document.addEventListener("touchmove", preventTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = prevOverflow || "";
      document.body.style.paddingRight = prevPaddingRight || "";
      document.removeEventListener("touchmove", preventTouchMove, { passive: false });
    };
  }, []);

  // Scroll progress tracking and safe setup
  useEffect(() => {
    function updateProgressFromElement(el) {
      if (!el) return;
      const scrolled = el.scrollTop;
      const total = Math.max(1, el.scrollHeight - el.clientHeight);
      setProgress(Math.min(100, Math.round((scrolled / total) * 100)));
    }

    const el = contentRef.current;
    if (!el) return;

    el.tabIndex = el.tabIndex ?? -1;
    try { el.focus({ preventScroll: true }); } catch (e) { /* ignore */ }

    el.style.overscrollBehavior = "contain"; // avoid scroll chaining on supported browsers
    el.style.webkitOverflowScrolling = "touch"; // smoother on iOS

    const handler = () => updateProgressFromElement(el);
    requestAnimationFrame(() => updateProgressFromElement(el));
    el.addEventListener("scroll", handler, { passive: true });

    return () => {
      el.removeEventListener("scroll", handler);
      // don't remove styles to avoid flicker issues if re-mounted quickly
    };
  }, [article]);

  // Prevent wheel events from escaping the scroll container when at the edges
  function onWheel(e) {
    const el = contentRef.current;
    if (!el) return;
    const delta = (e?.nativeEvent?.deltaY ?? e?.deltaY) || 0;
    const atTop = el.scrollTop === 0 && delta < 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight && delta > 0;
    if (atTop || atBottom) {
      e.stopPropagation();
      // allow native momentum/rubber-band; preventing default can harm iOS native scrolling
    }
  }

  // Touch handlers for mobile: track start Y and stop propagation when at edges
  function onTouchStart(e) {
    const t = e.touches?.[0] ?? e.nativeEvent?.touches?.[0];
    touchStartYRef.current = t ? t.clientY : null;
  }
  function onTouchMove(e) {
    const el = contentRef.current;
    if (!el || touchStartYRef.current === null) return;
    const t = e.touches?.[0] ?? e.nativeEvent?.touches?.[0];
    const curY = t ? t.clientY : 0;
    const deltaY = touchStartYRef.current - curY; // positive when swiping up (scrolling down)
    const atTop = el.scrollTop === 0 && deltaY < 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight && deltaY > 0;
    if (atTop || atBottom) {
      // stop the touch from bubbling to the page to avoid page/body scroll when the modal content is at its edge
      e.stopPropagation();
      // don't call preventDefault() broadly — only do so if you are intentionally suppressing rubber-banding
    }
    // else allow the content to scroll
  }

  if (!article) return null;

  function pickMedalType(score, total) {
    if (total === 0) return "bronze";
    const pct = (score / total) * 100;
    if (pct >= 90) return "gold";
    if (pct >= 60) return "silver";
    return "bronze";
  }

  function handleQuizComplete(score, total) {
    const type = pickMedalType(score, total);
    setMedalData({
      type,
      title: type === "gold" ? "Excellent!" : type === "silver" ? "Great job!" : "Nice attempt!",
      subtitle: `You scored ${score} / ${total}`,
    });
    setShowQuiz(false);
    setTimeout(() => setMedalOpen(true), 300);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay behind the modal */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* modal panel */}
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-50 w-[95%] md:w-3/4 lg:w-2/3 bg-white rounded-2xl shadow-2xl overflow-visible"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 border-b flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-lg">{article.title}</h2>
            <p className="text-sm text-gray-500">{article.tags.join(" • ")} • {article.readingMins} min</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${progress}%` }} />
            </div>
            <button className="px-3 py-1 rounded-md border text-sm" onClick={onClose}>Close</button>
          </div>
        </div>

        <div className="md:flex md:gap-6">
          <div
            ref={contentRef}
            tabIndex={0}
            onKeyDown={handleKey}
            className="md:flex-1 p-6 max-h-[60vh] overflow-auto"
            role="region"
            aria-label="Article content"
            onWheel={onWheel}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
          >
            <div dangerouslySetInnerHTML={{ __html: article.content }} className="prose max-w-none" />

            {/* --- VIDEO: appears directly under the article description (only for articles that have quizVideo) --- */}
            {article.quizVideo && (
              <div className="mt-4">
                <div className="text-sm font-semibold mb-2">Watch this short clip</div>
                <video
                  src={article.quizVideo}
                  controls
                  autoPlay
                  muted
                  playsInline
                  loop
                  className="w-full rounded-md"
                />
              </div>
            )}

            <div className="mt-6">
              <button onClick={() => setShowQuiz(true)} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">Take Quick Quiz</button>
            </div>
          </div>

          <aside className="hidden md:block w-64 p-4 border-l">
            <div className="text-sm text-gray-600">Quick facts</div>
            <div className="mt-3 space-y-3">
              <div className="rounded-md bg-green-50 p-3">
                <div className="text-xs text-green-600 font-semibold">Tip</div>
                <div className="text-sm mt-1">Bookmark articles to build a reading list.</div>
              </div>

              <div className="rounded-md p-3 bg-yellow-50">
                <div className="text-xs text-yellow-700 font-semibold">Did you know?</div>
                <div className="text-sm mt-1">Small design changes can measurably cool urban areas.</div>
              </div>
            </div>
          </aside>
        </div>

        <AnimatePresence>
          {showQuiz && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center z-60">
              <div className="absolute inset-0 bg-black/30" onClick={() => setShowQuiz(false)} />
              <motion.div className="relative z-50 bg-white rounded-xl p-6 w-[90%] max-w-lg shadow-xl">
                <QuizWidget quiz={article.quiz} onClose={() => setShowQuiz(false)} onComplete={handleQuizComplete} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <MedalPopup open={medalOpen} onClose={() => setMedalOpen(false)} medalType={medalData.type} title={medalData.title} subtitle={medalData.subtitle} />
    </div>
  );
}

/* ---------- main BlogPage component ---------- */
export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState(null);
  const [sortBy, setSortBy] = useState("featured");
  const [bookmarks, setBookmarks] = useState(() => new Set());
  const [openArticle, setOpenArticle] = useState(null);

  const allTags = useMemo(() => {
    const s = new Set();
    articlesSample.forEach((a) => a.tags.forEach((t) => s.add(t)));
    return Array.from(s);
  }, []);

  const filtered = useMemo(() => {
    let out = articlesSample.filter(
      (a) =>
        (!tagFilter || a.tags.includes(tagFilter)) &&
        (a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(query.toLowerCase()))
    );
    if (sortBy === "shortest") out = [...out].sort((x, y) => x.readingMins - y.readingMins);
    return out;
  }, [query, tagFilter, sortBy]);

  function toggleBookmark(id) {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8 lg:px-16">
      <header className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Learn About the Environment</h1>
            <p className="text-gray-600 mt-2">Short, informative and interactive articles to learn environmental basics.</p>
          </div>

          <div className="flex gap-3 items-center">
            <div className="relative">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search topics or articles..." className="px-4 py-2 rounded-full border w-64 md:w-80 bg-white" />
              <span className="absolute right-3 top-2 text-gray-400 text-sm">🔎</span>
            </div>

            <div className="flex gap-2 items-center">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border rounded-md bg-white">
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="shortest">Shortest</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 flex-wrap items-center">
          <Tag active={!tagFilter} onClick={() => setTagFilter(null)}>All</Tag>
          {allTags.map((t) => (
            <Tag key={t} active={tagFilter === t} onClick={() => setTagFilter((s) => (s === t ? null : t))}>{t}</Tag>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8">
        {filtered.length === 0 ? (
          <div className="p-8 rounded-md bg-white text-center">No results found. Try another search.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((a) => (
              <ArticleCard key={a.id} article={a} onOpen={setOpenArticle} bookmarked={bookmarks.has(a.id)} onToggleBookmark={toggleBookmark} />
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {openArticle && <ReaderModal key={openArticle.id} article={openArticle} onClose={() => setOpenArticle(null)} />}
      </AnimatePresence>
    </div>
  );
}

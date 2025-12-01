// src/components/WaterCycleGame.jsx
import { useEffect, useRef, useState } from "react";

/* assets (keep these filenames in /src/assets/) */
import boatImg from "../assets/boat_sprite.png";
import { default as gameEl1, default as gameEl10 } from "../assets/gameel1.png";
import gameEl2 from "../assets/gameel2.png";
import gameEl3 from "../assets/gameel3.png";
import gameEl4 from "../assets/gameel4.png";
import gameEl5 from "../assets/gameel5.png";
import gameEl6 from "../assets/gameel6.png";
import gameEl7 from "../assets/gameel7.png";
import gameEl8 from "../assets/gameel8.png";
import gameEl9 from "../assets/gameel9.png";
import background from "../assets/gamepage22.png";
import hookImg from "../assets/hook_icon.png";

/* chapters / facts (updated to include gameEl6..gameEl10) */
const CHAPTERS = [
  {
    id: 1,
    title: "Evaporation & Condensation",
    lesson:
      "Water warms, turns into vapor and forms clouds. Catch items linked to this step.",
    targetsToPass: 4,
    pool: [
      { label: "plant", category: "useful", img: gameEl3 },
      { label: "glass Bottle", category: "harmful", img: gameEl5 },
      { label: "bottle", category: "harmful", img: gameEl8 },
      { label: "Banana peal", category: "harmful", img: gameEl6 },
      { label: "cigarette", category: "harmful", img: gameEl9 },
    ],
  },
  {
    id: 2,
    title: "Precipitation",
    lesson: "Clouds release moisture as rain, snow or hail. Sort falling elements.",
    targetsToPass: 4,
    pool: [
      { label: "paper", category: "harmful", img: gameEl7 },
      { label: "battery", category: "harmful", img: gameEl2 },
      { label: "plant", category: "useful", img: gameEl3 },
      { label: "Soda can", category: "harmful", img: gameEl4 },
    ],
  },
  {
    id: 3,
    title: "Collection & Groundwater",
    lesson:
      "Water gathers in rivers, lakes & ground. Some things clean water; some pollute it.",
    targetsToPass: 5,
    pool: [
      { label: "glass  bottle", category: "useful", img: gameEl5 },
      { label: "plastic bottlr", category: "harmful", img: gameEl10 },
      { label: "Tree Roots", category: "useful", img: gameEl3 },
      { label: "Plastic Bottle", category: "harmful", img: gameEl1 },
      { label: "paper", category: "useful", img: gameEl7 },
    ],
  },
  {
    id: 4,
    title: "Human Waste & Recycling",
    lesson:
      "People create waste; some of it can be composted or recycled, some harms ecosystems.",
    targetsToPass: 5,
    pool: [
      { label: "Paper", category: "harmful", img: gameEl7 },
      { label: "Glass Bottle", category: "harmful", img: gameEl8 },
      { label: "Can", category: "harmful", img: gameEl4 },
      { label: "Mirror Bottle", category: "useful", img: gameEl5 },
      { label: "Banana Peel", category: "useful", img: gameEl6 },
    ],
  },
  {
    id: 5,
    title: "Pollution Hotspots",
    lesson: "Some items are especially damaging when they enter waterways — spot them!",
    targetsToPass: 4,
    pool: [
      { label: "Battery", category: "harmful", img: gameEl2 },
      { label: "Cigarette Butt", category: "harmful", img: gameEl9 },
      { label: "plactic", category: "harmful", img: gameEl10 },
      { label: "Plastic Bottle", category: "harmful", img: gameEl1 },
    ],
  },
];

const FACTS = {
  "Plant": "Invisible water in the air — it forms clouds when it cools.",
  "Salt Spray": "Tiny drops of sea water — usually not harmful to the water cycle.",
  "Oil Film": "Oil floats on water and harms animals and plants.",
  "Hot Steam": "Water in gas form — like steam from a kettle.",
  "Polluted Mist": "Smog or polluted air that can make rain dirty.",
  "Raindrop": "Rain helps water the land and fill rivers.",
  "Acid Rain": "Rain that’s too acidic — it hurts plants and buildings.",
  "Hail": "Frozen raindrops — can damage crops and roofs.",
  "Soot Droplet": "Tiny black pollution pieces from fires or smoke.",
  "Freshwater": "Clean water we can drink and use for farming.",
  "Fertilizer Runoff": "Fertilizer washing into water can cause too much algae.",
  "Tree Roots": "Roots help filter and clean water naturally.",
  "Plastic Bottle": "Plastic pollutes water and hurts wildlife.",
  "Wetland": "A healthy wetland filters water and hosts animals.",
  "Paper": "Paper can be recycled or composted — better than plastic when disposed correctly.",
  "Glass Bottle": "Glass fragments can hurt animals and persist in the environment.",
  "Can": "Cans can be recycled, but when left in nature they pollute waterways.",
  "Mirror Bottle": "Reusable bottles cut down single-use waste — great when reused.",
  "Banana Peel": "Organic waste like banana peels can be composted and return nutrients to soil.",
  "Battery": "Batteries leak toxic metals — they’re very harmful to ecosystems.",
  "Cigarette Butt": "Cigarette filters contain plastic and toxins — they’re harmful to water life.",
  "Disposable Pipe": "Single-use pipes and plastic tubing add to pollution and microplastics.",
};

/* tuning constants (same as before) */
const BOAT_MAX_SPEED = 420; // pixels/sec
const BOAT_ACCEL = 2200; // px/s^2
const BOAT_FRICTION = 8; // higher = quicker stop
const SPAWN_INTERVAL_MS = 1100;
const HOOK_DROP_SPEED = 420; // used for target approach speed
const HOOK_MAX_DROP = 260;
const HIT_RADIUS = 45;

/* visual rod ratio: 0 = left, 0.5 = center, 1 = right */
const ROD_X_RATIO = 0.82; // <<--- tweak this if you want to nudge hook horizontally on the boat

/* tiny helper */
function randBetween(a, b) {
  return Math.random() * (b - a) + a;
}

/* linear interpolation helper */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/* clamp */
function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

/* Component */
export default function WaterCycleGame({ onExit }) {
  const containerRef = useRef(null);
  const [containerW, setContainerW] = useState(1200);
  const [containerH, setContainerH] = useState(700);

  // boat target and displayed positions
  const boatXRef = useRef(0); // world x
  const displayedBoatXRef = useRef(0); // used for render
  const [displayedBoatX, setDisplayedBoatX] = useState(0); // react state for render

  // velocity for better movement
  const boatVxRef = useRef(0);

  // hook: displayed offset and target
  const hookOffsetRef = useRef(0); // displayed offset (vertical)
  const hookTargetRef = useRef(0); // target (0..HOOK_MAX_DROP)
  const [displayedHookOffset, setDisplayedHookOffset] = useState(0);

  // input targets (for starting cast/retract)
  const [isCasting, setIsCasting] = useState(false);
  const [isRetracting, setIsRetracting] = useState(false);

  // items
  const itemsRef = useRef([]);
  const [items, setItems] = useState([]);
  const nextId = useRef(1);

  // game state
  const [score, setScore] = useState(0);
  const [caughtCount, setCaughtCount] = useState(0);

  // chapters
  const [chapterIndex, setChapterIndex] = useState(0);
  const chapter = CHAPTERS[chapterIndex];
  const [chapterProgress, setChapterProgress] = useState(0);

  // caught item and ui
  const [caughtItem, setCaughtItem] = useState(null);
  const [choices, setChoices] = useState([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const comboRef = useRef(0);
  const [combo, setCombo] = useState(0);
  const [lastPoints, setLastPoints] = useState(null);

  // confetti container
  const confettiRef = useRef(null);

  // keys
  const keysRef = useRef({ left: false, right: false });

  // init sizing & boat placement
  useEffect(() => {
    const upd = () => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setContainerW(r.width || 1200);
      setContainerH(r.height || 700);
      if (!boatXRef.current) {
        const mid = (r.width || 1200) / 2;
        boatXRef.current = mid;
        displayedBoatXRef.current = mid;
        setDisplayedBoatX(mid);
      }
    };
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  // keyboard
  useEffect(() => {
    const down = (e) => {
      if (["ArrowLeft", "a", "A"].includes(e.key)) keysRef.current.left = true;
      if (["ArrowRight", "d", "D"].includes(e.key)) keysRef.current.right = true;
      if (e.code === "Space") {
        e.preventDefault();
        toggleCastRetract(); // use toggle function
      }
    };
    const up = (e) => {
      if (["ArrowLeft", "a", "A"].includes(e.key)) keysRef.current.left = false;
      if (["ArrowRight", "d", "D"].includes(e.key)) keysRef.current.right = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // spawn items (same logic)
  useEffect(() => {
    itemsRef.current = [];
    setItems([]);
    setChapterProgress(0);
    nextId.current = 1;

    const spawn = () => {
      if (!containerRef.current || !chapter) return;
      const spawnX = randBetween(60, Math.max(120, containerW - 60));
      const poolItem = chapter.pool[Math.floor(Math.random() * chapter.pool.length)];
      const id = nextId.current++;
      const newItem = {
        id,
        x: spawnX,
        baseY: randBetween(containerH * 0.12, containerH * 0.28),
        y: 0,
        vx: randBetween(-28, 28),
        bobAmp: randBetween(6, 14),
        bobFreq: randBetween(0.5, 1.1),
        phase: Math.random() * Math.PI * 2,
        rot: randBetween(-8, 8),
        rotSpeed: randBetween(-6, 6),
        label: poolItem.label,
        correctCategory: poolItem.category,
        img: poolItem.img || null,
      };
      itemsRef.current = [...itemsRef.current, newItem];
      setItems([...itemsRef.current]);
    };

    spawn();
    const idInterval = setInterval(spawn, SPAWN_INTERVAL_MS);
    for (let i = 0; i < 2; i++) setTimeout(spawn, i * 300);
    return () => clearInterval(idInterval);
  }, [chapterIndex, containerW, containerH]);

  // Main animation loop (handles physics & interpolation)
  useEffect(() => {
    let last = performance.now();
    let raf = 0;

    const loop = (now) => {
      const dt = (now - last) / 1000;
      last = now;

      // -------- BOAT PHYSICS (acceleration + friction) --------
      let desiredAccel = 0;
      if (keysRef.current.left) desiredAccel -= BOAT_ACCEL;
      if (keysRef.current.right) desiredAccel += BOAT_ACCEL;

      if (!keysRef.current.left && !keysRef.current.right) {
        boatVxRef.current -= boatVxRef.current * Math.min(1, BOAT_FRICTION * dt);
      } else {
        boatVxRef.current += desiredAccel * dt;
      }

      boatVxRef.current = clamp(boatVxRef.current, -BOAT_MAX_SPEED, BOAT_MAX_SPEED);

      if (containerW > 0) {
        let nx = boatXRef.current + boatVxRef.current * dt;
        const pad = 80;
        nx = clamp(nx, pad, containerW - pad);
        boatXRef.current = nx;
      }

      const smoothFactor = clamp(1 - Math.pow(0.001, dt), 0.01, 0.35);
      displayedBoatXRef.current = lerp(displayedBoatXRef.current, boatXRef.current, smoothFactor);
      setDisplayedBoatX(displayedBoatXRef.current);

      // -------- HOOK VERTICAL MOTION --------
      const currentHook = hookOffsetRef.current;
      const targetHook = hookTargetRef.current;
      const diff = targetHook - currentHook;
      if (Math.abs(diff) > 0.5) {
        const move = clamp(diff, -HOOK_DROP_SPEED * dt * 1.6, HOOK_DROP_SPEED * dt * 1.6);
        hookOffsetRef.current = currentHook + move;
      } else {
        hookOffsetRef.current = targetHook;
      }
      setDisplayedHookOffset(hookOffsetRef.current);

      // -------- ITEM MOTION --------
      if (itemsRef.current.length > 0) {
        const t = now / 1000;
        const updated = itemsRef.current
          .map((it) => {
            const nx = it.x + it.vx * dt;
            const bob = Math.sin(2 * Math.PI * it.bobFreq * t + it.phase) * it.bobAmp;
            const ny = it.baseY + bob;
            const nrot = it.rot + it.rotSpeed * dt;
            return { ...it, x: nx, y: ny, rot: nrot };
          })
          .filter((it) => !(it.x < -220 || it.x > containerW + 220));
        itemsRef.current = updated;
        setItems([...itemsRef.current]);
      }

      // -------- COLLISION (hook horizontal fixed to rod position) --------
      if (hookOffsetRef.current > 6 && itemsRef.current.length > 0 && !caughtItem) {
        // compute boatWidth (same formula used later)
        const boatWidth = Math.min(700, containerW * 0.8);
        // hookX follows the rod on the boat: calculate from displayedBoatX (center) and boatWidth
        const hookWorldX = displayedBoatXRef.current - boatWidth / 2 + boatWidth * ROD_X_RATIO;

        // compute hook world Y similar to earlier logic
        const parentRect = containerRef.current.getBoundingClientRect();
        const attachY = parentRect.height - 40 - boatWidth * 0.22;
        const hookWorldY_top = attachY + hookOffsetRef.current;
        const hookY_fromBottom = parentRect.height - hookWorldY_top;

        for (let it of itemsRef.current) {
          const dxAbs = Math.abs(it.x - hookWorldX);
          const dyAbs = Math.abs(it.y - hookY_fromBottom);
          if (dxAbs <= HIT_RADIUS && dyAbs <= HIT_RADIUS) {
            // caught
            itemsRef.current = itemsRef.current.filter((x) => x.id !== it.id);
            setItems([...itemsRef.current]);
            setCaughtItem(it);
            // retract
            hookTargetRef.current = 0;
            setIsRetracting(true);
            setIsCasting(false);
            break;
          }
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [containerW, containerH, caughtItem, isCasting, isRetracting]);

  /* Helpers used by UI to move target boat position */
  function moveBoatBy(dx) {
    const pad = 80;
    const nx = clamp(boatXRef.current + dx, pad, containerW - pad);
    boatXRef.current = nx;
    // update displayed immediately for responsiveness
    displayedBoatXRef.current = nx;
    setDisplayedBoatX(nx);
    // nudge velocity so the physics loop isn't fighting user jumps
    boatVxRef.current = 0;
  }

  /* Toggle cast/retract by setting hookTargetRef (no immediate jump) */
  function toggleCastRetract() {
    if (isRetracting) return;
    if (hookTargetRef.current <= 0.5) {
      hookTargetRef.current = HOOK_MAX_DROP;
      setIsCasting(true);
      setIsRetracting(false);
      setShowTutorial(false);
    } else {
      hookTargetRef.current = 0;
      setIsCasting(false);
      setIsRetracting(true);
    }
  }

  /* categorize caught item (keeps your scoring logic) */
  function categorize(choice) {
    if (!caughtItem) return;
    const correct = choice === caughtItem.correctCategory;
    setChoices((c) => [...c, { item: caughtItem.label, chosen: choice, correct }]);

    if (correct) {
      comboRef.current += 1;
      const points = 10 + Math.min(30, comboRef.current * 2);
      setScore((s) => s + points);
      setLastPoints({ val: points, good: true, id: Date.now() });
      setChapterProgress((p) => p + 1);
      launchConfetti();
    } else {
      comboRef.current = 0;
      setScore((s) => Math.max(0, s - 5));
      setLastPoints({ val: -5, good: false, id: Date.now() });
    }
    setCombo(comboRef.current);
    setCaughtCount((c) => c + 1);

    const fact = FACTS[caughtItem.label] || "This is interesting — learn more!";
    showFactCard(fact, correct);

    setCaughtItem(null);

    setTimeout(() => {
      if (chapterProgress + 1 >= chapter.targetsToPass) {
        if (chapterIndex < CHAPTERS.length - 1) {
          setChapterIndex((i) => i + 1);
          setChapterProgress(0);
          comboRef.current = 0;
          setCombo(0);
        } else {
          alert("Well done! You completed all chapters. 🎉");
        }
      }
    }, 300);
  }

  // fact card
  const [factCard, setFactCard] = useState(null);
  function showFactCard(text, correct) {
    setFactCard({ text, correct });
    setTimeout(() => setFactCard(null), 2200);
  }

  // confetti simple function (DOM based)
  function launchConfetti() {
    const root = confettiRef.current;
    if (!root) return;
    const count = 16;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.style.position = "absolute";
      el.style.left = `${displayedBoatXRef.current + randBetween(-40, 40)}px`;
      el.style.bottom = `${80 + randBetween(0, 40)}px`;
      el.style.width = `${randBetween(6, 12)}px`;
      el.style.height = `${randBetween(8, 14)}px`;
      el.style.background = ["#FFD166", "#06D6A0", "#118AB2", "#EF476F"][Math.floor(Math.random() * 4)];
      el.style.opacity = "0.95";
      el.style.borderRadius = "2px";
      el.style.pointerEvents = "none";
      el.style.transform = `rotate(${randBetween(0, 360)}deg)`;
      el.style.transition = "transform 900ms linear, bottom 900ms ease-out, left 900ms ease-out, opacity 700ms linear";
      root.appendChild(el);

      requestAnimationFrame(() => {
        el.style.bottom = `${200 + randBetween(40, 260)}px`;
        el.style.left = `${displayedBoatXRef.current + randBetween(-260, 260)}px`;
        el.style.transform = `rotate(${randBetween(80, 720)}deg)`;
        el.style.opacity = "0";
      });

      setTimeout(() => {
        try { root.removeChild(el); } catch (e) {}
      }, 1000);
    }
  }

  // render item
  function renderItem(it) {
    const left = clamp(it.x - 22, 8, containerW - 48);
    const style = {
      position: "absolute",
      left,
      bottom: it.y,
      width: 54,
      height: 54,
      borderRadius: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 6px 18px rgba(0,0,0,0.22)",
      transform: `rotate(${it.rot}deg)`,
      overflow: "hidden",
      zIndex: 25,
    };
    return (
      <div key={it.id} style={style} className="pointer-events-none">
        {it.img ? (
          <img src={it.img} alt={it.label} style={{ width: 44, height: 44, objectFit: "contain" }} draggable={false} />
        ) : (
          <div className="text-xs font-semibold text-white">{it.label}</div>
        )}
      </div>
    );
  }

  // small points toast
  const LastPointsToast = ({ p }) => {
    if (!p) return null;
    const cls = p.good ? "text-emerald-300" : "text-rose-300";
    return (
      <div className="absolute right-24 top-20 z-60 pointer-events-none">
        <div className={`px-3 py-2 rounded-lg bg-black/50 backdrop-blur text-white ${cls} font-bold animate-pop`}>
          {p.val > 0 ? `+${p.val}` : `${p.val}`}
        </div>
      </div>
    );
  };

  // compute boatLeft for render using displayedBoatX and boatWidth
  const boatWidth = Math.min(700, containerW * 0.8);
  const boatLeft = displayedBoatX - boatWidth / 2;
  // hook bottom position for render using displayedHookOffset
  const hookBottom = 40 + boatWidth * 0.22 - displayedHookOffset;

  // hook horizontal render position (fixed to rod)
  const hookRenderLeft = displayedBoatX - boatWidth / 2 + boatWidth * ROD_X_RATIO;

  return (
    <div
      ref={containerRef}
      className="w-full h-screen relative overflow-hidden select-none"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(6,21,50,0.6), rgba(3,9,28,0.6)), url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div ref={confettiRef} className="absolute inset-0 pointer-events-none z-70" />

      {/* top-left */}
      <div className="absolute left-6 top-6 z-60">
        <div className="bg-white/6 backdrop-blur-md rounded-2xl px-4 py-3 w-80 border border-white/8 shadow">
          <div className="font-extrabold text-lg text-white">{chapter?.title}</div>
          <div className="text-xs text-white/90 mt-1">{chapter?.lesson}</div>
          <div className="mt-3">
            <div className="text-xs text-white/80 mb-1">Chapter Progress</div>
            <div className="w-full h-3 bg-white/8 rounded-full overflow-hidden">
              <div
                style={{
                  width: `${Math.min(100, (chapterProgress / Math.max(1, chapter.targetsToPass)) * 100)}%`,
                  transition: "width 450ms ease",
                  height: "100%",
                  background: "linear-gradient(90deg,#4ade80,#06b6d4)",
                }}
              />
            </div>
            <div className="mt-2 text-xs text-white/80"> {chapterProgress}/{chapter.targetsToPass} targets</div>
          </div>
        </div>
      </div>

      {/* top-right HUD */}
      <div className="absolute right-6 top-6 z-60 text-right">
        <div className="bg-white/6 backdrop-blur-md rounded-2xl px-4 py-3 w-44 border border-white/8 shadow">
          <div className="text-xs text-white/80">Score</div>
          <div className="font-extrabold text-2xl text-white">{score}</div>
          <div className="mt-2 text-xs text-white/80">Caught: {caughtCount} • Combo: {combo}</div>
        </div>
      </div>

      {/* items */}
      {items.map((it) => renderItem(it))}

      {/* Boat (use left instead of transform to keep collision math simple) */}
      <img
        src={boatImg}
        alt="Boat"
        className="boat-image absolute bottom-[230px] z-50 select-none pointer-events-none"
        style={{
          left: boatLeft,
          bottom: 270,
          width: boatWidth,
          maxWidth: "20vw",
        }}
        draggable={false}
      />

      {/* Hook: attached to rod position on boat */}
      <div
        className="absolute right-30 bottom-10 z-50 pointer-events-auto"
        style={{
          left: hookRenderLeft,
          bottom: hookBottom,
          transform: "translateX(-50%)",
        }}
      >
        <div
          style={{
            width: 4,
            height: displayedHookOffset + 28,
            background: "linear-gradient(180deg, rgba(20,20,20,0.9), rgba(255,255,255,0.06))",
            borderRadius: 2,
            margin: "0 auto",
            boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
            transition: "height 60ms linear",
          }}
        />
        <img src={hookImg} alt="hook" style={{ width: 60, height: 60, objectFit: "contain", marginTop: -8 }} draggable={false} />
      </div>

      {/* controls */}
      <div className="absolute z-60 left-1/2 -translate-x-1/2 bottom-6 flex items-center gap-4">
        <button
          aria-label="Move left"
          onPointerDown={() => (keysRef.current.left = true)}
          onPointerUp={() => (keysRef.current.left = false)}
          onPointerLeave={() => (keysRef.current.left = false)}
          onClick={() => moveBoatBy(-120)}
          className="px-5 py-4 bg-white/10 text-white rounded-3xl backdrop-blur-lg shadow-lg text-2xl"
        >
          ◀
        </button>

        <button
          onClick={toggleCastRetract}
          className="px-6 py-4 bg-gradient-to-r from-emerald-400 to-cyan-500 text-white font-extrabold rounded-3xl shadow-2xl text-lg"
        >
          {hookTargetRef.current > 6 ? "Retract" : "Cast"}
        </button>

        <button
          aria-label="Move right"
          onPointerDown={() => (keysRef.current.right = true)}
          onPointerUp={() => (keysRef.current.right = false)}
          onPointerLeave={() => (keysRef.current.right = false)}
          onClick={() => moveBoatBy(120)}
          className="px-5 py-4 bg-white/10 text-white rounded-3xl backdrop-blur-lg shadow-lg text-2xl"
        >
          ▶
        </button>
      </div>

      {/* caught modal */}
      {caughtItem && (
        <div className="absolute inset-0 z-70 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-11/12 max-w-md text-center">
            <div className="flex items-center gap-3 justify-center">
              {caughtItem.img && <img src={caughtItem.img} alt={caughtItem.label} style={{ width: 64, height: 64 }} draggable={false} />}
              <div>
                <div className="font-bold text-xl">{caughtItem.label}</div>
                <div className="text-sm text-gray-600 mt-1">Which box does it belong to?</div>
              </div>
            </div>

            <div className="flex gap-4 mt-5">
              <button onClick={() => categorize("useful")} className="flex-1 p-4 rounded-xl bg-emerald-500 text-white font-bold text-lg shadow">Useful</button>
              <button onClick={() => categorize("harmful")} className="flex-1 p-4 rounded-xl bg-rose-500 text-white font-bold text-lg shadow">Harmful</button>
            </div>

            <div className="mt-4 text-xs text-gray-500">Tip: after you choose, a short fact will appear — learn while you play!</div>
          </div>
        </div>
      )}

      <LastPointsToast p={lastPoints} />

      {factCard && (
        <div className={`absolute left-1/2 -translate-x-1/2 top-28 z-80`}>
          <div className={`px-4 py-3 rounded-xl shadow-lg max-w-xl text-center ${factCard.correct ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
            <div className="font-bold">{factCard.correct ? "Nice!" : "A little tricky!"}</div>
            <div className="text-sm mt-1">{factCard.text}</div>
          </div>
        </div>
      )}

      {/* choices */}
      <div className="absolute left-6 bottom-6 text-white/90 z-60 text-sm max-w-sm">
        <div className="font-semibold mb-1">Recent</div>
        <div className="flex gap-2 mt-2 flex-wrap max-w-[360px]">
          {choices.slice(-6).map((c, i) => (
            <div key={i} className={`px-2 py-1 rounded text-xs ${c.correct ? "bg-emerald-600" : "bg-rose-600"}`}>{c.item}: {c.chosen}</div>
          ))}
        </div>
      </div>

      {/* chapter nav / exit */}
      <div className="absolute right-6 bottom-[530px] text-white/90 z-60 text-sm text-right">
        <div className="mb-2">Chapter {chapterIndex + 1} / {CHAPTERS.length}</div>
        <div className="flex gap-2 justify-end">
          <button onClick={() => chapterIndex > 0 && setChapterIndex((i) => i - 1)} className="px-3 py-2 bg-white/10 rounded">Prev</button>
          <button onClick={() => chapterIndex < CHAPTERS.length - 1 && setChapterIndex((i) => i + 1)} className="px-3 py-2 bg-white/10 rounded">Next</button>
          {onExit && <button onClick={onExit} className="px-3 py-2 ml-2 bg-red-600 rounded text-white">Exit</button>}
        </div>
      </div>

      {/* tutorial */}
      {showTutorial && (
        <div className="absolute inset-0 z-90 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl p-6 w-11/12 max-w-lg text-center">
            <div className="font-extrabold text-2xl mb-2">Welcome to the Water Cycle Game!</div>
            <div className="text-sm text-gray-700">Move the boat with ◀ ▶ or arrow/A/D keys. Press Cast to drop the hook. Catch items and sort them into Useful or Harmful boxes. Earn points and learn quick facts!</div>
            <div className="flex gap-3 justify-center mt-4">
              <button onClick={() => setShowTutorial(false)} className="px-5 py-2 bg-emerald-500 rounded text-white font-bold">Start Playing</button>
              <button onClick={() => { setShowTutorial(false); setChapterIndex(1); }} className="px-5 py-2 bg-gray-200 rounded">Skip to Chapter 2</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.85); opacity: 0 }
          60% { transform: scale(1.06); opacity: 1 }
          100% { transform: scale(1); opacity: 1 }
        }
        .animate-pop { animation: popIn 420ms cubic-bezier(.2,.9,.2,1); }
        .confetti-piece { will-change: transform, opacity; pointer-events:none; border-radius:2px; }
      `}</style>
    </div>
  );
}

/* LastPointsToast component defined outside to keep file readable */
function LastPointsToast({ p }) {
  if (!p) return null;
  const cls = p.good ? "text-emerald-300" : "text-rose-300";
  return (
    <div className="absolute right-24 top-20 z-60 pointer-events-none">
      <div className={`px-3 py-2 rounded-lg bg-black/50 backdrop-blur text-white ${cls} font-bold animate-pop`}>
        {p.val > 0 ? `+${p.val}` : `${p.val}`}
      </div>
    </div>
  );
}

// src/components/TreeGrow.jsx
import { doc, onSnapshot, runTransaction, serverTimestamp } from "firebase/firestore";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase/firebase";
// 👉 Import your 9 stage images
import treestage1 from "../assets/treestagee1.png";
import treestage2 from "../assets/treestagee2.png";
import treestage3 from "../assets/treestagee3.png";
import treestage4 from "../assets/treestagee3b.png";
import treestage5 from "../assets/treestagee3c.png";
import treestage6 from "../assets/treestagee4.png";
import treestage7 from "../assets/treestagee5.png";
import treestage8 from "../assets/treestagee6.png";
import treestage9 from "../assets/treestagee7.png";

// Array of all stage images
const STAGE_IMAGES = [
  treestage1,
  treestage2,
  treestage3,
  treestage4,
  treestage5,
  treestage6,
  treestage7,
  treestage8,
  treestage9,
];

// helper: YYYY-MM-DD (UTC)
function getTodayUTCString() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function TreeGrow({ size = 320, docPath = null }) {
  const [user] = useAuthState(auth);
  const [stage, setStage] = useState(1);
  const [loading, setLoading] = useState(true);
  const unsubRef = useRef(null);

  const imageCount = STAGE_IMAGES.length;

  // subscribe Firestore (or localStorage preview)
  useEffect(() => {
    let unsub = null;

    async function attach() {
      if (!user && !docPath) {
        const s = Number(localStorage.getItem("greenix_stage") || 1);
        setStage(Math.max(1, Math.min(imageCount, s)));
        setLoading(false);
        return;
      }

      const path = docPath || `users/${user.uid}`;
      const parts = path.split("/");
      try {
        const ref = doc(db, ...parts);
        unsub = onSnapshot(
          ref,
          (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              const st = Number(data.stage || 1);
              setStage(Math.max(1, Math.min(imageCount, st)));
            } else {
              setStage(1);
            }
            setLoading(false);
          },
          (err) => {
            console.error("TreeGrow snapshot error:", err);
            setLoading(false);
          }
        );
        unsubRef.current = unsub;
      } catch (err) {
        console.error("TreeGrow attach error:", err);
        setLoading(false);
      }
    }

    attach();
    return () => {
      if (unsubRef.current) unsubRef.current();
      if (unsub) unsub();
    };
  }, [user, docPath, imageCount]);

  // auto-increment stage per day
  useEffect(() => {
    if (!user && !docPath) return;

    const path = docPath || `users/${user.uid}`;
    const parts = path.split("/");
    const userRef = doc(db, ...parts);

    let cancelled = false;

    async function createOrAdvanceStage() {
      try {
        await runTransaction(db, async (transaction) => {
          const snap = await transaction.get(userRef);
          const today = getTodayUTCString();

          if (!snap.exists()) {
            transaction.set(userRef, {
              stage: 1,
              lastLoginDate: today,
              lastLoginAt: serverTimestamp(),
            });
            return;
          }

          const data = snap.data();
          const lastLoginDate = data.lastLoginDate || null;
          let currentStage = Number(data.stage || 1);

          if (lastLoginDate === today) {
            return; // already updated today
          }

          const nextStage = Math.min(imageCount, currentStage + 1);
          transaction.update(userRef, {
            stage: nextStage,
            lastLoginDate: today,
            lastLoginAt: serverTimestamp(),
          });
        });
      } catch (err) {
        console.error("TreeGrow transaction failed:", err);
      }
    }

    createOrAdvanceStage();

    function handleVisibility() {
      if (!cancelled && document.visibilityState === "visible") {
        createOrAdvanceStage();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [user, docPath, imageCount]);

  // preview mode controls
  function previewAdvance() {
    if (user || docPath) return;
    const today = getTodayUTCString();
    const last = localStorage.getItem("greenix_lastLoginDate");
    let st = Number(localStorage.getItem("greenix_stage") || 1);
    if (last !== today) {
      st = Math.min(imageCount, st + 1);
      localStorage.setItem("greenix_stage", String(st));
      localStorage.setItem("greenix_lastLoginDate", today);
      setStage(st);
    }
  }

  function previewReset() {
    if (user || docPath) return;
    localStorage.setItem("greenix_stage", "1");
    localStorage.setItem("greenix_lastLoginDate", getTodayUTCString());
    setStage(1);
  }

  // styles
  const wrapperStyle = {
    width: size,
    height: size,
    position: "relative",
    display: "inline-block",
  };
  const imgStyle = (visible) => ({
    position: "absolute",
    left: 0,
    top: 0,
    width: size,
    height: size,
    objectFit: "contain",
    transition: "opacity 500ms ease, transform 500ms ease",
    opacity: visible ? 1 : 0,
    transform: visible ? "scale(1)" : "scale(0.97)",
    pointerEvents: "none",
    userSelect: "none",
  });

  return (
    <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
      <div style={wrapperStyle} aria-hidden={loading}>
        {STAGE_IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`tree stage ${i + 1}`}
            style={imgStyle(i + 1 === stage)}
            draggable={false}
          />
        ))}
      </div>

      <div style={{ minWidth: 200 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Your Tree</div>
        <div style={{ marginTop: 6 }}>
          Stage: <strong>{stage}</strong> / {imageCount}
        </div>
        <div style={{ color: "#666", marginTop: 6 }}>
          {user ? "Signed in" : "Preview mode"}
        </div>

        {!user && !docPath && (
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <button onClick={previewAdvance}>Simulate Login</button>
            <button onClick={previewReset}>Reset</button>
          </div>
        )}

        {loading && <div style={{ marginTop: 8, color: "#999" }}>Loading...</div>}
      </div>
    </div>
  );
}

TreeGrow.propTypes = {
  size: PropTypes.number,
  docPath: PropTypes.string,
};

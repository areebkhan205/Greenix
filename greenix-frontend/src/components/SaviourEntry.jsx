// src/components/SaviourEntry.jsx
import { useEffect, useState } from "react";
import startBtn from "../assets/button122.png";
import laptopVideo from "../assets/Video_Generation_From_Slow_Movement.mp4";
import phoneBg from "../assets/water_saviour_waves_moving.gif";
import Gamepage from "./Gamepage123"; // <-- make sure this path/name matches your file

const SaviourEntry = () => {
  const [isLaptop, setIsLaptop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsLaptop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // fixed typo
  }, []);

  // When started, render Gamepage and pass onExit to return back
  if (started) return <Gamepage onExit={() => setStarted(false)} />;

  return (
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background */}
      {isLaptop ? (
        <video
          className="absolute inset-0 w-full h-full object-cover md:object-top"
          src={laptopVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{ transform: "translateZ(0)", willChange: "transform" }}
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center md:bg-top"
          style={{ backgroundImage: `url(${phoneBg})` }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/30" />

      {/* Content */}
      <div
        className={`relative z-10 w-full max-w-5xl flex flex-col items-center text-center px-4 gap-8 ${
          isLaptop ? "pt-[6vh]" : "justify-center"
        }`}
      >
        {/* START Button */}
        <button
          onClick={() => setStarted(true)}
          aria-label="Start Game"
          className="relative group focus:outline-none"
        >
          <img
            src={startBtn}
            alt="Start Button"
            className="
              w-40 md:w-60 
              transition-all duration-300 
              drop-shadow-[0_10px_25px_rgba(255,180,60,0.65)]
              group-hover:scale-110 group-hover:drop-shadow-[0_15px_35px_rgba(255,200,90,0.9)]
              group-active:scale-95 group-active:drop-shadow-[0_6px_12px_rgba(0,0,0,0.55)]
              animate-pulse-slow
            "
          />
        </button>
      </div>
    </div>
  );
};

export default SaviourEntry;

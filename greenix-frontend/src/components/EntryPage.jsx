// src/components/EntryPage.jsx
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import bg from "../assets/Background usp.jpeg";
import cloud2 from "../assets/cloud 2.gif";
import cloud1 from "../assets/cloud.gif";
import drizzle from "../assets/drizzle.gif";
import meteor from "../assets/meteor.gif";
import rocket from "../assets/rocket.gif";
import stone1 from "../assets/stone1.png";
import stone2 from "../assets/stone2.png";
import QuizPage from "./QuizPage.jsx"; // adjust if your QuizPage filename/path differs

export default function EntryPage() {
  const [launching, setLaunching] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => setLaunching(true);
  const handleExit = () => navigate("/");

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* 🚪 EXIT BUTTON (only visible once game starts) */}
      <AnimatePresence>
        {showQuiz && (
          <motion.button
            onClick={handleExit}
            className="absolute top-6 right-6 px-5 py-2 rounded-full 
                       bg-gradient-to-r from-red-500 to-pink-600 
                       text-white font-bold text-sm shadow-lg 
                       hover:shadow-red-500/40 hover:scale-110 
                       active:scale-95 transition-all duration-200 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            ✖ Exit Game
          </motion.button>
        )}
      </AnimatePresence>

      {/* ROCKET */}
      <motion.img
        src={rocket}
        alt="rocket"
        className={`w-[200px] mb-6 select-none ${launching ? "" : "animate-float"}`}
        initial={false}
        animate={launching ? { y: "-120vh", opacity: 0 } : { y: 0, opacity: 1 }}
        transition={launching ? { duration: 1.1, ease: [0.4, 0, 0.2, 1] } : {}}
        onAnimationComplete={() => {
          if (launching) setShowQuiz(true);
        }}
      />

      {/* TITLE + START BUTTON */}
      <AnimatePresence>
        {!launching && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
            className="flex flex-col items-center z-20"
          >
            <h1 className="text-6xl font-bruno text-white tracking-widest drop-shadow-lg text-center">
              Eco Warriors <br /> Knowledge Battle
            </h1>

            <button
              onClick={handleStart}
              className="mt-8 px-12 py-3 bg-white border-4 border-black 
                         shadow-[4px_4px_0px_#000] text-2xl font-bold 
                         hover:scale-110 transition-transform"
            >
              START
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUIZ BOX */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div
            key="quizbox"
            initial={{ opacity: 0, y: 40, scale: 0.98, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.98, filter: "blur(6px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full flex items-center justify-center z-10"
          >
            <div className="max-w-3xl w-[92%]">
              <QuizPage />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CLOUDS + DRIZZLE (kept exactly to preserve phone layout) */}
      <img src={cloud1} className="absolute left-5 top-10 sm:left-85 w-22 sm:h-[70px] animate-float-slow" alt="cloud1"/>
      <img src={cloud1} className="absolute bottom-10 sm:bottom-25 left-0 sm:left-95 w-22 sm:w-28 animate-float-slow" alt="cloud2"/>
      <img src={cloud2} className="absolute bottom-20 sm:bottom-45 right-1 sm:right-85 w-22 sm:w-32 animate-float-slow" alt="cloud3"/>
      <img src={cloud1} className="absolute bottom-5 right-40 sm:right-65 w-24 animate-float-slow" alt="cloud4"/>
      <img src={cloud1} className="absolute top-16 right-5 sm:right-78 h-[60px] animate-float-slow" alt="cloud5"/>
      <img src={drizzle} className="absolute top-40 sm:top-60 left-5 sm:left-80 h-[100px]" alt="drizzle1"/>
      <img src={drizzle} className="absolute bottom-32 left-[310px] sm:left-[220px] w-14 animate-float-slow" alt="drizzle2"/>
      <img src={drizzle} className="absolute top-40 left-[500px] sm:left-[700px] h-[100px]" alt="drizzle3"/>

      {/* METEORS + STONES — desktop/tablet repositioned, mobile untouched */}
      <AnimatePresence>
        {!launching && (
          <motion.div
            key="stones-meteors"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="z-0"
          >
            {/* LEFT meteor (desktop moved higher-left) */}
            <img
              src={meteor}
              alt="meteor-left"
              className="
                absolute top-10 left-30 h-[55px] animate-bounce rotate-[-20deg]
                sm:top-8 sm:left-8 sm:h-[70px]
                md:top-6 md:left-4 md:h-[84px]
                lg:top-10 lg:left-8
              "
            />

            {/* RIGHT meteor (desktop top-right) */}
            <img
              src={meteor}
              alt="meteor-right"
              className="
                absolute top-10 left-55 h-[55px] animate-bounce rotate-[20deg]
                sm:top-6 sm:left-auto sm:right-12 sm:h-[70px]
                md:top-4 md:right-8 md:h-[84px]
                lg:top-6 lg:right-12
              "
            />

            {/* LEFT stones cluster */}
            <img
              src={stone1}
              alt="stone-1-left"
              className="
                absolute top-32 left-10 w-12 animate-float-slow
                sm:top-28 sm:left-24 sm:w-14
                md:top-24 md:left-36 md:w-16
                lg:top-28 lg:left-44
              "
            />

            <img
              src={stone2}
              alt="stone-2-left"
              className="
                absolute top-52 left-15 w-11 animate-float-slow
                sm:top-46 sm:left-32 sm:w-12
                md:top-44 md:left-48 md:w-14
                lg:top-48 lg:left-56
              "
            />

            {/* RIGHT stones cluster (mirrored) */}
            <img
              src={stone1}
              alt="stone-1-right"
              className="
                absolute top-32 right-10 w-11 animate-float-slow
                sm:top-28 sm:right-24 sm:w-14
                md:top-24 md:right-36 md:w-16
                lg:top-28 lg:right-44
              "
            />
              <img
              src={drizzle}
              alt="stone-1-right"
              className="
                absolute top-32 right-10 w-11 animate-float-slow
                sm:top-28 sm:right-24 sm:w-14
                md:top-24 md:right-36 md:w-16
                lg:top-28 lg:right-44
              "
            />

            <img
              src={stone2}
              alt="stone-2-right"
              className="
                absolute top-52 right-15 w-11 animate-float-slow
                sm:top-46 sm:right-32 sm:w-12
                md:top-44 md:right-48 md:w-14
                lg:top-48 lg:right-56
              "
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* STARS */}
      <div className="absolute top-20 left-1/2 text-white text-xl animate-pulse">✦</div>
      <div className="absolute top-1/3 right-1/4 text-white text-sm animate-pulse">✦</div>
      <div className="absolute bottom-1/3 left-1/4 text-white text-lg animate-pulse">✦</div>
    </div>
  );
}

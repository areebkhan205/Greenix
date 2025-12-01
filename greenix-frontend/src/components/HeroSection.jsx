import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Landscape from "../assets/Adobe Express - file (5) 1.png"; // 3D island image
import CircleBg from "../assets/Ellipse 1.png"; // Green circle bg
import LearningQuest from "../assets/farmingquest.png"; // "Learning Quest" image

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-white px-6 lg:px-20">
      {/* Background Circle */}
      <img
        src={CircleBg}
        alt="circle background"
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] lg:w-[960px] h-[960px] opacity-80 pointer-events-none select-none"
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full">
        {/* Left Content */}
        <div className="flex flex-col items-start text-left max-w-lg">
          {/* Tag */}
          <span className="px-4 py-1 mb-4 mt-[300px] md:mt-0 rounded-lg bg-green-100 text-green-600 font-medium text-sm">
            Green🌿
          </span>

          {/* Heading (two stacked images) */}
          <div className="flex flex-col">
           
            <img
              src={LearningQuest}
              alt="Learning Quest"
              className="w-[300px] md:w-[450px] lg:w-[520px] h-auto"
            />
          </div>

          {/* Subtext */}
          <p className="text-gray-600 text-sm md:text-base mt-3">
            The most fun and beginner-friendly way to learn
          </p>

          {/* Buttons */}
          <div className="flex space-x-4 mt-6">
            <Link to={"/signup"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition-all"
            >
              Get Started
            </motion.button>
            </Link>
            

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-md border-2 border-green-600 text-green-600 font-semibold hover:bg-green-50 transition-all"
            >
              Services
            </motion.button>
          </div>
        </div>

        {/* Right Content (Island Image) */}
        <motion.img
          src={Landscape}
          alt="learning island"
          className="lg:mb-0 mb-40  lg:mt-0 lg:w-[995px] w-[700px] lg:h-[664px] h-[302px] animate-float-slow1 relative bottom-[10px] lg:bottom-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </section>
  );
}

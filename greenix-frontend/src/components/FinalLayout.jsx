import { useNavigate } from "react-router-dom";
import deerFeature from "../assets/2482-9d99-4f81-b680-74485e9fdb9c.mp4";
import chatbotFeature from "../assets/Bot_Movement_Video_Generation.mp4";
import bgFeatures from "../assets/features (3).png";
import rightHeading from "../assets/Group 7 (1).png";
import dividerLine from "../assets/Group 8 (1).png";
import explorerFeature from "../assets/Image_Movement_Video_Generation.mp4";
import dashboardBg from "../assets/Rectangle 6 (1).png";
import rocketFeature from "../assets/Rocket_Launch_Video_Generation.mp4";
import bottom from "../assets/shape bottom.png";
import top from "../assets/shape top (1).png";
import topHeading from "../assets/TOP (3).png";
// ← NEW: import the Weather + AQI card component
import WeatherAQI from "./WeatherAQI";

export default function FinalLayout() {
  const navigate = useNavigate();

  const items = [
    {
      src: rocketFeature,
      link: "/entry",
      type: "internal",
      title: "SpaceBattle",
      desc: "Launch into eco-space battles!",
    },
    {
      src: deerFeature,
      link: "/saviour",
      type: "internal",
      title: "WaterSaviour",
      desc: "Protect and conserve water.",
    },
    {
      src: explorerFeature,
      title: "EcoExplorer",
      desc: "Discover and save ecosystems.",
    },
    {
      src: chatbotFeature,
      link:"eco",
      title: "EcoBot",
      desc: "Chat with our AI EcoBot.",
    },
  ];

  // reliable click handler for card (internal/external)
  const handleClick = (item) => {
    if (!item.link) return;
    if (item.type === "internal") {
      navigate(item.link);
    } else {
      window.open(item.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="min-h-screen w-full overflow-hidden relative bg-white"
      style={{
        backgroundImage: `url(${bgFeatures})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "85%",
      }}
    >
      <div className="bg-attachment-fixed">
        <div className="flex flex-col lg:flex-row justify-center items-start gap-8 lg:gap-34 mt-16 relative z-4 px-4 lg:px-0">
          {/* Left side */}
          <div className="left-side w-full lg:w-auto flex-shrink-0">
            <div className="left-heading">
              <img
                src={topHeading}
                alt="Left Heading"
                className="w-full max-w-[480px] block mx-auto lg:mx-0"
              />
            </div>

            <div className="features mt-5 flex justify-center lg:justify-start">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-[520px] mt-10">
                {/* =========================
                    SpaceBattle Card (index 0)
                    ========================= */}
                <div className="flex flex-col items-center w-full">
                  <div
                    onClick={() => handleClick(items[0])}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === " ") && items[0].link) {
                        e.preventDefault();
                        handleClick(items[0]);
                      }
                    }}
                    role={items[0].link ? "button" : undefined}
                    tabIndex={items[0].link ? 0 : -1}
                    aria-label={
                      items[0].title + (items[0].link ? " (click to open)" : "")
                    }
                    className={`group relative w-full h-[160px] sm:h-[300px] md:h-[240px] rounded-xl overflow-hidden border-2 border-[#00c060] transform transition duration-300 hover:scale-105 hover:shadow-[0_12px_30px_rgba(0,200,100,0.25)] ${
                      items[0].link ? "cursor-pointer" : ""
                    }`}
                  >
                   <video
  src={items[0].src}
  autoPlay
  loop
  muted
  playsInline
  style={{
    display: "block",
    objectFit: "cover",
    objectPosition: "center",
  }}
  className="absolute inset-0 w-full h-full scale-[1.8] sm:scale-100"
 />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />
                    <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="bg-black/40 text-white text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                        {items[0].title}
                      </div>
                    </div>
                  </div>

                  <div className="w-[92%] -mt-3 bg-white/80 backdrop-blur-md rounded-lg shadow-sm p-2 text-center border border-green-100 transition duration-250 relative z-30">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-green-800 leading-tight">
                        {items[0].title}
                      </span>
                      {items[0].desc && (
                        <span className="text-xs text-gray-600 mt-0.5 leading-tight">
                          {items[0].desc}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* =========================
                    WaterSaviour Card (index 1)
                    ========================= */}
                <div className="flex flex-col items-center w-full">
                  <div
                    onClick={() => handleClick(items[1])}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === " ") && items[1].link) {
                        e.preventDefault();
                        handleClick(items[1]);
                      }
                    }}
                    role={items[1].link ? "button" : undefined}
                    tabIndex={items[1].link ? 0 : -1}
                    aria-label={
                      items[1].title + (items[1].link ? " (click to open)" : "")
                    }
                    className={`group relative w-full h-[180px] sm:h-[220px] md:h-[260px] rounded-xl overflow-hidden border-2 border-[#00c060] transform transition duration-300 hover:scale-105 hover:shadow-[0_12px_30px_rgba(0,200,100,0.25)] ${
                      items[1].link ? "cursor-pointer" : ""
                    }`}
                  >
                    <video
  src={items[1].src}
  autoPlay
  loop
  muted
  playsInline
  style={{
    display: "block",
    objectFit: "cover",
    objectPosition: "center",
  }}
  className="absolute inset-0 w-full h-full scale-[1.8] sm:scale-100"
 />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />
                    <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="bg-black/40 text-white text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                        {items[1].title}
                      </div>
                    </div>
                  </div>

                  <div className="w-[92%] -mt-3 bg-white/80 backdrop-blur-md rounded-lg shadow-sm p-2 text-center border border-green-100 transition duration-250 relative z-30">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-green-800 leading-tight">
                        {items[1].title}
                      </span>
                      {items[1].desc && (
                        <span className="text-xs text-gray-600 mt-0.5 leading-tight">
                          {items[1].desc}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* =========================
                    EcoExplorer Card (index 2)
                    ========================= */}
                <div className="flex flex-col items-center w-full">
                  <div
                    onClick={() => handleClick(items[2])}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === " ") && items[2].link) {
                        e.preventDefault();
                        handleClick(items[2]);
                      }
                    }}
                    role={items[2].link ? "button" : undefined}
                    tabIndex={items[2].link ? 0 : -1}
                    aria-label={
                      items[2].title + (items[2].link ? " (click to open)" : "")
                    }
                    className={`group relative w-full h-[150px] sm:h-[190px] md:h-[220px] rounded-xl overflow-hidden border-2 border-[#00c060] transform transition duration-300 hover:scale-105 hover:shadow-[0_12px_30px_rgba(0,200,100,0.25)] ${
                      items[2].link ? "cursor-pointer" : ""
                    }`}
                  >
                    <video
  src={items[2].src}
  autoPlay
  loop
  muted
  playsInline
  style={{
    display: "block",
    objectFit: "cover",
    objectPosition: "center",
  }}
  className="absolute inset-0 w-full h-full scale-[1.8] sm:scale-100"
 />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />
                    <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="bg-black/40 text-white text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                        {items[2].title}
                      </div>
                    </div>
                  </div>

                  <div className="w-[92%] -mt-3 bg-white/80 backdrop-blur-md rounded-lg shadow-sm p-2 text-center border border-green-100 transition duration-250 relative z-30">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-green-800 leading-tight">
                        {items[2].title}
                      </span>
                      {items[2].desc && (
                        <span className="text-xs text-gray-600 mt-0.5 leading-tight">
                          {items[2].desc}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* =========================
                    EcoBot Card (index 3)
                    ========================= */}
                <div className="flex flex-col items-center w-full">
                  <div
                    onClick={() => handleClick(items[3])}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === " ") && items[3].link) {
                        e.preventDefault();
                        handleClick(items[3]);
                      }
                    }}
                    role={items[3].link ? "button" : undefined}
                    tabIndex={items[3].link ? 0 : -1}
                    aria-label={
                      items[3].title + (items[3].link ? " (click to open)" : "")
                    }
                    className={`group relative w-full h-[170px] sm:h-[210px] md:h-[240px] rounded-xl overflow-hidden border-2 border-[#00c060] transform transition duration-300 hover:scale-105 hover:shadow-[0_12px_30px_rgba(0,200,100,0.25)] ${
                      items[3].link ? "cursor-pointer" : ""
                    }`}
                  >
                    <video
  src={items[3].src}
  autoPlay
  loop
  muted
  playsInline
  style={{
    display: "block",
    objectFit: "cover",
    objectPosition: "center",
  }}
  className="absolute inset-0 w-full h-full scale-[1.8] sm:scale-100"
 />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />
                    <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="bg-black/40 text-white text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                        {items[3].title}
                      </div>
                    </div>
                  </div>

                  <div className="w-[92%] -mt-3 bg-white/80 backdrop-blur-md rounded-lg shadow-sm p-2 text-center border border-green-100 transition duration-250 relative z-30">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-green-800 leading-tight">
                        {items[3].title}
                      </span>
                      {items[3].desc && (
                        <span className="text-xs text-gray-600 mt-0.5 leading-tight">
                          {items[3].desc}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* End cards */}
              </div>
            </div>
          </div>

          <img
            src={dividerLine}
            alt="Divider"
            className="hidden lg:block w-1.5 mt-16 h-auto relative z-4"
          />

          {/* Right side */}
          <div className="right-side w-full lg:w-auto mt-8 lg:mt-12 flex-shrink-0">
            <img
              src={top}
              alt="Right Heading"
              className="w-full max-w-[480px] mx-auto lg:mx-0 lg:relative lg:bottom-[94px] lg:right-[144px] z-1"
            />

            <div className="right-heading mt-4 relative md:bottom-0 bottom-[178px]">
              <img
                src={rightHeading}
                alt="Right Heading"
                className="w-full max-w-[480px] mx-auto lg:mx-0 lg:relative lg:bottom-[284px] z-3"
              />
            </div>

            {/* Dashboard Section — REPLACED placeholder with WeatherAQI */}
            <div className="dashboard mt-8 lg:mt-12 ml-0 lg:ml-6 relative bottom-[150px] lg:bottom-[309px] w-full max-w-[450px] h-[350px] mx-auto lg:mx-0">
              <img
                src={dashboardBg}
                alt="Dashboard Background"
                className="absolute top-[74px] md:-top-3 -left-3 w-[calc(100%+30px)] md:h-[calc(100%+30px)] h-[380px]  object-contain z-6"
              />
              {/* hide decorative bottom shape on small screens so it doesn't overlap captions */}
              <img
                src={bottom}
                alt="Dashboard Background"
                className="absolute top-[220px] md:top-[170px] right-[23px] w-[calc(100%+30px)] h-[calc(100%+30px)] object-contain z-3 hidden sm:block"
              />

              <div className="absolute top-[90px] md:top-2 left-5 right-5 bottom-[60px] md:bottom-5 z-20 transform transition duration-500 hover:scale-105 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(0,200,100,0.25)] rounded-xl">
                {/* ← place WeatherAQI here. Responsive sizing so mobile fits */}
                <div className="p-0 md:p-2 md:w-full md:h-full w-full sm:w-[320px] h-[260px] ">
                  <WeatherAQI refreshMinutes={5} defaultCity="Mumbai" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

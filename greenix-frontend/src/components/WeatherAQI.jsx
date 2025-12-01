import { useEffect, useRef, useState } from "react";
import SunCloudPng from "../assets/aqicloudsun.png"; // place your PNG at src/assets/aqicloudsun.png

const OWM_KEY = import.meta.env.VITE_OWM_API_KEY || "";

/* --- Simple AQI labels/advice for kids --- */
function aqiLabelAndAdvice(aqi) {
  const map = {
    1: { label: "Good", tone: "emerald", advice: "Air is clean. Play outside!" },
    2: { label: "Fair", tone: "cyan", advice: "Air is okay. You can play." },
    3: { label: "Moderate", tone: "yellow", advice: "A little smoky — take it easy." },
    4: { label: "Poor", tone: "orange", advice: "Not great — better stay inside." },
    5: { label: "Very Poor", tone: "rose", advice: "Air is bad — stay indoors." },
  };
  return map[aqi] || { label: "Unknown", tone: "slate", advice: "No info yet." };
}

function formatTemp(kelvin, unit = "C") {
  if (kelvin == null) return "—";
  if (unit === "C") return `${Math.round(kelvin - 273.15)}°C`;
  if (unit === "F") return `${Math.round((kelvin - 273.15) * (9 / 5) + 32)}°F`;
  return `${kelvin}K`;
}

/* --- Child-friendly scene: PNG --- */
function Scene() {
  return (
    <div className="w-28 h-28 flex items-center justify-center">
      <img
        src={SunCloudPng}
        alt="sun and cloud"
        className="w-24 h-24 object-contain"
      />
    </div>
  );
}

export default function WeatherAQI({ refreshMinutes = 5, defaultCity = "" }) {
  const [coords, setCoords] = useState(null);
  const [city, setCity] = useState(defaultCity || "");
  const [weather, setWeather] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("C");

  const abortRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => {},
        { maximumAge: 5 * 60 * 1000, timeout: 8000 }
      );
    }
  }, []);

  async function fetchData({ lat, lon, q } = {}) {
    if (!OWM_KEY) {
      setError("Missing OpenWeatherMap API key.");
      return;
    }

    setLoading(true);
    setError(null);
    abortRef.current?.abort?.();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      let usedCoords = typeof lat === "number" && typeof lon === "number" ? { lat, lon } : null;
      if (!usedCoords && coords) usedCoords = coords;

      if (!usedCoords && (q || city)) {
        const cityName = q || city;
        const cityRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${OWM_KEY}`,
          { signal: controller.signal }
        );
        if (!cityRes.ok) throw new Error("City lookup failed");
        const cityJson = await cityRes.json();
        usedCoords = { lat: cityJson.coord.lat, lon: cityJson.coord.lon };
      }

      if (!usedCoords) throw new Error("No coordinates. Allow location or type a city.");

      const [weatherResp, aqiResp] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${usedCoords.lat}&lon=${usedCoords.lon}&appid=${OWM_KEY}`, { signal: controller.signal }),
        fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${usedCoords.lat}&lon=${usedCoords.lon}&appid=${OWM_KEY}`, { signal: controller.signal }),
      ]);

      if (!weatherResp.ok) throw new Error(`Weather fetch failed (${weatherResp.status})`);
      if (!aqiResp.ok) throw new Error(`AQI fetch failed (${aqiResp.status})`);

      const wJson = await weatherResp.json();
      const aJson = await aqiResp.json();

      setWeather(wJson);
      const aqiValue = aJson?.list?.[0]?.main?.aqi ?? null;
      const components = aJson?.list?.[0]?.components ?? null;
      setAqi({ aqi: aqiValue, components });
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("WeatherAQI error:", err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData({});
    const minutes = Math.max(1, Number(refreshMinutes) || 5);
    intervalRef.current = setInterval(() => fetchData({}), minutes * 60 * 1000);

    return () => {
      clearInterval(intervalRef.current);
      abortRef.current?.abort?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords, refreshMinutes, city]);

  const aqiInfo = aqi ? aqiLabelAndAdvice(aqi.aqi) : null;
  const temp = weather ? formatTemp(weather.main?.temp, unit) : "—";

  const toneToBg = {
    emerald: "bg-emerald-600",
    cyan: "bg-cyan-600",
    yellow: "bg-yellow-500",
    orange: "bg-orange-600",
    rose: "bg-rose-600",
    slate: "bg-slate-600",
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        className="relative p-3 rounded-xl h-[295px] right-[9px] top-[8px] shadow-md"
        style={{ backgroundColor: "#C4EAFD" }} // ✅ overall background
      >
        <div className="relative z-10">
          {/* header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-slate-700">Live AQI</div>
              <div className="text-base font-bold text-slate-800">{weather?.name || city || "Unknown"}</div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => fetchData({})}
                title="Refresh"
                className="px-2 py-0.5 rounded-md bg-white/50 hover:bg-white/70 text-slate-800 text-xs"
              >
                ⟳
              </button>
              <button
                onClick={() => setUnit((u) => (u === "C" ? "F" : "C"))}
                title="Toggle unit"
                className="px-2 py-0.5 rounded-md bg-gradient-to-br from-emerald-400 to-cyan-400 text-white text-xs"
              >
                °{unit}
              </button>
            </div>
          </div>

          {/* main: larger image, temperature, AQI */}
          <div className="grid grid-cols-2 gap-2 items-center">
            <div className="flex items-center gap-3">
              <Scene />
              <div>
                <div className="text-2xl font-bold text-slate-800 leading-none">{temp}</div>
                <div className="text-[13px] text-slate-700">Temperature</div>
              </div>
            </div>

            <div className="flex flex-col relative top-[50px] items-end">
              {loading ? (
                <div className="text-xs text-slate-700">Loading…</div>
              ) : error ? (
                <div className="text-xs text-rose-600">{error}</div>
              ) : aqiInfo ? (
                <>
                  <div className={`px-3 py-1.5 rounded-full text-[13px] font-semibold relative uppercase tracking-wider text-white ${toneToBg[aqiInfo.tone] || "bg-slate-600"}`}>
                    AQI — {aqiInfo.label}
                  </div>
                  <div className="mt-2 text-[12px] text-slate-700 max-w-[160px] text-right leading-snug">{aqiInfo.advice}</div>
                </>
              ) : (
                <div className="text-xs text-slate-700">AQI unavailable</div>
              )}
            </div>
          </div>

          <div className="mt-3 flex relative top-[74px] items-center justify-between text-[11px] text-slate-600">
            <div>Updated: {weather ? new Date(weather.dt * 1000).toLocaleTimeString() : "—"}</div>
            <div className="italic">Source: OpenWeatherMap</div>
          </div>
        </div>
      </div>
    </div>
  );
}

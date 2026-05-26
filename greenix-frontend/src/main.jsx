import { ReactLenis } from "@studio-freight/react-lenis";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext";
import App from "./App";
import "./index.css";
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
       
    <ReactLenis
      root
      options={{
        duration: 1.6,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        smooth: true,
        direction: "vertical",
        wheelMultiplier: 1.6,
        touchMultiplier: 2.4,
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReactLenis>
    </AuthProvider>
   
  </React.StrictMode>
);

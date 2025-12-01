// src/components/LenisScrollToTop.jsx
import { useLenis } from "@studio-freight/react-lenis";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Lenisscroll() {
  const lenis = useLenis();
  const { pathname } = useLocation();

  useEffect(() => {
    if (lenis && typeof lenis.scrollTo === "function") {
      // smooth scroll to top using Lenis; change duration if you like
      lenis.scrollTo(0, { duration: 1 });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
}

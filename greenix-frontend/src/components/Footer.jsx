// Footer.jsx
import { Facebook, Instagram, Linkedin } from "lucide-react";
import Ellipse from "../assets/Ellipse.png"; // or .svg
import Logo from "../assets/Logo.png";

export default function Footer({
  brandTagline = "Where growth begins...",
  social = { linkedin: "#", instagram: "#", facebook: "#" },
}) {
  const year = new Date().getFullYear();

  const socialBtn =
    "flex h-9 w-9 items-center justify-center rounded-full border border-[#33AC33] text-[#33AC33] transition-all duration-300 hover:-translate-y-0.5 hover:scale-110 hover:bg-[#33AC33] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#33AC33]/60 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100";

  const linkBase =
    "text-sm text-[#1b1b1b] hover:text-[#33AC33] hover:underline underline-offset-4 transition-colors";

  return (
    <footer className="w-full relative overflow-hidden flex flex-col justify-between bg-[radial-gradient(circle_at_center,_#e9f8e9_0%,_#ffffff_75%)] px-6 sm:px-10 lg:px-20 pt-7">
      {/* Decorative ellipse */}
      <img
        src={Ellipse}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 top-16 w-[1200px] max-w-none opacity-70 z-0"
      />

      {/* Full-bleed top green line */}
      <hr
        aria-hidden="true"
        className="-mx-6 sm:-mx-10 lg:-mx-20 mb-8 border-0 border-t-2 border-[#33AC33] z-10"
      />

      <div className="z-10 flex flex-wrap items-start justify-between gap-8">
        {/* Logo + tagline */}
        <div className="flex flex-col min-w-[160px]">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Greenix logo" className="h-10 object-contain" />
          </div>
          <span className="mt-1 text-xs italic text-[#1b1b1b]/70">
            {brandTagline}
          </span>
        </div>

        {/* Link groups */}
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-12 gap-y-6 lg:gap-x-24"
        >
          <div>
            <h4 className="mb-2 font-semibold text-[#1b1b1b]">Features</h4>
            <ul className="m-0 list-none space-y-1.5 p-0   opacity-70">
              <li><a href="#" className={linkBase}>Overview</a></li>
              <li><a href="#" className={linkBase}>Roadmap</a></li>
              <li><a href="#" className={linkBase}>Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-[#1b1b1b]">Learn</h4>
            <ul className="m-0 list-none  opacity-70 space-y-1.5 p-0">
              <li><a href="#" className={linkBase}>Docs</a></li>
              <li><a href="#" className={linkBase}>Guides</a></li>
              <li><a href="#" className={linkBase}>Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-[#1b1b1b]">Services</h4>
            <ul className="m-0 list-none  opacity-70 space-y-1.5 p-0">
              <li><a href="#" className={linkBase}>Consulting</a></li>
              <li><a href="#" className={linkBase}>Support</a></li>
              <li><a href="#" className={linkBase}>Integrations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-[#1b1b1b]">Legal</h4>
            <ul className="m-0 list-none  opacity-70 space-y-1.5 p-0">
              <li><a href="#" className={linkBase}>Contact</a></li>
              <li><a href="#" className={linkBase}>Terms &amp; Conditions</a></li>
              <li><a href="#" className={linkBase}>Privacy</a></li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Social */}
      <div className="z-10 flex justify-end py-5">
        <div className="flex gap-4">
          <a
            href={social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className={socialBtn}
            title="LinkedIn"
          >
            <Linkedin className="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            href={social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className={socialBtn}
            title="Instagram"
          >
            <Instagram className="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            href={social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className={socialBtn}
            title="Facebook"
          >
            <Facebook className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Full-bleed bottom bar */}
      <div className="-mx-6 sm:-mx-10 lg:-mx-20 bg-[#33AC33] py-3 text-center text-sm text-white z-10">
        © {year}, Greenix.inc
      </div>
    </footer>
  );
}

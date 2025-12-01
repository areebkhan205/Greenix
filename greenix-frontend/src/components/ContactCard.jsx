import { motion } from "framer-motion";
import { useState } from "react";
import bg from "../assets/5147051_2718028 1.png"; // decorative background with shapes
import A from "../assets/A.png";
import rightIllustration from "../assets/main.png"; // tree + boy illustration

export default function ContactCard() {
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [quote, setQuote] = useState("");

  const cardAnim = {
    hidden: { opacity: 0, y: 24, scale: 0.99 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: "easeOut" } },
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    const form = e.target;
    const formData = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { Accept: "application/json" },
      });
      const json = await res.json();
      if (res.ok || json.success) {
        setStatus("success");
        form.reset();
        const quotes = [
          "🌱 Every small step plants the seed of a brighter tomorrow.",
          "✨ Your voice matters — thank you for reaching out!",
          "🌍 Together we grow greener and stronger.",
          "💡 Connection sparks change — glad you connected with us!",
          "🌸 Messages are like seeds; they bloom when shared."
        ];
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      } else setStatus("error");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
      setTimeout(() => setStatus(null), 6000);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-start justify-center overflow-hidden bg-white">
      {/* BACKGROUND SHAPES */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-10 mt-25 w-full px-6 sm:px-8 md:px-12 lg:px-20">
        <div className="mx-auto  md:w-full w-[300px] max-w-[1200px] flex items-start justify-between relative gap-6">
          {/* FORM (keeps pill inputs like your original) */}
          <motion.div
            variants={cardAnim}
            initial="hidden"
            animate="show"
            className="relative md:top-[113px] top-[-29px]  md:left-[204px] left-2 w-full max-w-[570px] p-8 rounded-2xl  border border-[rgba(0,0,0,0.03)]"
          >
            <h3 className="text-center text-2xl sm:text-2xl font-extrabold tracking-wide mb-6 text-gray-800">
              CONTACT
            </h3>

            <form
              action="https://api.web3forms.com/submit"
              method="POST"
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="access_key" value="4ddd6372-81c5-445d-90c3-35110dd6deed" />

              <input
                name="name"
                placeholder="Your Name"
                required
                className="w-full rounded-full px-2 py-2 placeholder-gray-500 bg-[rgba(216,255,223,0.95)] border border-[rgba(0,0,0,0.04)] shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
              />

              <input
                name="email"
                type="email"
                placeholder="E-Mail"
                required
                className="w-full rounded-full px-6 py-3 placeholder-gray-500 bg-[rgba(216,255,223,0.95)] border border-[rgba(0,0,0,0.04)] shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
              />

              <textarea
                name="message"
                placeholder="Message"
                rows={5}
                required
                className="w-full rounded-2xl px-5 py-3 placeholder-gray-500 bg-[rgba(216,255,223,0.95)] border border-[rgba(0,0,0,0.04)] shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 transition resize-none"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="w-full mt-1 inline-block rounded-full bg-emerald-500 text-white py-3 font-semibold shadow-md hover:bg-emerald-600 transition disabled:opacity-60"
              >
                {submitting ? "Sending..." : "SEND MESSAGE"}
              </motion.button>

              <div aria-live="polite" className="h-auto text-center mt-3">
                {status === "success" && <p className="text-sm text-green-700 font-medium">{quote}</p>}
                {status === "error" && <p className="text-sm text-red-600">⚠️ Submission failed — try again.</p>}
              </div>
            </form>
          </motion.div>
<img src={A}  className="absolute md:left-[675px] left-[-90px] md:top-[83px] top-[6px]"  />
          {/* RIGHT-SIDE TREE + BOY ILLUSTRATION */}
          <motion.img
            src={rightIllustration}
            alt="tree-boy-illustration"
            className="hidden md:block pointer-events-none select-none"
            style={{
              width: 382,
              height: "auto",
              position: "relative",
              top: 171,
              right: 173, // push image outside to overlap card like your screenshot
              marginLeft: -28,
            }}
          />
        </div>
      </div>
    </div>
  );
}

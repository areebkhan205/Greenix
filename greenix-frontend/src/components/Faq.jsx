// FAQHero.jsx
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import ellipse from "../assets/Ellipse2a.png"; // your exported Ellipse image
import model from "../assets/model.png"; // your island artwork

/* Motion variants */
const listVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };
const answerVariants = {
  hidden: { height: 0, opacity: 0 },
  show: { height: "auto", opacity: 1, transition: { type: "spring", stiffness: 260, damping: 30 } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.26 } },
};

/* FAQ card */
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className={`faq-item ${open ? "active" : ""} relative transition-transform duration-200`}
      variants={itemVariants}
      initial="hidden"
      animate="show"
      layout
      onClick={() => setOpen((s) => !s)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((s) => !s);
        }
      }}
      aria-expanded={open}
    >
      <div className="relative z-10 flex items-center justify-between gap-4 text-slate-900 font-medium text-sm md:text-base faq-question">
        <span>{question}</span>
        <motion.svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="text-green-600"
        >
          <path d="M7 10l5 5 5-5z" fill="currentColor" />
        </motion.svg>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="faq-answer mt-3 text-sm text-slate-700"
            variants={answerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            layout
          >
            <div className="pt-1">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* Main component */
export default function FAQHero() {
  const faqs = [
    {
      question: "Can I learn at my own pace?",
      answer:
        "Yes. Each lesson is split into short, focused modules so you can stop and resume without losing context. The platform tracks which modules you've completed, and you can retake any lesson or quiz as many times as you want. This makes it easy to fit learning into busy schedules — study 10 minutes at a time or do a longer session when you have time.",
    },
    {
      question: "Do I need prior knowledge to get started?",
      answer:
        "No prior knowledge is required. We start with foundational concepts and explain terms with clear examples and visuals. Lessons build gradually: once you’re comfortable with the basics, later modules introduce slightly more advanced ideas. If you ever feel lost, reference material and short recap sections are available for review.",
    },
    {
      question: "Is it only for kids or can adults play too?",
      answer:
        "Both. The experience is designed to be family-friendly and accessible, but the content and difficulty can suit older learners as well. Activities focus on understanding, not just entertainment — adults will find meaningful content and practical takeaways while kids benefit from gamified interactions and clear, bite-sized explanations.",
    },
    {
      question: "What rewards do I get for playing and what do they mean?",
      answer:
        "Rewards include points, badges, and achievement tiers. Points reflect activity and correct answers, badges mark specific milestones (for example: completing a module, acing a quiz, or keeping a learning streak), and tiers show overall progress. These rewards are designed to motivate learning — they represent mastery of content, not just time spent — and can be displayed on your profile.",
    },
    {
      question: "Is my progress saved and can I continue on another device?",
      answer:
        "Yes. When you create an account and sign in, your progress, earned badges, and settings are synced to your profile. This means you can start on one device and continue on another with the same state. Some offline content may be available locally, but syncing and leaderboards require an internet connection so changes are stored centrally.",
    },
  ];

  return (
    <section className="container" aria-labelledby="faq-title">
      {/* LEFT visual group: ellipse rendered as an <img> so it keeps its original exported size */}
      <div className="ellipse " aria-hidden>
        <img src={ellipse} alt="ellipse" className="ellipse-img relative righ-[100px] " draggable={false} />
        <img src={model} alt="island" className="island animate-float-slow1" draggable={false} />
      </div>

      {/* RIGHT: FAQ area */}
      <div className="faq-section" role="region" aria-labelledby="faq-title">
        <h1 id="faq-title">Frequently Asked Questions</h1>

        <div className="faq-list" role="list">
          {faqs.map((f, i) => (
            <FAQItem key={i} question={f.question} answer={f.answer} />
          ))}
        </div>
      </div>

      <style>{`
        :root{
          --bg1: #fbfff9;
          --card-gradient: linear-gradient(90deg, #ffffff, #E8FEE8);
          --shadow: 0 8px 18px rgba(12,16,20,0.08);
          --radius: 12px;
        }
        *{box-sizing:border-box}
        html,body,#root{height:100%}
        body{
          margin:0;
          height:100vh;
          overflow:hidden;
          font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif;
          background: linear-gradient(180deg, var(--bg1), #ffffff 60%);
          color:#051217;
        }

        .container {
          position: relative;
          width: 100%;
          height: 100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:36px;
          padding:20px;
        }

        .ellipse {
          position: relative;
          right:130px;
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:0;
          pointer-events:none;
        }
        .ellipse-img{
          display:block;
          width:auto;
          height:auto;
          user-select:none;
          pointer-events:none;
        }

        .island{
          position: absolute;
          width: auto;
          max-width: 153%;
          height: auto;
          left: -87px;
          top: -77px;
          z-index:1;
          pointer-events:none;
          user-select:none;
          filter: drop-shadow(0 24px 30px rgba(12,20,12,0.08));
        }

        .faq-section{
          flex: 0 0 min(44vw, 620px);
          max-width:620px;
          height: min(76vh, 620px);
          display:flex;
          flex-direction:column;
          justify-content:center;
          gap:12px;
          padding: 12px 18px;
          z-index:3;
        }

        .faq-section h1{
          margin:0;
          font-size: clamp(20px, 2.4vw, 28px);
          font-weight:600;
          color:#051217;
          padding-left:6px;
        }

        .faq-list{
          display:flex;
          flex-direction:column;
          gap:12px;
          overflow:hidden;
          padding-right:4px;
        }

        /* --- ORIGINAL / SIMPLE BOX STYLES (restored) --- */
        .faq-item{
          background: var(--card-gradient);
          border-radius: var(--radius);
          padding: 12px 16px;
          box-shadow: var(--shadow);
          cursor:pointer;
          transition: transform .18s ease, box-shadow .18s ease;
          display:flex;
          flex-direction:column;
          gap:8px;
        }

        .faq-item:hover{ transform: translateY(-4px); box-shadow: 0 16px 28px rgba(12,16,20,0.08); }

        .faq-question{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          font-size: clamp(15px, 1.6vw, 18px);
          font-weight:600;
          color:#051217;
        }

        .faq-answer{
          max-height:0;
          overflow:hidden;
          transition: max-height .35s ease, opacity .28s ease;
          opacity:0;
          font-size: clamp(13px, 1.2vw, 15px);
          color:#183036;
          margin-top:0;
        }

        .faq-item.active .faq-answer{
          max-height:160px;
          opacity:1;
          margin-top:6px;
        }

        .faq-item svg{ transition: transform .25s ease; }
        .faq-item.active svg{ transform: rotate(180deg); }

        .faq-item:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(34,197,94,0.08);
          transform: translateY(-4px);
        }

        @media (max-width:980px){
          body{ overflow:auto }
          .container{
            flex-direction:column-reverse;
            align-items:flex-start;
            padding:12px;
            gap:18px;
          }
          .ellipse{ order:0; width: min(76vw, 520px); height: min(76vw,520px);  }
          .island{ position:relative; transform:none; left:0; top:0; width:100%; max-width:520px; }
          .faq-section{ order:1; width:100%; max-width:100%; height:auto; padding:6px 10px; }
          .faq-list{ overflow:visible; gap:10px; }
        }
      `}</style>
    </section>
  );
}

import {
    BarChart3,
    Bell,
    Bot,
    ChevronRight,
    CloudSun,
    Leaf,
    Mic,
    MicOff,
    MoreVertical,
    Paperclip,
    Plus,
    Send,
    TrendingUp,
    Trophy,
    User,
    X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import gloat from "../assets/file1.png";


// Globe asset URL


// --- Configuration ---
const apiKey = "AIzaSyB7He0B3SRensGo1mx-INjjqel1QtMiBG4"; // Provided by environment at runtime
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";

const Ecobot = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'bot', 
      text: "Welcome back to your farm, Pioneer! 👩‍🌾 Your organic carrots in the North Field are bursting with nutrients and ready for harvest! 🥕", 
      time: "09:41 AM" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState('English'); // Toggle state: English or Hindi
  const [attachedFile, setAttachedFile] = useState(null); // File state
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'English' ? 'Hindi' : 'English');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedFile({
          name: file.name,
          type: file.type,
          preview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const startVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.lang = language === 'English' ? 'en-US' : 'hi-IN';
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const fetchGeminiResponse = async (userQuery) => {
    const systemPrompt = `You are Ecobot, a professional AI assistant specialized in agriculture and ecology.
    The user is currently speaking in ${language}. 
    Please respond ENTIRELY in ${language}. If the language is Hindi, use Devanagari script.
    Tone: Friendly, expert, and encouraging.
    Use farm-related emojis (🌱, 🚜, 📉, 🥕).`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
          })
        }
      );
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Syncing data...";
    } catch (err) {
      return "Connection error. Please try again.";
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() && !attachedFile) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: input,
      file: attachedFile,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachedFile(null);
    setIsTyping(true);

    const botText = await fetchGeminiResponse(input || "Analyzing the attached file...");
    
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      role: 'bot',
      text: botText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setIsTyping(false);
  };

  const quickActions = [
    { label: 'Suggest Crop', icon: <Leaf size={14} />, query: "Suggest crop rotation options." },
    { label: 'Weather Report', icon: <CloudSun size={14} />, query: "What is the weather today?" },
    { label: 'Market Prices', icon: <TrendingUp size={14} />, query: "What are the latest crop prices?" },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] text-slate-800 font-sans overflow-hidden">
      {/* --- Global Header --- */}
      <header className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-100 z-50 shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg">
            <Leaf className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">Greenix</h1>
            <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Eco-Friendly World</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-green-600 relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div className="w-9 h-9 bg-amber-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
            <User size={20} className="text-amber-600" />
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* --- Left Sidebar --- */}
        <aside className="w-72 p-6 hidden lg:flex flex-col gap-6 shrink-0 bg-white border-r border-gray-100">
          <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Quests</h2>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-green-600 uppercase mb-1">Level 12 Challenge</p>
            <h3 className="font-bold text-gray-800 text-base">Organic Masterpiece</h3>
            <div className="w-full bg-green-200/50 h-2 rounded-full overflow-hidden mt-3 mb-2">
              <div className="bg-green-500 h-full w-[65%] rounded-full transition-all duration-1000"></div>
            </div>
            <p className="text-[11px] text-green-700 font-bold opacity-80 uppercase">13/20 Carrots Harvested</p>
          </div>
        </aside>

        {/* --- Center: Chat Interface --- */}
        <section className="flex-1 flex flex-col bg-white relative overflow-hidden">
          
          {/* Globe Background per Figma Specs */}
          <div 
            className="absolute pointer-events-none select-none z-0 overflow-visible"
            style={{ 
              top: '40px', 
              left: '-114px', 
              width: '1127px', 
              height: '849px', 
              opacity: '0.38' 
            }}
          >
             <img src={gloat} alt="" className="w-full h-full object-contain" />
          </div>

          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-50 backdrop-blur-md bg-white/80 z-40">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100">
                <Bot size={28} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Ecobot</h3>
                <p className="text-[11px] text-green-500 font-bold uppercase tracking-wider">Online Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-[11px] font-bold rounded-xl shadow-lg transition-all active:scale-95"
              >
                {language} <ChevronRight size={14} className={language === 'Hindi' ? 'rotate-180' : ''} />
              </button>
              <MoreVertical size={20} className="text-gray-400" />
            </div>
          </div>

          {/* Chat Window */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 z-10 scroll-smooth">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3`}>
                <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border ${m.role === 'bot' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                    {m.role === 'bot' ? <Bot size={20} /> : <User size={20} />}
                  </div>
                  <div className="flex flex-col">
                    <div className={`p-5 rounded-3xl shadow-sm text-sm leading-relaxed ${m.role === 'user' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white border text-gray-800 rounded-tl-none'}`}>
                      {m.file && (
                        <div className="mb-3">
                          {m.file.type.startsWith('image/') ? (
                            <img src={m.file.preview} alt="Attachment" className="max-w-xs rounded-xl shadow-md border border-white/20" />
                          ) : (
                            <div className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                              <Paperclip size={16} /> <span>{m.file.name}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {m.text}
                    </div>
                    <span className="text-[10px] mt-2 font-bold text-gray-400 uppercase tracking-widest">{m.time}</span>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && <div className="text-[11px] font-black text-green-600 animate-pulse uppercase tracking-widest ml-14">Ecobot Thinking...</div>}
          </div>

          {/* Input & Quick Actions */}
          <div className="p-6 bg-white border-t border-gray-50 z-40 space-y-4">
            <div className="flex gap-2.5">
              {quickActions.map((action, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(null, action.query)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border rounded-full text-[10px] font-black text-gray-600 hover:bg-green-50 transition-all"
                >
                  {action.icon} {action.label}
                </button>
              ))}
            </div>

            {/* Attachment Preview */}
            {attachedFile && (
              <div className="relative inline-block">
                <div className="flex items-center gap-2 p-2 bg-gray-50 border rounded-xl">
                  {attachedFile.type.startsWith('image/') ? (
                    <img src={attachedFile.preview} className="w-12 h-12 object-cover rounded-lg" alt="" />
                  ) : (
                    <Paperclip className="text-green-600" />
                  )}
                  <span className="text-xs truncate max-w-[150px] font-bold">{attachedFile.name}</span>
                  <button onClick={() => setAttachedFile(null)} className="p-1 hover:text-red-500"><X size={14} /></button>
                </div>
              </div>
            )}

            <form onSubmit={handleSend} className="relative flex items-center">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange} 
                accept="image/*,.pdf,.doc,.docx"
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current.click()}
                className="absolute left-5 text-gray-300 hover:text-green-600"
              >
                <Plus size={24} />
              </button>
              
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={language === 'English' ? "Type a message..." : "संदेश टाइप करें..."} 
                className="w-full bg-[#F9FAFB] border-2 border-transparent rounded-3xl py-5 pl-14 pr-44 text-sm font-semibold focus:outline-none focus:bg-white focus:border-green-500/10"
              />
              
              <div className="absolute right-5 flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={startVoiceRecording}
                  className={`p-3 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-gray-300 hover:bg-gray-100 hover:text-green-600'}`}
                >
                  {isRecording ? <MicOff size={22} /> : <Mic size={22} />}
                </button>
                <button type="submit" className="p-3 bg-green-600 text-white rounded-xl shadow-md active:scale-90 transition-transform">
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* --- Right Sidebar --- */}
        <aside className="w-80 p-6 hidden xl:flex flex-col gap-8 shrink-0 bg-[#F9FAFB] border-l border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Trophy size={20} className="text-amber-500" />
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Leaderboard</h2>
          </div>
          <div className="space-y-4">
            {[{r:1, n:"FarmerJoe", s:"12,450", c:"bg-amber-100 text-amber-700"}, {r:2, n:"GreenThumb", s:"11,200", c:"bg-slate-100 text-slate-600"}].map(u => (
              <div key={u.r} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white transition-all">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-gray-300">{u.r}</span>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs ${u.c}`}>{u.n[0]}</div>
                  <div><p className="text-sm font-black">{u.n}</p><p className="text-[10px] font-bold text-gray-400">{u.s} Points</p></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto p-6 bg-gray-900 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
             <BarChart3 size={40} className="text-amber-400 mb-3" />
             <p className="text-[10px] font-bold opacity-50 uppercase tracking-[0.2em]">Market Balance</p>
             <p className="text-3xl font-black">$4,280.00</p>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Ecobot;
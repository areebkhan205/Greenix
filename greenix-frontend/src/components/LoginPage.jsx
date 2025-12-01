// src/pages/LoginPage.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import vectorCard from "../assets/cc.png";
const card = {
  hidden: { opacity: 0, y: 18, scale: 0.995 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease: "easeOut" } },
};

const list = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: "easeOut" } },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, signInWithGoogle, userProfile, error, setError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const redirectAfterLogin = () => {
    // For now, always go to home page after login
    // This avoids the profile setup loop issue
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear error when user starts typing
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      setIsLoading(true);
      await login(formData.email, formData.password);
      // Use a timeout to ensure userProfile is loaded
      setTimeout(() => redirectAfterLogin(), 100);
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setIsLoading(true);
      await signInWithGoogle();
      // Use a timeout to ensure userProfile is loaded
      setTimeout(() => redirectAfterLogin(), 100);
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full bg-white flex justify-center items-center">
      <div className="relative w-full flex justify-center items-center">
        {/* background illustration */}
        <div
          className="w-[95%] md:w-[1000px] h-auto md:h-[615px] relative bg-no-repeat bg-center bg-contain"
          style={{ backgroundImage: `url(${vectorCard})` }}
        >
          {/* transparent frosted card */}
          <motion.div
            className="absolute top-[51%] right-[20%] -translate-y-1/2 w-full md:w-[340px] rounded-xl "
            variants={card}
            initial="hidden"
            animate="visible"
            role="region"
            aria-labelledby="login-title"
        
          >
            <div className="p-6">
              <h2
                id="login-title"
                className="text-lg mb-4 text-center text-black font-semibold"
                style={{ fontFamily: "'Bruno Ace', cursive", textShadow: "1px 1px 2px rgba(0,0,0,0.12)" }}
              >
                Log in to resume your journey
              </h2>

              {error && (
                <motion.div
                  className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <motion.form
                className="flex flex-col gap-3.5"
                variants={list}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit}
              >
                <motion.input
                  aria-label="Email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="text-sm rounded-md border border-[#33AC33] bg-white/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#33AC33] placeholder:font-['Outfit'] transition"
                  variants={item}
                  required
                />

                <motion.input
                  aria-label="Password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="text-sm rounded-md border border-[#33AC33] bg-white/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#33AC33] placeholder:font-['Outfit'] transition"
                  variants={item}
                  required
                />

                <motion.div className="flex items-center justify-between text-xs" variants={item}>
                  <label className="flex items-center gap-2 text-sm select-none">
                    <input 
                      type="checkbox" 
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded-sm accent-[#33AC33]"
                    />
                    <span className="text-xs" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      Remember me
                    </span>
                  </label>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-[#33AC33] text-white rounded-md py-2 text-sm font-['Bruno Ace'] hover:bg-[#2a8e2a] transition ${
                    isLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                  whileTap={{ scale: 0.985 }}
                  whileHover={{ y: -2 }}
                  variants={item}
                  aria-label="Login"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </motion.button>
              </motion.form>

              <motion.p className="mt-3 text-center text-xs" style={{ fontFamily: "'Bruno Ace', cursive" }} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.45 } }}>
                New here?{" "}
                <Link to="/signup" className="text-[#33AC33] hover:underline">
                  Join The Eco System
                </Link>
              </motion.p>

              <motion.button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className={`mt-3 w-full border border-[#33AC33] rounded-md py-2 text-sm font-['Outfit'] hover:bg-[#f3fdf5] flex justify-center items-center gap-2 transition ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.995 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.55 } }}
                aria-label="Continue with Google"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="18" height="18" />
                {isLoading ? "Signing in..." : "Continue with Google"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
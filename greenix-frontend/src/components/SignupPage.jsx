// src/components/SignupPage.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import vectorCard from "../assets/cc.png";

const card = {
  hidden: { opacity: 0, y: 16, scale: 0.995 },
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

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, signInWithGoogle, setError, clearError, error } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setError("");
      await signup(formData.email, formData.password, formData.name);

      // Signup succeeded -> redirect to profile setup
      navigate("/profile-setup");
    } catch (err) {
      console.error("Signup error:", err);
      // If auth error object exists with code, map to friendly messages
      if (err && err.code) {
        if (err.code === "auth/email-already-in-use") {
          setError("This email is already registered. Try logging in.");
        } else if (err.code === "auth/weak-password") {
          setError("Password is too weak. Please choose a stronger password.");
        } else if (err.code === "auth/invalid-email") {
          setError("Please enter a valid email address.");
        } else {
          setError(err.message || "Failed to create account. Please try again.");
        }
      } else {
        setError(err?.message || "Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      setError("");
      await signInWithGoogle();
      // on success redirect to profile setup
      navigate("/profile-setup");
    } catch (err) {
      console.error("Google signup error:", err);
      setError(err?.message || "Failed to sign up with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex justify-center items-center">
      <div className="relative w-full flex justify-center items-center">
        {/* background illustration */}
        <div
          className="w-[95%] md:w-[1090px] h-auto md:h-[647px] relative bg-no-repeat bg-center bg-contain"
          style={{ backgroundImage: `url(${vectorCard})` }}
        >
          {/* transparent frosted card */}
          <motion.div
            className="absolute top-[51%] right-[13%] md:right-[20%] -translate-y-1/2 w-full md:w-[340px] rounded-xl"
            variants={card}
            initial="hidden"
            animate="visible"
            role="region"
            aria-labelledby="signup-title"
          >
            <div className="p-6">
              <h2
                id="signup-title"
                className="text-lg mb-5 text-center text-black font-semibold"
                style={{ fontFamily: "'Bruno Ace', cursive", textShadow: "1px 1px 2px rgba(0,0,0,0.15)" }}
              >
                Create Your Account
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
                className="flex flex-col gap-4"
                variants={list}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit}
              >
                <motion.input
                  aria-label="Name"
                  name="name"
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-sm rounded-md border border-[#33AC33] bg-white/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#33AC33] placeholder:font-['Outfit'] transition"
                  variants={item}
                  required
                />

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
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="text-sm rounded-md border border-[#33AC33] bg-white/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#33AC33] placeholder:font-['Outfit'] transition"
                  variants={item}
                  required
                  minLength={6}
                />

                <motion.input
                  aria-label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="text-sm rounded-md border border-[#33AC33] bg-white/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#33AC33] placeholder:font-['Outfit'] transition"
                  variants={item}
                  required
                />

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-[#33AC33] text-white rounded-md py-2 text-sm font-['Bruno Ace'] hover:bg-[#2a8e2a] transition ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
                  whileTap={{ scale: 0.985 }}
                  whileHover={{ y: -2 }}
                  variants={item}
                  aria-label="Sign up"
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </motion.button>
              </motion.form>

              <motion.p className="mt-4 text-center text-xs" style={{ fontFamily: "'Bruno Ace', cursive" }} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.45 } }}>
                Already a member?{" "}
                <Link to="/log" className="text-[#33AC33] hover:underline">
                  Login here 🌎
                </Link>
              </motion.p>

              <motion.button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className={`mt-4 w-full border border-[#33AC33] rounded-md py-2 text-sm font-['Outfit'] hover:bg-[#f3fdf5] flex justify-center items-center gap-2 transition ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.995 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.55 } }}
                aria-label="Sign up with Google"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="18" height="18" />
                {isLoading ? "Signing up..." : "Sign up with Google"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

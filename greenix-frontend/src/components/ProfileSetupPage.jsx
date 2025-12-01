// src/components/ProfileSetupPage.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile, error, setError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || "",
    username: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) clearError();
  };

  // No more profile picture stuff!

  const validateForm = () => {
    // Super simple validation - only name is required
    if (!formData.displayName.trim()) {
      setError("Please enter your name (username is optional)");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setError("");
      setIsLoading(true);
      
      console.log("Starting profile setup...", {
        displayName: formData.displayName.trim(),
        username: formData.username.trim()
      });
      
      // Simple profile update without avatar
      await updateUserProfile({
        displayName: formData.displayName.trim(),
        username: formData.username.trim()
      });

      console.log("Profile setup successful!");
      navigate("/");
    } catch (error) {
      console.error("Profile setup error:", error);
      
      // Just go to home if there's any issue
      console.log("Profile setup had an issue, going to home anyway...");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Allow users to skip profile setup
    navigate("/");
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
            className="absolute top-[51%] right-[13%] md:right-[20%] -translate-y-1/2 w-full md:w-[380px] rounded-xl"
            variants={card}
            initial="hidden"
            animate="visible"
            role="region"
            aria-labelledby="profile-setup-title"
          >
            <div className="p-6">
              <h2
                id="profile-setup-title"
                className="text-lg mb-5 text-center text-black font-semibold"
                style={{ fontFamily: "'Bruno Ace', cursive", textShadow: "1px 1px 2px rgba(0,0,0,0.15)" }}
              >
                Complete Your Profile
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
                {/* Simple header - no icon */}
                <motion.div 
                  className="flex flex-col items-center gap-3"
                  variants={item}
                >
                  <p className="text-lg text-gray-700 text-center font-['Outfit'] font-semibold">
                    🌱 Tell us about yourself
                  </p>
                </motion.div>

                <motion.input
                  aria-label="Display Name"
                  name="displayName"
                  type="text"
                  placeholder="Your Full Name"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="text-sm rounded-md border border-[#33AC33] bg-white/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#33AC33] placeholder:font-['Outfit'] transition"
                  variants={item}
                  required
                />

                <motion.input
                  aria-label="Username"
                  name="username"
                  type="text"
                  placeholder="Choose a username (optional)"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="text-sm rounded-md border border-[#33AC33] bg-white/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#33AC33] placeholder:font-['Outfit'] transition"
                  variants={item}
                  minLength={3}
                />

                <motion.div className="flex gap-3 mt-2" variants={item}>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 bg-[#33AC33] text-white rounded-md py-2 text-sm font-['Bruno Ace'] hover:bg-[#2a8e2a] transition ${
                      isLoading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                    whileTap={{ scale: 0.985 }}
                    whileHover={{ y: -2 }}
                    aria-label="Complete profile setup"
                  >
                    {isLoading ? "Setting up your profile..." : "Complete Setup 🚀"}
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={handleSkip}
                    disabled={isLoading}
                    className="px-4 border border-[#33AC33] text-[#33AC33] rounded-md py-2 text-sm font-['Outfit'] hover:bg-[#f3fdf5] transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Skip
                  </motion.button>
                </motion.div>

                {/* Emergency option (just in case) */}
                <motion.button
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full mt-2 px-4 py-2 text-xs text-gray-500 hover:text-gray-700 transition"
                  variants={item}
                >
                  Emergency: Skip to home →
                </motion.button>
              </motion.form>

              <motion.p 
                className="mt-4 text-center text-xs text-gray-600" 
                style={{ fontFamily: "'Bruno Ace', cursive" }} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1, transition: { delay: 0.45 } }}
              >
                Help us personalize your experience 🌱
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
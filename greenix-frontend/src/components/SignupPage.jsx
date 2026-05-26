// src/components/SignupPage.jsx

import { motion } from "framer-motion";

import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  doc,
  setDoc
} from "firebase/firestore";

import vectorCard from "../assets/cc.png";
import { auth, db } from "../firebase/firebase";

const card = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.995
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.42,
      ease: "easeOut"
    }
  }
};

const list = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06
    }
  }
};

const item = {
  hidden: {
    opacity: 0,
    y: 10
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.36,
      ease: "easeOut"
    }
  }
};

export default function SignupPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // HANDLE INPUT
  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // SIGNUP FUNCTION
  const handleSubmit = async (e) => {

    e.preventDefault();

    // VALIDATION
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill all fields");
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    try {

      setIsLoading(true);

      setError("");

      // CREATE USER
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

      const user = userCredential.user;

      // SAVE USER DATA
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: formData.name,
          email: formData.email,
          role: "user",
          createdAt: new Date()
        }
      );

      alert("Signup Successful");

      navigate("/profile-setup");

    } catch (err) {

      setError(err.message);

    } finally {

      setIsLoading(false);

    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex justify-center items-center">

      <div className="relative w-full flex justify-center items-center">

        {/* BACKGROUND CARD */}
        <div
          className="w-[95%] md:w-[1090px] h-auto md:h-[647px] relative bg-no-repeat bg-center bg-contain"
          style={{
            backgroundImage: `url(${vectorCard})`
          }}
        >

          {/* SIGNUP CARD */}
          <motion.div
            className="absolute top-[51%] right-[13%] md:right-[20%] -translate-y-1/2 w-full md:w-[340px] rounded-xl"
            variants={card}
            initial="hidden"
            animate="visible"
          >

            <div className="p-6">

              {/* TITLE */}
              <h2
                className="text-lg mb-5 text-center text-black font-semibold"
                style={{
                  fontFamily: "'Bruno Ace', cursive",
                  textShadow:
                    "1px 1px 2px rgba(0,0,0,0.15)"
                }}
              >
                Create Your Account
              </h2>

              {/* ERROR */}
              {error && (
                <motion.div
                  className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm"
                  initial={{
                    opacity: 0,
                    y: -10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                >
                  {error}
                </motion.div>
              )}

              {/* FORM */}
              <motion.form
                className="flex flex-col gap-4"
                variants={list}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit}
              >

                {/* NAME */}
                <motion.input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-sm rounded-md border border-[#33AC33] bg-white/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#33AC33]"
                  variants={item}
                />

                {/* EMAIL */}
                <motion.input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="text-sm rounded-md border border-[#33AC33] bg-white/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#33AC33]"
                  variants={item}
                />

                {/* PASSWORD */}
                <motion.input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="text-sm rounded-md border border-[#33AC33] bg-white/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#33AC33]"
                  variants={item}
                />

                {/* CONFIRM PASSWORD */}
                <motion.input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="text-sm rounded-md border border-[#33AC33] bg-white/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#33AC33]"
                  variants={item}
                />

                {/* BUTTON */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#33AC33] text-white rounded-md py-2 text-sm font-['Bruno Ace'] hover:bg-[#2a8e2a] transition"
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ y: -2 }}
                  variants={item}
                >
                  {isLoading
                    ? "Creating Account..."
                    : "Sign Up"}
                </motion.button>

              </motion.form>

              {/* LOGIN LINK */}
              <motion.p
                className="mt-4 text-center text-xs"
                style={{
                  fontFamily:
                    "'Bruno Ace', cursive"
                }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: 0.45 }
                }}
              >
                Already a member?{" "}

                <Link
                  to="/log"
                  className="text-[#33AC33] hover:underline"
                >
                  Login here 🌎
                </Link>

              </motion.p>

            </div>

          </motion.div>

        </div>

      </div>

    </div>
  );
}
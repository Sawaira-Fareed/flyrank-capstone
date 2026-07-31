"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [firebaseError, setFirebaseError] = useState("");

  const validate = () => {
    const newErrors = { name: "", email: "", password: "", confirmPassword: "" };
    let valid = true;
    if (!name.trim()) { newErrors.name = "Name is required"; valid = false; }
    else if (name.trim().length < 3) { newErrors.name = "Minimum 3 characters"; valid = false; }
    if (!email.trim()) { newErrors.email = "Email is required"; valid = false; }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) { newErrors.email = "Enter a valid email"; valid = false; }
    if (!password) { newErrors.password = "Password is required"; valid = false; }
    else if (password.length < 8) { newErrors.password = "Minimum 8 characters"; valid = false; }
    if (!confirmPassword) { newErrors.confirmPassword = "Please confirm your password"; valid = false; }
    else if (password !== confirmPassword) { newErrors.confirmPassword = "Passwords do not match"; valid = false; }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFirebaseError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/garden");
    } catch (err: any) {
      setFirebaseError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setFirebaseError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/garden");
    } catch (err: any) {
      setFirebaseError(err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center overflow-hidden"
      style={{
        backgroundImage: "url('/auth-back.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-white/8" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-center lg:justify-start gap-6 lg:gap-12">
        
        {/* LEFT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex items-center gap-6"
        >
          <div className="flex flex-col gap-7">
            {[
              { icon: "🔥", title: "15k+ Learners", sub: "Growing every day" },
              { icon: "🌱", title: "AI Mentor", sub: "Personal coding guide" },
              { icon: "⭐", title: "4.9 Rating", sub: "Loved by students" },
            ].map((badge) => (
              <div
                key={badge.title}
                className="w-[210px] rounded-[20px] border border-white/50 bg-white/60 backdrop-blur-lg px-5 py-4 shadow-lg"
                style={{ boxShadow: "0 12px 30px rgba(167,139,250,0.15)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center text-2xl">
                    {badge.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#312E81]">{badge.title}</p>
                    <p className="text-xs text-[#6B7280]">{badge.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#F5D0FE]/40 via-[#DBEAFE]/30 to-transparent blur-[80px]" />
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/elsa-auth.png"
                  alt="Elsa"
                  width={340}
                  height={480}
                  className="object-contain relative z-10 drop-shadow-[0_0_50px_rgba(244,114,182,0.3)]"
                />
              </motion.div>
            </div>
            <h2 className="font-heading text-3xl font-bold text-[#4C1D95] mt-4 text-center">
              Start your Garden.
            </h2>
            <p className="text-sm text-[#6B7280] text-center mt-2 max-w-[280px]">
              Join BloomLab and grow your coding skills with Elsa by your side.
            </p>
          </div>
        </motion.div>

        {/* RIGHT — Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-[400px] rounded-[24px] border border-white/45 px-8 py-8 flex-shrink-0"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            boxShadow: "0 20px 60px rgba(167,139,250,0.18)",
          }}
        >
          <div className="text-center mb-1">
            <p className="text-2xl">🌸</p>
            <h1 className="font-heading text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
              BloomLab
            </h1>
          </div>

          <h2 className="text-center font-heading text-lg font-bold text-[#312E81] mt-2">Create Your Garden</h2>
          <p className="text-center text-xs text-[#6B7280] mt-1">Grow your coding skills one project at a time.</p>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="mt-5 w-full h-[46px] flex items-center justify-center gap-2 rounded-full bg-white border border-white/40 px-5 text-xs font-medium text-[#312E81] hover:scale-[1.02] hover:shadow-md transition-all disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-px bg-[#312E81]/15" />
            <span className="text-xs text-[#6B7280]">OR</span>
            <div className="flex-1 h-px bg-[#312E81]/15" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className={`w-full h-[46px] rounded-full border bg-white/55 backdrop-blur px-4 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60 transition ${
                  errors.name ? "border-red-400" : "border-white/50 focus:border-[#C084FC] focus:ring-2 focus:ring-[#C084FC]/30"
                }`}
              />
              {errors.name && <p className="mt-0.5 ml-3 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`w-full h-[46px] rounded-full border bg-white/55 backdrop-blur px-4 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60 transition ${
                  errors.email ? "border-red-400" : "border-white/50 focus:border-[#C084FC] focus:ring-2 focus:ring-[#C084FC]/30"
                }`}
              />
              {errors.email && <p className="mt-0.5 ml-3 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={`w-full h-[46px] rounded-full border bg-white/55 backdrop-blur px-4 pr-10 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60 transition ${
                    errors.password ? "border-red-400" : "border-white/50 focus:border-[#C084FC] focus:ring-2 focus:ring-[#C084FC]/30"
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]/60 hover:text-[#312E81]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-0.5 ml-3 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className={`w-full h-[46px] rounded-full border bg-white/55 backdrop-blur px-4 pr-10 text-sm text-[#312E81] outline-none placeholder:text-[#6B7280]/60 transition ${
                    errors.confirmPassword ? "border-red-400" : "border-white/50 focus:border-[#C084FC] focus:ring-2 focus:ring-[#C084FC]/30"
                  }`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]/60 hover:text-[#312E81]">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-0.5 ml-3 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            {firebaseError && <p className="text-xs text-red-500 text-center">{firebaseError}</p>}

            {/* Sky Blossom Blue Button — auto width, rounded */}
            <div className="flex justify-center pt-1">
              <button
                type="submit"
                disabled={loading}
                className="px-8 h-[44px] rounded-xl bg-[#F472B6] font-semibold text-white text-sm shadow-md transition hover:scale-[1.03] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : " Sign Up "}
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-[#6B7280] mt-4">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
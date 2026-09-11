import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { CgClose } from "react-icons/cg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import YouTubee from "../assets/logo.PNG";
import YouTubeeMobile from "../assets/logo-colorfevicon.png";

const AVATAR_PRESETS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Felix",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Aria",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Leo",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Luna",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Max",
];

const AuthModal = () => {
  const {
    authModalOpen,
    closeAuthModal,
    authMode,
    setAuthMode,
    login,
    signup,
  } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authModalOpen) {
      setErrorMessage("");
      setPassword("");
      setConfirmPassword("");
    }
  }, [authModalOpen, authMode]);

  if (!authModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (authMode === "signup") {
      if (!name.trim()) {
        setErrorMessage("Please enter your name.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (authMode === "signin") {
        login({ email, password });
      } else {
        signup({
          name: name.trim(),
          email: email.trim(),
          password,
          avatar: selectedAvatar,
        });
      }
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#1f1f1f] text-black dark:text-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-black/10 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <CgClose className="text-xl" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={YouTubee}
            alt="YouTube Logo"
            className="h-7 hidden sm:block mb-2"
          />
          <img
            src={YouTubeeMobile}
            alt="YouTube Logo"
            className="h-8 w-8 sm:hidden rounded-full mb-2"
          />
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            {authMode === "signin" ? "Sign in to YouTube" : "Create your account"}
          </h2>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1 text-center">
            {authMode === "signin"
              ? "to continue watching and customizing your feed"
              : "to save preferences, history, and playlists"}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-black/5 dark:bg-white/5 p-1 mb-6">
          <button
            type="button"
            onClick={() => setAuthMode("signin")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              authMode === "signin"
                ? "bg-white dark:bg-[#303030] text-black dark:text-white shadow-sm"
                : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("signup")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              authMode === "signup"
                ? "bg-white dark:bg-[#303030] text-black dark:text-white shadow-sm"
                : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 dark:bg-red-950/40 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900/50">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === "signup" && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/20 dark:border-white/20 bg-transparent text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70 mb-2">
                  Choose Avatar
                </label>
                <div className="flex gap-2 justify-center py-1">
                  {AVATAR_PRESETS.map((avatarUrl, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedAvatar(avatarUrl)}
                      className={`relative rounded-full p-0.5 transition-all ${
                        selectedAvatar === avatarUrl
                          ? "ring-2 ring-blue-500 scale-105"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={avatarUrl}
                        alt={`Avatar preset ${idx + 1}`}
                        className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-black/20 dark:border-white/20 bg-transparent text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={
                  authMode === "signup" ? "At least 6 characters" : "Enter your password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-black/20 dark:border-white/20 bg-transparent text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="text-xl" />
                ) : (
                  <AiOutlineEye className="text-xl" />
                )}
              </button>
            </div>
          </div>

          {authMode === "signup" && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-black/20 dark:border-white/20 bg-transparent text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-medium rounded-xl shadow-sm transition-all focus:outline-none"
          >
            {isSubmitting
              ? "Please wait..."
              : authMode === "signin"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        {/* Demo Credentials Tip for quick testing */}
        {authMode === "signin" && (
          <div className="mt-5 text-center text-xs text-black/50 dark:text-white/50">
            Don't have an account yet?{" "}
            <button
              type="button"
              onClick={() => setAuthMode("signup")}
              className="text-blue-500 hover:underline font-medium"
            >
              Sign up for free
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;

"use client";

import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

interface NightDayToggleProps {
  isNight: boolean;
  toggleTheme: () => void;
}

export default function NightDayToggle({ isNight, toggleTheme }: NightDayToggleProps) {
  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-between w-20 h-10 p-1 rounded-full cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300 outline-none hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,105,180,0.3)] z-50 group"
      aria-label="Toggle day and night mode"
    >
      {/* Sliding background thumb */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-rose-300 shadow-[0_2px_10px_rgba(255,105,180,0.4)]"
        style={{
          left: isNight ? "2.5rem" : "0.25rem",
          background: isNight
            ? "linear-gradient(135deg, #a78bfa, #4c1d95)" // Purple night gradient
            : "linear-gradient(135deg, #fbcfe8, #f43f5e)", // Pink day gradient
        }}
      />

      {/* Sun icon */}
      <div className="flex items-center justify-center w-8 h-8 z-10">
        <Sun
          size={18}
          className={`transition-colors duration-300 ${
            isNight ? "text-violet-300/60 group-hover:text-violet-300" : "text-white"
          }`}
        />
      </div>

      {/* Moon icon */}
      <div className="flex items-center justify-center w-8 h-8 z-10">
        <Moon
          size={18}
          className={`transition-colors duration-300 ${
            isNight ? "text-white" : "text-pink-300/60 group-hover:text-pink-300"
          }`}
        />
      </div>
    </button>
  );
}

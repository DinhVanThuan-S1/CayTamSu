"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Sparkles, BookOpen, Home } from "lucide-react";
import NightDayToggle from "./NightDayToggle";
import { motion } from "framer-motion";

interface TopNavigationProps {
  isNight: boolean;
  toggleTheme: () => void;
  loveEnergy: number;
  totalLetters: number;
}

export default function TopNavigation({
  isNight,
  toggleTheme,
  loveEnergy,
  totalLetters,
}: TopNavigationProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 h-16 z-50 px-4 md:px-8 flex items-center justify-between bg-white/5 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-colors duration-1000 select-none">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2 group">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-pink-400 to-rose-300 shadow-[0_0_15px_rgba(255,105,180,0.4)] group-hover:scale-105 transition-transform duration-300">
          <Sparkles className="text-white w-5 h-5 animate-pulse" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-rose-400 to-violet-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity tracking-wider font-outfit">
          Cây Tâm Sự
        </span>
      </Link>

      {/* Center Stats (Desktop only or clean responsive layout) */}
      <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
        {/* Love Energy */}
        <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 shadow-sm text-pink-500 group">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Heart className="w-4 h-4 fill-pink-500 stroke-pink-500 shadow-[0_0_8px_rgba(255,20,147,0.3)]" />
          </motion.div>
          <span className="text-xs uppercase font-semibold text-gray-700 dark:text-pink-200">
            Năng lượng yêu thương:{" "}
            <span className="font-extrabold text-sm text-pink-600 dark:text-pink-400 tracking-wide drop-shadow-sm">
              {loveEnergy}
            </span>
          </span>
        </div>

        {/* Total Letters */}
        <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 shadow-sm text-violet-500">
          <BookOpen className="w-4 h-4 text-violet-500 dark:text-violet-400" />
          <span className="text-xs uppercase font-semibold text-gray-700 dark:text-violet-200">
            Số lượng thư:{" "}
            <span className="font-extrabold text-sm text-violet-600 dark:text-violet-400 tracking-wide">
              {totalLetters}
            </span>
          </span>
        </div>
      </div>

      {/* Right side navigation & toggler */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Navigation links */}
        <nav className="flex items-center space-x-1 mr-2">
          {/* Home button */}
          <Link
            href="/"
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              pathname === "/"
                ? "bg-white/15 text-pink-500 shadow-[0_2px_10px_rgba(255,105,180,0.15)] border border-pink-400/20"
                : "text-gray-600 hover:text-pink-500 hover:bg-white/10 dark:text-gray-300"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trang Chủ</span>
          </Link>

          {/* Memory Page button */}
          <Link
            href="/memory"
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              pathname === "/memory"
                ? "bg-white/15 text-pink-500 shadow-[0_2px_10px_rgba(255,105,180,0.15)] border border-pink-400/20"
                : "text-gray-600 hover:text-pink-500 hover:bg-white/10 dark:text-gray-300"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ký Ức</span>
          </Link>
        </nav>

        {/* Day/Night Theme Toggler */}
        <NightDayToggle isNight={isNight} toggleTheme={toggleTheme} />
      </div>
    </header>
  );
}

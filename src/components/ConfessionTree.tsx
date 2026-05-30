"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Lock } from "lucide-react";

interface Confession {
  id: string;
  author: string;
  emoji: string;
  emotion: string;
  color: string;
  positionX: number;
  positionY: number;
  branchIndex: number;
  unlockAt: string | null | Date;
  isStarOfHope?: boolean;
}

interface ConfessionTreeProps {
  confessions: Confession[];
  treeLevel: number;
  loveEnergy: number;
  isNight: boolean;
  onSelectConfession: (id: string) => void;
  newlyAddedId: string | null;
}

// Branches coordinate definition (startX, startY, endX, endY) as percentages
const BRANCHES = [
  { id: 0, name: "Cành Dưới Trái", sx: 50, sy: 75, ex: 25, ey: 55 },
  { id: 1, name: "Cành Dưới Phải", sx: 50, sy: 72, ex: 75, ey: 52 },
  { id: 2, name: "Cành Giữa Trái", sx: 50, sy: 58, ex: 28, ey: 38 },
  { id: 3, name: "Cành Giữa Phải", sx: 50, sy: 55, ex: 72, ey: 35 },
  { id: 4, name: "Cành Trên Trái", sx: 50, sy: 42, ex: 35, ey: 22 },
  { id: 5, name: "Cành Trên Phải", sx: 50, sy: 40, ex: 65, ey: 20 },
  { id: 6, name: "Cành Đỉnh Cây", sx: 50, sy: 35, ex: 50, ey: 12 },
];

export default function ConfessionTree({
  confessions,
  treeLevel,
  loveEnergy,
  isNight,
  onSelectConfession,
  newlyAddedId,
}: ConfessionTreeProps) {
  const [hoveredLetterId, setHoveredLetterId] = useState<string | null>(null);

  // Helper to interpolate coordinates
  const getConfessionCoords = (confession: Confession) => {
    const branch = BRANCHES[confession.branchIndex] || BRANCHES[0];
    const pct = confession.positionX / 100; // Interpolation factor (0 to 1)
    
    // Line interpolation: x = sx + (ex - sx) * pct
    const x = branch.sx + (branch.ex - branch.sx) * pct;
    const y = branch.sy + (branch.ey - branch.sy) * pct;
    
    // Add vertical offset based on positionY to make them hang naturally under the branch
    const offset = 4 + (confession.positionY % 6);
    return { x, y: y + offset };
  };

  // Color mapping for confession letters
  const colorMap: Record<string, { bg: string; border: string; glow: string; text: string }> = {
    pink: {
      bg: "bg-pink-100/90 dark:bg-pink-900/80",
      border: "border-pink-300 dark:border-pink-500/50",
      glow: "shadow-[0_0_10px_rgba(244,63,94,0.3)]",
      text: "text-pink-600 dark:text-pink-200",
    },
    rose: {
      bg: "bg-rose-100/90 dark:bg-rose-900/80",
      border: "border-rose-300 dark:border-rose-500/50",
      glow: "shadow-[0_0_10px_rgba(244,63,94,0.3)]",
      text: "text-rose-600 dark:text-rose-200",
    },
    purple: {
      bg: "bg-purple-100/90 dark:bg-purple-900/80",
      border: "border-purple-300 dark:border-purple-500/50",
      glow: "shadow-[0_0_10px_rgba(168,85,247,0.3)]",
      text: "text-purple-600 dark:text-purple-200",
    },
    violet: {
      bg: "bg-indigo-100/90 dark:bg-indigo-900/80",
      border: "border-indigo-300 dark:border-indigo-500/50",
      glow: "shadow-[0_0_10px_rgba(99,102,241,0.3)]",
      text: "text-indigo-600 dark:text-indigo-200",
    },
    blue: {
      bg: "bg-sky-100/90 dark:bg-sky-900/80",
      border: "border-sky-300 dark:border-sky-500/50",
      glow: "shadow-[0_0_10px_rgba(14,165,233,0.3)]",
      text: "text-sky-600 dark:text-sky-200",
    },
    gold: {
      bg: "bg-amber-100/90 dark:bg-amber-900/80",
      border: "border-amber-300 dark:border-amber-500/50",
      glow: "shadow-[0_0_10px_rgba(245,158,11,0.3)]",
      text: "text-amber-700 dark:text-amber-200",
    },
    emerald: {
      bg: "bg-emerald-100/90 dark:bg-emerald-900/80",
      border: "border-emerald-300 dark:border-emerald-500/50",
      glow: "shadow-[0_0_10px_rgba(16,185,129,0.3)]",
      text: "text-emerald-600 dark:text-emerald-200",
    },
  };

  // Determine tree scaling & opacity levels based on progression
  const scale = 0.8 + Math.min(0.4, treeLevel * 0.1);

  // Generate branches paths for SVG dynamically based on tree level
  const showSprout = treeLevel === 1;
  const showSmall = treeLevel === 2;
  const showMedium = treeLevel >= 3;
  const showBrilliant = treeLevel >= 4;
  const showLegend = treeLevel === 5;

  return (
    <div className="relative w-full max-w-[700px] aspect-[4/3] flex items-center justify-center select-none">
      
      {/* GLOWING AURA around tree (increases with love energy & legend levels) */}
      <div
        className={`absolute inset-0 rounded-full blur-[100px] transition-all duration-1000 ${
          isNight
            ? showLegend
              ? "bg-violet-600/50 shadow-[0_0_120px_rgba(167,139,250,0.4)]"
              : "bg-indigo-700/30"
            : showLegend
            ? "bg-pink-400/40 shadow-[0_0_120px_rgba(244,63,94,0.3)]"
            : "bg-rose-300/25"
        }`}
        style={{ 
          transform: `scale(${scale})`,
          opacity: Math.min(0.8, 0.25 + (loveEnergy * 0.005))
        }}
      />

      {/* SVG TREE DRAWING */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-2xl overflow-visible transition-transform duration-1000 ease-out"
        style={{ transform: `scale(${scale})` }}
      >
        <defs>
          {/* Main brown gradient for trunk */}
          <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="50%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>

          {/* Leaf green/pink gradients */}
          <radialGradient id="leafGradDay" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffb6c1" />
            <stop offset="70%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </radialGradient>
          <radialGradient id="leafGradNight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="60%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#312e81" />
          </radialGradient>
        </defs>

        {/* ==================== SVG TREE PATHS ==================== */}
        <g className="animate-tree-sway origin-bottom">
          {/* 1. Trunk (Gốc cây cổ thụ) */}
          <path
            d={
              showSprout
                ? "M48 95 C 48 85, 49 70, 50 65 C 51 70, 52 85, 52 95 Z" // Very thin young sprout
                : showSmall
                ? "M46 95 C 46 80, 48 62, 50 55 C 52 62, 54 80, 54 95 Z" // Slim
                : "M43 95 C 42 75, 46 50, 50 45 C 54 50, 58 75, 57 95 Z" // Thick grand trunk
            }
            fill="url(#trunkGrad)"
          />

          {/* 2. Branches (Cành cây phát triển theo Level) */}
          {/* Branch 0 & 1: Low branches */}
          {!showSprout && (
            <>
              {/* Left low */}
              <path
                d="M48 72 C 45 70, 35 68, 25 55 C 29 55, 43 64, 48 68 Z"
                fill="url(#trunkGrad)"
              />
              {/* Right low */}
              <path
                d="M52 70 C 55 68, 65 66, 75 52 C 71 52, 57 62, 52 66 Z"
                fill="url(#trunkGrad)"
              />
            </>
          )}

          {/* Branch 2 & 3: Middle branches */}
          {(showSmall || showMedium) && (
            <>
              {/* Left middle */}
              <path
                d="M48 58 C 44 55, 36 50, 28 38 C 32 39, 44 48, 48 52 Z"
                fill="url(#trunkGrad)"
              />
              {/* Right middle */}
              <path
                d="M52 56 C 56 53, 64 48, 72 35 C 68 36, 56 46, 52 50 Z"
                fill="url(#trunkGrad)"
              />
            </>
          )}

          {/* Branch 4, 5, 6: Top / Crown branches */}
          {showMedium && (
            <>
              {/* Top left */}
              <path
                d="M49 46 C 45 42, 38 35, 35 22 C 38 24, 46 36, 49 41 Z"
                fill="url(#trunkGrad)"
              />
              {/* Top right */}
              <path
                d="M51 45 C 55 41, 62 34, 65 20 C 62 22, 54 34, 51 39 Z"
                fill="url(#trunkGrad)"
              />
              {/* Main vertical Crown */}
              <path
                d="M50 45 C 48 38, 49 25, 50 12 C 51 25, 52 38, 50 45 Z"
                fill="url(#trunkGrad)"
              />
            </>
          )}

          {/* 3. Foliage Layers / Leaves (Cành lá sum suê vẽ bằng các khối hình tròn chồng lớp đẹp mắt) */}
          <g className="opacity-80">
            {isNight ? (
              // Night glowing foliage
              <>
                {/* Crown foliage */}
                <circle cx="50" cy="18" r={showSprout ? 6 : showSmall ? 10 : 15} fill="url(#leafGradNight)" className="transition-all duration-1000" />
                
                {/* Left side foliage */}
                {!showSprout && (
                  <circle cx="30" cy="45" r={showSmall ? 8 : 13} fill="url(#leafGradNight)" className="transition-all duration-1000" />
                )}
                {showMedium && (
                  <circle cx="38" cy="28" r="11" fill="url(#leafGradNight)" />
                )}

                {/* Right side foliage */}
                {!showSprout && (
                  <circle cx="70" cy="42" r={showSmall ? 8 : 13} fill="url(#leafGradNight)" className="transition-all duration-1000" />
                )}
                {showMedium && (
                  <circle cx="62" cy="26" r="11" fill="url(#leafGradNight)" />
                )}
              </>
            ) : (
              // Day pink sakura foliage
              <>
                {/* Crown foliage */}
                <circle cx="50" cy="18" r={showSprout ? 6 : showSmall ? 10 : 15} fill="url(#leafGradDay)" className="transition-all duration-1000" />
                
                {/* Left side foliage */}
                {!showSprout && (
                  <circle cx="30" cy="45" r={showSmall ? 8 : 13} fill="url(#leafGradDay)" className="transition-all duration-1000" />
                )}
                {showMedium && (
                  <circle cx="38" cy="28" r="11" fill="url(#leafGradDay)" />
                )}

                {/* Right side foliage */}
                {!showSprout && (
                  <circle cx="70" cy="42" r={showSmall ? 8 : 13} fill="url(#leafGradDay)" className="transition-all duration-1000" />
                )}
                {showMedium && (
                  <circle cx="62" cy="26" r="11" fill="url(#leafGradDay)" />
                )}
              </>
            )}
          </g>

          {/* 4. Bioluminescent glow points / flowers (for high levels) */}
          {showBrilliant && (
            <g>
              {/* Left flower cluster */}
              <circle cx="28" cy="40" r="1.5" fill="#ffd700" className="animate-ping" style={{ animationDuration: "3s" }} />
              <circle cx="32" cy="48" r="1.2" fill="#fff" />
              
              {/* Right flower cluster */}
              <circle cx="72" cy="38" r="1.5" fill="#ffd700" className="animate-ping" style={{ animationDuration: "2.5s" }} />
              <circle cx="66" cy="45" r="1.2" fill="#fff" />

              {/* Crown flowers */}
              <circle cx="52" cy="15" r="1.5" fill="#f472b6" className="animate-pulse" />
              <circle cx="45" cy="22" r="1.2" fill="#fff" />
            </g>
          )}
        </g>
      </svg>

      {/* ==================== INTERACTIVE HANGING LETTERS LAYER ==================== */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
        {confessions.map((c) => {
          const { x, y } = getConfessionCoords(c);
          const colorStyles = colorMap[c.color] || colorMap.pink;
          const isNew = newlyAddedId === c.id;
          
          // Check if letter is locked (Lá Thư Tương Lai)
          const isLocked = c.unlockAt && new Date(c.unlockAt) > new Date();

          return (
            <div
              key={c.id}
              className="absolute pointer-events-auto"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Micro sway animation for letters */}
              <motion.div
                className="relative cursor-pointer origin-top"
                initial={isNew ? { y: 200, scale: 0.2, opacity: 0 } : { y: 0, scale: 1, opacity: 1 }}
                animate={
                  isNew
                    ? { y: 0, scale: 1, opacity: 1 }
                    : {
                        rotate: hoveredLetterId === c.id ? [0, 8, -8, 5, -5, 0] : [0, 2, -2, 1, -1, 0],
                      }
                }
                transition={
                  isNew
                    ? { type: "spring", stiffness: 100, damping: 15 }
                    : {
                        repeat: Infinity,
                        duration: hoveredLetterId === c.id ? 2.5 : 4 + (y % 3),
                        ease: "easeInOut",
                      }
                }
                onMouseEnter={() => setHoveredLetterId(c.id)}
                onMouseLeave={() => setHoveredLetterId(null)}
                onClick={() => onSelectConfession(c.id)}
              >
                {/* Visual Letter hanging line */}
                <div className="w-[1px] h-4 bg-gray-500/50 mx-auto -mt-4 shadow-sm" />

                {/* The Letter Tag */}
                <motion.div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border backdrop-blur-sm select-none transition-all duration-300 ${colorStyles.bg} ${colorStyles.border} ${colorStyles.glow} ${colorStyles.text}`}
                  whileHover={{ scale: 1.25, zIndex: 40 }}
                >
                  {isLocked ? (
                    <Lock className="w-3.5 h-3.5 animate-pulse" />
                  ) : (
                    <span className="text-base leading-none drop-shadow-sm select-none">{c.emoji}</span>
                  )}

                  {/* Special glow for Star of Hope */}
                  {c.isStarOfHope && (
                    <div className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-ping opacity-75" />
                  )}
                </motion.div>

                {/* Mini Tooltip on Hover */}
                {hoveredLetterId === c.id && (
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 min-w-[100px] text-center bg-gray-900/90 backdrop-blur-md border border-white/10 text-white text-[10px] py-1 px-2 rounded-lg shadow-xl z-50 pointer-events-none select-none animate-fade-in whitespace-nowrap">
                    <span className="font-semibold">{c.author}</span>
                    <div className="text-pink-300 text-[8px] font-medium tracking-wide uppercase mt-0.5">
                      {isLocked ? "Bị khóa bí mật" : c.emotion}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* STAR OF HOPE blinking on top of the tree! */}
      {confessions.some((c) => c.isStarOfHope) && (
        <div
          className="absolute pointer-events-auto"
          style={{
            left: "50%",
            top: `${14 + (scale - 1) * 3}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Floating interactive glowing star */}
          <motion.div
            className="flex flex-col items-center cursor-pointer group"
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            onClick={() => {
              const star = confessions.find((c) => c.isStarOfHope);
              if (star) onSelectConfession(star.id);
            }}
          >
            <div className="w-6 h-6 flex items-center justify-center text-yellow-300 dark:text-yellow-400 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)] filter group-hover:scale-125 transition-transform duration-300 select-none text-lg">
              ⭐
            </div>
            {/* Blinking Aura */}
            <div className="absolute w-6 h-6 rounded-full bg-yellow-400/20 animate-ping pointer-events-none" />
            <div className="absolute top-7 bg-yellow-900/90 text-yellow-300 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border border-yellow-500/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
              Sao Hy Vọng
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

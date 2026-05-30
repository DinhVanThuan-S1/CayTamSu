"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, PenTool, BookOpen, TreeDeciduous, Heart, ArrowDown } from "lucide-react";
import CanvasBackground from "@/components/CanvasBackground";
import TopNavigation from "@/components/TopNavigation";
import ConfessionTree from "@/components/ConfessionTree";
import ConfessionForm from "@/components/ConfessionForm";
import DetailModal from "@/components/DetailModal";

interface Confession {
  id: string;
  author: string;
  emoji: string;
  emotion: string;
  color: string;
  positionX: number;
  positionY: number;
  branchIndex: number;
  unlockAt: string | null;
  isStarOfHope?: boolean;
}

export default function Home() {
  const [isNight, setIsNight] = useState(false);
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [totalLetters, setTotalLetters] = useState(0);
  const [loveEnergy, setLoveEnergy] = useState(0);
  const [treeLevel, setTreeLevel] = useState(1);

  // Modals & UI States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedConfessionId, setSelectedConfessionId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const treeSectionRef = useRef<HTMLDivElement | null>(null);

  // 1. Initialize day/night according to local hour & Load Initial Data
  useEffect(() => {
    const hour = new Date().getHours();
    setIsNight(hour < 6 || hour >= 18);

    const loadInitialData = async () => {
      try {
        // Fetch Confessions
        const confRes = await fetch("/api/confessions");
        if (confRes.ok) {
          const confData = await confRes.json();
          setConfessions(confData.confessions || []);
        }

        // Fetch Tree State
        const stateRes = await fetch("/api/tree-state");
        if (stateRes.ok) {
          const stateData = await stateRes.json();
          const state = stateData.treeState;
          if (state) {
            setTotalLetters(state.totalLetters);
            setLoveEnergy(state.totalLoveEnergy);
            setTreeLevel(state.treeLevel);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", err);
      }
    };

    loadInitialData();
  }, []);

  // 2. Add React reaction handler
  const handleReact = async (id: string, type: string) => {
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confessionId: id, type }),
      });
      if (res.ok) {
        setLoveEnergy((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Lỗi thả tim:", err);
    }
  };

  // 3. Add Comment handler
  const handleAddComment = async (id: string, author: string, content: string) => {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confessionId: id, author, content }),
    });

    if (!res.ok) {
      throw new Error("Lỗi khi thêm bình luận");
    }

    const data = await res.json();
    return data.comment;
  };

  // 4. Form Submit handler (Realtime state updates!)
  const handleFormSubmit = async (formData: {
    author: string;
    content: string;
    anonymous: boolean;
    color: string;
    emoji: string;
    unlockAt: string | null;
  }) => {
    const res = await fetch("/api/confessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error("Không thể gửi lời tâm sự");
    }

    const data = await res.json();
    const newConf = data.confession;

    // Realtime update states immediately
    setConfessions((prev) => [newConf, ...prev]);
    setTotalLetters((prev) => prev + 1);
    setLoveEnergy(data.totalLoveEnergy);
    setTreeLevel(data.treeLevel);
    setNewlyAddedId(newConf.id);

    // Trigger success notification banner
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 5000);

    // Clear newlyAddedId after 3 seconds
    setTimeout(() => {
      setNewlyAddedId(null);
    }, 3000);

    // Scroll to Tree Section smoothly
    setTimeout(() => {
      treeSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  const handleSelectConfession = (id: string) => {
    setSelectedConfessionId(id);
    setIsDetailOpen(true);
  };

  // Level Names Mapping
  const levelNames = ["Sprout", "Cây Non", "Cây Nhỏ", "Cây Lớn Rực Rỡ", "Huyền Thoại Ánh Sáng"];

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-1000 overflow-x-hidden font-sans ${
        isNight
          ? "dark bg-gradient-to-b from-slate-950 via-purple-950 to-indigo-950 text-white"
          : "bg-gradient-to-b from-rose-100 via-pink-200 to-amber-100 text-gray-800"
      }`}
    >
      {/* 1. HTML Canvas Particles system floating in bg */}
      <CanvasBackground isNight={isNight} treeLevel={treeLevel} loveEnergy={loveEnergy} />

      {/* 2. Glassmorphic header navigation */}
      <TopNavigation
        isNight={isNight}
        toggleTheme={() => setIsNight(!isNight)}
        loveEnergy={loveEnergy}
        totalLetters={totalLetters}
      />

      {/* 3. HERO LANDING SECTION */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 pt-24 pb-12 z-20 relative select-none">
        
        {/* Soft floating decorative circle in background */}
        <div className="absolute top-1/4 w-80 h-80 rounded-full bg-pink-400/10 blur-[80px] pointer-events-none" />

        <div className="text-center max-w-2xl space-y-6 pt-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 dark:bg-black/20 border border-white/20 text-xs font-semibold tracking-wider text-pink-500 uppercase backdrop-blur-sm shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-400" />
            <span>Nơi trú ngụ cho những xúc cảm sâu kín</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight font-outfit"
          >
            <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-violet-500 bg-clip-text text-transparent drop-shadow-sm">
              Cây Tâm Sự
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-sm md:text-lg font-medium text-gray-600 dark:text-gray-300 leading-relaxed font-sans italic max-w-xl mx-auto"
          >
            "Nơi những tâm sự được gửi vào gió và nở thành ký ức."
          </motion.p>

          {/* Action buttons with high-end glows */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => setIsFormOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-3 rounded-full text-white bg-gradient-to-r from-pink-500 via-rose-500 to-violet-500 hover:opacity-90 active:scale-98 shadow-md hover:shadow-lg transition cursor-pointer font-bold text-xs uppercase tracking-widest outline-none z-30"
            >
              <PenTool className="w-4 h-4" />
              <span>Viết tâm sự</span>
            </button>

            <button
              onClick={() => treeSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 hover:bg-white/20 dark:hover:bg-white/10 transition cursor-pointer text-xs font-extrabold uppercase tracking-widest outline-none z-30"
            >
              <TreeDeciduous className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Khám phá cây</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center pt-8 animate-bounce cursor-pointer"
            onClick={() => treeSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
          >
            <ArrowDown className="w-5 h-5 text-pink-500" />
          </motion.div>
        </div>

        {/* 4. TREE DISPLAY SECTION */}
        <div
          ref={treeSectionRef}
          className="w-full min-h-[90vh] flex flex-col items-center justify-center mt-20 pt-16 border-t border-white/5 relative"
        >
          {/* Section subtitle */}
          <div className="text-center mb-8 space-y-2 select-none">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
              Cổ Thụ Xúc Cảm
            </h2>
            <div className="flex justify-center items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
              <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <span>Cấp độ: {treeLevel}</span>
              </span>
              <span>•</span>
              <span>Trạng thái: {levelNames[treeLevel - 1] || "Hạt giống"}</span>
            </div>
          </div>

          {/* Interactive tree graphic representation */}
          <ConfessionTree
            confessions={confessions}
            treeLevel={treeLevel}
            loveEnergy={loveEnergy}
            isNight={isNight}
            onSelectConfession={handleSelectConfession}
            newlyAddedId={newlyAddedId}
          />
        </div>
      </main>

      {/* 5. COMMUNITY MILESTONES BANNER FOOTER */}
      <footer className="w-full py-8 text-center bg-black/10 dark:bg-black/40 border-t border-white/10 z-20 text-xs text-gray-500 select-none">
        <div className="max-w-2xl mx-auto px-6 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-pink-500 font-semibold uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-pink-500" />
            <span>Thành tựu cộng đồng</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            <div className={`p-2.5 rounded-xl border ${totalLetters >= 100 ? "border-pink-500/30 bg-pink-500/5 text-pink-600" : "border-gray-300/10"}`}>
              🌠 100 Thư: Sao Băng {totalLetters >= 100 ? "✓" : ""}
            </div>
            <div className={`p-2.5 rounded-xl border ${totalLetters >= 300 ? "border-pink-500/30 bg-pink-500/5 text-pink-600" : "border-gray-300/10"}`}>
              🌸 300 Thư: Nở Hoa {totalLetters >= 300 ? "✓" : ""}
            </div>
            <div className={`p-2.5 rounded-xl border ${totalLetters >= 500 ? "border-pink-500/30 bg-pink-500/5 text-pink-600" : "border-gray-300/10"}`}>
              🌳 500 Thư: Vườn Bí Mật {totalLetters >= 500 ? "✓" : ""}
            </div>
            <div className={`p-2.5 rounded-xl border ${totalLetters >= 1000 ? "border-pink-500/30 bg-pink-500/5 text-pink-600" : "border-gray-300/10"}`}>
              ✨ 1000 Thư: Cây Ánh Sáng {totalLetters >= 1000 ? "✓" : ""}
            </div>
          </div>
          
          <p className="text-[10px] text-gray-400 mt-2 font-medium">
            © 2026 Cây Tâm Sự. Mọi lá thư đều thuộc về những hồi ức quý giá của cuộc đời. Designed for Healing & Love.
          </p>
        </div>
      </footer>

      {/* Write modal */}
      <ConfessionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Read detail modal */}
      <DetailModal
        confessionId={selectedConfessionId}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedConfessionId(null);
        }}
        onReact={handleReact}
        onAddComment={handleAddComment}
      />

      {/* Success Alert Banner */}
      <AnimatePresence>
        {showSuccessAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-20 right-4 md:right-8 w-full max-w-sm overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl border border-pink-200/30 dark:border-white/5 shadow-2xl p-4 flex items-center space-x-3.5 z-50 pointer-events-auto cursor-pointer select-none"
            onClick={() => setShowSuccessAlert(false)}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-500 flex-shrink-0 animate-bounce">
              🌸
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
                Gửi gió thành công!
              </h4>
              <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">
                Tâm sự của bạn đã được gửi vào gió thành công và được treo đung đưa nhẹ trên cành cây! ✨
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

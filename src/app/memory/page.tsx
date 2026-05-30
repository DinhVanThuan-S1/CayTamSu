"use client";

import { useState, useEffect } from "react";
import { Search, Heart, Filter, Calendar, BookOpen, Clock, Lock, Sparkles } from "lucide-react";
import CanvasBackground from "@/components/CanvasBackground";
import TopNavigation from "@/components/TopNavigation";
import DetailModal from "@/components/DetailModal";
import { motion } from "framer-motion";

interface Confession {
  id: string;
  author: string;
  content: string;
  anonymous: boolean;
  emoji: string;
  emotion: string;
  color: string;
  createdAt: string;
  unlockAt: string | null;
  likesCount: number;
}

export default function MemoryPage() {
  const [isNight, setIsNight] = useState(false);
  const [confessions, setConfessions] = useState<Confession[]>([]);

  // Stats
  const [totalLetters, setTotalLetters] = useState(0);
  const [loveEnergy, setLoveEnergy] = useState(0);
  const [treeLevel, setTreeLevel] = useState(1);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("all");
  const [anonymousFilter, setAnonymousFilter] = useState("all"); // all, anonymous, public
  const [sortOrder, setSortOrder] = useState("newest"); // newest, oldest, popular

  // Detail Modal
  const [selectedConfessionId, setSelectedConfessionId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 1. Initial Load & Theme detection & Data Fetching
  useEffect(() => {
    const hour = new Date().getHours();
    setTimeout(() => {
      setIsNight(hour < 6 || hour >= 18);
    }, 0);

    const loadInitialData = async () => {
      try {
        const confRes = await fetch("/api/confessions");
        if (confRes.ok) {
          const confData = await confRes.json();
          setConfessions(confData.confessions || []);
        }

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
        console.error("Lỗi khi tải dữ liệu Ký ức:", err);
      }
    };

    loadInitialData();
  }, []);

  // 2. Perform Filtering and Sorting on client side dynamically during render
  const filteredConfessions = (() => {
    let result = [...confessions];

    // Search filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.content.toLowerCase().includes(query) ||
          c.author.toLowerCase().includes(query) ||
          c.emotion.toLowerCase().includes(query)
      );
    }

    // Emotion filter
    if (emotionFilter !== "all") {
      result = result.filter((c) => c.emotion === emotionFilter);
    }

    // Anonymous filter
    if (anonymousFilter === "anonymous") {
      result = result.filter((c) => c.anonymous === true);
    } else if (anonymousFilter === "public") {
      result = result.filter((c) => c.anonymous === false);
    }

    // Sorting
    if (sortOrder === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOrder === "oldest") {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortOrder === "popular") {
      result.sort((a, b) => b.likesCount - a.likesCount);
    }

    return result;
  })();

  const handleReact = async (id: string, type: string) => {
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confessionId: id, type }),
      });
      if (res.ok) {
        setLoveEnergy((prev) => prev + 1);
        // Refresh local lists to show likes
        setConfessions((prev) =>
          prev.map((c) => (c.id === id ? { ...c, likesCount: c.likesCount + 1 } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (id: string, author: string, content: string) => {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confessionId: id, author, content }),
    });

    if (!res.ok) {
      throw new Error("Lỗi thêm bình luận");
    }

    const data = await res.json();
    return data.comment;
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const colorTagMap: Record<string, string> = {
    pink: "bg-pink-100/60 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300",
    rose: "bg-rose-100/60 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300",
    purple: "bg-purple-100/60 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300",
    violet: "bg-indigo-100/60 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300",
    blue: "bg-sky-100/60 dark:bg-sky-900/30 text-sky-600 dark:text-sky-300",
    gold: "bg-amber-100/60 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    emerald: "bg-emerald-100/60 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300",
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-1000 overflow-x-hidden font-sans ${isNight
        ? "dark bg-gradient-to-b from-slate-950 via-purple-950 to-indigo-950 text-white"
        : "bg-gradient-to-b from-rose-100 via-pink-200 to-amber-100 text-gray-800"
        }`}
    >
      {/* 1. Background particles */}
      <CanvasBackground isNight={isNight} treeLevel={treeLevel} loveEnergy={loveEnergy} />

      {/* 2. Top Glassmorphic Navbar */}
      <TopNavigation
        isNight={isNight}
        toggleTheme={() => setIsNight(!isNight)}
        loveEnergy={loveEnergy}
        totalLetters={totalLetters}
      />

      {/* 3. Main Memory Timelines layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pt-24 pb-16 z-20 relative select-none">

        {/* Title */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-500 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ký Ức Cộng Đồng</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-600 via-rose-500 to-violet-500 bg-clip-text text-transparent font-outfit tracking-wide">
            Khu Vườn Ký Ức
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium font-sans italic">
            &ldquo;Nơi lưu giữ vĩnh hằng những rung động chân thành nhất.&rdquo;
          </p>
        </div>

        {/* Filter controls panel (Glassmorphic) */}
        <div className="p-5 rounded-3xl bg-white/20 dark:bg-black/25 backdrop-blur-md border border-white/20 dark:border-white/5 shadow-lg mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* 1. Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tâm sự, tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl bg-white/40 dark:bg-black/30 border border-gray-300/30 outline-none focus:border-pink-300 text-gray-700 dark:text-gray-200"
            />
          </div>

          {/* 2. Emotion Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={emotionFilter}
              onChange={(e) => setEmotionFilter(e.target.value)}
              className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl bg-white/40 dark:bg-black/30 border border-gray-300/30 outline-none focus:border-pink-300 text-gray-700 dark:text-gray-200 appearance-none cursor-pointer"
            >
              <option value="all">Tất cả Cảm xúc</option>
              <option value="Biết ơn">Biết ơn 🌸</option>
              <option value="Vui vẻ">Vui vẻ 😄</option>
              <option value="Hạnh phúc">Hạnh phúc 🥰</option>
              <option value="Buồn">Buồn 😢</option>
              <option value="Cô đơn">Cô đơn 🥺</option>
              <option value="Nhớ nhung">Nhớ nhung 🥹</option>
              <option value="Hy vọng">Hy vọng ✨</option>
            </select>
          </div>

          {/* 3. Anonymous Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={anonymousFilter}
              onChange={(e) => setAnonymousFilter(e.target.value)}
              className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl bg-white/40 dark:bg-black/30 border border-gray-300/30 outline-none focus:border-pink-300 text-gray-700 dark:text-gray-200 appearance-none cursor-pointer"
            >
              <option value="all">Mọi Chế độ</option>
              <option value="anonymous">Ẩn danh</option>
              <option value="public">Công khai</option>
            </select>
          </div>

          {/* 4. Sort Order Selection */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl bg-white/40 dark:bg-black/30 border border-gray-300/30 outline-none focus:border-pink-300 text-gray-700 dark:text-gray-200 appearance-none cursor-pointer"
            >
              <option value="newest">Mới nhất trước</option>
              <option value="oldest">Cũ nhất trước</option>
              <option value="popular">Được yêu thích nhất</option>
            </select>
          </div>

        </div>

        {/* 4. GRID TIMELINE OF MEMORY CARDS */}
        {filteredConfessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400/80 space-y-4">
            <Sparkles className="w-12 h-12 text-pink-400/60 animate-spin" style={{ animationDuration: "6s" }} />
            <h3 className="text-lg font-bold">Khu vườn đang tĩnh lặng</h3>
            <p className="text-xs max-w-xs leading-relaxed">
              Không tìm thấy tâm sự nào khớp với bộ lọc của bạn. Hãy thử đổi từ khóa tìm kiếm hoặc chọn lọc khác nhé!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConfessions.map((c) => {
              const isLocked = c.unlockAt && new Date(c.unlockAt) > new Date();
              const tagStyles = colorTagMap[c.color] || colorTagMap.pink;

              return (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className="rounded-3xl bg-white/40 dark:bg-gray-900/60 backdrop-blur-md border border-white/20 dark:border-white/5 shadow-md hover:shadow-xl hover:scale-102 hover:border-pink-400/30 dark:hover:border-pink-500/20 transition-all duration-300 flex flex-col justify-between p-6 cursor-pointer relative group overflow-hidden"
                  onClick={() => {
                    setSelectedConfessionId(c.id);
                    setIsDetailOpen(true);
                  }}
                >
                  {/* Decorative glowing card strip on hover */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400/0 via-pink-400/0 to-pink-400/0 group-hover:from-pink-500/70 group-hover:via-rose-500/70 group-hover:to-violet-500/70 transition-all duration-500" />

                  {/* Header info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                      <span className="font-bold px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/30 text-gray-600 dark:text-gray-300">
                        {c.author}
                      </span>
                      <span className="flex items-center space-x-1 font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(c.createdAt)}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <span className="text-base select-none">{c.emoji}</span>
                      <span className={`text-[10px] font-bold py-0.5 px-2 rounded-full uppercase tracking-wider ${tagStyles}`}>
                        {c.emotion}
                      </span>
                    </div>

                    {/* Content text */}
                    {isLocked ? (
                      <div className="py-4 flex flex-col items-center justify-center space-y-2 text-center text-violet-500/80 dark:text-violet-400/80">
                        <Lock className="w-6 h-6 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider">Lá Thư Tương Lai</span>
                        <span className="text-[9px] text-gray-400 bg-white/30 dark:bg-black/20 py-0.5 px-2 rounded border border-gray-300/10">
                          Mở ngày: {formatDate(c.unlockAt!)}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs md:text-sm text-gray-600 dark:text-slate-50 line-clamp-4 font-sans italic break-words select-text pt-1">
                        &ldquo;{c.content}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Footer details (Likes count) */}
                  {!isLocked && (
                    <div className="pt-4 mt-4 border-t border-gray-100/50 dark:border-gray-800/40 flex items-center justify-between text-[11px] font-semibold text-pink-500">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3.5 h-3.5 fill-pink-500 stroke-pink-500 animate-pulse" />
                        <span>{c.likesCount} Năng lượng</span>
                      </div>
                      <span className="text-[10px] text-gray-400 group-hover:text-pink-500 transition-colors font-bold uppercase tracking-widest">
                        Xem Bình Luận →
                      </span>
                    </div>
                  )}

                </motion.div>
              );
            })}
          </div>
        )}

      </main>

      {/* Read detail modal popup */}
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
    </div>
  );
}

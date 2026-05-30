"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Sparkles, Calendar } from "lucide-react";
import { analyzeEmotion } from "../lib/emotion";

interface ConfessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    author: string;
    content: string;
    anonymous: boolean;
    color: string;
    emoji: string;
    unlockAt: string | null;
  }) => Promise<void>;
}

const COLORS = [
  { id: "pink", label: "Hồng", hex: "bg-pink-300 border-pink-400" },
  { id: "rose", label: "Hoa Hồng", hex: "bg-rose-300 border-rose-400" },
  { id: "purple", label: "Tím Đậm", hex: "bg-purple-300 border-purple-400" },
  { id: "violet", label: "Oải Hương", hex: "bg-indigo-300 border-indigo-400" },
  { id: "blue", label: "Xanh Trời", hex: "bg-sky-300 border-sky-400" },
  { id: "gold", label: "Hổ Phách", hex: "bg-amber-300 border-amber-400" },
  { id: "emerald", label: "Lục Bảo", hex: "bg-emerald-300 border-emerald-400" },
];

const EMOJIS = ["🌸", "😄", "🥰", "😢", "🥺", "🥹", "✨", "❤️", "🫂"];

export default function ConfessionForm({ isOpen, onClose, onSubmit }: ConfessionFormProps) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [color, setColor] = useState("pink");
  const [emoji, setEmoji] = useState("🌸");
  
  const [lockType, setLockType] = useState("none"); // none, 1m, 6m, 1y, custom
  const [customLockDate, setCustomLockDate] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [aiDetected, setAiDetected] = useState<string | null>(null);

  // Dynamic Local AI Emotion classification as user writes!
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    if (!val.trim()) {
      setAiDetected(null);
      return;
    }
    const result = analyzeEmotion(val);
    setAiDetected(result.emotion);
    setColor(result.color);
    setEmoji(result.emoji);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Nội dung tâm sự không được để trống nhé!");
      return;
    }

    if (content.length > 500) {
      setError("Tâm sự tối đa 500 ký tự thôi nè!");
      return;
    }

    let calculatedUnlockAt: string | null = null;
    const now = new Date();
    if (lockType === "1m") {
      now.setMonth(now.getMonth() + 1);
      calculatedUnlockAt = now.toISOString();
    } else if (lockType === "6m") {
      now.setMonth(now.getMonth() + 6);
      calculatedUnlockAt = now.toISOString();
    } else if (lockType === "1y") {
      now.setFullYear(now.getFullYear() + 1);
      calculatedUnlockAt = now.toISOString();
    } else if (lockType === "custom" && customLockDate) {
      calculatedUnlockAt = new Date(customLockDate).toISOString();
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        author: anonymous || !author.trim() ? "Ẩn danh" : author.trim(),
        content: content.trim(),
        anonymous,
        color,
        emoji,
        unlockAt: calculatedUnlockAt,
      });

      // Clear Form on Success
      setAuthor("");
      setContent("");
      setAnonymous(true);
      setLockType("none");
      setCustomLockDate("");
      onClose();
    } catch {
      setError("Gửi tâm sự thất bại, vui lòng thử lại sau!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          {/* Backdrop click close */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl p-6 md:p-8 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200/50 dark:border-gray-800/50">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-900/40 text-pink-500">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                  Gửi Gắm Tâm Sự
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 text-xs bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              
              {/* Writer name / anonymous toggle */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Người gửi
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setAnonymous(true)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                      anonymous
                        ? "bg-pink-100 border-pink-300 text-pink-600 dark:bg-pink-950 dark:border-pink-800 dark:text-pink-300"
                        : "bg-white/5 border-gray-300/30 text-gray-500 hover:bg-white/10"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Ẩn danh</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnonymous(false)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                      !anonymous
                        ? "bg-pink-100 border-pink-300 text-pink-600 dark:bg-pink-950 dark:border-pink-800 dark:text-pink-300"
                        : "bg-white/5 border-gray-300/30 text-gray-500 hover:bg-white/10"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Công khai danh tính</span>
                  </button>
                </div>

                {!anonymous && (
                  <motion.input
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    type="text"
                    placeholder="Nhập tên đáng yêu của bạn..."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    maxLength={30}
                    className="w-full text-sm px-3.5 py-2 mt-2 rounded-xl bg-white/30 dark:bg-black/20 border border-gray-300/30 outline-none focus:border-pink-400 dark:focus:border-pink-500 text-gray-800 dark:text-gray-100"
                  />
                )}
              </div>

              {/* Content box */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Lời nhắn, cảm xúc của bạn
                  </label>
                  <span className="text-[10px] text-gray-400">
                    {content.length}/500
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Hãy viết ra những suy tư, lời chúc, kỉ niệm buồn vui hoặc những tình cảm giấu kín đang chất chứa trong lòng..."
                  value={content}
                  onChange={handleContentChange}
                  maxLength={500}
                  className="w-full text-sm p-3.5 rounded-xl bg-white/30 dark:bg-black/20 border border-gray-300/30 outline-none focus:border-pink-400 dark:focus:border-pink-500 text-gray-800 dark:text-gray-100 resize-none"
                />
              </div>

              {/* Real-time Local AI Sentiment detector feedback */}
              {aiDetected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 text-xs bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-300 py-1.5 px-3 rounded-lg border border-pink-200/30 w-fit"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-500" />
                  <span>
                    Hệ thống AI nhận thấy bạn đang:{" "}
                    <span className="font-extrabold text-pink-700 dark:text-pink-400">
                      {aiDetected}
                    </span>{" "}
                    ({emoji})
                  </span>
                </motion.div>
              )}

              {/* Select Color & Emoji (Only visible if want custom adjustment) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Envelope Color Picker */}
                <div className="flex flex-col space-y-1.5">
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Màu sắc lá thư
                  </span>
                  <div className="flex items-center flex-wrap gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setColor(c.id)}
                        className={`w-6 h-6 rounded-full border-2 transition ${c.hex} ${
                          color === c.id
                            ? "scale-120 border-gray-800 dark:border-white ring-2 ring-pink-400/50"
                            : "scale-100 opacity-60 hover:opacity-100"
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Sentiment Emoji Picker */}
                <div className="flex flex-col space-y-1.5">
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Emoji cảm xúc
                  </span>
                  <div className="flex items-center flex-wrap gap-1.5">
                    {EMOJIS.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setEmoji(em)}
                        className={`w-7 h-7 rounded flex items-center justify-center text-sm transition ${
                          emoji === em
                            ? "bg-pink-100 border border-pink-300 scale-115 dark:bg-pink-900/60"
                            : "hover:bg-gray-100/50 dark:hover:bg-gray-800/50 opacity-65 hover:opacity-100"
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Special Future Letter Lock ("Lá Thư Tương Lai") */}
              <div className="border-t border-gray-200/50 dark:border-gray-800/50 pt-3 flex flex-col space-y-2">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Lá Thư Tương Lai (Khóa bí mật)
                  </span>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {[
                    { id: "none", label: "Mở ngay" },
                    { id: "1m", label: "1 tháng" },
                    { id: "6m", label: "6 tháng" },
                    { id: "1y", label: "1 năm" },
                    { id: "custom", label: "Tùy chọn" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setLockType(opt.id)}
                      className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition ${
                        lockType === opt.id
                          ? "bg-violet-100 border-violet-300 text-violet-600 dark:bg-violet-950 dark:border-violet-800 dark:text-violet-300"
                          : "bg-white/5 border-gray-300/20 text-gray-500 hover:bg-white/10"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {lockType === "custom" && (
                  <motion.input
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={customLockDate}
                    onChange={(e) => setCustomLockDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-1.5 rounded-lg bg-white/30 dark:bg-black/20 border border-gray-300/30 outline-none focus:border-violet-500 text-gray-700 dark:text-gray-300"
                  />
                )}

                {lockType !== "none" && (
                  <span className="text-[9px] text-violet-500 dark:text-violet-400 bg-violet-500/5 py-1 px-2.5 rounded border border-violet-500/10">
                    🔒 Lời nhắn này sẽ được treo bí ẩn trên cành cây và không một ai xem được nội dung cho đến khi được tự động mở khóa.
                  </span>
                )}
              </div>

              {/* Submit button */}
              <div className="pt-4 border-t border-gray-200/50 dark:border-gray-800/50 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-full text-white bg-gradient-to-r from-pink-500 via-rose-500 to-violet-500 hover:opacity-90 active:scale-98 shadow-md hover:shadow-lg disabled:opacity-50 transition cursor-pointer font-semibold text-xs uppercase tracking-widest outline-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang Gửi Gió...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi Tâm Sự</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

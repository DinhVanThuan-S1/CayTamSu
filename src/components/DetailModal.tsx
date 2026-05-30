"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MessageSquare, Send, Calendar, Clock, Lock, Sparkles } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string | Date;
}

interface Confession {
  id: string;
  author: string;
  content: string;
  anonymous: boolean;
  emoji: string;
  emotion: string;
  color: string;
  createdAt: string | Date;
  unlockAt: string | null | Date;
  likesCount: number;
}

interface DetailModalProps {
  confessionId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onReact: (id: string, type: string) => Promise<void>;
  onAddComment: (id: string, author: string, content: string) => Promise<Comment>;
}

export default function DetailModal({
  confessionId,
  isOpen,
  onClose,
  onReact,
  onAddComment,
}: DetailModalProps) {
  const [confession, setConfession] = useState<Confession | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const heartIdCounter = useRef(0);

  // Fetch confession details when opened
  useEffect(() => {
    if (!confessionId || !isOpen) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/confessions?id=${confessionId}`);
        if (res.ok) {
          const data = await res.json();
          setConfession(data.confession);
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết tâm sự:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [confessionId, isOpen]);

  if (!isOpen) return null;

  const isLocked =
    confession?.unlockAt && new Date(confession.unlockAt) > new Date();

  // Floating heart triggers on reaction click
  const triggerFloatingHeart = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heartIdCounter.current += 1;
    const id = heartIdCounter.current;
    setFloatingHearts((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1500);
  };

  const handleReact = async (type: string, e: React.MouseEvent) => {
    if (!confession) return;
    triggerFloatingHeart(e);
    
    // Optimistic update
    setConfession((prev) =>
      prev ? { ...prev, likesCount: prev.likesCount + 1 } : null
    );

    try {
      await onReact(confession.id, type);
    } catch (err) {
      console.error("Lỗi thả tim:", err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confession || !commentContent.trim()) return;

    setIsSubmittingComment(true);
    try {
      const name = commentAuthor.trim() ? commentAuthor.trim() : "Bạn nhỏ ẩn danh";
      const newComment = await onAddComment(confession.id, name, commentContent.trim());
      
      setComments((prev) => [...prev, newComment]);
      setCommentContent("");
      setCommentAuthor("");
    } catch (err) {
      console.error("Lỗi bình luận:", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const d = new Date(dateString);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
        {/* Backdrop click close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Card Box */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white/85 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl flex flex-col max-h-[85vh] z-10"
        >
          {/* Top glow decoration */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-violet-400" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider animate-pulse">
                Đang gõ cửa ký ức...
              </span>
            </div>
          ) : confession ? (
            <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden md:h-[600px]">
              
              {/* LEFT SIDE: The Letter Content Card */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-200/50 dark:border-gray-800/50 overflow-y-auto">
                <div className="space-y-4">
                  {/* Sender & Date */}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="font-semibold px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300">
                      {confession.author}
                    </span>
                    <span className="flex items-center space-x-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(confession.createdAt)}</span>
                    </span>
                  </div>

                  {/* Emotion Display */}
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-lg">{confession.emoji}</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                      Đang cảm thấy: {confession.emotion}
                    </span>
                  </div>

                  {/* Locked vs Unlocked content container */}
                  {isLocked ? (
                    <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-500 dark:text-violet-400 flex items-center justify-center shadow-md animate-bounce">
                        <Lock className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-extrabold text-violet-700 dark:text-violet-400 uppercase tracking-wide">
                        Lá Thư Tương Lai bị khóa
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[280px] leading-relaxed">
                        Lá thư này được người viết hẹn giờ mở khóa vào tương lai. Trước thời điểm đó, nội dung của nó hoàn toàn nằm trong vòng bí mật.
                      </p>
                      <div className="flex items-center space-x-1.5 text-xs text-violet-500 bg-violet-500/5 py-1 px-3 rounded-full border border-violet-500/10 font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Mở khóa vào: {formatDate(confession.unlockAt!)}</span>
                      </div>
                    </div>
                  ) : (
                    /* The actual text (Healing and Romantic style) */
                    <div className="py-2 text-sm md:text-base leading-relaxed text-gray-700 dark:text-slate-50 select-text font-sans italic break-words">
                      &ldquo;{confession.content}&rdquo;
                    </div>
                  )}
                </div>

                {/* React Actions & Hearts Container */}
                {!isLocked && (
                  <div className="relative pt-6 border-t border-gray-100/50 dark:border-gray-800/50">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Gửi gắm năng lượng yêu thương
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {["❤️", "💖", "🥰", "🌸", "✨"].map((type) => (
                        <button
                          key={type}
                          onClick={(e) => handleReact(type, e)}
                          className="relative w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700 text-sm hover:scale-115 active:scale-95 flex items-center justify-center hover:shadow-md transition cursor-pointer select-none"
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    {/* Floating Hearts Overlay Render */}
                    {floatingHearts.map((heart) => (
                      <motion.div
                        key={heart.id}
                        initial={{ opacity: 1, scale: 0.5, y: heart.y - 10, x: heart.x }}
                        animate={{ opacity: 0, scale: 1.5, y: heart.y - 150 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute text-pink-500 font-bold text-xl pointer-events-none select-none"
                      >
                        ❤️
                      </motion.div>
                    ))}

                    <div className="mt-4 flex items-center space-x-2 text-xs font-semibold text-pink-500">
                      <Heart className="w-4 h-4 fill-pink-500 animate-pulse" />
                      <span>{confession.likesCount} năng lượng được tiếp sức</span>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE: Comments Panel (Scrollable list & add comment) */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-gray-50/50 dark:bg-black/10 overflow-y-auto md:h-full">
                
                {/* Scrollable list of comments */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Lớp bình luận ({comments.length})</span>
                  </div>

                  {comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-xs text-gray-400/80 space-y-2">
                      <Sparkles className="w-6 h-6 text-gray-300 dark:text-gray-700 animate-spin" style={{ animationDuration: "5s" }} />
                      <span>Chưa có lời động viên nào. Hãy để lại sự ấm áp của bạn tại đây nhé!</span>
                    </div>
                  ) : (
                    <div className="space-y-3 pr-2">
                      {comments.map((comm) => (
                        <div
                          key={comm.id}
                          className="p-3.5 rounded-2xl bg-white/50 dark:bg-gray-800/40 border border-gray-100 dark:border-white/5 text-xs text-gray-600 dark:text-gray-300 shadow-sm leading-relaxed"
                        >
                          <div className="flex items-center justify-between font-bold text-gray-700 dark:text-pink-300 mb-1">
                            <span>{comm.author}</span>
                            <span className="text-[9px] font-normal text-gray-400">
                              {formatDate(comm.createdAt)}
                            </span>
                          </div>
                          <span className="break-words select-text">{comm.content}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comment Form box */}
                {!isLocked && (
                  <form
                    onSubmit={handleCommentSubmit}
                    className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-800/50 space-y-2 flex-shrink-0"
                  >
                    <input
                      type="text"
                      placeholder="Tên của bạn (Ẩn danh)..."
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      maxLength={30}
                      className="w-full text-xs py-1.5 px-3 rounded-xl bg-white/30 dark:bg-black/20 border border-gray-200/50 outline-none focus:border-pink-300 text-gray-700 dark:text-gray-200"
                    />
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Hãy gửi lời ôm ấm áp động viên..."
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        maxLength={200}
                        required
                        className="w-full text-xs py-2.5 pl-3 pr-10 rounded-2xl bg-white/30 dark:bg-black/20 border border-gray-200/50 outline-none focus:border-pink-300 text-gray-700 dark:text-gray-200"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingComment}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          ) : (
            <div className="py-20 text-center text-gray-400">Không tìm thấy tâm sự này.</div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

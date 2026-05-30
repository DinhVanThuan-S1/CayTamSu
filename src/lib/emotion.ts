export interface EmotionResult {
  emotion: string;
  emoji: string;
  color: string; // pink, rose, purple, violet, blue, gold, emerald
}

const EMOTIONS: Record<string, EmotionResult> = {
  "Vui vẻ": { emotion: "Vui vẻ", emoji: "😄", color: "gold" },
  "Hạnh phúc": { emotion: "Hạnh phúc", emoji: "🥰", color: "pink" },
  "Buồn": { emotion: "Buồn", emoji: "😢", color: "blue" },
  "Cô đơn": { emotion: "Cô đơn", emoji: "🥺", color: "purple" },
  "Nhớ nhung": { emotion: "Nhớ nhung", emoji: "🥹", color: "violet" },
  "Hy vọng": { emotion: "Hy vọng", emoji: "✨", color: "rose" },
  "Biết ơn": { emotion: "Biết ơn", emoji: "🌸", color: "emerald" },
};

export function analyzeEmotion(content: string): EmotionResult {
  const text = content.toLowerCase();

  // Define keywords for each emotion group
  const keywordMap: { emotion: string; keywords: string[] }[] = [
    {
      emotion: "Hạnh phúc",
      keywords: [
        "hạnh phúc", "yêu", "thương", "sweet", "love", "ngọt ngào", "bên nhau",
        "trọn vẹn", "ấm áp", "ông xã", "bà xã", "anh yêu", "em yêu", "cưới",
        "tình yêu", "đính hôn", "hôn", "moah", "darling", "honey"
      ]
    },
    {
      emotion: "Vui vẻ",
      keywords: [
        "vui", "vui vẻ", "tuyệt vời", "haha", "hihi", "hehe", "yay", "hoan hô",
        "sung sướng", "phấn khởi", "mừng", "thành công", "đỗ", "đậu", "pass",
        "funny", "happy", "cười"
      ]
    },
    {
      emotion: "Buồn",
      keywords: [
        "buồn", "khóc", "đau", "tổn thương", "mệt mỏi", "chán", "nước mắt",
        "sầu", "bi thương", "bế tắc", "áp lực", "stress", "sad", "cry", "chia tay",
        "đau lòng", "thất vọng", "hối hận", "tiếc"
      ]
    },
    {
      emotion: "Cô đơn",
      keywords: [
        "cô đơn", "một mình", "trống trải", "lẻ loi", "lạc lõng", "bơ vơ",
        "đơn độc", "alone", "lonely", "không có ai", "lạnh lẽo", "thất tình"
      ]
    },
    {
      emotion: "Nhớ nhung",
      keywords: [
        "nhớ", "nhớ nhung", "kỷ niệm", "ngày xưa", "mong gặp", "hoài niệm",
        "quá khứ", "miss", "năm ấy", "thuở ấy", "hình bóng", "chờ đợi", "đợi"
      ]
    },
    {
      emotion: "Hy vọng",
      keywords: [
        "hy vọng", "ước", "mong sao", "tương lai", "sẽ tốt", "tin tưởng",
        "niềm tin", "cố lên", "sẽ qua", "tự tin", "hope", "wish", "ngày mai",
        "cố gắng", "quyết tâm"
      ]
    },
    {
      emotion: "Biết ơn",
      keywords: [
        "cảm ơn", "biết ơn", "may mắn", "trân quý", "trân trọng", "biết bao",
        "cảm kích", "tạ ơn", "thiêng liêng", "chữa lành", "yên bình", "bình yên",
        "nhẹ lòng", "thư thái", "thank"
      ]
    }
  ];

  // Count matches for each emotion
  const scores: Record<string, number> = {
    "Vui vẻ": 0,
    "Hạnh phúc": 0,
    "Buồn": 0,
    "Cô đơn": 0,
    "Nhớ nhung": 0,
    "Hy vọng": 0,
    "Biết ơn": 0
  };

  for (const group of keywordMap) {
    for (const word of group.keywords) {
      // Regex check for whole word or boundary match
      const regex = new RegExp(word, "g");
      const matches = text.match(regex);
      if (matches) {
        scores[group.emotion] += matches.length;
      }
    }
  }

  // Find the highest scoring emotion
  let maxEmotion = "Biết ơn"; // Default fallback
  let maxScore = 0;

  for (const [emotion, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxEmotion = emotion;
    }
  }

  // If no keywords matched, default to "Biết ơn" or check for basic punctuation
  if (maxScore === 0) {
    if (text.includes("?") || text.includes("ước") || text.includes("sẽ")) {
      maxEmotion = "Hy vọng";
    } else if (text.includes("!") || text.includes("yêu") || text.includes("thích")) {
      maxEmotion = "Hạnh phúc";
    } else if (text.includes("buồn") || text.includes("mệt")) {
      maxEmotion = "Buồn";
    } else {
      // Choose default based on vibe
      maxEmotion = "Biết ơn";
    }
  }

  return EMOTIONS[maxEmotion];
}

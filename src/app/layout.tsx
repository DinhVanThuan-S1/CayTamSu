import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Cây Tâm Sự | Nơi những tâm sự nở thành ký ức",
  description: "Nền tảng chia sẻ cảm xúc, kỉ niệm và tâm sự dưới dạng cành lá xum xuê của cây cổ thụ ảo chữa lành. Viết lá thư tương lai, thả tim năng lượng và lắng nghe tâm sự từ mọi người.",
  keywords: ["cây tâm sự", "chữa lành", "chia sẻ cảm xúc", "tâm sự ẩn danh", "lá thư tương lai", "thư gửi gió"],
  authors: [{ name: "Cây Tâm Sự Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans select-none">{children}</body>
    </html>
  );
}

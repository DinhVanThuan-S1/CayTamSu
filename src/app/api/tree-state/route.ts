import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Lấy trạng thái phát triển và năng lượng của Cây Tâm Sự
export async function GET() {
  try {
    let treeState = await prisma.treeState.findUnique({
      where: { id: "global-tree" },
    });

    // Nếu chưa có (ví dụ DB rỗng), khởi tạo giá trị mặc định
    if (!treeState) {
      const totalLetters = await prisma.confession.count();
      
      // Tính toán cấp độ cây
      let treeLevel = 1;
      if (totalLetters > 300) treeLevel = 5;
      else if (totalLetters > 100) treeLevel = 4;
      else if (totalLetters > 50) treeLevel = 3;
      else if (totalLetters > 20) treeLevel = 2;

      treeState = await prisma.treeState.create({
        data: {
          id: "global-tree",
          totalLetters,
          totalLoveEnergy: totalLetters, // Mặc định năng lượng bằng số thư
          treeLevel,
        },
      });
    }

    return NextResponse.json({ treeState });
  } catch (error) {
    console.error("Lỗi GET treeState:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";

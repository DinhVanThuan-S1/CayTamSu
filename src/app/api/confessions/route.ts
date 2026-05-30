import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeEmotion } from "@/lib/emotion";

// GET: Lấy toàn bộ thư (cho Cây) hoặc chi tiết 1 thư (kèm Bình luận)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Lấy chi tiết một confession kèm bình luận và reactions
      const confession = await prisma.confession.findUnique({
        where: { id },
      });

      if (!confession) {
        return NextResponse.json(
          { error: "Không tìm thấy tâm sự" },
          { status: 404 }
        );
      }

      const comments = await prisma.comment.findMany({
        where: { confessionId: id },
        orderBy: { createdAt: "asc" },
      });

      const reactions = await prisma.reaction.findMany({
        where: { confessionId: id },
      });

      return NextResponse.json({ confession, comments, reactions });
    }

    // Lấy danh sách toàn bộ thư để treo lên cây và hiển thị ký ức
    const confessions = await prisma.confession.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ confessions });
  } catch (error) {
    console.error("Lỗi GET confessions:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}

// POST: Tạo một lá thư mới treo lên cành ngẫu nhiên
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { author, content, anonymous, unlockAt } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Nội dung không được để trống" },
        { status: 400 }
      );
    }

    // Phân tích cảm xúc tự động bằng Local AI
    const emotionResult = analyzeEmotion(content);

    // Tính toán cành và tọa độ treo ngẫu nhiên tự nhiên
    const branchIndex = Math.floor(Math.random() * 7); // 7 cành từ 0 -> 6
    const positionX = Math.floor(Math.random() * 65) + 20; // 20% -> 85% dọc cành để tránh mép biên
    const positionY = Math.floor(Math.random() * 15) + 2; // Offset dọc từ 2 -> 17

    // Tạo Confession mới
    const confession = await prisma.confession.create({
      data: {
        author: anonymous || !author ? "Ẩn danh" : author,
        content: content.trim(),
        anonymous: anonymous ?? true,
        emoji: emotionResult.emoji,
        emotion: emotionResult.emotion,
        color: emotionResult.color,
        positionX,
        positionY,
        branchIndex,
        unlockAt: unlockAt ? new Date(unlockAt) : null,
      },
    });

    // Cập nhật trạng thái cây toàn cục (TreeState)
    const totalLetters = await prisma.confession.count();
    
    // Tổng năng lượng = Số thư + Tổng các reactions/likes
    const confessions = await prisma.confession.findMany({ select: { likesCount: true } });
    const totalLikes = confessions.reduce((sum, c) => sum + c.likesCount, 0);
    const totalLoveEnergy = totalLetters + totalLikes;

    // Tính toán Cấp độ cây dựa trên mốc số lượng thư
    let treeLevel = 1;
    if (totalLetters > 300) treeLevel = 5;
    else if (totalLetters > 100) treeLevel = 4;
    else if (totalLetters > 50) treeLevel = 3;
    else if (totalLetters > 20) treeLevel = 2;

    await prisma.treeState.upsert({
      where: { id: "global-tree" },
      update: {
        totalLetters,
        totalLoveEnergy,
        treeLevel,
      },
      create: {
        id: "global-tree",
        totalLetters,
        totalLoveEnergy,
        treeLevel,
      },
    });

    return NextResponse.json({ confession, treeLevel, totalLoveEnergy });
  } catch (error) {
    console.error("Lỗi POST confessions:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}

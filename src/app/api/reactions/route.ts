import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST: Thả cảm xúc cho lá thư & tăng Năng lượng yêu thương toàn cục
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { confessionId, type } = body;

    if (!confessionId || !type) {
      return NextResponse.json(
        { error: "Thiếu thông tin thả cảm xúc" },
        { status: 400 }
      );
    }

    // 1. Tạo bản ghi Reaction
    await prisma.reaction.create({
      data: {
        confessionId,
        type,
      },
    });

    // 2. Tăng likesCount trong Confession tương ứng
    const updatedConfession = await prisma.confession.update({
      where: { id: confessionId },
      data: {
        likesCount: { increment: 1 },
      },
    });

    // 3. Tăng tổng năng lượng yêu thương toàn cục (totalLoveEnergy) trong TreeState
    const treeState = await prisma.treeState.findUnique({
      where: { id: "global-tree" },
    });

    if (treeState) {
      await prisma.treeState.update({
        where: { id: "global-tree" },
        data: {
          totalLoveEnergy: { increment: 1 },
        },
      });
    } else {
      // Nếu chưa có trạng thái, tạo mới
      const totalLetters = await prisma.confession.count();
      await prisma.treeState.create({
        data: {
          id: "global-tree",
          totalLetters,
          totalLoveEnergy: totalLetters + 1,
          treeLevel: 1,
        },
      });
    }

    return NextResponse.json({
      success: true,
      likesCount: updatedConfession.likesCount,
    });
  } catch (error) {
    console.error("Lỗi POST reactions:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}

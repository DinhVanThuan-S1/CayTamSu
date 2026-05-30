import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST: Viết bình luận mới cho lá thư
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { confessionId, author, content } = body;

    if (!confessionId) {
      return NextResponse.json(
        { error: "Thiếu ID tâm sự để bình luận" },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Nội dung bình luận trống" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        confessionId,
        author: author && author.trim() ? author.trim() : "Bạn nhỏ ẩn danh",
        content: content.trim(),
      },
    });

    return NextResponse.json({ comment });
  } catch (error) {
    console.error("Lỗi POST comments:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}

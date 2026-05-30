import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu dọn dẹp cơ sở dữ liệu cũ...");
  await prisma.comment.deleteMany({});
  await prisma.reaction.deleteMany({});
  await prisma.confession.deleteMany({});
  await prisma.treeState.deleteMany({});

  console.log("🌿 Đang tạo hạt giống tâm sự ban đầu...");

  const initialConfessions = [
    {
      author: "Hoài Nam",
      content: "Nhớ những ngày cùng em đi qua những con phố mùa thu Hà Nội, tiếng lá vàng xào xạc dưới chân, nụ cười của em hôm đó sưởi ấm cả một mùa đông lạnh lẽo sau này.",
      anonymous: false,
      emoji: "🥹",
      emotion: "Nhớ nhung",
      color: "violet",
      positionX: 32,
      positionY: 42,
      branchIndex: 0,
      likesCount: 12,
    },
    {
      author: "Hà Chi",
      content: "Đỗ đại học rồi!!! Cảm ơn bố mẹ đã luôn thức khuya dậy sớm lo lắng cho con. Con sẽ cố gắng học tập thật tốt tại ngôi trường mới!",
      anonymous: false,
      emoji: "😄",
      emotion: "Vui vẻ",
      color: "gold",
      positionX: 68,
      positionY: 35,
      branchIndex: 1,
      likesCount: 8,
    },
    {
      author: "Ẩn danh",
      content: "Có những đêm sài gòn mưa tầm tã, ngồi một mình trong căn gác trọ nhỏ, tự hỏi không biết mình đang cố gắng vì điều gì nữa... Cảm thấy cô đơn quá.",
      anonymous: true,
      emoji: "🥺",
      emotion: "Cô đơn",
      color: "purple",
      positionX: 25,
      positionY: 28,
      branchIndex: 2,
      likesCount: 15,
    },
    {
      author: "Minh Quân",
      content: "Yêu em từ cái nhìn đầu tiên. Tròn 3 năm bên nhau, hôm nay anh sẽ cầu hôn em. Mong rằng chúng ta sẽ cùng viết tiếp câu chuyện tình yêu này trọn đời.",
      anonymous: false,
      emoji: "🥰",
      emotion: "Hạnh phúc",
      color: "pink",
      positionX: 52,
      positionY: 22,
      branchIndex: 3,
      likesCount: 22,
    },
    {
      author: "Ẩn danh",
      content: "Mong rằng kỳ thi sắp tới của cả lớp mình ai cũng đạt kết quả thật cao nhé! Cố lên nào mọi người ơi, tương lai tươi sáng đang chờ đón chúng ta!",
      anonymous: true,
      emoji: "✨",
      emotion: "Hy vọng",
      color: "rose",
      positionX: 75,
      positionY: 45,
      branchIndex: 4,
      likesCount: 5,
    },
    {
      author: "Mỹ Linh",
      content: "Con biết ơn vì mỗi sớm mai thức dậy vẫn thấy bố mẹ khỏe mạnh, gia đình ta vẫn luôn ngập tràn tiếng cười. Đó là điều may mắn nhất thế gian.",
      anonymous: false,
      emoji: "🌸",
      emotion: "Biết ơn",
      color: "emerald",
      positionX: 42,
      positionY: 30,
      branchIndex: 1,
      likesCount: 18,
    },
    {
      author: "Ẩn danh",
      content: "Hôm nay mình bị sếp mắng vì một lỗi nhỏ không đáng có. Cảm thấy mệt mỏi và chỉ muốn khóc một trận thật to cho nhẹ lòng...",
      anonymous: true,
      emoji: "😢",
      emotion: "Buồn",
      color: "blue",
      positionX: 18,
      positionY: 55,
      branchIndex: 2,
      likesCount: 9,
    },
    {
      author: "Duy Khánh",
      content: "Học kỳ này đạt học bổng xuất sắc rồi! Cảm giác bao nhiêu công sức cày cuốc đêm khuya cuối cùng cũng được đền đáp xứng đáng. Thật tuyệt vời!",
      anonymous: false,
      emoji: "😄",
      emotion: "Vui vẻ",
      color: "gold",
      positionX: 58,
      positionY: 48,
      branchIndex: 3,
      likesCount: 6,
    },
    {
      author: "Ẩn danh",
      content: "Ước gì có một cỗ máy thời gian để quay trở về những ngày tháng cấp 3 vô tư hồn nhiên ấy, được ngồi tán gẫu cùng đám bạn thân dưới mái trường xưa.",
      anonymous: true,
      emoji: "🥹",
      emotion: "Nhớ nhung",
      color: "violet",
      positionX: 47,
      positionY: 58,
      branchIndex: 0,
      likesCount: 14,
    },
    {
      author: "Phương Vy",
      content: "Ngày đầu tiên nhận lương, mình đã mua tặng mẹ một chiếc áo khoác ấm và bố một cốc cà phê ngon. Nhìn thấy nụ cười của bố mẹ, mình thấy ấm áp vô cùng.",
      anonymous: false,
      emoji: "🥰",
      emotion: "Hạnh phúc",
      color: "pink",
      positionX: 38,
      positionY: 22,
      branchIndex: 4,
      likesCount: 20,
    }
  ];

  console.log("💾 Đang ghi dữ liệu vào database...");
  for (const c of initialConfessions) {
    const confession = await prisma.confession.create({
      data: {
        author: c.author,
        content: c.content,
        anonymous: c.anonymous,
        emoji: c.emoji,
        emotion: c.emotion,
        color: c.color,
        positionX: c.positionX,
        positionY: c.positionY,
        branchIndex: c.branchIndex,
        likesCount: c.likesCount,
      }
    });

    // Thêm một số bình luận ngẫu nhiên cho sinh động
    if (c.emotion === "Nhớ nhung") {
      await prisma.comment.create({
        data: {
          confessionId: confession.id,
          author: "Hồng Nhung",
          content: "Đọc những dòng này thấy bồi hồi quá cậu ơi, kỷ niệm luôn là thứ đẹp nhất.",
        }
      });
    } else if (c.emotion === "Buồn") {
      await prisma.comment.create({
        data: {
          confessionId: confession.id,
          author: "Bạn Nhỏ Ẩn Danh",
          content: "Cố lên bạn nhé, giông bão qua đi rồi nắng ấm sẽ lại về thôi!",
        }
      });
    } else if (c.emotion === "Hạnh phúc") {
      await prisma.comment.create({
        data: {
          confessionId: confession.id,
          author: "Khánh Linh",
          content: "Ngưỡng mộ tình yêu của hai bạn quá! Chúc hai bạn mãi hạnh phúc nhé!",
        }
      });
    }

    // Tạo một số reactions mẫu
    const reactionTypes = ["❤️", "💖", "🥰", "🌸", "✨"];
    const reactionCount = Math.floor(Math.random() * 3) + 1; // 1-3 reactions
    for (let r = 0; r < reactionCount; r++) {
      await prisma.reaction.create({
        data: {
          confessionId: confession.id,
          type: reactionTypes[Math.floor(Math.random() * reactionTypes.length)],
        }
      });
    }
  }

  // Tính toán tổng số năng lượng yêu thương và tổng thư
  const totalLetters = initialConfessions.length;
  // Mỗi confession đóng góp +1 điểm và mỗi likeCount đóng góp +1 điểm
  const totalLoveEnergy = totalLetters + initialConfessions.reduce((sum, c) => sum + c.likesCount, 0);
  
  // Xác định cấp độ cây dựa trên số lượng thư
  let treeLevel = 1;
  if (totalLetters > 300) treeLevel = 5;
  else if (totalLetters > 100) treeLevel = 4;
  else if (totalLetters > 50) treeLevel = 3;
  else if (totalLetters > 20) treeLevel = 2;

  await prisma.treeState.create({
    data: {
      id: "global-tree",
      totalLetters,
      totalLoveEnergy,
      treeLevel,
    }
  });

  console.log("🌳 Khởi tạo trạng thái cây thành công!");
  console.log(`- Tổng số thư: ${totalLetters}`);
  console.log(`- Tổng năng lượng: ${totalLoveEnergy}`);
  console.log(`- Cấp độ cây: ${treeLevel}`);
  console.log("🎉 Seed dữ liệu HOÀN THÀNH!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

# 🌸 Cây Tâm Sự - Nơi những tâm sự nở thành ký ức

Chào mừng bạn đến với **Cây Tâm Sự**, một ứng dụng web Full-Stack hiện đại giúp người dùng chia sẻ những xúc cảm chân thành, lời chúc, kỉ niệm buồn vui hoặc những tình cảm giấu kín vào gió dưới dạng các lá thư đung đưa lấp lánh trên một ngọn cây đại thụ ảo tuyệt đẹp.

Dự án được xây dựng chuẩn chỉ, sạch sẽ và tối ưu hóa tuyệt đối bằng công nghệ **Next.js 15 (App Router)**, **React 19**, **Prisma ORM**, **Tailwind CSS v4** và **Framer Motion**.

---

## ✨ Các Tính Năng Nổi Bật

1. **Cổ Thụ Xúc Cảm SVG (Interactive Tree)**: Cây sways đung đưa mềm mại trước gió bằng CSS Keyframes. Cây tự động sinh sôi cành lá và phát sáng rực rỡ qua 5 mốc cấp độ tương ứng với số lượng thư gửi về.
2. **Double Ambient Canvas Engine**: Tự động nhận diện giờ địa phương. Ban ngày rơi mưa hoa anh đào bay nhẹ (Sakura rain), ban đêm xuất hiện đom đóm bioluminescent bay lượn và mưa sao băng rơi nhanh cực kỳ thơ mộng.
3. **Local Emotion AI**: Tự động phân tích tâm tư người viết bằng NLP từ khóa Tiếng Việt chạy mượt mà ngay trên máy chủ để gán emoji và màu sắc phù hợp (*Vui vẻ, Hạnh phúc, Buồn, Cô đơn, Nhớ nhung, Hy vọng, Biết ơn*).
4. **Lá Thư Tương Lai (Khóa bí mật)**: Hẹn giờ mở khóa thư trong tương lai (1 tháng, 6 tháng, 1 năm hoặc ngày tùy chọn). Trước thời điểm đó, nội dung thư được bảo vệ và hiển thị dưới dạng ổ khóa `🔒` lấp lánh.
5. **Ký Ức Timelines**: Trang lưu trữ Ký ức với bộ lọc tìm kiếm nội dung, cảm xúc, chế độ Công khai/Ẩn danh và sắp xếp thời gian tiện lợi.
6. **Double Database Adapter**: Chạy SQLite cục bộ cực nhanh không cần cài đặt, dễ dàng chuyển sang PostgreSQL trực tuyến (Neon/Supabase) bằng cách thay đổi provider trong Schema.

---

## 💻 Hướng Dẫn Chạy Dưới Máy Cục Bộ (Local Run)

Làm theo 3 bước cực kỳ đơn giản sau để chạy ứng dụng ngay lập tức:

### Bước 1: Tải các dependencies
Mở Terminal tại thư mục gốc dự án và chạy:
```bash
npm install
```

### Bước 2: Khởi tạo database SQLite và nạp dữ liệu mẫu
Hệ thống sử dụng SQLite mặc định để bạn chạy thử nghiệm tức thì mà không cần cài đặt PostgreSQL. Chạy lệnh sau để đồng bộ hóa cấu trúc bảng và seed sẵn 10 confession đầy chất thơ:
```bash
npx prisma db push
npx prisma db seed
```
*(Bạn sẽ nhận được thông báo: `🎉 Seed dữ liệu HOÀN THÀNH!`)*

### Bước 3: Khởi chạy máy chủ phát triển
Khởi động dự án ở môi trường local development:
```bash
npm run dev
```
Mở trình duyệt và truy cập: **[http://localhost:3000](http://localhost:3000)** để trải nghiệm tuyệt tác!

---

## 🚀 Hướng Dẫn Deploy Lên Vercel & Kết Nối PostgreSQL trực tuyến

Khi đã sẵn sàng đưa sản phẩm của bạn lên internet cho mọi người cùng gửi gắm tâm sự, hãy làm theo quy trình chuẩn sau:

### Bước 1: Khởi tạo database PostgreSQL trực tuyến miễn phí
1. Truy cập **[Neon.tech](https://neon.tech/)** hoặc **[Supabase.com](https://supabase.com/)** và đăng ký một tài khoản miễn phí.
2. Tạo một project mới và chọn khu vực database gần bạn nhất (ví dụ Singapore).
3. Sao chép chuỗi kết nối Database Connection String, ví dụ:
   `postgresql://username:password@ep-cool-butterfly-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`

### Bước 2: Chuyển đổi provider trong Schema Prisma sang PostgreSQL
1. Mở tệp `prisma/schema.prisma`
2. Thay đổi giá trị `provider` trong block `datasource db` thành `"postgresql"`:
   ```prisma
   // prisma/schema.prisma
   
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

### Bước 3: Đưa mã nguồn lên GitHub cá nhân của bạn
1. Khởi tạo Git tại thư mục dự án và commit mã nguồn:
   ```bash
   git init
   git add .
   git commit -m "feat: complete cay tam su full-stack project"
   ```
2. Tạo một Repository mới trên GitHub và push mã nguồn của bạn lên đó.

### Bước 4: Deploy lên Vercel
1. Đăng nhập vào **[Vercel.com](https://vercel.com/)** bằng tài khoản GitHub của bạn.
2. Chọn **"Add New"** -> **"Project"**, chọn repository **cay-tam-su** bạn vừa tải lên.
3. Trong phần **Environment Variables**, cấu hình biến sau:
   - **Key**: `DATABASE_URL`
   - **Value**: *Chuỗi kết nối database PostgreSQL trực tuyến của bạn ở Bước 1.*
4. Bật mục **"Override Build Command"** trong mục Build & Development Settings và thay thế bằng câu lệnh sau để Vercel tự động khởi chạy database trực tuyến trước khi build:
   ```bash
   npx prisma db push && npm run build
   ```
5. Nhấn nút **Deploy** và tận hưởng kết quả chỉ trong chưa đầy một phút!

---

## 📁 Tổ Chức Mã Nguồn (Codebase Structure)

- `prisma/schema.prisma`: Schema định nghĩa các thực thể dữ liệu Confession, Comment, Reaction, TreeState.
- `src/app/page.tsx`: Trang chủ chứa đồ họa Cây Tâm Sự sways, stats Năng lượng, và tích hợp sự kiện bay lá thư.
- `src/app/memory/page.tsx`: Trang timelines lưu trữ ký ức kèm thanh tìm kiếm và bộ lọc đa năng.
- `src/app/api/`: Các endpoint API Routes xử lý đọc/ghi confessions, comments, reactions và tree level.
- `src/components/CanvasBackground.tsx`: Hệ hạt Canvas 2D mượt mà cho mưa hoa đào, đom đóm và sao băng.
- `src/components/ConfessionTree.tsx`: Vẽ cây bằng SVG động, tính toán tọa độ treo ngẫu nhiên dọc theo cành cây.
- `src/components/ConfessionForm.tsx`: Modal viết thư, chọn phong bì, hẹn giờ khóa và gợi ý cảm xúc thời gian thực.
- `src/components/DetailModal.tsx`: Popup đọc thư, thả các biểu cảm cảm xúc và viết bình luận.
- `src/lib/emotion.ts`: Trái tim AI cục bộ phân tích cảm xúc từ khóa Tiếng Việt siêu nhanh.

---

### ❤️ Chúc bạn có những giây phút trải nghiệm ngập tràn cảm xúc cùng Cây Tâm Sự!

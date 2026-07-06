# 🚀 Hướng dẫn chạy dự án TOEIC Ace AI trên VS Code

## 📋 Yêu cầu

| Tool | Version | Link tải |
|------|---------|----------|
| **Node.js** | ≥ 20 LTS | https://nodejs.org |
| **VS Code** | Mới nhất | https://code.visualstudio.com |
| **Git** | Mới nhất | https://git-scm.com |
| **Ollama** (tùy chọn AI offline) | Mới nhất | https://ollama.com/download |

---

## 📦 Bước 1: Tải dự án

### Cách 1: Tải ZIP
1. Tải file ZIP từ GitHub
2. Giải nén vào thư mục, ví dụ: `D:\toeic-ace-ai`
3. Mở VS Code → File → Open Folder → chọn thư mục vừa giải nén

### Cách 2: Clone bằng Git
```bash
git clone https://github.com/your-username/toeic-ace-ai.git
cd toeic-ace-ai
```

---

## 🔧 Bước 2: Cài dependencies

Mở Terminal trong VS Code (Ctrl + `):

```bash
# Dùng npm (mặc định)
npm install

# HOẶC dùng bun (nhanh hơn — khuyến nghị)
# Cài bun: https://bun.sh
bun install
```

---

## ⚙️ Bước 3: Cấu hình môi trường

Tạo file `.env` (copy từ `.env.example`):

```bash
# Copy file mẫu
cp .env.example .env
```

Mở file `.env` và chỉnh:

```env
# Database (mặc định dùng SQLite — không cần cài thêm)
DATABASE_URL="file:./db/custom.db"

# Auth (đổi secret thành chuỗi random)
NEXTAUTH_SECRET="đổi-thành-chuỗi-random-của-bạn"
NEXTAUTH_URL="http://localhost:3000"

# AI Provider — chọn 1 trong các cách:

# Cách 1: Ollama local (MIỄN PHÍ, OFFLINE — khuyến nghị)
OLLAMA_BASE_URL="http://localhost:11434/v1"
OLLAMA_MODEL="qwen2.5:3b"

# Cách 2: Không cấu hình AI → dùng ZAI (chỉ hoạt động trong sandbox Z.ai)
# Để trống OLLAMA_BASE_URL nếu không dùng AI offline
```

---

## 🗄️ Bước 4: Setup database

```bash
# Tạo database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Tạo tài khoản Admin
node -e "const{PrismaClient}=require('@prisma/client');const bcrypt=require('bcryptjs');const p=new PrismaClient();(async()=>{const h=await bcrypt.hash('admin123',10);await p.user.upsert({where:{email:'admin@toeic.com'},update:{role:'ADMIN',passwordHash:h},create:{email:'admin@toeic.com',name:'Admin',passwordHash:h,role:'ADMIN'}});console.log('✅ Admin created');await p.\$disconnect()})()"
```

---

## 📚 Bước 5: Nhập dữ liệu (seed)

```bash
# Seed tất cả nội dung TOEIC
npx tsx scripts/seed.ts
npx tsx scripts/seed-vocab-levels.ts
npx tsx scripts/seed-exercises.ts

# Seed 3 đề Reading Test (nếu có)
npx tsx scripts/seed-rc-test1.ts
npx tsx scripts/seed-rc-test2.ts
npx tsx scripts/seed-rc-test3.ts

# Seed đề Part 5 từ ảnh
npx tsx scripts/seed-image-test.ts
```

---

## 🤖 Bước 6: (Tùy chọn) Cài AI offline

```bash
# Cài Ollama
# macOS/Linux:
curl -fsSL https://ollama.com/install.sh | sh

# Windows: tải installer từ https://ollama.com/download

# Tải model Qwen 2.5 3B (~2GB)
ollama pull qwen2.5:3b

# Chạy Ollama server (mở terminal riêng)
ollama serve
```

---

## ▶️ Bước 7: Chạy web

```bash
# Dùng npm
npm run dev

# HOẶC dùng bun
bun run dev
```

→ Mở trình duyệt: **http://localhost:3000** ✅

---

## 🔑 Tài khoản Admin

| Thông tin | Giá trị |
|-----------|---------|
| Email | `admin@toeic.com` |
| Mật khẩu | `admin123` |

---

## 🐛 Xử lý lỗi thường gặp

### Lỗi: `Cannot find module '@prisma/client'`
```bash
npx prisma generate
```

### Lỗi: `Database not found`
```bash
npx prisma db push
```

### Lỗi: `Module not found`
```bash
# Xóa node_modules và cài lại
rm -rf node_modules
npm install
```

### Lỗi: `Port 3000 already in use`
```bash
# Đổi port
npm run dev -- -p 3001
```

### Lỗi: Hydration mismatch
→ Do extension Google Translate. Tắt extension hoặc thêm `translate="no"` vào `<html>` (đã có sẵn).

### AI không hoạt động
→ Kiểm tra Ollama đang chạy:
```bash
ollama serve
# Test:
curl http://localhost:11434/api/tags
```

---

## 📁 Cấu trúc dự án

```
toeic-ace-ai/
├── src/
│   ├── app/                    # Routes + API
│   │   ├── api/                # Backend (25 API routes)
│   │   ├── page.tsx            # Frontend entry
│   │   ├── layout.tsx          # Layout gốc
│   │   └── globals.css         # CSS global
│   ├── components/             # UI Components
│   │   ├── admin/              # Admin Panel
│   │   ├── ai/                 # AI Tutor + Tools
│   │   ├── auth/               # Đăng nhập + Auth Guard
│   │   ├── dashboard/          # Dashboard học viên
│   │   ├── home/               # Trang chủ
│   │   ├── learn/              # Grammar + Vocab + Pronunciation
│   │   ├── practice/           # Luyện đề + Kết quả
│   │   ├── pronunciation/      # Luyện phát âm
│   │   ├── site/               # Navbar, Footer, Theme
│   │   └── ui/                 # shadcn/ui components
│   ├── lib/                    # Helpers
│   │   ├── ai.ts               # AI adapter (Ollama/ZAI/OpenAI...)
│   │   ├── auth/               # NextAuth config
│   │   ├── db.ts               # Prisma client
│   │   ├── router.tsx          # Client-side router
│   │   └── score.ts            # TOEIC score calculation
│   └── data/                   # Data files
│       ├── ets-exams.ts        # Config đề ETS
│       └── pronunciation-examples.ts  # 44 âm IPA
├── prisma/
│   └── schema.prisma           # Database schema
├── scripts/                    # Seed scripts
├── public/                     # Static files
├── .env                        # Environment variables
├── package.json
└── README.md
```

---

## ✅ Checklist chạy thành công

- [ ] Node.js 20+ đã cài
- [ ] `npm install` thành công
- [ ] `.env` đã cấu hình
- [ ] `npx prisma db push` thành công
- [ ] Seed dữ liệu thành công
- [ ] `npm run dev` chạy được
- [ ] http://localhost:3000 mở được
- [ ] Đăng nhập admin@toeic.com / admin123 được
- [ ] (Tùy chọn) Ollama chạy được → AI hoạt động

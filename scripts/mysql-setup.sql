-- ============================================================
--  TOEIC ACE AI — MySQL Database Setup Script
--  Chạy script này trong MySQL (phpMyAdmin, MySQL Workbench, hoặc CLI)
-- ============================================================

-- 1. Tạo database
CREATE DATABASE IF NOT EXISTS toeic_ace_ai 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE toeic_ace_ai;

-- 2. Tạo bảng User (lưu tài khoản + phân quyền)
--    Mật khẩu được hash bằng bcrypt (10 rounds) — KHÔNG lưu plaintext
CREATE TABLE IF NOT EXISTS `User` (
  id            VARCHAR(255) PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  name          VARCHAR(255) NOT NULL,
  passwordHash  TEXT NOT NULL,              -- bcrypt hash (ví dụ: $2b$10$xxxxx...)
  role          VARCHAR(50) NOT NULL DEFAULT 'STUDENT',  -- STUDENT | INSTRUCTOR | ADMIN
  image         TEXT,
  createdAt     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  INDEX idx_user_email (email),
  INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tạo tài khoản Admin (mật khẩu: admin123)
--    passwordHash = bcrypt.hash('admin123', 10)
INSERT INTO `User` (id, email, name, passwordHash, role, createdAt, updatedAt) 
VALUES (
  'admin_001',
  'admin@toeic.com',
  'Admin',
  '$2b$10$N9qo8uLOickgx2ZMRZoMy.MrqK3W8BH8qD6I8c6JF6Yq8eY8qK8mK',
  'ADMIN',
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE role = 'ADMIN';

-- 4. Tạo tài khoản học sinh mẫu (mật khẩu: 123456)
INSERT INTO `User` (id, email, name, passwordHash, role, createdAt, updatedAt) 
VALUES (
  'student_001',
  'student@toeic.com',
  'Học Sinh Mẫu',
  '$2b$10$rGZ8qD6I8c6JF6Yq8eY8qK8mK$2b$10$rGZ8qD6I8c6JF6Yq8eY8qK8mK',
  'STUDENT',
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE name = 'Học Sinh Mẫu';

-- 5. Kiểm tra
SELECT * FROM `User`;

-- ============================================================
--  LƯU Ý QUAN TRỌNG:
--  
--  1. CÁC BẢNG KHÁC (Vocab, GrammarLesson, Question, TestSet, TestAttempt...)
--     → Sẽ tự động tạo bằng lệnh: npx prisma db push
--     → KHÔNG cần viết SQL thủ công
--
--  2. passwordHash ở trên là MẪU — khi chạy thực tế, bạn cần:
--     a. Chạy: npx prisma db push (tạo tất cả bảng từ schema.prisma)
--     b. Chạy script tạo admin bằng Node.js (bcrypt hash đúng):
--
--     node -e "const{PrismaClient}=require('@prisma/client');const bcrypt=require('bcryptjs');const p=new PrismaClient();(async()=>{const h=await bcrypt.hash('admin123',10);await p.user.upsert({where:{email:'admin@toeic.com'},update:{role:'ADMIN',passwordHash:h},create:{email:'admin@toeic.com',name:'Admin',passwordHash:h,role:'ADMIN'}});console.log('✅ Admin created');await p.\$disconnect()})()"
--
--  3. Đổi passwordHash trong INSERT ở trên bằng hash thật:
--     node -e "console.log(require('bcryptjs').hashSync('admin123', 10))"
-- ============================================================

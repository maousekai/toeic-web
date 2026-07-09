-- ============================================================
--  TOEIC ACE AI — MySQL Database Setup Script
--  Chạy trong: phpMyAdmin / MySQL Workbench / MySQL CLI
-- ============================================================

-- 1. Tạo database
CREATE DATABASE IF NOT EXISTS toeic_ace_ai 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE toeic_ace_ai;

-- 2. Xóa bảng cũ (nếu có) để tạo lại sạch
DROP TABLE IF EXISTS `TestAttempt`;
DROP TABLE IF EXISTS `Learner`;
DROP TABLE IF EXISTS `GrammarExercise`;
DROP TABLE IF EXISTS `GrammarLesson`;
DROP TABLE IF EXISTS `Strategy`;
DROP TABLE IF EXISTS `Question`;
DROP TABLE IF EXISTS `TestSet`;
DROP TABLE IF EXISTS `Vocab`;
DROP TABLE IF EXISTS `User`;

-- 3. Tạo bảng User — Lưu tài khoản + mật khẩu + phân quyền
CREATE TABLE `User` (
  id            VARCHAR(255) PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,           -- Email đăng nhập (không trùng)
  name          VARCHAR(255) NOT NULL,                   -- Tên hiển thị
  passwordHash  TEXT NOT NULL,                           -- Mật khẩu đã mã hóa bcrypt
  role          ENUM('STUDENT', 'INSTRUCTOR', 'ADMIN')   -- 3 quyền: STUDENT, INSTRUCTOR, ADMIN
                NOT NULL 
                DEFAULT 'STUDENT',                       -- Mặc định: STUDENT
  image         TEXT,                                    -- Ảnh đại diện (tùy chọn)
  createdAt     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tạo bảng Learner — Lưu thông tin học viên
CREATE TABLE `Learner` (
  id            VARCHAR(255) PRIMARY KEY,
  name          VARCHAR(255),
  targetScore   INT,
  userId        VARCHAR(255),                            -- Liên kết với User (nullable)
  createdAt     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_learner_user FOREIGN KEY (userId) REFERENCES `User`(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tạo bảng TestAttempt — Lưu kết quả bài thi
CREATE TABLE `TestAttempt` (
  id                VARCHAR(255) PRIMARY KEY,
  learnerId         VARCHAR(255) NOT NULL,
  testSetId         VARCHAR(255),
  testSetTitle      VARCHAR(500),
  type              VARCHAR(100),
  startedAt         DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  finishedAt        DATETIME(3),
  durationSec       INT,
  answers           TEXT,                                -- JSON: [{questionId, selected}]
  totalQuestions    INT DEFAULT 0,
  correctCount      INT DEFAULT 0,
  listeningCorrect  INT,
  readingCorrect    INT,
  score             INT,                                 -- Điểm TOEIC 10-990
  listeningScore    INT,
  readingScore      INT,
  CONSTRAINT fk_attempt_learner FOREIGN KEY (learnerId) REFERENCES `Learner`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tạo bảng Vocab — Từ vựng TOEIC
CREATE TABLE `Vocab` (
  id            VARCHAR(255) PRIMARY KEY,
  word          VARCHAR(255) NOT NULL,
  phonetic      VARCHAR(255),
  partOfSpeech  VARCHAR(100) NOT NULL,
  definition    TEXT NOT NULL,
  example       TEXT,
  translation   VARCHAR(500),
  category      VARCHAR(100) DEFAULT 'general',
  level         VARCHAR(10) DEFAULT 'A1',                -- A0, A1, A2, B1, B2, C1, C2
  difficulty    INT DEFAULT 1,
  createdAt     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tạo bảng GrammarLesson — Bài ngữ pháp
CREATE TABLE `GrammarLesson` (
  id        VARCHAR(255) PRIMARY KEY,
  title     VARCHAR(500) NOT NULL,
  slug      VARCHAR(255) NOT NULL UNIQUE,
  category  VARCHAR(100),
  level     VARCHAR(50) DEFAULT 'intermediate',
  summary   TEXT,
  content   TEXT,                                       -- Markdown
  example   TEXT,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tạo bảng GrammarExercise — Bài tập ngữ pháp
CREATE TABLE `GrammarExercise` (
  id          VARCHAR(255) PRIMARY KEY,
  lessonId    VARCHAR(255) NOT NULL,
  question    TEXT NOT NULL,
  options     TEXT NOT NULL,                             -- JSON array
  answer      INT NOT NULL,
  explanation TEXT,
  `order`     INT DEFAULT 0,
  createdAt   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tạo bảng Strategy — Chiến thuật thi
CREATE TABLE `Strategy` (
  id        VARCHAR(255) PRIMARY KEY,
  title     VARCHAR(500) NOT NULL,
  slug      VARCHAR(255) NOT NULL UNIQUE,
  section   VARCHAR(100),
  content   TEXT,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Tạo bảng Question — Câu hỏi TOEIC
CREATE TABLE `Question` (
  id           VARCHAR(255) PRIMARY KEY,
  part         INT NOT NULL,                             -- 1-7
  passage      TEXT,
  groupId      VARCHAR(255),
  audioScript  TEXT,
  imagePrompt  TEXT,
  question     TEXT NOT NULL,
  options      TEXT NOT NULL,                            -- JSON array
  answer       INT NOT NULL,
  explanation  TEXT,
  difficulty   INT DEFAULT 2,
  category     VARCHAR(100),
  createdAt    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Tạo bảng TestSet — Bộ đề thi
CREATE TABLE `TestSet` (
  id          VARCHAR(255) PRIMARY KEY,
  title       VARCHAR(500) NOT NULL,
  description TEXT,
  durationMin INT DEFAULT 40,
  type        VARCHAR(50) DEFAULT 'mini',
  questionIds TEXT,                                      -- JSON array
  createdAt   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  12. TẠO DỮ LIỆU MẪU — Tài khoản với 3 quyền khác nhau
-- ============================================================

-- Cột role có 3 giá trị: STUDENT | INSTRUCTOR | ADMIN
-- Mật khẩu tất cả: 123456 (đã hash bcrypt)
-- Hash của '123456' = $2b$10$rGZ8qD6I8c6JF6Yq8eY8qK8mK (ví dụ)
-- ⚠️ Khi chạy thực tế, dùng lệnh Node.js bên dưới để tạo hash đúng

-- Tài khoản ADMIN (quản trị viên)
INSERT INTO `User` (id, email, name, passwordHash, role) 
VALUES ('admin_001', 'admin@toeic.com', 'Administrator', '$2b$10$placeholder_admin_hash', 'ADMIN');

-- Tài khoản INSTRUCTOR (giảng viên)
INSERT INTO `User` (id, email, name, passwordHash, role) 
VALUES ('instructor_001', 'teacher@toeic.com', 'Giảng Viên', '$2b$10$placeholder_instructor_hash', 'INSTRUCTOR');

-- Tài khoản STUDENT (học sinh)
INSERT INTO `User` (id, email, name, passwordHash, role) 
VALUES ('student_001', 'student@toeic.com', 'Học Sinh 1', '$2b$10$placeholder_student_hash', 'STUDENT');

-- Thêm vài học sinh nữa
INSERT INTO `User` (id, email, name, passwordHash, role) 
VALUES ('student_002', 'student2@toeic.com', 'Học Sinh 2', '$2b$10$placeholder_student_hash', 'STUDENT');

INSERT INTO `User` (id, email, name, passwordHash, role) 
VALUES ('student_003', 'student3@toeic.com', 'Học Sinh 3', '$2b$10$placeholder_student_hash', 'STUDENT');

-- 13. Kiểm tra dữ liệu
SELECT id, email, name, role, createdAt FROM `User`;

-- ============================================================
--  KẾT QUẢ MONG ĐỢI:
--  +----+----------------------+-------------+------------+---------------------+
--  | id | email                | name        | role       | createdAt           |
--  +----+----------------------+-------------+------------+---------------------+
--  | 1  | admin@toeic.com      | Administrator| ADMIN     | 2025-01-01 00:00:00 |
--  | 2  | teacher@toeic.com    | Giảng Viên  | INSTRUCTOR| 2025-01-01 00:00:00 |
--  | 3  | student@toeic.com    | Học Sinh 1  | STUDENT   | 2025-01-01 00:00:00 |
--  | 4  | student2@toeic.com   | Học Sinh 2  | STUDENT   | 2025-01-01 00:00:00 |
--  | 5  | student3@toeic.com   | Học Sinh 3  | STUDENT   | 2025-01-01 00:00:00 |
--  +----+----------------------+-------------+------------+---------------------+
-- ============================================================


-- ============================================================
--  ⚠️ QUAN TRỌNG — TẠO MẬT KHẨU ĐÚNG (bcrypt hash)
-- ============================================================
--  Hash ở trên là placeholder (giả). Khi chạy thực tế, bạn cần:
--
--  Cách 1: Dùng Node.js (khuyến nghị):
--  ----------------------------------------
--  node -e "console.log(require('bcryptjs').hashSync('admin123', 10))"
--  → Copy kết quả → UPDATE User SET passwordHash='kết_quả' WHERE email='admin@toeic.com'
--
--  Cách 2: Tạo admin bằng 1 lệnh (tự hash + insert):
--  ----------------------------------------
--  node -e "
--  const{PrismaClient}=require('@prisma/client');
--  const bcrypt=require('bcryptjs');
--  const p=new PrismaClient();
--  (async()=>{
--    // Admin
--    const h1=await bcrypt.hash('admin123',10);
--    await p.user.upsert({where:{email:'admin@toeic.com'},update:{role:'ADMIN',passwordHash:h1},create:{email:'admin@toeic.com',name:'Admin',passwordHash:h1,role:'ADMIN'}});
--    
--    // Instructor
--    const h2=await bcrypt.hash('123456',10);
--    await p.user.upsert({where:{email:'teacher@toeic.com'},update:{role:'INSTRUCTOR',passwordHash:h2},create:{email:'teacher@toeic.com',name:'Giảng Viên',passwordHash:h2,role:'INSTRUCTOR'}});
--    
--    // Student
--    const h3=await bcrypt.hash('123456',10);
--    await p.user.upsert({where:{email:'student@toeic.com'},update:{role:'STUDENT',passwordHash:h3},create:{email:'student@toeic.com',name:'Học Sinh',passwordHash:h3,role:'STUDENT'}});
--    
--    console.log('✅ Tất cả tài khoản đã tạo');
--    await p.$disconnect();
--  })();
--  "
-- ============================================================


-- ============================================================
--  TÓM TẮT TÀI KHOẢN
-- ============================================================
--  | Quyền       | Email              | Mật khẩu  | Giao diện              |
--  |-------------|--------------------|-----------|------------------------|
--  | ADMIN       | admin@toeic.com    | admin123  | Admin Panel (sidebar)  |
--  | INSTRUCTOR  | teacher@toeic.com  | 123456    | Giảng viên (xem HV)    |
--  | STUDENT     | student@toeic.com  | 123456    | Học viên (học + thi)   |
-- ============================================================

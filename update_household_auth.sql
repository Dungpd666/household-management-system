-- Migration: Update household authentication fields
-- Chạy file SQL này trực tiếp trong database của bạn

-- Bước 1: Xóa cột username (vì dùng household_code làm username)
ALTER TABLE households DROP COLUMN IF EXISTS username;

-- Bước 2: Đổi tên password_hash thành password (nếu tồn tại)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'households' AND column_name = 'password_hash'
    ) THEN
        ALTER TABLE households RENAME COLUMN password_hash TO password;
    END IF;
END $$;

-- Bước 3: Thêm cột password nếu chưa có
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'households' AND column_name = 'password'
    ) THEN
        ALTER TABLE households ADD COLUMN password VARCHAR;
    END IF;
END $$;

-- Bước 4: Thêm cột is_active
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'households' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE households ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
    END IF;
END $$;

-- Kiểm tra kết quả
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'households'
ORDER BY ordinal_position;

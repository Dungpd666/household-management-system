# Hướng dẫn chạy tests cho Backend

## Vấn đề kỹ thuật
PowerShell v5 trên Windows không hỗ trợ background process (`&`), nên cần chạy backend và test ở 2 terminal riêng.

## Cách 1: Chạy manual ở 2 terminal

### Terminal 1 — Backend:
```bash
npm run start
```

Đợi logs show `🚀 Server running on http://localhost:3000`

### Terminal 2 — Run tests:
```bash
node test-endpoints.js
```

Kết quả mong đợi: tất cả endpoints trả về status 200 hoặc 201.

---

## Cách 2: Dùng npm task (khuyến nghị)

### Terminal 1:
```bash
npm run start:dev
```

### Terminal 2:
```bash
npm test
```
(nếu test script được set up trong package.json)

---

## Kiến trúc Backend sau cải thiện

1. **TypeORM Synchronize** — Database auto-sync từ entities (tắt migrations requirement)
2. **@nestjs/schedule** — Module hỗ trợ scheduled tasks 
3. **CORS enabled** — Frontend ở localhost:5173 có thể gọi API
4. **Database schema** — 4 bảng chính:
   - `households` — Quản lý các hộ
   - `persons` — Thành viên hộ gia đình
   - `contributions` — Đóng góp/tiền  
   - `users` — Tài khoản admin

---

## Một số lỗi thường gặp

### "Unable to connect to the remote server"
- Kiểm tra backend bị crash hay stop: xem process `node` ở Task Manager
- Kiểm tra port 3000: `netstat -ano | Select-String "3000"`
- Kiểm tra .env config database

### "ECONNREFUSED"
- PostgreSQL không chạy: check `netstat -ano | Select-String "5432"`
- Database credentials sai ở .env

### "Cannot POST /household"
- DTO validation fail: check `src/household/dto/` DTOs
- Database constraint: check logs từ backend

---

## Troubleshoot

Xoá database cũ và tạo mới (nếu schema bị corrupt):
```bash
# 1. Đăng nhập PostgreSQL
psql -U postgres

# 2. Drop + recreate database
DROP DATABASE IF EXISTS household;
CREATE DATABASE household;

# 3. Restart backend — TypeORM sẽ auto-sync entities
npm run start
```

---

Với cấu hình hiện tại, backend sẵn sàng cho local dev + testing!

import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export default registerAs(
  'typeorm',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,

    // 👇 THÊM ĐOẠN NÀY ĐỂ FIX LỖI NEON (bật qua biến môi trường DB_SSL=true)
    ssl: process.env.DB_SSL === 'true',
    extra:
      process.env.DB_SSL === 'true'
        ? {
            ssl: {
              rejectUnauthorized: false, // Giúp bỏ qua lỗi chứng chỉ nếu có
            },
          }
        : undefined,
    // 👆 HẾT PHẦN THÊM

    autoLoadEntities: true,

    // ⚠️ LƯU Ý QUAN TRỌNG VỚI DB MỚI (NEON):
    // Vì DB trên Neon đang trống trơn, nếu bạn để synchronize: false
    // và chưa có file migration nào trong folder, thì app sẽ chạy nhưng KHÔNG có bảng nào được tạo.
    // Lần đầu chạy, bạn nên để true, hoặc chắc chắn rằng folder migrations đã có file.
    synchronize: false,

    migrationsRun: true,
    migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
  }),
);
